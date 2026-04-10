---
name: planning-scope-minimization
description: Use when a bug or incident plan must shrink to the smallest safe fix
---

<purpose>
  <item>Narrow a bug or incident plan to the smallest safe change that fixes the observed behavior.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the task is a bug, regression, or incident and the plan must minimize the change surface.</item>
  <item importance="high">Use when approval depends on explicit non-goals, minimal verification, and a fast rollback path.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use for feature work, preventive cleanup, or broad refactors beyond the observed bug.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<inputs>
  <required>Bug description plus observed vs expected behavior</required>
  <optional>Repro steps, environment, logs, or stacktrace</optional>
  <optional>Incident constraints such as SLA, deadline, or rollback limits</optional>
</inputs>

<workflow>
  <step>State the minimal fixed condition in one sentence tied to the observed behavior.</step>
  <step>Choose the narrowest change point closest to the cause, such as a guard, validation, condition, or isolated logic change.</step>
  <step>List explicit non-goals such as API changes, schema changes, UX redesign, or cleanup not required for the fix.</step>
  <step>Define the smallest regression check set that proves the repro is gone and nearby behavior still works.</step>
  <step>Record the fastest rollback path, such as revert, flag disable, or traffic switch-over.</step>
</workflow>

<output_requirements>
  <requirement>Provide sections named `Fix definition`, `Minimal change surface`, `Explicit non-goals`, `Verification`, and `Rollback fast path`.</requirement>
  <requirement>Keep the change surface focused on the smallest plausible fix and tie it to the observed behavior or repro.</requirement>
  <requirement>Make verification concrete enough to show bug removal and nearby regression coverage.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">The plan keeps the change surface to the smallest safe fix tied to the observed behavior.</rule>
  <rule importance="high">Non-goals and rollback are explicit enough to block scope creep and support fast recovery.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required sections and ties them to the observed behavior, repro, constraints, or rollback limits.</item>
  <item importance="critical">The plan makes the minimal fix, nearby verification set, and rollback path explicit enough for review.</item>
  <item importance="high">Non-goals exclude broader work unless the input provides clear evidence that expansion is required.</item>
</validation>

<do_not>
  <item importance="critical">Do not expand scope beyond what is required to stop the observed bug.</item>
  <item importance="high">Do not hide a broad refactor or cleanup pass inside the fix.</item>
</do_not>
