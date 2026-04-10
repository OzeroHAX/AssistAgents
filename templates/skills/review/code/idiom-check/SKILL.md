---
name: review-code-idiom-check
description: Use when reviewing whether a code change follows idiomatic language and framework patterns for the current stack
---

<when_to_use>
  <trigger>The team wants a unified engineering style and predictable patterns</trigger>
  <trigger>The PR uses atypical constructs for the current stack</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
  <item importance="high">Do not use as the primary review for correctness, security, or performance unless the concern is directly caused by a non-idiomatic stack pattern.</item>
</when_not_to_use>

<input_requirements>
  <required>PR/diff</required>
  <required>Module language and framework</required>
  <optional>Project-local conventions</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm the review target is a concrete PR or diff, then gather the language, framework, and any project-local conventions or nearby examples that define normal practice.</step>
  <step order="2">Inspect idiom-sensitive areas such as common APIs, lifecycles, control flow, naming, and framework-specific patterns, and note where the change diverges from normal stack usage.</step>
  <step order="3">For each deviation, decide whether it is justified by a project convention, compatibility need, or explicit rationale instead of treating every difference as a problem.</step>
  <step order="4">Return blocking and advisory findings with concrete evidence, why the current pattern is non-idiomatic for this stack, and the smallest reasonable idiomatic fix or acceptance condition.</step>
</workflow>

<core_checks>
  <check priority="P0">Selected patterns match standard language/framework practices</check>
  <check priority="P1">Common APIs and lifecycles are used, with no workarounds without reason</check>
  <check priority="P1">Exceptions to idioms are explicitly justified in comments or PR description</check>
  <check priority="P1">Code is consistent with the rest of the codebase in similar areas</check>
</core_checks>

<quality_rules>
  <rule importance="critical">Idiomatic style must not degrade correctness or security</rule>
  <rule importance="high">Idiom suggestions include a short replacement example</rule>
  <rule importance="medium">Project-local conventions take priority over general recommendations</rule>
</quality_rules>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>

<do_not>
  <item importance="critical">Do not require rewriting working code for abstract aesthetics</item>
  <item importance="high">Do not propose a new paradigm without proven team benefit</item>
</do_not>

<output_requirements>
  <requirement>List of idiom deviations: what, why, and minimal fix approach</requirement>
  <requirement>Separate blocking and advisory findings</requirement>
</output_requirements>
