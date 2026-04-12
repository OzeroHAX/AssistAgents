---
name: testing-aqa
description: Use for designing or maintaining automated UI/API tests, stability work, and CI test artifacts; not one-off manual checks
---

<when_to_use>
  <item importance="critical">Use when a request asks to add or maintain automated UI, API, or integration tests for concrete product scenarios.</item>
  <item importance="high">Use when flaky automated tests, selectors, fixtures, retries, or failure artifacts need stabilization.</item>
  <item importance="high">Use when reusable autotest structure, data strategy, or CI evidence collection must be defined.</item>
</when_to_use>

<input_requirements>
  <required>Autotest goal and scenarios</required>
  <required>Environment and access</required>
  <required>Selected framework and versions</required>
  <required>Test data and cleanup strategy</required>
  <optional>Data and fixtures</optional>
  <optional>Stability requirements (flake rate)</optional>
  <optional>Artifacts requirements (screenshots/video/trace)</optional>
  <optional>Retry rules (if allowed)</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for one-off manual checks.</item>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm scenarios, environment and access, framework versions, data setup/cleanup, and required failure artifacts.</step>
  <step importance="critical">Choose the test level per scenario and keep UI, API, and integration scopes separate when practical.</step>
  <step importance="critical">Design isolated tests with stable selectors or contracts, state-based waits, deterministic assertions, and clear pass criteria.</step>
  <step importance="high">Define fixtures, cleanup, retries, and failure capture so failures stay local and reruns stay reproducible.</step>
  <step importance="high">Produce the test change or test design with coverage, execution assumptions, and remaining stability risks.</step>
</workflow>

<design_rules>
  <rule importance="critical">Tests are independent and isolated</rule>
  <rule importance="critical">Each test has a clear success criterion</rule>
  <rule importance="high">Use stable selectors and patterns</rule>
  <rule importance="high">Assert business-meaningful states, not implementation details</rule>
  <rule importance="high">Minimize duplication via POM/fixtures</rule>
  <rule importance="high">Parameterize checks for variable data</rule>
  <rule importance="medium">Separate UI, API, and integration tests</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">Tests are deterministic and repeatable</rule>
  <rule importance="high">Failures are localized (clear failure reason)</rule>
  <rule importance="high">Flakes are fixed, not masked</rule>
  <rule importance="high">Collect artifacts on failure (screenshot/video/trace)</rule>
  <rule importance="medium">Tests should be fast and parallelizable</rule>
  <rule importance="medium">Retries are limited and documented</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Critical user paths</item>
    <item>Authorization and access control</item>
    <item>Core CRUD operations</item>
    <item>Errors and validation</item>
  </focus>
</coverage>

<output_requirements>
  <requirement importance="critical">Produce test changes, scenario designs, or review guidance grouped by scenario and test level with explicit expected results.</requirement>
  <requirement importance="critical">State selector or contract strategy, data or fixture usage, cleanup assumptions, and failure artifacts.</requirement>
  <requirement importance="high">Call out retries, flake risks, environment limits, and open gaps that block reliable execution.</requirement>
</output_requirements>

<do_not>
  <item importance="critical">Do not use sleep instead of state-based waits</item>
  <item importance="high">Do not depend on unstable selectors</item>
  <item importance="high">Do not mix multiple scenarios in one test</item>
  <item importance="high">Do not make tests depend on execution order</item>
  <item importance="high">Do not share mutable state between tests</item>
</do_not>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<example_patterns>
  <pattern>Page Object Model with isolated actions and assertions</pattern>
  <pattern>Fixtures for data and auth</pattern>
  <pattern>Explicit waits for UI state</pattern>
  <pattern>Selectors by role/data-testid/aria</pattern>
</example_patterns>
