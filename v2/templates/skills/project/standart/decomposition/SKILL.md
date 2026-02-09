---
name: project-standart-decomposition
description: Breaking epics into implementation-ready tasks
---

<purpose>
  <item>Transform epics into tasks that are executable without additional analysis</item>
  <item>Preserve full traceability: task -> epic -> PRD/use-case -> architectural constraints</item>
</purpose>

<when_to_use>
  <item importance="critical">After epic creation, before implementation starts</item>
  <item importance="high">When capacity estimation and a sequential delivery plan are required</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>task-use/creator/decomposition-strategy</item>
  <item>planning-change-inventory</item>
  <item>planning-estimation</item>
  <item>planning-testing-strategy</item>
</required_preload>

<document_target>
  <rule importance="critical">Create/update files in `tasks/{task key}-{task number}-{user friendly name}.md`</rule>
</document_target>

<method>
  <step>Split each epic into independent tasks with a clear outcome</step>
  <step>Define AC, DoD, and validation signals for every task</step>
  <step>Capture dependencies, execution order, and the critical path</step>
  <step>Add required testing/observability/rollback tasks when needed</step>
  <step>Estimate tasks and define scope-cut options under timebox pressure</step>
</method>

<output_format>
  <section>Ordered task list</section>
  <section>Task to epic mapping</section>
  <section>Task AC and DoD</section>
  <section>Dependencies and critical path</section>
  <section>Estimation and scope-cut options</section>
</output_format>

<quality_rules>
  <rule importance="critical">Every task is testable and has a completion criterion</rule>
  <rule importance="critical">No large ambiguous tasks without AC/DoD</rule>
  <rule importance="high">Task order accounts for risks and dependencies</rule>
</quality_rules>
