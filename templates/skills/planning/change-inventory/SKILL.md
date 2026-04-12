---
name: planning-change-inventory
description: Use when a plan must list concrete artifacts and intended edits tied to requirements or AC, not broad impact analysis
---

<purpose>
  <item>Turn a scoped change into a finite edit inventory that implementation can follow.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when planning must name the concrete files, modules, configs, schemas, or migrations expected to change.</item>
  <item importance="high">Use when each artifact needs a short rationale tied to a requirement, acceptance criterion, bug, or risk.</item>
  <item importance="high">Use when the plan must show dependency order or risky edit points before implementation.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for broad cross-system impact analysis without a concrete artifact list.</item>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is task boundaries, approach selection, or test strategy rather than edit inventory.</item>
</when_not_to_use>

<input_requirements>
  <required>Goal, requirements, or acceptance criteria for the change</required>
  <required>Known impact areas, candidate artifacts, or starting points</required>
  <optional>Architecture, stack, or sequencing constraints</optional>
  <optional>Known risks or migrations</optional>
</input_requirements>

<workflow>
  <step>List the concrete artifacts that are likely to change at the narrowest defensible granularity.</step>
  <step>For each artifact, record the intended change and tie it to a requirement, acceptance criterion, bug, or risk.</step>
  <step>Mark dependencies and order, including what must happen first and what can proceed in parallel.</step>
  <step>Flag uncertain or high-risk artifacts for follow-up discovery or extra verification.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Artifacts list`, `Changes per artifact`, and `Dependencies / order`, plus `Risk flags` when needed.</requirement>
  <requirement>Each entry names the artifact or narrowest defensible placeholder and states the intended edit plus rationale.</requirement>
  <requirement>Dependency/order notes are explicit for sequencing-sensitive work.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">The artifact list is finite and specific; avoid vague wording such as "change a couple of files."</rule>
  <rule importance="critical">Each planned edit is tied to a requirement, acceptance criterion, bug, or risk.</rule>
  <rule importance="high">Dependencies and ordering are explicit wherever sequencing matters.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output names concrete artifacts and explains the planned change for each one.</item>
  <item importance="critical">Each artifact entry is traceable to a requirement, acceptance criterion, bug, or risk.</item>
  <item importance="high">Dependency/order notes and risk flags are present when they affect correctness or coordination.</item>
  <item importance="high">The result stays at edit-inventory level and does not drift into broad impact analysis or implementation.</item>
</validation>
