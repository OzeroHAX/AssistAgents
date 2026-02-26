import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';

import { ensureDir, pathExists, writeFileAtomic } from './fs-utils.js';

// Default scope pattern that cannot be removed
export const DEFAULT_SCOPE = 'ai-docs/dev-plans/**.md';

// Wide patterns that require --force
export const WIDE_PATTERNS = ['**/*.md', '**/**.md', '*.md'];

// Anchor markers in installed planner.md
export const SCOPE_ANCHOR_BEGIN = '__assistagents_planner_md_scope_begin__';
export const SCOPE_ANCHOR_END = '__assistagents_planner_md_scope_end__';

export type PlannerScopeConfig = {
  version: 1;
  patterns: string[];
};

function getScopeConfigPath(): string {
  const home = os.homedir();
  return path.join(home, '.opencode', 'assistagents', 'planner-scope.json');
}

function getInstalledPlannerPath(): string {
  const home = os.homedir();
  return path.join(home, '.opencode', 'agents', 'build', 'planner.md');
}

export function getScopeConfigDir(): string {
  return path.dirname(getScopeConfigPath());
}

export async function loadScopeConfig(): Promise<PlannerScopeConfig> {
  const configPath = getScopeConfigPath();
  
  if (!(await pathExists(configPath))) {
    return {
      version: 1,
      patterns: [DEFAULT_SCOPE],
    };
  }
  
  const content = await fs.readFile(configPath, 'utf8');
  const config = JSON.parse(content) as PlannerScopeConfig;
  
  // Ensure default is always present
  if (!config.patterns.includes(DEFAULT_SCOPE)) {
    config.patterns.unshift(DEFAULT_SCOPE);
  }
  
  return config;
}

export async function saveScopeConfig(config: PlannerScopeConfig): Promise<void> {
  const configPath = getScopeConfigPath();
  await ensureDir(getScopeConfigDir());
  await writeFileAtomic(configPath, JSON.stringify(config, null, 2));
}

export type ValidationResult = {
  valid: boolean;
  error?: string;
  warning?: string;
  isWidePattern?: boolean;
};

export function validatePattern(pattern: string): ValidationResult {
  const trimmed = pattern.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Pattern cannot be empty' };
  }
  
  // Check for absolute paths
  if (path.isAbsolute(trimmed)) {
    return { valid: false, error: 'Absolute paths are not allowed' };
  }
  
  // Check for .. segments
  if (trimmed.includes('..')) {
    return { valid: false, error: 'Parent directory references (..) are not allowed' };
  }
  
  // Check for .md extension
  if (!trimmed.endsWith('.md')) {
    return { valid: false, error: 'Pattern must end with .md extension' };
  }
  
  // Check for wide patterns
  if (WIDE_PATTERNS.includes(trimmed)) {
    return { 
      valid: false, 
      error: `Pattern "${trimmed}" is too wide and could allow editing any markdown file`,
      isWidePattern: true,
    };
  }
  
  return { valid: true };
}

export function validatePatternWithForce(pattern: string, force: boolean): ValidationResult {
  const result = validatePattern(pattern);
  
  if (!result.valid && result.isWidePattern && force) {
    return { 
      valid: true, 
      warning: `Warning: Wide pattern "${pattern}" allowed with --force`,
      isWidePattern: true,
    };
  }
  
  return result;
}

export function normalizePattern(pattern: string): string {
  return pattern.trim();
}

export function buildPermissionLines(patterns: string[]): string {
  return patterns
    .map((p) => `"${p}": allow`)
    .join('\n');
}

export type ApplyResult = {
  success: boolean;
  error?: string;
};


export async function applyScopeToInstalledPlanner(patterns: string[]): Promise<ApplyResult> {
  const plannerPath = getInstalledPlannerPath();
  
  if (!(await pathExists(plannerPath))) {
    return {
      success: false,
      error: `Installed planner.md not found at ${plannerPath}. Run 'assistagents' setup first.`,
    };
  }
  
  const content = await fs.readFile(plannerPath, 'utf8');
  const lines = content.split('\n');
  
  // Find all anchor pairs (should be 2: one for edit, one for apply_patch)
  const anchorPairs: Array<{ startIdx: number; endIdx: number; indent: string }> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && line.includes(SCOPE_ANCHOR_BEGIN)) {
      // Extract indent from the line
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch?.[1] ?? '';
      
      // Find the corresponding end anchor
      for (let j = i + 1; j < lines.length; j++) {
        const endLine = lines[j];
        if (endLine && endLine.includes(SCOPE_ANCHOR_END)) {
          anchorPairs.push({ startIdx: i, endIdx: j, indent });
          break;
        }
      }
    }
  }
  
  if (anchorPairs.length === 0) {
    return {
      success: false,
      error: `Anchors not found in ${plannerPath}. Your installation may be outdated. Run 'assistagents' setup to update.`,
    };
  }
  
  // Build new permission lines with proper indent
  const permissionLines = buildPermissionLines(patterns);
  const firstAnchor = anchorPairs[0];
  if (!firstAnchor) {
    return { success: false, error: 'No anchor pairs found' };
  }
  const indentedPermissionLines = permissionLines
    .split('\n')
    .map((line) => `${firstAnchor.indent}${line}`)
    .join('\n');
  
  // Replace content between anchors (process from end to start to preserve indices)
  const newLines = [...lines];
  for (let i = anchorPairs.length - 1; i >= 0; i--) {
    const anchor = anchorPairs[i];
    if (anchor) {
      const { startIdx, endIdx } = anchor;
      // Remove lines between anchors (not including anchors themselves)
      newLines.splice(startIdx + 1, endIdx - startIdx - 1, indentedPermissionLines);
    }
  }
  
  await writeFileAtomic(plannerPath, newLines.join('\n'));
  
  return { success: true };
}

export type AddResult = {
  success: boolean;
  added: boolean;
  message: string;
  warning?: string | undefined;
};

export async function addPattern(pattern: string, force: boolean): Promise<AddResult> {
  const normalized = normalizePattern(pattern);
  
  const validation = validatePatternWithForce(normalized, force);
  if (!validation.valid) {
    return {
      success: false,
      added: false,
      message: validation.error || 'Invalid pattern',
    };
  }
  
  const config = await loadScopeConfig();
  
  if (config.patterns.includes(normalized)) {
    return {
      success: true,
      added: false,
      message: `Pattern "${normalized}" is already in scope`,
      warning: validation.warning,
    };
  }
  
  config.patterns.push(normalized);
  config.patterns.sort((a, b) => {
    // Default always first
    if (a === DEFAULT_SCOPE) return -1;
    if (b === DEFAULT_SCOPE) return 1;
    return a.localeCompare(b);
  });
  
  await saveScopeConfig(config);
  
  const applyResult = await applyScopeToInstalledPlanner(config.patterns);
  if (!applyResult.success) {
    return {
      success: false,
      added: false,
      message: applyResult.error || 'Failed to apply scope to installed planner',
    };
  }
  
  return {
    success: true,
    added: true,
    message: `Added "${normalized}" to planner scope`,
    warning: validation.warning,
  };
}

export type RemoveResult = {
  success: boolean;
  removed: boolean;
  message: string;
};

export async function removePattern(pattern: string): Promise<RemoveResult> {
  const normalized = normalizePattern(pattern);
  
  if (normalized === DEFAULT_SCOPE) {
    return {
      success: false,
      removed: false,
      message: `Cannot remove default pattern "${DEFAULT_SCOPE}"`,
    };
  }
  
  const config = await loadScopeConfig();
  
  const idx = config.patterns.indexOf(normalized);
  if (idx === -1) {
    return {
      success: true,
      removed: false,
      message: `Pattern "${normalized}" is not in scope`,
    };
  }
  
  config.patterns.splice(idx, 1);
  await saveScopeConfig(config);
  
  const applyResult = await applyScopeToInstalledPlanner(config.patterns);
  if (!applyResult.success) {
    return {
      success: false,
      removed: false,
      message: applyResult.error || 'Failed to apply scope to installed planner',
    };
  }
  
  return {
    success: true,
    removed: true,
    message: `Removed "${normalized}" from planner scope`,
  };
}

export type ResetResult = {
  success: boolean;
  message: string;
};

export async function resetScope(): Promise<ResetResult> {
  const config: PlannerScopeConfig = {
    version: 1,
    patterns: [DEFAULT_SCOPE],
  };
  
  await saveScopeConfig(config);
  
  const applyResult = await applyScopeToInstalledPlanner(config.patterns);
  if (!applyResult.success) {
    return {
      success: false,
      message: applyResult.error || 'Failed to apply scope to installed planner',
    };
  }
  
  return {
    success: true,
    message: 'Reset planner scope to default',
  };
}

export type ListResult = {
  patterns: string[];
};

export async function listPatterns(): Promise<ListResult> {
  const config = await loadScopeConfig();
  return { patterns: config.patterns };
}

// Helper for testing: override home directory
export function getPathsForHome(homeDir: string): {
  configPath: string;
  plannerPath: string;
} {
  return {
    configPath: path.join(homeDir, '.opencode', 'assistagents', 'planner-scope.json'),
    plannerPath: path.join(homeDir, '.opencode', 'agents', 'build', 'planner.md'),
  };
}
