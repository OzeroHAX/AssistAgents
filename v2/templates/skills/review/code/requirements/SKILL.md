---
name: review-code-requirements
description: PR compliance review against requirements, AC, and scope boundaries
---

<when_to_use>
  <trigger>Need to confirm that implementation covers the original request</trigger>
  <trigger>There is a risk of scope creep or missing acceptance criteria</trigger>
</when_to_use>

<input_requirements>
  <required>Defined task goal</required>
  <required>Acceptance criteria or list of requirements</required>
  <required>PR/diff with changes</required>
  <optional>Out-of-scope constraints</optional>
</input_requirements>

<review_method>
  <step>Map each requirement to a specific PR change</step>
  <step>Identify requirements without coverage and changes without requirements</step>
  <step>Verify edge cases explicitly stated in AC</step>
  <step>Verify out-of-scope areas are not touched without agreement</step>
</review_method>

<quality_rules>
  <rule importance="critical">Each AC has evidence: code, test, or observable behavior</rule>
  <rule importance="high">Any behavior outside requirements is marked as additional and agreed</rule>
  <rule importance="high">Uncovered requirements are recorded as blocking</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not treat "seems to work" as evidence of requirement fulfillment</item>
  <item importance="high">Do not ignore mismatches between task description and actual diff</item>
</do_not>

<output_requirements>
  <requirement>Traceability matrix: requirement -> PR evidence</requirement>
  <requirement>List of gaps: missing coverage, extra scope, open questions</requirement>
</output_requirements>
