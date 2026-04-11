---
name: docs-project-task
description: Use when the task needs the implementation-ready task document contract for `ai-docs/project/tasks/*.md`
---

<purpose>
  <item>Define the contract for `ai-docs/project/tasks/*.md`.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifacts are `ai-docs/project/tasks/{task key}-{task number}-{user friendly name}.md`.</rule>
  <rule importance="high">Each task doc should make implementation scope or outcome, traceability, dependencies or order, acceptance criteria, definition of done, validation signals, and estimate or scope-cut notes explicit when relevant.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about project task-document contents, scope, or review criteria.</item>
  <item importance="high">Use when another skill needs the task-document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, or runtime operation.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill should create or revise task documents.</item>
</when_not_to_use>

<input_requirements>
  <required>A request related to project task document scope, structure, or review.</required>
  <optional>Existing `ai-docs/project/tasks/*.md`, relevant epics, PRD, use cases, architecture notes, dependencies, or delivery constraints.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the request is about the document contract rather than active task authoring, decomposition, or execution.</step>
  <step>Keep implementation-readiness expectations explicit: scope or outcome, traceability, dependencies or order, acceptance criteria, definition of done, and validation signals.</step>
  <step>Supply this contract as supporting context when another skill needs the project task-document standard.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/tasks/{task key}-{task number}-{user friendly name}.md`.</requirement>
  <requirement>The contract is explicit enough for consistent authoring and review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/tasks/*.md` as a concrete document artifact.</item>
  <item importance="high">Task-document expectations keep implementation readiness, traceability, and reviewability explicit.</item>
  <item importance="high">The skill is not mistaken for implementation, delivery execution, or active task decomposition.</item>
</validation>
