---
name: testing-checklist
description: Use when the user needs a short smoke, sanity, or regression checklist for critical user paths instead of detailed test cases
---

<when_to_use>
  <item importance="critical">Use when the user wants a short smoke, sanity, or regression checklist for a bounded feature, release, or critical flow.</item>
  <item importance="high">Use when the request provides or implies the verification goal, critical scenarios or modules, and the main recent-change or risk areas.</item>
</when_to_use>

<input_requirements>
  <required>Verification goal (smoke/sanity/regression)</required>
  <required>List of critical scenarios and modules</required>
  <optional>Environment constraints and access</optional>
  <optional>List of recent changes/fixes</optional>
  <optional>Release risks and priorities</optional>
</input_requirements>

<workflow>
  <step>Choose one checklist type and keep smoke, sanity, and regression separate.</step>
  <step>Select only the critical user paths, high-risk checks, and recent-change areas inside the stated scope.</step>
  <step>Write short independent checks with an explicit expected result or pass signal.</step>
  <step>Add shared assumptions about environment, access, or data only when they affect execution.</step>
</workflow>

<output_requirements>
  <requirement>Return one checklist only.</requirement>
  <requirement>Start with `Type:` and `Scope:`; add `Assumptions:` only when environment, access, or data constraints matter.</requirement>
  <requirement>List concise independent checks in execution order or by priority using `P0/P1/P2` only when the priority difference matters.</requirement>
  <requirement>Each item must state the check and its expected result or pass signal.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for full step-by-step test case design.</item>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<checklist_types>
  <type name="smoke">Quick check that the system works overall</type>
  <type name="sanity">Check a specific area after changes</type>
  <type name="regression">Check that changes did not break existing behavior</type>
</checklist_types>

<prioritization>
  <level name="P0">Blocks the release</level>
  <level name="P1">Critical, but has a workaround</level>
  <level name="P2">Important for UX, but not blocking</level>
</prioritization>

<construction_rules>
  <rule importance="critical">Checklist items are verifiable and unambiguous</rule>
  <rule importance="high">Each item is tied to user value</rule>
  <rule importance="high">No duplicates or overlaps between items</rule>
  <rule importance="high">Items are short and quick to execute</rule>
</construction_rules>

<do_not>
  <item importance="critical">Do not turn a checklist into a full set of test cases</item>
  <item importance="high">Do not include items without a clear success criterion</item>
  <item importance="high">Do not mix smoke and regression in one list</item>
  <item importance="high">Do not include items that depend on another item without an explicit link</item>
</do_not>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>
