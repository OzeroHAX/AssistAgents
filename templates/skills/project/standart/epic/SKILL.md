---
name: project-standart-epic
description: Decomposing PRD and architecture into traceable prioritized epics
---

<purpose>
  <item>Build epics as manageable value blocks with explicit links to requirements</item>
  <item>Prepare a foundation for detailed task decomposition and delivery planning</item>
</purpose>

<when_to_use>
  <item importance="critical">After architecture, before decomposition into tasks</item>
  <item importance="high">When implementation must be ordered by value, risk, and dependencies</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-change-inventory</item>
  <item>planning-scope-minimization</item>
  <item>planning-estimation</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update files in `epics/{epic key}-{epic number}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Break requirements into vertical epics with observable user value</step>
  <step>Map each epic to FR/NFR, use cases, and architectural constraints</step>
  <step>Identify inter-epic dependencies and recommended sequencing</step>
  <step>Define acceptance criteria and definition of done for each epic</step>
</method>

<output_format>
  <section>Epic summary</section>
  <section>Scope and non-goals</section>
  <section>PRD / use-case mapping</section>
  <section>Dependencies and order</section>
  <section>Acceptance criteria and DoD</section>
</output_format>

<quality_rules>
  <rule importance="critical">No epics without linkage to requirements or architectural necessity</rule>
  <rule importance="high">Epic boundaries are narrow enough for manageable delivery</rule>
  <rule importance="high">Execution order accounts for the critical path</rule>
</quality_rules>
