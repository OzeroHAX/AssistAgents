#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  copyDir,
  ensureDir,
  getFlag,
  getSkillTestsDir,
  parseCliArgs,
  parseSkillMarkdown,
  pathExists,
  resolveSkillEntry,
  timestampId,
  writeJsonFile,
  writeTextFile,
} from '../shared/fs.mjs';
import { getDefaultLlmCommand } from '../shared/llm.mjs';
import {
  getSkillAuthoringRuntimeCacheRoot,
  getSkillAuthoringTestRunDir,
} from '../shared/workspace.mjs';
import {
  buildRuntimePaths,
  cleanupRuntimeWorkingState,
  pruneRuntimeArchive,
  shouldCleanupRuntimeArtifacts,
} from '../shared/runtime.mjs';
import { refineSkill } from './refine-skill.mjs';
import { buildStaticValidation, renderStaticValidationMarkdown } from './validate-skill.mjs';
import { runTriggerEval } from '../trigger/run-trigger-eval.mjs';

function emitProgress(enabled, message) {
  if (!enabled) return;
  process.stderr.write(`[skill-authoring][report] ${message}\n`);
}

function renderSimpleDiff(beforeText, afterText) {
  const beforeLines = beforeText.split('\n');
  const afterLines = afterText.split('\n');
  const maxLength = Math.max(beforeLines.length, afterLines.length);
  const lines = ['# Suggested Skill Diff', ''];

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

function mergeDiagnosis({ staticValidation, triggerResults }) {
  const rootCauses = [];
  const changeTargets = new Set();
  const changePlan = [];

  if (staticValidation.status !== 'PASS') {
    changeTargets.add('body');
    rootCauses.push({
      id: 'static-validation-failures',
      severity: 'medium',
      evidence: staticValidation.findings,
      recommendation: 'Fix structural and metadata issues before trusting runtime eval results.',
    });
    changePlan.push({
      priority: changePlan.length + 1,
      target: 'body',
      action: 'Repair the missing sections and metadata issues listed in static validation.',
    });
  }

  if (triggerResults && triggerResults.summary.failed > 0) {
    changeTargets.add('description');
    rootCauses.push({
      id: 'trigger-failures',
      severity: 'high',
      evidence: triggerResults.results
        .filter((item) => !item.pass)
        .map((item) => `${item.shouldTrigger ? 'false negative' : 'false positive'}: ${item.query}`),
      recommendation: 'Narrow or sharpen the frontmatter description so trigger boundaries are explicit.',
    });
    changePlan.push({
      priority: changePlan.length + 1,
      target: 'description',
      action: 'Rewrite the description to improve trigger precision and recall without widening scope.',
    });
  }

  const stopOrContinue = rootCauses.length === 0 ? 'stop' : 'continue';
  const executiveSummary = stopOrContinue === 'stop'
    ? 'The skill passed static validation and the configured isolated checks.'
    : 'The skill needs improvement; see structural, trigger, and runtime findings below.';

  return {
    executiveSummary,
    changeTargets: Array.from(changeTargets),
    rootCauses,
    changePlan,
    stopOrContinue,
  };
}

function renderFinalSummary(report) {
  const lines = [
    `# Skill Report: ${report.skill.name}`,
    '',
    `- Source skill: ${report.skill.source}`,
    `- Static validation: ${report.staticValidation.status}`,
  ];

  if (report.triggerResults) {
    lines.push(`- Trigger pass rate: ${report.triggerResults.summary.passed}/${report.triggerResults.summary.total}`);
  } else {
    lines.push('- Trigger status: skipped');
  }

  lines.push(`- Suggested candidate written: ${report.suggestedCandidatePath ? 'yes' : 'no'}`);
  lines.push('');

  if (report.diagnosis.rootCauses.length > 0) {
    lines.push('## Main findings', '');
    for (const cause of report.diagnosis.rootCauses) {
      lines.push(`- ${cause.id}: ${cause.recommendation}`);
    }
    lines.push('');
  }

  if (report.suggestedCandidatePath) {
    lines.push('## Suggested candidate');
    lines.push('');
    lines.push(`- Candidate: ${report.suggestedCandidatePath}`);
    lines.push(`- Diff: ${report.suggestedDiffPath}`);
    lines.push('');
  }

  lines.push('## Recommendation');
  lines.push('');
  lines.push(
    report.diagnosis.stopOrContinue === 'stop'
      ? 'The source skill is acceptable for now.'
      : 'Review the proposed changes manually. Replace the source skill only if you agree with the suggested diff.',
  );
  lines.push('');

  return `${lines.join('\n')}\n`;
}

async function snapshotSkill(skillDir, targetDir) {
  await copyDir(skillDir, targetDir);
}

async function resolveOptionalTestFile(explicitPath, skillDir, fileName) {
  if (explicitPath) {
    return path.resolve(explicitPath);
  }

  const candidate = path.join(getSkillTestsDir(skillDir), fileName);
  return (await pathExists(candidate)) ? candidate : null;
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const target = getFlag(flags, '--skill') ?? getFlag(flags, '--skill-dir');
  const triggerEvalPathFlag = getFlag(flags, '--trigger-evals');
  const installCommand = getFlag(flags, '--install-command');
  const installCwd = getFlag(flags, '--install-cwd', process.cwd());
  const opencodeBin = getFlag(flags, '--opencode-bin', 'opencode');
  const permissionProfile = getFlag(flags, '--permission-profile', 'strict');
  const keepRuntime = getFlag(flags, '--keep-runtime', 'failures');
  const pruneRuntime = getFlag(flags, '--prune-runtime-archive', 'true') !== 'false';
  const llmCommand = getFlag(flags, '--llm-command', getDefaultLlmCommand());
  const writeSuggestedCandidate = getFlag(flags, '--write-suggested-candidate', 'true') !== 'false';
  const logProgress = getFlag(flags, '--log-progress', 'true') !== 'false';
  const triggerTimeoutMs = Number(getFlag(flags, '--trigger-timeout-ms', '30000'));
  const triggerRunsPerQuery = Number(getFlag(flags, '--trigger-runs-per-query', '3'));
  const runtimeCacheRoot = getFlag(flags, '--runtime-cache-root', getSkillAuthoringRuntimeCacheRoot(process.cwd()));

  if (!target) {
    throw new Error('Usage: node run-report.mjs --skill <skill-dir-or-SKILL.md> --install-command <cmd>');
  }

  const entry = resolveSkillEntry(target);
  const parsed = parseSkillMarkdown(await fs.readFile(entry.skillFile, 'utf8'));
  const runId = `${timestampId()}-${parsed.name}-report`;
  const resultsDir = getFlag(flags, '--results-dir', getSkillAuthoringTestRunDir(runId, process.cwd()));
  const runtimeRoot = getFlag(flags, '--runtime-root', path.join(resultsDir, 'runtime'));

  await ensureDir(resultsDir);
  await snapshotSkill(entry.skillDir, path.join(resultsDir, 'source-skill'));

  const staticValidation = buildStaticValidation(await fs.readFile(entry.skillFile, 'utf8'), entry.skillFile);
  await writeJsonFile(path.join(resultsDir, 'validation.json'), staticValidation);
  await writeTextFile(path.join(resultsDir, 'validation.md'), renderStaticValidationMarkdown(staticValidation));

  const triggerEvalPath = await resolveOptionalTestFile(triggerEvalPathFlag, entry.skillDir, 'trigger-evals.json');

  let triggerResults = null;
  let suggestedCandidatePath = null;
  let suggestedDiffPath = null;
  const usedRuntimeRoots = new Set();

  if (triggerEvalPath) {
    if (!installCommand) {
      throw new Error('An install command is required when trigger evals are enabled.');
    }

    emitProgress(logProgress, `running trigger eval from ${triggerEvalPath}`);
    const triggerEvalSpec = JSON.parse(await fs.readFile(triggerEvalPath, 'utf8'));
    triggerResults = await runTriggerEval({
      evalSet: triggerEvalSpec,
      skillDir: entry.skillDir,
      runDir: path.join(resultsDir, 'trigger'),
      runtimeRoot: path.join(runtimeRoot, 'trigger'),
      runtimeCacheRoot,
      installCommand,
      installCwd,
      opencodeBin,
      permissionProfile,
      threshold: Number(triggerEvalSpec.threshold ?? 0.5),
      runsPerQuery: triggerRunsPerQuery || Number(triggerEvalSpec.runsPerQuery ?? 3),
      timeoutMs: triggerTimeoutMs,
      logProgress,
    });
    usedRuntimeRoots.add(path.resolve(path.join(runtimeRoot, 'trigger')));
  }

  const diagnosis = mergeDiagnosis({
    staticValidation,
    triggerResults,
  });
  await writeJsonFile(path.join(resultsDir, 'diagnosis.json'), diagnosis);

  if (writeSuggestedCandidate && llmCommand && diagnosis.stopOrContinue !== 'stop') {
    emitProgress(logProgress, 'generating suggested candidate in run directory');
    const skillText = await fs.readFile(entry.skillFile, 'utf8');
    const refinement = await refineSkill({
      skillText,
      diagnosis,
      llmCommand,
    });
    await writeTextFile(path.join(resultsDir, 'refiner-prompt.md'), refinement.prompt);
    if (refinement.responseText) {
      await writeTextFile(path.join(resultsDir, 'refiner-response.md'), refinement.responseText);
    }
    if (refinement.updatedSkill) {
      suggestedCandidatePath = path.join(resultsDir, 'suggested-skill', 'SKILL.md');
      suggestedDiffPath = path.join(resultsDir, 'suggested-skill.diff.md');
      await writeTextFile(suggestedCandidatePath, `${refinement.updatedSkill}\n`);
      await writeTextFile(suggestedDiffPath, renderSimpleDiff(skillText, refinement.updatedSkill));
    }
  }

  const report = {
    skill: {
      name: parsed.name,
      source: path.resolve(entry.skillFile),
      testsDir: await pathExists(getSkillTestsDir(entry.skillDir)) ? path.resolve(getSkillTestsDir(entry.skillDir)) : null,
    },
    staticValidation,
    triggerResults,
    diagnosis,
    suggestedCandidatePath,
    suggestedDiffPath,
  };

  await writeJsonFile(path.join(resultsDir, 'run.json'), report);
  await writeTextFile(path.join(resultsDir, 'final-summary.md'), renderFinalSummary(report));

  const success =
    staticValidation.status === 'PASS' &&
    (!triggerResults || (triggerResults.summary.failed === 0 && triggerResults.summary.timedOutAttempts === 0));

  for (const runtimeRootPath of usedRuntimeRoots) {
    const runtime = buildRuntimePaths(runtimeRootPath);
    if (shouldCleanupRuntimeArtifacts(keepRuntime, success)) {
      await cleanupRuntimeWorkingState(runtime);
    } else if (pruneRuntime) {
      await pruneRuntimeArchive(runtime);
    }
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`run-report failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
