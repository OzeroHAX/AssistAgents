---
name: coder-system-design-perf-patterns
description: Use when choosing or reviewing system-level performance patterns under latency, throughput, scaling, or cost pressure.
---

<when_to_use>
  <trigger>Designing architecture under latency, throughput, or cost pressure</trigger>
  <trigger>Planning scaling strategy for growth or traffic spikes</trigger>
  <trigger>Reviewing performance bottlenecks and reliability tradeoffs</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when a narrower review, testing, or domain-specific skill is the better fit.</item>
</when_not_to_use>
<input_requirements>
  <required>Current bottleneck description and baseline metrics</required>
  <required>Target SLO/SLI and error budget constraints</required>
  <required>Traffic profile (steady, bursty, hot keys, read/write ratio)</required>
  <required>Operational constraints (cost, team capacity, infra limits)</required>
</input_requirements>

<workflow>
  <step>Gather baseline metrics, SLO or error-budget targets, traffic shape, and operational constraints, then identify the measured bottleneck and saturation signal.</step>
  <step>Choose the smallest pattern set that relieves it, and state latency, consistency, cost, and operational tradeoffs.</step>
  <step>Define expected SLI gain, observability guardrails, overload behavior, and rollout or rollback checks before recommending implementation.</step>
</workflow>

<pattern_catalog>
  <pattern>Cache-aside for read-heavy paths with tolerated staleness</pattern>
  <pattern>Queue-based load leveling for burst absorption</pattern>
  <pattern>Async processing for long-running tasks and user-facing responsiveness</pattern>
  <pattern>Batching to reduce per-operation overhead and network chatter</pattern>
  <pattern>Load shedding to protect core goodput under overload</pattern>
  <pattern>Horizontal scaling with autoscaling tied to meaningful saturation metrics</pattern>
  <pattern>Hotspot mitigation via key design and partition distribution</pattern>
</pattern_catalog>

<selection_rules>
  <rule importance="critical">Choose patterns from measured bottlenecks, not preference</rule>
  <rule importance="high">Define expected gain and rollback trigger before rollout</rule>
  <rule importance="high">Account for consistency, cost, and ops complexity tradeoffs</rule>
  <rule importance="high">Keep observability and SLO guardrails in same design package</rule>
</selection_rules>

<tradeoff_matrix>
  <item>Caching: lower latency, possible staleness and invalidation complexity</item>
  <item>Queues and async: smooth peaks, eventual consistency and replay complexity</item>
  <item>Batching: higher throughput, partial failure handling complexity</item>
  <item>Load shedding: preserves core capacity, intentional selective failures</item>
  <item>Horizontal scaling: capacity gain, bottleneck may shift to shared dependency</item>
</tradeoff_matrix>

<do_not>
  <item importance="critical">Do not scale on vanity metrics unrelated to user SLI</item>
  <item importance="high">Do not use unbounded retries/queues under overload</item>
  <item importance="high">Do not evaluate performance on averages only; include tail latency</item>
  <item importance="high">Do not ship performance changes without capacity and rollback plan</item>
</do_not>

<output_requirements>
  <requirement>Chosen pattern(s) with why-now rationale</requirement>
  <requirement>Expected SLI impact and acceptance thresholds</requirement>
  <requirement>Operational tradeoffs and failure modes</requirement>
  <requirement>Rollout, monitoring, and rollback plan</requirement>
</output_requirements>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">Decisions are traceable to measured bottlenecks, SLOs, and rollout guardrails, and verifiable from the summary or inspected artifacts.</item>
  <item importance="high">The skill stays inside its coding/design scope and does not drift into unrelated planning or review work.</item>
</validation>
<references>
  <source url="https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/">AWS Builders Library: Load Shedding</source>
  <source url="https://sre.google/sre-book/service-level-objectives/">Google SRE: Service Level Objectives</source>
  <source url="https://sre.google/workbook/alerting-on-slos/">Google SRE Workbook: Alerting on SLOs</source>
  <source url="https://sre.google/sre-book/addressing-cascading-failures/">Google SRE: Cascading Failures</source>
  <source url="https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling">Azure Queue-Based Load Leveling</source>
  <source url="https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/">Kubernetes HPA</source>
  <source url="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html">DynamoDB Partition Key Design</source>
</references>
