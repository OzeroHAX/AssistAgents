---
name: docs-project-prd
description: Use when the task needs the contract for `ai-docs/project/prd.md`
---

<purpose>
  <item>Define the contract for `ai-docs/project/prd.md` so authoring and review skills share one PRD standard.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifact is `ai-docs/project/prd.md`.</rule>
  <rule importance="high">It covers product scope, functional requirements, non-functional requirements, and testable acceptance criteria.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, or review target of the PRD.</item>
  <item importance="high">Use when another skill needs the PRD contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, testing, or planning work outside the PRD artifact.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill is available.</item>
</when_not_to_use>

<input_requirements>
  <required>Product scope, feature context, or requirements discussion related to the PRD.</required>
  <optional>Existing `ai-docs/project/prd.md`, project brief, personas, use cases, constraints, and acceptance-criteria notes.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about `ai-docs/project/prd.md` or about providing its contract to another skill.</step>
  <step>Keep product scope, functional requirements, non-functional requirements, and acceptance criteria explicit.</step>
  <step>When active authoring or review is needed, pass execution to the stronger skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/prd.md`.</requirement>
  <requirement>The PRD scope is explicit enough for consistent authoring or review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/prd.md` as a concrete document artifact.</item>
  <item importance="high">PRD scope and handoff boundaries are explicit.</item>
  <item importance="high">The skill is not mistaken for implementation, testing, or broader planning execution.</item>
</validation>
