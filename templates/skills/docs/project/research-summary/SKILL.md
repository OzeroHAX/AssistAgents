---
name: docs-project-research-summary
description: Use when the task needs the document contract for a dated project research summary in `ai-docs/project/researches/`
---

<purpose>
  <item>Define the contract for dated project research summaries so stronger research, authoring, or review skills can use one consistent standard.</item>
</purpose>

<document_target>
  <rule importance="critical">The target artifact is `ai-docs/project/researches/{date time}-{user friendly name}.md`.</rule>
  <rule importance="high">It records verified findings, assumptions or hypotheses, constraints or risks, sources, and decision impact.</rule>
</document_target>

<when_to_use>
  <item importance="critical">Use when the request is about the contents, scope, or review target of a project research summary document.</item>
  <item importance="high">Use when another skill needs this document contract as supporting context.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to perform the research itself or to execute implementation, testing, or review work.</item>
  <item importance="high">Do not use as the primary execution skill when a stronger research, authoring, or review skill should lead.</item>
</when_not_to_use>

<input_requirements>
  <required>A request about the structure, scope, or review standard for a project research summary document.</required>
  <optional>Existing files under `ai-docs/project/researches/`, related project documents, research questions, source links, and decision notes tied to the findings.</optional>
</input_requirements>

<workflow>
  <step>Confirm that the task is about the document contract, not about conducting the research itself.</step>
  <step>Keep the document explicit about verified findings, assumptions or hypotheses, constraints or risks, sources, and decision impact.</step>
  <step>If active research, authoring, or review is needed, hand execution to the stronger skill and keep this contract as context.</step>
</workflow>

<output_requirements>
  <requirement>The result maps clearly to `ai-docs/project/researches/{date time}-{user friendly name}.md`.</requirement>
  <requirement>The expected scope is explicit enough to separate findings, assumptions or hypotheses, constraints or risks, sources, and decision impact.</requirement>
</output_requirements>

<validation>
  <item importance="critical">The skill maps to `ai-docs/project/researches/{date time}-{user friendly name}.md` as a concrete document artifact.</item>
  <item importance="high">The contract keeps findings, assumptions or hypotheses, constraints or risks, sources, and decision impact explicit enough for consistent authoring and review handoff.</item>
  <item importance="high">The skill is not mistaken for research execution or for broader decision-making workflow.</item>
</validation>
