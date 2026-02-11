---
name: review-arch-full-check
description: Full architecture review: decisions, trade-offs, NFRs, risks, and rollback plan
---

<when_to_use>
  <trigger>Major changes to architecture or public contracts</trigger>
  <trigger>High risk in reliability, security, or scalability</trigger>
  <trigger>Before launching an initiative with long-term consequences</trigger>
</when_to_use>

<input_requirements>
  <required>ADR or equivalent document with options and selected approach</required>
  <required>Change goals and success criteria</required>
  <required>Description of impact on NFRs: reliability, performance, security, operability</required>
  <required>Rollout and rollback plan</required>
  <optional>Cost estimate and team constraints</optional>
</input_requirements>

<full_review_blocks>
  <block>Context and problem: why the current state is insufficient</block>
  <block>Options and trade-offs: which alternatives were considered and why they were rejected</block>
  <block>Decision traceability: links to ADRs, tasks, and implementation</block>
  <block>NFR analysis: reliability, performance, security, observability</block>
  <block>Risks and failure modes: what can go wrong and how to detect it</block>
  <block>Evolution and reversibility: phasing, migrations, rollback</block>
</full_review_blocks>

<quality_rules>
  <rule importance="critical">A decision without explicit trade-offs and consequences is not considered ready</rule>
  <rule importance="critical">Critical risks have mitigations and owners</rule>
  <rule importance="high">There are measurable signals of post-release success and degradation</rule>
  <rule importance="high">The rollout/rollback plan is realistic and verifiable</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not approve architecture without validating NFR impact</item>
  <item importance="high">Do not leave irreversible changes without a rollback strategy</item>
  <item importance="high">Do not stop at diagrams without operational implications</item>
</do_not>

<output_requirements>
  <requirement>Final status: approve, approve-with-conditions, or reject</requirement>
  <requirement>List of launch conditions and mandatory follow-up steps</requirement>
  <requirement>Explicit risk register with severity and owner</requirement>
</output_requirements>
