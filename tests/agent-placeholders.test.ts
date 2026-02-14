import test from 'node:test';
import assert from 'node:assert/strict';
import { globSync } from 'glob';
import { readFileSync } from 'node:fs';

import { AGENT_MCP_CONFIGS } from '../src/agent-config/index.js';
import { ALL_MCP_IDS } from '../src/mcp-registry.js';

const PLACEHOLDER_PATTERN = /\{\{mcp_([a-z_]+)_permissions\}\}/g;

function extractPlaceholderTokensFromTemplates(): Set<string> {
  const templateFiles = globSync('templates/agents/**/*.md');
  const tokens = new Set<string>();

  for (const filePath of templateFiles) {
    const content = readFileSync(filePath, 'utf-8');
    let match: RegExpExecArray | null;
    while ((match = PLACEHOLDER_PATTERN.exec(content)) !== null) {
      tokens.add(match[0]);
    }
  }

  return tokens;
}

test('all placeholder tokens in templates have corresponding config', () => {
  const tokensInTemplates = extractPlaceholderTokensFromTemplates();
  const configuredTokens = new Set(AGENT_MCP_CONFIGS.map((c) => c.placeholderToken));

  const missingConfigs: string[] = [];
  for (const token of tokensInTemplates) {
    if (!configuredTokens.has(token)) {
      missingConfigs.push(token);
    }
  }

  assert.deepEqual(
    missingConfigs,
    [],
    `Found placeholder tokens without config: ${missingConfigs.join(', ')}`,
  );
});

test('all configured placeholders have valid allowedMcpIds', () => {
  const validMcpIds = new Set(ALL_MCP_IDS);

  for (const config of AGENT_MCP_CONFIGS) {
    for (const mcpId of config.allowedMcpIds) {
      assert.ok(
        validMcpIds.has(mcpId),
        `Config "${config.id}" has invalid MCP ID "${mcpId}" in allowedMcpIds`,
      );
    }
  }
});

const FILE_TOOLS_DEV_PERMISSION_PLACEHOLDER = '{{file_tools_dev_permissions}}';

test('build/dev file-tools placeholder is wired in cli replacements', () => {
  const devTemplate = readFileSync('templates/agents/build/dev.md', 'utf-8');
  assert.match(devTemplate, /\{\{file_tools_dev_permissions\}\}/);

  const cliSource = readFileSync('src/cli.ts', 'utf-8');
  assert.match(
    cliSource,
    /const FILE_TOOLS_DEV_PERMISSION_PLACEHOLDER = '\{\{file_tools_dev_permissions\}\}';/,
    'src/cli.ts must define file tools placeholder token',
  );
  assert.match(
    cliSource,
    /\[FILE_TOOLS_DEV_PERMISSION_PLACEHOLDER\]:\s*fileToolsDevPermissions,/,
    'src/cli.ts must always provide replacement for file tools placeholder',
  );
  assert.equal(
    devTemplate.includes(FILE_TOOLS_DEV_PERMISSION_PLACEHOLDER),
    true,
    'build/dev template must include file tools placeholder',
  );
});