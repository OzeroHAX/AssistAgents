import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, writeFile, mkdir, stat } from 'node:fs/promises';

import { parseSkillMarkdown, remapPathIntoWorkspace } from '../templates/skills/skill-authoring/scripts/shared/fs.mjs';
import { parseEventText } from '../templates/skills/skill-authoring/scripts/shared/parse-events.mjs';
import {
  applyPermissionProfile,
  applyAgentPermissionProfile,
} from '../templates/skills/skill-authoring/scripts/shared/runtime-permissions.mjs';
import {
  buildRuntimePaths,
  prepareRuntimeBase,
  prepareRuntimeDirs,
} from '../templates/skills/skill-authoring/scripts/shared/runtime.mjs';
import {
  slugifySkillAuthoringName,
  getSkillAuthoringDocsRoot,
  getSkillAuthoringRunDir,
  getSkillAuthoringWorkspaceDir,
} from '../templates/skills/skill-authoring/scripts/shared/workspace.mjs';
import { judgeRouting } from '../templates/skills/skill-authoring/scripts/content/score-routing.mjs';
import { judgeAssertions } from '../templates/skills/skill-authoring/scripts/content/score-assertions.mjs';
import { lintSkillText } from '../templates/skills/skill-authoring/scripts/content/score-lint.mjs';
import { buildDiagnosisDraft } from '../templates/skills/skill-authoring/scripts/content/analyze-results.mjs';
import { renderTimeline } from '../templates/skills/skill-authoring/scripts/content/render-timeline.mjs';
import { compareSummaries } from '../templates/skills/skill-authoring/scripts/content/compare-summaries.mjs';
import { buildDescriptionPrompt } from '../templates/skills/skill-authoring/scripts/trigger/improve-description.mjs';
import { evaluateTriggerDecisionState } from '../templates/skills/skill-authoring/scripts/trigger/run-trigger-eval.mjs';
import {
  runAdaptiveTriggerEval,
  triggerEvalNeedsFallback,
} from '../templates/skills/skill-authoring/scripts/trigger/run-trigger-loop.mjs';

test('parseSkillMarkdown extracts name, description, and body', () => {
  const parsed = parseSkillMarkdown(`---\nname: sample-skill\ndescription: Use when the user needs a sample skill\n---\n<body>\n  <item>ok</item>\n</body>\n`);

  assert.equal(parsed.name, 'sample-skill');
  assert.match(parsed.description, /sample skill/i);
  assert.match(parsed.body, /<body>/);
});

test('parseEventText detects loaded skills from tool calls', () => {
  const raw = [
    JSON.stringify({
      type: 'tool_call',
      name: 'skill',
      input: { name: 'docs-changelog' },
    }),
    JSON.stringify({
      type: 'message',
      role: 'assistant',
      content: 'Prepared the changelog update with the fast-replace note.',
      usage: { input_tokens: 20, completion_tokens: 10, total_tokens: 30 },
    }),
  ].join('\n');

  const trace = parseEventText(raw, ['docs-changelog']);

  assert.deepEqual(trace.loadedSkills, ['docs-changelog']);
  assert.equal(trace.usage.total, 30);
});

test('parseEventText ignores failed skill loads and path noise', () => {
  const raw = [
    JSON.stringify({
      type: 'tool_use',
      tool: 'skill',
      state: {
        status: 'completed',
        input: { name: 'shared-base-rules' },
        output: '<skill_content name="shared-base-rules">Base directory: /tmp/docs-changelog-check-06/skill-authoring</skill_content>',
      },
    }),
    JSON.stringify({
      type: 'tool_use',
      tool: 'skill',
      state: {
        status: 'error',
        input: { name: 'docs-changelog' },
        error: 'Skill "docs-changelog" not found. Available skills: shared-base-rules, skill-authoring',
      },
    }),
  ].join('\n');

  const trace = parseEventText(raw, ['docs-changelog', 'shared-base-rules', 'skill-authoring']);

  assert.deepEqual(trace.loadedSkills, ['shared-base-rules']);
});

test('judgeRouting reports misses and forbidden hits', () => {
  const judgment = judgeRouting(
    {
      requiredSkills: ['docs-changelog'],
      forbiddenSkills: ['docs-guide'],
      allowedSkills: ['shared-base-rules', 'docs-changelog'],
      strictUnexpectedSkills: true,
    },
    {
      loadedSkills: ['shared-base-rules', 'docs-guide'],
    },
  );

  assert.equal(judgment.pass, false);
  assert.deepEqual(judgment.requiredMisses, ['docs-changelog']);
  assert.deepEqual(judgment.forbiddenHits, ['docs-guide']);
});

test('judgeAssertions supports response and file checks', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skill-authoring-assertions-'));
  await mkdir(path.join(tempDir, 'ai-docs'), { recursive: true });
  await writeFile(path.join(tempDir, 'ai-docs', 'note.md'), 'The fast-replace mode skips prompts.', 'utf8');

  const judgment = await judgeAssertions(
    {
      responseText: 'The fast-replace mode skips prompts and creates a backup.',
      workspaceDir: tempDir,
    },
    [
      {
        id: 'response',
        kind: 'regex_any',
        description: 'Mentions fast-replace',
        patterns: ['fast-replace'],
      },
      {
        id: 'file',
        kind: 'file_regex_any',
        description: 'File contains skips prompts',
        file: 'ai-docs/note.md',
        patterns: ['skips prompts'],
      },
    ],
  );

  assert.equal(judgment.score, 1);
  assert.equal(judgment.pass, true);
});

test('remapPathIntoWorkspace only rewrites paths under the source root', () => {
  const fixtureDir = '/repo/fixtures/example';
  const workspaceDir = '/repo/workspace/run-1';

  assert.equal(
    remapPathIntoWorkspace(path.join(fixtureDir, 'nested/file.md'), fixtureDir, workspaceDir),
    path.join(workspaceDir, 'nested/file.md'),
  );
  assert.equal(
    remapPathIntoWorkspace('/repo/outside/file.md', fixtureDir, workspaceDir),
    '/repo/outside/file.md',
  );
});

test('permission profile helpers relax only scoped runtime permissions', () => {
  const configText = `{
  "agent": {
    "doc": { "permission": { "edit": { "*": "deny" } } },
    "review": { "permission": { "edit": "deny" } }
  }
}`;

  const patched = JSON.parse(applyPermissionProfile(configText, 'relaxed-artifact-writes'));
  assert.equal(patched.agent.doc.permission.write, 'allow');
  assert.equal(patched.agent.doc.permission.edit, 'allow');
  assert.equal(patched.agent.review.permission.edit, 'deny');

  const agentMarkdown = `---
permission:
    write:
        "*": deny
        "ai-docs/changelogs/**.md": allow
    edit:
        "*": deny
        "ai-docs/changelogs/**.md": allow
    question: allow
---
`;
  const relaxedAgent = applyAgentPermissionProfile(agentMarkdown, 'relaxed-artifact-writes');
  assert.match(relaxedAgent, /write: allow/);
  assert.match(relaxedAgent, /edit: allow/);
});

test('skill-authoring workspace helpers target ai-docs paths', () => {
  const baseDir = '/repo';

  assert.equal(slugifySkillAuthoringName('Docs Changelog Review!'), 'docs-changelog-review');
  assert.equal(getSkillAuthoringDocsRoot(baseDir), '/repo/ai-docs/skill-authoring');
  assert.equal(getSkillAuthoringRunDir('run-1', baseDir), '/repo/ai-docs/skill-authoring/runs/run-1');
  assert.equal(
    getSkillAuthoringWorkspaceDir('Docs Changelog', baseDir),
    '/repo/ai-docs/skill-authoring/workspaces/docs-changelog',
  );
});

test('lintSkillText fails mixed-language markdown-style skill body', () => {
  const judgment = lintSkillText(`---\nname: broken-skill\ndescription: Step by step process for everything\n---\n# Heading\nРусский текст\n`);

  assert.equal(judgment.pass, false);
  assert.ok(judgment.failedRules.some((rule) => rule.id === 'L3'));
  assert.ok(judgment.failedRules.some((rule) => rule.id === 'L7'));
});

test('buildDiagnosisDraft identifies weak sections', () => {
  const diagnosis = buildDiagnosisDraft({
    aggregate: {
      status: 'FAIL',
      overallScore: 0.61,
      routingScore: 0.5,
      assertionScore: 0.7,
      artifactScore: 0.5,
    },
    lint: {
      score: 0.85,
      failedRules: [{ id: 'L3', reason: 'Body must primarily use XML-like tagged sections.' }],
    },
  }, {
    aggregate: {
      overallScore: 0.8,
    },
  });

  assert.equal(diagnosis.stopOrContinue, 'continue');
  assert.ok(diagnosis.changeTargets.includes('body'));
  assert.ok(diagnosis.rootCauses.some((cause) => cause.id === 'no-baseline-win'));
});

test('renderTimeline creates a readable markdown summary', () => {
  const markdown = renderTimeline({
    skillName: 'docs-changelog',
    startedAt: '2026-03-25T10:00:00Z',
    stopReason: 'passed_threshold',
    iterations: [
      {
        iteration: 1,
        status: 'FAIL',
        overallScore: 0.74,
        note: 'Too many routing misses',
      },
      {
        iteration: 2,
        status: 'PASS',
        overallScore: 0.92,
        note: 'Description tightened and outputs clarified',
      },
    ],
  });

  assert.match(markdown, /Iteration \| Status \| Overall/);
  assert.match(markdown, /Too many routing misses/);
  assert.match(markdown, /0\.920/);
});

test('compareSummaries reports score regressions', () => {
  const report = compareSummaries(
    {
      skillName: 'docs-changelog',
      configurationId: 'candidate',
      aggregate: {
        overallScore: 0.75,
        routingScore: 0.8,
        assertionScore: 0.7,
        artifactScore: 1,
        lintScore: 0.9,
      },
      cases: [
        {
          caseId: 'case-1',
          assertions: { score: 0.5 },
          routing: { precision: 1, recall: 0.5 },
          missingExpectedFiles: ['missing.md'],
        },
      ],
    },
    {
      skillName: 'docs-changelog',
      configurationId: 'baseline',
      aggregate: {
        overallScore: 0.9,
        routingScore: 0.9,
        assertionScore: 0.85,
        artifactScore: 1,
        lintScore: 1,
      },
      cases: [
        {
          caseId: 'case-1',
          assertions: { score: 1 },
          routing: { precision: 1, recall: 1 },
          missingExpectedFiles: [],
        },
      ],
    },
  );

  assert.ok(report.regressions.includes('overall_score_drop'));
  assert.ok(report.caseDiffs[0].regressionReasons.includes('assertion_score_drop'));
  assert.ok(report.caseDiffs[0].regressionReasons.includes('more_missing_expected_files'));
});

test('buildDescriptionPrompt includes failed and false triggers', () => {
  const prompt = buildDescriptionPrompt({
    skillName: 'docs-changelog',
    currentDescription: 'Use for changelog tasks.',
    skillBody: '<workflow><step>Write a changelog</step></workflow>',
    evalResults: {
      results: [
        { query: 'Update release notes', shouldTrigger: true, pass: false, triggers: 1, runs: 3 },
        { query: 'Write a guide', shouldTrigger: false, pass: false, triggers: 2, runs: 3 },
      ],
    },
    history: [{ description: 'Old desc', score: '1/2' }],
  });

  assert.match(prompt, /FAILED TO TRIGGER/);
  assert.match(prompt, /FALSE TRIGGERS/);
  assert.match(prompt, /Old desc -> 1\/2/);
});

test('prepareRuntimeBase masks evaluated skill from working runtime without touching cached base install', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skill-authoring-runtime-'));
  const runtime = buildRuntimePaths(tempDir);
  await prepareRuntimeDirs(runtime);

  await mkdir(path.join(runtime.baseOpencodeDir, 'skills', 'docs', 'changelog'), { recursive: true });
  await mkdir(path.join(runtime.baseOpencodeDir, 'skills', 'docs', 'guide'), { recursive: true });
  await writeFile(
    path.join(runtime.baseOpencodeDir, 'skills', 'docs', 'changelog', 'SKILL.md'),
    '---\nname: docs-changelog\ndescription: sample\n---\n',
    'utf8',
  );
  await writeFile(
    path.join(runtime.baseOpencodeDir, 'skills', 'docs', 'guide', 'SKILL.md'),
    '---\nname: docs-guide\ndescription: sample\n---\n',
    'utf8',
  );

  await prepareRuntimeBase({
    runtime,
    installCommand: 'echo skipped',
    installDecision: {
      performed: false,
      reason: 'test',
      fingerprint: 'test',
      stateFile: path.join(tempDir, 'install-state.json'),
    },
    excludedSkillNames: ['docs-changelog'],
  });

  await assert.rejects(stat(path.join(runtime.homeDir, '.opencode', 'skills', 'docs', 'changelog')));
  await stat(path.join(runtime.homeDir, '.opencode', 'skills', 'docs', 'guide'));
  await stat(path.join(runtime.baseOpencodeDir, 'skills', 'docs', 'changelog', 'SKILL.md'));
});

test('triggerEvalNeedsFallback only requests fallback when timed out attempts exceed the floor', () => {
  assert.equal(triggerEvalNeedsFallback({ summary: { timedOutAttempts: 2 } }, 3, 1), true);
  assert.equal(triggerEvalNeedsFallback({ summary: { timedOutAttempts: 0 } }, 3, 1), false);
  assert.equal(triggerEvalNeedsFallback({ summary: { timedOutAttempts: 1 } }, 1, 1), false);
});

test('evaluateTriggerDecisionState locks negative failures and positive passes early', () => {
  const negativeLockedFail = evaluateTriggerDecisionState({
    shouldTrigger: false,
    threshold: 0.5,
    plannedRuns: 3,
    attemptsCompleted: 2,
    triggeredCount: 2,
  });
  assert.equal(negativeLockedFail.finalized, true);
  assert.equal(negativeLockedFail.pass, false);

  const positiveLockedPass = evaluateTriggerDecisionState({
    shouldTrigger: true,
    threshold: 0.5,
    plannedRuns: 3,
    attemptsCompleted: 2,
    triggeredCount: 2,
  });
  assert.equal(positiveLockedPass.finalized, true);
  assert.equal(positiveLockedPass.pass, true);

  const undecided = evaluateTriggerDecisionState({
    shouldTrigger: true,
    threshold: 0.5,
    plannedRuns: 3,
    attemptsCompleted: 1,
    triggeredCount: 0,
  });
  assert.equal(undecided.finalized, false);
});

test('runAdaptiveTriggerEval reruns with fewer runs per query after timeout', async () => {
  const calls = [];

  const output = await runAdaptiveTriggerEval({
    evalSet: [{ query: 'q', shouldTrigger: true }],
    skillDir: '/repo/skill',
    runDir: '/tmp/trigger-eval',
    runtimeRoot: '/tmp/runtime',
    installCommand: 'echo install',
    runsPerQuery: 3,
    fallbackRunsPerQuery: 1,
    runEval: async (options) => {
      calls.push({ runDir: options.runDir, runsPerQuery: options.runsPerQuery });
      if (options.runsPerQuery === 3) {
        return {
          runsPerQuery: 3,
          summary: { total: 1, passed: 0, failed: 1, timedOutAttempts: 1 },
          results: [],
        };
      }
      return {
        runsPerQuery: 1,
        summary: { total: 1, passed: 1, failed: 0, timedOutAttempts: 0 },
        results: [],
      };
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0]?.runsPerQuery, 3);
  assert.equal(calls[1]?.runsPerQuery, 1);
  assert.equal(output.usedFallback, true);
  assert.equal(output.effectiveRunsPerQuery, 1);
  assert.equal(output.effective.summary.passed, 1);
});
