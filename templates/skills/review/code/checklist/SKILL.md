---
name: review-code-checklist
description: Use when a quick pre-merge checklist is needed for reviewing a code change
---

<when_to_use>
  <trigger>A pull request or code diff needs a quick pre-merge quality gate</trigger>
  <trigger>The team wants a repeatable smoke-level code review before merge</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete code diff, PR, or change artifact to review.</item>
  <item importance="high">Do not use as a substitute for a deep security, performance, or architecture review.</item>
</when_not_to_use>
<input_requirements>
  <required>PR diff and change description</required>
  <required>Acceptance criteria or expected result</required>
  <optional>Test/linter report</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm that the review target is a concrete code change and request any missing required inputs before judging it.</step>
  <step order="2">Check all P0 items first and capture concrete evidence for each blocking risk.</step>
  <step order="3">Check P1 items, separate blocking findings from non-blocking notes, and keep the review within smoke-level scope.</step>
  <step order="4">Return PASS only when all P0 checks are closed; otherwise return FAIL with failed items, evidence, risk, and blocking status.</step>
</workflow>

<core_checks>
  <check priority="P0">Functional correctness: the change solves the task and does not break the baseline scenario</check>
  <check priority="P0">Security: no obvious vulnerabilities or sensitive-data leaks</check>
  <check priority="P0">Tests: critical behavior is covered, or there is rationale for not adding tests</check>
  <check priority="P1">Maintainability: code is readable, naming is clear, and complexity is not excessive</check>
  <check priority="P1">Documentation and contracts: updated when external behavior changes</check>
  <check priority="P1">Performance: no obvious regression on hot paths</check>
</core_checks>

<pass_criteria>
  <rule>All P0 checks are closed</rule>
  <rule>Remaining findings are non-blocking for release and have an owner</rule>
</pass_criteria>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>
<do_not>
  <item importance="critical">Do not turn the checklist into a long all-purpose audit</item>
  <item importance="high">Do not mark an item as passed without a verifiable signal</item>
</do_not>

<output_requirements>
  <requirement>Review result: PASS or FAIL</requirement>
  <requirement>For FAIL, list exact failed checklist items with risk, evidence, and blocking status</requirement>
</output_requirements>
