#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getFlag,
  parseCliArgs,
  writeTextFile,
} from '../shared/fs.mjs';
import {
  extractTaggedText,
  getDefaultLlmCommand,
  invokeLlm,
} from '../shared/llm.mjs';

export function buildRefinerPrompt(skillText, diagnosis) {
  return [
    'You are the refiner pass for an OpenCode skill-improvement loop.',
    'Rewrite the skill so it addresses the diagnosis directly.',
    'Hard requirements:',
    '- preserve YAML frontmatter with name and description',
    '- keep the body in XML-like sections',
    '- keep all skill text in English',
    '- keep changes focused on the diagnosis rather than expanding the skill unnecessarily',
    '- return only <updated_skill>...</updated_skill>',
    '',
    'Current skill:',
    '```md',
    skillText.trim(),
    '```',
    '',
    'Diagnosis:',
    '```json',
    JSON.stringify(diagnosis, null, 2),
    '```',
  ].join('\n');
}

export async function refineSkill(options) {
  const prompt = buildRefinerPrompt(options.skillText, options.diagnosis);
  const responseText = await invokeLlm({
    prompt,
    command: options.llmCommand,
    timeoutMs: options.timeoutMs ?? 300_000,
  });

  if (!responseText) {
    return {
      prompt,
      responseText: null,
      updatedSkill: null,
    };
  }

  const updatedSkill = extractTaggedText(responseText, 'updated_skill');
  if (!updatedSkill) {
    throw new Error('Refiner response did not contain <updated_skill>...</updated_skill>');
  }

  return {
    prompt,
    responseText,
    updatedSkill: updatedSkill.trim(),
  };
}

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const skillPath = getFlag(flags, '--skill');
  const diagnosisPath = getFlag(flags, '--diagnosis');
  const outputPath = getFlag(flags, '--out');
  const promptPath = getFlag(flags, '--prompt-out');
  const llmCommand = getFlag(flags, '--llm-command', getDefaultLlmCommand());

  if (!skillPath || !diagnosisPath) {
    throw new Error('Usage: node refine-skill.mjs --skill <SKILL.md> --diagnosis <diagnosis.json> --out <candidate.md>');
  }

  const [skillText, diagnosis] = await Promise.all([
    fs.readFile(skillPath, 'utf8'),
    fs.readFile(diagnosisPath, 'utf8').then((text) => JSON.parse(text)),
  ]);

  const refinement = llmCommand ? await refineSkill({ skillText, diagnosis, llmCommand }) : {
    prompt: buildRefinerPrompt(skillText, diagnosis),
    responseText: null,
    updatedSkill: null,
  };

  if (promptPath) {
    await writeTextFile(promptPath, refinement.prompt);
  }

  if (!refinement.responseText || !refinement.updatedSkill) {
    process.stderr.write('No LLM command configured; wrote prompt only.\n');
    return;
  }

  if (outputPath) {
    await writeTextFile(outputPath, `${refinement.updatedSkill}\n`);
  } else {
    process.stdout.write(`${refinement.updatedSkill}\n`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`refine-skill failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
