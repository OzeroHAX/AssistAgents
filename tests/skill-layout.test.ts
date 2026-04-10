import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';

import {
  installFlattenedSkills,
  parseSkillFrontmatter,
  validateSkillDefinition,
} from '../src/skill-layout.js';

test('validateSkillDefinition follows OpenCode name and description rules', () => {
  assert.deepEqual(
    validateSkillDefinition({
      name: 'docs-changelog',
      description: 'Create consistent releases and changelogs',
    }, 'docs-changelog'),
    [],
  );

  assert.ok(validateSkillDefinition({
    name: 'Docs-Changelog',
    description: 'Create consistent releases and changelogs',
  }).length > 0);

  assert.ok(validateSkillDefinition({
    name: 'docs-changelog',
    description: 'x'.repeat(1025),
  }).length > 0);
});

test('parseSkillFrontmatter reads name and description', () => {
  const parsed = parseSkillFrontmatter(`---\nname: docs-changelog\ndescription: Create consistent releases and changelogs\n---\n<body/>`);
  assert.equal(parsed.name, 'docs-changelog');
  assert.equal(parsed.description, 'Create consistent releases and changelogs');
});

test('installFlattenedSkills copies skills into <name> directories and preserves extra files', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'assistagents-skill-layout-'));
  const sourceRoot = path.join(tempDir, 'templates', 'skills');
  const targetRoot = path.join(tempDir, 'installed', 'skills');

  const docsChangelog = path.join(sourceRoot, 'docs', 'changelog');
  const skillAuthoring = path.join(sourceRoot, 'skill-authoring');

  await mkdir(path.join(docsChangelog), { recursive: true });
  await mkdir(path.join(skillAuthoring, 'references'), { recursive: true });

  await writeFile(
    path.join(docsChangelog, 'SKILL.md'),
    '---\nname: docs-changelog\ndescription: Create consistent releases and changelogs\n---\n<body/>',
    'utf8',
  );
  await writeFile(
    path.join(skillAuthoring, 'SKILL.md'),
    '---\nname: skill-authoring\ndescription: Create, validate, or refine skills\n---\n<body/>',
    'utf8',
  );
  await writeFile(path.join(skillAuthoring, 'references', 'note.md'), 'keep me', 'utf8');

  const installed = await installFlattenedSkills(sourceRoot, targetRoot);

  assert.deepEqual(installed, ['docs-changelog', 'skill-authoring']);
  assert.equal(
    await readFile(path.join(targetRoot, 'docs-changelog', 'SKILL.md'), 'utf8'),
    '---\nname: docs-changelog\ndescription: Create consistent releases and changelogs\n---\n<body/>',
  );
  assert.equal(
    await readFile(path.join(targetRoot, 'skill-authoring', 'references', 'note.md'), 'utf8'),
    'keep me',
  );
});
