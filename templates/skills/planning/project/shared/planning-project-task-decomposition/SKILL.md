---
name: planning-project-task-decomposition
description: Decompose a story/requirement into implementable tasks with clear inputs/outputs, dependencies, and done criteria.
---

<skill_overview>
  <purpose>Turn a story into a small, verifiable task list that can be implemented without ambiguity.</purpose>
  <triggers>
    <trigger>You have a story with acceptance criteria but no implementation breakdown</trigger>
    <trigger>User asks "разбей на задачи" / "нужна декомпозиция"</trigger>
    <trigger>You need a safe order of work with dependencies</trigger>
  </triggers>
</skill_overview>

<principles>
  <principle>Prefer vertical slices (end-to-end) over horizontal layers.</principle>
  <principle>Each task should be independently verifiable (yes/no).</principle>
  <principle>Happy path first, then validation/errors, then polish.</principle>
  <principle>Keep tasks small: 30-120 minutes each (guideline).</principle>
</principles>

<rules>
  <rule>Tasks describe intent and observable outcome, not micro-steps.</rule>
  <rule>Each task MUST include a done criteria (binary) and any dependencies.</rule>
  <rule>If a task spans multiple subsystems, split it or create explicit sub-tasks per boundary.</rule>
  <rule>Do not create "infrastructure-first" tasks unless required by the story.</rule>
</rules>

<task_template>
  <template>
  - id: T1
    title: ...
    intent: Why this task exists (1 sentence)
    inputs: What it needs (APIs, config, data, decisions)
    outputs: What it produces (code paths, docs, artifacts)
    done: A binary check (how we know it is done)
    depends_on: []
    risks: []
  </template>
</task_template>

<anti_patterns>
  <avoid>"Refactor everything" tasks (too broad)</avoid>
  <avoid>Tasks without a done check</avoid>
  <avoid>Tasks that only say "implement X" without specifying behavior</avoid>
  <avoid>Premature optimization tasks</avoid>
</anti_patterns>
