---
name: review-code-idiom-check
description: Idiomatic code review for the project's language and framework
---

<when_to_use>
  <trigger>The team wants a unified engineering style and predictable patterns</trigger>
  <trigger>The PR uses atypical constructs for the current stack</trigger>
</when_to_use>

<input_requirements>
  <required>PR/diff</required>
  <required>Module language and framework</required>
  <optional>Project-local conventions</optional>
</input_requirements>

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

<do_not>
  <item importance="critical">Do not require rewriting working code for abstract aesthetics</item>
  <item importance="high">Do not propose a new paradigm without proven team benefit</item>
</do_not>

<output_requirements>
  <requirement>List of idiom deviations: what, why, and minimal fix approach</requirement>
  <requirement>Separate blocking and advisory findings</requirement>
</output_requirements>
