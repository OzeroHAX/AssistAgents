---
name: testing-test-case
description: How to design test cases for functionality without mandatory documentation
---

<input_requirements>
  <required>Link to requirement/task/PRD</required>
  <required>Acceptance criteria / expected behavior</required>
  <required>Key user scenarios list</required>
  <optional>Requirement/AC identifiers (if any)</optional>
  <optional>Scenario priority/criticality</optional>
  <optional>Known bugs/risks list</optional>
  <optional>Environment and data constraints</optional>
</input_requirements>

<scope>
  <note>This skill describes how to design test cases; documenting them is optional</note>
  <note>If documentation is still needed, the format can be used as a template</note>
</scope>

<test_design>
  <principles>
    <principle importance="critical">Use Given-When-Then</principle>
    <principle importance="high">Separate positive/negative scenarios</principle>
    <principle importance="high">One case = one check</principle>
    <principle importance="high">Apply equivalence partitioning and boundary values</principle>
    <principle importance="medium">State preconditions and postconditions</principle>
    <principle importance="medium">Separate critical branches into their own cases</principle>
    <principle importance="medium">Separate test data from steps</principle>
  </principles>
</test_design>

<quality_rules>
  <rule importance="critical">Steps are reproducible without interpretation</rule>
  <rule importance="critical">Expected result is verifiable and unambiguous</rule>
  <rule importance="high">No duplicates or overlaps</rule>
  <rule importance="high">Edge cases and validation errors are covered</rule>
  <rule importance="high">Test data and initial state are stated</rule>
  <rule importance="medium">There is a link to the requirement/AC or acceptance criterion</rule>
  <rule importance="medium">Documenting cases is optional, but the check logic must be explicit</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not mix multiple scenarios in one case</item>
  <item importance="high">Do not use vague wording</item>
  <item importance="high">Do not include more than one requirement/AC in one case</item>
  <item importance="high">Do not leave implicit assumptions about data</item>
</do_not>

<examples>
  <good>
    <case>TC-LOGIN-001: Valid login with existing user</case>
    <why>Clear scenario, expected outcome is verifiable</why>
  </good>
  <bad>
    <case>Check login works</case>
    <why>No steps and no expected result</why>
  </bad>
</examples>
