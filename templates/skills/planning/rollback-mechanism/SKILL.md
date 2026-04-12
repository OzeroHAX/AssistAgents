---
name: planning-rollback-mechanism
description: Use when a plan needs concrete rollback triggers, rollback steps, data impact, and recovery checks
---

<purpose>
  <item>Define an executable rollback plan for degraded changes or failed cutovers.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the main planning question is how to roll back safely after degradation, a failed rollout, or a failed cutover.</item>
  <item importance="high">Use when the plan needs concrete rollback triggers, a chosen mechanism, ordered steps, and expected recovery time.</item>
  <item importance="high">Use when partial rollout state or migration state changes what can be reverted safely.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is rollout staging, migration phasing, or monitoring design.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<input_requirements>
  <required>Change being rolled back and the degradation signal</required>
  <required>Available rollback mechanisms and recovery constraints</required>
  <optional>Partial rollout or migration state that affects reversibility</optional>
  <optional>Manual or tool-driven operational dependencies</optional>
</input_requirements>

<workflow>
  <step>Define rollback criteria, including degradation signals, thresholds, and who can declare rollback.</step>
  <step>Choose the rollback mechanism and expected recovery time.</step>
  <step>List rollback steps in execution order and note prerequisites or irreversible limits.</step>
  <step>State data impact and post-rollback verification.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Rollback criteria`, `Chosen mechanism + expected time`, `Rollback steps`, `Data impact / compatibility`, and `Post-rollback verification`.</requirement>
  <requirement>`Rollback steps` must be ordered and concrete enough to execute without inventing missing mechanics.</requirement>
  <requirement>`Data impact / compatibility` must state what happens to partial changes and any irreversible limit or required follow-up recovery work.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Rollback criteria and ordered actions are concrete enough to execute within a clear timeframe.</rule>
  <rule importance="high">Data impact is explicit about partial changes or manual reconciliation risk.</rule>
</quality_rules>

<validation>
  <item importance="critical">A reviewer can identify the rollback trigger, chosen mechanism, ordered actions, and post-rollback checks without inferring missing mechanics.</item>
  <item importance="critical">Irreversible limits or unresolved recovery dependencies are surfaced when they affect rollback safety.</item>
  <item importance="high">The result stays focused on rollback mechanics rather than implementation, rollout staging, or migration phasing.</item>
</validation>
