---
name: review-code-maintain
description: Maintainability and readability review: structure, clarity, and changeability
---

<when_to_use>
  <trigger>Need to assess how easy the code is to maintain and evolve</trigger>
  <trigger>The PR has a lot of new logic or refactoring without functional changes</trigger>
</when_to_use>

<input_requirements>
  <required>PR/diff and a short change objective</required>
  <optional>Project naming rules and style guide</optional>
  <optional>List of known pain points in the module</optional>
</input_requirements>

<core_checks>
  <check priority="P0">Readability: code intent is clear without deep context</check>
  <check priority="P0">Composition: functions/classes have clear responsibilities</check>
  <check priority="P1">Complexity: conditional branching and nesting are not excessive</check>
  <check priority="P1">Naming: entities reflect domain and behavior</check>
  <check priority="P1">Testability: logic can be tested in isolation</check>
  <check priority="P1">Technical debt: no new hidden coupling without explicit rationale</check>
</core_checks>

<quality_rules>
  <rule importance="critical">Findings explain how issues will affect future maintenance</rule>
  <rule importance="high">Avoid subjective demands without readability benefit</rule>
  <rule importance="high">Prefer simple and local improvements</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not demand large refactoring unrelated to the current change risk</item>
  <item importance="high">Do not mix style nitpicks with architectural problems</item>
</do_not>

<output_requirements>
  <requirement>Short list of key maintainability issues and fix priority</requirement>
  <requirement>Mark quick wins separately from long-term improvements</requirement>
</output_requirements>
