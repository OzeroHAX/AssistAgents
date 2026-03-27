---
name: planning-approach-selection
description: "Implementation approach selection: compare options, score against criteria, and justify the decision. Use when choosing between architectural patterns, library alternatives, migration paths, or deployment strategies."
---

<when_to_use>
  <trigger>Choosing between two or more implementation approaches for a feature or system change</trigger>
  <trigger>Selecting an architectural pattern, library, or migration path with trade-offs</trigger>
  <trigger>Stakeholders need a documented rationale for a technical decision</trigger>
</when_to_use>

<input_requirements>
  <required>Goal or requirements the approach must satisfy</required>
  <required>Constraints (timeline, team size, existing tech stack, budget)</required>
  <optional>Risk tolerance and process constraints (release windows, SLAs, compliance)</optional>
</input_requirements>

<method>
  <step>Define 3-6 selection criteria weighted by project context (e.g., risk, speed, cost, maintainability, compatibility, team familiarity)</step>
  <step>Describe 1-3 solution options in 2-4 bullets each, covering architecture, key dependencies, and effort estimate</step>
  <step>Score each option against criteria using a simple matrix (e.g., High/Medium/Low or 1-5)</step>
  <step>Select the option with the best overall fit and explicitly state what is gained and lost</step>
  <step>Document the decision for future reference (link to ADR if the project uses them)</step>
</method>

<example>
  **Criteria:** Risk (weight 3), Speed (weight 2), Maintainability (weight 2)

  | Option | Risk | Speed | Maintainability | Weighted Total |
  |--------|------|-------|-----------------|----------------|
  | A – In-place migration | Low (3) | Med (2) | High (3) | 3×3+2×2+2×3 = 19 |
  | B – Parallel run | Med (2) | Low (1) | High (3) | 3×2+2×1+2×3 = 14 |

  **Decision:** Option A — lower risk and faster delivery outweigh the moderate migration effort.
</example>

<output_format>
  <section>Decision criteria with weights</section>
  <section>Options with brief descriptions</section>
  <section>Comparison matrix</section>
  <section>Chosen approach + rationale</section>
  <section>Trade-offs and accepted risks</section>
</output_format>

<quality_rules>
  <rule importance="critical">The choice is justified by scored criteria, not by subjective preference</rule>
  <rule importance="critical">Trade-offs and accepted risks are stated explicitly</rule>
  <rule importance="high">Each option is described concretely enough to be independently implementable</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not present a single option as a "comparison" — always include at least one alternative</item>
  <item importance="high">Do not omit rejected options; document why they were ruled out</item>
</do_not>
