---
name: planning-rollout-strategy
description: Use when a plan needs staged rollout steps, promotion gates, stop points, and degradation actions
---

<purpose>
  <item>Define a staged rollout plan that makes promotion, pause, or rollback decisions explicit.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the main planning question is how to release a change in stages instead of all at once.</item>
  <item importance="high">Use when rollout stages need audience, percentage, region, or time-based progression with promotion criteria.</item>
  <item importance="high">Use when stop points, degradation actions, or rollout ownership must be defined.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is rollback mechanics after failure.</item>
  <item importance="high">Do not use when the main need is monitoring signals or alert thresholds.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<input_requirements>
  <required>Change being rolled out and risk level</required>
  <required>Available rollout mechanisms and release constraints</required>
  <optional>Audience, region, or environment segmentation</optional>
  <optional>Owner, support, or communication constraints</optional>
</input_requirements>

<workflow>
  <step>Choose the rollout mechanism based on risk and operational constraints.</step>
  <step>Define stages with scope, observation window, and promotion criteria.</step>
  <step>Define stop points and the signals that pause rollout or require rollback or manual review.</step>
  <step>State degradation actions and any required owner or communication steps.</step>
</workflow>

<output_requirements>
  <requirement>Produce sections named `Chosen mechanism`, `Stages`, `Promotion gates / stop points`, and `Actions on degradation`.</requirement>
  <requirement>Each stage states scope, rollout size, observation window, and promotion criteria.</requirement>
  <requirement>`Actions on degradation` states whether rollout pauses, rolls back, or needs manual review, plus the owner when relevant.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Stages, gates, and observation windows are concrete enough to control rollout decisions.</rule>
  <rule importance="high">Degradation actions are explicit about pause, rollback, or escalation.</rule>
</quality_rules>

<validation>
  <item importance="critical">A reviewer can identify the chosen mechanism, rollout stages, promotion gates, and degradation actions without inferring missing rollout logic.</item>
  <item importance="critical">Each stage has explicit promotion or stop criteria tied to risk or constraints.</item>
  <item importance="high">The result stays focused on staged rollout strategy rather than implementation details, rollback-only mechanics, or monitoring-only design.</item>
</validation>
