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
