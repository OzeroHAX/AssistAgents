---
name: task-use-research-code-strategy
description: Use when delegating one scoped, read-only investigation of the local codebase that must return file/symbol evidence; not for planning, code edits, or small local reads
---

<when_to_use>
  <trigger>Need a delegated cross-file, read-only investigation to explain architecture or data flow</trigger>
  <trigger>Need to find where a feature is implemented and trace the end-to-end path with evidence</trigger>
  <trigger>Need repository-backed examples of patterns, dependencies, or ownership boundaries</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for implementation planning or code edits.</item>
  <item importance="critical">Do not use for broad or open-ended delegation without one clear research question and one deliverable.</item>
  <item importance="high">Do not use when the main agent can answer with a direct local read/search across a small number of files.</item>
</when_not_to_use>

<input_requirements>
  <item>One scoped research question and exact deliverable</item>
  <item>Starting points when available: file paths, symbols, entrypoints, or errors</item>
  <item>Requested depth when needed: standard, deep, or expert</item>
  <item>Expectation that material claims cite exact file paths or symbols</item>
</input_requirements>

<workflow>
  <step order="1">Confirm one scoped read-only question, one deliverable, and whether depth matters.</step>
  <step order="2">Choose `map-first`, `trace-flow`, or `pattern-hunt` based on the request.</step>
  <step order="3">Start from the best entrypoints, inspect only the files needed, and collect exact paths and symbols as evidence.</step>
  <step order="4">Answer the question first, then list supporting evidence, notable dependencies, and open questions separately from hypotheses.</step>
</workflow>

<research_principles>
  <principle>Start from supplied entrypoints when available; otherwise begin with main modules, routes, handlers, or controllers</principle>
  <principle>Trace data flow across layers for end-to-end questions</principle>
  <principle>Prefer source over inference, cite exact paths and symbols, and stop once the scoped question is answered</principle>
</research_principles>

<research_strategies>
  <strategy name="map-first" use_for="Unknown codebases">
    <step order="1">Identify top-level structure and entrypoints</step>
    <step order="2">Find key modules and ownership boundaries</step>
    <step order="3">Dive into the smallest set of files that answers the question</step>
  </strategy>
  <strategy name="trace-flow" use_for="End-to-end behavior">
    <step order="1">Start from the trigger point: API, event, or CLI</step>
    <step order="2">Follow the call chain across layers</step>
    <step order="3">Document data transformations and side effects</step>
  </strategy>
  <strategy name="pattern-hunt" use_for="Examples and reuse">
    <step order="1">Search for similar modules or keywords</step>
    <step order="2">Compare implementations and extract common patterns</step>
    <step order="3">List the best examples with file references</step>
  </strategy>
</research_strategies>

<output_requirements>
  <requirement>Answer the delegated question directly before background detail</requirement>
  <requirement>List key evidence with exact file paths, symbols, and roles</requirement>
  <requirement>Highlight open questions, uncertainty, or missing context separately from confirmed findings</requirement>
</output_requirements>

<validation>
  <item importance="critical">The delegated request stays scoped to one read-only research question and one deliverable.</item>
  <item importance="critical">Each material claim is backed by at least one concrete file path or symbol, and hypotheses stay separated.</item>
  <item importance="high">The answer-first output shape and main-agent boundaries are explicit before handoff.</item>
</validation>

<depth_levels>
  <level name="standard">High-level flow + key files</level>
  <level name="deep">Call chain, data transformations, edge cases</level>
  <level name="expert">Design tradeoffs, risks, and refactor targets</level>
</depth_levels>
