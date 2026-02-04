---
name: context-strategy
description: When and how to use the Business Logic Subagent for domain research
---

<when_to_use>
  <trigger>Need to understand business domain, terms, and rules</trigger>
  <trigger>Trace business logic across documents and code modules</trigger>
  <trigger>Align requirements with user personas, goals, and constraints</trigger>
  <trigger>Find inconsistencies between requirements and existing logic</trigger>
</when_to_use>

<task_request>
  <principles>
    <principle>State the domain question and expected output (glossary, rules, flow)</principle>
    <principle>Include known sources (docs paths, code modules, or terms)</principle>
    <principle>Limit scope to one business area or feature per request</principle>
    <principle>Specify depth level when needed: standard, deep, expert</principle>
    <principle>Ask for evidence: cite document sections and code references</principle>
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
  <principle>Build a glossary of terms and map them to entities</principle>
  <principle>Extract business rules with conditions, actions, and exceptions</principle>
  <principle>Trace rules to enforcement points in code and workflow</principle>
  <principle>Separate confirmed rules from assumptions</principle>
  <principle>Note conflicts or gaps between documents and implementation</principle>
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
  <requirement>List key rules and entities with sources</requirement>
  <requirement>Highlight contradictions, gaps, or open questions</requirement>
</output_requirements>

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
