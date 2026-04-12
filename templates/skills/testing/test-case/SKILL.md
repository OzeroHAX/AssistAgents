---
name: testing-test-case
description: Use when designing detailed reproducible manual test cases from requirements or acceptance criteria; not for smoke, sanity, or regression checklists
---

<when_to_use>
  <item importance="critical">Use when the user needs detailed reproducible test cases for a feature, story, requirement, or acceptance criteria.</item>
  <item importance="high">Use when the request needs step-by-step positive, negative, or boundary coverage instead of a short checklist.</item>
</when_to_use>

<input_requirements>
  <required>Link to requirement, task, story, or PRD</required>
  <required>Acceptance criteria or expected behavior</required>
  <required>Key user scenarios</required>
  <optional>Requirement or AC identifiers</optional>
  <optional>Scenario priority or criticality</optional>
  <optional>Known bugs or risk areas</optional>
  <optional>Environment, access, data, or setup constraints</optional>
</input_requirements>


<workflow>
  <step importance="critical">Confirm the requirement, acceptance criteria, scenarios, and any environment or data constraints.</step>
  <step importance="critical">Split the scope into independent positive, negative, validation-error, and boundary checks when needed.</step>
  <step importance="critical">For each case, define preconditions, test data, steps, and one explicit expected result, using Given-When-Then when it improves clarity.</step>
  <step importance="high">Link each case to one requirement or acceptance criterion, remove overlap, and surface assumptions or open gaps.</step>
</workflow>

<output_requirements>
  <requirement importance="critical">Produce detailed test cases or an explicit case design summary grouped by requirement, acceptance criterion, or scenario.</requirement>
  <requirement importance="critical">Each documented case must state the scenario title, preconditions, test data, steps, and one verifiable expected result.</requirement>
  <requirement importance="high">Separate positive, negative, and boundary coverage when applicable, and call out assumptions or missing data that affect reproducibility.</requirement>
</output_requirements>


<when_not_to_use>
  <item importance="critical">Do not use for smoke, sanity, or regression checklists.</item>
  <item importance="critical">Do not use for automated UI or API test implementation or CI autotest maintenance.</item>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<test_design>
  <principles>
    <principle importance="critical">Use Given-When-Then where it improves clarity</principle>
    <principle importance="high">Separate positive and negative scenarios</principle>
    <principle importance="high">One case = one check</principle>
    <principle importance="high">Apply equivalence partitioning and boundary values</principle>
    <principle importance="medium">State preconditions and keep test data separate from execution steps</principle>
  </principles>
</test_design>

<quality_rules>
  <rule importance="critical">Steps are reproducible without interpretation</rule>
  <rule importance="critical">Expected result is verifiable and unambiguous</rule>
  <rule importance="high">No duplicate or overlapping cases</rule>
  <rule importance="high">Edge cases, validation errors, and test data assumptions are explicit when relevant</rule>
  <rule importance="medium">Each case is linked to one requirement, AC, or scenario</rule>
</quality_rules>

<validation>
  <item importance="critical">Cases are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, access, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence expectations are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not mix multiple scenarios in one case</item>
  <item importance="high">Do not use vague wording</item>
  <item importance="high">Do not include more than one requirement or AC in one case</item>
  <item importance="high">Do not leave implicit assumptions about data, access, or environment</item>
</do_not>

<examples>
  <good>
    <case>TC-LOGIN-001: Valid login with an existing user</case>
    <why>Clear scenario, reproducible steps, and one verifiable outcome.</why>
  </good>
  <bad>
    <case>Check login works</case>
    <why>No structure, no steps, and no expected result.</why>
  </bad>
</examples>
