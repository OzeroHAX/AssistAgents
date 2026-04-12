---
name: docs-project-arch
description: Use when the task needs the contract for `ai-docs/project/arch.md`
---

<purpose>
  <item>Define what `ai-docs/project/arch.md` must cover so authoring and review skills share one architecture-document contract.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifact is `ai-docs/project/arch.md`.</rule>
  <rule importance="high">It covers component boundaries, interfaces and contracts, technical constraints, risks, and engineering trade-offs.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, or review target of the architecture document.</item>
  <item importance="high">Use when another skill needs that document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, testing, or general system-design discussion outside the document artifact.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger authoring or review skill is available.</item>
</when_not_to_use>

<input_requirements>
  <required>Project scope or planning context for the architecture document.</required>
  <optional>PRD, use cases, existing `ai-docs/project/arch.md`, repository evidence, integration notes, and non-functional constraints.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about `ai-docs/project/arch.md` or about supplying its contract to another skill.</step>
  <step>Keep component boundaries, interfaces, constraints, risks, and trade-offs explicit.</step>
  <step>If active authoring or review is needed, hand execution to the stronger skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/arch.md`.</requirement>
  <requirement>The expected architecture scope is explicit enough for authoring or review handoff.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/arch.md` as a concrete document artifact.</item>
  <item importance="high">Architecture scope and handoff boundaries are explicit.</item>
  <item importance="high">The skill is not mistaken for a standalone execution workflow.</item>
</validation>
