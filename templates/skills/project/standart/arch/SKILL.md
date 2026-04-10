---
name: project-standart-arch
description: Use when `standart` discovery must create or update `ai-docs/project/arch.md` from PRD and use cases before epic or task planning
---

<purpose>
  <item>Create or update `ai-docs/project/arch.md` with components, contracts, risks, and guardrails that turn PRD and use-case scope into implementation-ready architecture.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use after PRD and use cases exist, before epics or task decomposition, when architecture must be created or revised.</item>
  <item importance="high">Use when integrations, migrations, public contracts, or non-functional constraints materially affect delivery risk.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, or runtime operation.</item>
  <item importance="high">Do not use when no `ai-docs/project/arch.md` update is in scope, or when the task belongs to epic or task planning.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-arch</item>
  <item>planning-impact-analysis</item>
  <item>planning-risk-assessment</item>
  <item>planning-migration-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/arch.md`.</rule>
  <rule importance="high">If the document already exists, preserve valid decisions and make changed assumptions, contracts, and constraints explicit.</rule>
</document_target>

<input_requirements>
  <required>PRD or an equivalent requirements source plus the current use cases.</required>
  <required>Scope for the architecture work: a new document or a requested revision.</required>
  <optional>Existing `ai-docs/project/arch.md`, repository evidence, schemas, integration notes, migration plans, or deployment constraints.</optional>
  <optional>Known non-functional requirements, security expectations, scalability concerns, observability needs, or public contract constraints.</optional>
</input_requirements>

<workflow>
  <step>Inspect the PRD, use cases, and relevant project evidence to extract critical flows, integrations, non-functional constraints, and unresolved architecture questions.</step>
  <step>If decisive inputs are missing or conflicting, ask targeted follow-up questions before finalizing the document.</step>
  <step>Define components, boundaries, data flows, interfaces, contracts, and key trade-offs without inventing unsupported systems.</step>
  <step>Record risks, mitigations, fallback strategies, and implementation guardrails for downstream epics and tasks.</step>
  <step>Write or update `ai-docs/project/arch.md` with the required sections and explicit assumptions or open risks.</step>
</workflow>

<output_requirements>
  <requirement>The result is a structured `ai-docs/project/arch.md`.</requirement>
  <requirement>The document covers architecture goals and constraints, component model and data flows, interfaces and contracts, key decisions and trade-offs, risks and mitigations, and implementation guardrails.</requirement>
  <requirement>External contracts, migration constraints, assumptions, unresolved risks, and downstream planning guardrails are explicit.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent components, interfaces, contracts, migration claims, or non-functional assumptions that are not supported by project evidence or clearly labeled assumptions.</rule>
  <rule importance="critical">Critical PRD and use-case paths plus external dependencies must be reflected in the architecture or called out as explicit open risks.</rule>
  <rule importance="high">Major architectural decisions state rationale and downstream consequences.</rule>
  <rule importance="high">Unresolved assumptions, compatibility risks, and fallback strategies remain explicit.</rule>
</quality_rules>

<validation>
  <item importance="critical">`ai-docs/project/arch.md` exists or is updated, and the required architecture sections are present.</item>
  <item importance="critical">Critical PRD and use-case requirements, external contracts, and material non-functional or migration constraints are reflected or marked as explicit assumptions or risks.</item>
  <item importance="critical">Major decisions include rationale and implementation guardrails for downstream planning.</item>
  <item importance="high">Unsupported assumptions and open risks remain explicit.</item>
</validation>
