import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { remapPathIntoWorkspace } from '../eval/scripts/common.js';
import { judgeQuality } from '../eval/scripts/judge-quality.js';
import { judgeRouting } from '../eval/scripts/judge-routing.js';
import { parseEventText } from '../eval/scripts/parse-events.js';
import {
  applyEvalAgentPermissionProfile,
  applyEvalPermissionProfile,
} from '../eval/scripts/runtime-permissions.js';
import type { EvalCase, QualityRubric } from '../eval/scripts/types.js';

test('parseEventText extracts skills, tool calls, session id, and usage candidates', () => {
  const raw = [
    JSON.stringify({
      type: 'tool_call',
      name: 'skill',
      input: { name: 'review-code-security' },
      sessionId: 'session-123',
    }),
    JSON.stringify({
      type: 'message',
      role: 'assistant',
      content: 'request-changes: token is logged and auth can be bypassed',
      usage: { input_tokens: 120, completion_tokens: 80, total_tokens: 200 },
    }),
  ].join('\n');

  const trace = parseEventText(raw, ['review-code-security', 'docs-changelog']);

  assert.deepEqual(trace.loadedSkills, ['review-code-security']);
  assert.equal(trace.toolCalls.length, 1);
  assert.equal(trace.sessionIds[0], 'session-123');
  assert.equal(trace.usage.total, 200);
  assert.match(trace.responseText, /request-changes/i);
});

test('judgeRouting reports required misses and forbidden hits', () => {
  const testCase: EvalCase = {
    id: 'routing-case',
    agent: 'review',
    promptFile: 'prompt.md',
    fixtureDir: 'fixture',
    requiredSkills: ['review-code-security'],
    forbiddenSkills: ['docs-guide'],
    strictUnexpectedSkills: true,
    allowedBootstrapSkills: ['shared-base-rules'],
    allowedOptionalSkills: [],
  };

  const judgment = judgeRouting(testCase, {
    eventCount: 1,
    parseErrors: 0,
    sessionIds: [],
    toolCalls: [],
    skillCalls: [],
    loadedSkills: ['shared-base-rules', 'review-code-security', 'unknown-skill'],
    responseText: '',
    usage: { input: null, output: null, total: null, estimated: true, candidatesFound: 0 },
  });

  assert.equal(judgment.pass, false);
  assert.deepEqual(judgment.requiredMisses, []);
  assert.deepEqual(judgment.forbiddenHits, []);
  assert.deepEqual(judgment.unexpectedSkills, ['unknown-skill']);
});

test('judgeQuality scores weighted regex and min-length checks', () => {
  const rubric: QualityRubric = {
    id: 'quality-case',
    passThreshold: 0.75,
    checks: [
      {
        id: 'verdict',
        kind: 'regex_any',
        description: 'Contains a verdict',
        patterns: ['request-changes'],
        weight: 2,
      },
      {
        id: 'length',
        kind: 'min_length',
        description: 'Long enough',
        min: 20,
        weight: 1,
      },
      {
        id: 'no_hallucinated_approve',
        kind: 'regex_none',
        description: 'Does not say approve',
        patterns: ['approve'],
        weight: 1,
      },
    ],
  };

  const judgment = judgeQuality('request-changes: token exposure must be fixed before merge', rubric);

  assert.equal(judgment.pass, true);
  assert.equal(judgment.totalWeight, 4);
  assert.equal(judgment.earnedWeight, 4);
  assert.equal(judgment.score, 1);
});

test('parseEventText understands OpenCode text events and nested tokens', () => {
  const raw = [
    JSON.stringify({
      type: 'text',
      timestamp: 1,
      sessionID: 'session-456',
      part: {
        type: 'text',
        text: 'Intermediate assistant note',
      },
    }),
    JSON.stringify({
      type: 'step_finish',
      timestamp: 2,
      sessionID: 'session-456',
      part: {
        type: 'step-finish',
        reason: 'stop',
        tokens: {
          total: 321,
          input: 111,
          output: 210,
        },
      },
    }),
    JSON.stringify({
      type: 'text',
      timestamp: 3,
      sessionID: 'session-456',
      part: {
        type: 'text',
        text: 'Final answer with enough detail to be captured by the parser.',
      },
    }),
  ].join('\n');

  const trace = parseEventText(raw, []);

  assert.equal(trace.usage.total, 321);
  assert.equal(trace.usage.input, 111);
  assert.equal(trace.usage.output, 210);
  assert.match(trace.responseText, /Final answer/);
});

test('scoped artifact-writing agents allow write for their target doc paths', () => {
  const docAgent = readFileSync('templates/agents/doc.md', 'utf8');
  const projectAgent = readFileSync('templates/agents/project.md', 'utf8');
  const testAgent = readFileSync('templates/agents/test.md', 'utf8');

  assert.match(docAgent, /write:\s*\n\s*"\*": deny\s*\n\s*"ai-docs\/guides\/\*\*\.md": allow\s*\n\s*"ai-docs\/changelogs\/\*\*\.md": allow/m);
  assert.match(projectAgent, /write:\s*\n\s*"\*": deny\s*\n\s*"ai-docs\/project\/\*\*\.md": allow\s*\n\s*"ai-docs\/project\/status\.json": allow/m);
  assert.match(testAgent, /write:\s*\n\s*"\*": deny\s*\n\s*"ai-docs\/reports\/test-reports\/\*\*\.md": allow\s*\n\s*"ai-docs\/reports\/bug-reports\/\*\*\.md": allow/m);
  assert.match(docAgent, /edit:\s*\n\s*"\*": deny\s*\n\s*"ai-docs\/guides\/\*\*\.md": allow\s*\n\s*"ai-docs\/changelogs\/\*\*\.md": allow/m);
  assert.match(projectAgent, /edit:\s*\n\s*"\*": deny\s*\n\s*"ai-docs\/project\/\*\*\.md": allow\s*\n\s*"ai-docs\/project\/status\.json": allow/m);
  assert.match(testAgent, /edit:\s*\n\s*"\*": deny\s*\n\s*"ai-docs\/reports\/test-reports\/\*\*\.md": allow\s*\n\s*"ai-docs\/reports\/bug-reports\/\*\*\.md": allow/m);
  assert.match(docAgent, /<allowed>.*write, edit, apply_patch.*<\/allowed>/s);
  assert.match(projectAgent, /<allowed>.*write, edit, apply_patch.*<\/allowed>/s);
  assert.match(testAgent, /<allowed>.*write, edit, apply_patch.*<\/allowed>/s);
});

test('remapPathIntoWorkspace only rewrites paths inside the source fixture', () => {
  const fixtureDir = '/repo/eval/fixtures/repos/docs-space';
  const workspaceDir = '/repo/eval/runs/run-1/cases/case-1/attempt-1/workspace';

  assert.equal(
    remapPathIntoWorkspace(path.join(fixtureDir, 'ai-docs/changelogs/fast-replace.md'), fixtureDir, workspaceDir),
    path.join(workspaceDir, 'ai-docs/changelogs/fast-replace.md'),
  );
  assert.equal(
    remapPathIntoWorkspace('/repo/eval/prompts/docs/changelog-fast-replace.md', fixtureDir, workspaceDir),
    '/repo/eval/prompts/docs/changelog-fast-replace.md',
  );
});

test('applyEvalPermissionProfile relaxes only eval runtime agent writes', () => {
  const source = `{
  "permission": {
    "edit": "deny"
  },
  "agent": {
    "doc": {
      "permission": {
        "edit": {
          "*": "deny",
          "ai-docs/changelogs/**.md": "allow"
        }
      }
    },
    "project": {
      "permission": {
        "edit": {
          "*": "deny"
        }
      }
    },
    "test": {
      "permission": {
        "edit": {
          "*": "deny"
        }
      }
    },
    "review": {
      "permission": {
        "edit": "deny"
      }
    }
  }
}`;

  const patched = JSON.parse(applyEvalPermissionProfile(source, 'relaxed-artifact-writes')) as {
    agent: Record<string, { permission?: Record<string, unknown> }>;
  };

  assert.equal(patched.agent.doc?.permission?.write, 'allow');
  assert.equal(patched.agent.doc?.permission?.edit, 'allow');
  assert.equal(patched.agent.doc?.permission?.apply_patch, 'allow');
  assert.equal(patched.agent.project?.permission?.edit, 'allow');
  assert.equal(patched.agent.test?.permission?.apply_patch, 'allow');
  assert.equal(patched.agent.review?.permission?.edit, 'deny');
});

test('applyEvalAgentPermissionProfile rewrites scoped write tools to allow', () => {
  const source = `---
permission:
    write:
        "*": deny
        "ai-docs/changelogs/**.md": allow
    edit:
        "*": deny
        "ai-docs/changelogs/**.md": allow
    apply_patch:
        "*": deny
        "ai-docs/changelogs/**.md": allow
    question: allow
---
`;

  const patched = applyEvalAgentPermissionProfile(source, 'relaxed-artifact-writes');

  assert.match(patched, /permission:\n    write: allow\n    edit: allow\n    apply_patch: allow\n    question: allow/);
});
