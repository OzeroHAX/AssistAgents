---
name: testing-checklist
description: Create short smoke/sanity/regression checklists for critical user paths; not full step-by-step test case design
---

<input_requirements>
  <required>Verification goal (smoke/sanity/regression)</required>
  <required>List of critical scenarios and modules</required>
  <optional>Environment constraints and access</optional>
  <optional>List of recent changes/fixes</optional>
  <optional>Release risks and priorities</optional>
</input_requirements>

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
  <rule importance="medium">If result recording is needed, use a single consistent format</rule>
</construction_rules>

<coverage>
  <focus>
    <item>Critical user paths</item>
    <item>Authorization and access control</item>
    <item>Core CRUD operations</item>
    <item>Errors and data validation</item>
  </focus>
</coverage>

<do_not>
  <item importance="critical">Do not turn a checklist into a full set of test cases</item>
  <item importance="high">Do not include items without a clear success criterion</item>
  <item importance="high">Do not mix smoke and regression in one list</item>
  <item importance="high">Do not include items that depend on another item without an explicit link</item>
</do_not>

<example_items>
  <item>Log in with valid credentials</item>
  <item>Create an entity via the primary form</item>
  <item>Show an error for an empty required field</item>
  <item>P0: Verify admin role access to key sections</item>
</example_items>
