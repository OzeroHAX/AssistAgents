---
name: review-doc-quality
description: Use when reviewing documentation quality for accuracy, completeness, consistency, and freshness
---

<when_to_use>
  <trigger>A short quality gate is needed before publishing a document</trigger>
  <trigger>An audit of existing documentation fitness is required</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
</when_not_to_use>
<input_requirements>
  <required>Document text or diff</required>
  <required>Target audience and expected reading outcome</required>
  <optional>Relevant links to product/interfaces/contracts</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm the document scope, target audience, and expected reading outcome.</step>
  <step order="2">Review the document against the core checks and capture evidence for each blocking issue.</step>
  <step order="3">Decide whether all P0 items pass and separate P1/P2 findings by priority and proposed fix.</step>
  <step order="4">Return a PASS or FAIL verdict with prioritized defects, evidence, and next actions.</step>
</workflow>

<core_checks>
  <check priority="P0">Accuracy: facts, commands, parameters, and examples are correct and reproducible</check>
  <check priority="P0">Completeness: prerequisites, main flow, errors, and next steps are covered</check>
  <check priority="P1">Consistency: unified terminology, entity naming, and section structure</check>
  <check priority="P1">Clarity: text is scannable, steps are short, and each step outcome is clear</check>
  <check priority="P1">Freshness: versions, update date, and document owner are specified</check>
  <check priority="P2">Accessibility/readability: neutral language, clear labels, minimal ambiguity</check>
</core_checks>

<pass_criteria>
  <rule>All P0 items are confirmed</rule>
  <rule>Actions and priorities are defined for P1/P2 findings</rule>
</pass_criteria>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>
<do_not>
  <item importance="critical">Do not publish a document with non-reproducible commands and examples</item>
  <item importance="high">Do not hide known limitations and caveats</item>
</do_not>

<output_requirements>
  <requirement>Review result: PASS or FAIL</requirement>
  <requirement>List of quality defects with priorities, evidence, and proposed fixes</requirement>
</output_requirements>
