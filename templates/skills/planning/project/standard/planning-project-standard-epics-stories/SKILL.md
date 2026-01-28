---
name: planning-project-standard-epics-stories
description: Break PRD + architecture constraints into epics and well-scoped stories with priorities and dependencies.
---

<skill_overview>
  <purpose>Produce implementable slices: epics and stories that can be independently built and verified.</purpose>
  <triggers>
    <trigger>PRD + architecture exist and you need a delivery breakdown</trigger>
    <trigger>User asks to split into epics/stories before task breakdown</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Stories should fit in 2-8 hours of effort (guideline); otherwise split.</rule>
  <rule>Every story has 1-3 acceptance criteria (Given/When/Then preferred).</rule>
  <rule>Assign priority (P0/P1/P2/P3) and explicit dependencies.</rule>
  <rule>Reference relevant ADRs/constraints when they affect implementation.</rule>
</rules>

<epic_file_template>
  <template>
  # Epic: {epic_name}

  ## Objective
  - ...

  ## Scope
  - In: ...
  - Out: ...

  ## Stories
  ### {story_slug}
  - Title: ...
  - Priority: P0|P1|P2|P3
  - Dependencies: ...
  - Acceptance criteria:
    - Given ..., when ..., then ...
  - Notes / ADR refs: ...
  </template>
</epic_file_template>
