---
name: planning-estimation
description: Use when planning needs a transparent effort estimate with a stated method, range, assumptions, and uncertainty drivers
---

<purpose>
  <item>Turn a scoped change or work breakdown into a transparent estimate tied to decomposition and risk.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when a task, plan, or change request needs time or effort estimation rather than implementation.</item>
  <item importance="high">Use when the work is decomposed enough to estimate by phase, component, or work item.</item>
  <item importance="high">Use when the estimate must expose its method, range, assumptions, and uncertainty drivers explicitly.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="critical">Do not use when the scope is still undefined or the work is not decomposed enough to estimate responsibly.</item>
  <item importance="high">Do not use when the main need is a delivery commitment, prioritization decision, or scope definition rather than estimation.</item>
</when_not_to_use>

<input_requirements>
  <required>Scoped change, task, or work decomposition</required>
  <required>Enough context to estimate by phase, component, or work item</required>
  <optional>Blockers, dependencies, risks, or quality/process constraints</optional>
  <optional>Known assumptions or uncertainty drivers</optional>
</input_requirements>

<workflow>
  <step>If scope or decomposition is insufficient, state what is missing and keep the estimate explicitly low-confidence.</step>
  <step>Choose and name the estimation method.</step>
  <step>Estimate by phase, component, or work item, using a range rather than a single exact number when material uncertainty exists.</step>
  <step>List the assumptions, dependencies, and factors that could move the estimate.</step>
  <step>Separate the estimate from any delivery commitment.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Breakdown`, `Estimation method`, `Estimate range`, `Assumptions`, and `What could change the estimate`.</requirement>
  <requirement>The range uses min/likely/max or another explicit format and names the unit being estimated.</requirement>
  <requirement>If confidence is low, explicitly identify the missing inputs blocking a stronger estimate.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">The estimate is based on decomposition, not on gut feel alone.</rule>
  <rule importance="critical">A range, stated method, and explicit assumptions are provided.</rule>
  <rule importance="high">Uncertainty drivers are visible instead of being hidden inside a single number.</rule>
  <rule importance="high">The estimate is separated from any delivery promise or commitment.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output includes a named estimation method, a structured breakdown, and an explicit estimate range.</item>
  <item importance="critical">Assumptions and estimate-change factors explain why the range could move.</item>
  <item importance="high">The result stays at estimation level and does not drift into implementation, scope definition, or delivery commitment.</item>
  <item importance="high">If the input scope is underdefined, the response marks low confidence and calls out the missing decomposition or assumptions.</item>
</validation>

<do_not>
  <item importance="critical">Do not give a single exact number when material uncertainty exists.</item>
  <item importance="critical">Do not present the estimate as a delivery commitment.</item>
  <item importance="high">Do not hide missing scope or decomposition behind false precision.</item>
</do_not>
