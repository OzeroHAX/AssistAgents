---
name: planning-testing-strategy
description: Testing strategy: what to verify, test types, data needs
---

<purpose>
  <item>Define a sufficient verification set tied to AC and risks</item>
</purpose>

<inputs>
  <required>AC/Goal + change list</required>
  <optional>Critical scenarios, edge cases, risks</optional>
  <optional>Available environments and test data</optional>
</inputs>

<method>
  <step>Map each key AC/risk to a check (unit/integration/e2e/manual)</step>
  <step>Define a regression minimum for adjacent impacted areas</step>
  <step>Define test data and environments</step>
  <step>Define acceptance signals (what counts as a successful verification)</step>
</method>

<output_format>
  <section>Test scope</section>
  <section>Test types</section>
  <section>Key scenarios + edge-cases</section>
  <section>Data / environments</section>
  <section>Acceptance signals</section>
</output_format>

<quality_rules>
  <rule importance="critical">Checks are tied to changes/risks, not "just in case"</rule>
  <rule importance="high">Regression coverage exists around the impact area, not only the happy path</rule>
</quality_rules>
