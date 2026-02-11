---
name: review-code-checklist
description: Short quality gate for code review before merge
---

<when_to_use>
  <trigger>A quick and repeatable minimum check set is needed before merge</trigger>
  <trigger>The team wants to standardize smoke-level PR review</trigger>
</when_to_use>

<input_requirements>
  <required>PR diff and change description</required>
  <required>Acceptance criteria or expected result</required>
  <optional>Test/linter report</optional>
</input_requirements>

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

<do_not>
  <item importance="critical">Do not turn the checklist into a long all-purpose audit</item>
  <item importance="high">Do not mark an item as passed without a verifiable signal</item>
</do_not>

<output_requirements>
  <requirement>Return a short status: PASS or FAIL</requirement>
  <requirement>For FAIL, specify exact checklist items and risk</requirement>
</output_requirements>
