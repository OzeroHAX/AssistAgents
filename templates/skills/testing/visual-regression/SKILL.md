---
name: testing-visual-regression
description: Visual regression (baseline diffs, UI stabilization)
---

<input_requirements>
  <required>List of pages/components for visual coverage</required>
  <required>Baseline version and update rules</required>
  <required>Browsers and viewports</required>
  <optional>Dynamic areas to mask</optional>
  <optional>Diff sensitivity threshold</optional>
  <optional>Theme/locale requirements</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Stabilize data and state (fixtures/seed)</step>
    <step>Disable animations and auto-updates when needed</step>
    <step>Fix fonts, theme, and locale</step>
    <step>Fix viewport size and scale</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Screenshots are reproducible and deterministic</rule>
  <rule importance="high">Comparison is done against the correct baseline</rule>
  <rule importance="high">Dynamic areas are masked or stabilized</rule>
  <rule importance="high">Changes are confirmed by a human (review)</rule>
  <rule importance="medium">The tool and comparison version are recorded</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Critical screens and user flows</item>
    <item>High-variance UI components</item>
    <item>Tables, forms, charts, modals</item>
    <item>Different viewports and themes</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Expected output and baseline match by version</rule>
  <rule importance="high">Diff threshold is documented</rule>
  <rule importance="high">Results include artifact links</rule>
  <rule importance="medium">Reasons for baseline updates are recorded</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not update baseline without reviewing changes</item>
  <item importance="high">Do not compare screenshots with unstable data</item>
  <item importance="high">Do not mix different locales/themes in one baseline</item>
</do_not>

<example_checks>
  <check>Compare a product card across 3 viewports with fixed data</check>
  <check>Verify visual changes in a modal after an update</check>
</example_checks>
