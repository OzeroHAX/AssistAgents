---
name: review-code-performance
description: Performance review for changes in critical paths and resource-intensive operations
---

<when_to_use>
  <trigger>Changes in hot paths, DB queries, queues, or processing loops</trigger>
  <trigger>There is a risk of latency, throughput, or cost degradation</trigger>
</when_to_use>

<input_requirements>
  <required>Description of load scenario and critical operations</required>
  <required>PR/diff with changes</required>
  <optional>Baseline metrics before the change</optional>
  <optional>Profiling data, traces, or explain plans</optional>
</input_requirements>

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

<do_not>
  <item importance="critical">Do not do premature micro-optimization outside critical paths</item>
  <item importance="high">Do not claim a perf regression without a reproducible scenario</item>
</do_not>

<output_requirements>
  <requirement>List of perf risks: area, impact, evidence, recommendation</requirement>
  <requirement>Note if separate benchmarking/profiling is needed due to insufficient data</requirement>
</output_requirements>
