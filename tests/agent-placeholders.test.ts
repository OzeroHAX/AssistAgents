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
const BASH_READONLY_PERMISSION_PLACEHOLDER = '{{bash_readonly_permissions}}';

test('build-dev file-tools placeholder is wired in cli replacements', () => {
  const devTemplate = readFileSync('templates/agents/build-dev.md', 'utf-8');
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
    'build-dev template must include file tools placeholder',
  );
});

test('readonly bash placeholder is wired in cli and templates', () => {
  const cliSource = readFileSync('src/cli.ts', 'utf-8');
  assert.match(
    cliSource,
    /const BASH_READONLY_PERMISSION_PLACEHOLDER = '\{\{bash_readonly_permissions\}\}';/,
    'src/cli.ts must define readonly bash placeholder token',
  );
  assert.match(
    cliSource,
    /\[BASH_READONLY_PERMISSION_PLACEHOLDER\]:\s*BASH_READONLY_PERMISSIONS,/,
    'src/cli.ts must provide replacement for readonly bash placeholder',
  );

  const templates = [
    'templates/agents/doc.md',
    'templates/agents/build-planner.md',
    'templates/agents/project.md',
    'templates/agents/test.md',
    'templates/agents/assist-creator-decomposition.md',
    'templates/agents/assist-research-code.md',
  ];
  for (const filePath of templates) {
    const content = readFileSync(filePath, 'utf-8');
    assert.equal(
      content.includes(BASH_READONLY_PERMISSION_PLACEHOLDER),
      true,
      `${filePath} must include ${BASH_READONLY_PERMISSION_PLACEHOLDER}`,
    );
  }
});

const MODEL_PLACEHOLDER_EXPECTATIONS: Array<{ token: string; templates: string[]; cliConstantName: string }> = [
  {
    token: '{{model_assist}}',
    cliConstantName: 'MODEL_ASSIST_PLACEHOLDER',
    templates: [
      'templates/agents/assist-research-web.md',
      'templates/agents/assist-research-code.md',
      'templates/agents/assist-creator-decomposition.md',
    ],
  },
  {
    token: '{{model_project}}',
    cliConstantName: 'MODEL_PROJECT_PLACEHOLDER',
    templates: ['templates/agents/project.md'],
  },
  {
    token: '{{model_build_planner}}',
    cliConstantName: 'MODEL_BUILD_PLANNER_PLACEHOLDER',
    templates: ['templates/agents/build-planner.md'],
  },
  {
    token: '{{model_build_dev}}',
    cliConstantName: 'MODEL_BUILD_DEV_PLACEHOLDER',
    templates: ['templates/agents/build-dev.md'],
  },
  {
    token: '{{model_review}}',
    cliConstantName: 'MODEL_REVIEW_PLACEHOLDER',
    templates: ['templates/agents/review.md'],
  },
  {
    token: '{{model_test}}',
    cliConstantName: 'MODEL_TEST_PLACEHOLDER',
    templates: ['templates/agents/test.md'],
  },
  {
    token: '{{model_ask}}',
    cliConstantName: 'MODEL_ASK_PLACEHOLDER',
    templates: ['templates/agents/ask.md'],
  },
  {
    token: '{{model_doc}}',
    cliConstantName: 'MODEL_DOC_PLACEHOLDER',
    templates: ['templates/agents/doc.md'],
  },
];

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('model placeholders are wired in templates and cli replacements', () => {
  const cliSource = readFileSync('src/cli.ts', 'utf-8');

  for (const expectation of MODEL_PLACEHOLDER_EXPECTATIONS) {
    assert.match(
      cliSource,
      new RegExp(`const ${expectation.cliConstantName} = '${escapeForRegex(expectation.token)}';`),
      `src/cli.ts must define ${expectation.cliConstantName}`
    );

    for (const filePath of expectation.templates) {
      const content = readFileSync(filePath, 'utf-8');
      assert.equal(
        content.includes(expectation.token),
        true,
        `${filePath} must include ${expectation.token}`
      );
    }
  }

  assert.match(
    cliSource,
    /ALL_MODEL_PLACEHOLDER_TOKENS\.map\(\(token\) => \[token, selectedModelReplacements\[token\] \?\? ''\]\)/,
    'src/cli.ts must always provide replacements for all model placeholders'
  );
  assert.match(
    cliSource,
    /\.\.\.modelPlaceholderReplacements,/,
    'src/cli.ts must pass model replacements into replaceMarkdownPlaceholders(...)'
  );
});

const PROFILE_PLACEHOLDER_EXPECTATIONS: Array<{ token: string; cliConstantName: string }> = [
  { token: '{{response_language}}', cliConstantName: 'RESPONSE_LANGUAGE_PLACEHOLDER' },
  { token: '{{user_skill_level}}', cliConstantName: 'USER_SKILL_LEVEL_PLACEHOLDER' },
  { token: '{{user_known_tech_xml}}', cliConstantName: 'USER_KNOWN_TECH_XML_PLACEHOLDER' },
  { token: '{{user_os}}', cliConstantName: 'USER_OS_PLACEHOLDER' },
  { token: '{{user_shell}}', cliConstantName: 'USER_SHELL_PLACEHOLDER' },
  { token: '{{user_communication_style}}', cliConstantName: 'USER_COMMUNICATION_STYLE_PLACEHOLDER' },
];

test('profile placeholders are wired in base-rules skill and cli replacements', () => {
  const cliSource = readFileSync('src/cli.ts', 'utf-8');
  const baseRulesTemplate = readFileSync('templates/skills/shared/base-rules/SKILL.md', 'utf-8');

  for (const expectation of PROFILE_PLACEHOLDER_EXPECTATIONS) {
    assert.match(
      cliSource,
      new RegExp(`const ${expectation.cliConstantName} = '${escapeForRegex(expectation.token)}';`),
      `src/cli.ts must define ${expectation.cliConstantName}`
    );
    assert.equal(
      baseRulesTemplate.includes(expectation.token),
      true,
      `base-rules template must include ${expectation.token}`
    );
  }

  assert.match(
    cliSource,
    /const profilePlaceholders: Record<string, string> = \{/,
    'src/cli.ts must build profile replacements map'
  );
  assert.match(
    cliSource,
    /replaceMarkdownPlaceholders\(paths\.targetSkills, profilePlaceholders\)/,
    'src/cli.ts must apply profile placeholders to skills templates'
  );
});

test('markdown placeholder replacement supports inline tokens', () => {
  const cliSource = readFileSync('src/cli.ts', 'utf-8');

  assert.match(
    cliSource,
    /const inlineTokenRegex = new RegExp\(escapeRegex\(token\), 'g'\);/,
    'src/cli.ts must define global token regex for inline placeholders'
  );
  assert.match(
    cliSource,
    /updated = updated\.replace\(inlineTokenRegex, \(\) => value\);/,
    'src/cli.ts must replace inline placeholders using the same replacement map'
  );
});
