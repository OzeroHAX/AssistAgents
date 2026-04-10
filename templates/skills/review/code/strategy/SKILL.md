---
name: review-code-strategy
description: Use when a concrete PR review needs consistent blocking criteria and a clear merge decision
---

<when_to_use>
  <trigger>A concrete PR or diff needs a merge verdict with blocking vs non-blocking findings</trigger>
  <trigger>Review comments need consistent severity calibration so preference notes do not block merge</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use without a concrete PR, diff, decision, or document to review.</item>
  <item importance="high">Do not use as the primary skill for checklist, requirements, security, or performance review.</item>
</when_not_to_use>

<input_requirements>
  <required>Concrete review artifact such as a PR link or diff</required>
  <required>Expected behavior, acceptance criteria, or review goal</required>
  <optional>Release risk or component criticality</optional>
</input_requirements>

<workflow>
  <step order="1">Establish the review target, expected behavior, and missing evidence.</step>
  <step order="2">Judge each finding by product risk, regression risk, or missing critical evidence, not reviewer preference.</step>
  <step order="3">Classify findings as `blocking`, `major`, or `minor` and keep only clear merge-stoppers in `blocking`.</step>
  <step order="4">Return the merge decision, blockers, non-blocking follow-ups, and confirmed checks.</step>
</workflow>

<severity_model>
  <level name="blocking">Requirement violation, security risk, likely behavior breakage, or missing critical evidence that must be resolved before merge</level>
  <level name="major">Important quality or regression risk that should be fixed soon, but does not block merge by default</level>
  <level name="minor">Low-risk readability, naming, or style improvement that must not block merge</level>
</severity_model>

<quality_rules>
  <rule importance="critical">Each blocking finding includes evidence, risk, and a minimal fix or acceptance condition.</rule>
  <rule importance="high">Do not escalate preference comments into blockers without clear product, reliability, or security impact.</rule>
  <rule importance="high">Tie findings to exact diff locations or clearly identified review artifacts.</rule>
</quality_rules>

<validation>
  <item importance="critical">Every blocker explains why merge must stop.</item>
  <item importance="critical">The merge decision matches the stated severity model.</item>
  <item importance="high">The review stays focused on severity calibration and merge readiness.</item>
</validation>

<do_not>
  <item importance="critical">Do not block merge over preference-only comments.</item>
  <item importance="high">Do not leave findings without impact or expected resolution.</item>
  <item importance="high">Do not combine unrelated issues in one comment.</item>
</do_not>

<output_requirements>
  <requirement>Short review summary with merge decision, 2-5 key risks, and confirmed checks</requirement>
  <requirement>Separate `blocking` findings from `major` and `minor` follow-ups</requirement>
  <requirement>For each blocker, state evidence, risk, and a minimal fix or acceptance condition</requirement>
</output_requirements>
