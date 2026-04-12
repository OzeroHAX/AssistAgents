import fs from 'node:fs/promises';
import path from 'node:path';

import { copyDir, ensureDir, removeIfExists } from './fs-utils.js';

export const SKILL_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type SkillFrontmatter = {
  name: string;
  description: string;
};

export function parseSkillFrontmatter(content: string): SkillFrontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error('SKILL.md is missing YAML frontmatter');
  }

  const frontmatter = match[1] ?? '';
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);

  return {
    name: nameMatch?.[1]?.trim() ?? '',
    description: descriptionMatch?.[1]?.trim() ?? '',
  };
}

export function validateSkillDefinition(skill: SkillFrontmatter, installedDirName?: string): string[] {
  const errors: string[] = [];

  if (skill.name.length < 1 || skill.name.length > 64) {
    errors.push('Skill name must be 1-64 characters long.');
  }
  if (!SKILL_NAME_PATTERN.test(skill.name)) {
    errors.push('Skill name must match ^[a-z0-9]+(-[a-z0-9]+)*$.');
  }
  if (installedDirName && installedDirName !== skill.name) {
    errors.push(`Installed skill directory "${installedDirName}" must match skill name "${skill.name}".`);
  }
  if (skill.description.length < 1 || skill.description.length > 1024) {
    errors.push('Skill description must be 1-1024 characters long.');
  }

  return errors;
}

export async function discoverSkillTemplateDirs(skillsRoot: string): Promise<string[]> {
  const discovered: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    if (entries.some((entry) => entry.isFile() && entry.name === 'SKILL.md')) {
      discovered.push(currentDir);
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      await walk(path.join(currentDir, entry.name));
    }
  }

  await walk(skillsRoot);
  discovered.sort();
  return discovered;
}

export async function installFlattenedSkills(sourceSkillsRoot: string, targetSkillsRoot: string): Promise<string[]> {
  const skillDirs = await discoverSkillTemplateDirs(sourceSkillsRoot);
  const installedNames = new Set<string>();
  const installed: string[] = [];

  await ensureDir(targetSkillsRoot);

  for (const skillDir of skillDirs) {
    const skillFile = path.join(skillDir, 'SKILL.md');
    const skill = parseSkillFrontmatter(await fs.readFile(skillFile, 'utf8'));
    const errors = validateSkillDefinition(skill, skill.name);
    if (errors.length > 0) {
      throw new Error(`Invalid skill definition at ${skillFile}: ${errors.join(' ')}`);
    }
    if (installedNames.has(skill.name)) {
      throw new Error(`Duplicate skill name detected during install: ${skill.name}`);
    }

    const targetDir = path.join(targetSkillsRoot, skill.name);
    await removeIfExists(targetDir);
    await copyDir(skillDir, targetDir);

    installedNames.add(skill.name);
    installed.push(skill.name);
  }

  return installed;
}
