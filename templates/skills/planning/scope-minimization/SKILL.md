---
name: planning-scope-minimization
description: Minimize changes for bugs/incidents: the smallest safe fix
---

<purpose>
  <item>Narrow the plan to the minimal change that fixes the bug and reduces regression risk</item>
</purpose>

<inputs>
  <required>Bug description + observed vs expected</required>
  <optional>Repro steps, environment, logs/stacktrace</optional>
  <optional>Criticality (SLA, incident) and deadline</optional>
</inputs>

<method>
  <step>Define the minimal "fixed" criterion (one sentence)</step>
  <step>Find a narrow change point: the layer closest to the cause (guard/validation/condition)</step>
  <step>Ban "nice-to-have improvements": refactor/renames/formatting only if necessary for the fix</step>
  <step>Capture what we explicitly do NOT change (API, schemas, UX, etc.)</step>
  <step>Define a minimal regression verification set around the change point</step>
</method>

<output_format>
  <section>Fix definition (minimal done)</section>
  <section>Minimal change surface</section>
  <section>Explicit non-goals</section>
  <section>Verification</section>
  <section>Rollback fast path</section>
</output_format>

<quality_rules>
  <rule importance="critical">The change is minimal and directly tied to the observed behavior</rule>
  <rule importance="high">There is a fast rollback path (revert/flag/switch-over)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not expand scope beyond the bug</item>
  <item importance="high">Do not do a "big refactor" under the guise of a fix</item>
</do_not>
