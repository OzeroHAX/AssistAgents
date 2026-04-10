---
name: project-standart-decomposition
description: Use when `standart` discovery must create or revise implementation-ready task docs from epics and supporting requirements before delivery starts
---

<purpose>
  <item>Create or update implementation-ready task docs with traceability to epics, supporting requirements, and architecture constraints.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use after epics are available and before implementation starts when `ai-docs/project/tasks/*.md` must be created or revised.</item>
  <item importance="high">Use when the task set needs sequencing, dependency, critical-path, estimate, or scope-cut decisions.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, or runtime operation.</item>
  <item importance="high">Do not use when no task-doc update is in scope, or when the requested outcome belongs to PRD, use-case, architecture, or epic authoring.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-task</item>
  <item>decomposition-strategy</item>
  <item>planning-change-inventory</item>
  <item>planning-estimation</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/tasks/{task key}-{task number}-{user friendly name}.md`.</rule>
  <rule importance="high">Make task-set deltas explicit when revising an existing set.</rule>
</document_target>

<input_requirements>
  <required>Relevant epic scope plus supporting PRD or use-case and architecture context.</required>
  <required>Requested decomposition scope: a new task set or a revision to an existing set.</required>
  <optional>Existing task docs, delivery constraints, sequencing preferences, timebox limits, or known risks.</optional>
</input_requirements>

<workflow>
  <step>Inspect the relevant epic, supporting requirements, architecture, and any existing task docs to extract outcomes, constraints, dependencies, and validation signals.</step>
  <step>If decisive inputs are missing or conflicting, surface the gap before finalizing the task set.</step>
  <step>Split the scope into independently testable tasks, then define traceability, acceptance criteria, definition of done, dependencies, order, and estimate or scope-cut notes when relevant.</step>
  <step>Write or update `ai-docs/project/tasks/*.md`, making all task-set deltas explicit.</step>
  <step>Verify that the final task set matches the requested scope and is ready for implementation planning.</step>
</workflow>

<output_requirements>
  <requirement>The result is an updated `ai-docs/project/tasks/{task key}-{task number}-{user friendly name}.md` set plus a short summary of task-set deltas.</requirement>
  <requirement>Each task doc is implementation-ready: scope or outcome, traceability, dependencies or order, acceptance criteria, definition of done, validation signals, and estimate or scope-cut notes when relevant.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent tasks, dependencies, or estimates without evidence or explicit assumptions.</rule>
  <rule importance="critical">Keep tasks narrow, testable, and traceable, and avoid ambiguous tasks without acceptance criteria or definition of done.</rule>
  <rule importance="high">Task order must reflect dependencies, major risk, and the critical path.</rule>
</quality_rules>

<validation>
  <item importance="critical">The task docs under `ai-docs/project/tasks/` match the requested create or revise scope.</item>
  <item importance="critical">Traceability and ordering are explicit enough to support implementation planning without re-analysis.</item>
  <item importance="high">Open assumptions, risks, and material scope-cut decisions remain visible.</item>
</validation>
