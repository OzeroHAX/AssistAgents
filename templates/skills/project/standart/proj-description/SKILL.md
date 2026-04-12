---
name: project-standart-prd
description: Use when standard-flow planning must create or refresh `ai-docs/project/prd.md` after the brief, clarifying requirements with the user first and focused research only when needed
---

<purpose>
  <item>Create a verifiable PRD in `ai-docs/project/prd.md` that downstream planning can trust.</item>
</purpose>

<when_to_use>
  <item importance="critical">After the brief exists, before architecture or delivery planning.</item>
  <item importance="high">Use when the PRD needs clarified scope, FR/NFR, and testable acceptance criteria from user answers or focused research.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for brief authoring, standalone research, architecture, or implementation/runtime work.</item>
  <item importance="high">Do not finalize while decisive gaps, disputed decisions, or unchecked doubtful claims remain unresolved.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-prd</item>
  <item>planning-base</item>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
  <item>planning-testing-strategy</item>
  <item>project-standart-research</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/prd.md`.</rule>
  <rule importance="high">If a PRD already exists, ask whether to rewrite it or update it before writing.</rule>
</document_target>

<input_requirements>
  <required>A current project brief or equivalent source of product goals and scope.</required>
  <optional>Research findings, an existing PRD, and other discovery artifacts that affect requirements.</optional>
  <optional>Known constraints, integrations, compliance needs, success criteria, or links.</optional>
</input_requirements>

<workflow>
  <step>Inspect the brief, research, and any PRD; if a PRD already exists, confirm rewrite versus update before writing.</step>
  <step>Extract goal, scope, FR/NFR, dependencies, and constraints from available evidence, and ask targeted user questions when decisive facts or priorities are unclear.</step>
  <step>If user answers and repository evidence still leave gaps, delegate 1-3 focused questions to `project-standart-research` for web/context/code research, then return options when evidence supports multiple defensible choices.</step>
  <step>Ask the user to confirm disputed choices, keep open questions only by explicit request, then write or update `ai-docs/project/prd.md` with the required sections and confirmed decisions.</step>
</workflow>

<output_requirements>
  <requirement>The result is `ai-docs/project/prd.md` with Goal, Functional requirements, Non-functional requirements, Acceptance criteria, In scope / Out of scope, Dependencies and constraints, Success metrics, and Open questions.</requirement>
  <requirement>Requirements align with the brief, user clarifications, and delegated research; doubtful claims and competing options are resolved or left open only by user request.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent missing requirements, leave open questions by default, or silently choose among disputed options.</rule>
  <rule importance="critical">Ask the user first when decisive facts are unclear, and use `project-standart-research` only for focused evidence gaps still blocking the PRD.</rule>
</quality_rules>

<validation>
  <item importance="critical">`ai-docs/project/prd.md` is created or updated and contains the required sections with testable acceptance criteria.</item>
  <item importance="critical">Decisive gaps are resolved through user clarification first and focused research when needed; open questions remain only by explicit user choice.</item>
</validation>
