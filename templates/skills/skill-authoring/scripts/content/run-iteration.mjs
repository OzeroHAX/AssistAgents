#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  cleanupWorkspaceTransientState,
  discoverSkillNames,
  ensureDir,
  getFlag,
  initWorkspaceOpencodeRoot,
  initGitRoot,
  overlaySkillIntoWorkspace,
  parseCliArgs,
  parseSkillMarkdown,
  readJsonFile,
  remapPathIntoWorkspace,
  resolveRepoPath,
  timestampId,
  writeJsonFile,
  writeTextFile,
  copyDir,
} from '../shared/fs.mjs';
import {
  buildRuntimePaths,
  cleanupRuntimeWorkingState,
  createRuntimeEnv,
  decideRuntimeInstall,
  prepareRuntimeBase,
  prepareRuntimeDirs,
  pruneRuntimeArchive,
  resetRuntimeWorkingState,
  shouldCleanupRuntimeArtifacts,
} from '../shared/runtime.mjs';
import { parseEventText } from '../shared/parse-events.mjs';
import { judgeRouting } from './score-routing.mjs';
import { judgeAssertions } from './score-assertions.mjs';
import { lintSkillFile } from './score-lint.mjs';
import { runCommand } from '../shared/fs.mjs';
import { getSkillAuthoringRuntimeCacheRoot } from '../shared/workspace.mjs';

function resolveFromEvalRoot(evalRoot, targetPath) {
  return resolveRepoPath(targetPath, evalRoot);
}

function emitProgress(enabled, message) {
  if (!enabled) return;
  process.stderr.write(`[skill-authoring][content] ${message}\n`);
}

function buildMarkdownSummary(summary) {
  const lines = [
    `# Iteration Summary: ${summary.skillName} (${summary.configurationId})`,
    '',
    `- Status: ${summary.aggregate.status}`,
    `- Overall score: ${summary.aggregate.overallScore.toFixed(3)}`,
    `- Routing score: ${summary.aggregate.routingScore.toFixed(3)}`,
    `- Assertion score: ${summary.aggregate.assertionScore.toFixed(3)}`,
    `- Artifact score: ${summary.aggregate.artifactScore.toFixed(3)}`,
    `- Lint score: ${summary.aggregate.lintScore.toFixed(3)}`,
    '',
  ];

  for (const result of summary.cases) {
    lines.push(`## ${result.caseId}`);
    lines.push('');
    lines.push(`- Pass: ${result.pass}`);
    lines.push(`- Routing precision/recall: ${result.routing.precision.toFixed(3)} / ${result.routing.recall.toFixed(3)}`);
    lines.push(`- Assertion score: ${result.assertions.score.toFixed(3)}`);
    if (result.missingExpectedFiles.length > 0) {
      lines.push(`- Missing expected files: ${result.missingExpectedFiles.join(', ')}`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

export function detectInfrastructureIssue(result, trace) {
  if ((trace?.eventCount ?? 0) > 0) {
    return null;
  }

  const stderr = typeof result?.stderr === 'string' ? result.stderr : '';
  const startupSignals = [];
  if (/models\.dev/i.test(stderr)) {
    startupSignals.push('models.dev_unreachable');
  }
  if (/database migration complete/i.test(stderr) || /sqlite-migration/i.test(stderr)) {
    startupSignals.push('database_migration_only');
  }

  if (result?.startupTimedOut) {
    return {
      kind: startupSignals.length > 0 ? 'startup_timeout_after_init' : 'startup_timeout_no_events',
      retryable: true,
      signals: startupSignals,
      stderrSnippet: stderr.slice(0, 500),
    };
  }

  if (result?.timedOut) {
    return {
      kind: startupSignals.length > 0 ? 'runtime_timeout_after_init' : 'runtime_timeout_no_events',
      retryable: startupSignals.length > 0,
      signals: startupSignals,
      stderrSnippet: stderr.slice(0, 500),
    };
  }

  return null;
}

async function runCaseAttempt(options) {
  const caseDir = path.join(options.runDir, 'cases', options.testCase.id);
  const workspaceDir = path.join(caseDir, 'workspace');
  await ensureDir(caseDir);
  await copyDir(options.fixtureDir, workspaceDir);
  await initGitRoot(workspaceDir);
  await initWorkspaceOpencodeRoot(workspaceDir);

  if (options.skillDir) {
    await overlaySkillIntoWorkspace(options.skillDir, workspaceDir, options.skillName);
  }

  const attachments = (options.testCase.attachments ?? []).map((item) =>
    remapPathIntoWorkspace(resolveFromEvalRoot(options.evalRoot, item), options.fixtureDir, workspaceDir)
  );
  const expectedFiles = (options.testCase.expectedFiles ?? []).map((item) => {
    if (path.isAbsolute(item)) {
      return remapPathIntoWorkspace(item, options.fixtureDir, workspaceDir);
    }
    return path.join(workspaceDir, item);
  });

  const promptText = await fs.readFile(options.promptFile, 'utf8');
  const env = createRuntimeEnv(options.runtime);
  const args = [
    'run',
    '--agent',
    options.agent,
    '--dir',
    workspaceDir,
    '--title',
    `${options.configurationId}:${options.testCase.id}:${timestampId()}`,
    '--format',
    'json',
  ];

  for (const attachment of attachments) {
    args.push('-f', attachment);
  }

  args.push(promptText);

  const startedAt = new Date();
  const result = await runCommand({
    command: options.opencodeBin,
    args,
    cwd: workspaceDir,
    env,
    timeoutMs: options.timeoutMs,
    startupTimeoutMs: options.startupTimeoutMs,
    killMode: 'process_group',
  });
  const finishedAt = new Date();

  const eventsFile = path.join(caseDir, 'events.ndjson');
  const stderrFile = path.join(caseDir, 'stderr.log');
  await writeTextFile(eventsFile, result.stdout);
  await writeTextFile(stderrFile, result.stderr);

  const trace = parseEventText(result.stdout, options.knownSkillNames);
  const infrastructureError = detectInfrastructureIssue(result, trace);
  const routing = judgeRouting(options.testCase, trace);
  const assertions = await judgeAssertions(
    {
      responseText: trace.responseText,
      workspaceDir,
    },
    options.testCase.assertions ?? []
  );

  const missingExpectedFiles = [];
  for (const expectedFile of expectedFiles) {
    try {
      await fs.stat(expectedFile);
    } catch {
      missingExpectedFiles.push(expectedFile);
    }
  }

  const artifactScore = expectedFiles.length === 0
    ? 1
    : (expectedFiles.length - missingExpectedFiles.length) / expectedFiles.length;

  const pass =
    result.exitCode === 0 &&
    !infrastructureError &&
    routing.pass &&
    assertions.score === 1 &&
    missingExpectedFiles.length === 0;

  if (options.cleanupWorkspaceState !== false) {
    await cleanupWorkspaceTransientState(workspaceDir);
  }

  return {
    caseId: options.testCase.id,
    pass,
    exitCode: result.exitCode,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    latencyMs: finishedAt.getTime() - startedAt.getTime(),
    workspaceDir,
    eventsFile,
    stderrFile,
    trace,
    routing,
    assertions,
    expectedFiles,
    missingExpectedFiles,
    artifactScore,
    infrastructureError,
    timedOut: Boolean(result.timedOut),
    startupTimedOut: Boolean(result.startupTimedOut),
  };
}

async function runCase(options) {
  const retryCount = Math.max(0, options.infrastructureRetryCount ?? 1);
  const attempts = [];
  let lastResult = null;

  for (let attemptIndex = 1; attemptIndex <= retryCount + 1; attemptIndex += 1) {
    const result = await runCaseAttempt(options);
    attempts.push({
      attempt: attemptIndex,
      exitCode: result.exitCode,
      timedOut: result.timedOut,
      startupTimedOut: result.startupTimedOut,
      infrastructureError: result.infrastructureError,
      stderrFile: result.stderrFile,
      eventsFile: result.eventsFile,
    });
    lastResult = result;

    if (!result.infrastructureError?.retryable || attemptIndex > retryCount) {
      break;
    }
  }

  return {
    ...lastResult,
    attempts,
  };
}

export async function runContentIteration(options) {
  const evalSpec = typeof options.evalSpec === 'string' ? await readJsonFile(options.evalSpec) : options.evalSpec;
  const evalSetPath = typeof options.evalSpec === 'string' ? options.evalSpec : options.evalSetPath;
  const evalRoot = path.dirname(path.resolve(evalSetPath));
  const skillPath = options.skillDir ? path.join(options.skillDir, 'SKILL.md') : null;
  const skillText = skillPath ? await fs.readFile(skillPath, 'utf8') : null;
  const skillName = skillText ? parseSkillMarkdown(skillText).name : evalSpec.skill;
  const runtime = buildRuntimePaths(path.resolve(options.runtimeRoot));
  await prepareRuntimeDirs(runtime);
  const installDecision = await decideRuntimeInstall({
    runtime,
    installCommand: options.installCommand,
    skipInstall: false,
    fingerprintPaths: options.fingerprintPath ? [options.fingerprintPath] : [],
    sharedCacheRoot: options.runtimeCacheRoot,
  });
  await resetRuntimeWorkingState(runtime);
  await prepareRuntimeBase({
    runtime,
    runDir: options.runDir,
    installCommand: options.installCommand,
    installCwd: options.installCwd ?? process.cwd(),
    installDecision,
    permissionProfile: options.permissionProfile ?? 'strict',
    excludedSkillNames: skillName ? [skillName] : [],
  });

  const runtimeSkillsRoot = path.join(runtime.homeDir, '.opencode', 'skills');
  const knownSkillNames = Array.from(new Set([
    ...(await discoverSkillNames(runtimeSkillsRoot)),
    ...(skillName ? [skillName] : []),
  ]));
  const logProgress = options.logProgress !== false;

  const cases = [];
  const totalCases = (evalSpec.cases ?? []).length;
  const startupTimeoutMs = options.startupTimeoutMs ?? Math.min(options.timeoutMs ?? 180_000, 15_000);
  const infrastructureRetryCount = options.infrastructureRetryCount ?? 1;
  emitProgress(
    logProgress,
    `starting ${options.configurationId ?? (options.skillDir ? 'with_skill' : 'without_skill')} for ${skillName}; cases=${totalCases}; timeout=${options.timeoutMs ?? 180_000}ms`,
  );
  for (const [caseIndex, testCase] of (evalSpec.cases ?? []).entries()) {
    emitProgress(logProgress, `case ${caseIndex + 1}/${totalCases}: ${testCase.id}`);
    const promptFile = resolveFromEvalRoot(evalRoot, testCase.promptFile);
    const fixtureDir = resolveFromEvalRoot(evalRoot, testCase.fixtureDir);
    const caseResult = await runCase({
      runDir: options.runDir,
      evalRoot,
      testCase,
      promptFile,
      fixtureDir,
      agent: evalSpec.agent,
      runtime,
      opencodeBin: options.opencodeBin ?? 'opencode',
      knownSkillNames,
      skillDir: options.skillDir ?? null,
      skillName,
      configurationId: options.configurationId ?? (options.skillDir ? 'with_skill' : 'without_skill'),
      timeoutMs: options.timeoutMs ?? 180_000,
      startupTimeoutMs,
      infrastructureRetryCount,
    });
    cases.push(caseResult);
    await writeJsonFile(path.join(options.runDir, 'cases', testCase.id, 'judgment.json'), caseResult);
    emitProgress(
      logProgress,
      `case ${caseIndex + 1}/${totalCases}: ${testCase.id} pass=${caseResult.pass} exitCode=${caseResult.exitCode}`,
    );
  }

  const lint = options.skillDir ? await lintSkillFile(path.join(options.skillDir, 'SKILL.md')) : null;
  const infrastructureFailures = cases.filter((item) => item.infrastructureError);
  const routingScore = cases.length === 0 ? 1 : cases.reduce((sum, item) => sum + (item.routing.pass ? 1 : 0), 0) / cases.length;
  const assertionScore = cases.length === 0 ? 1 : cases.reduce((sum, item) => sum + item.assertions.score, 0) / cases.length;
  const artifactScore = cases.length === 0 ? 1 : cases.reduce((sum, item) => sum + item.artifactScore, 0) / cases.length;
  const lintScore = lint?.score ?? 1;
  const overallScore =
    routingScore * 0.35 +
    assertionScore * 0.35 +
    artifactScore * 0.15 +
    lintScore * 0.15;
  const threshold = typeof evalSpec.threshold === 'number' ? evalSpec.threshold : 0.8;

  return {
    skillName,
    configurationId: options.configurationId ?? (options.skillDir ? 'with_skill' : 'without_skill'),
    sourceSkillDir: options.skillDir ?? null,
    runDir: path.resolve(options.runDir),
    threshold,
    aggregate: {
      status: infrastructureFailures.length > 0 ? 'INFRA_ERROR' : (overallScore >= threshold ? 'PASS' : 'FAIL'),
      caseCount: cases.length,
      passingCases: cases.filter((item) => item.pass).length,
      overallScore,
      routingScore,
      assertionScore,
      artifactScore,
      lintScore,
    },
    lint,
    cases,
    infrastructureFailures: infrastructureFailures.map((item) => ({
      caseId: item.caseId,
      infrastructureError: item.infrastructureError,
    })),
  };
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const evalSetPath = getFlag(flags, '--eval-set');
  const skillDir = getFlag(flags, '--skill-dir');
  const runDir = getFlag(flags, '--run-dir');
  const runtimeRoot = getFlag(flags, '--runtime-root');
  const installCommand = getFlag(flags, '--install-command');
  const installCwd = getFlag(flags, '--install-cwd', process.cwd());
  const runtimeCacheRoot = getFlag(flags, '--runtime-cache-root', getSkillAuthoringRuntimeCacheRoot(process.cwd()));
  const keepRuntime = getFlag(flags, '--keep-runtime', 'failures');
  const pruneRuntime = getFlag(flags, '--prune-runtime-archive', 'true') !== 'false';
  const fingerprintPath = getFlag(flags, '--fingerprint-path');
  const opencodeBin = getFlag(flags, '--opencode-bin', 'opencode');
  const permissionProfile = getFlag(flags, '--permission-profile', 'strict');
  const configurationId = getFlag(flags, '--configuration', skillDir ? 'with_skill' : 'without_skill');
  const timeoutMs = Number(getFlag(flags, '--timeout-ms', '180000'));
  const startupTimeoutMs = Number(getFlag(flags, '--startup-timeout-ms', '15000'));
  const infrastructureRetryCount = Number(getFlag(flags, '--infrastructure-retries', '1'));

  if (!evalSetPath || !runDir || !runtimeRoot || !installCommand) {
    throw new Error(
      'Usage: node run-iteration.mjs --eval-set <content-evals.json> --run-dir <dir> --runtime-root <dir> --install-command <cmd> [--skill-dir <dir>]'
    );
  }

  const summary = await runContentIteration({
    evalSpec: evalSetPath,
    evalSetPath,
    skillDir,
    runDir,
    runtimeRoot,
    runtimeCacheRoot,
    installCommand,
    installCwd,
    fingerprintPath,
    opencodeBin,
    permissionProfile,
    configurationId,
    timeoutMs,
    startupTimeoutMs,
    infrastructureRetryCount,
  });

  await writeJsonFile(path.join(runDir, 'summary.json'), summary);
  await writeTextFile(path.join(runDir, 'summary.md'), buildMarkdownSummary(summary));
  const runtime = buildRuntimePaths(path.resolve(runtimeRoot));
  if (shouldCleanupRuntimeArtifacts(keepRuntime, summary.aggregate.status === 'PASS')) {
    await cleanupRuntimeWorkingState(runtime);
  } else if (pruneRuntime) {
    await pruneRuntimeArchive(runtime);
  }
  process.stdout.write(`${JSON.stringify(summary.aggregate, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`run-iteration failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
