---
name: research-strategy-code
description: Guidelines for effective local codebase research using the "assist/research/code-research" subagent. Use when answering questions about project structure, behavior, data flow, configuration, or implementation details.
---
<skill_overview>
  <purpose>Optimize use of "assist/research/code-research" subagent for evidence-based codebase analysis</purpose>
  <triggers>
    <trigger>Locate where a feature or behavior is implemented</trigger>
    <trigger>Trace data flow or call chains across modules</trigger>
    <trigger>Explain configuration, environment, or initialization logic</trigger>
    <trigger>Answer questions with file/line evidence</trigger>
    <trigger>Inspect recent changes or regressions</trigger>
  </triggers>
</skill_overview>
<task_formulation>
  <principles>
    <principle>State the exact question and expected outcome</principle>
    <principle>Provide known entry points: file, symbol, or keyword</principle>
    <principle>Specify scope boundaries (module, package, layer)</principle>
    <principle>Request evidence with file paths and line numbers</principle>
    <principle>Specify depth level when needed: standard, deep, expert</principle>
  </principles>
  <examples>
    <good>
      <task>Where is JWT validation implemented? Show the handler path and middleware order with file references.</task>
      <why>Clear goal, scope, and evidence requirements</why>
    </good>
    <good>
      <task>Trace how user profile data is loaded from API to UI. Include data flow and key transformations.</task>
      <why>Call-chain focus and expected detail level</why>
    </good>
    <bad>
      <task>Explain the whole backend.</task>
      <why>Too broad and undefined scope</why>
    </bad>
  </examples>
</task_formulation>
<research_strategies>
  <strategy name="entry-point-discovery" use_for="Unknown start location">
    <step order="1">Review project structure and likely entry files</step>
    <step order="2">Search for key terms or routes</step>
    <step order="3">Inspect candidate files to confirm entry points</step>
  </strategy>
  <strategy name="call-chain-trace" use_for="Behavior explanation">
    <step order="1">Locate the handler or public API</step>
    <step order="2">Trace symbol usage across modules</step>
    <step order="3">Summarize the chain with evidence</step>
  </strategy>
  <strategy name="config-tracing" use_for="Runtime behavior">
    <step order="1">Locate configuration definitions and defaults</step>
    <step order="2">Trace how configuration is loaded and applied</step>
    <step order="3">Document overrides and precedence</step>
  </strategy>
  <strategy name="change-context" use_for="Recent changes or regressions">
    <step order="1">Identify recent changes and affected areas</step>
    <step order="2">Relate changes to observed behavior</step>
    <step order="3">Highlight potential regression risks</step>
  </strategy>
  <strategy name="multi-cycle" use_for="Complex or ambiguous questions">
    <step order="1">Ask 1-3 targeted clarification questions</step>
    <step order="2">Research narrowly scoped answers</step>
    <step order="3">Repeat until scope is satisfied</step>
  </strategy>
</research_strategies>
<response_format>
  <section name="summary">Direct answer in 2-3 sentences</section>
  <section name="findings">Key points with explanations</section>
  <section name="evidence">File paths with line numbers and what they prove</section>
  <section name="code_examples" optional="true">Small excerpts with source refs</section>
  <section name="open_questions" optional="true">Targeted follow-ups if needed</section>
</response_format>
<agent_limitations>
  <cannot>Edit or write files</cannot>
  <cannot>Assume behavior without evidence</cannot>
</agent_limitations>
<depth_levels>
  <level name="standard">Summary + key evidence</level>
  <level name="deep">Call chains, config details, edge cases</level>
  <level name="expert">Deep + implementation nuances and pitfalls</level>
</depth_levels>