#!/usr/bin/env node

import fs from 'node:fs/promises';

import { parseSkillMarkdown } from '../shared/fs.mjs';

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function hasAnyTag(body, tagNames) {
  return tagNames.some((tagName) => new RegExp(`<${tagName}(\\s|>)`, 'i').test(body));
}

function containsNonEnglishSignal(text) {
  const cyrillic = countMatches(text, /[А-Яа-яЁё]/g);
  const han = countMatches(text, /[\u4e00-\u9fff]/g);
  return cyrillic + han >= 10;
}

function isValidSkillName(name) {
  return name.length >= 1 && name.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

export function lintSkillText(content) {
  let parsed = null;
  try {
    parsed = parseSkillMarkdown(content);
  } catch (error) {
    return {
      pass: false,
      score: 0,
      totalRules: 7,
      passedRules: 0,
      failedRules: [{ id: 'L1', reason: error instanceof Error ? error.message : String(error) }],
      checks: [],
    };
  }

  const body = parsed.body.trim();
  const xmlTagCount = countMatches(body, /<([a-z0-9_-]+)(\s|>)/gi);
  const headingCount = countMatches(body, /^#+\s+/gm);

  const checks = [
    {
      id: 'L1',
      pass: Boolean(parsed.name && parsed.description) && isValidSkillName(parsed.name),
      reason: 'Frontmatter must contain name and description, and name must satisfy OpenCode naming rules.',
    },
    {
      id: 'L2',
      pass:
        parsed.description.length >= 1 &&
        parsed.description.length <= 1024 &&
        !/\b(step|workflow|process|algorithm)\b/i.test(parsed.description),
      reason: 'Description should be trigger-oriented, non-workflow-heavy, and 1-1024 characters long.',
    },
    {
      id: 'L3',
      pass: xmlTagCount >= 4 && xmlTagCount > headingCount,
      reason: 'Body must primarily use XML-like tagged sections.',
    },
    {
      id: 'L4',
      pass: hasAnyTag(body, ['when_not_to_use', 'loading_policy']),
      reason: 'Boundaries must be explicit.',
    },
    {
      id: 'L5',
      pass: hasAnyTag(body, ['workflow', 'execution_contract', 'actions', 'process', 'steps', 'loading_sequence']),
      reason: 'Workflow or execution logic must be explicit.',
    },
    {
      id: 'L6',
      pass: hasAnyTag(body, ['output_requirements', 'outputs', 'validation', 'self_check', 'stop_conditions']),
      reason: 'Output or validation requirements must be explicit.',
    },
    {
      id: 'L7',
      pass: !containsNonEnglishSignal(`${parsed.frontmatter}\n${body}`),
      reason: 'Skill text should remain English-only enough to preserve clarity.',
    },
  ];

  const passedRules = checks.filter((check) => check.pass).length;
  const totalRules = checks.length;
  const failedRules = checks.filter((check) => !check.pass).map((check) => ({
    id: check.id,
    reason: check.reason,
  }));

  return {
    pass: passedRules === totalRules,
    score: totalRules === 0 ? 1 : passedRules / totalRules,
    totalRules,
    passedRules,
    failedRules,
    checks,
  };
}

export async function lintSkillFile(skillPath) {
  return lintSkillText(await fs.readFile(skillPath, 'utf8'));
}
