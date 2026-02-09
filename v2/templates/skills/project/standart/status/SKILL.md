---
name: project-standart-status
description: Mandatory standard-flow tracker that updates status.json after each standard stage and before implementation gate
---

<purpose>
  <item>Use `status.json` as the single source of truth for standard planning stage</item>
  <item>Track gate decision, blockers, next action, and readiness to move to delivery</item>
</purpose>

<when_to_use>
  <item importance="critical">At the beginning of the standard flow to initialize status</item>
  <item importance="critical">After completing each step: brief, research, prd, personas, usecases, arch, epic, decomposition</item>
  <item importance="critical">Before handoff to implementation (final readiness gate)</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
</required_preload>

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
</status_file_contract>

<allowed_values>
  <phase><item>standard-planning</item></phase>
  <stage>
    <item>init</item><item>brief</item><item>research</item><item>prd</item><item>personas</item>
    <item>usecases</item><item>arch</item><item>epic</item><item>decomposition</item><item>finalize</item>
  </stage>
  <step_status><item>done</item><item>partial</item><item>blocked</item></step_status>
  <gate><item>PASS</item><item>CONCERNS</item><item>FAIL</item></gate>
</allowed_values>

<quality_rules>
  <rule importance="critical">If `status.json` is not updated, the stage is considered incomplete</rule>
  <rule importance="critical">Do not set `PASS` when critical blockers exist</rule>
  <rule importance="high">`next_action` must be specific and executable as one next step</rule>
</quality_rules>
