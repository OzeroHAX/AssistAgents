---
name: review-code-maintain
description: Use when reviewing a PR or diff for maintainability and readability risks in structure, clarity, and ease of change
---

<when_to_use>
  <trigger>Need to assess how easy the code is to maintain and evolve</trigger>
  <trigger>The PR has a lot of new logic or refactoring without functional changes</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
  <item importance="high">Do not use as the primary review for correctness, security, or performance unless the main concern is maintainability.</item>
</when_not_to_use>

<input_requirements>
  <required>PR/diff and a short change objective</required>
  <optional>Project naming rules and style guide</optional>
  <optional>List of known pain points in the module</optional>
</input_requirements>

<workflow>
  <step>Establish the review scope from the PR or diff and the stated change objective.</step>
  <step>Inspect the changed code for readability, composition, complexity, naming, testability, and new hidden coupling.</step>
  <step>Keep findings evidence-based and explain how each issue increases maintenance cost, change risk, or cognitive load.</step>
  <step>Separate quick local fixes from longer-term improvements and keep recommendations proportional to the current change.</step>
</workflow>

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

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>

<do_not>
  <item importance="critical">Do not demand large refactoring unrelated to the current change risk</item>
  <item importance="high">Do not mix style nitpicks with architectural problems</item>
</do_not>

<output_requirements>
  <requirement>Short list of key maintainability issues with priority or blocking status</requirement>
  <requirement>For each finding, include concrete evidence and the expected maintenance impact</requirement>
  <requirement>Mark quick wins separately from long-term improvements</requirement>
</output_requirements>
