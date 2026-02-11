---
name: planning-estimation
description: Time/effort estimation: method, range, assumptions, uncertainty
---

<purpose>
  <item>Provide a transparent estimate tied to decomposition and risks</item>
</purpose>

<inputs>
  <required>Change inventory or work decomposition</required>
  <optional>Blockers/dependencies/quality/process constraints</optional>
</inputs>

<method>
  <step>Estimate by phases (analysis/implementation/tests/rollout) or by components</step>
  <step>Pick an estimation method (three-point, t-shirt, points) and name it</step>
  <step>Provide a range (min/likely/max) and assumptions</step>
  <step>List factors that can move the estimate</step>
</method>

<output_format>
  <section>Breakdown</section>
  <section>Estimation method</section>
  <section>Estimate range</section>
  <section>Assumptions</section>
  <section>What could change the estimate</section>
</output_format>

<quality_rules>
  <rule importance="critical">The estimate is based on decomposition, not on "gut feel"</rule>
  <rule importance="critical">A range and assumptions are provided</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not give a single exact number without a range when there is uncertainty</item>
  <item importance="high">Do not mix an estimate with a delivery commitment</item>
</do_not>
