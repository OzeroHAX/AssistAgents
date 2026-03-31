#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getFlag,
  parseCliArgs,
  parseSkillMarkdown,
  readJsonFile,
  writeJsonFile,
  writeTextFile,
} from '../shared/fs.mjs';
import {
  extractJson,
  getDefaultLlmCommand,
  invokeLlm,
} from '../shared/llm.mjs';

export function buildDiagnosisDraft(summary, baselineSummary = null) {
  const rootCauses = [];
  const changeTargets = new Set();

  if ((summary.aggregate.status ?? 'FAIL') === 'INFRA_ERROR' || (summary.infrastructureFailures?.length ?? 0) > 0) {
    rootCauses.push({
      id: 'infra-runtime-failure',
      severity: 'critical',
      evidence: (summary.infrastructureFailures ?? []).map((item) =>
        `${item.caseId}: ${item.infrastructureError?.kind ?? 'unknown'}`
      ),
      recommendation: 'Retry the eval after the runtime environment is healthy. Do not refine the skill body from this run.',
    });
  }

  if ((summary.aggregate.routingScore ?? 1) < 0.8) {
    changeTargets.add('body');
    rootCauses.push({
      id: 'routing-misses',
      severity: 'high',
      evidence: ['Required skills were missed or forbidden skills loaded in content evals.'],
      recommendation: 'Clarify the workflow and boundaries so the skill is loaded only in the intended situations.',
    });
  }

  if ((summary.aggregate.assertionScore ?? 1) < 0.8) {
    changeTargets.add('body');
    rootCauses.push({
      id: 'weak-behavior',
      severity: 'high',
      evidence: ['Assertions do not consistently pass.'],
      recommendation: 'Tighten instructions, outputs, and validation requirements in the skill body.',
    });
  }

  if ((summary.aggregate.artifactScore ?? 1) < 1) {
    changeTargets.add('body');
    rootCauses.push({
      id: 'missing-artifacts',
      severity: 'medium',
      evidence: ['Expected files were not produced in every passing case.'],
      recommendation: 'Make artifact expectations and file paths explicit in the skill body.',
    });
  }

  if ((summary.lint?.score ?? 1) < 1) {
    changeTargets.add('body');
    rootCauses.push({
      id: 'lint-failures',
      severity: 'medium',
      evidence: summary.lint?.failedRules?.map((rule) => `${rule.id}: ${rule.reason}`) ?? [],
      recommendation: 'Repair format, boundaries, and output sections before further tuning.',
    });
  }

  if (baselineSummary && (summary.aggregate.overallScore ?? 0) <= (baselineSummary.aggregate.overallScore ?? 0)) {
    changeTargets.add('evals');
    rootCauses.push({
      id: 'no-baseline-win',
      severity: 'high',
      evidence: ['Candidate did not outperform the baseline summary.'],
      recommendation: 'Check whether the skill adds measurable value or whether the evals fail to discriminate candidate and baseline.',
    });
  }

  const stopOrContinue = (summary.aggregate.status === 'PASS' && rootCauses.length === 0) ? 'stop' : 'continue';

  return {
    executiveSummary: summary.aggregate.status === 'INFRA_ERROR'
      ? 'The eval run hit infrastructure failures and should be retried before changing the skill.'
      : summary.aggregate.status === 'PASS'
      ? 'The candidate passes the current threshold, but inspect remaining caveats before finalizing.'
      : 'The candidate is below threshold and needs another refinement pass.',
    changeTargets: Array.from(changeTargets),
    rootCauses,
    changePlan: rootCauses.map((cause, index) => ({
      priority: index + 1,
      target: cause.id === 'no-baseline-win' ? 'evals' : 'body',
      action: cause.recommendation,
    })),
    stopOrContinue,
  };
}

export async function analyzeResults(options) {
  const skillText = options.skillText;
  const summary = options.summary;
  const baselineSummary = options.baselineSummary ?? null;
  const diagnosisDraft = buildDiagnosisDraft(summary, baselineSummary);
  const prompt = buildAnalyzerPrompt(skillText, summary, diagnosisDraft, baselineSummary);

  let diagnosis = diagnosisDraft;
  if (options.llmCommand) {
    const responseText = await invokeLlm({ prompt, command: options.llmCommand });
    if (responseText) {
      diagnosis = extractJson(responseText);
      diagnosis.rawResponse = responseText;
    }
  }

  diagnosis.skill = parseSkillMarkdown(skillText).name;

  return {
    diagnosis,
    prompt,
  };
}

function buildAnalyzerPrompt(skillText, summary, diagnosisDraft, baselineSummary) {
  return [
    'You are the analyzer pass for an OpenCode skill-improvement loop.',
    'Return only JSON that matches this shape:',
    '{"executiveSummary":"","changeTargets":[],"rootCauses":[],"changePlan":[],"stopOrContinue":"continue"}',
    '',
    'Skill under analysis:',
    '```md',
    skillText.trim(),
    '```',
    '',
    'Current summary:',
    '```json',
    JSON.stringify(summary, null, 2),
    '```',
    '',
    baselineSummary ? 'Baseline summary:\n```json\n' + JSON.stringify(baselineSummary, null, 2) + '\n```' : 'No baseline summary was provided.',
    '',
    'Deterministic diagnosis draft:',
    '```json',
    JSON.stringify(diagnosisDraft, null, 2),
    '```',
    '',
    'Generalize from failures. Do not overfit to individual eval prompts.',
  ].join('\n');
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const summaryPath = getFlag(flags, '--summary');
  const skillPath = getFlag(flags, '--skill');
  const baselineSummaryPath = getFlag(flags, '--baseline-summary');
  const outputPath = getFlag(flags, '--out');
  const promptPath = getFlag(flags, '--prompt-out');
  const llmCommand = getFlag(flags, '--llm-command', getDefaultLlmCommand());

  if (!summaryPath || !skillPath) {
    throw new Error('Usage: node analyze-results.mjs --summary <summary.json> --skill <SKILL.md>');
  }

  const summary = await readJsonFile(summaryPath);
  const baselineSummary = baselineSummaryPath ? await readJsonFile(baselineSummaryPath) : null;
  const skillText = await fs.readFile(skillPath, 'utf8');
  const analysis = await analyzeResults({
    skillText,
    summary,
    baselineSummary,
    llmCommand,
  });

  if (promptPath) {
    await writeTextFile(promptPath, analysis.prompt);
  }

  let diagnosis = analysis.diagnosis;
  diagnosis.skill = parseSkillMarkdown(skillText).name;
  diagnosis.summaryPath = path.resolve(summaryPath);

  if (outputPath) {
    await writeJsonFile(outputPath, diagnosis);
  } else {
    process.stdout.write(`${JSON.stringify(diagnosis, null, 2)}\n`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`analyze-results failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
