---
name: planning-rollout-strategy
description: Rollout strategy: stages, audiences, enablement mechanics, stop points
---

<purpose>
  <item>Reduce rollout degradation risk and keep enablement controllable</item>
</purpose>

<inputs>
  <required>Change description + risks/criticality</required>
  <optional>Available mechanisms (feature flags, canary, blue-green)</optional>
  <optional>Release/window constraints</optional>
</inputs>

<method>
  <step>Select a rollout mechanism (flag/canary/blue-green) based on risk and process</step>
  <step>Define stages (audience/percent/time) and criteria to move between stages</step>
  <step>Define stop points and actions on degradation</step>
  <step>Capture communications/owners (if it affects prod)</step>
</method>

<output_format>
  <section>Rollout mechanism</section>
  <section>Stages</section>
  <section>Gates / stop points</section>
  <section>Actions on degradation</section>
</output_format>

<quality_rules>
  <rule importance="critical">Stages and gates are specific (percent/time/conditions)</rule>
  <rule importance="high">There are explicit actions on degradation, not "we will see"</rule>
</quality_rules>
