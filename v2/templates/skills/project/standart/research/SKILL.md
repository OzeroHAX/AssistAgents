---
name: project-standart-research
description: Targeted research to close critical unknowns in the standard flow
---

<purpose>
  <item>Validate key hypotheses with sources before locking requirements and architecture</item>
  <item>Reduce the risk of PRD/architecture errors caused by unverified assumptions</item>
</purpose>

<when_to_use>
  <item importance="high">After brief, if critical unknowns or external constraints exist</item>
  <item importance="critical">Before architecture decisions in integrations, standards, or compliance contexts</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>task-use/research/web-strategy</item>
  <item>planning-risk-assessment</item>
  <item>planning-impact-analysis</item>
</required_preload>

<document_target>
  <rule importance="critical">Create a file in `researches/{date time}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Formulate 1-3 verifiable research questions</step>
  <step>Collect only primary/reliable sources for those questions</step>
  <step>Separate facts, interpretations, and hypotheses</step>
  <step>Identify top risks and top constraints that impact PRD and architecture</step>
  <step>Define implications for scope and decisions</step>
</method>

<output_format>
  <section>Research questions</section>
  <section>Verified findings</section>
  <section>Assumptions / hypotheses</section>
  <section>Risks and constraints</section>
  <section>Impact on PRD/architecture</section>
  <section>Sources</section>
</output_format>

<quality_rules>
  <rule importance="critical">Every key finding includes a source reference</rule>
  <rule importance="high">Unverified statements are marked as hypotheses</rule>
  <rule importance="high">Research outcomes change the next step, not remain "for reference"</rule>
</quality_rules>
