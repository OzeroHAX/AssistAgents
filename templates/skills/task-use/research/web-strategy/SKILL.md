---
name: task-use-research-web-strategy
description: Use for one scoped external web research question with primary-source links; not for local repository analysis, planning, or broad open-ended delegation
---

<when_to_use>
  <trigger>Need current official docs, standards, vendor guidance, or best practices</trigger>
  <trigger>Need a focused comparison of external tools, libraries, or approaches with evidence</trigger>
  <trigger>Need public-web research for a known issue, migration path, or implementation example</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for local repository analysis or doc-plus-code tracing.</item>
  <item importance="critical">Do not use for broad learning or open-ended delegation without one research question and one deliverable.</item>
  <item importance="high">Do not use when the main task is planning, code changes, or work the main agent should keep locally.</item>
</when_not_to_use>

<input_requirements>
  <required>One scoped research question and one expected deliverable</required>
  <required>Technology, product, standard, or error context; include version when it matters</required>
  <required>Evidence expectations: primary sources, direct links, and freshness needs</required>
  <optional>Depth level: standard, deep, expert</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm the question, deliverable, scope boundary, and whether freshness or version specificity matters.</step>
  <step order="2">Choose `official-docs-first`, `comparison`, or `issue-resolution` based on the request.</step>
  <step order="3">Search primary sources first, add focused secondary sources only when needed, and record links plus dates for material claims.</step>
  <step order="4">Return the answer first, then findings, direct links, and uncertainty or conflicting evidence.</step>
</workflow>

<request_shaping>
  <principle>Name the technology and version when relevant</principle>
  <principle>Keep the request to one question or one comparison with 1-3 criteria</principle>
  <principle>State the expected output shape and intended use</principle>
</request_shaping>

<research_principles>
  <principle>Prefer official docs, standards, vendor pages, issue trackers, or repository docs before blogs and tutorials</principle>
  <principle>Use focused queries and site filters only as needed</principle>
  <principle>Check freshness when version, API behavior, or best practices may have changed</principle>
  <principle>Separate confirmed findings, uncertainties, and conflicts; triangulate material claims when possible</principle>
</research_principles>

<research_strategies>
  <strategy name="official-docs-first" use_for="Documentation, standards, or best-practice lookups">
    <step order="1">Find the canonical source</step>
    <step order="2">Extract the relevant sections and version details</step>
  </strategy>
  <strategy name="comparison" use_for="Tool or library choices">
    <step order="1">Define the comparison criteria</step>
    <step order="2">Collect evidence from official sources and credible benchmarks</step>
  </strategy>
  <strategy name="issue-resolution" use_for="Known errors or migration questions">
    <step order="1">Search the exact issue with version context</step>
    <step order="2">Prefer official issue trackers, release notes, and vendor guidance</step>
  </strategy>
</research_strategies>

<output_requirements>
  <requirement>Answer the delegated question directly before background detail</requirement>
  <requirement>Provide bullet findings and a source list with direct links</requirement>
  <requirement>Highlight uncertainties, stale evidence, conflicts, or missing primary sources</requirement>
</output_requirements>

<validation>
  <item importance="critical">The request stays scoped to one external research goal and one deliverable.</item>
  <item importance="critical">Material claims are backed by direct links, and uncertainty is separated from confirmed findings.</item>
  <item importance="high">Primary sources are preferred, and the boundary versus local-research skills remains explicit.</item>
</validation>

<depth_levels>
  <level name="standard">Summary + key sources + essential facts</level>
  <level name="deep">Comparison, edge cases, pros/cons, multiple sources</level>
  <level name="expert">Implementation details, pitfalls, validated code examples</level>
</depth_levels>
