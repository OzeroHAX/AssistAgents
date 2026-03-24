import fs from 'node:fs/promises';
import path from 'node:path';

import {
  EVAL_ROOT,
  REPO_ROOT,
  average,
  copyDir,
  discoverSkillNames,
  ensureDir,
  getFlag,
  getMultiFlag,
  hashPaths,
  hasFlag,
  loadCases,
  readJsonFile,
  loadRubric,
  parseCliArgs,
  pathExists,
  remapPathIntoWorkspace,
  removeIfExists,
  resolveRepoPath,
  runCommand,
  runShellCommand,
  timestampId,
  writeJsonFile,
  writeTextFile,
} from './common.js';
import { judgeQuality } from './judge-quality.js';
import { judgeRouting } from './judge-routing.js';
import { parseEventText } from './parse-events.js';
import {
  EVAL_PERMISSION_PROFILES,
  patchRuntimePermissions,
  type EvalPermissionProfile,
} from './runtime-permissions.js';
import type { CaseResult, EvalCase, RunSummary } from './types.js';

const INSTALL_STATE_VERSION = 1;

type RuntimeInstallState = {
  version: number;
  fingerprint: string;
  installCommand: string;
  updatedAt: string;
};

type RuntimeInstallDecision = RunSummary['install'];

function buildRuntimePaths(): RunSummary['runtime'] {
  const rootDir = path.join(EVAL_ROOT, 'runtime');
  return {
    rootDir,
    baseOpencodeDir: path.join(rootDir, 'base-opencode'),
    homeDir: path.join(rootDir, 'home'),
    xdgConfigHome: path.join(rootDir, 'config'),
    xdgDataHome: path.join(rootDir, 'data'),
  };
}

async function prepareRuntimeDirs(runtime: RunSummary['runtime']): Promise<void> {
  await ensureDir(runtime.rootDir);
  await ensureDir(runtime.homeDir);
  await ensureDir(runtime.xdgConfigHome);
  await ensureDir(runtime.xdgDataHome);
}

async function resetRuntimeWorkingState(runtime: RunSummary['runtime']): Promise<void> {
  await removeIfExists(runtime.homeDir);
  await removeIfExists(runtime.xdgConfigHome);
  await removeIfExists(runtime.xdgDataHome);
  await ensureDir(runtime.rootDir);
  await prepareRuntimeDirs(runtime);
}

function createRuntimeEnv(runtime: RunSummary['runtime']): NodeJS.ProcessEnv {
  return {
    ...process.env,
    HOME: runtime.homeDir,
    XDG_CONFIG_HOME: runtime.xdgConfigHome,
    XDG_DATA_HOME: runtime.xdgDataHome,
  };
}

function getInstallStatePath(runtime: RunSummary['runtime']): string {
  return path.join(runtime.rootDir, 'install-state.json');
}

async function readInstallState(stateFile: string): Promise<RuntimeInstallState | null> {
  try {
    const state = await readJsonFile<RuntimeInstallState>(stateFile);
    if (state.version !== INSTALL_STATE_VERSION) {
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

async function computeInstallFingerprint(): Promise<string> {
  return await hashPaths([
    path.join(REPO_ROOT, 'templates'),
    path.join(REPO_ROOT, 'src', 'config-template.ts'),
  ]);
}

async function decideRuntimeInstall(options: {
  runtime: RunSummary['runtime'];
  installCommand: string;
  skipInstall: boolean;
}): Promise<RuntimeInstallDecision> {
  const fingerprint = await computeInstallFingerprint();
  const stateFile = getInstallStatePath(options.runtime);
  const baseConfigPath = path.join(options.runtime.baseOpencodeDir, 'opencode.jsonc');

  if (options.skipInstall) {
    if (!(await pathExists(baseConfigPath))) {
      throw new Error(`--skip-install requires an existing eval runtime base install at ${baseConfigPath}`);
    }
    return {
      performed: false,
      reason: 'skip-install flag set',
      fingerprint,
      stateFile,
    };
  }

  if (!(await pathExists(baseConfigPath))) {
    return {
      performed: true,
      reason: 'base install is missing',
      fingerprint,
      stateFile,
    };
  }

  const state = await readInstallState(stateFile);
  if (!state) {
    return {
      performed: true,
      reason: 'install state is missing or incompatible',
      fingerprint,
      stateFile,
    };
  }

  if (state.installCommand !== options.installCommand) {
    return {
      performed: true,
      reason: 'install command changed',
      fingerprint,
      stateFile,
    };
  }

  if (state.fingerprint !== fingerprint) {
    return {
      performed: true,
      reason: 'install fingerprint changed',
      fingerprint,
      stateFile,
    };
  }

  return {
    performed: false,
    reason: 'install fingerprint unchanged; reusing cached base install',
    fingerprint,
    stateFile,
  };
}

async function prepareRuntimeBase(options: {
  installCommand: string;
  runDir: string;
  runtime: RunSummary['runtime'];
  installDecision: RuntimeInstallDecision;
  permissionProfile: EvalPermissionProfile;
}): Promise<void> {
  const workingOpencodePath = path.join(options.runtime.homeDir, '.opencode');

  if (options.installDecision.performed) {
    const env = createRuntimeEnv(options.runtime);
    const result = await runShellCommand({
      command: options.installCommand,
      cwd: REPO_ROOT,
      env,
    });

    await writeTextFile(path.join(options.runDir, 'install.log'), result.stdout);
    await writeTextFile(path.join(options.runDir, 'install.err.log'), result.stderr);

    if (result.exitCode !== 0) {
      throw new Error(`Install command failed with exit code ${result.exitCode}`);
    }

    await removeIfExists(options.runtime.baseOpencodeDir);
    await copyDir(workingOpencodePath, options.runtime.baseOpencodeDir);
    await writeJsonFile(options.installDecision.stateFile, {
      version: INSTALL_STATE_VERSION,
      fingerprint: options.installDecision.fingerprint,
      installCommand: options.installCommand,
      updatedAt: new Date().toISOString(),
    } satisfies RuntimeInstallState);
  } else {
    await writeTextFile(path.join(options.runDir, 'install.log'), `install skipped: ${options.installDecision.reason}\n`);
    await writeTextFile(path.join(options.runDir, 'install.err.log'), '');
    await copyDir(options.runtime.baseOpencodeDir, workingOpencodePath);
  }

  const permissionPatch = await patchRuntimePermissions({
    runtimeHomeDir: options.runtime.homeDir,
    profile: options.permissionProfile,
  });
  await writeJsonFile(path.join(options.runDir, 'install-decision.json'), options.installDecision);
  await writeJsonFile(path.join(options.runDir, 'permission-profile.json'), {
    profile: options.permissionProfile,
    configPath: permissionPatch.configPath,
    patchedAgents: permissionPatch.patchedAgents,
  });
}

async function tryExportSession(options: {
  sessionId: string | null;
  opencodeBin: string;
  runtime: RunSummary['runtime'];
  outputFile: string;
}): Promise<string | null> {
  if (!options.sessionId) return null;

  const env = createRuntimeEnv(options.runtime);
  const result = await runCommand({
    command: options.opencodeBin,
    args: ['export', options.sessionId],
    cwd: REPO_ROOT,
    env,
  });

  if (result.exitCode !== 0 || result.stdout.trim().length === 0) {
    return null;
  }

  await writeTextFile(options.outputFile, result.stdout);
  return options.outputFile;
}

function selectCases(allCases: EvalCase[], requestedIds: string[], requestedTags: string[]): EvalCase[] {
  const byId = requestedIds.length === 0
    ? allCases
    : allCases.filter((testCase) => requestedIds.includes(testCase.id));

  if (requestedTags.length === 0) return byId;

  return byId.filter((testCase) => {
    const tags = testCase.tags ?? [];
    return requestedTags.some((tag) => tags.includes(tag));
  });
}

async function runSingleCase(options: {
  testCase: EvalCase;
  attempt: number;
  runId: string;
  runDir: string;
  opencodeBin: string;
  runtime: RunSummary['runtime'];
  knownSkillNames: string[];
}): Promise<CaseResult> {
  const caseDir = path.join(options.runDir, 'cases', options.testCase.id, `attempt-${options.attempt}`);
  await ensureDir(caseDir);

  const promptFile = resolveRepoPath(options.testCase.promptFile);
  const fixtureDir = resolveRepoPath(options.testCase.fixtureDir);
  const workspaceDir = path.join(caseDir, 'workspace');
  await copyDir(fixtureDir, workspaceDir);
  // Force the copied fixture to become the nearest project root for OpenCode.
  const gitInitResult = await runCommand({
    command: 'git',
    args: ['init', '-q'],
    cwd: workspaceDir,
  });
  if (gitInitResult.exitCode !== 0) {
    throw new Error(`Failed to initialize workspace git root for ${options.testCase.id}`);
  }

  const attachments = (options.testCase.attachments ?? []).map((item) =>
    remapPathIntoWorkspace(resolveRepoPath(item), fixtureDir, workspaceDir)
  );
  const expectedFiles = (options.testCase.expectedFiles ?? []).map((item) => {
    if (!path.isAbsolute(item)) {
      return path.join(workspaceDir, item);
    }
    return remapPathIntoWorkspace(item, fixtureDir, workspaceDir);
  });
  const promptText = await fs.readFile(promptFile, 'utf8');
  const title = `eval:${options.runId}:${options.testCase.id}:attempt-${options.attempt}`;
  const env = createRuntimeEnv(options.runtime);

  const args = [
    'run',
    '--agent',
    options.testCase.agent,
    '--dir',
    workspaceDir,
    '--title',
    title,
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
  });
  const finishedAt = new Date();

  const eventsFile = path.join(caseDir, 'events.ndjson');
  const stderrFile = path.join(caseDir, 'stderr.log');
  await writeTextFile(eventsFile, result.stdout);
  await writeTextFile(stderrFile, result.stderr);

  const trace = parseEventText(result.stdout, options.knownSkillNames);
  await writeJsonFile(path.join(caseDir, 'normalized-trace.json'), trace);

  const sessionId = trace.sessionIds[0] ?? null;
  const sessionFile = await tryExportSession({
    sessionId,
    opencodeBin: options.opencodeBin,
    runtime: options.runtime,
    outputFile: path.join(caseDir, 'session.json'),
  });

  const routing = judgeRouting(options.testCase, trace);
  const quality = options.testCase.rubricFile
    ? judgeQuality(trace.responseText, await loadRubric(options.testCase.rubricFile))
    : null;
  const missingExpectedFiles: string[] = [];
  for (const expectedFile of expectedFiles) {
    if (!(await pathExists(expectedFile))) {
      missingExpectedFiles.push(expectedFile);
    }
  }

  await writeTextFile(path.join(caseDir, 'final-response.md'), trace.responseText);

  const latencyMs = finishedAt.getTime() - startedAt.getTime();
  const caseResult: CaseResult = {
    caseId: options.testCase.id,
    attempt: options.attempt,
    agent: options.testCase.agent,
    title,
    runDir: caseDir,
    promptFile,
    fixtureDir,
    workspaceDir,
    attachments,
    expectedFiles,
    missingExpectedFiles,
    exitCode: result.exitCode,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    latencyMs,
    eventsFile,
    stderrFile,
    sessionFile,
    trace,
    routing,
    quality,
    pass: result.exitCode === 0 && routing.pass && (quality?.pass ?? true) && missingExpectedFiles.length === 0,
  };

  await writeJsonFile(path.join(caseDir, 'metrics.json'), {
    latencyMs,
    usage: trace.usage,
    toolCallsTotal: trace.toolCalls.length,
    skillCallsTotal: trace.skillCalls.length,
    loadedSkills: trace.loadedSkills,
  });
  await writeJsonFile(path.join(caseDir, 'judgment.json'), {
    routing,
    quality,
    expectedFiles,
    missingExpectedFiles,
    pass: caseResult.pass,
  });

  return caseResult;
}

function buildAggregate(results: CaseResult[]): RunSummary['aggregate'] {
  const qualityScores = results
    .map((result) => result.quality?.score)
    .filter((value): value is number => typeof value === 'number');

  return {
    totalAttempts: results.length,
    passedAttempts: results.filter((result) => result.pass).length,
    failedAttempts: results.filter((result) => !result.pass).length,
    averageLatencyMs: average(results.map((result) => result.latencyMs)),
    averageQualityScore: qualityScores.length === 0 ? null : average(qualityScores),
  };
}

async function main(): Promise<void> {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const requestedCases = getMultiFlag(flags, '--case');
  const requestedTags = getMultiFlag(flags, '--tag');
  const runId = getFlag(flags, '--run-id', timestampId()) ?? timestampId();
  const installCommand = getFlag(flags, '--install-command', 'npm run dev:fast') ?? 'npm run dev:fast';
  const opencodeBin = getFlag(flags, '--opencode-bin', 'opencode') ?? 'opencode';
  const skipInstall = hasFlag(flags, '--skip-install');
  const permissionProfileRaw = getFlag(flags, '--permission-profile', 'strict') ?? 'strict';
  if (!EVAL_PERMISSION_PROFILES.includes(permissionProfileRaw as EvalPermissionProfile)) {
    throw new Error(`Unknown permission profile: ${permissionProfileRaw}`);
  }
  const permissionProfile = permissionProfileRaw as EvalPermissionProfile;

  const allCases = await loadCases();
  const selectedCases = selectCases(allCases, requestedCases, requestedTags);
  if (selectedCases.length === 0) {
    throw new Error('No eval cases selected. Use --case or --tag to narrow the suite, or add cases under eval/cases.');
  }

  const runDir = path.join(EVAL_ROOT, 'runs', runId);
  const runtime = buildRuntimePaths();
  await ensureDir(runDir);
  const installDecision = await decideRuntimeInstall({
    runtime,
    installCommand,
    skipInstall,
  });
  await resetRuntimeWorkingState(runtime);

  await prepareRuntimeBase({
    installCommand,
    runDir,
    runtime,
    installDecision,
    permissionProfile,
  });

  const knownSkillNames = await discoverSkillNames();
  const results: CaseResult[] = [];

  for (const testCase of selectedCases) {
    const repeat = Math.max(1, testCase.repeat ?? 1);
    for (let attempt = 1; attempt <= repeat; attempt += 1) {
      const result = await runSingleCase({
        testCase,
        attempt,
        runId,
        runDir,
        opencodeBin,
        runtime,
        knownSkillNames,
      });
      results.push(result);
    }
  }

  const completedAt = new Date().toISOString();
  const summary: RunSummary = {
    runId,
    createdAt: startedAt,
    completedAt,
    installCommand,
    opencodeBin,
    permissionProfile,
    install: installDecision,
    runtime,
    selectedCases: selectedCases.map((testCase) => testCase.id),
    results,
    aggregate: buildAggregate(results),
  };

  await writeJsonFile(path.join(runDir, 'summary.json'), summary);
  await writeTextFile(
    path.join(runDir, 'summary.jsonl'),
    results.map((result) => JSON.stringify(result)).join('\n') + '\n'
  );

  process.stdout.write(`${JSON.stringify(summary.aggregate, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`eval run failed: ${message}\n`);
  process.exitCode = 1;
});
