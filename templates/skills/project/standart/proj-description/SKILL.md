---
name: project-standart-prd
description: Produce full standard-flow PRD with FR/NFR and testable AC after brief/research and before architecture
---

<purpose>
  <item>Collect verifiable requirements and product readiness criteria in `prd.md`</item>
  <item>Provide an unambiguous foundation for architecture, epics, and tasks</item>
</purpose>

<when_to_use>
  <item importance="critical">After brief (and research if needed), before architecture</item>
  <item importance="high">When formal documentation of FR/NFR and AC is required</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-base</item>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update `prd.md`</rule>
</document_target>

<method>
  <step>Capture FR as observable system behavior</step>
  <step>Add relevant NFR (perf, reliability, security, compliance)</step>
  <step>Define acceptance criteria in Given/When/Then format</step>
  <step>Define release boundaries and explicitly list exclusions</step>
  <step>Link success metrics and risks to requirements</step>
</method>

<output_format>
  <section>Goal</section>
  <section>Functional requirements</section>
  <section>Non-functional requirements</section>
  <section>Acceptance criteria</section>
  <section>In scope / Out of scope</section>
  <section>Dependencies and constraints</section>
  <section>Success metrics</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">AC are testable and do not include implementation details</rule>
  <rule importance="critical">Requirements do not conflict with brief and research</rule>
  <rule importance="high">Scope is limited to a deliverable increment without scope creep</rule>
</quality_rules>
