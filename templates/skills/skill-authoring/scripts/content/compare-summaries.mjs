#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getFlag,
  parseCliArgs,
  readJsonFile,
  writeJsonFile,
} from '../shared/fs.mjs';

function percentageDelta(current, baseline) {
  if (typeof current !== 'number' || typeof baseline !== 'number' || baseline === 0) {
    return null;
  }
  return (current - baseline) / baseline;
}

export function compareSummaries(current, baseline) {
  const regressions = [];
  const report = {
    currentSkill: current.skillName,
    baselineSkill: baseline.skillName,
    currentConfiguration: current.configurationId,
    baselineConfiguration: baseline.configurationId,
    comparedAt: new Date().toISOString(),
    regressions,
    metrics: {
      overallDelta: percentageDelta(current.aggregate?.overallScore, baseline.aggregate?.overallScore),
      routingDelta: percentageDelta(current.aggregate?.routingScore, baseline.aggregate?.routingScore),
      assertionDelta: percentageDelta(current.aggregate?.assertionScore, baseline.aggregate?.assertionScore),
      artifactDelta: percentageDelta(current.aggregate?.artifactScore, baseline.aggregate?.artifactScore),
      lintDelta: percentageDelta(current.aggregate?.lintScore, baseline.aggregate?.lintScore),
    },
  };

  if ((current.aggregate?.overallScore ?? 0) < (baseline.aggregate?.overallScore ?? 0)) {
    regressions.push('overall_score_drop');
  }
  if ((current.aggregate?.routingScore ?? 0) < (baseline.aggregate?.routingScore ?? 0)) {
    regressions.push('routing_score_drop');
  }
  if ((current.aggregate?.assertionScore ?? 0) < (baseline.aggregate?.assertionScore ?? 0)) {
    regressions.push('assertion_score_drop');
  }
  if ((current.aggregate?.artifactScore ?? 0) < (baseline.aggregate?.artifactScore ?? 0)) {
    regressions.push('artifact_score_drop');
  }
  if ((current.aggregate?.lintScore ?? 0) < (baseline.aggregate?.lintScore ?? 0)) {
    regressions.push('lint_score_drop');
  }

  const currentCases = new Map((current.cases ?? []).map((item) => [item.caseId, item]));
  const baselineCases = new Map((baseline.cases ?? []).map((item) => [item.caseId, item]));
  report.caseDiffs = [];

  for (const [caseId, currentCase] of currentCases.entries()) {
    const baselineCase = baselineCases.get(caseId);
    if (!baselineCase) {
      report.caseDiffs.push({ caseId, status: 'new-case' });
      continue;
    }

    const regressionReasons = [];
    if ((currentCase.assertions?.score ?? 0) < (baselineCase.assertions?.score ?? 0)) {
      regressionReasons.push('assertion_score_drop');
    }
    if ((currentCase.routing?.precision ?? 0) < (baselineCase.routing?.precision ?? 0)) {
      regressionReasons.push('routing_precision_drop');
    }
    if ((currentCase.routing?.recall ?? 0) < (baselineCase.routing?.recall ?? 0)) {
      regressionReasons.push('routing_recall_drop');
    }
    if ((currentCase.missingExpectedFiles?.length ?? 0) > (baselineCase.missingExpectedFiles?.length ?? 0)) {
      regressionReasons.push('more_missing_expected_files');
    }

    report.caseDiffs.push({
      caseId,
      regressionReasons,
      current: currentCase,
      baseline: baselineCase,
    });
  }

  return report;
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const currentPath = getFlag(flags, '--current');
  const baselinePath = getFlag(flags, '--baseline');
  const outputPath = getFlag(flags, '--out');

  if (!currentPath || !baselinePath) {
    throw new Error(
      'Usage: node compare-summaries.mjs --current <summary.json> --baseline <summary.json> [--out <report.json>]'
    );
  }

  const current = await readJsonFile(path.resolve(currentPath));
  const baseline = await readJsonFile(path.resolve(baselinePath));
  const report = compareSummaries(current, baseline);

  if (outputPath) {
    await writeJsonFile(path.resolve(outputPath), report);
  } else {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }

  if (report.regressions.length > 0) {
    process.exitCode = 2;
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`compare-summaries failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
