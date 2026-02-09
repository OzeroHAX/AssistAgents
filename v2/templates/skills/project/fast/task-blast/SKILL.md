---
name: project-fast-task-blast
description: Instant decomposition of proto-spec into implementation-ready project tasks
---

<purpose>
  <item>Transform fast spec into a set of tasks executable without additional analysis</item>
  <item>Preserve consistency: each task must trace back to AC and architecture decisions</item>
</purpose>

<when_to_use>
  <item importance="critical">Immediately after proto-spec, within the same planning iteration</item>
  <item importance="high">When a short, executable MVP backlog is needed</item>
</when_to_use>

<required_preload>
  <item>task-use/creator/decomposition-strategy</item>
  <item>planning-change-inventory</item>
  <item>planning-scope-minimization</item>
  <item>planning-estimation</item>
</required_preload>

<inputs>
  <required>Proto-spec (requirements, AC, architecture constraints, file map)</required>
  <optional>Release priorities and available team capacity</optional>
  <optional>Technical dependencies and implementation sequence</optional>
</inputs>

<method>
  <step>Split requirements into vertical increments (value-first)</step>
  <step>Map each task to AC and concrete codebase changes</step>
  <step>Determine execution order by dependencies and risks</step>
  <step>Add mandatory validation tasks (tests/observability/review)</step>
  <step>Verify each task is independent, testable, and scope-bounded</step>
</method>

<output_format>
  <section>Task list (ordered)</section>
  <section>Task to AC mapping</section>
  <section>Dependencies and sequence</section>
  <section>Definition of done per task</section>
  <section>Scope-cut options (if timebox pressure)</section>
</output_format>

<quality_rules>
  <rule importance="critical">Each task has a verifiable outcome and DoD</rule>
  <rule importance="critical">No tasks without AC linkage or explicit technical necessity</rule>
  <rule importance="high">Execution order accounts for critical dependencies</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not decompose by layers without user value</item>
  <item importance="high">Do not leave large ambiguous tasks without completion criteria</item>
</do_not>
