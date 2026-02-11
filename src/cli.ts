import { checkbox, confirm, input, password } from '@inquirer/prompts';
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
      message: 'Choose MCP integrations to enable',
      instructions: 'Use Space to toggle, Enter to confirm',
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
  const templatesPlugins = path.join(templatesRoot, 'plugins');

  if (!(await pathExists(templatesAgents)) || !(await pathExists(templatesSkills))) {
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

  // Replace agents
  await removeIfExists(paths.targetAgents);
  report.push(`Replace: ${paths.targetAgents} <= ${templatesAgents}`);
  await copyDir(templatesAgents, paths.targetAgents);

  // Replace skills
  await removeIfExists(paths.targetSkills);
  report.push(`Replace: ${paths.targetSkills} <= ${templatesSkills}`);
  await copyDir(templatesSkills, paths.targetSkills);

  // Install plugins from template source (if provided)
  if (await pathExists(templatesPlugins)) {
    report.push(`Copy plugins: ${paths.targetPlugins} <= ${templatesPlugins}`);
    await ensureDir(paths.targetPlugins);
    await copyDir(templatesPlugins, paths.targetPlugins);
  } else {
    report.push(`Plugins: none in ${templatesRoot}`);
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

  const agentReplacements = await replaceAgentPlaceholders(paths.targetAgents, {
    [RESPONSE_LANGUAGE_PLACEHOLDER]: responseLanguage,
    ...mcpPermissionReplacements,
  });
  report.push(`Agents placeholders: ${agentReplacements} files updated`);

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

async function replaceAgentPlaceholders(rootDir: string, replacementsByToken: Record<string, string>): Promise<number> {
  let replacements = 0;

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      replacements += await replaceAgentPlaceholders(entryPath, replacementsByToken);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const content = await fs.readFile(entryPath, 'utf8');
    let updated = content;
    for (const [token, value] of Object.entries(replacementsByToken)) {
      if (!updated.includes(token)) continue;
      const lineScopedTokenRegex = new RegExp(`^(\\s*)${escapeRegex(token)}\\s*$`, 'gm');
      updated = updated.replace(lineScopedTokenRegex, (_match, indent: string) => indentBlock(value, indent));
    }

    if (updated !== content) {
      await writeFileAtomic(entryPath, updated);
      replacements += 1;
    }
  }

  return replacements;
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
