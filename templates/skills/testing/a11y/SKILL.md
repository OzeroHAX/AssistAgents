---
name: testing-a11y
description: Accessibility testing (WCAG, keyboard, screen reader)
---

<input_requirements>
  <required>Target accessibility standard (e.g., WCAG 2.1 AA)</required>
  <required>Key user scenarios</required>
  <required>Supported browsers and platforms</required>
  <optional>Screen reader list and versions</optional>
  <optional>High-risk components/pages (forms, modals)</optional>
</input_requirements>

<execution_rules>
  <rule importance="critical">Verify the full scenario using keyboard only</rule>
  <rule importance="critical">Focus is visible, order is logical, no focus traps</rule>
  <rule importance="high">Verify role/name/state for interactive elements</rule>
  <rule importance="high">Verify form errors and screen-reader announcements</rule>
  <rule importance="high">Verify contrast and text readability</rule>
  <rule importance="medium">Use automated scanners as a supplement</rule>
</execution_rules>

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

<quality_rules>
  <rule importance="critical">Expected outcome is unambiguous and verifiable</rule>
  <rule importance="high">Screen reader, browser, and platform are stated</rule>
  <rule importance="high">Results describe actual behavior, not interpretations</rule>
  <rule importance="medium">WCAG deviations and their severity are noted</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not rely on automated scanners only</item>
  <item importance="high">Do not mark a scenario as passed without keyboard verification</item>
  <item importance="high">Do not ignore focus and announcements issues</item>
</do_not>

<example_checks>
  <check>Verify form navigation with Tab/Shift+Tab</check>
  <check>Verify error announcements for invalid input</check>
  <check>Verify text contrast on key screens</check>
</example_checks>
