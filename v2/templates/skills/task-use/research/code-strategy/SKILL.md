---
name: code-strategy
description: Use for read-only codebase investigation with file/symbol evidence; not for implementation planning or code edits
---

<when_to_use>
  <trigger>Need to understand architecture or data flow across multiple files</trigger>
  <trigger>Find where a feature is implemented and how it works end-to-end</trigger>
  <trigger>Locate patterns or examples across the codebase</trigger>
  <trigger>Need a map of modules, dependencies, or ownership boundaries</trigger>
</when_to_use>

<task_request>
  <principles>
    <principle>State the goal and expected output (summary, file list, call chain)</principle>
    <principle>Include starting points if known (file paths, symbols, errors)</principle>
    <principle>Limit scope: 1 topic or feature per request</principle>
    <principle>Specify depth level when needed: standard, deep, expert</principle>
    <principle>Ask for evidence: require references to files and functions</principle>
  </principles>
  <examples>
    <good>
      <task>Explain how auth works end-to-end. Provide key files, entrypoints, and data flow.</task>
      <why>Clear goal, expects evidence and structure</why>
    </good>
    <good>
      <task>Find all places where Redis is used and summarize why.</task>
      <why>Specific target and output</why>
    </good>
    <bad>
      <task>Review the whole codebase</task>
      <why>Too broad, no specific objective</why>
    </bad>
  </examples>
</task_request>

<research_principles>
  <principle>Start with entrypoints (main, routes, handlers, controllers)</principle>
  <principle>Trace data flow across layers: API -> service -> persistence</principle>
  <principle>Prefer reading source to inference; avoid assumptions</principle>
  <principle>Collect exact file paths and symbol names as evidence</principle>
  <principle>Separate confirmed facts from hypotheses</principle>
  <principle>Note configuration and environment dependencies that affect behavior</principle>
</research_principles>

<research_strategies>
  <strategy name="map-first" use_for="Unknown codebases">
    <step order="1">Identify top-level structure and entrypoints</step>
    <step order="2">Find key modules and ownership boundaries</step>
    <step order="3">Dive into the smallest set of files that answer the question</step>
  </strategy>
  <strategy name="trace-flow" use_for="End-to-end behavior">
    <step order="1">Start from the trigger (API, event, CLI)</step>
    <step order="2">Follow the call chain across layers</step>
    <step order="3">Document data transformations and side effects</step>
  </strategy>
  <strategy name="pattern-hunt" use_for="Examples and reuse">
    <step order="1">Search for similar modules or keywords</step>
    <step order="2">Compare implementations and extract common patterns</step>
    <step order="3">List best candidates with file references</step>
  </strategy>
</research_strategies>

<output_requirements>
  <requirement>Provide a short summary of findings</requirement>
  <requirement>List key files with paths and roles</requirement>
  <requirement>Highlight open questions or missing context</requirement>
</output_requirements>

<agent_limitations>
  <cannot>Edit or write files</cannot>
  <cannot>Run build or tests</cannot>
  <cannot>Remember previous sessions</cannot>
</agent_limitations>

<depth_levels>
  <level name="standard">High-level flow + key files</level>
  <level name="deep">Call chain, data transformations, edge cases</level>
  <level name="expert">Design tradeoffs, risks, and refactor targets</level>
</depth_levels>
