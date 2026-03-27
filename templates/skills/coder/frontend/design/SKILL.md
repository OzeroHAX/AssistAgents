---
name: coder-frontend-design
description: "Frontend design system practices: define and audit tokens, typography, color roles, layout grids, and component states for consistency and accessibility. Use when creating a new design system, onboarding a component library, or reviewing UI consistency across a web application."
---

<when_to_use>
  <trigger>Creating or updating a design system for web UI</trigger>
  <trigger>Defining visual foundations (tokens, scales, grids) before implementation</trigger>
  <trigger>Aligning design decisions between design and engineering teams</trigger>
  <trigger>Reviewing UI consistency and scalability risks in an existing codebase</trigger>
</when_to_use>

<input_requirements>
  <required>Product context and target platforms (web, mobile web, desktop web)</required>
  <required>Brand constraints (colors, typography, tone)</required>
  <required>Accessibility target (e.g., WCAG 2.2 AA)</required>
  <optional>Existing design system or UI kit</optional>
  <optional>Current component library and theming model</optional>
</input_requirements>

<method>
  <step>Audit existing codebase for hardcoded visual values: `grep -rn "color:\s*#\|font-size:\s*[0-9]" src/` — each hit is a candidate for tokenization</step>
  <step>Define primitive tokens from brand constraints (colors, font families, base spacing unit)</step>
  <step>Map primitives to semantic tokens (surface, text, accent, status roles) and component tokens</step>
  <step>Build type scale and spacing scale from the base unit (e.g., 4px base → 4, 8, 12, 16, 24, 32, 48)</step>
  <step>Define responsive grid: container widths, column counts, gutters, and breakpoints</step>
  <step>Specify component states for all interactive elements: default, hover, focus, active, disabled, loading, error</step>
  <step>Validate: run contrast checks (e.g., `npx wcag-contrast #3b82f6 #ffffff` → ratio ≥ 4.5:1 for AA normal text), verify token coverage, confirm no raw values remain in components</step>
  <step>Document: token inventory, component anatomy, and migration notes for existing components</step>
</method>

<example>
  **Token layering:**
  ```css
  /* Primitive */   --color-blue-500: #3b82f6;
  /* Semantic */    --color-action-primary: var(--color-blue-500);
  /* Component */   --button-bg: var(--color-action-primary);
  ```
  Changing the brand primary blue requires updating only `--color-blue-500`; all buttons, links, and CTAs inherit automatically.

  **Spacing scale (4px base):**
  ```css
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;
  ```

  **Contrast validation:** `#3b82f6` on `#ffffff` → ratio 4.7:1 → passes AA normal text (≥4.5:1).
</example>

<quality_rules>
  <rule importance="critical">Every visual rule is testable in design or implementation review</rule>
  <rule importance="critical">System-level changes include migration impact for existing components</rule>
  <rule importance="high">Design decisions are traceable to tokens and component contracts</rule>
  <rule importance="high">Exceptions are documented with scope and expiration criteria</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not hardcode colors, spacing, or typography in feature-level UI code</item>
  <item importance="high">Do not introduce new variants before checking existing system patterns</item>
  <item importance="high">Do not approve components without focus and disabled states</item>
  <item importance="medium">Do not overload the token set with near-duplicate values</item>
</do_not>

<output_requirements>
  <requirement>Token inventory (color, typography, spacing, radius, elevation, motion)</requirement>
  <requirement>Component patterns and required states</requirement>
  <requirement>Known risks, consistency trade-offs, and migration notes</requirement>
  <requirement>References to standards used (WCAG, Material, etc.)</requirement>
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
