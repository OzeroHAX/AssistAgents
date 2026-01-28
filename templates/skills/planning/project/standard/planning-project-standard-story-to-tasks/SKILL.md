---
name: planning-project-standard-story-to-tasks
description: Create a story file and immediately decompose it into implementable tasks (no sprint planning).
---

<skill_overview>
  <purpose>Convert one story into a focused story doc plus a task list ready for implementation.</purpose>
  <triggers>
    <trigger>You have a story selected and need a concrete execution breakdown</trigger>
    <trigger>User explicitly wants task decomposition (not sprint planning)</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Story doc must be sufficient context for implementation without re-reading the whole PRD.</rule>
  <rule>Tasks must follow planning-project-task-decomposition conventions.</rule>
  <rule>Keep technical notes anchored to ADRs/architecture constraints.</rule>
</rules>

<output_template>
  <template>
  # Story: {story_title}

  ## Context
  - Epic: ...
  - Upstream: PRD.md, architecture.md
  - ADR refs: ...

  ## Objective
  - ...

  ## Scope
  - In: ...
  - Out: ...

  ## Acceptance Criteria
  - Given ..., when ..., then ...

  ## Technical Notes
  - Constraints: ...
  - Suggested approach (optional): ...

  ## Tasks
  - id: T1
    title: ...
    intent: ...
    inputs: ...
    outputs: ...
    done: ...
    depends_on: []
  </template>
</output_template>
