---
name: docs-project-use-case
description: Use when the task needs the document contract for project use-case files in `ai-docs/project/use-cases/`
---

<purpose>
  <item>Define the contract for project use-case documents so stronger authoring or review skills share one scenario-document standard.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifacts are `ai-docs/project/use-cases/{use case key}-{use case number}-{user friendly name}.md`.</rule>
  <rule importance="high">Each file covers one user scenario with goal, actors or preconditions, main flow, alternate or error flows, and PRD or acceptance-criteria traceability.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, structure, or review target of project use-case documents.</item>
  <item importance="high">Use when another skill needs this document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, testing, or operational execution outside the document artifacts.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill is available.</item>
</when_not_to_use>

<input_requirements>
  <required>Scenario scope, user goal, or document discussion related to project use-case files.</required>
  <optional>Existing `ai-docs/project/use-cases/*.md`, PRD, personas, acceptance criteria, edge cases, architecture notes, and user feedback.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about project use-case files or about supplying their contract to another skill.</step>
  <step>Keep scenario scope, flow structure, and PRD or AC traceability explicit.</step>
  <step>If active authoring or review is needed, hand execution to the stronger skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/use-cases/*.md` artifacts and makes the expected use-case structure explicit enough for authoring or review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/use-cases/*.md` as concrete document artifacts.</item>
  <item importance="high">Required scenario structure, traceability, and handoff boundaries are explicit.</item>
  <item importance="high">The skill is not mistaken for implementation, testing, or broader planning execution.</item>
</validation>
