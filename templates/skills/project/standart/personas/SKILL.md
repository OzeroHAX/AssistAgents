---
name: project-standart-personas
description: Creating and validating project personas for requirement prioritization
---

<purpose>
  <item>Link product decisions to real users, their pains, and motivations</item>
  <item>Reduce the risk of building features with no value</item>
</purpose>

<when_to_use>
  <item importance="high">After the baseline PRD, before finalizing use cases and epics</item>
  <item importance="critical">When requirements vary by role or behavior scenario</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-requirements-extraction</item>
  <item>planning-impact-analysis</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update `personals.md`</rule>
</document_target>

<method>
  <step>Define primary and secondary personas</step>
  <step>Capture jobs-to-be-done, pains, triggers, and success criteria per persona</step>
  <step>Map PRD requirements to specific personas</step>
  <step>Mark conflicts between persona needs and prioritization rules</step>
</method>

<output_format>
  <section>Persona list</section>
  <section>Goals and pains</section>
  <section>Concerns and objections</section>
  <section>Key scenarios</section>
  <section>PRD requirements mapping</section>
</output_format>

<quality_rules>
  <rule importance="critical">Each persona has a measurable goal and value criterion</rule>
  <rule importance="high">No abstract personas without impact on decisions</rule>
  <rule importance="high">There is an explicit link to use cases and PRD requirements</rule>
</quality_rules>
