---
name: testing-e2e-flow
description: Use when a request needs end-to-end flow checks across user paths, service boundaries, and integration chains
---

<when_to_use>
  <item importance="critical">Use when a request needs end-to-end scenario design or verification across multiple steps, systems, or services in one user-visible flow.</item>
  <item importance="high">Use when the main risk is whether data, state, or outcomes move correctly through the full chain and must be proven with reproducible evidence.</item>
</when_to_use>

<input_requirements>
  <required>Key user flow and expected business outcome</required>
  <required>Systems/services involved in the chain</required>
  <required>Environment, access, and destructive boundaries</required>
  <required>Test data setup and cleanup strategy</required>
  <optional>Data and fixtures</optional>
  <optional>Feature flags, versions, or environment-specific behavior</optional>
  <optional>Scenario criticality and recovery expectations</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use for isolated API/UI checks or automation test design when the request is not about a full cross-system flow.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm the target flow, involved systems, environment access, data setup/cleanup, and destructive boundaries.</step>
  <step importance="critical">Map the end-to-end chain with entry conditions, key checkpoints, dependencies, and final expected business outcome.</step>
  <step importance="critical">Define the minimal independent scenarios that cover the happy path, critical failures, and dependency or timeout behavior with explicit expected results at each key stage.</step>
  <step importance="high">Execute or specify reproducible steps, then summarize pass-fail outcome, evidence, cleanup status, environment constraints, and open risks per scenario.</step>
</workflow>

<design_rules>
  <rule importance="critical">Each scenario covers one full user path or integration chain from entry action to final expected outcome</rule>
  <rule importance="critical">Dependencies and checkpoints are explicitly stated</rule>
  <rule importance="high">Scenarios are independent and can run in any order</rule>
  <rule importance="high">External service failures and timeouts are considered</rule>
  <rule importance="high">Steps are reproducible and deterministic</rule>
  <rule importance="medium">Minimum number of scenarios for maximum value</rule>
  <rule importance="medium">Test data lifecycle is defined</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">Record results at each key stage</rule>
  <rule importance="critical">Separate infrastructure failures from application logic failures</rule>
  <rule importance="high">Verify idempotency of critical operations</rule>
  <rule importance="high">Record service versions, feature flags, and environment configuration</rule>
  <rule importance="high">Manage test data (create/cleanup)</rule>
  <rule importance="medium">Collect logs from all involved services</rule>
  <rule importance="medium">Record timing for key steps and failure reasons</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Critical user flows</item>
    <item>Integration points and external dependencies</item>
    <item>Errors and resilience</item>
    <item>Data consistency</item>
    <item>Critical NFRs (response time, stability)</item>
  </focus>
</coverage>

<output_requirements>
  <requirement importance="critical">For each scenario, record the flow name, environment, involved systems, preconditions or data, expected checkpoints, and final pass-fail outcome.</requirement>
  <requirement importance="critical">For each failed or risky stage, record observed versus expected behavior, the failing step in the chain, and supporting evidence or identifiers.</requirement>
  <requirement importance="high">Separate business-flow failures from infrastructure or configuration issues and record cleanup status or residual data risk.</requirement>
</output_requirements>

<do_not>
  <item importance="critical">Do not run e2e on an unstable environment</item>
  <item importance="high">Do not mix multiple business processes in one scenario</item>
  <item importance="high">Do not rely on random data</item>
  <item importance="high">Do not leave test data without cleanup</item>
</do_not>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<example_flows>
  <flow>Registration -> confirmation -> checkout -> payment -> notification</flow>
  <flow>Create entity -> verify in report -> export data</flow>
</example_flows>
