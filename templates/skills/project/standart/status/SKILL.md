---
name: project-standart-status
description: Use when standard planning must update `status.json` at flow start, after each declared stage, or before implementation handoff
---

<purpose>
  <item>Keep `status.json` current for standard-planning state and readiness.</item>
</purpose>

<when_to_use>
  <item importance="critical">At standard-planning start to initialize `status.json`.</item>
  <item importance="critical">After each standard stage: brief, prd, personas, usecases, arch, epic, decomposition.</item>
  <item importance="critical">Before implementation handoff to record the final readiness gate.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use outside the declared project phase or flow step.</item>
  <item importance="high">Do not use as a replacement for implementation, delivery execution, or runtime operation.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
</required_preload>

<input_requirements>
  <required>Current stage name and actual result: done, partial, or blocked.</required>
  <required>Concrete reasons, blockers, and one executable `next_action`.</required>
  <optional>Artifact references that explain the state change.</optional>
  <optional>`corrective_actions`, `recheck_criteria`, `owner`, or `unblock_plan` for non-pass or blocked outcomes.</optional>
</input_requirements>

<status_file_contract>
  <rule importance="critical">File: `status.json`</rule>
  <rule importance="critical">Format: valid JSON without comments</rule>
  <required_fields>
    <field>phase</field>
    <field>stage</field>
    <field>step_status</field>
    <field>gate</field>
    <field>reasons</field>
    <field>blockers</field>
    <field>next_action</field>
    <field>updated_at</field>
  </required_fields>
  <conditional_fields>
    <item>If `gate` != `PASS`, add `corrective_actions` and `recheck_criteria`.</item>
    <item>If `step_status` = `blocked`, add `owner` and `unblock_plan`.</item>
  </conditional_fields>
</status_file_contract>

<allowed_values>
  <phase><item>standard-planning</item></phase>
  <stage>
    <item>init</item><item>brief</item><item>prd</item><item>personas</item>
    <item>usecases</item><item>arch</item><item>epic</item><item>decomposition</item><item>finalize</item>
  </stage>
  <step_status><item>done</item><item>partial</item><item>blocked</item></step_status>
  <gate><item>PASS</item><item>CONCERNS</item><item>FAIL</item></gate>
</allowed_values>

<workflow>
  <step>Create `status.json` if missing, then set `phase` to `standard-planning` and `stage` to the actual current stage.</step>
  <step>If open questions appear while producing brief, prd, or another planning document, keep `stage` set to that current document stage and record the needed research follow-up in `reasons`, `blockers`, and `next_action` instead of switching to a standalone `research` stage.</step>
  <step>Update `step_status`, `gate`, `reasons`, `blockers`, and `next_action` from the real outcome only.</step>
  <step>Add `corrective_actions` and `recheck_criteria` when `gate` != `PASS`, and `owner` plus `unblock_plan` when `step_status` = `blocked`.</step>
  <step>On finalization, set the implementation-readiness gate from the full planning state, update `updated_at`, and save valid JSON.</step>
</workflow>

<output_requirements>
  <requirement>Produce a valid `status.json` with all required fields for the current state.</requirement>
  <requirement>For non-pass or blocked results, include concrete recovery fields instead of vague notes.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">If `status.json` is not updated, the stage is incomplete.</rule>
  <rule importance="critical">Do not set `PASS` when critical blockers exist.</rule>
  <rule importance="high">Do not introduce a standalone `research` stage; research is supporting work inside the active planning document stage when open questions remain.</rule>
  <rule importance="high">`next_action` must be specific, and non-pass or blocked states must include recovery details.</rule>
</quality_rules>

<validation>
  <item importance="critical">`status.json` exists, is valid JSON, and contains the required and conditional fields for the recorded state.</item>
  <item importance="critical">The recorded phase, stage, status, gate, blockers, and next action match the real planning outcome.</item>
  <item importance="high">The final handoff or recovery path is explicit.</item>
</validation>
