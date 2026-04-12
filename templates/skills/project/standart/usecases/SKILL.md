---
name: project-standart-usecases
description: Use when `standart` discovery must create or revise traceable use-case documents from PRD, personas, or user feedback before epic or task planning
---

<purpose>
  <item>Create or update traceable use-case documents that describe user goals, flows, edge cases, and validation signals before epic or task planning.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use after PRD and personas are available, before epics or task decomposition, when the project needs new or revised use-case documents.</item>
  <item importance="high">Use when the user asks to add, correct, or remove scenarios in the current use-case set.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, delivery execution, or runtime operation.</item>
  <item importance="high">Do not use for architecture, epic, or task decomposition unless the outcome is updated `ai-docs/project/use-cases/*.md` artifacts.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>docs-project-use-case</item>
  <item>planning-requirements-extraction</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create or update `ai-docs/project/use-cases/{use case key}-{use case number}-{user friendly name}.md`.</rule>
  <rule importance="high">Update matching files for corrections, add new files for new scenarios, and make removals explicit in the artifact set.</rule>
</document_target>

<input_requirements>
  <required>Relevant PRD requirements or acceptance criteria plus personas or equivalent actor context.</required>
  <required>Scope for the affected use case: new scenario, requested revision, or removal request.</required>
  <optional>Existing use-case documents, edge cases, constraints, architecture notes, or explicit user feedback.</optional>
</input_requirements>

<workflow>
  <step>Confirm create/update/remove scope and the affected scenarios.</step>
  <step>Inspect the relevant PRD, personas, existing use-case documents, and user feedback to extract actors, goals, constraints, acceptance criteria, and affected flows.</step>
  <step>If requested changes conflict with prior requirements, personas, or traceability, surface the conflict and ask for a decision before finalizing.</step>
  <step>Write, update, or remove the affected use-case docs so the retained scenario set covers the maximum feasible share of PRD-described functionality without speculative scenarios, and each retained scenario includes goal, actors and preconditions, main flow, alternate/error flows, relevant data/integration notes, PRD/AC traceability, and validation signals.</step>
  <step>Verify that the final artifact set reflects every requested addition, correction, and removal.</step>
</workflow>

<output_requirements>
  <requirement>The result is updated `ai-docs/project/use-cases/{use case key}-{use case number}-{user friendly name}.md` artifacts plus an explicit record of which scenarios were added, updated, or removed.</requirement>
  <requirement>Each retained use case includes goal, actors and preconditions, main flow, alternate/error flows, relevant data or integration notes, PRD or AC traceability, and validation signals.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent actors, requirements, or flows when PRD/persona evidence or revision scope is missing; ask for clarification or surface assumptions first.</rule>
  <rule importance="critical">Cover the maximum feasible share of PRD-described functionality with the use-case set, but include only scenarios that are clearly required by the service and supported by PRD/persona evidence.</rule>
  <rule importance="critical">Every retained scenario must stay traceable to PRD requirements or acceptance criteria, and every removal or merge must be explicit.</rule>
  <rule importance="high">Critical alternate and failure flows must remain covered, and requested additions, corrections, or deletions must be reflected in the final artifact set.</rule>
</quality_rules>

<validation>
  <item importance="critical">The affected use-case documents are written to or updated under `ai-docs/project/use-cases/`, and the final artifact set matches the requested create/update/remove scope.</item>
  <item importance="critical">The use-case set covers the maximum feasible share of PRD-described functionality without adding speculative scenarios that are not clearly required by the service.</item>
  <item importance="critical">Each retained scenario includes the required sections and explicit PRD or AC traceability.</item>
  <item importance="critical">Requested user changes are reflected in the output, and unresolved conflicts or assumptions remain explicit.</item>
  <item importance="high">Validation signals are specific enough to support later scenario testing or planning.</item>
</validation>
