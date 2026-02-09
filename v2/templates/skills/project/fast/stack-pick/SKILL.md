---
name: project-fast-stack-pick
description: Fast, evidence-based technology stack selection for one-iteration planning
---

<purpose>
  <item>Select a stack using explicit criteria for delivery speed, risk, and supportability</item>
  <item>Document the decision so it can be verified and challenged</item>
</purpose>

<when_to_use>
  <item importance="critical">After pulse-scan and before proto-spec finalization</item>
  <item importance="high">When there are 2+ realistic stack or platform options</item>
</when_to_use>

<required_preload>
  <item>planning-approach-selection</item>
  <item>planning-estimation</item>
  <item>planning-risk-assessment</item>
</required_preload>

<inputs>
  <required>Constraints, risks, and success criteria from previous steps</required>
  <optional>Current team expertise and available resources</optional>
  <optional>Compatibility requirements with the current landscape</optional>
</inputs>

<method>
  <step>Define 3-6 selection criteria (speed, risk, maintainability, cost, compatibility)</step>
  <step>Describe 1-3 realistic stack options</step>
  <step>Compare options against criteria and choose the primary one</step>
  <step>Capture trade-offs and a fallback option</step>
  <step>Validate that the choice supports MVP delivery within one planning iteration</step>
</method>

<output_format>
  <section>Decision criteria</section>
  <section>Stack options</section>
  <section>Chosen stack + rationale</section>
  <section>Trade-offs</section>
  <section>Fallback option</section>
</output_format>

<quality_rules>
  <rule importance="critical">Stack selection is justified by criteria, not preferences</rule>
  <rule importance="high">Trade-offs and limitations of the chosen option are documented</rule>
  <rule importance="high">A fallback exists for critical risks</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not choose a stack without explicit comparison of at least two options (when options exist)</item>
  <item importance="high">Do not ignore actual team expertise</item>
</do_not>
