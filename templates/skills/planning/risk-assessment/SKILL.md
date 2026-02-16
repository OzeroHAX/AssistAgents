---
name: planning-risk-assessment
description: Risk assessment: likelihood/impact, mitigations, residual risk
---

<purpose>
  <item>Identify risks, assess them, and define concrete mitigations</item>
</purpose>

<inputs>
  <required>Change description + impact areas (if available)</required>
  <optional>Critical business processes and SLA</optional>
  <optional>Release/window/process constraints</optional>
</inputs>

<risk_categories>
  <item>data</item>
  <item>security</item>
  <item>performance</item>
  <item>reliability</item>
  <item>ops</item>
  <item>business</item>
</risk_categories>

<method>
  <step>Create a list of risks tied to specific planned changes</step>
  <step>Assess likelihood and impact (qualitative: low/medium/high)</step>
  <step>For each high-impact risk, add a mitigation (test/flag/staged rollout/scope reduction/monitoring)</step>
  <step>Define residual risk and the decision (accept/reduce/avoid)</step>
</method>

<output_format>
  <section>Risks list</section>
  <section>Likelihood / impact</section>
  <section>Mitigations</section>
  <section>Residual risks / decisions</section>
</output_format>

<quality_rules>
  <rule importance="critical">Risks are not generic; they are tied to planned changes</rule>
  <rule importance="high">High-impact risks have concrete mitigation actions</rule>
</quality_rules>
