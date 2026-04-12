---
name: project-standart-brief
description: Use when confirmed `standart` discovery must create or refresh `ai-docs/project/brief.md` from project evidence, clarified inputs, reviewed links, and topic/market research delegated via `project-standart-research`
---

<purpose>
  <item>Create or refresh a concise brief grounded in mission, project evidence, reviewed user links, and researched topic and market context.</item>
</purpose>

<when_to_use>
  <item importance="critical">After `project-discovery-mode-selector` confirms `standart`, as the first standard discovery step.</item>
  <item importance="high">Use when the brief needs reviewed links and research-backed topic/market grounding before PRD or architecture work.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use before discovery mode is confirmed or for implementation or runtime work.</item>
  <item importance="high">Do not use for PRD authoring, architecture design, or standalone deep research without producing `ai-docs/project/brief.md`; that work belongs to `project-standart-research`.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-brief</item>
  <item>planning-requirements-extraction</item>
  <item>project-standart-research</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/brief.md`.</rule>
  <rule importance="critical">If a brief already exists, ask the user whether to rewrite it from scratch or update it before writing.</rule>
</document_target>

<input_requirements>
  <required>A short project mission from the user.</required>
  <optional>Relevant README, docs, prior briefs, specs, or product-facing files.</optional>
  <optional>User links, market references, competitor examples, or vendor material.</optional>
  <optional>Known audience, success criteria, constraints, or domain terms.</optional>
</input_requirements>

<workflow>
  <step>Ask for the project mission first. If `ai-docs/project/brief.md` or an equivalent brief already exists, ask whether to rewrite it or update it before writing.</step>
  <step>Inspect relevant project artifacts and capture product facts, open questions, and doubtful claims.</step>
  <step>If project essence, audience, market or alternatives, success criteria, repository structure, or user claims are unclear, ask targeted follow-up questions until the brief-level gaps are explicit.</step>
  <step>Review every user-provided link, then delegate 1-3 focused questions at a time to `project-standart-research` to verify doubtful points and gather the topic/market evidence the brief still needs.</step>
  <step>Do not finalize while decisive brief-level gaps, unread links, unchecked doubtful claims, or weak topic/market evidence remain.</step>
  <step>Write or update `ai-docs/project/brief.md`, separating facts, external evidence, and assumptions, and state rewrite/update, reviewed links, and `project-standart-research` usage or recommended next research.</step>
</workflow>

<output_requirements>
  <requirement>The result is a structured `ai-docs/project/brief.md`.</requirement>
  <requirement>The brief covers mission, project summary, audience, topic/market landscape, alternatives or competitors, success criteria, constraints, and any clearly labeled assumptions needed for the current evidence.</requirement>
  <requirement>Repository evidence, reviewed user links, and material external sources are cited or linked; unresolved brief-level questions or unverified material claims do not remain; and the result states rewrite/update plus `project-standart-research` usage or recommended next research.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not overwrite an existing brief without the user's choice of rewrite versus update, and do not invent missing critical context.</rule>
  <rule importance="critical">Do not finish with unresolved brief-level questions, unread user links, or unchecked doubtful claims in the output.</rule>
  <rule importance="high">Always review user-provided links and use `project-standart-research` for ambiguity checks plus topic/market research, while keeping this skill responsible only for brief synthesis.</rule>
  <rule importance="high">Keep repository inspection focused on product-defining files, and keep delegated research brief-serving rather than turning the brief into a standalone research report.</rule>
</quality_rules>

<validation>
  <item importance="critical">The mission is captured first, and existing-brief handling is explicit before any overwrite.</item>
  <item importance="critical">Provided links are reviewed, doubtful claims are checked, and topic/market evidence is explicit before the brief is finalized.</item>
  <item importance="critical">The brief is written to `ai-docs/project/brief.md`, required fields are present, and unresolved brief-level questions or unverified material claims do not remain in the output.</item>
  <item importance="high">Facts, external evidence, assumptions, and any `project-standart-research` usage or next-step recommendation remain explicit.</item>
</validation>
