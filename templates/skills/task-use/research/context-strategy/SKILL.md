---
name: task-use-research-context-strategy
description: Use when a delegated task needs business/domain rules or flow analysis with source evidence across docs and related code; not for low-level code tracing
---

<when_to_use>
  <trigger>Need to understand business terms, rules, states, or flows</trigger>
  <trigger>Trace business rules from documents into related code modules</trigger>
  <trigger>Align requirements, personas, or constraints with current implementation</trigger>
  <trigger>Find contradictions between documented behavior and implemented logic</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for low-level code tracing or symbol-level investigation.</item>
  <item importance="critical">Do not use for open-ended delegation without a single clear goal and deliverable.</item>
  <item importance="high">Do not use when the main question is implementation structure or ownership rather than business meaning.</item>
  <item importance="high">Do not use when the main agent should keep the task locally instead of delegating it.</item>
</when_not_to_use>

<input_requirements>
  <required>One scoped domain question with a single expected deliverable</required>
  <required>Known starting points such as docs paths, requirement sections, UI terms, or related code</required>
  <required>Evidence expectations: document sections and code references when relevant</required>
  <optional>Depth level: standard, deep, expert</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm the question, deliverable, and scope boundary.</step>
  <step order="2">Start from domain docs, requirements, or UI language before implementation details.</step>
  <step order="3">Build the glossary, rule list, or flow map needed for the request.</step>
  <step order="4">Trace only the code needed to verify enforcement points, exceptions, or mismatches.</step>
  <step order="5">Return evidence-backed findings separated into confirmed facts, conflicts, assumptions, and open questions.</step>
</workflow>

<task_request>
  <principles>
    <principle>State the domain question and expected output (glossary, rules, flow)</principle>
    <principle>Provide starting points: docs paths, code modules, or domain terms</principle>
    <principle>Limit scope to one business area or feature per request</principle>
    <principle>Specify depth and evidence expectations when needed</principle>
  </principles>
  <examples>
    <good>
      <task>Explain the billing domain: entities, rules, and key flows. Provide sources.</task>
      <why>Clear goal, scoped domain, evidence requested</why>
    </good>
    <good>
      <task>Find the rules that define account suspension and where they are enforced.</task>
      <why>Specific rule set and expected output</why>
    </good>
    <bad>
      <task>Understand the business</task>
      <why>Too broad, no concrete question</why>
    </bad>
  </examples>
</task_request>

<research_principles>
  <principle>Start from domain documents and related code modules</principle>
  <principle>Map core terms to entities, states, and metrics</principle>
  <principle>Extract business rules with conditions, actions, and exceptions</principle>
  <principle>Trace enforcement points and workflow handoffs</principle>
  <principle>Separate confirmed rules, conflicts, and assumptions</principle>
</research_principles>

<research_strategies>
  <strategy name="glossary-first" use_for="Unclear domain language">
    <step order="1">Collect domain terms from docs, UI, and code</step>
    <step order="2">Map terms to entities, states, and metrics</step>
    <step order="3">Confirm definitions with sources</step>
  </strategy>
  <strategy name="rule-extraction" use_for="Business rules">
    <step order="1">Identify rule statements and decision points</step>
    <step order="2">Normalize rules into if/then form with exceptions</step>
    <step order="3">Trace where rules are enforced in code and workflow</step>
  </strategy>
  <strategy name="flow-mapping" use_for="End-to-end processes">
    <step order="1">List actors and triggers</step>
    <step order="2">Map the flow and key state transitions</step>
    <step order="3">Identify edge cases and failure paths</step>
  </strategy>
</research_strategies>

<output_requirements>
  <requirement>Provide a concise summary of the domain findings</requirement>
  <requirement>List key entities, rules, or flows with sources</requirement>
  <requirement>Highlight contradictions, gaps, assumptions, or open questions</requirement>
</output_requirements>

<validation>
  <item importance="critical">The delegated request stays scoped to one goal and one expected deliverable.</item>
  <item importance="critical">Returned output, evidence expectations, and distinction from code-tracing tasks are explicit.</item>
  <item importance="high">The result separates confirmed findings, contradictions, assumptions, and open questions.</item>
  <item importance="high">The delegated result can be validated before handoff back to the main agent.</item>
</validation>
<agent_limitations>
  <cannot>Edit or write files</cannot>
  <cannot>Make product decisions without user confirmation</cannot>
  <cannot>Remember previous sessions</cannot>
</agent_limitations>

<depth_levels>
  <level name="standard">Glossary + key rules</level>
  <level name="deep">Rules, flows, exceptions, and enforcement points</level>
  <level name="expert">Conflicts, risks, and change impact analysis</level>
</depth_levels>
