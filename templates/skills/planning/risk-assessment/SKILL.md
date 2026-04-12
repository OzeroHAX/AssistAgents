---
name: planning-risk-assessment
description: Use when planning must assess change-specific risks, mitigations, and residual risk
---

<purpose>
  <item>Assess risks of a proposed change before implementation and define concrete mitigations plus residual-risk decisions.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when planning must identify risks tied to a proposed change before implementation starts.</item>
  <item importance="high">Use when the output must rate likelihood and impact and decide whether a risk should be accepted, reduced, or avoided.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is rollout staging, rollback mechanics, or test planning rather than risk assessment.</item>
  <item importance="high">Do not use for generic brainstorming that is not anchored to a concrete planned change.</item>
</when_not_to_use>

<input_requirements>
  <required>Proposed change, goal, or scoped plan</required>
  <required>Known impact areas, constraints, or critical flows if already available</required>
  <optional>Business criticality, SLA, release window, or compliance/security constraints</optional>
</input_requirements>

<risk_categories>
  <item>data</item>
  <item>security</item>
  <item>performance</item>
  <item>reliability</item>
  <item>ops</item>
  <item>business</item>
</risk_categories>

<workflow>
  <step>List concrete risks tied to the proposed change and the affected flow, dependency, or operational area.</step>
  <step>Rate each risk for likelihood and impact using `low/medium/high`.</step>
  <step>For each medium- or high-impact risk, define a concrete mitigation such as testing, flags, staged rollout, monitoring, or scope reduction.</step>
  <step>State the residual risk and choose `accept`, `reduce`, or `avoid`; flag blockers or unknowns that prevent a confident decision.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Risks`, `Likelihood / impact`, `Mitigations`, and `Residual risk / decision`.</requirement>
  <requirement>Each listed risk must tie back to the proposed change and the affected asset, flow, or operational concern.</requirement>
  <requirement>Each medium- or high-impact risk must include a mitigation or an explicit reason it is still unknown.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Risks are specific to the planned change and not generic category labels.</rule>
  <rule importance="high">Medium- and high-impact risks have concrete mitigations.</rule>
  <rule importance="high">The result stays at risk-assessment level and does not drift into implementation or other planning outputs.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required sections and ties each risk to the change goal, scope, or constraint.</item>
  <item importance="critical">Likelihood, impact, mitigation, and residual-risk decision are explicit for each medium- or high-impact risk.</item>
  <item importance="high">Unknowns or blockers are flagged when they affect risk acceptance or mitigation choice.</item>
</validation>
