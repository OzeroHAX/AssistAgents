---
name: review-arch-consistency
description: Use when reviewing whether a concrete change stays consistent with architecture boundaries, contracts, and accepted decisions
---

<when_to_use>
  <trigger>A concrete change affects module boundaries, contracts, dependencies, or integrations</trigger>
  <trigger>It is necessary to verify that the proposal follows existing architecture rules and accepted decisions</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
  <item importance="high">Do not use for a full architecture assessment that must also cover NFRs, rollout, rollback, or broad trade-off analysis.</item>
</when_not_to_use>
<input_requirements>
  <required>Description of the architectural decision or ADR</required>
  <required>List of affected components, dependencies, and contracts</required>
  <optional>Project architectural principles and constraints</optional>
</input_requirements>

<workflow>
  <step>Identify the affected layers, modules, contracts, dependencies, and integrations in the reviewed artifact.</step>
  <step>Check whether the proposed responsibilities and boundaries stay compatible with the existing architecture.</step>
  <step>Verify that new dependencies are justified, reuse existing mechanisms where possible, and do not introduce hidden coupling.</step>
  <step>Check the change against previously accepted architectural decisions and record any deviation with rationale, owner, and acceptance conditions.</step>
  <step>Return a short verdict with the concrete conflicts, deviations, severity, and conditions required for acceptance.</step>
</workflow>

<core_checks>
  <check priority="P0">The solution is compatible with existing layers and responsibility boundaries</check>
  <check priority="P0">New dependencies are justified and do not create hidden coupling</check>
  <check priority="P1">The change does not conflict with previously accepted architectural decisions</check>
  <check priority="P1">Deviations from principles are documented and explained</check>
  <check priority="P1">Existing mechanisms are reused rather than duplicated</check>
</core_checks>

<quality_rules>
  <rule importance="critical">Each deviation from architecture rules has an explicit rationale and owner</rule>
  <rule importance="high">Conclusions are backed by links to artifacts: ADRs, diagrams, contracts</rule>
  <rule importance="high">The review records consequences for neighboring teams and modules</rule>
</quality_rules>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>
<do_not>
  <item importance="critical">Do not accept architectural changes based only on a local team benefit</item>
  <item importance="high">Do not ignore the accumulation of inconsistent exceptions</item>
</do_not>

<output_requirements>
  <requirement>Short verdict: consistent or inconsistent</requirement>
  <requirement>List of conflicts or deviations with severity and acceptance conditions</requirement>
</output_requirements>
