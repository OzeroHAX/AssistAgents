#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

import { pathExists } from '../shared/fs.mjs';

function weightOf(weight) {
  return typeof weight === 'number' && weight > 0 ? weight : 1;
}

async function readTargetText(context, assertion) {
  if (assertion.kind === 'file_regex_any') {
    const filePath = path.join(context.workspaceDir, assertion.file);
    if (!(await pathExists(filePath))) {
      return null;
    }
    return fs.readFile(filePath, 'utf8');
  }

  return context.responseText ?? '';
}

export async function judgeAssertions(context, assertions) {
  const checks = [];

  for (const assertion of assertions ?? []) {
    let pass = false;

    switch (assertion.kind) {
      case 'regex_any': {
        const target = context.responseText ?? '';
        pass = assertion.patterns.some((pattern) => new RegExp(pattern, 'imu').test(target));
        break;
      }
      case 'regex_none': {
        const target = context.responseText ?? '';
        pass = assertion.patterns.every((pattern) => !new RegExp(pattern, 'imu').test(target));
        break;
      }
      case 'min_length': {
        const target = context.responseText ?? '';
        pass = target.trim().length >= assertion.min;
        break;
      }
      case 'file_exists': {
        const filePath = path.join(context.workspaceDir, assertion.file);
        pass = await pathExists(filePath);
        break;
      }
      case 'file_regex_any': {
        const target = await readTargetText(context, assertion);
        pass = typeof target === 'string'
          ? assertion.patterns.some((pattern) => new RegExp(pattern, 'imu').test(target))
          : false;
        break;
      }
      default:
        pass = false;
        break;
    }

    checks.push({
      id: assertion.id,
      description: assertion.description,
      pass,
      weight: weightOf(assertion.weight),
    });
  }

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = checks.reduce((sum, check) => sum + (check.pass ? check.weight : 0), 0);
  const score = totalWeight === 0 ? 1 : earnedWeight / totalWeight;

  return {
    pass: score >= 1,
    score,
    totalWeight,
    earnedWeight,
    checks,
  };
}
