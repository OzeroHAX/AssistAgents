import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_SCOPE,
  WIDE_PATTERNS,
  validatePattern,
  validatePatternWithForce,
  normalizePattern,
  buildPermissionLines,
} from '../src/planner-scope.js';

// Unit tests for validation logic

test('validatePattern accepts valid md patterns', () => {
  const validPatterns = [
    'docs/**.md',
    'docs/**/*.md',
    'plans/*.md',
    'ai-docs/dev-plans/**.md',
    'gsd-plans/**.md',
    'README.md',
  ];

  for (const pattern of validPatterns) {
    const result = validatePattern(pattern);
    assert.equal(result.valid, true, `Pattern "${pattern}" should be valid`);
  }
});

test('validatePattern rejects non-md patterns', () => {
  const invalidPatterns = [
    'src/**',
    'docs/**.txt',
    '*.json',
    'plans/',
  ];

  for (const pattern of invalidPatterns) {
    const result = validatePattern(pattern);
    assert.equal(result.valid, false, `Pattern "${pattern}" should be invalid`);
    assert.ok(result.error?.includes('.md'), `Error should mention .md for "${pattern}"`);
  }
});

test('validatePattern rejects absolute paths', () => {
  // Note: Windows absolute paths like C:\... are only detected on Windows
  // On Unix, path.isAbsolute('C:\...') returns false
  const absolutePaths = [
    '/tmp/x.md',
    '/home/user/plans/*.md',
  ];

  for (const pattern of absolutePaths) {
    const result = validatePattern(pattern);
    assert.equal(result.valid, false, `Absolute path "${pattern}" should be invalid`);
    assert.ok(result.error?.includes('Absolute'), `Error should mention absolute for "${pattern}"`);
  }
});

test('validatePattern rejects parent directory references', () => {
  const parentRefs = [
    '../plans/*.md',
    'docs/../plans/*.md',
    './plans/../x.md',
  ];

  for (const pattern of parentRefs) {
    const result = validatePattern(pattern);
    assert.equal(result.valid, false, `Pattern with .. "${pattern}" should be invalid`);
    assert.ok(result.error?.includes('..'), `Error should mention .. for "${pattern}"`);
  }
});

test('validatePattern rejects empty patterns', () => {
  const result = validatePattern('');
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes('empty'));
});

test('validatePattern marks wide patterns with isWidePattern flag', () => {
  for (const pattern of WIDE_PATTERNS) {
    const result = validatePattern(pattern);
    assert.equal(result.valid, false, `Wide pattern "${pattern}" should be invalid by default`);
    assert.equal(result.isWidePattern, true, `Pattern "${pattern}" should be marked as wide`);
  }
});

test('validatePatternWithForce allows wide patterns with force', () => {
  for (const pattern of WIDE_PATTERNS) {
    const result = validatePatternWithForce(pattern, true);
    assert.equal(result.valid, true, `Wide pattern "${pattern}" should be valid with force`);
    assert.equal(result.isWidePattern, true);
    assert.ok(result.warning?.includes('--force'), `Should include --force warning for "${pattern}"`);
  }
});

test('validatePatternWithForce rejects wide patterns without force', () => {
  for (const pattern of WIDE_PATTERNS) {
    const result = validatePatternWithForce(pattern, false);
    assert.equal(result.valid, false, `Wide pattern "${pattern}" should be invalid without force`);
  }
});

test('validatePatternWithForce still rejects absolute paths even with force', () => {
  const result = validatePatternWithForce('/tmp/x.md', true);
  assert.equal(result.valid, false, 'Absolute paths should be rejected even with force');
});

test('validatePatternWithForce still rejects .. even with force', () => {
  const result = validatePatternWithForce('../x.md', true);
  assert.equal(result.valid, false, '.. should be rejected even with force');
});

// Unit tests for normalizePattern

test('normalizePattern trims whitespace', () => {
  assert.equal(normalizePattern('  docs/**.md  '), 'docs/**.md');
  assert.equal(normalizePattern('\tdocs/**.md\n'), 'docs/**.md');
});

// Unit tests for buildPermissionLines

test('buildPermissionLines generates correct YAML lines', () => {
  const patterns = ['ai-docs/dev-plans/**.md', 'docs/**.md'];
  const lines = buildPermissionLines(patterns);
  
  assert.equal(lines, '"ai-docs/dev-plans/**.md": allow\n"docs/**.md": allow');
});

test('buildPermissionLines handles single pattern', () => {
  const lines = buildPermissionLines([DEFAULT_SCOPE]);
  assert.equal(lines, `"${DEFAULT_SCOPE}": allow`);
});

// Unit tests for constants

test('DEFAULT_SCOPE is ai-docs/dev-plans/**.md', () => {
  assert.equal(DEFAULT_SCOPE, 'ai-docs/dev-plans/**.md');
});

test('WIDE_PATTERNS includes expected patterns', () => {
  assert.ok(WIDE_PATTERNS.includes('**/*.md'));
  assert.ok(WIDE_PATTERNS.includes('**/**.md'));
  assert.ok(WIDE_PATTERNS.includes('*.md'));
  assert.equal(WIDE_PATTERNS.length, 3);
});
