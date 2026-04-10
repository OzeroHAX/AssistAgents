---
name: testing-visual-regression
description: Use when a request asks for baseline screenshot comparison to detect visual UI regressions
---

<when_to_use>
  <item importance="critical">Use when a request asks to compare pages, components, or flows against an approved visual baseline.</item>
  <item importance="high">Use when viewport, theme, locale, data, masking, or diff sensitivity must be controlled for reproducible comparison.</item>
</when_to_use>

<input_requirements>
  <required>Target surfaces for visual coverage</required>
  <required>Baseline version and update rules</required>
  <required>Browsers and viewports</required>
  <optional>Dynamic areas to mask</optional>
  <optional>Diff sensitivity threshold</optional>
  <optional>Theme and locale requirements</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use for browser checks where functional behavior matters more than baseline screenshot comparison.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm target surfaces, baseline version, update policy, viewport matrix, theme and locale scope, and data-state controls.</step>
  <step importance="critical">Stabilize rendering by fixing data, disabling animations or auto-updates, and masking dynamic areas when needed.</step>
  <step importance="critical">Capture or compare screenshots against the correct baseline with the agreed diff threshold.</step>
  <step importance="high">Review diffs by surface, separate intended changes from noise, and rerun unstable cases.</step>
  <step importance="high">Record pass-fail, artifact links, changed areas, and any approved baseline update with its reason.</step>
</workflow>

<execution_rules>
  <rule importance="critical">Screenshots are reproducible and deterministic</rule>
  <rule importance="high">Comparison is done against the correct baseline</rule>
  <rule importance="high">Dynamic areas are masked or stabilized</rule>
  <rule importance="high">Changes are confirmed by human review</rule>
  <rule importance="medium">The tool and comparison version are recorded</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Critical screens and user flows</item>
    <item>High-variance UI components</item>
    <item>Tables, forms, charts, and modals</item>
    <item>Different viewports and themes</item>
  </focus>
</coverage>

<output_requirements>
  <requirement importance="critical">Produce a per-surface result with browser, viewport, theme, locale, baseline version, diff status, and artifact link.</requirement>
  <requirement importance="critical">For each changed comparison, record the observed difference, affected area, and whether the baseline should stay or be updated.</requirement>
  <requirement importance="high">When a baseline update is proposed, record the reason, reviewer decision, and masking or stabilization assumptions.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Expected output matches the baseline version</rule>
  <rule importance="high">Diff threshold is documented</rule>
  <rule importance="high">Results include artifact links</rule>
  <rule importance="medium">Reasons for baseline updates are recorded</rule>
</quality_rules>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not update baseline without reviewing changes</item>
  <item importance="high">Do not compare screenshots with unstable data</item>
  <item importance="high">Do not mix locales or themes in one baseline</item>
</do_not>

<example_checks>
  <check>Compare a product card across three viewports with fixed data</check>
</example_checks>
