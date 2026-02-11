---
name: coder-frontend-design
description: Frontend design system practices: tokens, typography, color, layout, and component consistency.
---

<when_to_use>
  <trigger>Creating or updating a design system for web UI</trigger>
  <trigger>Defining visual foundations before implementation</trigger>
  <trigger>Aligning design decisions between design and engineering</trigger>
  <trigger>Reviewing UI consistency and scalability risks</trigger>
</when_to_use>

<input_requirements>
  <required>Product context and target platforms (web/mobile web/desktop web)</required>
  <required>Brand constraints (colors, typography, tone)</required>
  <required>Accessibility target (e.g., WCAG 2.2 AA)</required>
  <optional>Existing design system or UI kit</optional>
  <optional>Current component library and theming model</optional>
</input_requirements>

<core_principles>
  <principle priority="P0">Use design tokens as the single source of truth; avoid hardcoded visual values in components</principle>
  <principle priority="P0">Structure tokens by layers: primitive, semantic, and component-level</principle>
  <principle priority="P0">Model color as semantic roles (surface, text, accent, status) instead of standalone palette usage</principle>
  <principle priority="P0">Meet required contrast ratios for text and key UI elements</principle>
  <principle priority="P1">Use a consistent type scale and spacing scale for hierarchy and rhythm</principle>
  <principle priority="P1">Use responsive grid rules and explicit breakpoints/window classes; do not design for fixed devices only</principle>
  <principle priority="P1">Define component variants and states (default, hover, focus, active, disabled, loading)</principle>
  <principle priority="P1">Keep component APIs minimal and reusable; avoid one-off visual patterns without system value</principle>
  <principle priority="P2">Document handoff artifacts: token mapping, component anatomy, and edge-case behavior</principle>
</core_principles>

<checklist>
  <item>Token inventory exists and covers color, typography, spacing, radius, elevation, motion</item>
  <item>Semantic tokens are mapped to UI roles and component parts</item>
  <item>Typography rules include font sizes, line-height, and usage contexts</item>
  <item>Layout rules define container widths, columns, gutters, and responsive behavior</item>
  <item>Interactive states are specified for all actionable components</item>
  <item>Dark/light or themed variants use tokens, not duplicated raw values</item>
</checklist>

<quality_rules>
  <rule importance="critical">Every visual rule is testable in design or implementation review</rule>
  <rule importance="critical">System-level changes include migration impact for existing components</rule>
  <rule importance="high">Design decisions are traceable to tokens and component contracts</rule>
  <rule importance="high">Exceptions are documented with scope and expiration criteria</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not hardcode colors, spacing, or typography in feature-level UI</item>
  <item importance="high">Do not introduce new variants before checking existing system patterns</item>
  <item importance="high">Do not approve components without focus and disabled states</item>
  <item importance="medium">Do not overload the token set with near-duplicate values</item>
</do_not>

<output_requirements>
  <requirement>List chosen foundations (tokens, typography, color roles, layout rules)</requirement>
  <requirement>List component patterns and required states</requirement>
  <requirement>List known risks and consistency trade-offs</requirement>
  <requirement>Provide references to standards and system guidance used</requirement>
</output_requirements>

<references>
  <source url="https://www.designtokens.org/TR/drafts/">Design Tokens Community Group</source>
  <source url="https://www.w3.org/TR/WCAG22/">WCAG 2.2</source>
  <source url="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">WCAG Contrast Minimum</source>
  <source url="https://m3.material.io/styles/color/roles">Material Design Color Roles</source>
  <source url="https://m3.material.io/styles/typography/overview">Material Design Typography</source>
  <source url="https://designsystem.digital.gov/design-tokens/">USWDS Design Tokens</source>
  <source url="https://atlassian.design/foundations">Atlassian Foundations</source>
  <source url="https://web.dev/responsive-web-design-basics/">web.dev Responsive Web Design Basics</source>
</references>
