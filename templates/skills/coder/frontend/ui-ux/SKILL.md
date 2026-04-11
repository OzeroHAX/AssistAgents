---
name: coder-frontend-ui-ux
description: Use when defining or reviewing frontend UI/UX behavior for user-facing journeys: flows, states, accessibility, forms, and perceived performance.
---

<when_to_use>
  <trigger>Shaping or reviewing frontend user flows and screen behavior</trigger>
  <trigger>Defining interaction states, accessibility behavior, and recovery paths for key journeys</trigger>
  <trigger>Improving form UX, empty/loading/error states, and perceived responsiveness</trigger>
  <trigger>Reviewing UX regressions in delivered frontend features</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when the task is mainly design-system foundations, implementation details, or automated testing; use a narrower skill instead.</item>
</when_not_to_use>

<input_requirements>
  <required>Main user goals and primary scenarios</required>
  <required>Constraints (device contexts, browser support, locale)</required>
  <required>Accessibility target (e.g., WCAG 2.2 AA)</required>
  <required>Success criteria (task completion, errors, latency perception)</required>
  <optional>Research artifacts (journey map, usability findings, support tickets)</optional>
</input_requirements>

<workflow>
  <step>Identify the primary journeys, constraints, and success criteria before discussing UI polish.</step>
  <step>Map the happy path plus loading, empty, error, and recovery paths for each critical flow.</step>
  <step>Specify interaction states and accessibility behavior for key controls: keyboard access, visible focus, semantics, and target size.</step>
  <step>Define form behavior, validation, error recovery, and value preservation after failed submissions.</step>
  <step>Produce a concrete UX requirements checklist with accessibility and responsiveness checks, backed by relevant standards.</step>
</workflow>

<core_principles>
  <principle priority="P0">Prioritize understandable, recoverable core flows before visual polish.</principle>
  <principle priority="P0">Keep system status visible for significant actions and delays.</principle>
  <principle priority="P1">Make empty, loading, and error states contextual and actionable.</principle>
  <principle priority="P1">Use clear labels and progressive disclosure to reduce cognitive load.</principle>
</core_principles>

<validation>
  <item importance="critical">Primary flows, state coverage, accessibility constraints, and recovery behavior are explicit.</item>
  <item importance="critical">Recommendations are testable in prototypes, implementation review, or inspected artifacts.</item>
  <item importance="high">The skill stays inside frontend UI/UX scope and does not drift into design-system foundations, implementation, planning, or runtime testing.</item>
</validation>

<do_not>
  <item importance="critical">Do not hide focus indicators or rely on pointer-only interaction.</item>
  <item importance="high">Do not ship forms with ambiguous errors or discard entered values after failure.</item>
  <item importance="high">Do not leave delayed, empty, or error states without context and next action.</item>
</do_not>

<output_requirements>
  <requirement>List primary flows and the critical states for each flow.</requirement>
  <requirement>List required accessibility constraints and interaction-state expectations.</requirement>
  <requirement>List form behavior, validation, and recovery rules.</requirement>
  <requirement>List perceived-performance checks and the standards or guidance used.</requirement>
</output_requirements>

<references>
  <source url="https://www.w3.org/TR/WCAG22/">WCAG 2.2</source>
  <source url="https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html">WCAG Focus Not Obscured</source>
  <source url="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html">WCAG Target Size Minimum</source>
  <source url="https://www.w3.org/WAI/tutorials/forms/">WAI Forms Tutorial</source>
  <source url="https://www.nngroup.com/articles/user-journeys-vs-user-flows/">NN/g Journeys vs Flows</source>
  <source url="https://web.dev/inp/">web.dev INP</source>
</references>
