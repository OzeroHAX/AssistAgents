---
name: planning-monitoring-checks
description: Observability: metrics, alerts, dashboards, post-change observation windows
---

<purpose>
  <item>Define the signals that tell whether "everything is OK" or "we must stop/roll back"</item>
</purpose>

<inputs>
  <required>Change goal + critical user scenarios</required>
  <optional>SLA/SLO, existing metrics/alerts</optional>
  <optional>Risks (especially high-impact)</optional>
</inputs>

<method>
  <step>Define 3-7 key signals: errors, latency, business metrics, resource saturation</step>
  <step>For each signal: source, aggregation, threshold, window, alerting</step>
  <step>Define a post-rollout burn-in observation window (e.g., 1-24h) and owners</step>
  <step>Define stop/rollback criteria as measurable conditions</step>
</method>

<output_format>
  <section>Key signals</section>
  <section>Alerts + thresholds</section>
  <section>Dashboards / views</section>
  <section>Burn-in window</section>
  <section>Stop / rollback criteria</section>
</output_format>

<quality_rules>
  <rule importance="critical">Signals are tied to target behavior and risks, not "metrics in general"</rule>
  <rule importance="high">Thresholds and windows are defined (otherwise it is not controllable)</rule>
</quality_rules>
