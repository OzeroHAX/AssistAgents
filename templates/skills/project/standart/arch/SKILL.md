---
name: project-standart-arch
description: Architecture design for PRD/use cases in the standard flow
---

<purpose>
  <item>Capture architecture decisions, constraints, and contracts for safe implementation</item>
  <item>Reduce integration and scaling risks before task decomposition starts</item>
</purpose>

<when_to_use>
  <item importance="critical">After PRD and use cases, before epics and decomposition</item>
  <item importance="high">When integrations, migrations, public contracts, or non-functional risks exist</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-impact-analysis</item>
  <item>planning-risk-assessment</item>
  <item>planning-migration-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update `arch.md`</rule>
</document_target>

<method>
  <step>Define components, responsibility boundaries, and key data flows</step>
  <step>Capture contracts: API/events/schema and compatibility</step>
  <step>Document architecture decisions and trade-offs</step>
  <step>List risks, mitigations, and fallback strategies</step>
  <step>Define constraints for epics and tasks (implementation guardrails)</step>
</method>

<output_format>
  <section>Architecture goals and constraints</section>
  <section>Component model and data flows</section>
  <section>Interfaces and contracts</section>
  <section>Key decisions and trade-offs</section>
  <section>Risks and mitigations</section>
  <section>Implementation guardrails</section>
</output_format>

<quality_rules>
  <rule importance="critical">The architecture covers all critical PRD/use-case requirements</rule>
  <rule importance="critical">External contracts are listed explicitly</rule>
  <rule importance="high">Each decision includes rationale and consequences</rule>
</quality_rules>
