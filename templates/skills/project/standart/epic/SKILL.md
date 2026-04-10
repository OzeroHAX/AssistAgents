---
name: project-standart-epic
description: Use when `standart` discovery must create or revise prioritized epic documents from PRD, use cases, and architecture before task decomposition
---

<purpose>
  <item>Create or update prioritized epic documents as manageable value slices for downstream task planning.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use after PRD, use cases, and architecture are available, before task decomposition, when epic documents must be created or revised.</item>
  <item importance="high">Use when delivery must be sequenced by value, dependencies, critical path, or major risk.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, or runtime operation.</item>
  <item importance="high">Do not use when no `ai-docs/project/epics/*.md` update is in scope, or when the task belongs to architecture authoring or task decomposition.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-epic</item>
  <item>planning-change-inventory</item>
  <item>planning-scope-minimization</item>
  <item>planning-estimation</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/epics/{epic key}-{epic number}-{user friendly name}.md`.</rule>
  <rule importance="high">When revising an existing set, preserve valid scope decisions and make splits, merges, removals, or resequencing explicit.</rule>
</document_target>

<input_requirements>
  <required>PRD or an equivalent requirements source, current use cases, and current architecture.</required>
  <required>Scope for epic planning: a new epic set or a requested revision.</required>
  <optional>Existing epic documents, delivery constraints, sequencing preferences, timebox limits, or known risks.</optional>
</input_requirements>

<workflow>
  <step>Inspect the PRD, use cases, architecture, and any existing epic documents to extract value slices, constraints, and dependencies.</step>
  <step>If decisive inputs are missing or conflicting, surface the gap or conflict before finalizing the epic set.</step>
  <step>Group the work into vertical epics, then define traceability, order, critical-path implications, acceptance criteria, and definition of done.</step>
  <step>Write or update `ai-docs/project/epics/*.md`, making added, changed, merged, removed, or resequenced epics explicit.</step>
</workflow>

<output_requirements>
  <requirement>The result is an updated `ai-docs/project/epics/{epic key}-{epic number}-{user friendly name}.md` set plus a short change summary for added, changed, merged, removed, or resequenced epics.</requirement>
  <requirement>Each epic includes summary, scope and non-goals, traceability, dependencies and order, acceptance criteria, and definition of done.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent epics or dependencies without evidence or explicit assumptions.</rule>
  <rule importance="critical">Keep epics vertical, narrow, and traceable, and make every merge, split, or removal explicit.</rule>
  <rule importance="high">Sequence epics by dependencies, major risk, and the critical path.</rule>
</quality_rules>

<validation>
  <item importance="critical">`ai-docs/project/epics/` reflects the requested create or revise scope.</item>
  <item importance="critical">Each epic contains the required sections plus explicit traceability.</item>
  <item importance="critical">Ordering is explicit enough to support downstream task decomposition, and open assumptions or risks remain visible.</item>
</validation>
