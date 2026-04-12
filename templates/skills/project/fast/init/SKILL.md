---
name: project-fast-init
description: Use when fast planning must set the first-iteration goal, scope, timebox, minimal artifacts, and critical unknowns before downstream fast stages
---

<purpose>
  <item>Prepare the first fast-planning kickoff so downstream stages start with fixed boundaries.</item>
</purpose>

<when_to_use>
  <item importance="critical">After discovery mode is confirmed as `fast`, or when a new project needs first-iteration boundaries.</item>
  <item importance="high">When the next fast stage depends on a quick goal, scope, timebox, and unknowns decision.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to choose discovery mode, or after the fast kickoff boundaries are already fixed.</item>
  <item importance="high">Do not use for pulse-scan, stack selection, detailed specification, implementation, delivery execution, or runtime work.</item>
</when_not_to_use>

<required_preload>
  <item>shared-base-rules</item>
</required_preload>

<input_requirements>
  <required>User or stakeholder request and the expected project outcome.</required>
  <optional>Known constraints or system context that can change the first-iteration boundary.</optional>
</input_requirements>

<workflow>
  <step>Define the project goal as one measurable outcome for the fast iteration.</step>
  <step>Fix the iteration boundary by stating explicit in-scope and out-of-scope items.</step>
  <step>Set a concrete timebox and define the minimum artifacts required before the next fast stage.</step>
  <step>List only the critical unknowns that can block the next fast decision, and escalate if they exceed the fast flow.</step>
</workflow>

<output_requirements>
  <requirement>Produce a structured kickoff result with exactly these sections: Goal, In scope, Out of scope, Timebox, Minimal artifacts to produce, Critical unknowns.</requirement>
  <requirement>Make the goal measurable, the boundaries explicit, the timebox concrete, and each critical unknown a blocker or decision-driving question.</requirement>
  <requirement>If critical unknowns can invalidate the fast flow, include an escalation note or next-step recommendation.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Task boundaries are explicitly defined and verifiable.</rule>
  <rule importance="critical">There is a completion criterion for planning itself, not implementation.</rule>
  <rule importance="high">The minimal artifact set is defined before detailed elaboration starts.</rule>
</quality_rules>

<validation>
  <item importance="critical">The kickoff result contains all required sections and each section is concrete enough to guide the next fast stage.</item>
  <item importance="critical">Required preload skills are satisfied and the first-iteration boundary is fixed before completion.</item>
  <item importance="high">The next phase handoff or escalation condition is explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not move to implementation before fast-iteration boundaries are fixed.</item>
  <item importance="high">Do not expand scope without explicit escalation to the standard flow.</item>
</do_not>
