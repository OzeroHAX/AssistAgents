---
name: planning-change-inventory
description: Change inventory: list files/components and what changes in each
---

<purpose>
  <item>Make the plan executable: capture concrete edit points and the order</item>
</purpose>

<inputs>
  <required>Goal/requirements + impact areas</required>
  <optional>Architecture/stack constraints</optional>
</inputs>

<method>
  <step>Make a list of artifacts (files/modules/configs/migrations)</step>
  <step>For each, state: what changes and why (tie to AC/bug)</step>
  <step>Mark dependencies and order (what must happen first)</step>
  <step>Mark high-risk changes (for additional verification)</step>
</method>

<output_format>
  <section>Artifacts list</section>
  <section>Changes per artifact</section>
  <section>Dependencies / order</section>
</output_format>

<quality_rules>
  <rule importance="critical">The list is finite and specific (not "change a couple of files")</rule>
  <rule importance="high">Every change is tied to the goal or AC</rule>
</quality_rules>
