---
name: review-arch-full-check
description: Review major architecture decisions for trade-offs, NFR impact, risks, and rollback readiness
---

<when_to_use>
  <trigger>Major changes to architecture or public contracts</trigger>
  <trigger>High risk in reliability, security, or scalability</trigger>
  <trigger>Before launching an initiative with long-term consequences</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
  <item importance="high">Do not use for narrow consistency-only checks when trade-offs, NFR impact, and rollout readiness do not need full review.</item>
</when_not_to_use>
<input_requirements>
  <required>ADR or equivalent document with options and selected approach</required>
  <required>Change goals and success criteria</required>
  <required>Description of impact on NFRs: reliability, performance, security, operability</required>
  <required>Rollout and rollback plan</required>
  <optional>Cost estimate and team constraints</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm the reviewed artifact, decision boundary, goals, and success criteria.</step>
  <step order="2">Inspect the decision context, rejected alternatives, and explicit trade-offs.</step>
  <step order="3">Evaluate NFR impact: reliability, performance, security, observability, and operability.</step>
  <step order="4">Check risks, failure modes, rollout stages, monitoring signals, and rollback feasibility.</step>
  <step order="5">Return approve, approve-with-conditions, or reject with evidence, launch conditions, and a risk register.</step>
</workflow>

<full_review_blocks>
  <block>Context and problem: why the current state is insufficient</block>
  <block>Options and trade-offs: which alternatives were considered and why they were rejected</block>
  <block>Decision traceability: links to ADRs, tasks, and implementation</block>
  <block>NFR analysis: reliability, performance, security, observability</block>
  <block>Risks and failure modes: what can go wrong and how to detect it</block>
  <block>Evolution and reversibility: phasing, migrations, rollback</block>
</full_review_blocks>

<status_criteria>
  <status name="approve">Trade-offs are explicit, critical risks have mitigations and owners, and rollout/rollback readiness is verified.</status>
  <status name="approve-with-conditions">The decision can proceed only if named launch conditions are completed before release.</status>
  <status name="reject">Evidence, NFR handling, or reversibility is insufficient for safe adoption.</status>
</status_criteria>

<quality_rules>
  <rule importance="critical">A decision without explicit trade-offs and consequences is not considered ready</rule>
  <rule importance="critical">Critical risks have mitigations and owners</rule>
  <rule importance="high">There are measurable signals of post-release success and degradation</rule>
  <rule importance="high">The rollout/rollback plan is realistic and verifiable</rule>
</quality_rules>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>
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
