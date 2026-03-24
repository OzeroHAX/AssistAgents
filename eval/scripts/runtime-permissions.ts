import fs from 'node:fs/promises';
import path from 'node:path';

export const EVAL_PERMISSION_PROFILES = ['strict', 'relaxed-artifact-writes'] as const;

export type EvalPermissionProfile = (typeof EVAL_PERMISSION_PROFILES)[number];

type ConfigLike = {
  agent?: Record<string, { permission?: Record<string, unknown> }>;
};

const RELAXED_AGENT_IDS = ['doc', 'project', 'test'] as const;

function stripJsoncComments(configText: string): string {
  return configText.replace(/^\s*\/\/.*$/gm, '');
}

export function applyEvalPermissionProfile(configText: string, profile: EvalPermissionProfile): string {
  if (profile === 'strict') {
    return configText;
  }

  const parsed = JSON.parse(stripJsoncComments(configText)) as ConfigLike;
  const agent = parsed.agent ?? {};

  for (const agentName of RELAXED_AGENT_IDS) {
    const current = agent[agentName] ?? {};
    const permission = current.permission ?? {};
    agent[agentName] = {
      ...current,
      permission: {
        ...permission,
        write: 'allow',
        edit: 'allow',
        apply_patch: 'allow',
      },
    };
  }

  parsed.agent = agent;
  return `${JSON.stringify(parsed, null, 2)}\n`;
}

export function applyEvalAgentPermissionProfile(agentMarkdown: string, profile: EvalPermissionProfile): string {
  if (profile === 'strict') {
    return agentMarkdown;
  }

  return agentMarkdown
    .replace(
      /    write:\n(?: {8}.*\n)+?(?=    edit:)/,
      '    write: allow\n',
    )
    .replace(
      /    edit:\n(?: {8}.*\n)+?(?=    apply_patch:)/,
      '    edit: allow\n',
    )
    .replace(
      /    apply_patch:\s*\n(?: {8}.*\n)+?(?=    question:)/,
      '    apply_patch: allow\n',
    );
}

export async function patchRuntimePermissions(options: {
  runtimeHomeDir: string;
  profile: EvalPermissionProfile;
}): Promise<{ configPath: string; patchedAgents: string[] }> {
  const configPath = path.join(options.runtimeHomeDir, '.opencode', 'opencode.jsonc');
  const current = await fs.readFile(configPath, 'utf8');
  const updated = applyEvalPermissionProfile(current, options.profile);

  if (updated !== current) {
    await fs.writeFile(configPath, updated, 'utf8');
  }

  const agentsDir = path.join(options.runtimeHomeDir, '.opencode', 'agents');
  const patchedAgents: string[] = [];
  for (const agentId of RELAXED_AGENT_IDS) {
    const agentPath = path.join(agentsDir, `${agentId}.md`);
    const currentAgent = await fs.readFile(agentPath, 'utf8');
    const updatedAgent = applyEvalAgentPermissionProfile(currentAgent, options.profile);
    if (updatedAgent !== currentAgent) {
      await fs.writeFile(agentPath, updatedAgent, 'utf8');
      patchedAgents.push(agentPath);
    }
  }

  return { configPath, patchedAgents };
}
