---
name: review-code-performance
description: Use when reviewing a PR or diff for performance risks in hot paths, DB access, concurrency, or other expensive operations
---

<when_to_use>
  <trigger>Need a performance review for a concrete PR, diff, or code artifact</trigger>
  <trigger>Changes affect hot paths, DB queries, queues, loops, concurrency, or other expensive operations</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete artifact, diff, decision, or document to review.</item>
  <item importance="high">Do not use for broad performance strategy, capacity planning, or general optimization ideation without a concrete change under review.</item>
</when_not_to_use>

<input_requirements>
  <required>Description of load scenario and critical operations</required>
  <required>PR/diff with changes</required>
  <optional>Baseline metrics before the change</optional>
  <optional>Profiling data, traces, or explain plans</optional>
</input_requirements>

<workflow>
  <step>Establish scope from the artifact, load scenario, and latency, throughput, memory, or cost concerns.</step>
  <step>Inspect complexity, I/O, memory, concurrency, caching, and repeated heavy work in the changed paths.</step>
  <step>Separate evidence-backed regressions from plausible risks, and name the missing benchmark, trace, or explain-plan data before treating a weak signal as blocking.</step>
  <step>Keep recommendations proportional and focused on measurable risk reduction.</step>
</workflow>

<core_checks>
  <check priority="P0">Algorithmic complexity: no unjustified growth to O(n^2) or worse</check>
  <check priority="P0">I/O and DB: no N+1, unnecessary round trips, or repeated heavy queries</check>
  <check priority="P1">Memory: no obvious leaks or unbounded collection growth</check>
  <check priority="P1">Concurrency: no unnecessary locks, races, or serialized execution where parallelism is needed</check>
  <check priority="P1">Caching and reuse: heavy computations are not duplicated without reason</check>
  <check priority="P1">Measurability: at least one verification signal exists (metric, benchmark, trace)</check>
</core_checks>

<quality_rules>
  <rule importance="critical">Performance conclusions are based on data, not assumptions</rule>
  <rule importance="high">Concrete mitigations are proposed for significant risks</rule>
  <rule importance="medium">Optimizations without observable benefit are not blockers</rule>
</quality_rules>

<validation>
  <item importance="critical">Each verdict or finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, acceptance conditions, or blocking status are explicit.</item>
  <item importance="high">The review stays within its intended review scope and does not drift into unrelated execution work.</item>
</validation>

<do_not>
  <item importance="critical">Do not demand premature micro-optimization outside critical paths.</item>
  <item importance="high">Do not claim a perf regression without a reproducible scenario or concrete evidence.</item>
</do_not>

<output_requirements>
  <requirement>List performance risks with area, impact, evidence, and recommendation</requirement>
  <requirement>Mark each finding as blocking, acceptance-conditioned, or advisory</requirement>
  <requirement>Note when separate benchmarking or profiling is needed because the available data is insufficient</requirement>
</output_requirements>
