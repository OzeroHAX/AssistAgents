---
name: planning-project-fast-mvp-slicing
description: MVP slicing into thin end-to-end vertical slices to get a working result fast and iterate with feedback.
---

<skill_overview>
  <purpose>Define minimal viable scope and implementation order starting with a thin end-to-end path.</purpose>
  <triggers>
    <trigger>User wants a fast prototype / first working version</trigger>
    <trigger>The plan inflates into a large monolith</trigger>
  </triggers>
</skill_overview>

<principles>
  <principle>Start with a vertical slice: input -> processing -> output (even if primitive).</principle>
  <principle>Happy path first, then errors and edge cases.</principle>
  <principle>Prefer "works now" over "perfect later".</principle>
</principles>

<splitting_strategies>
  <strategy>By workflow steps (create -> view -> update -> delete)</strategy>
  <strategy>By roles (user -> admin)</strategy>
  <strategy>By data sources (manual input -> import -> integration)</strategy>
  <strategy>By quality (no optimization first -> speed/polish later)</strategy>
</splitting_strategies>

<anti_patterns>
  <avoid>Starting with infrastructure without a user-visible result ("set up all services" as step 1).</avoid>
  <avoid>Perfectionism and premature optimization.</avoid>
  <avoid>Adding "while we are here" features.</avoid>
</anti_patterns>

<output>
  <deliverable>MVP: 1-3 capabilities that deliver core user value.</deliverable>
  <deliverable>V1+: improvements moved to Parking Lot.</deliverable>
</output>
