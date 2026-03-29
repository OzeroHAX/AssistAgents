#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  discoverSkillNames,
  getFlag,
  getMultiFlag,
  parseCliArgs,
} from './fs.mjs';
import { parseEventText } from './parse-events.mjs';

async function main() {
  const { flags } = parseCliArgs(process.argv.slice(2));
  const inputFile = getFlag(flags, '--file');
  const skillsRoot = getFlag(flags, '--skills-root');
  const explicitSkills = getMultiFlag(flags, '--skill');

  if (!inputFile) {
    throw new Error('Usage: node parse-events-cli.mjs --file <events.ndjson> [--skills-root <dir>] [--skill <name>]');
  }

  const [rawContent, discoveredSkills] = await Promise.all([
    fs.readFile(path.resolve(inputFile), 'utf8'),
    skillsRoot ? discoverSkillNames(path.resolve(skillsRoot)) : Promise.resolve([]),
  ]);
  const knownSkillNames = Array.from(new Set([...discoveredSkills, ...explicitSkills]));
  const parsed = parseEventText(rawContent, knownSkillNames);

  process.stdout.write(`${JSON.stringify(parsed, null, 2)}\n`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`parse-events-cli failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
