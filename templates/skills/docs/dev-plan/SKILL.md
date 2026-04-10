---
name: docs-dev-plan
description: Use when the request is to create or update a development plan for implementation work
---

<purpose>
  <item>Create development plan documents with ordered steps, dependencies, checkpoints, and risks.</item>
  <item>Keep the output focused on a planning artifact under <code>ai-docs/dev-plans/</code>, not on executing the work.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the user asks for a development, implementation, rollout, or migration plan for a concrete change.</item>
  <item importance="high">Use when the output must organize work into ordered phases, dependencies, risks, or checkpoints before execution starts.</item>
</when_to_use>

<input_requirements>
  <required>The goal or scope the plan must cover.</required>
  <required>Known constraints, dependencies, or sequencing rules.</required>
  <optional>Acceptance criteria, risk areas, rollout constraints, or validation expectations.</optional>
  <optional>Target file name or path for the plan document.</optional>
</input_requirements>

<workflow>
  <step>Confirm the request is for a planning artifact rather than implementation, debugging, review, or test execution.</step>
  <step>Identify scope, success criteria, dependencies, assumptions, and major risks from the available context.</step>
  <step>Break the work into ordered steps or phases with checkpoints and decision points.</step>
  <step>Call out blockers, verification expectations, and rollback or stop points when relevant.</step>
  <step>Create or update the plan under <code>ai-docs/dev-plans/<name>.md</code> unless the user specifies another document path.</step>
</workflow>

<output_requirements>
  <requirement>Produce a readable plan document with explicit ordering, scope, and next steps.</requirement>
  <requirement>Make dependencies, risks, and validation checkpoints clear enough for execution handoff.</requirement>
  <requirement>Keep the result as a plan document; do not drift into doing the implementation.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="critical">Do not use for non-plan artifacts such as guides, changelogs, or architecture narratives.</item>
  <item importance="high">Do not use when a stronger authoring or review skill should control behavior outside plan creation.</item>
</when_not_to_use>

<validation>
  <item importance="critical">The request is specifically about producing or updating a development plan document.</item>
  <item importance="high">The workflow makes ordering, dependencies, checkpoints, and risks explicit.</item>
  <item importance="high">Inputs and outputs are clear enough to avoid confusing the skill with implementation work.</item>
  <item importance="high">Non-plan documentation and runtime execution tasks should route elsewhere.</item>
</validation>
