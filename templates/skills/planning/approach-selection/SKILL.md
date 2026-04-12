---
name: planning-approach-selection
description: First-time technical or architectural choice during planning when the project has no established pattern, infrastructure, or precedent
---

<purpose>
  <item>Compare viable first-time approaches and produce a project-specific recommendation before implementation starts</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when planning a first-time technical choice and the project has no accepted infrastructure, reusable pattern, or close analog to follow.</item>
  <item importance="high">Use when several viable approaches must be weighed before the plan can be finalized.</item>
  <item importance="high">Use for first-time choices such as database/storage selection, architecture pattern selection, API style selection, or infrastructure approach selection.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="critical">Do not use when the project already has an accepted standard, infrastructure pattern, or close analog and the task is to follow it.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<inputs>
  <required>Decision to make + task goal</required>
  <required>Project constraints (size, complexity, team, stack, deadlines, operations, compatibility)</required>
  <optional>Non-goals, hard constraints, or already rejected options</optional>
</inputs>

<workflow>
  <step>Confirm that this is a first-time project choice and state what precedent or infrastructure is missing.</step>
  <step>Define selection criteria from project constraints.</step>
  <step>Identify 2-4 viable approaches. If repository context is insufficient, use `assist/research/web` to discover realistic options.</step>
  <step>Include relevant best practices only after filtering them through project constraints, team capacity, operational burden, and compatibility with the current stack.</step>
  <step>For each approach, explain fit, pros, cons, risks, and likely failure or misfit conditions.</step>
  <step>Recommend one approach and explain why it fits this project better than the alternatives.</step>
  <step>Ask the user to approve the recommended option via the `question` tool before treating the decision as final.</step>
</workflow>

<output_format>
  <section>Decision context</section>
  <section>Selection criteria</section>
  <section>Options</section>
  <section>Recommendation</section>
  <section>User approval</section>
</output_format>

<output_requirements>
  <requirement>Compare multiple viable options; if only one is feasible, explain why other plausible approaches were rejected.</requirement>
  <requirement>For each option, include a short description, project fit, advantages, disadvantages, and key risks.</requirement>
  <requirement>The recommendation must reference project specifics such as size, complexity, team capacity, operational burden, or compatibility when relevant.</requirement>
  <requirement>Any cited best practices or common recommendations must be interpreted through project-specific constraints instead of being treated as universal defaults.</requirement>
  <requirement>If web research was used to find options, say so explicitly.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">The choice is justified by explicit criteria and project context, not by defaults or personal preference.</rule>
  <rule importance="critical">Options are compared from multiple perspectives, not a single axis.</rule>
  <rule importance="high">Pros, cons, and trade-offs are explicit for every serious option.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output explains why the skill triggered instead of reusing an existing project pattern.</item>
  <item importance="critical">The output compares multiple viable options against explicit criteria tied to task inputs and project constraints.</item>
  <item importance="critical">Each serious option includes concrete pros, cons, risks, and fit or misfit conditions.</item>
  <item importance="high">The answer ends with a user approval request via the `question` tool.</item>
</validation>

<do_not>
  <item importance="critical">Do not give a single default answer when multiple viable approaches still exist.</item>
  <item importance="high">Do not repeat generic product marketing without relating it to the project.</item>
  <item importance="high">Do not silently finalize the decision without explicit user approval.</item>
</do_not>
