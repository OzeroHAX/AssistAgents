---
name: decomposition-strategy
description: Use to draft decomposition for one feature/epic with dependencies and risks; final scope and priorities stay with main agent
---

<when_to_use>
  <trigger>Need a draft decomposition to accelerate planning</trigger>
  <trigger>Need a clear task list with scope, dependencies, and sequencing</trigger>
  <trigger>Need to transform requirements into actionable work items</trigger>
  <trigger>Need to estimate or plan delivery phases</trigger>
</when_to_use>

<delegation_policy>
  <main_agent>Owns final decomposition, scope decisions, and user alignment</main_agent>
  <subagent>Produces a draft breakdown, dependencies, risks, and open questions</subagent>
  <do_delegate>Initial task list, dependency map, risk list, missing inputs</do_delegate>
  <do_not_delegate>Final scope, priority, acceptance criteria, release commitments</do_not_delegate>
</delegation_policy>

<task_request>
  <principles>
    <principle>State the goal and expected granularity (epics -> stories -> tasks)</principle>
    <principle>Provide constraints: timeline, team size, tech stack, non-goals</principle>
    <principle>Include inputs: requirements, PRD, architecture, use cases</principle>
    <principle>Limit scope to one epic or feature per request</principle>
    <principle>Specify depth level when needed: standard, deep, expert</principle>
  </principles>
  <examples>
    <good>
      <task>Decompose the "User onboarding" epic into tasks with dependencies and acceptance criteria.</task>
      <why>Clear scope, expected outputs</why>
    </good>
    <good>
      <task>Break down payment integration into tasks, include risk areas and sequencing.</task>
      <why>Focused feature and planning needs</why>
    </good>
    <bad>
      <task>Plan the whole product</task>
      <why>Too broad, no granularity or scope</why>
    </bad>
  </examples>
</task_request>

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
  <requirement>Provide a structured task list with titles (draft)</requirement>
  <requirement>Include dependencies and sequencing notes</requirement>
  <requirement>Note risks, unknowns, and required inputs</requirement>
  <requirement>Flag assumptions that need main-agent validation</requirement>
</output_requirements>

<agent_limitations>
  <cannot>Edit or write files</cannot>
  <cannot>Make product decisions without user confirmation</cannot>
  <cannot>Remember previous sessions</cannot>
</agent_limitations>

<depth_levels>
  <level name="standard">Task list + dependencies</level>
  <level name="deep">Acceptance criteria + risks + sequencing</level>
  <level name="expert">Phased plan + estimation approach + rollout strategy</level>
</depth_levels>
