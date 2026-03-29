#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

import {
  copyDir,
  ensureDir,
  hashPaths,
  parseSkillMarkdown,
  pathExists,
  readJsonFile,
  removeIfExists,
  runShellCommand,
  writeJsonFile,
  writeTextFile,
} from './fs.mjs';
import {
  PERMISSION_PROFILES,
  patchRuntimePermissions,
} from './runtime-permissions.mjs';

const INSTALL_STATE_VERSION = 1;

export { PERMISSION_PROFILES };

export function buildRuntimePaths(rootDir) {
  return {
    rootDir,
    baseOpencodeDir: path.join(rootDir, 'base-opencode'),
    homeDir: path.join(rootDir, 'home'),
    xdgConfigHome: path.join(rootDir, 'config'),
    xdgDataHome: path.join(rootDir, 'data'),
  };
}

export function createRuntimeEnv(runtime) {
  return {
    ...process.env,
    HOME: runtime.homeDir,
    XDG_CONFIG_HOME: runtime.xdgConfigHome,
    XDG_DATA_HOME: runtime.xdgDataHome,
  };
}

export async function prepareRuntimeDirs(runtime) {
  await ensureDir(runtime.rootDir);
  await ensureDir(runtime.homeDir);
  await ensureDir(runtime.xdgConfigHome);
  await ensureDir(runtime.xdgDataHome);
}

export async function resetRuntimeWorkingState(runtime) {
  await removeIfExists(runtime.homeDir);
  await removeIfExists(runtime.xdgConfigHome);
  await removeIfExists(runtime.xdgDataHome);
  await prepareRuntimeDirs(runtime);
}

export async function maskRuntimeSkills(runtime, excludedSkillNames = []) {
  const uniqueNames = Array.from(new Set(excludedSkillNames.filter(Boolean)));
  const skillsRoot = path.join(runtime.homeDir, '.opencode', 'skills');
  const removedSkills = [];
  const removedSkillDirs = [];

  if (!(await pathExists(skillsRoot))) {
    return {
      excludedSkillNames: uniqueNames,
      removedSkills,
      removedSkillDirs,
      skillsRoot,
    };
  }

  const installedSkillDirs = [];
  async function walk(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    if (entries.some((entry) => entry.isFile() && entry.name === 'SKILL.md')) {
      installedSkillDirs.push(dirPath);
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      await walk(path.join(dirPath, entry.name));
    }
  }

  await walk(skillsRoot);

  for (const skillDir of installedSkillDirs) {
    const skillFile = path.join(skillDir, 'SKILL.md');
    const skillText = await fs.readFile(skillFile, 'utf8');
    const parsed = parseSkillMarkdown(skillText);
    if (!uniqueNames.includes(parsed.name)) {
      continue;
    }
    await removeIfExists(skillDir);
    removedSkills.push(parsed.name);
    removedSkillDirs.push(skillDir);
  }

  return {
    excludedSkillNames: uniqueNames,
    removedSkills,
    removedSkillDirs,
    skillsRoot,
  };
}

function getInstallStatePath(runtime) {
  return path.join(runtime.rootDir, 'install-state.json');
}

async function readInstallState(stateFile) {
  try {
    const state = await readJsonFile(stateFile);
    if (state.version !== INSTALL_STATE_VERSION) {
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

async function computeInstallFingerprint(fingerprintPaths) {
  if (!fingerprintPaths || fingerprintPaths.length === 0) {
    return 'no-fingerprint';
  }
  return hashPaths(fingerprintPaths);
}

export async function decideRuntimeInstall(options) {
  const fingerprint = await computeInstallFingerprint(options.fingerprintPaths ?? []);
  const stateFile = getInstallStatePath(options.runtime);
  const baseConfigPath = path.join(options.runtime.baseOpencodeDir, 'opencode.jsonc');

  if (options.skipInstall) {
    if (!(await pathExists(baseConfigPath))) {
      throw new Error(`--skip-install requires an existing runtime base install at ${baseConfigPath}`);
    }
    return {
      performed: false,
      reason: 'skip-install flag set',
      fingerprint,
      stateFile,
    };
  }

  if (!(await pathExists(baseConfigPath))) {
    return {
      performed: true,
      reason: 'base install is missing',
      fingerprint,
      stateFile,
    };
  }

  const state = await readInstallState(stateFile);
  if (!state) {
    return {
      performed: true,
      reason: 'install state is missing or incompatible',
      fingerprint,
      stateFile,
    };
  }

  if (state.installCommand !== options.installCommand) {
    return {
      performed: true,
      reason: 'install command changed',
      fingerprint,
      stateFile,
    };
  }

  if (state.fingerprint !== fingerprint) {
    return {
      performed: true,
      reason: 'install fingerprint changed',
      fingerprint,
      stateFile,
    };
  }

  return {
    performed: false,
    reason: 'install fingerprint unchanged; reusing cached base install',
    fingerprint,
    stateFile,
  };
}

export async function prepareRuntimeBase(options) {
  const workingOpencodePath = path.join(options.runtime.homeDir, '.opencode');
  let skillMask = {
    excludedSkillNames: [],
    removedSkills: [],
    skillsRoot: path.join(workingOpencodePath, 'skills'),
  };

  if (options.installDecision.performed) {
    const env = createRuntimeEnv(options.runtime);
    const result = await runShellCommand({
      command: options.installCommand,
      cwd: options.installCwd ?? process.cwd(),
      env,
      timeoutMs: options.installTimeoutMs,
    });

    if (options.runDir) {
      await writeTextFile(path.join(options.runDir, 'install.log'), result.stdout);
      await writeTextFile(path.join(options.runDir, 'install.err.log'), result.stderr);
    }

    if (result.exitCode !== 0) {
      throw new Error(`Install command failed with exit code ${result.exitCode}`);
    }

    await removeIfExists(options.runtime.baseOpencodeDir);
    await copyDir(workingOpencodePath, options.runtime.baseOpencodeDir);
    await writeJsonFile(options.installDecision.stateFile, {
      version: INSTALL_STATE_VERSION,
      fingerprint: options.installDecision.fingerprint,
      installCommand: options.installCommand,
      updatedAt: new Date().toISOString(),
    });
  } else {
    if (options.runDir) {
      await writeTextFile(path.join(options.runDir, 'install.log'), `install skipped: ${options.installDecision.reason}\n`);
      await writeTextFile(path.join(options.runDir, 'install.err.log'), '');
    }
    await copyDir(options.runtime.baseOpencodeDir, workingOpencodePath);
  }

  if ((options.excludedSkillNames?.length ?? 0) > 0) {
    skillMask = await maskRuntimeSkills(options.runtime, options.excludedSkillNames);
  }

  if (options.permissionProfile && options.permissionProfile !== 'strict') {
    const permissionPatch = await patchRuntimePermissions({
      runtimeHomeDir: options.runtime.homeDir,
      profile: options.permissionProfile,
    });
    if (options.runDir) {
      await writeJsonFile(path.join(options.runDir, 'permission-profile.json'), {
        profile: options.permissionProfile,
        configPath: permissionPatch.configPath,
        patchedAgents: permissionPatch.patchedAgents,
      });
    }
  }

  if (options.runDir) {
    await writeJsonFile(path.join(options.runDir, 'install-decision.json'), options.installDecision);
    if (skillMask.excludedSkillNames.length > 0) {
      await writeJsonFile(path.join(options.runDir, 'skill-mask.json'), skillMask);
    }
  }
}
