import { checkbox, confirm, input, password } from '@inquirer/prompts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import { Readable, Writable } from 'node:stream';

import { renderGlobalConfigJsonc } from './config-template.js';
import { zipDirectory } from './backup.js';
import { chmod600IfPossible, copyDir, ensureDir, isNonEmptyDir, pathExists, removeIfExists, writeFileAtomic } from './fs-utils.js';
import { getInstallPaths, getKeyFileRefs } from './paths.js';
import { ALL_LANGUAGES, buildSkillCopyPlan, type LanguageKey } from './skill-selection.js';

function getTemplatesRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  // dist/cli.js -> packageRoot/templates
  return path.resolve(here, '..', 'templates');
}

async function writeKeyFile(filePath: string, value: string | undefined, dryRun: boolean): Promise<{ action: 'written' | 'created-empty' | 'kept' }>{
  const exists = await pathExists(filePath);

  if (value !== undefined) {
    if (!dryRun) {
      await writeFileAtomic(filePath, `${value}\n`);
      await chmod600IfPossible(filePath);
    }
    return { action: 'written' };
  }

  if (exists) return { action: 'kept' };

  if (!dryRun) {
    await writeFileAtomic(filePath, '');
    await chmod600IfPossible(filePath);
  }
  return { action: 'created-empty' };
}

type PromptContext = { input: Readable; output: Writable } | undefined;

function tryGetPromptContext(): PromptContext {
  const ttyOk = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  if (ttyOk) return undefined;

  // Some runners (npm exec/npx) may not provide a TTY stdin even in a terminal.
  // Try to attach to /dev/tty on Unix.
  if (process.platform !== 'win32') {
    try {
      const input = fsSync.createReadStream('/dev/tty');
      const output = fsSync.createWriteStream('/dev/tty');
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

async function promptForMissingKeys(opts: {
  keyFiles: { zaiApi: string; context7: string; tavily: string };
}): Promise<{ zaiApi?: string; context7?: string; tavily?: string }> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('Нет TTY для интерактивного режима (запусти из терминала).');
  }

  const askOne = async (label: string, filePath: string): Promise<string | undefined> => {
    const filled = await isKeyFileFilled(filePath);
    if (filled) {
      const keep = await confirm(
        { message: `${label}: файл уже заполнен (${filePath}). Оставить как есть?`, default: true },
        promptCtx
      );
      if (keep) return undefined;
    }

    const value = await password(
      {
        message: `Введите ${label} (сохраним в ${filePath})`,
        mask: '*',
        validate: (v) => (v.trim().length > 0 ? true : 'Нужно непустое значение'),
      },
      promptCtx
    );
    return value;
  };

  const out: { zaiApi?: string; context7?: string; tavily?: string } = {};
  const zaiApi = await askOne('ZAI_API_KEY', opts.keyFiles.zaiApi);
  if (zaiApi !== undefined) out.zaiApi = zaiApi;
  const context7 = await askOne('CONTEXT7_API_KEY', opts.keyFiles.context7);
  if (context7 !== undefined) out.context7 = context7;
  const tavily = await askOne('TAVILY_API_KEY', opts.keyFiles.tavily);
  if (tavily !== undefined) out.tavily = tavily;

  return out;
}

async function promptLanguages(): Promise<LanguageKey[]> {
  const promptCtx = tryGetPromptContext();
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('Нет TTY для интерактивного режима (запусти из терминала).');
  }

  const selected = await checkbox<LanguageKey>(
    {
      message: 'Какие языки добавить?',
      choices: [
        { name: 'TypeScript', value: 'typescript', checked: true },
        { name: 'Rust', value: 'rust', checked: true },
        { name: 'C#', value: 'csharp', checked: true },
      ],
      validate: (values) => (values.length > 0 ? true : 'Выбери хотя бы один язык'),
    },
    promptCtx
  );
  return selected;
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
    throw new Error('Этот установщик работает только в интерактивном TUI режиме (TTY не найден).');
  }

  const doBackup = await confirm({ message: 'Сделать zip-бэкап текущего ~/.opencode перед заменой?', default: true }, promptCtx);
  const backupDir = doBackup
    ? await input(
        { message: 'Куда сохранить бэкапы?', default: '~/.opencode-backups', required: true },
        promptCtx
      )
    : undefined;

  const paths = getInstallPaths(backupDir);
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

  let zipBackupPath: string | undefined;
  if (doBackup) {
    zipBackupPath = await backupExistingOpencode({ targetRoot: paths.targetRoot, backupDir: paths.backupDir }, false);
    if (zipBackupPath) report.push(`Backup zip: ${zipBackupPath}`);
  } else {
    report.push('Backup: skipped');
  }

  // Replace agents
  await removeIfExists(paths.targetAgents);
  report.push(`Replace: ${paths.targetAgents} <= ${templatesAgents}`);
  await copyDir(templatesAgents, paths.targetAgents);

  // Replace skills (selective)
  const languages = await promptLanguages();
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

  const keyInput = await promptForMissingKeys({ keyFiles });

  const keyWrites: Array<{ name: string; filePath: string; action: string; inputProvided: boolean }> = [
    { name: 'zai_api', filePath: keyFiles.zaiApi, action: '', inputProvided: keyInput.zaiApi !== undefined },
    { name: 'context7', filePath: keyFiles.context7, action: '', inputProvided: keyInput.context7 !== undefined },
    { name: 'tavily_search', filePath: keyFiles.tavily, action: '', inputProvided: keyInput.tavily !== undefined },
  ];

  {
    const r1 = await writeKeyFile(keyWrites[0]!.filePath, keyInput.zaiApi, false);
    keyWrites[0]!.action = r1.action;
    const r2 = await writeKeyFile(keyWrites[1]!.filePath, keyInput.context7, false);
    keyWrites[1]!.action = r2.action;
    const r3 = await writeKeyFile(keyWrites[2]!.filePath, keyInput.tavily, false);
    keyWrites[2]!.action = r3.action;
  }

  for (const k of keyWrites) {
    report.push(`Key file: ${k.filePath} (${k.action}${k.inputProvided ? ', provided' : ''})`);
    if (!(await isKeyFileFilled(k.filePath))) missingKeys.push(k.filePath);
  }

  // Global config
  const configBak = await maybeBackupConfig(paths.globalConfig, false);
  if (configBak) report.push(`Config backup: ${configBak}`);

  const configContent = renderGlobalConfigJsonc({
    zaiApi: keyRefs.zaiApi,
    context7: keyRefs.context7,
    tavily: keyRefs.tavily,
  });
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
  process.stderr.write(`assistagents-setup failed: ${message}\n`);
  process.exitCode = 1;
});
