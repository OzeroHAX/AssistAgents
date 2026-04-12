---
name: coder-rules-clean-code
description: Use when implementing or refactoring code that needs minimal safe changes with verified results.
---

<when_to_use>
  <trigger>Implementing or refactoring code where the smallest safe change matters</trigger>
  <trigger>Need changes to stay readable and follow local patterns</trigger>
  <trigger>Need checkable evidence before declaring the task done</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when debugging, review, testing, or a domain-specific skill is the better fit.</item>
</when_not_to_use>
<input_requirements>
  <required>Task goal and scope boundaries</required>
  <required>Target files or modules</required>
  <required>Project conventions and existing patterns</required>
  <required>Verification commands (tests/lint/typecheck/build as applicable)</required>
</input_requirements>

<workflow>
  <step>Confirm scope, target files, local conventions, and required checks before editing</step>
  <step>Inspect nearby code and reuse existing patterns or utilities when they fit</step>
  <step>Choose the smallest safe change that solves the requested problem</step>
  <step>Implement coherent edits with explicit intent and no speculative refactoring</step>
  <step>Run required checks and report changed files, evidence, and remaining risks</step>
</workflow>

<core_principles>
  <principle priority="P0">Prefer smallest safe change that satisfies requirements</principle>
  <principle priority="P0">Keep code intention explicit; avoid hidden side effects</principle>
  <principle priority="P0">Follow repository naming, structure, and style patterns</principle>
  <principle priority="P1">Reduce complexity instead of adding speculative abstractions</principle>
  <principle priority="P1">Treat tests and checks as completion criteria, not optional extras</principle>
  <principle priority="P2">Document only non-obvious tradeoffs and constraints</principle>
</core_principles>

<checklist>
  <item>Diff is limited to in-scope files and behavior</item>
  <item>No duplicate logic introduced when existing utility fits</item>
  <item>Error and edge paths are handled where required by task</item>
  <item>Formatting/lint/type checks pass for changed scope</item>
  <item>Behavior is validated by tests or reproducible command output</item>
</checklist>

<quality_rules>
  <rule importance="critical">Do not mark task done without verifiable evidence</rule>
  <rule importance="critical">Claims about code behavior must be grounded in inspected files or executed checks</rule>
  <rule importance="high">Additional behavior outside requirements must be explicit and justified</rule>
  <rule importance="high">Refactors are allowed only when they directly reduce risk of requested change</rule>
</quality_rules>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">The expected behavior can be verified by commands, evidence, or inspected artifacts.</item>
  <item importance="high">The skill stays inside its coding/design scope and does not drift into unrelated planning or review work.</item>
</validation>
<do_not>
  <item importance="critical">Do not use destructive git or shell shortcuts without explicit approval</item>
  <item importance="critical">Do not hardcode secrets, credentials, or environment-specific values</item>
  <item importance="high">Do not pad solution with unused abstractions or premature optimization</item>
  <item importance="high">Do not treat "looks fine" as test evidence</item>
</do_not>

<output_requirements>
  <requirement>List changed files and why each changed</requirement>
  <requirement>List verification commands and results</requirement>
  <requirement>List remaining risks, assumptions, or follow-up items</requirement>
</output_requirements>

<references>
  <source url="https://docs.sonarsource.com/sonarqube-server/10.8/core-concepts/clean-code/definition">SonarQube Clean Code Definition</source>
</references>
