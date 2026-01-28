---
name: planning-project-standard-implementation-readiness-lite
description: Light gate to ensure PRD, architecture, stories, and tasks are coherent before implementation (no sprint rituals).
---

<skill_overview>
  <purpose>Catch gaps early: missing requirements, conflicting decisions, untestable criteria, or tasks that don't cover scope.</purpose>
  <triggers>
    <trigger>You completed PRD + architecture + epics/stories and prepared tasks</trigger>
    <trigger>Risk of building the wrong thing is high</trigger>
  </triggers>
</skill_overview>

<checks>
  <check>PRD exists and has explicit scope + success metric.</check>
  <check>Architecture captures key decisions and constraints (ADRs when needed).</check>
  <check>Each story maps to PRD FRs/NFRs (no orphan stories).</check>
  <check>Each story has testable acceptance criteria (Given/When/Then or equivalent).</check>
  <check>Task list covers acceptance criteria (no missing work) and is ordered by dependencies.</check>
  <check>Major risks have mitigation or explicit deferral.</check>
</checks>

<output>
  <format>
    <template>
    Decision: PASS|CONCERNS|FAIL
    - PASS: proceed
    - CONCERNS: proceed but fix listed gaps first
    - FAIL: rework planning artifacts
    </template>
  </format>
</output>
