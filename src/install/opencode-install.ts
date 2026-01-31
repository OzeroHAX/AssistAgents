import path from 'node:path';
import fs from 'node:fs/promises';

import { renderGlobalConfigJsonc } from '../config-template.js';
import { zipDirectory } from '../backup.js';
import { chmod600IfPossible, copyDir, ensureDir, isNonEmptyDir, pathExists, removeIfExists, writeFileAtomic } from '../fs-utils.js';
import { getInstallPaths, getKeyFileRefs } from '../paths.js';
import { buildSkillCopyPlan } from '../skill-selection.js';
import { promptBackupChoice, promptForMissingKeys, promptLanguages, promptResponseLanguage } from './prompt.js';
import { ensureInteractive, type PromptContext } from './prompt-context.js';
import { getTemplatesRoot } from './templates.js';
import { timestampForBak } from './common.js';

const RESPONSE_LANGUAGE_PLACEHOLDER = '{{response_language}}';

type InstallReport = {
  lines: string[];
  missingKeys: string[];
};

async function writeKeyFile(filePath: string, value: string | undefined): Promise<{ action: 'written' | 'created-empty' | 'kept' }> {
  const exists = await pathExists(filePath);

  if (value !== undefined) {
    await writeFileAtomic(filePath, `${value}\n`);
    await chmod600IfPossible(filePath);
    return { action: 'written' };
  }

  if (exists) return { action: 'kept' };

  await writeFileAtomic(filePath, '');
  await chmod600IfPossible(filePath);
  return { action: 'created-empty' };
}

async function isKeyFileFilled(filePath: string): Promise<boolean> {
  try {
    const content = (await fs.readFile(filePath, 'utf8')).trim();
    return content.length > 0;
  } catch {
    return false;
  }
}

async function backupExistingOpencode(paths: { targetRoot: string; backupDir: string }): Promise<string | undefined> {
  const nonEmpty = await isNonEmptyDir(paths.targetRoot);
  if (!nonEmpty) return undefined;
  return await zipDirectory({ sourceDir: paths.targetRoot, backupDir: paths.backupDir });
}

async function maybeBackupConfig(globalConfigPath: string): Promise<string | undefined> {
  if (!(await pathExists(globalConfigPath))) return undefined;
  const bakPath = `${globalConfigPath}.bak-${timestampForBak()}`;
  await fs.copyFile(globalConfigPath, bakPath);
  return bakPath;
}

async function replaceResponseLanguagePlaceholders(rootDir: string, responseLanguage: string): Promise<number> {
  let replacements = 0;

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      replacements += await replaceResponseLanguagePlaceholders(entryPath, responseLanguage);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const content = await fs.readFile(entryPath, 'utf8');
    if (!content.includes(RESPONSE_LANGUAGE_PLACEHOLDER)) continue;

    const updated = content.split(RESPONSE_LANGUAGE_PLACEHOLDER).join(responseLanguage);
    if (updated !== content) {
      await writeFileAtomic(entryPath, updated);
      replacements += 1;
    }
  }

  return replacements;
}

export async function runOpenCodeInstall(promptCtx: PromptContext): Promise<InstallReport> {
  ensureInteractive(promptCtx);

  const { doBackup, backupDir } = await promptBackupChoice(promptCtx);
  const paths = backupDir ? getInstallPaths(backupDir) : getInstallPaths();
  const templatesRoot = getTemplatesRoot();
  const templatesAgents = path.join(templatesRoot, 'agents');
  const templatesSkills = path.join(templatesRoot, 'skills');

  if (!(await pathExists(templatesAgents)) || !(await pathExists(templatesSkills))) {
    throw new Error(`templates not found at ${templatesRoot}. Is the package built correctly?`);
  }

  const keyRefs = getKeyFileRefs();
  const report: string[] = [];
  const missingKeys: string[] = [];

  report.push(`Target: ${paths.targetRoot}`);
  report.push('Mode: apply');

  if (doBackup) {
    const zipBackupPath = await backupExistingOpencode({ targetRoot: paths.targetRoot, backupDir: paths.backupDir });
    if (zipBackupPath) report.push(`Backup zip: ${zipBackupPath}`);
  } else {
    report.push('Backup: skipped');
  }

  const responseLanguage = await promptResponseLanguage(promptCtx);
  report.push(`Response language: ${responseLanguage}`);

  // Replace agents
  await removeIfExists(paths.targetAgents);
  report.push(`Replace: ${paths.targetAgents} <= ${templatesAgents}`);
  await copyDir(templatesAgents, paths.targetAgents);

  const agentReplacements = await replaceResponseLanguagePlaceholders(paths.targetAgents, responseLanguage);
  report.push(`Agents language placeholders: ${agentReplacements} replaced`);

  // Replace skills (selective)
  const languages = await promptLanguages(promptCtx);
  const skillPlan = buildSkillCopyPlan(languages);
  await removeIfExists(paths.targetSkills);
  report.push(`Replace: ${paths.targetSkills} <= ${templatesSkills} (selected: ${languages.join(',')})`);
  for (const rel of skillPlan.relDirs) {
    const src = path.join(templatesSkills, rel);
    const dst = path.join(paths.targetSkills, rel);
    report.push(`  - copy ${src} -> ${dst}`);
    if (await pathExists(src)) await copyDir(src, dst);
  }

  // Keys
  report.push(`Keys dir: ${paths.targetKeys}`);
  await ensureDir(paths.targetKeys);

  const keyFiles = {
    zaiApi: path.join(paths.targetKeys, 'zai_api.txt'),
    context7: path.join(paths.targetKeys, 'context7.txt'),
    tavily: path.join(paths.targetKeys, 'tavily_search.txt'),
  };

  const keyInput = await promptForMissingKeys({ keyFiles }, promptCtx, isKeyFileFilled);

  const keyWrites: Array<{ name: string; filePath: string; action: string; inputProvided: boolean }> = [
    { name: 'zai_api', filePath: keyFiles.zaiApi, action: '', inputProvided: keyInput.zaiApi !== undefined },
    { name: 'context7', filePath: keyFiles.context7, action: '', inputProvided: keyInput.context7 !== undefined },
    { name: 'tavily_search', filePath: keyFiles.tavily, action: '', inputProvided: keyInput.tavily !== undefined },
  ];

  {
    const r1 = await writeKeyFile(keyWrites[0]!.filePath, keyInput.zaiApi);
    keyWrites[0]!.action = r1.action;
    const r2 = await writeKeyFile(keyWrites[1]!.filePath, keyInput.context7);
    keyWrites[1]!.action = r2.action;
    const r3 = await writeKeyFile(keyWrites[2]!.filePath, keyInput.tavily);
    keyWrites[2]!.action = r3.action;
  }

  for (const k of keyWrites) {
    report.push(`Key file: ${k.filePath} (${k.action}${k.inputProvided ? ', provided' : ''})`);
    if (!(await isKeyFileFilled(k.filePath))) missingKeys.push(k.filePath);
  }

  // Global config
  const configBak = await maybeBackupConfig(paths.globalConfig);
  if (configBak) report.push(`Config backup: ${configBak}`);

  const configContent = renderGlobalConfigJsonc({
    zaiApi: keyRefs.zaiApi,
    context7: keyRefs.context7,
    tavily: keyRefs.tavily,
  });
  report.push(`Write: ${paths.globalConfig}`);
  await writeFileAtomic(paths.globalConfig, configContent);

  return { lines: report, missingKeys };
}
