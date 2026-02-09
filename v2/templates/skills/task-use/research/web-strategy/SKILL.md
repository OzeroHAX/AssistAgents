---
name: task-use-research-web-strategy
description: Use for external web research with primary sources and links; not for local repository analysis
---

<when_to_use>
  <trigger>Need up-to-date external documentation or best practices</trigger>
  <trigger>Compare tools, libraries, or approaches with evidence</trigger>
  <trigger>Find solutions for known errors or issues</trigger>
  <trigger>Collect code examples or tutorials from the web</trigger>
</when_to_use>

<task_request>
  <principles>
    <principle>Be specific about technology and version</principle>
    <principle>One request = one topic/goal (1-3 subpoints max)</principle>
    <principle>State expected output format</principle>
    <principle>Include context about intended use</principle>
    <principle>Specify depth level when needed: standard, deep, expert</principle>
    <principle>Multi-stage research is orchestrated by the caller (separate requests per stage)</principle>
  </principles>
  <examples>
    <good>
      <task>Find current Next.js 14 App Router documentation: server components patterns, data fetching, and caching strategies</task>
      <why>Specific version, clear topics, actionable scope</why>
    </good>
    <good>
      <task>Compare Zustand vs Jotai for React state management: performance benchmarks, TypeScript support, bundle size</task>
      <why>Comparative, measurable criteria, focused scope</why>
    </good>
    <bad>
      <task>Learn about React</task>
      <why>Too broad, no specific goal or deliverable</why>
    </bad>
  </examples>
</task_request>

<search_principles>
  <principle>Define a single, testable research question before searching</principle>
  <principle>Extract core keywords and synonyms; iterate queries based on results</principle>
  <principle>Use operators: quotes for phrases, AND/OR/NOT to scope, site: for trusted domains</principle>
  <principle>Prefer primary sources (official docs, standards, vendor pages, repo docs)</principle>
  <principle>Evaluate sources for authority, accuracy, purpose, and relevance</principle>
  <principle>Check freshness: publication/last updated date when it matters</principle>
  <principle>Triangulate key claims using at least two independent sources</principle>
  <principle>Record sources with links and dates while researching</principle>
</search_principles>

<research_strategies>
  <strategy name="multi-stage" use_for="Complex topics requiring depth">
    <stage order="1" goal="overview">Broad landscape scan</stage>
    <stage order="2" goal="deep-dive">Detailed analysis of selected options</stage>
    <stage order="3" goal="validation">Edge cases and real-world examples</stage>
    <note>One topic per request; caller coordinates multi-stage research</note>
  </strategy>
  <strategy name="comparative" use_for="Technology decisions">
    <template>Compare [A] vs [B] for [use-case]: [criteria-1], [criteria-2], [criteria-3]. Include recent benchmarks.</template>
  </strategy>
  <strategy name="problem-solving" use_for="Debugging and issues">
    <template>Find solutions for [specific error/issue] in [technology] [version]. Include root cause and workarounds.</template>
  </strategy>
</research_strategies>

<output_requirements>
  <requirement>Provide a short summary and bullet findings</requirement>
  <requirement>List sources with direct links</requirement>
  <requirement>Highlight uncertainties, conflicts, or missing evidence</requirement>
</output_requirements>

<agent_limitations>
  <cannot>Access local project files or codebase</cannot>
  <cannot>Edit or write files</cannot>
  <cannot>Remember previous sessions</cannot>
</agent_limitations>

<depth_levels>
  <level name="standard">Summary + key sources + essential facts</level>
  <level name="deep">Comparison, edge cases, pros/cons, multiple sources</level>
  <level name="expert">Implementation details, pitfalls, validated code examples</level>
</depth_levels>
