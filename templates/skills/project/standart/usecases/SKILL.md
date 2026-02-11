---
name: project-standart-usecases
description: Designing use cases and user flows with PRD traceability
---

<purpose>
  <item>Describe key user scenarios in an executable and testable form</item>
  <item>Prepare a foundation for architecture and epic/task breakdown</item>
</purpose>

<when_to_use>
  <item importance="critical">After PRD and personas are finalized, before epics/tasks</item>
  <item importance="high">When flow alignment and behavior edge conditions matter</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-requirements-extraction</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update files in `use-cases/{use case key}-{use case number}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Define primary actor, preconditions, main flow, alternate flow, and failure flow</step>
  <step>Map each use case to requirements and AC from PRD</step>
  <step>Identify input/output data and integration points</step>
  <step>Capture validation signals for scenario testing</step>
</method>

<output_format>
  <section>Use case goal</section>
  <section>Actors and preconditions</section>
  <section>Main flow</section>
  <section>Alternate and error flows</section>
  <section>PRD / AC traceability</section>
  <section>Validation signals</section>
</output_format>

<quality_rules>
  <rule importance="critical">Every scenario has a clear expected outcome</rule>
  <rule importance="high">Scenarios cover critical errors and deviations</rule>
  <rule importance="high">Bi-directional traceability exists: use case -> PRD AC</rule>
</quality_rules>
