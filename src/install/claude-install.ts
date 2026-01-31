import fs from 'node:fs/promises';
import { ensureDir, isNonEmptyDir, pathExists, removeIfExists, writeFileAtomic } from '../fs-utils.js';
import { getClaudePaths } from '../paths.js';
import { timestampForBak } from './common.js';
import { renderClaudeSettingsJson, describeClaudeSettingsPaths } from './claude-settings.js';
import { exportClaudeAgents } from './agent-export.js';
import { exportClaudeSkills } from './skills-export.js';
import { getTemplatesRoot } from './templates.js';
import { ensureInteractive, type PromptContext } from './prompt-context.js';
import { promptClaudeConfig, promptClaudeToolsList, promptResponseLanguage } from './prompt.js';

type ClaudeInstallReport = {
  lines: string[];
};

const TOOL_BUDGET_THRESHOLD = 50;
const TOOL_BUDGET_RECOMMENDED = 30000;

async function backupClaudeSettings(settingsPath: string): Promise<string | undefined> {
  if (!(await pathExists(settingsPath))) return undefined;
  const bakPath = `${settingsPath}.bak-${timestampForBak()}`;
  await fs.copyFile(settingsPath, bakPath);
  return bakPath;
}

function formatToolBudgetSnippet(): string {
  return `export SLASH_COMMAND_TOOL_CHAR_BUDGET=${TOOL_BUDGET_RECOMMENDED}`;
}

export async function runClaudeInstall(promptCtx: PromptContext): Promise<ClaudeInstallReport> {
  ensureInteractive(promptCtx);

  const doConfig = await promptClaudeConfig(promptCtx);
  const responseLanguage = doConfig ? await promptResponseLanguage(promptCtx) : undefined;

  const claudePaths = getClaudePaths();
  const templatesRoot = getTemplatesRoot();
  const report: string[] = [];

  await ensureDir(claudePaths.root);
  await ensureDir(claudePaths.agents);
  await ensureDir(claudePaths.skills);

  report.push(...describeClaudeSettingsPaths(claudePaths));

  if (doConfig) {
    const bakPath = await backupClaudeSettings(claudePaths.settings);
    if (bakPath) report.push(`Claude config backup: ${bakPath}`);

    const settings = responseLanguage
      ? renderClaudeSettingsJson({ responseLanguage })
      : renderClaudeSettingsJson({});
    await writeFileAtomic(claudePaths.settings, settings + '\n');
    report.push(`Write: ${claudePaths.settings}`);
  } else {
    report.push('Claude settings: skipped');
  }

  if (await isNonEmptyDir(claudePaths.agents)) {
    await removeIfExists(claudePaths.agents);
    await ensureDir(claudePaths.agents);
    report.push(`Replace: ${claudePaths.agents}`);
  }

  const agentResult = await exportClaudeAgents({ templatesRoot, claude: claudePaths });
  report.push(`Agents exported: ${agentResult.exported}`);
  if (agentResult.collisions > 0) report.push(`Agent name collisions: ${agentResult.collisions}`);
  for (const warning of agentResult.warnings) report.push(`Warn: ${warning}`);

  if (await isNonEmptyDir(claudePaths.skills)) {
    await removeIfExists(claudePaths.skills);
    await ensureDir(claudePaths.skills);
    report.push(`Replace: ${claudePaths.skills}`);
  }

  const skillsResult = await exportClaudeSkills({ templatesRoot, claude: claudePaths });
  report.push(`Skills copied: ${skillsResult.copied}`);
  for (const warning of skillsResult.warnings) report.push(`Warn: ${warning}`);

  if (skillsResult.copied > TOOL_BUDGET_THRESHOLD) {
    report.push(`Claude skills count is high (${skillsResult.copied}); consider increasing SLASH_COMMAND_TOOL_CHAR_BUDGET.`);
    const printSnippet = await promptClaudeToolsList(promptCtx);
    if (printSnippet) {
      report.push(`Snippet: ${formatToolBudgetSnippet()}`);
    }
  }

  return { lines: report };
}
