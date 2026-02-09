---
name: testing-browser-manual
description: Manual browser UI verification via MCP snapshots with reproducible steps and observed behavior; not automation design
---

<input_requirements>
  <required>Environment URL and access</required>
  <required>Key user scenarios list</required>
  <required>Success criteria for each scenario</required>
  <optional>Supported browsers and versions</optional>
  <optional>Key resolutions/breakpoints</optional>
  <optional>Test accounts and data</optional>
  <optional>Environment constraints (rate limits, feature flags)</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Verify the environment and build freshness</step>
    <step>Create a new context/page via MCP</step>
    <step>Do the first navigation to start network/console logging</step>
    <step>Fix viewport, language, and locale</step>
    <step>Clear cookies/localStorage when needed</step>
  </steps>
</preparation>

<execution_rules>
  <rule importance="critical">Steps are executed via agent tools and are reproducible</rule>
  <rule importance="critical">Actions are done by snapshot ref, not by screenshot</rule>
  <rule importance="critical">Verify UI and system reactions (errors, states)</rule>
  <rule importance="high">Cover positive and negative scenarios</rule>
  <rule importance="high">Verify accessibility (keyboard navigation, focus, aria)</rule>
  <rule importance="high">Verify responsive behavior at key breakpoints</rule>
  <rule importance="high">Note dependencies on data and state</rule>
  <rule importance="medium">Record regression signals and visual artifacts</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Primary user paths</item>
    <item>Form validation and errors</item>
    <item>Loading states and empty states</item>
    <item>Navigation and routing</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Expected outcome is stated unambiguously</rule>
  <rule importance="high">No duplicate scenarios with different wording</rule>
  <rule importance="high">UI errors and network errors are distinguished and verified separately</rule>
  <rule importance="high">Network/console logs are checked after navigation or actions</rule>
  <rule importance="high">Viewport/browser are recorded in the result</rule>
  <rule importance="medium">If result recording is needed, use a single consistent format</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not test production without permission</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not ignore errors in console and network logs</item>
  <item importance="high">Do not rely on visual match without checking DOM state</item>
</do_not>

<agent_checklist>
  <item importance="critical">Test goal and success criteria are stated</item>
  <item importance="critical">Environment and access are confirmed</item>
  <item importance="high">Start route and session state are defined</item>
  <item importance="high">Viewport/browser/locale are fixed</item>
  <item importance="high">Steps and expected UI states are listed</item>
  <item importance="high">Network/console checks are planned</item>
  <item importance="medium">Test boundaries and exclusions are captured</item>
</agent_checklist>

<example_checks>
  <check>Verify validation error display for an empty required field</check>
  <check>Verify correct handling of 401/403 for an expired session</check>
  <check>Verify keyboard form navigation and visible focus</check>
</example_checks>
