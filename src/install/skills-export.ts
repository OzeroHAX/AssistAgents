import path from 'node:path';
import fs from 'node:fs/promises';

import { copyDir, ensureDir, pathExists } from '../fs-utils.js';
import { type ClaudePaths } from '../paths.js';

type SkillCopyResult = {
  copied: number;
  warnings: string[];
};

async function walkDirs(root: string): Promise<string[]> {
  const dirs: string[] = [];
  const stack = [''];

  while (stack.length > 0) {
    const rel = stack.pop() ?? '';
    const abs = path.join(root, rel);
    const entries = await fs.readdir(abs, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const relPath = path.join(rel, entry.name);
      stack.push(relPath);
      dirs.push(relPath);
    }
  }

  return dirs;
}

async function countSkillDirs(root: string): Promise<number> {
  const dirs = await walkDirs(root);
  let count = 0;
  for (const rel of dirs) {
    const skillPath = path.join(root, rel, 'SKILL.md');
    if (await pathExists(skillPath)) count += 1;
  }
  return count;
}

function hasSkillAncestor(rel: string, skillRoots: Set<string>): boolean {
  const parts = rel.split(path.sep);
  let current = '';
  for (const part of parts.slice(0, -1)) {
    current = current ? path.join(current, part) : part;
    if (skillRoots.has(current)) return true;
  }
  return false;
}

export async function exportClaudeSkills(opts: {
  templatesRoot: string;
  claude: ClaudePaths;
}): Promise<SkillCopyResult> {
  const templatesSkills = path.join(opts.templatesRoot, 'skills');
  if (!(await pathExists(templatesSkills))) {
    throw new Error(`templates not found at ${templatesSkills}`);
  }

  await ensureDir(opts.claude.skills);

  await copyDir(templatesSkills, opts.claude.skills);
  const warnings: string[] = [];
  const copied = await countSkillDirs(templatesSkills);

  const dirs = await walkDirs(templatesSkills);
  const skillRoots = new Set<string>();
  for (const rel of dirs) {
    const skillPath = path.join(templatesSkills, rel, 'SKILL.md');
    if (await pathExists(skillPath)) skillRoots.add(rel);
  }

  for (const rel of dirs) {
    const abs = path.join(templatesSkills, rel);
    const entries = await fs.readdir(abs, { withFileTypes: true });
    const hasSkill = entries.some((entry) => entry.isFile() && entry.name === 'SKILL.md');
    const hasFile = entries.some((entry) => entry.isFile());
    if (!hasFile || hasSkill) continue;
    if (hasSkillAncestor(rel, skillRoots)) continue;
    warnings.push(`Missing SKILL.md in ${rel}`);
  }

  return { copied, warnings };
}
