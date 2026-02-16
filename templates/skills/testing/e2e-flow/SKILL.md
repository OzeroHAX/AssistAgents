---
name: testing-e2e-flow
description: End-to-end scenarios (user paths, integration chains)
---

<input_requirements>
  <required>Key user flows</required>
  <required>Systems/services involved in the chain</required>
  <required>Environment and access</required>
  <required>Test data strategy (create/cleanup)</required>
  <optional>Data and fixtures</optional>
  <optional>Scenario criticality</optional>
</input_requirements>

<design_rules>
  <rule importance="critical">The scenario covers the full user path</rule>
  <rule importance="critical">Integration points and dependencies are explicitly stated</rule>
  <rule importance="high">Scenarios are independent and can run in any order</rule>
  <rule importance="high">External service failures and timeouts are considered</rule>
  <rule importance="high">Steps are reproducible and deterministic</rule>
  <rule importance="medium">Minimum number of scenarios for maximum value</rule>
  <rule importance="medium">Test data lifecycle is defined</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">Record results at each key stage</rule>
  <rule importance="high">Separate infrastructure failures from application logic failures</rule>
  <rule importance="high">Verify idempotency of critical operations</rule>
  <rule importance="high">Record service versions/feature flags and environment configuration</rule>
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

<do_not>
  <item importance="critical">Do not run e2e on an unstable environment</item>
  <item importance="high">Do not mix multiple business processes in one scenario</item>
  <item importance="high">Do not rely on random data</item>
  <item importance="high">Do not leave test data without cleanup</item>
</do_not>

<example_flows>
  <flow>Registration -> confirmation -> checkout -> payment -> notification</flow>
  <flow>Create entity -> verify in report -> export data</flow>
</example_flows>
