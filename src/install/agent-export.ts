import path from 'node:path';
import fs from 'node:fs/promises';

import { ensureDir, pathExists, writeFileAtomic } from '../fs-utils.js';
import { type ClaudePaths } from '../paths.js';
import { getClaudeToolsForAgent } from './agent-tools.js';

type AgentMeta = {
  description?: string;
  mode?: string;
  temperature?: string | number;
};

function slugify(value: string): string {
  const ascii = value
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase();

  const cleaned = ascii
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');

  return cleaned.length > 0 ? cleaned : 'agent';
}

function parseFrontmatter(content: string): { meta: AgentMeta; body: string } {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith('---')) {
    return { meta: {}, body: content };
  }

  const lines = trimmed.split('\n');
  const endOffset = lines.slice(1).findIndex((line) => line.trim() === '---');
  if (endOffset === -1) return { meta: {}, body: content };

  const endIndex = endOffset + 1;
  const metaLines = lines.slice(1, endIndex);
  const body = lines.slice(endIndex + 1).join('\n');
  const meta: AgentMeta = {};

  for (const line of metaLines) {
    const match = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.+)$/);
    if (!match) continue;
    const key = match[1];
    const value = match[2]?.trim();
    if (!value) continue;
    if (key === 'description') meta.description = value;
    if (key === 'mode') meta.mode = value;
    if (key === 'temperature') meta.temperature = value;
  }

  return { meta, body };
}

function buildDescription(meta: AgentMeta, fallback: string): string {
  const base = meta.description?.trim() ?? '';
  const prefix = base.length > 0 ? base : fallback;
  return `Use this agent when ${prefix}.`;
}

function agentIdFromPath(relPath: string): string {
  return relPath.split(path.sep).join('/').replace(/\.md$/, '');
}

function deriveName(relPath: string): string {
  return slugify(relPath.replace(/\//g, '-').replace(/\.md$/, ''));
}

function normalizeBody(body: string): string {
  return body.trimStart();
}

type ExportResult = {
  exported: number;
  skipped: number;
  collisions: number;
  warnings: string[];
};

async function listAgentTemplates(root: string): Promise<string[]> {
  const entries: string[] = [];
  const stack = [''];

  while (stack.length > 0) {
    const rel = stack.pop() ?? '';
    const abs = path.join(root, rel);
    const dirEntries = await fs.readdir(abs, { withFileTypes: true });
    for (const entry of dirEntries) {
      const relPath = path.join(rel, entry.name);
      const absPath = path.join(root, relPath);
      if (entry.isDirectory()) {
        stack.push(relPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      entries.push(absPath);
    }
  }

  return entries;
}

export async function exportClaudeAgents(opts: {
  templatesRoot: string;
  claude: ClaudePaths;
}): Promise<ExportResult> {
  const templatesAgents = path.join(opts.templatesRoot, 'agents');
  if (!(await pathExists(templatesAgents))) {
    throw new Error(`templates not found at ${templatesAgents}`);
  }

  await ensureDir(opts.claude.agents);

  const templateFiles = await listAgentTemplates(templatesAgents);
  const usedNames = new Map<string, number>();
  const warnings: string[] = [];
  let exported = 0;
  let skipped = 0;
  let collisions = 0;

  for (const filePath of templateFiles) {
    const relPath = path.relative(templatesAgents, filePath);
    const relUnix = relPath.split(path.sep).join('/');
    const agentId = agentIdFromPath(relUnix);
    const content = await fs.readFile(filePath, 'utf8');
    const { meta, body } = parseFrontmatter(content);

    const baseName = deriveName(relUnix);
    const count = (usedNames.get(baseName) ?? 0) + 1;
    usedNames.set(baseName, count);
    const name = count === 1 ? baseName : `${baseName}-${count}`;
    if (count > 1) collisions += 1;

    const descriptionFallback = meta.description?.trim() || agentId;
    const description = buildDescription(meta, descriptionFallback);
    const tools = getClaudeToolsForAgent(agentId);

    const frontmatterLines = [
      '---',
      `name: ${name}`,
      `description: ${description}`,
      'model: inherit',
      'color: blue',
      `tools: ${JSON.stringify(tools)}`,
      '---',
      '',
    ];

    const output = `${frontmatterLines.join('\n')}${normalizeBody(body)}`;
    const outPath = path.join(opts.claude.agents, `${name}.md`);

    await writeFileAtomic(outPath, output);
    exported += 1;

    if (!meta.description) {
      warnings.push(`Missing description in ${relUnix}`);
    }
  }

  return { exported, skipped, collisions, warnings };
}
