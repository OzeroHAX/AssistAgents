import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import type { EvalCase, QualityRubric } from './types.js';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

export const EVAL_ROOT = path.resolve(scriptsDir, '..');
export const REPO_ROOT = path.resolve(EVAL_ROOT, '..');

export function resolveRepoPath(targetPath: string): string {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(REPO_ROOT, targetPath);
}

export function remapPathIntoWorkspace(targetPath: string, sourceRoot: string, workspaceRoot: string): string {
  const normalizedSourceRoot = path.resolve(sourceRoot);
  const normalizedTargetPath = path.resolve(targetPath);
  const relativePath = path.relative(normalizedSourceRoot, normalizedTargetPath);
  if (relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))) {
    return path.join(workspaceRoot, relativePath);
  }
  return normalizedTargetPath;
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function copyDir(sourceDir: string, destinationDir: string): Promise<void> {
  await ensureDir(path.dirname(destinationDir));
  await fs.cp(sourceDir, destinationDir, { recursive: true, force: true });
}

export async function removeIfExists(targetPath: string): Promise<void> {
  await fs.rm(targetPath, { recursive: true, force: true });
}

async function listFilesRecursive(rootPath: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentPath: string): Promise<void> {
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

export async function hashPaths(targetPaths: string[]): Promise<string> {
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

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content) as T;
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function writeTextFile(filePath: string, value: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, value, 'utf8');
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export function timestampId(date = new Date()): string {
  const pad = (value: number): string => value.toString().padStart(2, '0');
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

export function parseCliArgs(args: string[]): { positionals: string[]; flags: Map<string, string[]> } {
  const positionals: string[] = [];
  const flags = new Map<string, string[]>();

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

export function getFlag(flags: Map<string, string[]>, name: string, defaultValue?: string): string | undefined {
  const values = flags.get(name);
  if (!values || values.length === 0) return defaultValue;
  return values[values.length - 1];
}

export function getMultiFlag(flags: Map<string, string[]>, name: string): string[] {
  return flags.get(name) ?? [];
}

export function hasFlag(flags: Map<string, string[]>, name: string): boolean {
  return flags.has(name);
}

export async function listCaseFiles(casesDir = path.join(EVAL_ROOT, 'cases')): Promise<string[]> {
  const entries = await fs.readdir(casesDir);
  return entries
    .filter((entry) => entry.endsWith('.json'))
    .sort()
    .map((entry) => path.join(casesDir, entry));
}

export async function loadCases(): Promise<EvalCase[]> {
  const files = await listCaseFiles();
  const loaded = await Promise.all(files.map(async (filePath) => readJsonFile<EvalCase>(filePath)));
  return loaded.sort((left, right) => left.id.localeCompare(right.id));
}

export async function loadCase(caseFile: string): Promise<EvalCase> {
  return readJsonFile<EvalCase>(resolveRepoPath(caseFile));
}

export async function loadRubric(rubricFile: string): Promise<QualityRubric> {
  return readJsonFile<QualityRubric>(resolveRepoPath(rubricFile));
}

export async function discoverSkillNames(skillsRoot = path.join(REPO_ROOT, 'templates', 'skills')): Promise<string[]> {
  const skillFiles: string[] = [];

  async function walk(dirPath: string): Promise<void> {
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

  const names = new Set<string>();
  for (const filePath of skillFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const match = content.match(/^name:\s*([a-z0-9-]+)\s*$/m);
    if (match?.[1]) {
      names.add(match[1]);
    }
  }

  return Array.from(names).sort();
}

export async function runCommand(options: {
  command: string;
  args?: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(options.command, options.args ?? [], {
      cwd: options.cwd ?? REPO_ROOT,
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
  });
}

export async function runShellCommand(options: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
  const args = process.platform === 'win32' ? ['/d', '/s', '/c', options.command] : ['-lc', options.command];
  return runCommand({
    command: shell,
    args,
    cwd: options.cwd,
    env: options.env,
  });
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[midpoint - 1] ?? 0) + (sorted[midpoint] ?? 0)) / 2
    : (sorted[midpoint] ?? 0);
}
