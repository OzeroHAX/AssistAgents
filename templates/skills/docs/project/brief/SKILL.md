---
name: docs-project-brief
description: Use when the task needs the document contract for `ai-docs/project/brief.md`
---

<purpose>
  <item>Define the contract for `ai-docs/project/brief.md` so stronger authoring or review skills can use one consistent brief standard.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifact is `ai-docs/project/brief.md`.</rule>
  <rule importance="high">It covers project context, problem statement, goal, MVP boundaries, key constraints, and notable assumptions.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, or review target of the project brief document.</item>
  <item importance="high">Use when another skill needs that document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, testing, or producing planning artifacts beyond the brief contract itself.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill is available.</item>
</when_not_to_use>

<input_requirements>
  <required>Project idea, problem context, or planning request related to the brief document.</required>
  <optional>Existing `ai-docs/project/brief.md`, stakeholder notes, constraints, assumptions, MVP scope notes, and adjacent planning artifacts.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about `ai-docs/project/brief.md` or about supplying its contract to another skill.</step>
  <step>Keep the problem statement, goal, MVP boundaries, constraints, and assumptions explicit.</step>
  <step>If active authoring or review is needed, hand execution to the stronger skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/brief.md`.</requirement>
  <requirement>The expected brief scope is explicit enough for consistent authoring and review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/brief.md` as a concrete document artifact.</item>
  <item importance="high">Brief scope and handoff boundaries are explicit.</item>
  <item importance="high">The skill is not mistaken for implementation or broader planning execution.</item>
</validation>
