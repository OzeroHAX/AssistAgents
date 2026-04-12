import test from 'node:test';
import assert from 'node:assert/strict';

import { renderGlobalConfigJsonc } from '../src/config-template.js';
import { getAllMcpToolPatterns } from '../src/mcp-registry.js';

const keyFiles = {
  zaiApi: '~/.opencode/keys/zai_api.txt',
  context7: '~/.opencode/keys/context7.txt',
  tavily: '~/.opencode/keys/tavily_search.txt',
};

function extractMcpSection(configJsonc: string): Record<string, unknown> {
  const withoutLineComments = configJsonc.replace(/^\s*\/\/.*$/gm, '');
  const parsed = JSON.parse(withoutLineComments) as { mcp?: Record<string, unknown> };
  return parsed.mcp ?? {};
}

function extractPermissionSection(configJsonc: string): Record<string, unknown> {
  const withoutLineComments = configJsonc.replace(/^\s*\/\/.*$/gm, '');
  const parsed = JSON.parse(withoutLineComments) as { permission?: Record<string, unknown> };
  return parsed.permission ?? {};
}

function extractAgentSection(configJsonc: string): Record<string, unknown> {
  const withoutLineComments = configJsonc.replace(/^\s*\/\/.*$/gm, '');
  const parsed = JSON.parse(withoutLineComments) as { agent?: Record<string, unknown> };
  return parsed.agent ?? {};
}

test('renderGlobalConfigJsonc produces empty mcp map when no integrations enabled', () => {
  const config = renderGlobalConfigJsonc(keyFiles, { enabledMcpIds: [] });
  const mcp = extractMcpSection(config);
  assert.deepEqual(mcp, {});
});

test('renderGlobalConfigJsonc includes only enabled mcp entries', () => {
  const config = renderGlobalConfigJsonc(keyFiles, { enabledMcpIds: ['github-grep'] });
  const mcp = extractMcpSection(config);

  assert.deepEqual(Object.keys(mcp), ['github-grep']);
});

test('renderGlobalConfigJsonc excludes key-required integrations when disabled', () => {
  const config = renderGlobalConfigJsonc(keyFiles, { enabledMcpIds: ['ddg-search'] });
  const mcp = extractMcpSection(config);

  assert.ok(!('tavily-search' in mcp));
  assert.ok(!('context7' in mcp));
  assert.ok(!('zai-web-search' in mcp));
  assert.ok(!('zai-web-reader' in mcp));
  assert.ok('ddg-search' in mcp);
});

test('renderGlobalConfigJsonc denies all MCP tool patterns from registry', () => {
  const config = renderGlobalConfigJsonc(keyFiles, { enabledMcpIds: [] });
  const permission = extractPermissionSection(config);

  for (const pattern of getAllMcpToolPatterns()) {
    assert.equal(permission[pattern], 'deny');
  }
});

test('renderGlobalConfigJsonc does not include manual MCP permission drift entries', () => {
  const config = renderGlobalConfigJsonc(keyFiles, { enabledMcpIds: [] });
  const permission = extractPermissionSection(config);

  assert.ok(!('pencil*' in permission));
});

test('renderGlobalConfigJsonc includes scoped write/edit overrides for doc, project, planner, skill-authoring, and test agents', () => {
  const config = renderGlobalConfigJsonc(keyFiles, { enabledMcpIds: [] });
  const agent = extractAgentSection(config) as Record<
    string,
    {
      permission?: {
        external_directory?: Record<string, string>;
        write?: Record<string, string>;
        edit?: Record<string, string>;
      };
    }
  >;

  const expectedDoc = {
    '*': 'deny',
    'ai-docs/guides/**.md': 'allow',
    '*ai-docs/guides/**.md': 'allow',
    'ai-docs/changelogs/**.md': 'allow',
    '*ai-docs/changelogs/**.md': 'allow',
  };
  const expectedProject = {
    '*': 'deny',
    'ai-docs/project/**.md': 'allow',
    '*ai-docs/project/**.md': 'allow',
    'ai-docs/project/status.json': 'allow',
    '*ai-docs/project/status.json': 'allow',
  };
  const expectedPlanner = {
    '*': 'deny',
    'ai-docs/dev-plans/**.md': 'allow',
    '*ai-docs/dev-plans/**.md': 'allow',
  };
  const expectedTest = {
    '*': 'deny',
    'ai-docs/reports/test-reports/**.md': 'allow',
    '*ai-docs/reports/test-reports/**.md': 'allow',
    'ai-docs/reports/bug-reports/**.md': 'allow',
    '*ai-docs/reports/bug-reports/**.md': 'allow',
  };
  const expectedSkillAuthoring = {
    '*': 'deny',
    '.opencode/skills/**': 'allow',
    '*.opencode/skills/**': 'allow',
    'templates/skills/**': 'allow',
    '*templates/skills/**': 'allow',
    'ai-docs/skill-authoring/**': 'allow',
    '*ai-docs/skill-authoring/**': 'allow',
  };
  const expectedSkillAuthoringExternal = {
    '~/.opencode/skills/skill-authoring/**': 'allow',
  };

  assert.deepEqual(agent.doc?.permission?.write, expectedDoc);
  assert.deepEqual(agent.doc?.permission?.edit, expectedDoc);
  assert.deepEqual(agent.project?.permission?.write, expectedProject);
  assert.deepEqual(agent.project?.permission?.edit, expectedProject);
  assert.deepEqual(agent.planner?.permission?.write, expectedPlanner);
  assert.deepEqual(agent.planner?.permission?.edit, expectedPlanner);
  assert.deepEqual(agent['skill-authoring']?.permission?.external_directory, expectedSkillAuthoringExternal);
  assert.deepEqual(agent['skill-authoring']?.permission?.write, expectedSkillAuthoring);
  assert.deepEqual(agent['skill-authoring']?.permission?.edit, expectedSkillAuthoring);
  assert.deepEqual(agent.test?.permission?.write, expectedTest);
  assert.deepEqual(agent.test?.permission?.edit, expectedTest);
});
