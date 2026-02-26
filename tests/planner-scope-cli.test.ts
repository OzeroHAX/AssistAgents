import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { DEFAULT_SCOPE, SCOPE_ANCHOR_BEGIN, SCOPE_ANCHOR_END } from '../src/planner-scope.js';

// Helper to run CLI with isolated HOME
async function runCli(
  args: string[],
  tempHome: string
): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
  return new Promise((resolve) => {
    const proc = spawn('node', ['dist/cli.js', ...args], {
      env: { ...process.env, HOME: tempHome },
      cwd: process.cwd(),
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ stdout, stderr, exitCode: code });
    });
  });
}

// Helper to create minimal planner.md with anchors
async function createMinimalPlanner(targetPath: string): Promise<void> {
  const content = `---
description: Test Planner
permission:
    edit: 
        "*": deny
        "${SCOPE_ANCHOR_BEGIN}": deny
        "${DEFAULT_SCOPE}": allow
        "${SCOPE_ANCHOR_END}": deny
    apply_patch: 
        "*": deny
        "${SCOPE_ANCHOR_BEGIN}": deny
        "${DEFAULT_SCOPE}": allow
        "${SCOPE_ANCHOR_END}": deny
---
`;
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content);
}

// Helper to read planner.md content
async function readPlannerContent(plannerPath: string): Promise<string> {
  try {
    return await fs.readFile(plannerPath, 'utf8');
  } catch {
    return '';
  }
}

// Helper to read scope config
async function readScopeConfig(configPath: string): Promise<unknown> {
  try {
    const content = await fs.readFile(configPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

test('planner-scope list returns default when no config exists', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  
  try {
    const result = await runCli(['planner-scope', 'list'], tempDir);
    
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes(DEFAULT_SCOPE));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope add updates config and planner.md', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const configPath = path.join(tempDir, '.opencode', 'assistagents', 'planner-scope.json');
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    await createMinimalPlanner(plannerPath);
    
    const result = await runCli(['planner-scope', 'add', 'gsd-plans/**.md'], tempDir);
    
    assert.equal(result.exitCode, 0, `Expected exit 0, got ${result.exitCode}. stderr: ${result.stderr}`);
    assert.ok(result.stdout.includes('Added "gsd-plans/**.md"'));
    
    // Check config
    const config = await readScopeConfig(configPath) as { patterns: string[] };
    assert.ok(config, 'Config should exist');
    assert.ok(config.patterns.includes('gsd-plans/**.md'), 'Config should include new pattern');
    
    // Check planner.md was updated
    const plannerContent = await readPlannerContent(plannerPath);
    assert.ok(plannerContent.includes('"gsd-plans/**.md": allow'), 'Planner should include new allow line');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope remove removes pattern from config and planner.md', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    await createMinimalPlanner(plannerPath);
    
    // Add first
    await runCli(['planner-scope', 'add', 'gsd-plans/**.md'], tempDir);
    
    // Then remove
    const result = await runCli(['planner-scope', 'remove', 'gsd-plans/**.md'], tempDir);
    
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes('Removed "gsd-plans/**.md"'));
    
    // Check planner.md no longer has the pattern
    const plannerContent = await readPlannerContent(plannerPath);
    assert.ok(!plannerContent.includes('"gsd-plans/**.md": allow'), 'Planner should not include removed pattern');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope remove cannot remove default pattern', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  
  try {
    const result = await runCli(['planner-scope', 'remove', DEFAULT_SCOPE], tempDir);
    
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes('Cannot remove default pattern'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope reset returns to default only', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    await createMinimalPlanner(plannerPath);
    
    // Add pattern
    await runCli(['planner-scope', 'add', 'gsd-plans/**.md'], tempDir);
    
    // Reset
    const result = await runCli(['planner-scope', 'reset'], tempDir);
    
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes('Reset planner scope to default'));
    
    // Check planner.md only has default
    const plannerContent = await readPlannerContent(plannerPath);
    assert.ok(!plannerContent.includes('"gsd-plans/**.md": allow'), 'Planner should not include removed pattern after reset');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope add with wide pattern fails without --force', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    await createMinimalPlanner(plannerPath);
    
    const result = await runCli(['planner-scope', 'add', '**/*.md'], tempDir);
    
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes('too wide'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope add with wide pattern succeeds with --force', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    await createMinimalPlanner(plannerPath);
    
    const result = await runCli(['planner-scope', 'add', '**/*.md', '--force'], tempDir);
    
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes('Added "**/*.md"'));
    assert.ok(result.stderr.includes('Warning'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope add rejects absolute paths even with --force', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  
  try {
    const result = await runCli(['planner-scope', 'add', '/tmp/x.md', '--force'], tempDir);
    
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes('Absolute'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope add rejects .. even with --force', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  
  try {
    const result = await runCli(['planner-scope', 'add', '../x.md', '--force'], tempDir);
    
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes('..'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope fails with error when anchors not found', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    // Create planner without anchors
    await fs.mkdir(path.dirname(plannerPath), { recursive: true });
    await fs.writeFile(plannerPath, '---\ndescription: Old Planner\n---\n');
    
    const result = await runCli(['planner-scope', 'add', 'gsd-plans/**.md'], tempDir);
    
    assert.notEqual(result.exitCode, 0);
    assert.ok(result.stderr.includes('Anchors not found'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('planner-scope add does not duplicate existing pattern', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'planner-scope-test-'));
  const plannerPath = path.join(tempDir, '.opencode', 'agents', 'build', 'planner.md');
  
  try {
    await createMinimalPlanner(plannerPath);
    
    // Add pattern
    await runCli(['planner-scope', 'add', 'gsd-plans/**.md'], tempDir);
    
    // Try to add again
    const result = await runCli(['planner-scope', 'add', 'gsd-plans/**.md'], tempDir);
    
    assert.equal(result.exitCode, 0);
    assert.ok(result.stdout.includes('already in scope'));
    assert.ok(!result.stdout.includes('Added'));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
