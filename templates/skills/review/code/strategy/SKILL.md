---
name: review-code-strategy
description: Code review strategy: PR review flow, risk prioritization, and merge blocking rules
---

<when_to_use>
  <trigger>Need to review a pull request before merge</trigger>
  <trigger>There is disagreement on comment strictness and blocking criteria</trigger>
  <trigger>Need to align a unified review process across the team</trigger>
</when_to_use>

<input_requirements>
  <required>PR link or diff</required>
  <required>Task context and expected behavior</required>
  <optional>Release risks and component criticality</optional>
  <optional>Incident history in the changed area</optional>
</input_requirements>

<review_flow>
  <step order="1">Understand PR goal and change boundaries</step>
  <step order="2">Check architectural fit and impact on neighboring modules</step>
  <step order="3">Review correctness, security, performance, and tests</step>
  <step order="4">Split findings into blocking and non-blocking</step>
  <step order="5">Provide short conclusion: approve or request changes with reasons</step>
</review_flow>

<severity_model>
  <level name="blocking">Requirement violation, vulnerability risk, potential behavior breakage, or missing critical tests</level>
  <level name="major">Significant technical debt or high regression risk, but with a temporary workaround</level>
  <level name="minor">Naming, style, local readability, and low-risk improvements</level>
</severity_model>

<quality_rules>
  <rule importance="critical">Each blocking comment includes a reproducible risk and expected fix</rule>
  <rule importance="high">Focus on code health, not personal preferences</rule>
  <rule importance="high">Comments must be specific and tied to diff locations</rule>
  <rule importance="medium">Non-blocking improvements are phrased briefly and constructively</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not block merge over preference comments without risk</item>
  <item importance="high">Do not leave comments without explaining impact</item>
  <item importance="high">Do not combine multiple unrelated issues in one comment</item>
</do_not>

<output_requirements>
  <requirement>Short review summary: status, 2-5 key risks, merge decision</requirement>
  <requirement>List blocking findings separately from non-blocking</requirement>
  <requirement>Explicitly state which checks are already confirmed (tests/security/perf)</requirement>
</output_requirements>
