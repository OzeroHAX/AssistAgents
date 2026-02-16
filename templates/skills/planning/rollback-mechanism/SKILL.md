---
name: planning-rollback-mechanism
description: Rollback mechanics and scenario: criteria, steps, data impact, recovery
---

<purpose>
  <item>Create a fast and safe path to revert in case of degradation</item>
</purpose>

<inputs>
  <required>Change description + rollout strategy</required>
  <optional>Data/compatibility constraints (especially for migrations)</optional>
  <optional>Available mechanisms: revert, feature flag, blue-green</optional>
</inputs>

<method>
  <step>Define rollback criteria (degradation signals, thresholds, time)</step>
  <step>Select a rollback mechanism and estimate recovery time (RTO)</step>
  <step>Describe rollback steps (operational actions) and order</step>
  <step>Describe data impact and compatibility after rollback</step>
  <step>Define post-rollback verification (at minimum: key scenarios + metrics)</step>
</method>

<output_format>
  <section>Rollback criteria</section>
  <section>Rollback mechanism + expected time</section>
  <section>Rollback steps</section>
  <section>Data impact / compatibility</section>
  <section>Post-rollback verification</section>
</output_format>

<quality_rules>
  <rule importance="critical">Rollback is feasible within a clear timeframe and described step-by-step</rule>
  <rule importance="high">Data impact is stated (what happens to partially applied changes)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not leave rollback as "we will roll back if needed" without mechanics</item>
  <item importance="high">Do not plan a rollback that requires manual data edits without verification</item>
</do_not>
