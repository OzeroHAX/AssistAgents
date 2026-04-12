---
name: docs-project-epic
description: Use when the task needs the epic document contract for `ai-docs/project/epics/*.md`
---

<purpose>
  <item>Define the contract for `ai-docs/project/epics/*.md`.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifacts are `ai-docs/project/epics/{epic key}-{epic number}-{user friendly name}.md`.</rule>
  <rule importance="high">Each epic should make value slice, scope and non-goals, traceability, dependencies and order, acceptance criteria, and definition of done explicit.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, or review target of project epic documents.</item>
  <item importance="high">Use when another skill needs the epic document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, testing, or delivery execution.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill should create or revise `ai-docs/project/epics/*.md`.</item>
</when_not_to_use>

<input_requirements>
  <required>A request related to project epic document scope, structure, or review.</required>
  <optional>Existing `ai-docs/project/epics/*.md`, PRD, use cases, architecture, dependencies, sequencing notes, or decomposition constraints.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about the contract for `ai-docs/project/epics/*.md` rather than active epic authoring or revision.</step>
  <step>Keep value slice, traceability, dependencies, order, and readiness for task decomposition explicit.</step>
  <step>Supply this contract as supporting context when another skill needs the epic document standard.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/epics/{epic key}-{epic number}-{user friendly name}.md`.</requirement>
  <requirement>The contract is explicit enough for consistent authoring and review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/epics/*.md` as a concrete document artifact.</item>
  <item importance="high">Epic scope, traceability, dependencies, order, and decomposition-readiness expectations are explicit.</item>
  <item importance="high">The skill is not mistaken for implementation, testing, or broader delivery execution.</item>
</validation>
