#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getFlag, parseCliArgs, readJsonFile, writeTextFile } from '../shared/fs.mjs';

export function renderTimeline(run) {
  const lines = [
    `# Skill Timeline: ${run.skillName}`,
    '',
    `- Started: ${run.startedAt ?? 'unknown'}`,
    `- Stop reason: ${run.stopReason ?? 'in_progress'}`,
    '',
    '| Iteration | Status | Overall | Notes |',
    '| --- | --- | --- | --- |',
  ];

  for (const iteration of run.iterations ?? []) {
    lines.push(`| ${iteration.iteration} | ${iteration.status} | ${iteration.overallScore ?? 'n/a'} | ${iteration.note ?? ''} |`);
  }

  lines.push('');
  for (const iteration of run.iterations ?? []) {
    lines.push(`## Iteration ${iteration.iteration}`);
    lines.push('');
    lines.push(`- Status: ${iteration.status}`);
    if (typeof iteration.overallScore === 'number') {
      lines.push(`- Overall score: ${iteration.overallScore.toFixed(3)}`);
    }
    if (iteration.summaryPath) {
      lines.push(`- Summary: ${iteration.summaryPath}`);
    }
    if (iteration.beforeSkillPath) {
      lines.push(`- Skill before: ${iteration.beforeSkillPath}`);
    }
    if (iteration.afterSkillPath) {
      lines.push(`- Skill after: ${iteration.afterSkillPath}`);
    }
    if (iteration.triggerResultsPath) {
      lines.push(`- Trigger results: ${iteration.triggerResultsPath}`);
    }
    if (iteration.diagnosisPath) {
      lines.push(`- Diagnosis: ${iteration.diagnosisPath}`);
    }
    if (iteration.candidateSkillPath) {
      lines.push(`- Candidate skill: ${iteration.candidateSkillPath}`);
    }
    if (iteration.note) {
      lines.push(`- Note: ${iteration.note}`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const runJsonPath = getFlag(flags, '--run-json');
  const outputPath = getFlag(flags, '--out');

  if (!runJsonPath || !outputPath) {
    throw new Error('Usage: node render-timeline.mjs --run-json <run.json> --out <timeline.md>');
  }

  const run = await readJsonFile(runJsonPath);
  await writeTextFile(outputPath, renderTimeline(run));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`render-timeline failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
