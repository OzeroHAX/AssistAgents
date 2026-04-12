---
name: testing-browser-manual
description: Use when a request asks for manual browser UI verification via MCP snapshots with reproducible evidence
---

<when_to_use>
  <item importance="critical">Use when a request asks to manually verify a browser page, component, or flow through MCP snapshots and observed behavior.</item>
  <item importance="high">Use when the check must cover UI states, validation, navigation, logs, accessibility basics, or responsive behavior with reproducible evidence.</item>
</when_to_use>

<input_requirements>
  <required>Target page, component, or flow</required>
  <required>Environment URL and access</required>
  <required>Key scenarios</required>
  <required>Success criteria per scenario</required>
  <optional>Supported browsers and versions</optional>
  <optional>Key viewports/breakpoints</optional>
  <optional>Test accounts, data, or environment constraints</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for automation design or test framework implementation.</item>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use for screenshot-only comparison without DOM, console, or network checks.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm the target surface, scenarios, success criteria, environment access, browser/viewport/locale, and starting session or data state.</step>
  <step importance="critical">Prepare a clean MCP browser context, do the first navigation, and start console/network observation from the initial state.</step>
  <step importance="critical">Execute each scenario via snapshot-referenced actions and verify expected UI states, form behavior, routing, and system reactions after key steps.</step>
  <step importance="high">Cover positive and negative paths; check keyboard, focus, ARIA basics, and responsive behavior when relevant.</step>
  <step importance="high">Record pass-fail, observed vs expected behavior, evidence, and state or data dependencies for each scenario.</step>
</workflow>

<coverage>
  <focus>
    <item>Primary user paths</item>
    <item>Form validation and errors</item>
    <item>Loading and empty states</item>
    <item>Navigation and routing</item>
  </focus>
</coverage>

<output_requirements>
  <requirement importance="critical">Produce a per-scenario result with target surface, environment, browser, viewport, locale, and pass-fail status.</requirement>
  <requirement importance="critical">For each failed or risky check, record observed behavior, expected behavior, reproduction step, and snapshot, console, or network evidence.</requirement>
  <requirement importance="high">Separate UI defects from network, auth, session, or backend-response issues when they differ.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Expected outcome is stated unambiguously</rule>
  <rule importance="high">No duplicate scenarios with different wording</rule>
  <rule importance="high">UI errors and network errors are distinguished and verified separately</rule>
  <rule importance="high">Console and network logs are checked after navigation or relevant actions</rule>
</quality_rules>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not test production without permission</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not ignore errors in console and network logs</item>
  <item importance="high">Do not rely on visual match without checking DOM state</item>
</do_not>
