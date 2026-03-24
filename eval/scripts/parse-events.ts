import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { discoverSkillNames, parseCliArgs, resolveRepoPath } from './common.js';
import type { ParsedTrace, UsageMetrics } from './types.js';

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function lowerString(value: unknown): string {
  return typeof value === 'string' ? value.toLowerCase() : '';
}

function normalizeText(input: string): string {
  return input.replace(/\r\n/g, '\n').trim();
}

function uniquePreserveOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }

  return result;
}

function tryReadUsageCandidate(value: JsonRecord): UsageMetrics | null {
  const numberOrNull = (candidate: unknown): number | null =>
    typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : null;

  const nestedTokens = isRecord(value.tokens) ? value.tokens : null;
  const input = numberOrNull(
    value.inputTokens ??
      value.input_tokens ??
      value.promptTokens ??
      value.prompt_tokens ??
      nestedTokens?.input ??
      nestedTokens?.input_tokens ??
      nestedTokens?.prompt ??
      nestedTokens?.prompt_tokens
  );
  const output = numberOrNull(
    value.outputTokens ??
      value.output_tokens ??
      value.completionTokens ??
      value.completion_tokens ??
      nestedTokens?.output ??
      nestedTokens?.output_tokens ??
      nestedTokens?.completion ??
      nestedTokens?.completion_tokens
  );
  const total = numberOrNull(
    value.totalTokens ??
      value.total_tokens ??
      nestedTokens?.total ??
      nestedTokens?.total_tokens
  );

  if (input === null && output === null && total === null) return null;

  return {
    input,
    output,
    total: total ?? (input !== null && output !== null ? input + output : null),
    estimated: total === null,
    candidatesFound: 1,
  };
}

function chooseBestUsage(candidates: UsageMetrics[]): UsageMetrics {
  if (candidates.length === 0) {
    return { input: null, output: null, total: null, estimated: true, candidatesFound: 0 };
  }

  const best = [...candidates].sort((left, right) => {
    const totalLeft = left.total ?? -1;
    const totalRight = right.total ?? -1;
    if (totalLeft !== totalRight) return totalRight - totalLeft;

    const outputLeft = left.output ?? -1;
    const outputRight = right.output ?? -1;
    return outputRight - outputLeft;
  })[0];

  return {
    ...(best ?? { input: null, output: null, total: null, estimated: true, candidatesFound: 0 }),
    candidatesFound: candidates.length,
  };
}

function looksLikeToolCall(record: JsonRecord, pathLabel: string): string | null {
  const typeHints = [
    lowerString(record.type),
    lowerString(record.kind),
    lowerString(record.event),
    lowerString(record.role),
  ].join(' ');

  const toolName =
    (typeof record.tool === 'string' && record.tool) ||
    (typeof record.toolName === 'string' && record.toolName) ||
    (typeof record.name === 'string' && record.name) ||
    null;

  if (!toolName) return null;

  const looksToolish =
    typeHints.includes('tool') ||
    pathLabel.toLowerCase().includes('tool') ||
    'arguments' in record ||
    'params' in record ||
    'input' in record ||
    'callId' in record ||
    'call_id' in record;

  return looksToolish ? toolName : null;
}

function collectAssistantText(value: unknown, assistantContext: boolean, collected: string[]): void {
  if (typeof value === 'string') {
    if (assistantContext) {
      const trimmed = normalizeText(value);
      if (trimmed.length >= 20) {
        collected.push(trimmed);
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectAssistantText(item, assistantContext, collected);
    }
    return;
  }

  if (!isRecord(value)) return;

  if (
    lowerString(value.type) === 'text' &&
    typeof value.text === 'string'
  ) {
    const trimmed = normalizeText(value.text);
    if (trimmed.length >= 20) {
      collected.push(trimmed);
    }
  }

  const nextAssistantContext =
    assistantContext ||
    lowerString(value.role).includes('assistant') ||
    lowerString(value.author).includes('assistant') ||
    lowerString(value.source).includes('assistant') ||
    lowerString(value.type).includes('assistant');

  for (const [key, child] of Object.entries(value)) {
    const childAssistantContext = nextAssistantContext || key.toLowerCase().includes('assistant');
    collectAssistantText(child, childAssistantContext, collected);
  }
}

function extractSessionIds(value: unknown, collected: string[]): void {
  if (Array.isArray(value)) {
    for (const item of value) extractSessionIds(item, collected);
    return;
  }

  if (!isRecord(value)) return;

  for (const [key, child] of Object.entries(value)) {
    if (/session/i.test(key) && typeof child === 'string' && child.trim().length >= 6) {
      collected.push(child.trim());
    }
    extractSessionIds(child, collected);
  }
}

function walkEvent(
  value: unknown,
  pathStack: string[],
  knownSkillNames: string[],
  toolCalls: ParsedTrace['toolCalls'],
  skillCalls: ParsedTrace['skillCalls'],
  usageCandidates: UsageMetrics[]
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walkEvent(item, [...pathStack, String(index)], knownSkillNames, toolCalls, skillCalls, usageCandidates);
    });
    return;
  }

  if (!isRecord(value)) return;

  const pathLabel = pathStack.join('.');
  const usageCandidate = tryReadUsageCandidate(value);
  if (usageCandidate) usageCandidates.push(usageCandidate);

  const toolName = looksLikeToolCall(value, pathLabel);
  if (toolName) {
    toolCalls.push({ name: toolName, eventPath: pathLabel });
    if (toolName === 'skill') {
      const haystack = JSON.stringify(value).toLowerCase();
      const matchedSkills = knownSkillNames.filter((skillName) => haystack.includes(skillName.toLowerCase()));
      skillCalls.push({ eventPath: pathLabel, matchedSkills: uniquePreserveOrder(matchedSkills) });
    }
  }

  for (const [key, child] of Object.entries(value)) {
    walkEvent(child, [...pathStack, key], knownSkillNames, toolCalls, skillCalls, usageCandidates);
  }
}

export function parseEventText(rawContent: string, knownSkillNames: string[]): ParsedTrace {
  const lines = rawContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const parsedEvents: unknown[] = [];
  let parseErrors = 0;

  for (const line of lines) {
    try {
      parsedEvents.push(JSON.parse(line) as unknown);
    } catch {
      parseErrors += 1;
    }
  }

  const toolCalls: ParsedTrace['toolCalls'] = [];
  const skillCalls: ParsedTrace['skillCalls'] = [];
  const usageCandidates: UsageMetrics[] = [];
  const assistantTextCandidates: string[] = [];
  const sessionIds: string[] = [];

  for (const [index, event] of parsedEvents.entries()) {
    walkEvent(event, [`event${index}`], knownSkillNames, toolCalls, skillCalls, usageCandidates);
    collectAssistantText(event, false, assistantTextCandidates);
    extractSessionIds(event, sessionIds);
  }

  const uniqueTexts = uniquePreserveOrder(
    assistantTextCandidates
      .map((item) => normalizeText(item))
      .filter((item) => item.length >= 20)
  );

  const responseText = uniqueTexts.length === 0
    ? ''
    : (uniqueTexts[uniqueTexts.length - 1] ?? '');

  const loadedSkills = uniquePreserveOrder(skillCalls.flatMap((call) => call.matchedSkills));

  return {
    eventCount: parsedEvents.length,
    parseErrors,
    sessionIds: uniquePreserveOrder(sessionIds),
    toolCalls,
    skillCalls,
    loadedSkills,
    responseText,
    usage: chooseBestUsage(usageCandidates),
  };
}

export async function parseEventFile(filePath: string, knownSkillNames: string[]): Promise<ParsedTrace> {
  const content = await fs.readFile(filePath, 'utf8');
  return parseEventText(content, knownSkillNames);
}

async function main(): Promise<void> {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const filePath = flags.get('--file')?.[0];

  if (!filePath) {
    throw new Error('Usage: tsx eval/scripts/parse-events.ts --file <events.ndjson>');
  }

  const knownSkillNames = await discoverSkillNames();
  const trace = await parseEventFile(resolveRepoPath(filePath), knownSkillNames);
  process.stdout.write(`${JSON.stringify(trace, null, 2)}\n`);
}

const isDirectRun = process.argv[1]
  ? fileURLToPath(import.meta.url) === process.argv[1]
  : false;

if (isDirectRun) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`parse-events failed: ${message}\n`);
    process.exitCode = 1;
  });
}
