---
name: task-use-creator-decomposition-strategy
description: Use when the main agent needs a delegated draft decomposition for one feature or epic with dependencies, sequencing, and risks
---

<when_to_use>
  <trigger>Need a draft decomposition for one scoped feature or epic</trigger>
  <trigger>Need a clear task list with scope, dependencies, and sequencing</trigger>
  <trigger>Need to transform requirements into actionable work items</trigger>
  <trigger>Need a rough phase plan before final scoping</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for open-ended delegation without one clear goal and deliverable.</item>
  <item importance="critical">Do not use for product-wide or multi-epic planning in one request.</item>
  <item importance="high">Do not use for final scope, priority, or acceptance decisions that must stay with the main agent.</item>
</when_not_to_use>

<delegation_policy>
  <main_agent>Owns final scope decisions and user alignment</main_agent>
  <subagent>Produces a draft breakdown, dependencies, risks, and open questions</subagent>
  <do_delegate>Draft task list, dependency map, sequencing notes, risk list, and missing inputs</do_delegate>
  <do_not_delegate>Final scope, priority, acceptance criteria, release commitments</do_not_delegate>
</delegation_policy>

<input_requirements>
  <required>One feature or epic with a clear goal and expected deliverable</required>
  <required>Expected granularity or requested depth level</required>
  <required>Known constraints such as timeline, team size, tech stack, and non-goals</required>
  <optional>Requirements, PRD, architecture, use cases, or other supporting context</optional>
  <optional>Known risks, unknowns, integration points, or assumptions that should shape the draft</optional>
</input_requirements>

<workflow>
  <step order="1">Reject or narrow requests that are broader than one feature or epic or that lack a clear deliverable.</step>
  <step order="2">Choose the best-fit strategy: vertical-slices, capability-first, or risk-first.</step>
  <step order="3">Draft tasks, separating discovery, enabling, and implementation work when needed.</step>
  <step order="4">Add dependencies, sequencing, critical-path notes, and key risks or unknowns.</step>
  <step order="5">Flag assumptions and decisions that must return to the main agent.</step>
</workflow>

<decomposition_principles>
  <principle>Start from user outcomes and required behaviors</principle>
  <principle>Define deliverables and acceptance criteria per task</principle>
  <principle>Minimize cross-task coupling; keep tasks independently testable</principle>
  <principle>Identify dependencies and critical path</principle>
  <principle>Surface risks and unknowns early</principle>
  <principle>Separate discovery from implementation work</principle>
</decomposition_principles>

<decomposition_strategies>
  <strategy name="vertical-slices" use_for="End-to-end delivery">
    <step order="1">List key user flows and success criteria</step>
    <step order="2">Split each flow into slices that deliver value</step>
    <step order="3">Add enabling tasks for platform or shared components</step>
  </strategy>
  <strategy name="capability-first" use_for="Platform or infrastructure">
    <step order="1">Identify capabilities and system boundaries</step>
    <step order="2">Define tasks per capability with clear interfaces</step>
    <step order="3">Add integration and validation tasks</step>
  </strategy>
  <strategy name="risk-first" use_for="High uncertainty">
    <step order="1">List technical and product risks</step>
    <step order="2">Create spike tasks to validate assumptions</step>
    <step order="3">Decompose remaining work based on validated scope</step>
  </strategy>
</decomposition_strategies>

<output_requirements>
  <requirement>Provide a structured draft task list with clear titles</requirement>
  <requirement>Separate implementation, discovery, and enabling work when needed</requirement>
  <requirement>Include dependencies, sequencing, critical-path notes, risks, unknowns, and assumptions for main-agent validation</requirement>
</output_requirements>

<validation>
  <item importance="critical">The delegated request stays scoped to one goal and one expected deliverable.</item>
  <item importance="critical">Returned output format, dependency notes, and main-agent boundaries are explicit.</item>
  <item importance="high">The draft makes assumptions, missing inputs, and remaining decision points explicit.</item>
</validation>

<agent_limitations>
  <cannot>Edit or write files</cannot>
  <cannot>Finalize scope, priorities, or acceptance criteria without main-agent confirmation</cannot>
</agent_limitations>

<depth_levels>
  <level name="standard">Task list + dependencies</level>
  <level name="deep">Acceptance criteria + risks + sequencing</level>
  <level name="expert">Phased plan + estimation approach + rollout risks</level>
</depth_levels>
