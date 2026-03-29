#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

export const PERMISSION_PROFILES = ['strict', 'relaxed-artifact-writes'];

const RELAXED_AGENT_IDS = ['doc', 'project', 'test'];

function stripJsoncComments(configText) {
  return configText.replace(/^\s*\/\/.*$/gm, '');
}

export function applyPermissionProfile(configText, profile) {
  if (profile === 'strict') {
    return configText;
  }

  const parsed = JSON.parse(stripJsoncComments(configText));
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
      },
    };
  }

  parsed.agent = agent;
  return `${JSON.stringify(parsed, null, 2)}\n`;
}

export function applyAgentPermissionProfile(agentMarkdown, profile) {
  if (profile === 'strict') {
    return agentMarkdown;
  }

  return agentMarkdown
    .replace(/    write:\n(?: {8}.*\n)+?(?=    edit:)/, '    write: allow\n')
    .replace(/    edit:\n(?: {8}.*\n)+?(?=    question:)/, '    edit: allow\n');
}

export async function patchRuntimePermissions(options) {
  const configPath = path.join(options.runtimeHomeDir, '.opencode', 'opencode.jsonc');
  const current = await fs.readFile(configPath, 'utf8');
  const updated = applyPermissionProfile(current, options.profile);

  if (updated !== current) {
    await fs.writeFile(configPath, updated, 'utf8');
  }

  const agentsDir = path.join(options.runtimeHomeDir, '.opencode', 'agents');
  const patchedAgents = [];

  for (const agentId of RELAXED_AGENT_IDS) {
    const agentPath = path.join(agentsDir, `${agentId}.md`);
    const currentAgent = await fs.readFile(agentPath, 'utf8');
    const updatedAgent = applyAgentPermissionProfile(currentAgent, options.profile);
    if (updatedAgent !== currentAgent) {
      await fs.writeFile(agentPath, updatedAgent, 'utf8');
      patchedAgents.push(agentPath);
    }
  }

  return { configPath, patchedAgents };
}
