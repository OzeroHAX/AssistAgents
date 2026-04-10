#!/usr/bin/env node

import path from 'node:path';

export function slugifySkillAuthoringName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'unnamed-skill';
}

export function getSkillAuthoringDocsRoot(baseDir = process.cwd()) {
  return path.join(baseDir, 'ai-docs', 'skill-authoring');
}

export function getSkillAuthoringInteractiveRunsRoot(baseDir = process.cwd()) {
  return path.join(getSkillAuthoringDocsRoot(baseDir), 'interactive-runs');
}

export function getSkillAuthoringTestRunsRoot(baseDir = process.cwd()) {
  return path.join(getSkillAuthoringDocsRoot(baseDir), 'test-runs');
}

export function getSkillAuthoringRunsRoot(baseDir = process.cwd()) {
  return getSkillAuthoringTestRunsRoot(baseDir);
}

export function getSkillAuthoringRuntimeCacheRoot(baseDir = process.cwd()) {
  return path.join(getSkillAuthoringDocsRoot(baseDir), 'runtime-cache');
}

export function getSkillAuthoringRunDir(runId, baseDir = process.cwd()) {
  return path.join(getSkillAuthoringRunsRoot(baseDir), runId);
}

export function getSkillAuthoringInteractiveRunDir(runId, baseDir = process.cwd()) {
  return path.join(getSkillAuthoringInteractiveRunsRoot(baseDir), runId);
}

export function getSkillAuthoringTestRunDir(runId, baseDir = process.cwd()) {
  return path.join(getSkillAuthoringTestRunsRoot(baseDir), runId);
}

export function getSkillAuthoringWorkspaceDir(skillName, baseDir = process.cwd()) {
  return path.join(getSkillAuthoringDocsRoot(baseDir), 'workspaces', slugifySkillAuthoringName(skillName));
}
