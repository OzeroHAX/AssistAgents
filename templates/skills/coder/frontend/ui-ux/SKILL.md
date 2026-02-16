---
name: coder-frontend-ui-ux
description: Frontend UI/UX practices: flows, interaction states, accessibility-first UX, forms, and perceived performance.
---

<when_to_use>
  <trigger>Designing or refining user flows and screen behavior</trigger>
  <trigger>Improving usability, accessibility, and interaction quality</trigger>
  <trigger>Defining loading/error/empty states for key journeys</trigger>
  <trigger>Reviewing UX regressions in feature delivery</trigger>
</when_to_use>

<input_requirements>
  <required>Main user goals and top scenarios</required>
  <required>Constraints (device contexts, browser support, locale)</required>
  <required>Accessibility target (e.g., WCAG 2.2 AA)</required>
  <required>Success criteria (task completion, errors, latency perception)</required>
  <optional>Research artifacts (journey map, usability findings, support tickets)</optional>
</input_requirements>

<core_principles>
  <principle priority="P0">Define and validate user flows for core tasks before polishing visuals</principle>
  <principle priority="P0">Preserve visibility of system status for all significant user actions</principle>
  <principle priority="P0">Design interaction states explicitly: default, hover, focus, active, disabled, loading, error, empty, success</principle>
  <principle priority="P0">Apply accessibility-first UX: keyboard-first navigation, visible focus, semantic controls, sufficient target size</principle>
  <principle priority="P1">Use clear information architecture and labels to reduce cognitive load</principle>
  <principle priority="P1">Design forms for completion: clear labels, inline validation, actionable errors, value preservation on failure</principle>
  <principle priority="P1">Use progressive disclosure for complex tasks and long forms</principle>
  <principle priority="P1">Define empty states with context and next action; avoid dead-end screens</principle>
  <principle priority="P1">Use loading feedback that matches operation type (indeterminate vs determinate)</principle>
  <principle priority="P2">Optimize perceived performance through responsive interactions and reduced input latency</principle>
</core_principles>

<heuristics>
  <item>Match between system and real-world language</item>
  <item>User control and freedom (undo/back/escape paths)</item>
  <item>Consistency and standards across routes/components</item>
  <item>Error prevention before error messaging</item>
  <item>Recognition over recall in navigation and forms</item>
</heuristics>

<checklist>
  <item>Critical journeys are documented with happy path and edge paths</item>
  <item>All interactive components include full state definitions</item>
  <item>Keyboard navigation works for primary scenarios end-to-end</item>
  <item>Focus is visible and never obscured by sticky/overlay UI</item>
  <item>Forms provide clear validation and recovery guidance</item>
  <item>Empty/loading/error states are intentional and actionable</item>
  <item>Interaction delays are visible and do not feel frozen</item>
</checklist>

<quality_rules>
  <rule importance="critical">UX requirements are testable as behavior, not as visual preference</rule>
  <rule importance="critical">Accessibility blockers in core flows are release blockers</rule>
  <rule importance="high">Each major flow has at least one measurable success indicator</rule>
  <rule importance="high">Error states include a concrete recovery path</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not hide focus indicators or rely on pointer-only interaction</item>
  <item importance="high">Do not ship forms with ambiguous errors or cleared input after failure</item>
  <item importance="high">Do not leave loading states without progress or contextual feedback</item>
  <item importance="medium">Do not create empty states without explanation and next action</item>
</do_not>

<output_requirements>
  <requirement>List primary user flows and critical interaction points</requirement>
  <requirement>List required interaction states and accessibility constraints</requirement>
  <requirement>List form UX and error-recovery rules</requirement>
  <requirement>List perceived-performance and responsiveness checks</requirement>
  <requirement>Provide references to standards and UX guidance used</requirement>
</output_requirements>

<references>
  <source url="https://www.w3.org/TR/WCAG22/">WCAG 2.2</source>
  <source url="https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html">WCAG Focus Not Obscured</source>
  <source url="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html">WCAG Target Size Minimum</source>
  <source url="https://www.w3.org/WAI/tutorials/forms/">WAI Forms Tutorial</source>
  <source url="https://www.nngroup.com/articles/ten-usability-heuristics/">Nielsen Usability Heuristics</source>
  <source url="https://www.nngroup.com/articles/user-journeys-vs-user-flows/">NN/g Journeys vs Flows</source>
  <source url="https://web.dev/inp/">web.dev INP</source>
  <source url="https://m3.material.io/foundations/interaction/states/overview">Material Interaction States</source>
  <source url="https://atlassian.design/components">Atlassian Components</source>
</references>
