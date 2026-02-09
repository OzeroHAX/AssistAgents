---
name: project-discovery-mode-selector
description: Choose fast or standard planning mode based on complexity, risk, and unknowns before any project artifacts
---

<purpose>
  <item>Choose the right planning mode before any project artifacts are produced</item>
  <item>Prevent over-planning simple requests and under-planning risky initiatives</item>
</purpose>

<when_to_use>
  <item importance="critical">At the start of project work, before `project-fast-init` or `project-standart-brief`</item>
  <item importance="high">When the request is ambiguous and mode choice can change scope, timeline, and risks</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
  <item>planning-task-classifier</item>
  <item>planning-risk-assessment</item>
  <item>planning-scope-definition</item>
</required_preload>

<inputs>
  <required>User request and expected business outcome</required>
  <required>Known constraints: timeline, budget, team size, compliance</required>
  <optional>Technical context: integrations, migrations, public APIs, unknown dependencies</optional>
  <optional>Change impact signals: number of modules, teams, and affected contracts</optional>
</inputs>

<method>
  <step>Classify request complexity: small / medium / high</step>
  <step>Evaluate risk factors: compliance, migrations, external dependencies, public contracts</step>
  <step>Estimate uncertainty: count of critical unknowns that block planning</step>
  <step>Select mode using decision rules and confidence level</step>
  <step>Record rationale and escalation triggers</step>
</method>

<decision_rules>
  <fast_mode>
    <condition>Use when complexity is small or medium, risks are controllable, and unknowns are limited</condition>
    <condition>Typical indicators: one team, low compliance pressure, no critical migration, no public API breakage</condition>
    <condition>Time pressure is high and a one-iteration plan is acceptable</condition>
  </fast_mode>
  <standart_mode>
    <condition>Use when complexity or risk is high, or unknowns can invalidate architecture decisions</condition>
    <condition>Typical indicators: multi-team coordination, compliance/security constraints, migrations, external contracts</condition>
    <condition>Traceability from brief to PRD/arch/epics/tasks is required before implementation</condition>
  </standart_mode>
  <escalation>
    <condition>Start in fast mode, then escalate to standart mode if critical unknowns remain after pulse-scan</condition>
    <condition>Escalate when gate is CONCERNS/FAIL and corrective actions exceed fast timebox</condition>
  </escalation>
</decision_rules>

<output_format>
  <section>Chosen mode: fast | standart</section>
  <section>Confidence: high | medium | low</section>
  <section>Top reasons (3-5 bullets)</section>
  <section>Primary risks and constraints</section>
  <section>Escalation triggers</section>
  <section>Next step command (exactly one): `project-fast-init` or `project-standart-brief`</section>
</output_format>

<quality_rules>
  <rule importance="critical">Mode decision must be justified by explicit risk/complexity criteria, not preference</rule>
  <rule importance="critical">If confidence is low, include concrete data needed to confirm or revise decision</rule>
  <rule importance="high">Escalation triggers are mandatory for fast mode</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not start planning artifacts before selecting mode</item>
  <item importance="high">Do not select fast mode when compliance/migration/public-contract risks are unresolved</item>
  <item importance="high">Do not select standart mode without evidence of complexity or risk</item>
</do_not>
