---
name: project-standart-research
description: Use when another skill needs targeted web, code, or context research and a dated research summary should capture the findings without deciding the next step
---

<purpose>
  <item>Run targeted research for other skills when they need evidence from the web, codebase, or project context.</item>
  <item>Produce a dated research summary with source-backed findings without deciding the caller's next step.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when another skill explicitly needs research in the web, repository code, or project context and wants the findings captured in `ai-docs/project/researches/`.</item>
  <item importance="high">Use when the caller needs one or more delegated research passes before it can continue its own workflow.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, or runtime operation.</item>
  <item importance="high">Do not use for broad exploratory discovery; keep it focused on concrete caller questions and the minimum research modes needed.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-research-summary</item>
  <item>task-use-research-code-strategy</item>
  <item>task-use-research-context-strategy</item>
  <item>task-use-research-web-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create `ai-docs/project/researches/{date time}-{user friendly name}.md`.</rule>
</document_target>

<input_requirements>
  <required>1-3 concrete research questions from the calling skill plus enough context to choose web, code, context, or a combination.</required>
  <optional>Relevant repository artifacts, user links, vendor docs, standards, regulatory sources, or caller-supplied constraints.</optional>
</input_requirements>

<workflow>
  <step>Confirm the caller's research goal and narrow the work to 1-3 verifiable questions.</step>
  <step>Select the needed research mode or modes: `task-use-research-code-strategy`, `task-use-research-context-strategy`, and/or `task-use-research-web-strategy`.</step>
  <step>Delegate the research with explicit scope, evidence expectations, and output shape for each selected mode.</step>
  <step>Collect authoritative sources and repository evidence first, and label weaker or conflicting evidence explicitly.</step>
  <step>Separate verified findings from assumptions, open questions, risks, and constraints.</step>
  <step>Write the dated research summary with the caller goal, selected research modes, findings, and sources.</step>
</workflow>

<output_requirements>
  <requirement>The result is a dated research summary in `ai-docs/project/researches/{date time}-{user friendly name}.md`.</requirement>
  <requirement>The document includes the caller goal, research questions, selected research modes, verified findings, assumptions or hypotheses, risks and constraints, and sources.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Every material finding cites a source, and missing or conflicting evidence stays explicit.</rule>
  <rule importance="high">Load only the research task skills needed for the active question set, even though all supported modes are preloaded.</rule>
  <rule importance="high">Do not recommend the next step or decide whether the caller can proceed; return evidence and let the caller decide.</rule>
</quality_rules>

<validation>
  <item importance="critical">The research summary is written to the required path and contains the required sections.</item>
  <item importance="critical">Verified findings, assumptions, and unresolved risks are clearly separated.</item>
  <item importance="high">The document states which research modes were used and keeps caller decision-making outside this skill.</item>
</validation>
