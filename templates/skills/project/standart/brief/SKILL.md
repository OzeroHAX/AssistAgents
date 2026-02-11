---
name: project-standart-brief
description: Creating an initial brief for standard planning
---

<purpose>
  <item>Capture the problem, target outcome, MVP boundaries, and success criteria</item>
  <item>Prepare a solid foundation for `prd.md` without hidden assumptions</item>
</purpose>

<when_to_use>
  <item importance="critical">Right after `status:init`, before detailed PRD work</item>
  <item importance="high">When the request is vague and project context needs stabilization</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-base</item>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update `brief.md`</rule>
</document_target>

<method>
  <step>Formulate the problem and business goal as a measurable outcome</step>
  <step>Define in-scope and out-of-scope at the product level</step>
  <step>Describe success criteria and high-level constraints</step>
  <step>Separate facts from assumptions and capture open questions</step>
</method>

<output_format>
  <section>Problem statement</section>
  <section>Goal and success metrics</section>
  <section>In scope</section>
  <section>Out of scope</section>
  <section>Constraints</section>
  <section>Assumptions and open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">The goal is expressed as an outcome, not a list of actions</rule>
  <rule importance="high">Product boundaries are explicit and testable</rule>
  <rule importance="high">Open questions directly influence the next step (PRD), not "later"</rule>
</quality_rules>
