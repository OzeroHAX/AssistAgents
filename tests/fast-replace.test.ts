import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const cliSource = readFileSync('src/cli.ts', 'utf-8');
const packageJson = readFileSync('package.json', 'utf-8');

test('cli supports fast-replace mode', () => {
  assert.match(
    cliSource,
    /const args = process\.argv\.slice\(2\);\s*const fastReplace = args\.includes\('--fast-replace'\)/,
    'src/cli.ts must detect the --fast-replace flag'
  );
});

test('dev:fast runs fast-replace with Russian language override', () => {
  assert.match(
    packageJson,
    /"dev:fast"\s*:\s*"tsx src\/cli\.ts --fast-replace --language Russian"/,
    'package.json must run dev:fast with a Russian language override'
  );
  assert.match(
    cliSource,
    /readCliOption\(args,\s*'--language'\)\s*\|\|\s*DEFAULT_RESPONSE_LANGUAGE/,
    'src/cli.ts must allow fast-replace to override the response language from CLI args'
  );
});

test('fast-replace uses prompt defaults without interactive questions', () => {
  assert.match(
    cliSource,
    /const responseLanguage = readCliOption\(args,\s*'--language'\)\s*\|\|\s*DEFAULT_RESPONSE_LANGUAGE/,
    'fast-replace must default to the normal response-language value when no override is passed'
  );
  assert.match(
    cliSource,
    /skillLevel:\s*DEFAULT_USER_SKILL_LEVEL/,
    'fast-replace must reuse the normal skill-level default'
  );
  assert.match(
    cliSource,
    /knownTech:\s*parseKnownTechnologies\(DEFAULT_KNOWN_TECHNOLOGIES\)/,
    'fast-replace must reuse the normal known-tech default'
  );
  assert.match(
    cliSource,
    /communicationStyle:\s*DEFAULT_COMMUNICATION_STYLE/,
    'fast-replace must reuse the normal communication-style default'
  );
});

test('fast-replace auto-confirms backup and keeps prompt-default install decisions', () => {
  assert.match(
    cliSource,
    /modeLabel:\s*'fast-replace'/,
    'fast-replace must report its own mode label'
  );
  assert.match(
    cliSource,
    /doBackup:\s*true/,
    'fast-replace must always create a backup without prompting'
  );
  assert.match(
    cliSource,
    /selectedModelReplacements:\s*\{\}/,
    'fast-replace must behave like skipping explicit model overrides'
  );
  assert.match(
    cliSource,
    /enableHashFileTools:\s*false/,
    'fast-replace must behave like accepting the hash-tools prompt default'
  );
  assert.match(
    cliSource,
    /enabledMcpIds:\s*getDefaultEnabledMcpIds\(keyFilledState\)/,
    'fast-replace must behave like accepting the MCP prompt defaults'
  );
  assert.match(
    cliSource,
    /keyInput:\s*\{\}/,
    'fast-replace must keep existing key files instead of re-prompting'
  );
});
