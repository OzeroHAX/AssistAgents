---
name: testing-a11y
description: Use for manual UI accessibility verification of concrete scenarios with keyboard and screen-reader evidence
---

<when_to_use>
  <item importance="critical">Use when a request asks to manually verify page, component, or flow accessibility against a stated standard or concrete user scenarios.</item>
  <item importance="high">Use when keyboard, focus, semantics, announcements, contrast, or screen-reader behavior must be checked with observed evidence.</item>
</when_to_use>

<input_requirements>
  <required>Target page, component, or flow under test</required>
  <required>Target accessibility standard (e.g., WCAG 2.1 AA)</required>
  <required>Key user scenarios</required>
  <required>Supported browsers and platforms</required>
  <optional>Screen reader list and versions</optional>
  <optional>High-risk components/pages (forms, modals)</optional>
  <optional>Relevant test data, accounts, or environment constraints</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use for scanner-only accessibility review without scenario execution.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm the target surface, accessibility standard, user scenarios, browser/platform matrix, and screen-reader scope.</step>
  <step importance="critical">Define the expected accessible behavior for each scenario and high-risk surface.</step>
  <step importance="critical">Execute each scenario with keyboard-only interaction first and verify visible focus, logical order, and absence of focus traps.</step>
  <step importance="high">Verify role/name/state, form errors, announcements, dynamic updates, contrast, and text readability; use automated scanners only as supplemental evidence.</step>
  <step importance="high">Record observed behavior, pass-fail, evidence, and WCAG-related deviations with severity and user impact.</step>
</workflow>

<coverage>
  <focus>
    <item>Navigation and primary routes</item>
    <item>Forms, errors, and hints</item>
    <item>Dialogs, modals, focus management</item>
    <item>Tables and complex components</item>
    <item>Dynamic content and notifications</item>
    <item>Media content and alternative text</item>
  </focus>
</coverage>

<output_requirements>
  <requirement importance="critical">Produce a per-scenario result with the target surface, scenario, environment, browser/platform, accessibility standard, and pass-fail status.</requirement>
  <requirement importance="critical">For each failed or risky check, record observed behavior, expected accessible behavior, affected user impact, and evidence.</requirement>
  <requirement importance="high">Separate keyboard, screen-reader, semantic, form/error, contrast, and dynamic-content findings when they apply.</requirement>
  <requirement importance="high">When claiming a deviation, note the relevant WCAG criterion or accessibility rule when it is known.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Expected outcome is unambiguous and verifiable</rule>
  <rule importance="high">Screen reader, browser, and platform are stated</rule>
  <rule importance="high">Results describe observed behavior, not interpretation alone</rule>
  <rule importance="medium">WCAG deviations and their severity are noted</rule>
</quality_rules>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not rely on automated scanners only</item>
  <item importance="high">Do not mark a scenario as passed without keyboard verification</item>
  <item importance="high">Do not ignore focus and announcements issues</item>
</do_not>

<example_checks>
  <check>Verify form navigation with Tab/Shift+Tab</check>
  <check>Verify error announcements for invalid input</check>
  <check>Verify focus handling when a modal opens and closes</check>
  <check>Verify text contrast on key screens</check>
</example_checks>
