import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, writeFile, mkdir, readFile, stat } from 'node:fs/promises';

import {
  cleanupWorkspaceTransientState,
  getSkillTestsDir,
  parseSkillMarkdown,
  remapPathIntoWorkspace,
  resolveSkillEntry,
  runCommand,
} from '../templates/skills/skill-authoring/scripts/shared/fs.mjs';
import { parseEventText } from '../templates/skills/skill-authoring/scripts/shared/parse-events.mjs';
import {
  applyPermissionProfile,
  applyAgentPermissionProfile,
} from '../templates/skills/skill-authoring/scripts/shared/runtime-permissions.mjs';
import {
  buildRuntimePaths,
  cleanupRuntimeWorkingState,
  prepareRuntimeBase,
  prepareRuntimeDirs,
  pruneRuntimeArchive,
  shouldCleanupRuntimeArtifacts,
} from '../templates/skills/skill-authoring/scripts/shared/runtime.mjs';
import {
  slugifySkillAuthoringName,
  getSkillAuthoringDocsRoot,
  getSkillAuthoringInteractiveRunDir,
  getSkillAuthoringInteractiveRunsRoot,
  getSkillAuthoringRuntimeCacheRoot,
  getSkillAuthoringRunDir,
  getSkillAuthoringTestRunDir,
  getSkillAuthoringTestRunsRoot,
  getSkillAuthoringWorkspaceDir,
} from '../templates/skills/skill-authoring/scripts/shared/workspace.mjs';
import { judgeRouting } from '../templates/skills/skill-authoring/scripts/content/score-routing.mjs';
import { judgeAssertions } from '../templates/skills/skill-authoring/scripts/content/score-assertions.mjs';
import { lintSkillText } from '../templates/skills/skill-authoring/scripts/content/score-lint.mjs';
import {
  buildStaticValidation,
  renderStaticValidationMarkdown,
} from '../templates/skills/skill-authoring/scripts/content/validate-skill.mjs';
import { renderSimpleDiff } from '../templates/skills/skill-authoring/scripts/content/run-report.mjs';
import { buildDescriptionPrompt } from '../templates/skills/skill-authoring/scripts/trigger/improve-description.mjs';
import {
  evaluateTriggerDecisionState,
  evaluateTriggerRoutingState,
} from '../templates/skills/skill-authoring/scripts/trigger/run-trigger-eval.mjs';
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
  assert.deepEqual(trace.allLoadedSkills, ['docs-changelog']);
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
  assert.deepEqual(trace.allLoadedSkills, ['shared-base-rules']);
});

test('parseEventText preserves non-target skill loads for routing diagnostics', () => {
  const raw = [
    JSON.stringify({
      type: 'tool_use',
      tool: 'skill',
      state: {
        status: 'completed',
        input: { name: 'shared-base-rules' },
      },
    }),
    JSON.stringify({
      type: 'tool_use',
      tool: 'skill',
      state: {
        status: 'completed',
        input: { name: 'task-use-research-code-strategy' },
      },
    }),
  ].join('\n');

  const trace = parseEventText(raw, ['docs-changelog']);

  assert.deepEqual(trace.loadedSkills, []);
  assert.deepEqual(trace.allLoadedSkills, ['shared-base-rules', 'task-use-research-code-strategy']);
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

test('judgeAssertions accepts eval shorthand regex flags', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skill-authoring-assertions-flags-'));
  await mkdir(path.join(tempDir, 'ai-docs'), { recursive: true });
  await writeFile(path.join(tempDir, 'ai-docs', 'note.md'), 'Audience:\n1. Operations managers', 'utf8');

  const judgment = await judgeAssertions(
    {
      responseText: 'Open Questions remain, but the existing brief was updated.',
      workspaceDir: tempDir,
    },
    [
      {
        id: 'response-inline-flags',
        kind: 'regex_any',
        description: 'Matches case-insensitive shorthand flags',
        patterns: ['(?i)open questions', '(?i)existing brief'],
      },
      {
        id: 'file-inline-flags',
        kind: 'file_regex_any',
        description: 'Matches multiline shorthand flags',
        file: 'ai-docs/note.md',
        patterns: ['(?m)^1\\. operations managers$', '(?i)audience'],
      },
    ],
  );

  assert.equal(judgment.score, 1);
  assert.equal(judgment.pass, true);
});

test('runCommand emits heartbeat updates for long-running processes', async () => {
  const heartbeats: Array<{ elapsedMs: number }> = [];
  const result = await runCommand({
    command: process.execPath,
    args: ['-e', "setTimeout(() => { process.stdout.write('done\\n'); }, 80);"],
    heartbeatMs: 20,
    onHeartbeat: (heartbeat: { elapsedMs: number }) => {
      heartbeats.push(heartbeat);
    },
    timeoutMs: 500,
  });

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /done/);
  assert.ok(heartbeats.length >= 2);
  assert.ok(heartbeats.every((heartbeat) => heartbeat.elapsedMs >= 0));
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
  assert.equal(getSkillAuthoringInteractiveRunsRoot(baseDir), '/repo/ai-docs/skill-authoring/interactive-runs');
  assert.equal(getSkillAuthoringTestRunsRoot(baseDir), '/repo/ai-docs/skill-authoring/test-runs');
  assert.equal(getSkillAuthoringRuntimeCacheRoot(baseDir), '/repo/ai-docs/skill-authoring/runtime-cache');
  assert.equal(getSkillAuthoringRunDir('run-1', baseDir), '/repo/ai-docs/skill-authoring/test-runs/run-1');
  assert.equal(getSkillAuthoringInteractiveRunDir('run-1', baseDir), '/repo/ai-docs/skill-authoring/interactive-runs/run-1');
  assert.equal(getSkillAuthoringTestRunDir('run-1', baseDir), '/repo/ai-docs/skill-authoring/test-runs/run-1');
  assert.equal(
    getSkillAuthoringWorkspaceDir('Docs Changelog', baseDir),
    '/repo/ai-docs/skill-authoring/workspaces/docs-changelog',
  );
  assert.equal(getSkillTestsDir('/repo/.opencode/skills/docs-changelog'), '/repo/.opencode/skills/docs-changelog/assets/tests');
});

test('resolveSkillEntry accepts both skill directory and SKILL.md path', () => {
  assert.deepEqual(
    resolveSkillEntry('/repo/.opencode/skills/docs-changelog'),
    {
      skillDir: '/repo/.opencode/skills/docs-changelog',
      skillFile: '/repo/.opencode/skills/docs-changelog/SKILL.md',
    },
  );
  assert.deepEqual(
    resolveSkillEntry('/repo/.opencode/skills/docs-changelog/SKILL.md'),
    {
      skillDir: '/repo/.opencode/skills/docs-changelog',
      skillFile: '/repo/.opencode/skills/docs-changelog/SKILL.md',
    },
  );
});

test('cleanupWorkspaceTransientState removes generated node_modules but keeps skill overlays', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skill-authoring-workspace-'));
  await mkdir(path.join(tempDir, '.opencode', 'node_modules', 'zod'), { recursive: true });
  await mkdir(path.join(tempDir, '.opencode', 'skills', 'docs-changelog'), { recursive: true });
  await writeFile(path.join(tempDir, '.opencode', 'node_modules', 'zod', 'index.js'), 'export default {};', 'utf8');
  await writeFile(path.join(tempDir, '.opencode', 'skills', 'docs-changelog', 'SKILL.md'), '---\nname: docs-changelog\ndescription: sample\n---\n', 'utf8');

  await cleanupWorkspaceTransientState(tempDir);

  await assert.rejects(stat(path.join(tempDir, '.opencode', 'node_modules')));
  await stat(path.join(tempDir, '.opencode', 'skills', 'docs-changelog', 'SKILL.md'));
});

test('lintSkillText fails mixed-language markdown-style skill body', () => {
  const judgment = lintSkillText(`---\nname: broken-skill\ndescription: Step by step process for everything\n---\n# Heading\nРусский текст\n`);

  assert.equal(judgment.pass, false);
  assert.ok(judgment.failedRules.some((rule: { id: string }) => rule.id === 'L3'));
  assert.ok(judgment.failedRules.some((rule: { id: string }) => rule.id === 'L7'));
});

test('lintSkillText fails invalid skill names', () => {
  const judgment = lintSkillText(`---\nname: Invalid_Skill\ndescription: Use when the user needs a narrow skill.\n---\n<when_to_use><item>ok</item></when_to_use>\n<when_not_to_use><item>no</item></when_not_to_use>\n<workflow><step>ok</step></workflow>\n<output_requirements><item>ok</item></output_requirements>\n`);

  assert.equal(judgment.pass, false);
  assert.ok(judgment.failedRules.some((rule: { id: string }) => rule.id === 'L1'));
});

test('buildStaticValidation reports missing structure and follow-up questions', () => {
  const report = buildStaticValidation(
    `---\nname: sample-skill\ndescription: Use when the user needs a sample skill.\n---\n<when_to_use><item>Use it.</item></when_to_use>\n`,
    '/repo/.opencode/skills/sample-skill/SKILL.md',
  );

  assert.equal(report.status, 'NEEDS_IMPROVEMENT');
  assert.equal(report.skill.name, 'sample-skill');
  assert.ok(report.findings.some((finding: string) => /workflow/i.test(finding)));
  assert.ok(report.followUpQuestions.some((question: string) => /must be available/i.test(question)));
  assert.match(renderStaticValidationMarkdown(report), /Follow-up Questions/);
});

test('buildStaticValidation preserves caller-provided draft path labels', () => {
  const report = buildStaticValidation(
    `---\nname: sample-skill\ndescription: Use when the user needs a sample skill.\n---\n<when_to_use><item>Use it.</item></when_to_use>\n<when_not_to_use><item>Do not use it.</item></when_not_to_use>\n<input_requirements><required>Context</required></input_requirements>\n<workflow><step>Act</step></workflow>\n<output_requirements><requirement>Return a result</requirement></output_requirements>\n<validation><item>Check success</item></validation>\n`,
    'proposal/draft-skill.md',
  );

  assert.equal(report.skill.path, path.resolve('proposal/draft-skill.md'));
  assert.equal(report.status, 'PASS');
  assert.ok(report.qualityRubric.overallScore > 0);
  assert.equal(report.qualityRubric.metrics.length, 14);
});

test('buildStaticValidation emits compactness advisories for verbose but valid skills', () => {
  const report = buildStaticValidation(
    `---\nname: docs-guide\ndescription: Use when the request is for a practical guide or setup/use instructions for a project-specific tool, package, environment, or repo operation.\n---\n<purpose>\n  <item>Create practical documentation that helps a reader use, configure, start, support, or operate a concrete project-specific tool, package, workflow, or environment.</item>\n  <item>Cover user guides, setup manuals, run manuals, usage instructions, and operational rules tied to concrete project artifacts.</item>\n</purpose>\n<when_to_use>\n  <item importance="critical">Use when the user explicitly asks for a guide, instruction, manual, setup document, run document, usage note, or operational rules for a concrete project-specific tool, package, workflow, or environment.</item>\n  <item importance="high">Use when the expected output must help someone perform a real task correctly: install, configure, launch, operate, troubleshoot, or use something specific to the project.</item>\n  <item importance="high">Use when the document should contain actionable steps, commands, options, constraints, or operating rules rather than theory or internals.</item>\n</when_to_use>\n<input_requirements>\n  <required>The target artifact, workflow, environment, or process.</required>\n  <required>The intended audience.</required>\n  <required>The prerequisites, warnings, and constraints.</required>\n  <required>The destination path or naming context.</required>\n</input_requirements>\n<workflow>\n  <step>Confirm the request is for practical usage or operation, not theory or architecture.</step>\n  <step>Identify audience, goal, prerequisites, commands, options, success checks, and failure points before drafting.</step>\n  <step>Organize the guide into purpose, prerequisites, setup, usage, rules, troubleshooting, and verification.</step>\n  <step>Write concise, action-oriented instructions using the exact project terms, commands, and paths relevant to the task.</step>\n</workflow>\n<output_requirements>\n  <requirement>Produce a structured guide with clear headings and a logical execution flow.</requirement>\n  <requirement>Make steps, commands, options, and expected results explicit and reproducible.</requirement>\n  <requirement>Keep content practical and project-specific; avoid theory and general education.</requirement>\n</output_requirements>\n<when_not_to_use>\n  <item importance="critical">Do not use for architecture descriptions, technical overviews, or conceptual explanations.</item>\n  <item importance="critical">Do not use for programming theory, coding standards, or design patterns.</item>\n  <item importance="critical">Do not use for generic tutorials not tied to a specific project artifact.</item>\n  <item importance="critical">Do not use for implementation, code review, or testing tasks.</item>\n</when_not_to_use>\n<validation>\n  <item importance="critical">The request is about how to use, configure, or operate a specific project artifact.</item>\n  <item importance="high">The output contains actionable steps, commands, or operational rules.</item>\n  <item importance="high">The guide is clear and usable by the intended audience without additional context.</item>\n</validation>\n`,
    '/repo/.opencode/skills/docs-guide/SKILL.md',
  );

  assert.equal(report.status, 'PASS');
  assert.ok(report.advisories.some((advisory: string) => /skill body is/i.test(advisory)));
  assert.ok(report.advisories.some((advisory: string) => /when_to_use/i.test(advisory) || /semantically repetitive/i.test(advisory)));
  assert.ok(report.metrics.sectionWordCounts.when_to_use > 0);
  const markdown = renderStaticValidationMarkdown(report);
  assert.match(markdown, /Advisories/);
  assert.match(markdown, /Quality Rubric Summary/);
  assert.match(markdown, /\| Metric \| Score \| Reason \| Improvement \|/);
  assert.match(markdown, /\| Scope Coherence \| `\d+\/10` \|/);
  assert.doesNotMatch(markdown, /- Scope Coherence: \d+\/10/);
  assert.ok(report.qualityRubric.metrics.some((metric: { id: string; score: number }) => metric.id === 'concision' && metric.score < 8));
  assert.ok(report.qualityRubric.metrics.every((metric: { reason: string; improvement: string }) => metric.reason.length > 0 && metric.improvement.length > 0));
});

test('renderSimpleDiff emits fenced diff blocks for OpenCode highlighting', () => {
  const diff = renderSimpleDiff('line one\nline two', 'line one\nline three');

  assert.match(diff, /^# Suggested Skill Diff\n\n```diff\n/);
  assert.match(diff, /\n line one\n- line two\n\+ line three\n```/);
});

test('skill-authoring preview contract requires visible rubric table and diff fence in chat', async () => {
  const [skillText, checklistText, commandText, historyText] = await Promise.all([
    readFile('templates/skills/skill-authoring/SKILL.md', 'utf8'),
    readFile('templates/skills/skill-authoring/references/interactive-checklist.md', 'utf8'),
    readFile('templates/commands/skill-authoring.md', 'utf8'),
    readFile('templates/skills/skill-authoring/references/interactive-run-history.md', 'utf8'),
  ]);

  assert.match(skillText, /visible Markdown rubric table/i);
  assert.match(skillText, /diff fence language exactly `diff`/i);
  assert.match(skillText, /canonical git-style unified diff headers/i);
  assert.match(checklistText, /visible Markdown rubric table in chat/i);
  assert.match(checklistText, /opening fence language exactly `diff`/i);
  assert.match(checklistText, /diff --git a\/<target-path> b\/<target-path>/i);
  assert.match(commandText, /compact rubric table plus a fenced `diff` block/i);
  assert.match(commandText, /canonical git-style patch for the target path/i);
  assert.match(historyText, /canonical git-style unified diff headers/i);
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

test('cleanupRuntimeWorkingState removes transient runtime directories', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skill-authoring-cleanup-'));
  const runtime = buildRuntimePaths(tempDir);
  await prepareRuntimeDirs(runtime);
  await mkdir(path.join(runtime.homeDir, '.opencode'), { recursive: true });
  await writeFile(path.join(runtime.homeDir, '.opencode', 'marker.txt'), 'x', 'utf8');

  await cleanupRuntimeWorkingState(runtime);

  await assert.rejects(stat(runtime.homeDir));
  await assert.rejects(stat(runtime.xdgConfigHome));
  await assert.rejects(stat(runtime.xdgDataHome));
});

test('pruneRuntimeArchive removes heavyweight caches but keeps skills', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'skill-authoring-prune-'));
  const runtime = buildRuntimePaths(tempDir);
  await prepareRuntimeDirs(runtime);
  await mkdir(path.join(runtime.homeDir, '.npm', '_cacache'), { recursive: true });
  await mkdir(path.join(runtime.homeDir, '.bun', 'install', 'cache'), { recursive: true });
  await mkdir(path.join(runtime.homeDir, '.cache', 'opencode'), { recursive: true });
  await mkdir(path.join(runtime.homeDir, '.opencode', 'node_modules', 'zod'), { recursive: true });
  await mkdir(path.join(runtime.homeDir, '.opencode', 'skills', 'docs', 'changelog'), { recursive: true });
  await mkdir(path.join(runtime.xdgConfigHome, 'opencode', 'node_modules', 'zod'), { recursive: true });
  await mkdir(path.join(runtime.xdgDataHome, 'opencode', 'log'), { recursive: true });
  await writeFile(path.join(runtime.homeDir, '.npm', '_cacache', 'entry'), 'x', 'utf8');
  await writeFile(path.join(runtime.homeDir, '.opencode', 'skills', 'docs', 'changelog', 'SKILL.md'), '---\nname: docs-changelog\ndescription: sample\n---\n', 'utf8');
  await writeFile(path.join(runtime.xdgDataHome, 'opencode', 'opencode.db'), 'db', 'utf8');

  const pruned: string[] = await pruneRuntimeArchive(runtime);

  assert.ok(pruned.some((entry: string) => entry.endsWith(path.join('home', '.npm'))));
  await assert.rejects(stat(path.join(runtime.homeDir, '.npm')));
  await assert.rejects(stat(path.join(runtime.homeDir, '.bun')));
  await assert.rejects(stat(path.join(runtime.homeDir, '.cache')));
  await assert.rejects(stat(path.join(runtime.homeDir, '.opencode', 'node_modules')));
  await assert.rejects(stat(path.join(runtime.xdgConfigHome, 'opencode', 'node_modules')));
  await assert.rejects(stat(path.join(runtime.xdgDataHome, 'opencode', 'log')));
  await assert.rejects(stat(path.join(runtime.xdgDataHome, 'opencode', 'opencode.db')));
  await stat(path.join(runtime.homeDir, '.opencode', 'skills', 'docs', 'changelog', 'SKILL.md'));
});

test('shouldCleanupRuntimeArtifacts keeps failed runtimes by default', () => {
  assert.equal(shouldCleanupRuntimeArtifacts('failures', true), true);
  assert.equal(shouldCleanupRuntimeArtifacts('failures', false), false);
  assert.equal(shouldCleanupRuntimeArtifacts('always', true), false);
  assert.equal(shouldCleanupRuntimeArtifacts('never', false), true);
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

test('evaluateTriggerRoutingState settles when target skill loads or another tool starts', () => {
  const targetLoaded = evaluateTriggerRoutingState({
    loadedSkills: ['docs-changelog'],
    allLoadedSkills: ['shared-base-rules', 'docs-changelog'],
    toolCalls: [{ name: 'skill' }],
  }, 'docs-changelog');
  assert.equal(targetLoaded.routingSettled, true);
  assert.equal(targetLoaded.triggered, true);
  assert.equal(targetLoaded.settlingTool, 'skill');

  const otherToolStarted = evaluateTriggerRoutingState({
    loadedSkills: [],
    allLoadedSkills: ['shared-base-rules'],
    toolCalls: [{ name: 'skill' }, { name: 'grep' }],
  }, 'docs-changelog');
  assert.equal(otherToolStarted.routingSettled, true);
  assert.equal(otherToolStarted.triggered, false);
  assert.equal(otherToolStarted.settlingTool, 'grep');

  const competingSkillLoaded = evaluateTriggerRoutingState({
    loadedSkills: [],
    allLoadedSkills: ['shared-base-rules', 'task-use-research-code-strategy'],
    toolCalls: [{ name: 'skill' }],
  }, 'docs-changelog');
  assert.equal(competingSkillLoaded.routingSettled, true);
  assert.equal(competingSkillLoaded.triggered, false);
  assert.equal(competingSkillLoaded.settlingTool, 'skill:task-use-research-code-strategy');

  const notSettled = evaluateTriggerRoutingState({
    loadedSkills: [],
    allLoadedSkills: ['shared-base-rules'],
    toolCalls: [{ name: 'skill' }],
  }, 'docs-changelog');
  assert.equal(notSettled.routingSettled, false);
  assert.equal(notSettled.triggered, false);
  assert.equal(notSettled.settlingTool, null);
});

test('runAdaptiveTriggerEval reruns with fewer runs per query after timeout', async () => {
  const calls: Array<{ runDir: string; runsPerQuery: number }> = [];

  const output = await runAdaptiveTriggerEval({
    evalSet: [{ query: 'q', shouldTrigger: true }],
    skillDir: '/repo/skill',
    runDir: '/tmp/trigger-eval',
    runtimeRoot: '/tmp/runtime',
    installCommand: 'echo install',
    runsPerQuery: 3,
    fallbackRunsPerQuery: 1,
    runEval: async (options: { runDir: string; runsPerQuery: number }) => {
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
