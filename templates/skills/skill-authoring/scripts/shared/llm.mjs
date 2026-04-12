#!/usr/bin/env node

import { runShellCommand } from './fs.mjs';

export function getDefaultLlmCommand() {
  const command = process.env.SKILL_AUTHORING_LLM_CMD;
  return typeof command === 'string' && command.trim().length > 0 ? command.trim() : null;
}

export async function invokeLlm(options) {
  const command = options.command ?? getDefaultLlmCommand();
  if (!command) {
    return null;
  }

  const result = await runShellCommand({
    command,
    cwd: options.cwd ?? process.cwd(),
    input: options.prompt,
    timeoutMs: options.timeoutMs ?? 300_000,
  });

  if (result.exitCode !== 0) {
    throw new Error(`LLM command failed with exit code ${result.exitCode}\n${result.stderr}`);
  }

  return result.stdout.trim();
}

export function extractTaggedText(text, tagName) {
  const match = text.match(new RegExp(`<${tagName}>\\s*([\\s\\S]*?)\\s*</${tagName}>`, 'i'));
  return match?.[1]?.trim() ?? null;
}

export function extractJson(text) {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1] ?? text;
  return JSON.parse(candidate);
}
