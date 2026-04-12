---
name: testing-load
description: Use when the user needs load, stress, spike, or soak test design with realistic traffic profiles, thresholds, and reproducible evidence
---

<when_to_use>
  <item importance="critical">Use for load, stress, spike, or soak test design or review for a service, API, or critical user flow.</item>
  <item importance="high">Use when the request needs realistic traffic distribution, thresholds, or safe execution rules for k6, JMeter, or similar tools.</item>
  <item importance="high">Use when success depends on reproducible latency, throughput, stability, or saturation evidence.</item>
</when_to_use>

<input_requirements>
  <required>Load goal (throughput/latency/stability)</required>
  <required>Key user scenarios</required>
  <required>Environment constraints, limits, and approved target environment</required>
  <required>User profile and scenario distribution</required>
  <optional>Base metrics and current baseline</optional>
  <optional>Allowed thresholds (SLA/SLO)</optional>
  <optional>Monitoring requirements (APM/logging)</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="critical">Do not use for production or destructive load execution without explicit permission.</item>
  <item importance="high">Do not use for generic code optimization or benchmarking theory without a concrete load-testing task.</item>
</when_not_to_use>

<workflow>
  <step>Confirm the load goal, service version, target environment, approved limits, and traffic distribution.</step>
  <step>Design realistic scenarios with warm-up, peak, and stability or soak phases, including think time.</step>
  <step>Define thresholds, required metrics, monitoring sources, and baseline comparisons needed to detect regressions or saturation points.</step>
  <step>Specify reproducible execution details: data assumptions, scenario configuration, safety boundaries, and evidence capture.</step>
  <step>Summarize pass-fail criteria, bottlenecks, degradations, and follow-up risks.</step>
</workflow>

<test_design>
  <principles>
    <principle importance="critical">Load reflects real traffic distribution</principle>
    <principle importance="critical">Metrics and thresholds are agreed upfront</principle>
    <principle importance="high">Scenarios are isolated and repeatable</principle>
    <principle importance="high">Tests are split into warm-up/peak/stability</principle>
    <principle importance="high">Clearly separate load/stress/spike/soak tests</principle>
    <principle importance="high">Add think time and realistic pauses</principle>
    <principle importance="medium">Metric collection is agreed with the infra team</principle>
  </principles>
</test_design>

<execution_rules>
  <rule importance="critical">Do not exceed environment limits without permission</rule>
  <rule importance="critical">Record load configuration and environment</rule>
  <rule importance="high">Verify stability across repeated runs</rule>
  <rule importance="high">Identify degradations and saturation points</rule>
  <rule importance="high">Verify you are testing the correct service version</rule>
  <rule importance="medium">Compare against baseline and record changes</rule>
  <rule importance="medium">Synchronize timestamps and log correlation</rule>
</execution_rules>

<metrics>
  <required>
    <metric>p50/p95/p99 latency</metric>
    <metric>throughput (RPS)</metric>
    <metric>error rate</metric>
    <metric>resource usage (CPU/RAM/IO)</metric>
    <metric>latency for key endpoints</metric>
  </required>
</metrics>

<output_requirements>
  <requirement>Return a reproducible load test plan or scenario set with phases, traffic profile, think time, and environment assumptions.</requirement>
  <requirement>List thresholds, required metrics, monitoring sources, and pass-fail criteria for each key scenario.</requirement>
  <requirement>Record service version, baseline comparison, and the evidence needed to identify regressions, saturation points, or instability.</requirement>
</output_requirements>

<do_not>
  <item importance="critical">Do not run load tests in production without permission</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not change load parameters during the test without recording it</item>
  <item importance="high">Do not run tests without monitoring key metrics</item>
</do_not>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, execution constraints, and safety boundaries are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<example_scenarios>
  <scenario>Linear ramp-up to peak load</scenario>
  <scenario>Step load with stabilization periods</scenario>
  <scenario>Long soak test for stability</scenario>
</example_scenarios>
