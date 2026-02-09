---
name: review-arch-consistency
description: Review of architectural consistency of changes against principles and the current system landscape
---

<when_to_use>
  <trigger>The change affects module boundaries, contracts, or integrations</trigger>
  <trigger>It is necessary to assess whether the solution violates established architecture rules</trigger>
</when_to_use>

<input_requirements>
  <required>Description of the architectural decision or ADR</required>
  <required>List of affected components and contracts</required>
  <optional>Project architectural principles and constraints</optional>
</input_requirements>

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

<do_not>
  <item importance="critical">Do not accept architectural changes based only on a local team benefit</item>
  <item importance="high">Do not ignore the accumulation of inconsistent exceptions</item>
</do_not>

<output_requirements>
  <requirement>Short verdict: consistent or inconsistent</requirement>
  <requirement>List of conflicts/deviations and acceptance conditions</requirement>
</output_requirements>
