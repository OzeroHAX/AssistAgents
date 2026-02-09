---
name: project-fast-pulse-scan
description: Run a timeboxed research scan after fast-init to confirm critical constraints and escalation triggers
---

<purpose>
  <item>Collect only critical context for one-iteration project decisions</item>
  <item>Reduce the risk of an incorrect plan caused by hidden constraints</item>
</purpose>

<when_to_use>
  <item importance="critical">Immediately after fast-init and before stack/architecture decisions</item>
  <item importance="high">When integrations, compliance, SLA, or external-system dependencies exist</item>
</when_to_use>

<required_preload>
  <item>web-strategy</item>
  <item>planning-risk-assessment</item>
  <item>planning-impact-analysis</item>
</required_preload>

<inputs>
  <required>Goal, scope, and constraints from fast-init</required>
  <optional>Current technical choices and known project pain points</optional>
  <optional>External standards/documentation/market constraints</optional>
</inputs>

<method>
  <step>Formulate 1-3 verifiable research questions</step>
  <step>Run rapid research using primary sources, limited to critical topics</step>
  <step>Identify top risks and top constraints impacting architecture and scope</step>
  <step>Separate facts from hypotheses and note confidence for key findings</step>
  <step>Capture escalation triggers from fast to standard</step>
</method>

<output_format>
  <section>Research questions</section>
  <section>Verified findings</section>
  <section>Top constraints</section>
  <section>Top risks + mitigations</section>
  <section>Escalation triggers</section>
  <section>Sources</section>
</output_format>

<quality_rules>
  <rule importance="critical">Each key finding is backed by at least one reliable source</rule>
  <rule importance="high">Facts and assumptions are explicitly separated</rule>
  <rule importance="high">Risks are prioritized by impact on the fast plan</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not run broad research without a narrowly scoped question</item>
  <item importance="high">Do not pull secondary risks into the fast plan</item>
</do_not>
