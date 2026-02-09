---
name: project-fast-status
description: Mandatory skill for managing fast-planning progress via status.json
---

<purpose>
  <item>Use `status.json` as the single source of truth for fast-planning phase and stage</item>
  <item>Strictly track progress, blockers, gate decision, and next action</item>
  <item>Prevent moving to the next fast-flow step without a status update</item>
</purpose>

<mandatory_usage>
  <rule importance="critical">This skill is mandatory for fast planning</rule>
  <rule importance="critical">Run at the start of fast flow to initialize `status.json`</rule>
  <rule importance="critical">Run after every step: init, pulse-scan, stack-pick, proto-spec, task-blast</rule>
  <rule importance="critical">Run at the end of fast flow for the final gate decision</rule>
  <rule importance="high">If `status.json` is not updated, the step is considered incomplete</rule>
</mandatory_usage>

<when_to_use>
  <item importance="critical">Fast planning start (create initial status)</item>
  <item importance="critical">After each fast-flow stage is completed</item>
  <item importance="critical">Before handoff to implementation or escalation to standard flow</item>
</when_to_use>

<inputs>
  <required>Current fast-flow step (init, pulse-scan, stack-pick, proto-spec, task-blast)</required>
  <required>Actual step result: done/partial/blocked</required>
  <required>Short reasons and blockers list (if any)</required>
  <optional>Risks, corrective actions, recheck criteria</optional>
</inputs>

<status_file_contract>
  <rule importance="critical">File: `status.json`</rule>
  <rule importance="critical">Format: valid JSON without comments</rule>
  <rule importance="critical">Updated atomically on every run of this skill</rule>
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
    <item>If gate != PASS: `corrective_actions` and `recheck_criteria` are required</item>
    <item>If step_status = blocked: `owner` and `unblock_plan` are required</item>
  </conditional_fields>
</status_file_contract>

<allowed_values>
  <phase>
    <item>fast-planning</item>
  </phase>
  <stage>
    <item>init</item>
    <item>pulse-scan</item>
    <item>stack-pick</item>
    <item>proto-spec</item>
    <item>task-blast</item>
    <item>finalize</item>
  </stage>
  <step_status>
    <item>done</item>
    <item>partial</item>
    <item>blocked</item>
  </step_status>
  <gate>
    <item>PASS</item>
    <item>CONCERNS</item>
    <item>FAIL</item>
  </gate>
</allowed_values>

<method>
  <step>Check `status.json`; if missing, create it with a base structure</step>
  <step>Set current `phase` and `stage` according to the actual step</step>
  <step>Update `step_status`, `reasons`, `blockers`, and `next_action`</step>
  <step>If this is fast-flow finalization, set `gate` based on all stage outcomes</step>
  <step>For `CONCERNS` or `FAIL`, add `corrective_actions` and `recheck_criteria`</step>
  <step>Update `updated_at` and save valid JSON</step>
</method>

<output_format>
  <section>phase</section>
  <section>stage</section>
  <section>step_status</section>
  <section>gate</section>
  <section>reasons</section>
  <section>blockers</section>
  <section>next_action</section>
  <section>corrective_actions (if gate != PASS)</section>
  <section>recheck_criteria (if gate != PASS)</section>
  <section>updated_at</section>
</output_format>

<quality_rules>
  <rule importance="critical">`status.json` always reflects the actual current state</rule>
  <rule importance="critical">Do not move to the next stage without recording the current result</rule>
  <rule importance="high">`next_action` is specific and executable as one next step</rule>
  <rule importance="high">Reasons and blockers are verifiable and not vague</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not leave `status.json` outdated after step completion</item>
  <item importance="critical">Do not set `PASS` when critical blockers exist</item>
  <item importance="high">Do not write free text instead of structured JSON fields</item>
</do_not>

<minimal_json_example>
  <item>{"phase":"fast-planning","stage":"proto-spec","step_status":"done","gate":"CONCERNS","reasons":["NFR is only partially refined"],"blockers":["No confirmation for integration X"],"next_action":"Close integration risk and update proto-spec","corrective_actions":["Run API X contract verification"],"recheck_criteria":["Integration risk is closed","AC remain unchanged"],"updated_at":"2026-02-09T12:00:00Z"}</item>
</minimal_json_example>
