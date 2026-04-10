---
name: planning-impact-analysis
description: Use when planning must identify a proposed change's affected systems, contracts, data impact, and regression hotspots, not file-level edit inventory
---

<purpose>
  <item>Identify the cross-system blast radius of a proposed change before implementation begins.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when planning must answer which systems, flows, contracts, or data paths a change can affect.</item>
  <item importance="high">Use when the main question is "what else does this touch?" rather than "which exact files change?".</item>
  <item importance="high">Use when downstream dependencies or regression hotspots must be surfaced before implementation.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for file-level edit inventory.</item>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is a narrower planning output such as change inventory, test strategy, or rollback mechanics.</item>
</when_not_to_use>

<input_requirements>
  <required>Change goal, requirement set, or scoped proposal</required>
  <required>Known entry points, modules, services, or contracts if already identified</required>
  <optional>System constraints, incident context, or architecture hints</optional>
</input_requirements>

<workflow>
  <step>Identify the starting point plus the request, event, or data paths touched by the proposed change.</step>
  <step>List impacted components across application, service, worker, data, and infrastructure layers, with a short why for each.</step>
  <step>List affected contracts or dependencies, including APIs, events, schemas, queues, and downstream consumers where relevant.</step>
  <step>Describe data and storage impact, such as schema changes, migrations, indexes, consistency risks, or cache/search implications.</step>
  <step>Summarize regression hotspots, coordination points, and follow-up planning needs.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Affected areas`, `Interfaces / contracts`, `Data impact`, and `Regression hotspots`.</requirement>
  <requirement>Each listed impact must tie back to the proposed change and explain why that area, contract, or dependency may be affected.</requirement>
  <requirement>Flag unknowns or follow-up coordination needs when evidence is incomplete.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Impact areas are specific and tied to a concrete flow, dependency, contract, or data path.</rule>
  <rule importance="high">Interfaces and downstream dependencies are listed explicitly where relevant.</rule>
  <rule importance="high">The result stays at cross-system impact level and does not drift into file-level edits or implementation.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required sections and ties each impact to the change goal, requirement, or constraint.</item>
  <item importance="critical">Contracts and data/storage implications are explicit where relevant.</item>
  <item importance="high">Regression hotspots and follow-up planning needs are identified when they affect risk or coordination.</item>
  <item importance="high">The result remains impact analysis, not edit inventory or implementation guidance.</item>
</validation>
