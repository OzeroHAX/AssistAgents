---
name: project-standart-personas
description: Use when standard discovery must create or update `ai-docs/project/personals.md` from PRD evidence to map personas, pains, scenarios, and priority conflicts
---

<purpose>
  <item>Create or refresh project personas that explain which users matter, what they need, and how those differences affect requirement priority.</item>
</purpose>

<when_to_use>
  <item importance="critical">After the baseline PRD exists and before use cases or epics that depend on user-role differences.</item>
  <item importance="high">Use when requirements, objections, success criteria, or scenarios vary by role or segment.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, runtime operation, or generic brainstorming outside the declared discovery flow.</item>
  <item importance="high">Do not use when no personas document is being created or updated, or when the task belongs to a narrower document or review skill.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-personals</item>
  <item>planning-requirements-extraction</item>
  <item>planning-impact-analysis</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/personals.md`.</rule>
</document_target>

<input_requirements>
  <required>Baseline PRD, equivalent requirement source, or explicit requirement notes that justify persona differences.</required>
  <optional>Existing `ai-docs/project/personals.md`, project brief, research, interviews, support notes, or market evidence.</optional>
  <optional>Known roles, segments, constraints, or priority conflicts.</optional>
</input_requirements>

<workflow>
  <step>Inspect the baseline PRD and adjacent evidence to identify which roles or segments materially affect requirements or priorities.</step>
  <step>If persona boundaries or evidence are unclear, ask targeted follow-up questions before writing and keep unsupported assumptions explicit.</step>
  <step>Define primary and secondary personas with jobs-to-be-done, pains, triggers, objections, constraints, and measurable success criteria.</step>
  <step>Map relevant PRD requirements or feature priorities to those personas and mark conflicts or trade-offs between them.</step>
  <step>Write or update `ai-docs/project/personals.md` with the required sections and a handoff to use-case and epic work.</step>
</workflow>

<output_requirements>
  <requirement>The result is a structured `ai-docs/project/personals.md`.</requirement>
  <requirement>Each persona includes role summary, goals, pains, triggers, objections, constraints, and measurable success criteria.</requirement>
  <requirement>The document maps PRD requirements or feature priorities to personas and makes conflicts, trade-offs, unsupported assumptions, and downstream handoff explicit.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent personas, pains, or prioritization claims that are not supported by PRD evidence, user input, or clearly labeled assumptions.</rule>
  <rule importance="high">Each persona must influence at least one prioritization, requirement interpretation, or downstream scenario decision.</rule>
  <rule importance="high">Conflicting persona needs and unresolved assumptions must stay explicit.</rule>
</quality_rules>

<validation>
  <item importance="critical">`ai-docs/project/personals.md` exists or is updated, and the required persona sections are present.</item>
  <item importance="critical">Persona distinctions, mapped requirements, and prioritization conflicts are explicit and grounded in available project evidence or clearly labeled assumptions.</item>
  <item importance="high">The result gives a clear handoff to downstream use-case or epic work without hidden persona assumptions.</item>
</validation>
