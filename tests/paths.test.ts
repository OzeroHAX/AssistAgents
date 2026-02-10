import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { getKeyFileRefs } from '../src/paths.js';
import { buildSkillCopyPlan, usesLanguageFilteredSkills } from '../src/skill-selection.js';
import { removeIfExists } from '../src/fs-utils.js';

test('key file refs use ~ paths', () => {
  const refs = getKeyFileRefs();
  assert.equal(refs.zaiApi, '~/.opencode/keys/zai_api.txt');
  assert.equal(refs.context7, '~/.opencode/keys/context7.txt');
  assert.equal(refs.tavily, '~/.opencode/keys/tavily_search.txt');
});

test('skill copy plan includes base + selected languages', () => {
  const plan = buildSkillCopyPlan(['typescript']);
  assert.ok(plan.relDirs.includes('planning'));
  assert.ok(plan.relDirs.includes('review'));
  assert.ok(plan.relDirs.includes('testing'));
  assert.ok(plan.relDirs.includes('research-strategy'));
  assert.ok(plan.relDirs.includes('coder/typescript'));
  assert.equal(plan.relDirs.includes('coder/rust'), false);
});

test('template source controls skills mode', () => {
  assert.equal(usesLanguageFilteredSkills('main'), true);
  assert.equal(usesLanguageFilteredSkills('v2'), false);
});

test('removeIfExists removes dangling symlink', { skip: process.platform === 'win32' }, async () => {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'assistagents-'));
  const danglingLink = path.join(tmpRoot, 'dangling-link');

  await fs.symlink(path.join(tmpRoot, 'missing-target'), danglingLink);
  await removeIfExists(danglingLink);

  await assert.rejects(fs.lstat(danglingLink));
  await fs.rm(tmpRoot, { recursive: true, force: true });
});
