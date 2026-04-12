---
name: docs-project-status
description: Use when the task needs the contract for `ai-docs/project/status.json`
---

<purpose>
  <item>Define the shared contract for `ai-docs/project/status.json` so stronger authoring or review skills use one consistent status tracker.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifact is `ai-docs/project/status.json`.</rule>
  <rule importance="high">It records the current planning `phase`, `stage`, `step_status`, `gate`, `reasons`, `blockers`, `next_action`, and `updated_at`.</rule>
  <rule importance="high">Phase-specific status skills may tighten allowed values or conditional fields; this skill keeps only the shared document contract.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, schema, or review target of the project status tracker.</item>
  <item importance="high">Use when another skill needs the `ai-docs/project/status.json` contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="high">Do not use as the primary execution skill when a phase-specific status updater or a stronger authoring/review skill should drive behavior.</item>
</when_not_to_use>

<input_requirements>
  <required>A planning-context request about the expected contents of `ai-docs/project/status.json`.</required>
  <optional>Existing `ai-docs/project/status.json`, active phase, current stage result, blockers, and adjacent planning artifacts.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about `ai-docs/project/status.json` or about supplying its contract to another skill.</step>
  <step>Keep the shared status fields and handoff meaning explicit.</step>
  <step>If active status authoring or review is needed, defer execution to the stronger phase-specific or review skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/status.json`.</requirement>
  <requirement>The shared status fields and handoff intent are explicit enough for consistent authoring or review.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/status.json` as a concrete project artifact.</item>
  <item importance="high">Status scope, core tracking fields, and handoff boundaries are explicit.</item>
  <item importance="high">The skill is not mistaken for phase execution or as the standalone status-updater workflow.</item>
</validation>
