#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  copyDir,
  ensureDir,
  getFlag,
  parseSkillMarkdown,
  parseCliArgs,
  timestampId,
  writeJsonFile,
  writeTextFile,
} from '../shared/fs.mjs';
import { getDefaultLlmCommand } from '../shared/llm.mjs';
import {
  getSkillAuthoringRunDir,
  getSkillAuthoringRuntimeCacheRoot,
} from '../shared/workspace.mjs';
import {
  buildRuntimePaths,
  cleanupRuntimeWorkingState,
  pruneRuntimeArchive,
  shouldCleanupRuntimeArtifacts,
} from '../shared/runtime.mjs';
import { runContentIteration } from './run-iteration.mjs';
import { analyzeResults } from './analyze-results.mjs';
import { compareSummaries } from './compare-summaries.mjs';
import { refineSkill } from './refine-skill.mjs';
import { renderTimeline } from './render-timeline.mjs';
import { runTriggerLoop } from '../trigger/run-trigger-loop.mjs';

async function snapshotSkill(sourceDir, targetDir) {
  await copyDir(sourceDir, targetDir);
  return path.join(targetDir, 'SKILL.md');
}

function renderSimpleDiff(beforeText, afterText) {
  const beforeLines = beforeText.split('\n');
  const afterLines = afterText.split('\n');
  const maxLength = Math.max(beforeLines.length, afterLines.length);
  const lines = ['# Skill Diff', ''];

  for (let index = 0; index < maxLength; index += 1) {
    const beforeLine = beforeLines[index];
    const afterLine = afterLines[index];
    if (beforeLine === afterLine) {
      if (typeof beforeLine === 'string') {
        lines.push(`  ${beforeLine}`);
      }
      continue;
    }
    if (typeof beforeLine === 'string') {
      lines.push(`- ${beforeLine}`);
    }
    if (typeof afterLine === 'string') {
      lines.push(`+ ${afterLine}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function meaningfulProgress(currentSummary, previousSummary) {
  if (!previousSummary) return true;
  return (currentSummary.aggregate?.overallScore ?? 0) > (previousSummary.aggregate?.overallScore ?? 0) + 0.01;
}

function emitProgress(enabled, message) {
  if (!enabled) return;
  process.stderr.write(`[skill-authoring][loop] ${message}\n`);
}

function renderFinalSummary(runState) {
  const lastIteration = runState.iterations?.[runState.iterations.length - 1] ?? null;
  const lines = [
    `# Final Summary: ${runState.skillName}`,
    '',
    `- Stop reason: ${runState.stopReason}`,
    `- Iterations: ${runState.iterations?.length ?? 0}`,
    '',
  ];

  if (lastIteration) {
    lines.push(`- Final iteration status: ${lastIteration.status}`);
    if (typeof lastIteration.overallScore === 'number') {
      lines.push(`- Final overall score: ${lastIteration.overallScore.toFixed(3)}`);
    }
    if (lastIteration.triggerResultsPath) {
      lines.push(`- Trigger results: ${lastIteration.triggerResultsPath}`);
    }
    if (lastIteration.diagnosisPath) {
      lines.push(`- Diagnosis: ${lastIteration.diagnosisPath}`);
    }
    if (lastIteration.afterSkillPath) {
      lines.push(`- Final skill snapshot: ${lastIteration.afterSkillPath}`);
    } else if (lastIteration.candidateSkillPath) {
      lines.push(`- Final skill snapshot: ${lastIteration.candidateSkillPath}`);
    }
    lines.push('');
    if (lastIteration.note) {
      lines.push('## Notes');
      lines.push('');
      lines.push(lastIteration.note);
      lines.push('');
    }
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const evalSetPath = getFlag(flags, '--eval-set');
  const skillDir = getFlag(flags, '--skill-dir');
  const resultsDir = getFlag(flags, '--results-dir', getSkillAuthoringRunDir(timestampId(), process.cwd()));
  const runtimeRoot = getFlag(flags, '--runtime-root');
  const runtimeCacheRoot = getFlag(flags, '--runtime-cache-root', getSkillAuthoringRuntimeCacheRoot(process.cwd()));
  const keepRuntime = getFlag(flags, '--keep-runtime', 'failures');
  const pruneRuntime = getFlag(flags, '--prune-runtime-archive', 'true') !== 'false';
  const installCommand = getFlag(flags, '--install-command');
  const installCwd = getFlag(flags, '--install-cwd', process.cwd());
  const fingerprintPath = getFlag(flags, '--fingerprint-path');
  const opencodeBin = getFlag(flags, '--opencode-bin', 'opencode');
  const permissionProfile = getFlag(flags, '--permission-profile', 'strict');
  const maxIterations = Number(getFlag(flags, '--max-iterations', '3'));
  const llmCommand = getFlag(flags, '--llm-command', getDefaultLlmCommand());
  const baselineSkillDir = getFlag(flags, '--baseline-skill-dir');
  const useWithoutSkillBaseline = getFlag(flags, '--without-skill-baseline', 'false') === 'true';
  const triggerEvalSetPath = getFlag(flags, '--trigger-eval-set');
  const triggerIterations = Number(getFlag(flags, '--trigger-max-iterations', '5'));
  const contentTimeoutMs = Number(getFlag(flags, '--content-timeout-ms', '180000'));
  const contentStartupTimeoutMs = Number(getFlag(flags, '--content-startup-timeout-ms', '15000'));
  const contentInfrastructureRetries = Number(getFlag(flags, '--content-infrastructure-retries', '1'));
  const triggerTimeoutMs = Number(getFlag(flags, '--trigger-timeout-ms', '30000'));
  const triggerRunsPerQuery = Number(getFlag(flags, '--trigger-runs-per-query', '3'));
  const logProgress = getFlag(flags, '--log-progress', 'true') !== 'false';

  if (!evalSetPath || !skillDir || !runtimeRoot || !installCommand) {
    throw new Error(
      'Usage: node run-loop.mjs --eval-set <content-evals.json> --skill-dir <dir> --runtime-root <dir> --install-command <cmd>'
    );
  }

  await ensureDir(resultsDir);
  const initialSkillText = await fs.readFile(path.join(skillDir, 'SKILL.md'), 'utf8');
  const initialSkill = parseSkillMarkdown(initialSkillText);

  const runState = {
    skillName: initialSkill.name || path.basename(skillDir),
    startedAt: new Date().toISOString(),
    stopReason: 'in_progress',
    iterations: [],
  };

  let activeSkillDir = skillDir;
  let previousCandidateSummary = null;

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: preparing candidate`);
    const iterationDir = path.join(resultsDir, `iteration-${iteration}`);
    const candidateDir = path.join(iterationDir, 'candidate-skill');
    const baselineDir = baselineSkillDir ? path.join(iterationDir, 'baseline-skill') : null;
    await ensureDir(iterationDir);
    await copyDir(activeSkillDir, candidateDir);
    const beforeSkillText = await fs.readFile(path.join(candidateDir, 'SKILL.md'), 'utf8');
    await snapshotSkill(candidateDir, path.join(iterationDir, 'skill-before'));

    const candidateSummary = await runContentIteration({
      evalSpec: evalSetPath,
      evalSetPath,
      skillDir: candidateDir,
      runDir: path.join(iterationDir, 'candidate-run'),
      runtimeRoot,
      runtimeCacheRoot,
      installCommand,
      installCwd,
      fingerprintPath,
      opencodeBin,
      permissionProfile,
      configurationId: 'candidate',
      timeoutMs: contentTimeoutMs,
      startupTimeoutMs: contentStartupTimeoutMs,
      infrastructureRetryCount: contentInfrastructureRetries,
      logProgress,
    });
    emitProgress(
      logProgress,
      `iteration ${iteration}/${maxIterations}: candidate overall=${candidateSummary.aggregate.overallScore.toFixed(3)} status=${candidateSummary.aggregate.status}`,
    );
    await writeJsonFile(path.join(iterationDir, 'candidate-summary.json'), candidateSummary);
    await writeTextFile(path.join(iterationDir, 'candidate-summary.md'), JSON.stringify(candidateSummary.aggregate, null, 2));

    let baselineSummary = null;
    if (baselineSkillDir) {
      await snapshotSkill(baselineSkillDir, baselineDir);
      baselineSummary = await runContentIteration({
        evalSpec: evalSetPath,
        evalSetPath,
        skillDir: baselineDir,
        runDir: path.join(iterationDir, 'baseline-run'),
        runtimeRoot,
        runtimeCacheRoot,
        installCommand,
        installCwd,
        fingerprintPath,
        opencodeBin,
        permissionProfile,
        configurationId: 'baseline',
        timeoutMs: contentTimeoutMs,
        startupTimeoutMs: contentStartupTimeoutMs,
        infrastructureRetryCount: contentInfrastructureRetries,
        logProgress,
      });
      emitProgress(
        logProgress,
        `iteration ${iteration}/${maxIterations}: baseline overall=${baselineSummary.aggregate.overallScore.toFixed(3)} status=${baselineSummary.aggregate.status}`,
      );
      await writeJsonFile(path.join(iterationDir, 'baseline-summary.json'), baselineSummary);
    } else if (useWithoutSkillBaseline) {
      baselineSummary = await runContentIteration({
        evalSpec: evalSetPath,
        evalSetPath,
        skillDir: null,
        runDir: path.join(iterationDir, 'baseline-run'),
        runtimeRoot,
        runtimeCacheRoot,
        installCommand,
        installCwd,
        fingerprintPath,
        opencodeBin,
        permissionProfile,
        configurationId: 'without_skill',
        timeoutMs: contentTimeoutMs,
        startupTimeoutMs: contentStartupTimeoutMs,
        infrastructureRetryCount: contentInfrastructureRetries,
        logProgress,
      });
      emitProgress(
        logProgress,
        `iteration ${iteration}/${maxIterations}: without-skill baseline overall=${baselineSummary.aggregate.overallScore.toFixed(3)} status=${baselineSummary.aggregate.status}`,
      );
      await writeJsonFile(path.join(iterationDir, 'baseline-summary.json'), baselineSummary);
    }
    if (baselineSummary) {
      const comparison = compareSummaries(candidateSummary, baselineSummary);
      await writeJsonFile(path.join(iterationDir, 'comparison.json'), comparison);
    }

    const skillText = await fs.readFile(path.join(candidateDir, 'SKILL.md'), 'utf8');
    const analysis = await analyzeResults({
      skillText,
      summary: candidateSummary,
      baselineSummary,
      llmCommand,
    });
    await writeJsonFile(path.join(iterationDir, 'diagnosis.json'), analysis.diagnosis);
    await writeTextFile(path.join(iterationDir, 'analyzer-prompt.md'), analysis.prompt);

    const iterationState = {
      iteration,
      status: candidateSummary.aggregate.status,
      overallScore: candidateSummary.aggregate.overallScore,
      summaryPath: path.join(iterationDir, 'candidate-summary.json'),
      diagnosisPath: path.join(iterationDir, 'diagnosis.json'),
      candidateSkillPath: path.join(candidateDir, 'SKILL.md'),
      beforeSkillPath: path.join(iterationDir, 'skill-before', 'SKILL.md'),
      note: analysis.diagnosis.executiveSummary,
    };
    runState.iterations.push(iterationState);
    await writeJsonFile(path.join(resultsDir, 'run.json'), runState);
    await writeTextFile(path.join(resultsDir, 'timeline.md'), renderTimeline(runState));

    if (
      candidateSummary.aggregate.status === 'INFRA_ERROR' ||
      baselineSummary?.aggregate?.status === 'INFRA_ERROR'
    ) {
      emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: content runtime infrastructure failure`);
      runState.stopReason = 'content_runtime_error';
      await writeJsonFile(path.join(resultsDir, 'run.json'), runState);
      await writeTextFile(path.join(resultsDir, 'timeline.md'), renderTimeline(runState));
      break;
    }

    if (triggerEvalSetPath && candidateSummary.aggregate.status === 'PASS') {
      emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: starting trigger loop`);
      const candidateDescription = parseSkillMarkdown(skillText).description;
      const triggerResults = await runTriggerLoop({
        evalSet: triggerEvalSetPath,
        skillDir: candidateDir,
        resultsDir: path.join(iterationDir, 'trigger-loop'),
        runtimeRoot,
        runtimeCacheRoot,
        installCommand,
        installCwd,
        llmCommand,
        opencodeBin,
        agent: 'ask',
        permissionProfile,
        maxIterations: triggerIterations,
        runsPerQuery: triggerRunsPerQuery,
        threshold: 0.5,
        holdout: 0.4,
        applyBestDescription: Boolean(llmCommand),
        timeoutMs: triggerTimeoutMs,
      });
      iterationState.triggerResultsPath = path.join(iterationDir, 'trigger-loop', 'results.json');
      iterationState.triggerExitReason = triggerResults.exitReason;
      iterationState.triggerEffectiveRunsPerQuery = triggerResults.effectiveRunsPerQuery;
      iterationState.note = `${iterationState.note} Trigger best: ${triggerResults.bestScore ?? 'n/a'}`.trim();
      if (triggerResults.usedTimeoutFallback) {
        iterationState.note = `${iterationState.note} Timeout fallback -> runs/query ${triggerResults.effectiveRunsPerQuery}.`.trim();
      }

      if (llmCommand && triggerResults.bestDescription && triggerResults.bestDescription !== candidateDescription) {
        await snapshotSkill(candidateDir, path.join(iterationDir, 'skill-after-trigger'));
        iterationState.afterSkillPath = path.join(iterationDir, 'skill-after-trigger', 'SKILL.md');
      }

      if (triggerResults.exitReason !== 'passed_threshold') {
        emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: trigger loop exit=${triggerResults.exitReason}`);
        runState.stopReason = triggerResults.exitReason;
        await writeJsonFile(path.join(resultsDir, 'run.json'), runState);
        await writeTextFile(path.join(resultsDir, 'timeline.md'), renderTimeline(runState));
        break;
      }
    }

    if (candidateSummary.aggregate.status === 'PASS') {
      emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: passed threshold`);
      runState.stopReason = 'passed_threshold';
      break;
    }

    if (!llmCommand) {
      runState.stopReason = 'llm_command_missing';
      break;
    }

    if (!meaningfulProgress(candidateSummary, previousCandidateSummary) && previousCandidateSummary) {
      runState.stopReason = 'no_meaningful_progress';
      break;
    }

    const refinement = await refineSkill({
      skillText,
      diagnosis: analysis.diagnosis,
      llmCommand,
    });
    await writeTextFile(path.join(iterationDir, 'refiner-prompt.md'), refinement.prompt);

    if (!refinement.updatedSkill || refinement.updatedSkill.trim() === skillText.trim()) {
      runState.stopReason = 'no_meaningful_progress';
      break;
    }

    const nextSkillDir = path.join(iterationDir, 'refined-skill');
    emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: applying refinement`);
    await copyDir(candidateDir, nextSkillDir);
    await fs.writeFile(path.join(nextSkillDir, 'SKILL.md'), `${refinement.updatedSkill}\n`, 'utf8');
    await snapshotSkill(nextSkillDir, path.join(iterationDir, 'skill-after'));
    await writeTextFile(path.join(iterationDir, 'skill.diff'), renderSimpleDiff(beforeSkillText, refinement.updatedSkill));
    iterationState.afterSkillPath = path.join(iterationDir, 'skill-after', 'SKILL.md');

    if (triggerEvalSetPath) {
      emitProgress(logProgress, `iteration ${iteration}/${maxIterations}: trigger loop on refined skill`);
      const triggerResults = await runTriggerLoop({
        evalSet: triggerEvalSetPath,
        skillDir: nextSkillDir,
        resultsDir: path.join(iterationDir, 'trigger-loop'),
        runtimeRoot,
        runtimeCacheRoot,
        installCommand,
        installCwd,
        llmCommand,
        opencodeBin,
        agent: 'ask',
        permissionProfile,
        maxIterations: triggerIterations,
        runsPerQuery: triggerRunsPerQuery,
        threshold: 0.5,
        holdout: 0.4,
        applyBestDescription: true,
        timeoutMs: triggerTimeoutMs,
      });
      iterationState.triggerResultsPath = path.join(iterationDir, 'trigger-loop', 'results.json');
      iterationState.triggerExitReason = triggerResults.exitReason;
      iterationState.triggerEffectiveRunsPerQuery = triggerResults.effectiveRunsPerQuery;
      iterationState.note = `${iterationState.note} Trigger best: ${triggerResults.bestScore ?? 'n/a'}`.trim();
      if (triggerResults.usedTimeoutFallback) {
        iterationState.note = `${iterationState.note} Timeout fallback -> runs/query ${triggerResults.effectiveRunsPerQuery}.`.trim();
      }
    }

    activeSkillDir = nextSkillDir;
    previousCandidateSummary = candidateSummary;

    if (iteration === maxIterations) {
      runState.stopReason = 'max_iterations';
    }
  }

  if (runState.stopReason === 'in_progress') {
    runState.stopReason = 'max_iterations';
  }

  await writeJsonFile(path.join(resultsDir, 'run.json'), runState);
  await writeTextFile(path.join(resultsDir, 'timeline.md'), renderTimeline(runState));
  await writeTextFile(path.join(resultsDir, 'final-summary.md'), renderFinalSummary(runState));
  const runtime = buildRuntimePaths(path.resolve(runtimeRoot));
  if (shouldCleanupRuntimeArtifacts(keepRuntime, runState.stopReason === 'passed_threshold')) {
    await cleanupRuntimeWorkingState(runtime);
  } else if (pruneRuntime) {
    await pruneRuntimeArchive(runtime);
  }
  emitProgress(logProgress, `finished with stopReason=${runState.stopReason}`);
  process.stdout.write(`${JSON.stringify(runState, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`run-loop failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
