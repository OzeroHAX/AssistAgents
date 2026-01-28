import os from 'node:os';
import path from 'node:path';

export type InstallPaths = {
  targetRoot: string;
  targetAgents: string;
  targetSkills: string;
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
    targetKeys: path.join(targetRoot, 'keys'),
    globalConfig: path.join(targetRoot, 'opencode.jsonc'),
    backupDir,
  };
}

export function getKeyFileRefs(): { zaiApi: string; context7: string; tavily: string } {
  // Important: OpenCode supports ~ inside {file:...} references.
  return {
    zaiApi: '~/.opencode/keys/zai_api.txt',
    context7: '~/.opencode/keys/context7.txt',
    tavily: '~/.opencode/keys/tavily_search.txt',
  };
}
