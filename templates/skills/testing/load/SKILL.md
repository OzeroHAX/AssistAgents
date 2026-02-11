---
name: testing-load
description: Load testing (k6/JMeter scenarios, benchmarks)
---

<input_requirements>
  <required>Load goal (throughput/latency/stability)</required>
  <required>Key user scenarios</required>
  <required>Environment constraints and limits</required>
  <required>User profile and scenario distribution</required>
  <optional>Base metrics and current baseline</optional>
  <optional>Allowed thresholds (SLA/SLO)</optional>
  <optional>Monitoring requirements (APM/logging)</optional>
</input_requirements>

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

<do_not>
  <item importance="critical">Do not run load tests in production without permission</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not change load parameters during the test without recording it</item>
  <item importance="high">Do not run tests without monitoring key metrics</item>
</do_not>

<example_scenarios>
  <scenario>Linear ramp-up to peak load</scenario>
  <scenario>Step load with stabilization periods</scenario>
  <scenario>Long soak test for stability</scenario>
</example_scenarios>
