---
name: planning-impact-analysis
description: Identify affected systems, contracts, and data plus regression hotspots; not file-level edit inventory
---

<purpose>
  <item>Identify what the changes truly affect to avoid missing critical areas</item>
</purpose>

<inputs>
  <required>Short description of the change or goal</required>
  <optional>Known modules/files/services</optional>
  <optional>Integrations and external contracts (API, events, queues)</optional>
</inputs>

<method>
  <step>Identify entry points and the data/request path</step>
  <step>List affected components (UI/API/worker/DB/infra)</step>
  <step>List contracts: public APIs, events, formats, schemas</step>
  <step>Describe data impact: schema, migrations, indexes, integrity</step>
  <step>Mark likely regressions and higher-criticality hotspots</step>
</method>

<output_format>
  <section>Affected areas</section>
  <section>Interfaces / contracts</section>
  <section>Data impact</section>
  <section>Regression hotspots</section>
</output_format>

<quality_rules>
  <rule importance="critical">Impact areas are specific and verifiable</rule>
  <rule importance="high">External contracts are listed explicitly</rule>
</quality_rules>
