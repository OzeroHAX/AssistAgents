---
name: research-strategy-web
description: Guidelines for effective web research using "assist/research/web-research" subagent. Use when planning multi-stage research, formulating search queries, or need current documentation, best practices, and code examples from the web.
---
<skill_overview>
  <purpose>Optimize use of "assist/research/web-research" subagent for information gathering</purpose>
  <triggers>
    <trigger>Need current API/library documentation</trigger>
    <trigger>Researching best practices and patterns</trigger>
    <trigger>Finding solutions to known problems</trigger>
    <trigger>Searching code examples and tutorials</trigger>
  </triggers>
</skill_overview>
<task_formulation>
  <principles>
    <principle>Be specific about technology and version</principle>
    <principle>One request = one topic/goal (1–3 subpoints max)</principle>
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
      <task>Research Zustand vs Jotai for React state management: performance benchmarks, TypeScript support, bundle size comparison</task>
      <why>Comparative, measurable criteria, focused scope</why>
    </good>
    <bad>
      <task>Learn about React</task>
      <why>Too broad, no specific goal or deliverable</why>
    </bad>
    <good>
      <task>Split a wide request into separate topics: (1) Run CLIProxy in docker/compose, (2) Configure multiple instances, (3) Add accounts/credentials</task>
      <why>One topic per request; caller coordinates multi-step research</why>
    </good>
  </examples>
</task_formulation>
<research_strategies>
  <strategy name="multi-stage" use_for="Complex topics requiring depth">
    <stage order="1" goal="overview">Broad landscape scan</stage>
    <stage order="2" goal="deep-dive">Detailed analysis of selected options</stage>
    <stage order="3" goal="validation">Edge cases and real-world examples</stage>
    <example>
      <stage1>Overview of modern React state management solutions in 2025 (separate request)</stage1>
      <stage2>Deep dive into Zustand: architecture, performance patterns, TypeScript best practices (separate request)</stage2>
      <stage3>Find production Zustand examples: large-scale apps, testing patterns (separate request)</stage3>
    </example>
    <note>Multi-stage research must be orchestrated by the caller as separate requests (one topic per request)</note>
  </strategy>
  <strategy name="comparative" use_for="Technology decisions">
    <template>Compare [A] vs [B] for [use-case]: [criteria-1], [criteria-2], [criteria-3]. Include recent benchmarks.</template>
  </strategy>
  <strategy name="problem-solving" use_for="Debugging and issues">
    <template>Find solutions for [specific error/issue] in [technology] [version]. Include workarounds and root cause.</template>
  </strategy>
</research_strategies>
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
