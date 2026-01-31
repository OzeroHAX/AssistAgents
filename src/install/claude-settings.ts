import { type ClaudePaths } from '../paths.js';

export function renderClaudeSettingsJson(opts: {
  responseLanguage?: string;
}): string {
  return JSON.stringify(
    {
      ...(opts.responseLanguage ? { language: opts.responseLanguage } : {}),
    },
    null,
    2
  );
}

export function describeClaudeSettingsPaths(paths: ClaudePaths): string[] {
  return [
    `Claude settings: ${paths.settings}`,
    `Claude agents: ${paths.agents}`,
    `Claude skills: ${paths.skills}`,
  ];
}
