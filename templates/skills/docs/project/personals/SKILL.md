---
name: docs-project-personals
description: Use when the task needs the document contract for `ai-docs/project/personals.md`
---

<purpose>
  <item>Define the contract for `ai-docs/project/personals.md` so stronger authoring or review skills can use one consistent personas-document standard.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifact is `ai-docs/project/personals.md`.</rule>
  <rule importance="high">It captures the key user personas, their goals, pains, needs, motivations, concerns, and role constraints.</rule>
  <rule importance="high">It supports requirement prioritization, scenario design, and UX decisions by grounding them in explicit user needs.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, or review target of the personas document.</item>
  <item importance="high">Use when another skill needs that document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, testing, or direct UX design work outside the personas document artifact.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill is available.</item>
</when_not_to_use>

<input_requirements>
  <required>Project context or discovery material related to the user personas document.</required>
  <optional>Existing `ai-docs/project/personals.md`, research notes, interviews, support feedback, PRD, and use cases.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about `ai-docs/project/personals.md` or about supplying its contract to another skill.</step>
  <step>Keep persona role, goals, pains, needs, motivations, concerns, and constraints explicit enough to support prioritization and scenario design.</step>
  <step>If active authoring or review is needed, hand execution to the stronger skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/personals.md` and makes the expected personas scope explicit enough for authoring or review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/personals.md` as a concrete document artifact.</item>
  <item importance="high">Persona scope and handoff boundaries are explicit.</item>
  <item importance="high">The skill is not mistaken for implementation, direct UX execution, or general discovery work outside the document contract.</item>
</validation>
