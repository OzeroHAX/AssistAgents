---
name: project-fast-pulse-scan
description: Use when fast planning needs a short post-init research scan to confirm decision-critical constraints, risks, and escalation triggers before stack selection
---

<purpose>
  <item>Collect only the external facts and constraints that can change the next fast-planning decision.</item>
</purpose>

<when_to_use>
  <item importance="critical">After `project-fast-init` and before `project-fast-stack-pick` when critical unknowns still affect the next fast decision.</item>
  <item importance="high">When integrations, compliance, SLA, vendor limits, or external dependencies could change architecture, scope, or whether fast mode remains viable.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use outside the active fast-planning step or when implementation/runtime work is requested.</item>
  <item importance="high">Do not run broad exploratory research when the current fast decision can already proceed without it.</item>
</when_not_to_use>

<required_preload>
  <item>web-strategy</item>
  <item>planning-risk-assessment</item>
  <item>planning-impact-analysis</item>
</required_preload>

<input_requirements>
  <required>Goal, scope, timebox, and critical unknowns from `project-fast-init`.</required>
  <optional>Known technical choices, project pain points, integrations, compliance obligations, or vendor constraints.</optional>
</input_requirements>

<workflow>
  <step>Turn the remaining unknowns into 1-3 verifiable research questions that can change the next fast decision.</step>
  <step>Research only the minimum primary sources needed to answer those questions.</step>
  <step>Extract the top constraints, top risks, and concrete escalation triggers that can change stack selection, scope, or mode.</step>
  <step>Separate verified facts from assumptions and note unresolved unknowns.</step>
  <step>Return a compact pulse-scan result for the next stage.</step>
</workflow>

<output_requirements>
  <requirement>Produce exactly these sections: Research questions, Verified findings, Assumptions or open questions, Top constraints, Top risks + mitigations, Escalation triggers, Sources.</requirement>
  <requirement>Every verified finding cites at least one reliable source.</requirement>
  <requirement>Each escalation trigger states whether to continue in fast mode, add corrective research, or escalate to standard planning.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Every material finding is source-backed.</rule>
  <rule importance="high">Facts, assumptions, and unresolved unknowns stay separate.</rule>
  <rule importance="high">Only decision-driving constraints and risks are included.</rule>
</quality_rules>

<validation>
  <item importance="critical">The result contains all required sections and source-backed verified findings.</item>
  <item importance="critical">The scan stays limited to decision-critical questions from the active fast stage.</item>
  <item importance="high">The handoff to `project-fast-stack-pick` or escalation to standard planning is explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not run broad research without narrowly scoped questions tied to the next fast decision.</item>
  <item importance="high">Do not include secondary risks that do not change the next step.</item>
</do_not>
