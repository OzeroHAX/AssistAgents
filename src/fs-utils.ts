import fs from 'node:fs/promises';
import path from 'node:path';

export async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function isNonEmptyDir(dir: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

export async function removeIfExists(p: string): Promise<void> {
  if (!(await pathExists(p))) return;
  await fs.rm(p, { recursive: true, force: true });
}

export async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(path.dirname(dest));
  await fs.cp(src, dest, {
    recursive: true,
    force: true,
    errorOnExist: false,
    dereference: true,
  });
}

export async function writeFileAtomic(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);

  const tmpPath = `${filePath}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await fs.writeFile(tmpPath, content, { encoding: 'utf8' });
  await fs.rename(tmpPath, filePath);
}

export async function chmod600IfPossible(filePath: string): Promise<void> {
  // Windows may not support chmod in the same way; ignore failures.
  try {
    await fs.chmod(filePath, 0o600);
  } catch {
    // ignore
  }
}
