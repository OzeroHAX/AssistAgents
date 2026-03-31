#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  copyDir,
  ensureDir,
  getFlag,
  parseCliArgs,
  parseSkillMarkdown,
  readJsonFile,
  replaceFrontmatterField,
  timestampId,
  writeJsonFile,
  writeTextFile,
} from '../shared/fs.mjs';
import { getDefaultLlmCommand } from '../shared/llm.mjs';
import {
  getSkillAuthoringRunDir,
  getSkillAuthoringRuntimeCacheRoot,
} from '../shared/workspace.mjs';
import { improveDescription } from './improve-description.mjs';
import { runTriggerEval } from './run-trigger-eval.mjs';
import {
  buildRuntimePaths,
  cleanupRuntimeWorkingState,
  pruneRuntimeArchive,
  shouldCleanupRuntimeArtifacts,
} from '../shared/runtime.mjs';

function splitEvalSet(evalItems, holdout) {
  const positive = evalItems.filter((item) => Boolean(item.shouldTrigger));
  const negative = evalItems.filter((item) => !item.shouldTrigger);
  const testPositive = positive.slice(0, Math.max(1, Math.floor(positive.length * holdout)));
  const testNegative = negative.slice(0, Math.max(1, Math.floor(negative.length * holdout)));
  const test = [...testPositive, ...testNegative];
  const train = evalItems.filter((item) => !test.includes(item));
  return { train, test };
}

async function createSkillCandidate(sourceSkillDir, destinationDir, description) {
  await copyDir(sourceSkillDir, destinationDir);
  const skillPath = path.join(destinationDir, 'SKILL.md');
  const skillText = await fs.readFile(skillPath, 'utf8');
  const updated = replaceFrontmatterField(skillText, 'description', description);
  await fs.writeFile(skillPath, updated, 'utf8');
}

export function triggerEvalNeedsFallback(result, requestedRunsPerQuery, fallbackRunsPerQuery = 1) {
  return (
    requestedRunsPerQuery > fallbackRunsPerQuery &&
    (result?.summary?.timedOutAttempts ?? 0) > 0
  );
}

export async function runAdaptiveTriggerEval(options) {
  const runEval = options.runEval ?? runTriggerEval;
  const primary = await runEval({
    evalSet: options.evalSet,
    skillDir: options.skillDir,
    runDir: options.runDir,
    runtimeRoot: options.runtimeRoot,
    installCommand: options.installCommand,
    installCwd: options.installCwd,
    opencodeBin: options.opencodeBin,
    agent: options.agent,
    permissionProfile: options.permissionProfile,
      threshold: options.threshold,
      runsPerQuery: options.runsPerQuery,
      timeoutMs: options.timeoutMs ?? 30_000,
    });

  let fallback = null;
  let effective = primary;
  const fallbackRunsPerQuery = options.fallbackRunsPerQuery ?? 1;
  const usedFallback = triggerEvalNeedsFallback(primary, options.runsPerQuery, fallbackRunsPerQuery);

  if (usedFallback) {
    fallback = await runEval({
      evalSet: options.evalSet,
      skillDir: options.skillDir,
      runDir: `${options.runDir}-runs${fallbackRunsPerQuery}`,
      runtimeRoot: options.runtimeRoot,
      runtimeCacheRoot: options.runtimeCacheRoot,
      installCommand: options.installCommand,
      installCwd: options.installCwd,
      opencodeBin: options.opencodeBin,
      agent: options.agent,
      permissionProfile: options.permissionProfile,
      threshold: options.threshold,
      runsPerQuery: fallbackRunsPerQuery,
      timeoutMs: options.timeoutMs ?? 30_000,
    });
    effective = fallback;
  }

  return {
    primary,
    fallback,
    effective,
    usedFallback,
    requestedRunsPerQuery: options.runsPerQuery,
    effectiveRunsPerQuery: effective.runsPerQuery,
  };
}

export async function runTriggerLoop(options) {
  await ensureDir(options.resultsDir);

  const evalSetRaw = typeof options.evalSet === 'string' ? await readJsonFile(options.evalSet) : options.evalSet;
  const evalItems = Array.isArray(evalSetRaw) ? evalSetRaw : (evalSetRaw.queries ?? []);
  const skillText = await fs.readFile(path.join(options.skillDir, 'SKILL.md'), 'utf8');
  const parsed = parseSkillMarkdown(skillText);
  const split = options.holdout > 0 ? splitEvalSet(evalItems, options.holdout) : { train: evalItems, test: [] };
  const history = [];
  let currentDescription = parsed.description;
  let exitReason = 'max_iterations';
  let usedTimeoutFallback = false;
  let effectiveRunsPerQuery = options.runsPerQuery;

  for (let iteration = 1; iteration <= options.maxIterations; iteration += 1) {
    const iterationDir = path.join(options.resultsDir, `iteration-${iteration}`);
    const candidateSkillDir = path.join(iterationDir, 'skill');
    await ensureDir(iterationDir);
    await createSkillCandidate(options.skillDir, candidateSkillDir, currentDescription);

    const trainEval = await runAdaptiveTriggerEval({
      evalSet: split.train,
      skillDir: candidateSkillDir,
      runDir: path.join(iterationDir, 'train'),
      runtimeRoot: options.runtimeRoot,
      runtimeCacheRoot: options.runtimeCacheRoot,
      installCommand: options.installCommand,
      installCwd: options.installCwd,
      opencodeBin: options.opencodeBin,
      agent: options.agent,
      permissionProfile: options.permissionProfile,
      threshold: options.threshold,
      runsPerQuery: options.runsPerQuery,
      fallbackRunsPerQuery: options.fallbackRunsPerQuery ?? 1,
      timeoutMs: options.timeoutMs,
    });
    const trainResults = trainEval.effective;
    const testEval = split.test.length > 0
      ? await runAdaptiveTriggerEval({
        evalSet: split.test,
        skillDir: candidateSkillDir,
        runDir: path.join(iterationDir, 'test'),
        runtimeRoot: options.runtimeRoot,
        installCommand: options.installCommand,
        installCwd: options.installCwd,
        opencodeBin: options.opencodeBin,
        agent: options.agent,
        permissionProfile: options.permissionProfile,
        threshold: options.threshold,
        runsPerQuery: options.runsPerQuery,
        fallbackRunsPerQuery: options.fallbackRunsPerQuery ?? 1,
        timeoutMs: options.timeoutMs,
      })
      : null;
    const testResults = testEval?.effective ?? null;
    usedTimeoutFallback = usedTimeoutFallback || trainEval.usedFallback || Boolean(testEval?.usedFallback);
    effectiveRunsPerQuery = Math.min(
      effectiveRunsPerQuery,
      trainEval.effectiveRunsPerQuery,
      testEval?.effectiveRunsPerQuery ?? trainEval.effectiveRunsPerQuery,
    );

    history.push({
      iteration,
      description: currentDescription,
      trainScore: `${trainResults.summary.passed}/${trainResults.summary.total}`,
      testScore: testResults ? `${testResults.summary.passed}/${testResults.summary.total}` : null,
      trainRunsPerQuery: trainResults.runsPerQuery,
      testRunsPerQuery: testResults?.runsPerQuery ?? null,
      trainTimedOutAttempts: trainResults.summary.timedOutAttempts,
      testTimedOutAttempts: testResults?.summary.timedOutAttempts ?? 0,
      trainUsedFallback: trainEval.usedFallback,
      testUsedFallback: Boolean(testEval?.usedFallback),
      trainResults: trainResults.results,
      testResults: testResults?.results ?? null,
      candidateSkillDir,
    });

    if ((trainResults.summary.timedOutAttempts ?? 0) > 0 || (testResults?.summary.timedOutAttempts ?? 0) > 0) {
      exitReason = 'trigger_eval_timeout';
      break;
    }

    if (trainResults.summary.failed === 0) {
      exitReason = 'passed_threshold';
      break;
    }

    if (!options.llmCommand) {
      exitReason = 'llm_command_missing';
      break;
    }

    const improvement = await improveDescription({
      skillName: parsed.name,
      currentDescription,
      skillBody: parsed.body,
      evalResults: trainResults,
      history: history.map((item) => ({
        description: item.description,
        score: item.testScore ?? item.trainScore,
      })),
      llmCommand: options.llmCommand,
    });

    await writeJsonFile(path.join(iterationDir, 'improvement.json'), improvement);

    if (!improvement.description || improvement.description === currentDescription) {
      exitReason = 'no_meaningful_progress';
      break;
    }

    currentDescription = improvement.description;
  }

  const best = history.reduce((currentBest, candidate) => {
    const currentScore = currentBest
      ? Number((currentBest.testScore ?? currentBest.trainScore).split('/')[0])
      : -1;
    const candidateScore = Number((candidate.testScore ?? candidate.trainScore).split('/')[0]);
    return candidateScore > currentScore ? candidate : currentBest;
  }, null);

  const output = {
    skillName: parsed.name,
    originalDescription: parsed.description,
    finalDescription: currentDescription,
    bestDescription: best?.description ?? currentDescription,
    bestScore: best?.testScore ?? best?.trainScore ?? null,
    iterationsRun: history.length,
    holdout: options.holdout,
    requestedRunsPerQuery: options.runsPerQuery,
    effectiveRunsPerQuery,
    usedTimeoutFallback,
    resultsDir: options.resultsDir,
    exitReason,
    history,
  };

  await writeJsonFile(path.join(options.resultsDir, 'results.json'), output);
  await writeTextFile(
    path.join(options.resultsDir, 'timeline.md'),
    [
      `# Trigger Loop: ${parsed.name}`,
      '',
      `- Exit reason: ${exitReason}`,
      `- Iterations: ${history.length}`,
      `- Best score: ${output.bestScore ?? 'n/a'}`,
      '',
      ...history.flatMap((item) => [
        `## Iteration ${item.iteration}`,
        '',
        `- Description: ${item.description}`,
        `- Train: ${item.trainScore}`,
        `- Train runs/query: ${item.trainRunsPerQuery}`,
        `- Train timed out attempts: ${item.trainTimedOutAttempts}`,
        item.trainUsedFallback ? '- Train fallback: used' : '- Train fallback: not used',
        item.testScore ? `- Test: ${item.testScore}` : '- Test: none',
        item.testScore ? `- Test runs/query: ${item.testRunsPerQuery}` : '- Test runs/query: none',
        item.testScore ? `- Test timed out attempts: ${item.testTimedOutAttempts}` : '- Test timed out attempts: none',
        item.testScore ? (item.testUsedFallback ? '- Test fallback: used' : '- Test fallback: not used') : '- Test fallback: none',
        '',
      ]),
    ].join('\n')
  );

  if (options.applyBestDescription) {
    const targetSkillPath = path.join(options.skillDir, 'SKILL.md');
    const targetSkillText = await fs.readFile(targetSkillPath, 'utf8');
    const updated = replaceFrontmatterField(targetSkillText, 'description', output.bestDescription ?? currentDescription);
    await fs.writeFile(targetSkillPath, updated, 'utf8');
  }

  return output;
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const evalSetPath = getFlag(flags, '--eval-set');
  const skillDir = getFlag(flags, '--skill-dir');
  const resultsDir = getFlag(
    flags,
    '--results-dir',
    getSkillAuthoringRunDir(`trigger-${timestampId()}`, process.cwd()),
  );
  const runtimeRoot = getFlag(flags, '--runtime-root');
  const installCommand = getFlag(flags, '--install-command');
  const installCwd = getFlag(flags, '--install-cwd', process.cwd());
  const runtimeCacheRoot = getFlag(flags, '--runtime-cache-root', getSkillAuthoringRuntimeCacheRoot(process.cwd()));
  const keepRuntime = getFlag(flags, '--keep-runtime', 'failures');
  const pruneRuntime = getFlag(flags, '--prune-runtime-archive', 'true') !== 'false';
  const llmCommand = getFlag(flags, '--llm-command', getDefaultLlmCommand());
  const opencodeBin = getFlag(flags, '--opencode-bin', 'opencode');
  const agent = getFlag(flags, '--agent', 'ask');
  const permissionProfile = getFlag(flags, '--permission-profile', 'strict');
  const maxIterations = Number(getFlag(flags, '--max-iterations', '5'));
  const runsPerQuery = Number(getFlag(flags, '--runs-per-query', '3'));
  const threshold = Number(getFlag(flags, '--threshold', '0.5'));
  const holdout = Number(getFlag(flags, '--holdout', '0.4'));
  const fallbackRunsPerQuery = Number(getFlag(flags, '--fallback-runs-per-query', '1'));
  const timeoutMs = Number(getFlag(flags, '--timeout-ms', '30000'));

  if (!evalSetPath || !skillDir || !runtimeRoot || !installCommand) {
    throw new Error(
      'Usage: node run-trigger-loop.mjs --eval-set <trigger-evals.json> --skill-dir <dir> --runtime-root <dir> --install-command <cmd>'
    );
  }

  const output = await runTriggerLoop({
    evalSet: evalSetPath,
    skillDir,
    resultsDir,
    runtimeRoot,
    runtimeCacheRoot,
    installCommand,
    installCwd,
    llmCommand,
    opencodeBin,
    agent,
    permissionProfile,
    maxIterations,
    runsPerQuery,
    threshold,
    holdout,
    fallbackRunsPerQuery,
    timeoutMs,
  });

  const runtime = buildRuntimePaths(path.resolve(runtimeRoot));
  if (shouldCleanupRuntimeArtifacts(keepRuntime, output.exitReason === 'passed_threshold')) {
    await cleanupRuntimeWorkingState(runtime);
  } else if (pruneRuntime) {
    await pruneRuntimeArchive(runtime);
  }
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`run-trigger-loop failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
