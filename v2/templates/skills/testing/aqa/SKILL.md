---
name: testing-aqa
description: Automated QA (playwright/selenium/cypress patterns, page object model)
---

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

<do_not>
  <item importance="critical">Do not use sleep instead of state-based waits</item>
  <item importance="high">Do not depend on unstable selectors</item>
  <item importance="high">Do not mix multiple scenarios in one test</item>
  <item importance="high">Do not make tests depend on execution order</item>
  <item importance="high">Do not share mutable state between tests</item>
</do_not>

<example_patterns>
  <pattern>Page Object Model with isolated actions and assertions</pattern>
  <pattern>Fixtures for data and auth</pattern>
  <pattern>Explicit waits for UI state</pattern>
  <pattern>Selectors by role/data-testid/aria</pattern>
</example_patterns>
