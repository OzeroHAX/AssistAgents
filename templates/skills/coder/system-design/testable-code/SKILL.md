---
name: coder-system-design-testable-code
description: Use when designing or reviewing system architecture for testability, deterministic behavior, dependency seams, and layered test strategy.
---

<when_to_use>
  <trigger>Designing modules, services, or boundaries that must stay easy to test</trigger>
  <trigger>Refactoring legacy code with hidden IO, time, or randomness dependencies</trigger>
  <trigger>Choosing seams and test layers for critical paths or external integrations</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when a narrower architecture, testing, or domain skill is primary.</item>
</when_not_to_use>
<input_requirements>
  <required>Critical business paths and failure modes</required>
  <required>Current test stack and CI constraints</required>
  <required>External dependencies and integration boundaries</required>
  <required>Determinism risks (time, randomness, concurrency, network)</required>
</input_requirements>

<workflow>
  <step>Gather critical paths, integration boundaries, determinism risks, and test constraints.</step>
  <step>Choose seams for IO, time, randomness, and external services, then map test layers.</step>
  <step>Produce a testability summary with seams, layered tests, determinism controls, and risks.</step>
</workflow>

<design_principles>
  <principle priority="P0">Use dependency inversion and dependency injection for replaceable collaborators</principle>
  <principle priority="P0">Create explicit seams at IO, time, random, and external service boundaries</principle>
  <principle priority="P0">Favor deterministic execution in tests with controllable clocks and inputs</principle>
  <principle priority="P1">Prefer fast unit and component tests with targeted integration and contract coverage</principle>
  <principle priority="P1">Use contract tests for service boundaries to prevent integration drift</principle>
  <principle priority="P1">Make failures diagnosable with structured logs and trace correlation</principle>
</design_principles>

<testability_checklist>
  <item>Business logic runs without real infrastructure in core tests</item>
  <item>External calls are abstracted through interfaces or ports</item>
  <item>Tests do not depend on execution order or shared mutable state</item>
</testability_checklist>

<quality_rules>
  <rule importance="critical">No critical change is complete without tests that prove behavior</rule>
  <rule importance="critical">No unstable test should be ignored; quarantine requires owner and timeline</rule>
  <rule importance="high">No hidden dependency should bypass an injection seam on a critical path</rule>
  <rule importance="high">No broad slow test should replace missing fast deterministic tests</rule>
</quality_rules>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">Design decisions are traceable to critical paths, integration boundaries, and determinism risks.</item>
  <item importance="high">The skill stays inside system-design scope and does not drift into planning or runtime test execution.</item>
</validation>
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
  <requirement>Verification plan or evidence and remaining risks</requirement>
</output_requirements>

<references>
  <source url="https://martinfowler.com/bliki/TestPyramid.html">Martin Fowler Test Pyramid</source>
  <source url="https://martinfowler.com/bliki/LegacySeam.html">Legacy Seam</source>
  <source url="https://martinfowler.com/articles/nonDeterminism.html">Eradicating Non-Determinism in Tests</source>
  <source url="https://martinfowler.com/bliki/ContractTest.html">Contract Test</source>
</references>
