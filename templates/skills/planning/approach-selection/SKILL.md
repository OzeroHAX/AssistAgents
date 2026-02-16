---
name: planning-approach-selection
description: Implementation approach selection: compare options and justify the decision
---

<purpose>
  <item>Compare 1-3 realistic approaches and pick the best by explicit criteria</item>
</purpose>

<inputs>
  <required>Goal/requirements + constraints</required>
  <optional>Risks and process constraints (releases, windows, SLA)</optional>
</inputs>

<method>
  <step>Define 3-6 selection criteria (risk, speed, cost, maintainability, compatibility)</step>
  <step>Describe 1-3 solution options in 2-4 bullets each</step>
  <step>Compare trade-offs against the criteria and choose an option</step>
  <step>Explicitly state what you gain/lose with the chosen option</step>
</method>

<output_format>
  <section>Decision criteria</section>
  <section>Options</section>
  <section>Chosen approach + rationale</section>
  <section>Trade-offs</section>
</output_format>

<quality_rules>
  <rule importance="critical">The choice is justified by criteria, not by "it feels better"</rule>
  <rule importance="high">Trade-offs are stated explicitly</rule>
</quality_rules>
