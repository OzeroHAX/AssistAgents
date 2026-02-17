import { checkbox, confirm, input, password, select } from '@inquirer/prompts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import { Readable, Writable } from 'node:stream';

import { renderGlobalConfigJsonc } from './config-template.js';
import { AGENT_MCP_CONFIGS } from './agent-config/index.js';
import { zipDirectory } from './backup.js';
import { chmod600IfPossible, copyDir, ensureDir, isNonEmptyDir, pathExists, removeIfExists, writeFileAtomic } from './fs-utils.js';
import { buildKeyFiles, getKeyLabel, type KeyId } from './key-registry.js';
import { getInstallPaths, getKeyFileRefs } from './paths.js';
import {
  ALL_MCP_IDS,
  collectRequiredKeys,
  getDefaultEnabledMcpIds,
  getMcpDefinitions,
  getMcpIdsRequiringKey,
  getToolPatternsForMcpIds,
  type McpId,
} from './mcp-registry.js';

const RESPONSE_LANGUAGE_PLACEHOLDER = '{{response_language}}';
const USER_SKILL_LEVEL_PLACEHOLDER = '{{user_skill_level}}';
const USER_KNOWN_TECH_XML_PLACEHOLDER = '{{user_known_tech_xml}}';
const USER_OS_PLACEHOLDER = '{{user_os}}';
const USER_SHELL_PLACEHOLDER = '{{user_shell}}';
const USER_COMMUNICATION_STYLE_PLACEHOLDER = '{{user_communication_style}}';
const FILE_TOOLS_DEV_PERMISSION_PLACEHOLDER = '{{file_tools_dev_permissions}}';
const BASH_READONLY_PERMISSION_PLACEHOLDER = '{{bash_readonly_permissions}}';
const MODEL_ASSIST_PLACEHOLDER = '{{model_assist}}';
const MODEL_PROJECT_PLACEHOLDER = '{{model_project}}';
const MODEL_BUILD_PLANNER_PLACEHOLDER = '{{model_build_planner}}';
const MODEL_BUILD_DEV_PLACEHOLDER = '{{model_build_dev}}';
const MODEL_REVIEW_PLACEHOLDER = '{{model_review}}';
const MODEL_TEST_PLACEHOLDER = '{{model_test}}';
const MODEL_ASK_PLACEHOLDER = '{{model_ask}}';
const MODEL_DOC_PLACEHOLDER = '{{model_doc}}';

type AgentModelTarget = {
  id: 'assist' | 'project' | 'build/planner' | 'build/dev' | 'review' | 'test' | 'ask' | 'doc';
  label: string;
  defaultModel: string;
  placeholderTokens: string[];
};

const AGENT_MODEL_TARGETS: AgentModelTarget[] = [
  {
    id: 'assist',
    label: 'assist*',
    defaultModel: 'zai-coding-plan/glm-5',
    placeholderTokens: [MODEL_ASSIST_PLACEHOLDER],
  },
  {
    id: 'project',
    label: 'project',
    defaultModel: 'openai/gpt-5.2',
    placeholderTokens: [MODEL_PROJECT_PLACEHOLDER],
  },
  {
    id: 'build/planner',
    label: 'build/planner',
    defaultModel: 'openai/gpt-5.2',
    placeholderTokens: [MODEL_BUILD_PLANNER_PLACEHOLDER],
  },
  {
    id: 'build/dev',
    label: 'build/dev',
    defaultModel: 'openai/gpt-5.3-codex',
    placeholderTokens: [MODEL_BUILD_DEV_PLACEHOLDER],
  },
  {
    id: 'review',
    label: 'review',
    defaultModel: 'zai-coding-plan/glm-5',
    placeholderTokens: [MODEL_REVIEW_PLACEHOLDER],
  },
  {
    id: 'test',
    label: 'test',
    defaultModel: 'zai-coding-plan/glm-5',
    placeholderTokens: [MODEL_TEST_PLACEHOLDER],
  },
  {
    id: 'ask',
    label: 'ask',
    defaultModel: 'zai-coding-plan/glm-5',
    placeholderTokens: [MODEL_ASK_PLACEHOLDER],
  },
  {
    id: 'doc',
    label: 'doc',
    defaultModel: 'zai-coding-plan/glm-5',
    placeholderTokens: [MODEL_DOC_PLACEHOLDER],
  },
];

const ALL_MODEL_PLACEHOLDER_TOKENS = AGENT_MODEL_TARGETS.flatMap((target) => target.placeholderTokens);

const DEV_CLASSIC_FILE_TOOLS_PERMISSIONS = [
  'read: allow',
  'grep: allow',
  'glob: allow',
  'list: allow',
  'edit: allow',
  'write: allow',
  'apply_patch: allow',
].join('\n');
const DEV_HASH_FILE_TOOLS_PERMISSIONS = [
  'hashread: allow',
  'hashgrep: allow',
  'hashedit: allow',
].join('\n');
const BASH_READONLY_PERMISSIONS = [
  '"git status *": allow',
  '"git diff --stat *": allow',
  '"git diff *": allow',
  '"git log --oneline -n *": allow',
  '"git log *": allow',
  '"git show --stat *": allow',
  '"git ls-files *": allow',
  '"git rev-parse --show-toplevel": allow',
  '"ls *": allow',
  '"find *": allow',
  '"grep *": allow',
  '"head *": allow',
  '"tree *": allow',
  '"true": allow',
  '"pwd": allow',
  '"date *": allow',
].join('\n');

function getTemplatesRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  // dist/cli.js -> packageRoot
  return path.resolve(here, '..');
}

function resolveTemplateRoot(): string {
  const packageRoot = getTemplatesRoot();
  return path.resolve(packageRoot, 'templates');
}

async function writeKeyFile(filePath: string, value: string | undefined, dryRun: boolean): Promise<{ action: 'written' | 'kept' | 'skipped' }>{
  const exists = await pathExists(filePath);

  if (value !== undefined) {
    if (!dryRun) {
      await writeFileAtomic(filePath, `${value}\n`);
      await chmod600IfPossible(filePath);
    }
    return { action: 'written' };
  }

  if (exists) return { action: 'kept' };
  return { action: 'skipped' };
}

type PromptContext = { input: Readable; output: Writable } | undefined;

type UserSkillLevel = 'Zero' | 'Junior' | 'Middle' | 'Senior';
type UserCommunicationStyle = 'direct' | 'friendly' | 'academic';

type UserProfile = {
  skillLevel: UserSkillLevel;
  knownTech: string[];
  os: string;
  shell: string;
  communicationStyle: UserCommunicationStyle;
};

function tryGetPromptContext(): PromptContext {
  const ttyOk = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  if (ttyOk) return undefined;

  // Some runners (npm exec/npx) may not provide a TTY stdin even in a terminal.
  // Try to attach to /dev/tty on Unix.
  if (process.platform !== 'win32') {
    try {
      // createReadStream('/dev/tty') can emit async errors that bypass try/catch.
      // Use openSync so we can fail fast and safely.
      const inFd = fsSync.openSync('/dev/tty', 'r');
      const outFd = fsSync.openSync('/dev/tty', 'w');

      const input = fsSync.createReadStream('', { fd: inFd, autoClose: true });
      const output = fsSync.createWriteStream('', { fd: outFd, autoClose: true });

      input.on('error', () => {});
      output.on('error', () => {});

      return { input, output };
    } catch {
      return undefined;
    }
  }

  return undefined;
}

async function isKeyFileFilled(filePath: string): Promise<boolean> {
  try {
    const content = (await fs.readFile(filePath, 'utf8')).trim();
    return content.length > 0;
  } catch {
    return false;
  }
}

async function promptEnabledMcpIds(keyFilledState: Record<KeyId, boolean>): Promise<McpId[]> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  const defaults = new Set(getDefaultEnabledMcpIds(keyFilledState));
  const selected = await checkbox(
    {
      message: 'Choose MCP integrations to enable (Space to toggle, Enter to confirm)',
      choices: getMcpDefinitions().map((mcp) => ({
        name: mcp.requiresKeys.length === 0 ? `${mcp.label} (no key required)` : `${mcp.label} (requires: ${mcp.requiresKeys.join(', ')})`,
        value: mcp.id,
        checked: defaults.has(mcp.id),
      })),
      required: false,
    },
    promptCtx
  );

  return selected as McpId[];
}

async function promptForEnabledKeys(opts: {
  keyFiles: Record<KeyId, string>;
  keyFilledState: Record<KeyId, boolean>;
  enabledMcpIds: McpId[];
}): Promise<{ keyInput: { zaiApi?: string; context7?: string; tavily?: string }; enabledMcpIds: McpId[] }> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  const keyInput: { zaiApi?: string; context7?: string; tavily?: string } = {};
  const enabled = new Set(opts.enabledMcpIds);

  for (const keyId of collectRequiredKeys(opts.enabledMcpIds)) {
    const filePath = opts.keyFiles[keyId];
    const filled = opts.keyFilledState[keyId];

    if (filled) {
      const keep = await confirm(
        { message: `${getKeyLabel(keyId)}: file already has a value (${filePath}). Keep it?`, default: true },
        promptCtx
      );

      if (keep) continue;

      const value = await password(
        {
          message: `Enter ${getKeyLabel(keyId)} (we will store it in ${filePath})`,
          mask: '*',
          validate: (v) => (v.trim().length > 0 ? true : 'Value cannot be empty'),
        },
        promptCtx
      );
      keyInput[keyId] = value;
      continue;
    }

    const enterNow = await confirm(
      { message: `${getKeyLabel(keyId)} not found. Enter it now?`, default: false },
      promptCtx
    );

    if (!enterNow) {
      for (const mcpId of getMcpIdsRequiringKey(Array.from(enabled), keyId)) {
        enabled.delete(mcpId);
      }
      continue;
    }

    const value = await password(
      {
        message: `Enter ${getKeyLabel(keyId)} (we will store it in ${filePath})`,
        mask: '*',
        validate: (v) => (v.trim().length > 0 ? true : 'Value cannot be empty'),
      },
      promptCtx
    );
    keyInput[keyId] = value;
  }

  return { keyInput, enabledMcpIds: ALL_MCP_IDS.filter((id) => enabled.has(id)) };
}

async function promptResponseLanguage(): Promise<string> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  const responseLanguage = await input(
    {
      message: 'Preferred response language?',
      default: 'English',
      validate: (value) => (value.trim().length > 0 ? true : 'Please enter a language'),
    },
    promptCtx
  );

  return responseLanguage.trim();
}

async function promptUserSkillLevel(): Promise<UserSkillLevel> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  return await select<UserSkillLevel>(
    {
      message: 'Preferred user skill level?',
      default: 'Senior',
      choices: [
        { name: 'Zero', value: 'Zero' },
        { name: 'Junior', value: 'Junior' },
        { name: 'Middle', value: 'Middle' },
        { name: 'Senior', value: 'Senior' },
      ],
    },
    promptCtx
  );
}

async function promptKnownTechnologies(): Promise<string[]> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  const rawValue = await input(
    {
      message: 'Known technologies (comma-separated)?',
      default: 'TypeScript, C#, Docker',
    },
    promptCtx
  );

  return parseKnownTechnologies(rawValue);
}

async function promptCommunicationStyle(): Promise<UserCommunicationStyle> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  return await select<UserCommunicationStyle>(
    {
      message: 'Communication style?',
      default: 'friendly',
      choices: [
        { name: 'direct', value: 'direct' },
        { name: 'friendly', value: 'friendly' },
        { name: 'academic', value: 'academic' },
      ],
    },
    promptCtx
  );
}

async function promptAgentModels(): Promise<Record<string, string>> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('No TTY available for interactive mode (run from a terminal).');
  }

  const selectedTargets = await checkbox(
    {
      message: 'Select agents to set explicit models (optional, Space to toggle, Enter to confirm)',
      choices: AGENT_MODEL_TARGETS.map((target) => ({
        name: target.label,
        value: target.id,
        checked: false,
      })),
      required: false,
    },
    promptCtx
  );

  if (selectedTargets.length === 0) {
    return {};
  }

  const replacementsByToken: Record<string, string> = {};
  for (const targetId of selectedTargets as AgentModelTarget['id'][]) {
    const target = AGENT_MODEL_TARGETS.find((item) => item.id === targetId);
    if (!target) continue;

    const rawModel = await input(
      {
        message: `Model for ${target.label}`,
        default: target.defaultModel,
        validate: (value) => {
          if (/[\r\n]/.test(value)) return 'Model must be a single line';
          if (value.trim().length === 0) return 'Model cannot be empty';
          return true;
        },
      },
      promptCtx
    );

    const model = rawModel.trim();
    for (const placeholderToken of target.placeholderTokens) {
      replacementsByToken[placeholderToken] = `model: ${model}`;
    }
  }

  return replacementsByToken;
}

async function backupExistingOpencode(paths: { targetRoot: string; backupDir: string }, dryRun: boolean): Promise<string | undefined> {
  const nonEmpty = await isNonEmptyDir(paths.targetRoot);
  if (!nonEmpty) return undefined;
  if (dryRun) return path.join(paths.backupDir, 'opencode-backup-YYYYMMDD-HHmmss.zip');
  return await zipDirectory({ sourceDir: paths.targetRoot, backupDir: paths.backupDir });
}

function timestampForBak(date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

async function maybeBackupConfig(globalConfigPath: string, dryRun: boolean): Promise<string | undefined> {
  if (!(await pathExists(globalConfigPath))) return undefined;
  const bakPath = `${globalConfigPath}.bak-${timestampForBak()}`;
  if (!dryRun) {
    await fs.copyFile(globalConfigPath, bakPath);
  }
  return bakPath;
}

async function main(): Promise<void> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('This installer only works in interactive TUI mode (TTY not found).');
  }

  const doBackup = await confirm({ message: 'Create a zip backup of current ~/.opencode before replacing?', default: true }, promptCtx);
  const backupDir = doBackup
    ? await input(
        { message: 'Where should backups be stored?', default: '~/.opencode-backups', required: true },
        promptCtx
      )
    : undefined;

  const paths = getInstallPaths(backupDir);
  const templatesRoot = resolveTemplateRoot();
  const templatesAgents = path.join(templatesRoot, 'agents');
  const templatesSkills = path.join(templatesRoot, 'skills');
  const templatesCommands = path.join(templatesRoot, 'commands');
  const templatesTools = path.join(templatesRoot, 'tools');

  if (!(await pathExists(templatesAgents)) || !(await pathExists(templatesSkills)) || !(await pathExists(templatesCommands))) {
    throw new Error(`templates not found at ${templatesRoot}. Is the package built correctly?`);
  }

  const keyRefs = getKeyFileRefs();
  const report: string[] = [];
  const missingKeys: string[] = [];

  report.push(`Target: ${paths.targetRoot}`);
  report.push('Mode: apply');
  report.push(`Templates source: templates (${templatesRoot})`);

  let zipBackupPath: string | undefined;
  if (doBackup) {
    zipBackupPath = await backupExistingOpencode({ targetRoot: paths.targetRoot, backupDir: paths.backupDir }, false);
    if (zipBackupPath) report.push(`Backup zip: ${zipBackupPath}`);
  } else {
    report.push('Backup: skipped');
  }

  const responseLanguage = await promptResponseLanguage();
  report.push(`Response language: ${responseLanguage}`);

  const skillLevel = await promptUserSkillLevel();
  report.push(`User skill level: ${skillLevel}`);

  const knownTech = await promptKnownTechnologies();
  report.push(`Known technologies: ${knownTech.length > 0 ? knownTech.join(', ') : 'none'}`);

  const communicationStyle = await promptCommunicationStyle();
  report.push(`Communication style: ${communicationStyle}`);

  const userProfile: UserProfile = {
    skillLevel,
    knownTech,
    os: detectUserOs(),
    shell: detectUserShell(),
    communicationStyle,
  };
  report.push(`User OS: ${userProfile.os}`);
  report.push(`User shell: ${userProfile.shell}`);

  const selectedModelReplacements = await promptAgentModels();
  const selectedModelLabels = AGENT_MODEL_TARGETS
    .filter((target) => target.placeholderTokens.some((token) => token in selectedModelReplacements))
    .map((target) => target.label);
  report.push(`Explicit agent models: ${selectedModelLabels.length > 0 ? selectedModelLabels.join(', ') : 'none'}`);

  const enableHashFileTools = await confirm(
    {
      message: 'Enable experimental hash-based file tools? (Improves weak models + speeds up edits)',
      default: false,
    },
    promptCtx
  );
  report.push(`Experimental hash file tools: ${enableHashFileTools ? 'enabled' : 'disabled'}`);

  // Replace agents
  await removeIfExists(paths.targetAgents);
  report.push(`Replace: ${paths.targetAgents} <= ${templatesAgents}`);
  await copyDir(templatesAgents, paths.targetAgents);

  // Replace skills
  await removeIfExists(paths.targetSkills);
  report.push(`Replace: ${paths.targetSkills} <= ${templatesSkills}`);
  await copyDir(templatesSkills, paths.targetSkills);

  // Replace commands
  await removeIfExists(paths.targetCommands);
  report.push(`Replace: ${paths.targetCommands} <= ${templatesCommands}`);
  await copyDir(templatesCommands, paths.targetCommands);

  if (enableHashFileTools) {
    if (await pathExists(templatesTools)) {
      report.push(`Copy tools: ${paths.targetTools} <= ${templatesTools}`);
      await removeIfExists(paths.targetTools);
      await copyDir(templatesTools, paths.targetTools);
    } else {
      report.push(`Tools: none in ${templatesRoot}`);
    }
  }

  // Keys
  report.push(`Keys dir: ${paths.targetKeys}`);
  await ensureDir(paths.targetKeys);

  const keyFiles = buildKeyFiles(paths.targetKeys);

  const keyFilledState: Record<KeyId, boolean> = {
    zaiApi: await isKeyFileFilled(keyFiles.zaiApi),
    context7: await isKeyFileFilled(keyFiles.context7),
    tavily: await isKeyFileFilled(keyFiles.tavily),
  };

  const selectedMcpIds = await promptEnabledMcpIds(keyFilledState);
  report.push(`Enabled MCP (selected): ${selectedMcpIds.length > 0 ? selectedMcpIds.join(', ') : 'none'}`);

  const { keyInput, enabledMcpIds } = await promptForEnabledKeys({
    keyFiles,
    keyFilledState,
    enabledMcpIds: selectedMcpIds,
  });
  report.push(`Enabled MCP (final): ${enabledMcpIds.length > 0 ? enabledMcpIds.join(', ') : 'none'}`);

  const mcpPermissionReplacements: Record<string, string> = Object.fromEntries(
    AGENT_MCP_CONFIGS.map((config) => [
      config.placeholderToken,
      renderPermissionLines(getToolPatternsForMcpIds(enabledMcpIds, config.allowedMcpIds)),
    ])
  );

  const fileToolsDevPermissions = enableHashFileTools
    ? DEV_HASH_FILE_TOOLS_PERMISSIONS
    : DEV_CLASSIC_FILE_TOOLS_PERMISSIONS;

  const modelPlaceholderReplacements: Record<string, string> = Object.fromEntries(
    ALL_MODEL_PLACEHOLDER_TOKENS.map((token) => [token, selectedModelReplacements[token] ?? ''])
  );
  const profilePlaceholders: Record<string, string> = {
    [RESPONSE_LANGUAGE_PLACEHOLDER]: responseLanguage,
    [USER_SKILL_LEVEL_PLACEHOLDER]: userProfile.skillLevel,
    [USER_KNOWN_TECH_XML_PLACEHOLDER]: renderKnownTechXml(userProfile.knownTech),
    [USER_OS_PLACEHOLDER]: userProfile.os,
    [USER_SHELL_PLACEHOLDER]: userProfile.shell,
    [USER_COMMUNICATION_STYLE_PLACEHOLDER]: userProfile.communicationStyle,
  };

  const agentReplacements = await replaceMarkdownPlaceholders(paths.targetAgents, {
    [RESPONSE_LANGUAGE_PLACEHOLDER]: responseLanguage,
    [FILE_TOOLS_DEV_PERMISSION_PLACEHOLDER]: fileToolsDevPermissions,
    [BASH_READONLY_PERMISSION_PLACEHOLDER]: BASH_READONLY_PERMISSIONS,
    ...modelPlaceholderReplacements,
    ...mcpPermissionReplacements,
  });
  report.push(`Agents placeholders: ${agentReplacements} files updated`);

  const skillReplacements = await replaceMarkdownPlaceholders(paths.targetSkills, profilePlaceholders);
  report.push(`Skills placeholders: ${skillReplacements} files updated`);

  const requiredKeys = new Set(collectRequiredKeys(enabledMcpIds));

  const keyWrites: Array<{ keyId: KeyId; filePath: string; action: string; inputProvided: boolean }> = [
    { keyId: 'zaiApi', filePath: keyFiles.zaiApi, action: '', inputProvided: keyInput.zaiApi !== undefined },
    { keyId: 'context7', filePath: keyFiles.context7, action: '', inputProvided: keyInput.context7 !== undefined },
    { keyId: 'tavily', filePath: keyFiles.tavily, action: '', inputProvided: keyInput.tavily !== undefined },
  ];

  for (const item of keyWrites) {
    if (!requiredKeys.has(item.keyId) && !item.inputProvided) {
      item.action = 'skipped';
      continue;
    }

    const result = await writeKeyFile(item.filePath, keyInput[item.keyId], false);
    item.action = result.action;
  }

  for (const k of keyWrites) {
    report.push(`Key file: ${k.filePath} (${k.action}${k.inputProvided ? ', provided' : ''})`);
    if (requiredKeys.has(k.keyId) && !(await isKeyFileFilled(k.filePath))) missingKeys.push(k.filePath);
  }

  // Global config
  const configBak = await maybeBackupConfig(paths.globalConfig, false);
  if (configBak) report.push(`Config backup: ${configBak}`);

  const configContent = renderGlobalConfigJsonc({
    zaiApi: keyRefs.zaiApi,
    context7: keyRefs.context7,
    tavily: keyRefs.tavily,
  }, { enabledMcpIds });
  report.push(`Write: ${paths.globalConfig}`);
  await writeFileAtomic(paths.globalConfig, configContent);

  // Output
  process.stdout.write(`${report.join('\n')}\n`);

  if (missingKeys.length > 0) {
    process.stdout.write(`\nMissing keys (fill these files):\n${missingKeys.map((p) => `- ${p}`).join('\n')}\n`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`assistagents failed: ${message}\n`);
  process.exitCode = 1;
});

function renderPermissionLines(patterns: string[]): string {
  return patterns.map((pattern) => `${pattern}: allow`).join('\n');
}

async function replaceMarkdownPlaceholders(rootDir: string, replacementsByToken: Record<string, string>): Promise<number> {
  let replacements = 0;

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      replacements += await replaceMarkdownPlaceholders(entryPath, replacementsByToken);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const content = await fs.readFile(entryPath, 'utf8');
    let updated = content;
    for (const [token, value] of Object.entries(replacementsByToken)) {
      if (!updated.includes(token)) continue;

      const lineScopedTokenRegex = new RegExp(`^(\\s*)${escapeRegex(token)}\\s*$`, 'gm');
      updated = updated.replace(lineScopedTokenRegex, (_match, indent: string) => indentBlock(value, indent));

      const inlineTokenRegex = new RegExp(escapeRegex(token), 'g');
      updated = updated.replace(inlineTokenRegex, () => value);
    }

    if (updated !== content) {
      await writeFileAtomic(entryPath, updated);
      replacements += 1;
    }
  }

  return replacements;
}

function parseKnownTechnologies(rawValue: string): string[] {
  return rawValue
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function renderKnownTechXml(technologies: string[]): string {
  return technologies
    .map((technology) => `<tech>${escapeXml(technology)}</tech>`)
    .join('\n');
}

function detectUserOs(): string {
  switch (process.platform) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'macOS';
    case 'linux':
      return 'Linux';
    default:
      return process.platform;
  }
}

function detectUserShell(): string {
  if (process.platform === 'win32') {
    const comSpec = process.env.ComSpec?.trim();
    if (!comSpec) return 'Unknown';
    return path.basename(comSpec);
  }

  const shell = process.env.SHELL?.trim();
  if (!shell) return 'Unknown';
  return path.basename(shell);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function indentBlock(content: string, indent: string): string {
  if (content.length === 0) return '';
  return content
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
