import os from 'node:os';
import path from 'node:path';

import type { KeyFiles } from './key-registry.js';
import { getKeyFileRefsForBase } from './key-registry.js';

export type InstallPaths = {
  targetRoot: string;
  targetAgents: string;
  targetSkills: string;
  targetPlugins: string;
  targetTools: string;
  targetKeys: string;
  globalConfig: string;
  backupDir: string;
};

export function getInstallPaths(backupDirFlag?: string): InstallPaths {
  const home = os.homedir();
  const targetRoot = path.join(home, '.opencode');

  const expandTilde = (p: string): string => {
    if (p === '~') return home;
    if (p.startsWith('~/') || p.startsWith('~\\')) return path.join(home, p.slice(2));
    return p;
  };

  const backupDir = backupDirFlag ? expandTilde(backupDirFlag) : path.join(home, '.opencode-backups');

  return {
    targetRoot,
    targetAgents: path.join(targetRoot, 'agents'),
    targetSkills: path.join(targetRoot, 'skills'),
    targetPlugins: path.join(targetRoot, 'plugins'),
    targetTools: path.join(targetRoot, 'tools'),
    targetKeys: path.join(targetRoot, 'keys'),
    globalConfig: path.join(targetRoot, 'opencode.jsonc'),
    backupDir,
  };
}

export function getKeyFileRefs(): KeyFiles {
  // Important: OpenCode supports ~ inside {file:...} references.
  return getKeyFileRefsForBase('~/.opencode/keys');
}