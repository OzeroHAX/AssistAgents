---
name: project-fast-stack-pick
description: Use when fast planning must choose the MVP stack after `project-fast-pulse-scan` and before `project-fast-proto-spec`
---

<purpose>
  <item>Choose the fastest defensible stack for one-iteration MVP delivery and record the decision for the next fast stage.</item>
</purpose>

<when_to_use>
  <item importance="critical">After `project-fast-pulse-scan` and before `project-fast-proto-spec` when the stack is still undecided.</item>
  <item importance="high">When there are 2+ realistic options, or when a mandated option still needs a fallback or escalation record.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use outside the active fast-planning stage or for implementation/runtime work.</item>
  <item importance="high">Do not use when the stack is already fixed and only execution, decomposition, or delivery details remain.</item>
</when_not_to_use>

<required_preload>
  <item>planning-approach-selection</item>
  <item>planning-estimation</item>
  <item>planning-risk-assessment</item>
</required_preload>

<input_requirements>
  <required>Goal, success criteria, and decision-critical constraints from earlier fast-planning steps.</required>
  <required>Top risks and compatibility constraints from `project-fast-pulse-scan` when that step was needed.</required>
  <optional>Team expertise, deadlines, budget limits, and platform mandates.</optional>
</input_requirements>

<workflow>
  <step>Define 3-6 explicit selection criteria such as speed, risk, maintainability, cost, and compatibility.</step>
  <step>List 2-3 realistic options; if one is mandated, name the forcing constraint, compare it to the nearest alternative, and note the fallback.</step>
  <step>Compare each option against the criteria, current team expertise, and major constraints.</step>
  <step>Choose the primary stack and record the decisive trade-offs, fallback, or escalation condition.</step>
  <step>Hand off a compact stack decision package to `project-fast-proto-spec`.</step>
</workflow>

<output_requirements>
  <requirement>Produce exactly these sections: Decision criteria, Stack options, Comparison summary, Chosen stack + rationale, Trade-offs and risks, Fallback or escalation, Handoff to `project-fast-proto-spec`.</requirement>
  <requirement>The chosen stack rationale references delivery speed, critical constraints, and real team expertise.</requirement>
  <requirement>If only one option is forced, state the forcing constraint explicitly.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Stack selection is justified by explicit criteria and project constraints, not preference.</rule>
  <rule importance="high">The top risk has a fallback option or escalation condition.</rule>
</quality_rules>

<validation>
  <item importance="critical">The result contains all required sections and compares at least two realistic options unless a single option is externally mandated.</item>
  <item importance="critical">The chosen stack is traceable to delivery speed, critical constraints, and actual team expertise.</item>
  <item importance="high">The handoff to `project-fast-proto-spec` or the escalation condition is explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not choose a stack without an explicit comparison or a documented forcing constraint.</item>
  <item importance="high">Do not ignore actual team expertise, critical constraints, or major risks from the prior fast-planning steps.</item>
</do_not>
