---
name: coder-system-design-testable-code
description: Testability-first design rules for modular, deterministic, and verifiable systems.
---

<when_to_use>
  <trigger>Designing modules, services, or boundaries that must stay easy to test</trigger>
  <trigger>Refactoring hard-to-test legacy code paths</trigger>
  <trigger>Establishing test strategy for new architecture components</trigger>
</when_to_use>

<input_requirements>
  <required>Critical business paths and failure modes</required>
  <required>Current test stack and CI constraints</required>
  <required>External dependencies and integration boundaries</required>
  <required>Determinism risks (time, randomness, concurrency, network)</required>
</input_requirements>

<design_principles>
  <principle priority="P0">Use dependency inversion and dependency injection for replaceable collaborators</principle>
  <principle priority="P0">Create explicit seams at IO, time, random, and external service boundaries</principle>
  <principle priority="P0">Favor deterministic execution in tests with controllable clocks and inputs</principle>
  <principle priority="P1">Prefer many fast unit and component tests with targeted integration coverage</principle>
  <principle priority="P1">Use contract tests for service boundaries to prevent integration drift</principle>
  <principle priority="P1">Make failures diagnosable with structured test logs and trace correlation</principle>
</design_principles>

<testability_checklist>
  <item>Business logic can run without network or real infrastructure in core tests</item>
  <item>External calls are abstracted through interfaces/ports</item>
  <item>Tests do not depend on execution order or shared mutable state</item>
  <item>Flaky signals are tracked and have explicit remediation ownership</item>
  <item>Boundary contracts are validated in CI before deployment</item>
</testability_checklist>

<quality_rules>
  <rule importance="critical">No critical change is complete without tests that prove behavior</rule>
  <rule importance="critical">No unstable test should be silently ignored; quarantine requires owner and timeline</rule>
  <rule importance="high">No hidden dependency should bypass injection seam on critical path</rule>
  <rule importance="high">No long-running broad test should replace missing fast deterministic tests</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not hardcode infrastructure clients in business logic</item>
  <item importance="high">Do not use sleep-based timing guesses when deterministic sync is possible</item>
  <item importance="high">Do not over-mock internals instead of validating behavior contracts</item>
  <item importance="high">Do not hide flaky failures by indiscriminate retries</item>
</do_not>

<output_requirements>
  <requirement>Design boundaries and seams introduced or validated</requirement>
  <requirement>Test strategy per layer (unit/component/integration/contract)</requirement>
  <requirement>Determinism controls and flaky-risk mitigation</requirement>
  <requirement>Evidence from CI/local checks and remaining risks</requirement>
</output_requirements>

<references>
  <source url="https://martinfowler.com/bliki/TestPyramid.html">Martin Fowler Test Pyramid</source>
  <source url="https://martinfowler.com/articles/practical-test-pyramid.html">Practical Test Pyramid</source>
  <source url="https://martinfowler.com/bliki/LegacySeam.html">Legacy Seam</source>
  <source url="https://martinfowler.com/articles/nonDeterminism.html">Eradicating Non-Determinism in Tests</source>
  <source url="https://martinfowler.com/bliki/ContractTest.html">Contract Test</source>
  <source url="https://docs.pact.io/pact_broker">Pact Broker</source>
  <source url="https://abseil.io/resources/swe-book/html/ch11.html">Software Engineering at Google: Testing Overview</source>
  <source url="https://opentelemetry.io/docs/concepts/instrumentation/">OpenTelemetry Instrumentation</source>
</references>
