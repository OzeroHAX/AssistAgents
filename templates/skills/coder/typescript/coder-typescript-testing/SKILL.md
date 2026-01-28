---
name: coder-typescript-testing
description: TypeScript testing best practices: unit/integration strategy, test structure, isolation, and mocking. Use when writing or reviewing TS tests.
---
<skill_overview>
  <purpose>Write fast, reliable tests that document behavior</purpose>
  <triggers>
    <trigger>Writing unit tests</trigger>
    <trigger>Setting up integration tests</trigger>
    <trigger>Mocking external dependencies</trigger>
    <trigger>Stabilizing flaky tests</trigger>
  </triggers>
  <sources>
    <source url="https://nodejs.org/api/test.html">Node.js Test Runner Documentation</source>
  </sources>
</skill_overview>
<runner_choice>
  <guidance>Pick a runner that matches your environment and CI constraints</guidance>
  <options>
    <option name="node:test">Built-in, minimal dependencies, good for Node runtimes</option>
    <option name="Jest">Rich ecosystem, snapshots, wide adoption</option>
    <option name="Vitest">Fast, modern, Jest-compatible API</option>
  </options>
</runner_choice>
<test_types>
  <unit>
    <description>Single function or class, fast and deterministic</description>
  </unit>
  <integration>
    <description>Multiple components together, real IO where needed</description>
  </integration>
  <e2e>
    <description>Full system flows, limited count due to cost</description>
  </e2e>
</test_types>
<unit_testing>
  <pattern name="arrange_act_assert" required="true">
    <example>
      <code>
import assert from "node:assert/strict";
import { test } from "node:test";

test("sum adds numbers", () => {
  // Arrange
  const a = 1;
  const b = 2;

  // Act
  const result = sum(a, b);

  // Assert
  assert.equal(result, 3);
});
      </code>
    </example>
  </pattern>
  <naming_convention>
    <format>"should [behavior] when [condition]"</format>
    <examples>
      <good>"should return user when id exists"</good>
      <good>"should reject when password is weak"</good>
      <bad>"test1"</bad>
    </examples>
  </naming_convention>
</unit_testing>
<test_isolation>
  <rules>
    <rule>No shared mutable state between tests</rule>
    <rule>Reset globals and mocks after each test</rule>
    <rule>Each test must run independently</rule>
  </rules>
</test_isolation>
<mocking>
  <rules>
    <rule>Mock IO boundaries (network, filesystem, time)</rule>
    <rule>Do not mock value objects or simple data</rule>
    <rule>Prefer fakes over deep mocks for readability</rule>
  </rules>
  <example>
    <code>
import assert from "node:assert/strict";
import { test } from "node:test";

test("spies on a method", (t) => {
  const counter = {
    value: 1,
    inc() {
      this.value += 1;
      return this.value;
    }
  };

  t.mock.method(counter, "inc");
  assert.equal(counter.inc(), 2);
  assert.equal(counter.inc.mock.callCount(), 1);
});
    </code>
  </example>
</mocking>
<determinism>
  <rules>
    <rule>Control time with fake timers</rule>
    <rule>Seed randomness or inject RNG</rule>
    <rule>Avoid real network calls in unit tests</rule>
  </rules>
</determinism>
<anti_patterns>
  <avoid name="sleep_in_tests">Using real timeouts to wait for async</avoid>
  <avoid name="flaky_order">Tests depending on execution order</avoid>
  <avoid name="over_mocking">Mocking internal implementation details</avoid>
</anti_patterns>
