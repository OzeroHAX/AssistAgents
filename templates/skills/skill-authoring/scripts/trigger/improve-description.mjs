#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getFlag,
  parseCliArgs,
  parseSkillMarkdown,
  writeJsonFile,
  writeTextFile,
} from '../shared/fs.mjs';
import {
  extractTaggedText,
  getDefaultLlmCommand,
  invokeLlm,
} from '../shared/llm.mjs';

export function buildDescriptionPrompt(options) {
  const failedTriggers = options.evalResults.results.filter((result) => result.shouldTrigger && !result.pass);
  const falseTriggers = options.evalResults.results.filter((result) => !result.shouldTrigger && !result.pass);

  const lines = [
    `You are optimizing the frontmatter description for an OpenCode skill called "${options.skillName}".`,
    'Return only <description>...</description>.',
    'Goals:',
    '- trigger for relevant user intents',
    '- avoid triggering for near-miss intents',
    '- stay comfortably under 1024 characters',
    '- generalize from the failures instead of enumerating the eval queries',
    '',
    'Current description:',
    `"${options.currentDescription}"`,
    '',
  ];

  if (failedTriggers.length > 0) {
    lines.push('FAILED TO TRIGGER:');
    for (const result of failedTriggers) {
      lines.push(`- "${result.query}" (${result.triggers}/${result.runs})`);
    }
    lines.push('');
  }

  if (falseTriggers.length > 0) {
    lines.push('FALSE TRIGGERS:');
    for (const result of falseTriggers) {
      lines.push(`- "${result.query}" (${result.triggers}/${result.runs})`);
    }
    lines.push('');
  }

  if (options.history.length > 0) {
    lines.push('PREVIOUS ATTEMPTS:');
    for (const item of options.history) {
      lines.push(`- ${item.description} -> ${item.score}`);
    }
    lines.push('');
  }

  lines.push('Skill body for context:');
  lines.push('```md');
  lines.push(options.skillBody.trim());
  lines.push('```');

  return lines.join('\n');
}

export async function improveDescription(options) {
  const prompt = buildDescriptionPrompt(options);
  const responseText = await invokeLlm({
    prompt,
    command: options.llmCommand,
    timeoutMs: options.timeoutMs ?? 300_000,
  });

  if (!responseText) {
    return {
      prompt,
      description: null,
      responseText: null,
    };
  }

  const description = extractTaggedText(responseText, 'description') ?? responseText.trim();
  return {
    prompt,
    description,
    responseText,
  };
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const skillPath = getFlag(flags, '--skill');
  const evalResultsPath = getFlag(flags, '--eval-results');
  const historyPath = getFlag(flags, '--history');
  const outputPath = getFlag(flags, '--out');
  const promptPath = getFlag(flags, '--prompt-out');
  const llmCommand = getFlag(flags, '--llm-command', getDefaultLlmCommand());

  if (!skillPath || !evalResultsPath) {
    throw new Error('Usage: node improve-description.mjs --skill <SKILL.md> --eval-results <results.json>');
  }

  const [skillText, evalResults, history] = await Promise.all([
    fs.readFile(skillPath, 'utf8'),
    fs.readFile(evalResultsPath, 'utf8').then((text) => JSON.parse(text)),
    historyPath ? fs.readFile(historyPath, 'utf8').then((text) => JSON.parse(text)) : Promise.resolve([]),
  ]);

  const parsed = parseSkillMarkdown(skillText);
  const improvement = await improveDescription({
    skillName: parsed.name,
    currentDescription: parsed.description,
    skillBody: parsed.body,
    evalResults,
    history,
    llmCommand,
  });

  if (promptPath) {
    await writeTextFile(promptPath, improvement.prompt);
  }

  if (outputPath) {
    await writeJsonFile(outputPath, improvement);
  } else {
    process.stdout.write(`${JSON.stringify(improvement, null, 2)}\n`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`improve-description failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
