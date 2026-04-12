---
name: planning-monitoring-checks
description: Use when a change or rollout plan needs post-release monitoring signals, alert thresholds, dashboards, burn-in windows, or stop/rollback criteria.
---

<purpose>
  <item>Define the monitoring checks that tell whether rollout continues, pauses, or rolls back.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when planning what to monitor after a change or rollout.</item>
  <item importance="high">Use when the task needs measurable alert thresholds, burn-in checks, or stop or rollback signals.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main need is test coverage before release.</item>
  <item importance="high">Do not use when the main need is rollback mechanics rather than monitoring criteria.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<input_requirements>
  <required>Change goal and critical user scenarios</required>
  <required>Rollout context or affected path</required>
  <optional>SLA/SLO, current metrics, existing dashboards, or alerts</optional>
  <optional>Known risks, rollback triggers, and owner or on-call constraints</optional>
</input_requirements>

<workflow>
  <step>Pick 3-7 signals tied to user impact, system health, and change-specific failure modes.</step>
  <step>For each signal, define the source, aggregation or time window, threshold, and alert condition.</step>
  <step>Define the dashboards or views, burn-in window, and owner for observation.</step>
  <step>Convert the signals into measurable stop or rollback criteria.</step>
</workflow>

<output_requirements>
  <requirement>Produce a plan-ready monitoring section with: Key signals, Alerts + thresholds, Dashboards / views, Burn-in window, and Stop / rollback criteria.</requirement>
  <requirement>Each signal and stop criterion states what is measured, why it matters, the threshold or observation window, and the owner when relevant.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Signals are tied to target behavior and concrete risks, not generic observability advice.</rule>
  <rule importance="high">Thresholds, windows, and owners are explicit enough to control rollout decisions.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required monitoring sections and is tied to the task inputs, rollout context, or stated risks.</item>
  <item importance="critical">Every alert and stop criterion is measurable.</item>
  <item importance="high">Dashboards or views, the burn-in window, and the owner are explicit where relevant.</item>
</validation>
