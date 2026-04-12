---
name: review-code-requirements
description: Use when reviewing a PR or diff against requirements, acceptance criteria, and scope boundaries
---

<when_to_use>
  <trigger>Need to confirm that implementation covers the original request and acceptance criteria</trigger>
  <trigger>There is a risk of missing requirement coverage or scope creep in a PR or diff</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
  <item importance="high">Do not use as the primary review for maintainability, performance, or security when requirement coverage is not the main question.</item>
</when_not_to_use>
<input_requirements>
  <required>Original request or task goal</required>
  <required>Acceptance criteria or list of requirements</required>
  <required>PR/diff with changes</required>
  <optional>Out-of-scope constraints</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm that the review target, requirements baseline, and changed artifact are concrete enough to compare; request missing inputs before judging coverage.</step>
  <step order="2">Map each requirement or acceptance criterion to specific evidence in the PR, such as code, tests, or observable behavior.</step>
  <step order="3">Record uncovered requirements, missing AC edge cases, and changes outside the stated scope or without clear agreement.</step>
  <step order="4">Return a traceability-focused review that separates covered requirements, blocking gaps, extra scope, and open questions.</step>
</workflow>

<quality_rules>
  <rule importance="critical">Each AC has evidence: code, test, or observable behavior</rule>
  <rule importance="high">Any behavior outside requirements is marked as additional and agreed</rule>
  <rule importance="high">Uncovered requirements are recorded as blocking</rule>
</quality_rules>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>
<do_not>
  <item importance="critical">Do not treat "seems to work" as evidence of requirement fulfillment</item>
  <item importance="high">Do not ignore mismatches between task description and actual diff</item>
</do_not>

<output_requirements>
  <requirement>Traceability matrix: requirement or AC -> PR evidence</requirement>
  <requirement>List of gaps: missing coverage, extra scope, and open questions with blocking status when applicable</requirement>
</output_requirements>
