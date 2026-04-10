---
name: project-fast-task-blast
description: Use when fast planning must convert a verified proto-spec into an ordered implementation-ready MVP backlog before coding starts
---

<purpose>
  <item>Produce one compact task backlog that is ready for immediate implementation handoff.</item>
</purpose>

<when_to_use>
  <item importance="critical">After `project-fast-proto-spec` and before implementation starts when the iteration needs ordered MVP tasks.</item>
  <item importance="high">Use when the backlog must preserve AC traceability, dependency order, DoD, and scope-cut decisions.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use outside the active fast-planning stage or for implementation, delivery execution, or runtime work.</item>
  <item importance="high">Do not use when the proto-spec is still incomplete, or when the real request is standard task-doc authoring under `ai-docs/project/tasks/`.</item>
</when_not_to_use>

<required_preload>
  <item>decomposition-strategy</item>
  <item>planning-change-inventory</item>
  <item>planning-scope-minimization</item>
  <item>planning-estimation</item>
</required_preload>

<input_requirements>
  <required>A verified fast proto-spec with scope, AC, architecture constraints, file-level change map, and planning gate.</required>
  <optional>Delivery constraints or known risks that affect task order or scope cuts.</optional>
  <optional>Existing implementation assumptions that must stay visible in the backlog.</optional>
</input_requirements>

<workflow>
  <step>Inspect the proto-spec for scope, AC, file-level changes, dependencies, risks, and the planning gate.</step>
  <step>If the proto-spec is incomplete or blocked, stop and surface the missing inputs or escalation path instead of inventing tasks.</step>
  <step>Split the scope into value-first, independently testable tasks with AC or technical traceability.</step>
  <step>Order tasks by dependencies and critical path, then add per-task DoD, validation work, and scope-cut notes.</step>
  <step>Produce the final backlog package with explicit implementation handoff or escalation.</step>
</workflow>

<output_requirements>
  <requirement>Produce exactly these sections: Ordered MVP tasks, Task-to-AC mapping, Dependencies and critical path, Per-task DoD, Scope-cut options, Handoff or escalation.</requirement>
  <requirement>Each task includes a concrete outcome, traceability, dependency or sequence notes, and a checkable DoD.</requirement>
  <requirement>If safe decomposition is impossible, return blockers and the next action instead of a speculative backlog.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Do not invent tasks or sequencing without proto-spec evidence or explicit assumptions.</rule>
  <rule importance="critical">Keep tasks narrow, value-oriented, testable, and traceable.</rule>
  <rule importance="high">Keep validation work, critical path, scope cuts, and implementation handoff explicit.</rule>
</quality_rules>

<validation>
  <item importance="critical">The backlog package contains all required sections and every task is traceable to AC or explicit technical necessity from the proto-spec.</item>
  <item importance="critical">Order, per-task DoD, and validation work are explicit enough to start implementation without re-analysis.</item>
  <item importance="high">Any blocker, scope-cut, or escalation path remains visible in the final handoff.</item>
</validation>

<do_not>
  <item importance="critical">Do not decompose by technical layers when a smaller value-first slice is possible.</item>
  <item importance="high">Do not hide blocker conditions by filling the backlog with speculative or unverifiable tasks.</item>
</do_not>
