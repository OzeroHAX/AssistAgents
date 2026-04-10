---
name: planning-migration-strategy
description: Use when planning a safe schema, data, API, or contract migration with phased compatibility and verification
---

<purpose>
  <item>Plan a migration that preserves data integrity while old and new shapes coexist.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the main planning question is how to phase a schema, data, API, event, or contract migration safely.</item>
  <item importance="high">Use when old and new writers, readers, or consumers must coexist during a compatibility window.</item>
  <item importance="high">Use when the plan needs backfill, cutover, or verification strategy.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is a narrower planning output such as rollback mechanics, rollout stages, or test strategy.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<input_requirements>
  <required>What is being migrated and which producers, consumers, or stores depend on it</required>
  <required>Constraints on downtime, sequencing, compatibility, or correctness</required>
  <optional>Data volume, migration window, or backfill limits</optional>
  <optional>Current and target schema or contract versions</optional>
</input_requirements>

<workflow>
  <step>List the migration objects, dependencies, and compatibility constraints.</step>
  <step>Choose a pattern such as expand/contract, dual-write, backfill, or versioned interfaces and justify it.</step>
  <step>Split the work into preparation, compatibility, transfer or backfill, cutover, and cleanup.</step>
  <step>For each phase, state the actions, coexistence expectations, and exit criteria.</step>
  <step>Define verification and note rollback dependencies or unresolved risks when they matter.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Migration objects`, `Chosen pattern + rationale`, `Phases`, `Compatibility window`, and `Data verification`.</requirement>
  <requirement>Each phase must state what coexists, what changes, and what condition allows the next phase.</requirement>
  <requirement>State unknowns, rollback dependencies, or follow-up planning needs when they materially affect migration safety.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">The plan includes concrete integrity verification, not only "run the migration and monitor".</rule>
  <rule importance="critical">Compatibility during the migration window is explicit about which versions, writers, readers, or consumers coexist.</rule>
  <rule importance="high">Phase transitions include criteria, not vague sequencing.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required sections and ties the chosen pattern and phase order to stated constraints.</item>
  <item importance="critical">Compatibility expectations and data verification are explicit enough to detect unsafe cutover assumptions.</item>
  <item importance="high">Unknowns or rollback dependencies are surfaced when they affect migration safety.</item>
  <item importance="high">The result remains migration strategy, not implementation or unrelated planning.</item>
</validation>
