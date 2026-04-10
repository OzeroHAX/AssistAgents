#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

export function resolveRepoPath(targetPath, baseDir = process.cwd()) {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(baseDir, targetPath);
}

export function resolveSkillEntry(targetPath, baseDir = process.cwd()) {
  const resolvedPath = resolveRepoPath(targetPath, baseDir);
  const skillFile = path.basename(resolvedPath) === 'SKILL.md'
    ? resolvedPath
    : path.join(resolvedPath, 'SKILL.md');
  const skillDir = path.dirname(skillFile);

  return {
    skillDir,
    skillFile,
  };
}

export function getSkillTestsDir(skillDir) {
  return path.join(skillDir, 'assets', 'tests');
}

export function remapPathIntoWorkspace(targetPath, sourceRoot, workspaceRoot) {
  const normalizedSourceRoot = path.resolve(sourceRoot);
  const normalizedTargetPath = path.resolve(targetPath);
  const relativePath = path.relative(normalizedSourceRoot, normalizedTargetPath);
  if (relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))) {
    return path.join(workspaceRoot, relativePath);
  }
  return normalizedTargetPath;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function copyDir(sourceDir, destinationDir) {
  await ensureDir(path.dirname(destinationDir));
  await fs.cp(sourceDir, destinationDir, { recursive: true, force: true });
}

export async function removeIfExists(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
}

export async function pathExists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readJsonFile(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export async function writeJsonFile(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function writeTextFile(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, value, 'utf8');
}

export async function cleanupWorkspaceTransientState(workspaceDir) {
  const opencodeDir = path.join(workspaceDir, '.opencode');
  const transientTargets = [
    path.join(opencodeDir, 'node_modules'),
    path.join(opencodeDir, 'package.json'),
    path.join(opencodeDir, 'package-lock.json'),
    path.join(opencodeDir, 'pnpm-lock.yaml'),
    path.join(opencodeDir, 'yarn.lock'),
    path.join(opencodeDir, 'bun.lock'),
    path.join(opencodeDir, 'bun.lockb'),
  ];

  for (const targetPath of transientTargets) {
    await removeIfExists(targetPath);
  }
}

export function timestampId(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('');
}

export function average(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[midpoint] ?? 0;
  return ((sorted[midpoint - 1] ?? 0) + (sorted[midpoint] ?? 0)) / 2;
}

async function listFilesRecursive(rootPath) {
  const files = [];

  async function walk(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }
      if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }

  await walk(rootPath);
  return files;
}

export async function hashPaths(targetPaths) {
  const hash = createHash('sha256');
  const normalizedTargets = [...targetPaths].map((targetPath) => path.resolve(targetPath)).sort();

  for (const targetPath of normalizedTargets) {
    if (!(await pathExists(targetPath))) {
      hash.update(`missing:${targetPath}\n`);
      continue;
    }

    const stat = await fs.stat(targetPath);
    if (stat.isDirectory()) {
      hash.update(`dir:${targetPath}\n`);
      const files = await listFilesRecursive(targetPath);
      for (const filePath of files) {
        hash.update(`file:${filePath}\n`);
        hash.update(await fs.readFile(filePath));
        hash.update('\n');
      }
      continue;
    }

    hash.update(`file:${targetPath}\n`);
    hash.update(await fs.readFile(targetPath));
    hash.update('\n');
  }

  return hash.digest('hex');
}

export function parseCliArgs(args) {
  const positionals = [];
  const flags = new Map();

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current) continue;
    if (!current.startsWith('--')) {
      positionals.push(current);
      continue;
    }

    const eqIndex = current.indexOf('=');
    if (eqIndex >= 0) {
      const name = current.slice(0, eqIndex);
      const value = current.slice(eqIndex + 1);
      const list = flags.get(name) ?? [];
      list.push(value);
      flags.set(name, list);
      continue;
    }

    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      const list = flags.get(current) ?? [];
      list.push('true');
      flags.set(current, list);
      continue;
    }

    const list = flags.get(current) ?? [];
    list.push(next);
    flags.set(current, list);
    index += 1;
  }

  return { positionals, flags };
}

export function getFlag(flags, name, defaultValue = undefined) {
  const values = flags.get(name);
  if (!values || values.length === 0) return defaultValue;
  return values[values.length - 1];
}

export function getMultiFlag(flags, name) {
  return flags.get(name) ?? [];
}

export function hasFlag(flags, name) {
  return flags.has(name);
}

export async function runCommand(options) {
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, options.args ?? [], {
      cwd: options.cwd ?? process.cwd(),
      env: options.env,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: options.killMode === 'process_group',
      shell: false,
    });

    let stdout = '';
    let stderr = '';
    let timeoutId = null;
    let startupTimeoutId = null;
    let heartbeatId = null;
    let timedOut = false;
    let startupTimedOut = false;
    let sawStdout = false;
    const startedAtMs = Date.now();

    if (typeof options.timeoutMs === 'number' && options.timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        timedOut = true;
        if (options.killMode === 'process_group' && typeof child.pid === 'number') {
          try {
            process.kill(-child.pid, 'SIGKILL');
            return;
          } catch {
            // Fall back to killing the direct child if the process group is unavailable.
          }
        }
        child.kill('SIGKILL');
      }, options.timeoutMs);
    }

    if (typeof options.startupTimeoutMs === 'number' && options.startupTimeoutMs > 0) {
      startupTimeoutId = setTimeout(() => {
        if (sawStdout) return;
        startupTimedOut = true;
        if (options.killMode === 'process_group' && typeof child.pid === 'number') {
          try {
            process.kill(-child.pid, 'SIGKILL');
            return;
          } catch {
            // Fall back to killing the direct child if the process group is unavailable.
          }
        }
        child.kill('SIGKILL');
      }, options.startupTimeoutMs);
    }

    if (typeof options.heartbeatMs === 'number' && options.heartbeatMs > 0 && typeof options.onHeartbeat === 'function') {
      heartbeatId = setInterval(() => {
        try {
          options.onHeartbeat({
            elapsedMs: Date.now() - startedAtMs,
            sawStdout,
            stdoutBytes: Buffer.byteLength(stdout, 'utf8'),
            stderrBytes: Buffer.byteLength(stderr, 'utf8'),
          });
        } catch {
          // Ignore heartbeat callback failures; they are diagnostic only.
        }
      }, options.heartbeatMs);

      if (typeof heartbeatId.unref === 'function') {
        heartbeatId.unref();
      }
    }

    child.stdout.on('data', (chunk) => {
      sawStdout = true;
      if (startupTimeoutId) {
        clearTimeout(startupTimeoutId);
        startupTimeoutId = null;
      }
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (exitCode, signal) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (startupTimeoutId) clearTimeout(startupTimeoutId);
      if (heartbeatId) clearInterval(heartbeatId);
      resolve({ exitCode, signal, stdout, stderr, timedOut, startupTimedOut });
    });

    if (typeof options.input === 'string' && options.input.length > 0) {
      child.stdin.write(options.input);
    }
    child.stdin.end();
  });
}

export async function runShellCommand(options) {
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, {
      cwd: options.cwd ?? process.cwd(),
      env: options.env,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    let stdout = '';
    let stderr = '';
    let timeoutId = null;
    let timedOut = false;

    if (typeof options.timeoutMs === 'number' && options.timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, options.timeoutMs);
    }

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (exitCode, signal) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve({ exitCode, signal, stdout, stderr, timedOut });
    });

    if (typeof options.input === 'string' && options.input.length > 0) {
      child.stdin.write(options.input);
    }
    child.stdin.end();
  });
}

export async function discoverSkillNames(skillsRoot) {
  if (!(await pathExists(skillsRoot))) return [];

  const skillFiles = [];

  async function walk(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }
      if (entry.isFile() && entry.name === 'SKILL.md') {
        skillFiles.push(entryPath);
      }
    }
  }

  await walk(skillsRoot);

  const names = new Set();
  for (const filePath of skillFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const match = content.match(/^name:\s*([a-z0-9-]+)\s*$/m);
    if (match?.[1]) {
      names.add(match[1]);
    }
  }

  return Array.from(names).sort();
}

export function parseSkillMarkdown(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error('SKILL.md is missing YAML frontmatter');
  }

  const frontmatter = match[1];
  const body = match[2] ?? '';
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);

  return {
    frontmatter,
    body,
    name: nameMatch?.[1]?.trim() ?? '',
    description: descriptionMatch?.[1]?.trim() ?? '',
  };
}

export function replaceFrontmatterField(content, field, nextValue) {
  const fieldPattern = new RegExp(`^${field}:\\s*.*$`, 'm');
  if (!fieldPattern.test(content)) {
    throw new Error(`Frontmatter field not found: ${field}`);
  }
  return content.replace(fieldPattern, `${field}: ${nextValue}`);
}

export async function overlaySkillIntoWorkspace(skillDir, workspaceDir, skillName = null) {
  const skillText = await fs.readFile(path.join(skillDir, 'SKILL.md'), 'utf8');
  const parsed = parseSkillMarkdown(skillText);
  const resolvedName = skillName ?? parsed.name;
  if (!resolvedName) {
    throw new Error(`Unable to determine skill name from ${skillDir}`);
  }

  const targetDir = path.join(workspaceDir, '.opencode', 'skills', resolvedName);
  await removeIfExists(targetDir);
  await copyDir(skillDir, targetDir);
  return { skillName: resolvedName, targetDir };
}

export async function initWorkspaceOpencodeRoot(workspaceDir) {
  const opencodeDir = path.join(workspaceDir, '.opencode');
  await ensureDir(opencodeDir);
  await writeTextFile(path.join(opencodeDir, '.gitignore'), '*\n!.gitignore\n');
  return opencodeDir;
}

export async function initGitRoot(workspaceDir) {
  const result = await runCommand({
    command: 'git',
    args: ['init', '-q'],
    cwd: workspaceDir,
  });
  if (result.exitCode !== 0) {
    throw new Error(`Failed to initialize git root in ${workspaceDir}`);
  }
}
