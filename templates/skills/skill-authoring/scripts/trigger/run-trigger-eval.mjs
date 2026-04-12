#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  cleanupWorkspaceTransientState,
  ensureDir,
  getFlag,
  initGitRoot,
  initWorkspaceOpencodeRoot,
  overlaySkillIntoWorkspace,
  parseCliArgs,
  parseSkillMarkdown,
  readJsonFile,
  timestampId,
  writeJsonFile,
  writeTextFile,
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
import {
  getSkillAuthoringRuntimeCacheRoot,
  getSkillAuthoringTestRunDir,
} from '../shared/workspace.mjs';

function minimumTriggersForPass(runsPerQuery, threshold) {
  return Math.ceil(runsPerQuery * threshold);
}

export function evaluateTriggerDecisionState({
  shouldTrigger,
  threshold,
  plannedRuns,
  attemptsCompleted,
  triggeredCount,
}) {
  const remainingRuns = Math.max(0, plannedRuns - attemptsCompleted);
  const minPassTriggers = minimumTriggersForPass(plannedRuns, threshold);
  const minPossibleTriggers = triggeredCount;
  const maxPossibleTriggers = triggeredCount + remainingRuns;

  if (shouldTrigger) {
    if (minPossibleTriggers >= minPassTriggers) {
      return {
        finalized: true,
        pass: true,
        reason: 'pass_locked',
        minPossibleTriggerRate: minPossibleTriggers / plannedRuns,
        maxPossibleTriggerRate: maxPossibleTriggers / plannedRuns,
      };
    }

    if (maxPossibleTriggers < minPassTriggers) {
      return {
        finalized: true,
        pass: false,
        reason: 'fail_locked',
        minPossibleTriggerRate: minPossibleTriggers / plannedRuns,
        maxPossibleTriggerRate: maxPossibleTriggers / plannedRuns,
      };
    }
  } else {
    if (minPossibleTriggers >= minPassTriggers) {
      return {
        finalized: true,
        pass: false,
        reason: 'fail_locked',
        minPossibleTriggerRate: minPossibleTriggers / plannedRuns,
        maxPossibleTriggerRate: maxPossibleTriggers / plannedRuns,
      };
    }

    if (maxPossibleTriggers < minPassTriggers) {
      return {
        finalized: true,
        pass: true,
        reason: 'pass_locked',
        minPossibleTriggerRate: minPossibleTriggers / plannedRuns,
        maxPossibleTriggerRate: maxPossibleTriggers / plannedRuns,
      };
    }
  }

  return {
    finalized: false,
    pass: null,
    reason: 'needs_more_runs',
    minPossibleTriggerRate: minPossibleTriggers / plannedRuns,
    maxPossibleTriggerRate: maxPossibleTriggers / plannedRuns,
  };
}

function emitProgress(enabled, message) {
  if (!enabled) return;
  process.stderr.write(`[skill-authoring][trigger] ${message}\n`);
}

export function evaluateTriggerRoutingState(trace, skillName) {
  const triggered = trace.loadedSkills.includes(skillName);
  const competingSkill = (trace.allLoadedSkills ?? []).find((loadedSkill) =>
    loadedSkill !== skillName && !loadedSkill.startsWith('shared-'),
  ) ?? null;
  const firstNonSkillTool = trace.toolCalls.find((call) => call.name !== 'skill') ?? null;
  return {
    triggered,
    routingSettled: triggered || Boolean(competingSkill) || Boolean(firstNonSkillTool),
    settlingTool: triggered
      ? 'skill'
      : (competingSkill ? `skill:${competingSkill}` : (firstNonSkillTool?.name ?? null)),
  };
}

async function runTriggerAttempt(options) {
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, options.args ?? [], {
      cwd: options.cwd ?? process.cwd(),
      env: options.env,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: true,
      shell: false,
    });

    let stdout = '';
    let stderr = '';
    let lineBuffer = '';
    let timedOut = false;
    let earlyStopReason = null;
    let finalized = false;

    function killChild() {
      if (typeof child.pid === 'number') {
        try {
          process.kill(-child.pid, 'SIGKILL');
          return;
        } catch {
          // Fall back to direct child kill if process-group kill is unavailable.
        }
      }
      child.kill('SIGKILL');
    }

    const timeoutId = typeof options.timeoutMs === 'number' && options.timeoutMs > 0
      ? setTimeout(() => {
        timedOut = true;
        killChild();
      }, options.timeoutMs)
      : null;

    function maybeStopEarly() {
      const trace = parseEventText(stdout, [options.skillName]);
      const routing = evaluateTriggerRoutingState(trace, options.skillName);
      if (!routing.routingSettled) {
        return;
      }
      earlyStopReason = routing.triggered
        ? 'target_skill_loaded'
        : `non_skill_tool:${routing.settlingTool}`;
      killChild();
    }

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      lineBuffer += text;

      let newlineIndex = lineBuffer.indexOf('\n');
      while (newlineIndex >= 0) {
        lineBuffer = lineBuffer.slice(newlineIndex + 1);
        maybeStopEarly();
        newlineIndex = lineBuffer.indexOf('\n');
      }
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (exitCode, signal) => {
      if (finalized) return;
      finalized = true;
      if (timeoutId) clearTimeout(timeoutId);
      const trace = parseEventText(stdout, [options.skillName]);
      const routing = evaluateTriggerRoutingState(trace, options.skillName);
      resolve({
        exitCode,
        signal,
        stdout,
        stderr,
        timedOut,
        earlyStopReason,
        ...routing,
      });
    });

    child.stdin.end();
  });
}

export async function runTriggerEval(options) {
  await ensureDir(options.runDir);
  const skillText = await fs.readFile(path.join(options.skillDir, 'SKILL.md'), 'utf8');
  const skillName = parseSkillMarkdown(skillText).name;
  const runtime = buildRuntimePaths(path.resolve(options.runtimeRoot));
  await prepareRuntimeDirs(runtime);
  const installDecision = await decideRuntimeInstall({
    runtime,
    installCommand: options.installCommand,
    skipInstall: false,
    fingerprintPaths: options.fingerprintPaths ?? [],
    sharedCacheRoot: options.runtimeCacheRoot,
  });
  await resetRuntimeWorkingState(runtime);
  await prepareRuntimeBase({
    runtime,
    runDir: options.runDir,
    installCommand: options.installCommand,
    installCwd: options.installCwd,
    installDecision,
    permissionProfile: options.permissionProfile ?? 'strict',
    excludedSkillNames: skillName ? [skillName] : [],
  });

  const queries = Array.isArray(options.evalSet) ? options.evalSet : (options.evalSet.queries ?? []);
  const agent = options.agent ?? 'ask';
  const runsPerQuery = options.runsPerQuery ?? options.evalSet.runsPerQuery ?? 3;
  const threshold = options.threshold ?? options.evalSet.threshold ?? 0.5;
  const timeoutMs = options.timeoutMs ?? 30_000;
  const logProgress = options.logProgress !== false;
  const results = [];

  emitProgress(
    logProgress,
    `starting trigger eval for ${skillName}; queries=${queries.length}; runs/query=${runsPerQuery}; timeout=${timeoutMs}ms`,
  );

  for (const [queryIndex, item] of queries.entries()) {
    let triggeredCount = 0;
    const attempts = [];
    let finalDecision = null;

    emitProgress(
      logProgress,
      `query ${queryIndex + 1}/${queries.length}: shouldTrigger=${Boolean(item.shouldTrigger)} :: ${item.query}`,
    );

    for (let runIndex = 1; runIndex <= runsPerQuery; runIndex += 1) {
      emitProgress(
        logProgress,
        `query ${queryIndex + 1}/${queries.length} run ${runIndex}/${runsPerQuery}: launching OpenCode`,
      );
      const workspaceDir = path.join(options.runDir, 'queries', `${timestampId()}-${runIndex}`);
      await ensureDir(workspaceDir);
      await initGitRoot(workspaceDir);
      await initWorkspaceOpencodeRoot(workspaceDir);
      await overlaySkillIntoWorkspace(options.skillDir, workspaceDir, skillName);

      const env = createRuntimeEnv(runtime);
      const commandResult = await runTriggerAttempt({
        skillName,
        command: options.opencodeBin ?? 'opencode',
        args: [
          'run',
          '--agent',
          agent,
          '--dir',
          workspaceDir,
          '--title',
          `trigger:${skillName}:${runIndex}`,
          '--format',
          'json',
          item.query,
        ],
        cwd: workspaceDir,
        env,
        timeoutMs,
      });

      const eventsFile = path.join(workspaceDir, 'events.ndjson');
      await writeTextFile(eventsFile, commandResult.stdout);
      await writeTextFile(path.join(workspaceDir, 'stderr.log'), commandResult.stderr);

      const trace = parseEventText(commandResult.stdout, [skillName]);
      const routing = evaluateTriggerRoutingState(trace, skillName);
      const triggered = routing.triggered;
      if (triggered) {
        triggeredCount += 1;
      }

      attempts.push({
        runIndex,
        triggered,
        exitCode: commandResult.exitCode,
        timedOut: Boolean(commandResult.timedOut),
        routingSettled: routing.routingSettled,
        settlingTool: routing.settlingTool,
        earlyStopReason: commandResult.earlyStopReason,
        workspaceDir,
        trace,
      });

      if (options.cleanupWorkspaceState !== false) {
        await cleanupWorkspaceTransientState(workspaceDir);
      }

      finalDecision = evaluateTriggerDecisionState({
        shouldTrigger: Boolean(item.shouldTrigger),
        threshold,
        plannedRuns: runsPerQuery,
        attemptsCompleted: attempts.length,
        triggeredCount,
      });

      emitProgress(
        logProgress,
        `query ${queryIndex + 1}/${queries.length} run ${runIndex}/${runsPerQuery}: triggered=${triggered} timedOut=${Boolean(commandResult.timedOut)} decision=${finalDecision.reason}`,
      );

      if (finalDecision.finalized) {
        emitProgress(
          logProgress,
          `query ${queryIndex + 1}/${queries.length}: stopping early after ${attempts.length} run(s); outcome locked`,
        );
        break;
      }
    }

    const shouldTrigger = Boolean(item.shouldTrigger);
    const attemptedRuns = attempts.length;
    const triggerRate = attemptedRuns === 0 ? 0 : triggeredCount / attemptedRuns;
    const finalState = finalDecision ?? evaluateTriggerDecisionState({
      shouldTrigger,
      threshold,
      plannedRuns: runsPerQuery,
      attemptsCompleted: attemptedRuns,
      triggeredCount,
    });
    const pass = typeof finalState.pass === 'boolean'
      ? finalState.pass
      : (shouldTrigger ? triggerRate >= threshold : triggerRate < threshold);

    const result = {
      query: item.query,
      shouldTrigger,
      triggerRate,
      attemptedRuns,
      plannedRuns: runsPerQuery,
      triggers: triggeredCount,
      runs: attemptedRuns,
      pass,
      decisionReason: finalState.reason,
      minPossibleTriggerRate: finalState.minPossibleTriggerRate,
      maxPossibleTriggerRate: finalState.maxPossibleTriggerRate,
      stoppedEarly: attemptedRuns < runsPerQuery,
      attempts,
    };
    results.push(result);

    const passed = results.filter((entry) => entry.pass).length;
    const partialOutput = {
      skillName,
      threshold,
      runsPerQuery,
      results,
      summary: {
        total: results.length,
        passed,
        failed: results.length - passed,
        timedOutAttempts: results.reduce(
          (sum, entry) => sum + entry.attempts.filter((attempt) => attempt.timedOut).length,
          0,
        ),
        timedOutQueries: results.filter((entry) => entry.attempts.some((attempt) => attempt.timedOut)).length,
      },
      progress: {
        completedQueries: results.length,
        totalQueries: queries.length,
      },
    };
    await writeJsonFile(path.join(options.runDir, 'results.json'), partialOutput);
    await writeTextFile(
      path.join(options.runDir, 'summary.md'),
      [
        `# Trigger Summary: ${skillName}`,
        '',
        `- Completed queries: ${partialOutput.progress.completedQueries}/${partialOutput.progress.totalQueries}`,
        `- Passed: ${partialOutput.summary.passed}/${partialOutput.summary.total}`,
        `- Failed: ${partialOutput.summary.failed}`,
        `- Timed out attempts: ${partialOutput.summary.timedOutAttempts}`,
        `- Timed out queries: ${partialOutput.summary.timedOutQueries}`,
        '',
      ].join('\n'),
    );
  }

  const passed = results.filter((result) => result.pass).length;
  const timedOutAttempts = results.reduce(
    (sum, result) => sum + result.attempts.filter((attempt) => attempt.timedOut).length,
    0,
  );
  const output = {
    skillName,
    threshold,
    runsPerQuery,
    results,
    summary: {
      total: results.length,
      passed,
      failed: results.length - passed,
      timedOutAttempts,
      timedOutQueries: results.filter((result) => result.attempts.some((attempt) => attempt.timedOut)).length,
    },
    progress: {
      completedQueries: results.length,
      totalQueries: queries.length,
    },
  };

  await writeJsonFile(path.join(options.runDir, 'results.json'), output);
  await writeTextFile(
    path.join(options.runDir, 'summary.md'),
    [
      `# Trigger Summary: ${skillName}`,
      '',
      `- Completed queries: ${output.progress.completedQueries}/${output.progress.totalQueries}`,
      `- Passed: ${output.summary.passed}/${output.summary.total}`,
      `- Failed: ${output.summary.failed}`,
      `- Timed out attempts: ${output.summary.timedOutAttempts}`,
      `- Timed out queries: ${output.summary.timedOutQueries}`,
      '',
    ].join('\n'),
  );

  return output;
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const evalSetPath = getFlag(flags, '--eval-set');
  const skillDir = getFlag(flags, '--skill-dir');
  const runDir = getFlag(flags, '--run-dir', getSkillAuthoringTestRunDir(`trigger-eval-${timestampId()}`, process.cwd()));
  const runtimeRoot = getFlag(flags, '--runtime-root');
  const installCommand = getFlag(flags, '--install-command');
  const installCwd = getFlag(flags, '--install-cwd', process.cwd());
  const runtimeCacheRoot = getFlag(flags, '--runtime-cache-root', getSkillAuthoringRuntimeCacheRoot(process.cwd()));
  const keepRuntime = getFlag(flags, '--keep-runtime', 'failures');
  const pruneRuntime = getFlag(flags, '--prune-runtime-archive', 'true') !== 'false';
  const opencodeBin = getFlag(flags, '--opencode-bin', 'opencode');
  const agent = getFlag(flags, '--agent', 'ask');
  const permissionProfile = getFlag(flags, '--permission-profile', 'strict');
  const threshold = Number(getFlag(flags, '--threshold', '0.5'));
  const runsPerQuery = Number(getFlag(flags, '--runs-per-query', '3'));
  const timeoutMs = Number(getFlag(flags, '--timeout-ms', '30000'));

  if (!evalSetPath || !skillDir || !runtimeRoot || !installCommand) {
    throw new Error(
      'Usage: node run-trigger-eval.mjs --eval-set <trigger-evals.json> --skill-dir <dir> --runtime-root <dir> --install-command <cmd>'
    );
  }

  const evalSet = await readJsonFile(evalSetPath);
  const output = await runTriggerEval({
    evalSet,
    skillDir,
    runDir,
    runtimeRoot,
    runtimeCacheRoot,
    installCommand,
    installCwd,
    opencodeBin,
    agent,
    permissionProfile,
    threshold,
    runsPerQuery,
    timeoutMs,
  });

  const success = output.summary.failed === 0 && output.summary.timedOutAttempts === 0;
  const runtime = buildRuntimePaths(path.resolve(runtimeRoot));
  if (shouldCleanupRuntimeArtifacts(keepRuntime, success)) {
    await cleanupRuntimeWorkingState(runtime);
  } else if (pruneRuntime) {
    await pruneRuntimeArchive(runtime);
  }
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`run-trigger-eval failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
