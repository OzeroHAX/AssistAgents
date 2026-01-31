import { checkbox, confirm, input, password, select } from '@inquirer/prompts';

import { type PromptContext } from './prompt-context.js';
import { type LanguageKey } from '../skill-selection.js';

export async function promptBackupChoice(promptCtx: PromptContext): Promise<{ doBackup: boolean; backupDir?: string }>{
  const doBackup = await confirm({ message: 'Create a zip backup of current ~/.opencode before replacing?', default: true }, promptCtx);
  const backupDir = doBackup
    ? await input(
        { message: 'Where should backups be stored?', default: '~/.opencode-backups', required: true },
        promptCtx
      )
    : undefined;

  const result: { doBackup: boolean; backupDir?: string } = { doBackup };
  if (backupDir !== undefined) result.backupDir = backupDir;
  return result;
}

export async function promptLanguages(promptCtx: PromptContext): Promise<LanguageKey[]> {
  const selected = await checkbox<LanguageKey>(
    {
      message: 'Which languages should be installed?',
      choices: [
        { name: 'TypeScript', value: 'typescript', checked: true },
        { name: 'Rust', value: 'rust', checked: true },
        { name: 'C#', value: 'csharp', checked: true },
      ],
      validate: (values) => (values.length > 0 ? true : 'Select at least one language'),
    },
    promptCtx
  );
  return selected;
}

export async function promptResponseLanguage(promptCtx: PromptContext): Promise<string> {
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

export async function promptForMissingKeys(
  opts: { keyFiles: { zaiApi: string; context7: string; tavily: string } },
  promptCtx: PromptContext,
  isKeyFileFilled: (filePath: string) => Promise<boolean>
): Promise<{ zaiApi?: string; context7?: string; tavily?: string }>{
  const askOne = async (label: string, filePath: string): Promise<string | undefined> => {
    const filled = await isKeyFileFilled(filePath);
    if (filled) {
      const keep = await confirm(
        { message: `${label}: file already has a value (${filePath}). Keep it?`, default: true },
        promptCtx
      );
      if (keep) return undefined;
    }

    const value = await password(
      {
        message: `Enter ${label} (we will store it in ${filePath})`,
        mask: '*',
        validate: (v) => (v.trim().length > 0 ? true : 'Value cannot be empty'),
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

export async function promptProductChoice(promptCtx: PromptContext): Promise<'opencode' | 'claude'> {
  return await select(
    {
      message: 'Which product should be installed?',
      choices: [
        { name: 'OpenCode', value: 'opencode' },
        { name: 'Claude Code', value: 'claude' },
      ],
      default: 'opencode',
    },
    promptCtx
  );
}

export async function promptClaudeConfig(promptCtx: PromptContext): Promise<boolean> {
  return await confirm({ message: 'Generate Claude Code config?', default: true }, promptCtx);
}

export async function promptClaudeToolsList(promptCtx: PromptContext): Promise<boolean> {
  return await confirm({ message: 'Print SLASH_COMMAND_TOOL_CHAR_BUDGET export snippet?', default: true }, promptCtx);
}
