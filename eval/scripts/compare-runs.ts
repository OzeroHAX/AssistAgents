import path from 'node:path';

import { getFlag, median, parseCliArgs, readJsonFile, writeJsonFile } from './common.js';
import type { CaseResult, RunSummary } from './types.js';

type CaseAggregate = {
  caseId: string;
  medianQuality: number | null;
  medianTokens: number | null;
  medianLatencyMs: number;
  requiredMisses: number;
  forbiddenHits: number;
};

function aggregateByCase(results: CaseResult[]): Map<string, CaseAggregate> {
  const grouped = new Map<string, CaseResult[]>();
  for (const result of results) {
    const bucket = grouped.get(result.caseId) ?? [];
    bucket.push(result);
    grouped.set(result.caseId, bucket);
  }

  const aggregate = new Map<string, CaseAggregate>();
  for (const [caseId, bucket] of grouped.entries()) {
    const qualities = bucket
      .map((item) => item.quality?.score)
      .filter((value): value is number => typeof value === 'number');
    const tokens = bucket
      .map((item) => item.trace.usage.total)
      .filter((value): value is number => typeof value === 'number');

    aggregate.set(caseId, {
      caseId,
      medianQuality: qualities.length === 0 ? null : median(qualities),
      medianTokens: tokens.length === 0 ? null : median(tokens),
      medianLatencyMs: median(bucket.map((item) => item.latencyMs)),
      requiredMisses: bucket.reduce((sum, item) => sum + item.routing.requiredMisses.length, 0),
      forbiddenHits: bucket.reduce((sum, item) => sum + item.routing.forbiddenHits.length, 0),
    });
  }

  return aggregate;
}

function percentageDelta(current: number | null, baseline: number | null): number | null {
  if (current === null || baseline === null || baseline === 0) return null;
  return (current - baseline) / baseline;
}

async function main(): Promise<void> {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const currentPath = getFlag(flags, '--current');
  const baselinePath = getFlag(flags, '--baseline');
  const outputPath = getFlag(flags, '--out');

  if (!currentPath || !baselinePath) {
    throw new Error('Usage: tsx eval/scripts/compare-runs.ts --current <summary.json> --baseline <summary.json>');
  }

  const current = await readJsonFile<RunSummary>(path.resolve(currentPath));
  const baseline = await readJsonFile<RunSummary>(path.resolve(baselinePath));
  const currentByCase = aggregateByCase(current.results);
  const baselineByCase = aggregateByCase(baseline.results);

  const regressions: Array<Record<string, unknown>> = [];
  const compared: Array<Record<string, unknown>> = [];

  for (const [caseId, currentCase] of currentByCase.entries()) {
    const baselineCase = baselineByCase.get(caseId);
    if (!baselineCase) {
      compared.push({ caseId, status: 'new-case' });
      continue;
    }

    const qualityDrop =
      currentCase.medianQuality !== null && baselineCase.medianQuality !== null
        ? baselineCase.medianQuality - currentCase.medianQuality
        : null;
    const tokenDelta = percentageDelta(currentCase.medianTokens, baselineCase.medianTokens);
    const latencyDelta = percentageDelta(currentCase.medianLatencyMs, baselineCase.medianLatencyMs);

    const regressionReasons: string[] = [];
    if (qualityDrop !== null && qualityDrop > 0.05) {
      regressionReasons.push(`quality_drop=${qualityDrop.toFixed(3)}`);
    }
    if (tokenDelta !== null && tokenDelta > 0.2 && (qualityDrop === null || qualityDrop >= 0)) {
      regressionReasons.push(`token_increase=${(tokenDelta * 100).toFixed(1)}%`);
    }
    if (latencyDelta !== null && latencyDelta > 0.3) {
      regressionReasons.push(`latency_increase=${(latencyDelta * 100).toFixed(1)}%`);
    }
    if (currentCase.requiredMisses > baselineCase.requiredMisses) {
      regressionReasons.push('more_required_skill_misses');
    }
    if (currentCase.forbiddenHits > baselineCase.forbiddenHits) {
      regressionReasons.push('more_forbidden_skill_hits');
    }

    const row = {
      caseId,
      current: currentCase,
      baseline: baselineCase,
      regressionReasons,
    };
    compared.push(row);
    if (regressionReasons.length > 0) {
      regressions.push(row);
    }
  }

  const report = {
    currentRunId: current.runId,
    baselineRunId: baseline.runId,
    regressions,
    compared,
  };

  if (outputPath) {
    await writeJsonFile(path.resolve(outputPath), report);
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (regressions.length > 0) {
    process.exitCode = 2;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`compare-runs failed: ${message}\n`);
  process.exitCode = 1;
});
