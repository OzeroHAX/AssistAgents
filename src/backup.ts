import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import archiver from 'archiver';
import { ensureDir } from './fs-utils.js';

export type BackupResult = {
  created: boolean;
  zipPath?: string;
};

function timestampForFilename(date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export async function zipDirectory(opts: {
  sourceDir: string;
  backupDir: string;
  prefix?: string;
}): Promise<string> {
  const { sourceDir, backupDir } = opts;
  const prefix = opts.prefix ?? 'opencode-backup';

  await ensureDir(backupDir);
  const zipPath = path.join(backupDir, `${prefix}-${timestampForFilename()}.zip`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    output.on('error', (err) => reject(err));

    archive.on('warning', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ENOENT') return;
      reject(err);
    });
    archive.on('error', (err: Error) => reject(err));

    archive.pipe(output);
    // Put directory contents at archive root.
    archive.directory(sourceDir, false);
    void archive.finalize();
  });

  // Ensure file exists.
  await fsp.stat(zipPath);
  return zipPath;
}
