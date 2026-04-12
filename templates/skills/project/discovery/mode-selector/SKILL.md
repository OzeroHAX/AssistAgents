---
name: project-discovery-mode-selector
description: Use when project discovery must choose or reuse its mode before downstream planning starts
---

<purpose>
  <item>Choose the right planning mode before any project artifacts are produced</item>
  <item>Prevent over-planning simple requests and under-planning risky initiatives</item>
</purpose>

<when_to_use>
  <item importance="critical">Before `project-fast-init` or `project-standart-brief` when no valid discovery mode exists yet, or when the user explicitly asks to change the current mode</item>
  <item importance="high">When mode choice can materially change scope, risk, or planning depth</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not run when a valid discovery mode already exists and the user did not explicitly ask to change it.</item>
  <item importance="high">Do not use outside the project discovery flow.</item>
  <item importance="high">Do not use as a replacement for implementation or delivery execution.</item>
</when_not_to_use>
<required_preload>
  <item>shared-base-rules</item>
  <item>shared-docs-paths</item>
</required_preload>

<inputs>
  <required>User request and expected business outcome</required>
  <required>Known constraints: timeline, budget, team size, compliance</required>
  <optional>Existing discovery mode and whether the user explicitly wants to change it</optional>
  <optional>Technical context: integrations, migrations, public APIs, unknown dependencies</optional>
  <optional>Change impact signals: number of modules, teams, and affected contracts</optional>
</inputs>

<workflow>
  <step>Check whether a valid discovery mode is already established.</step>
  <step>If it exists and there is no explicit change intent, keep that mode and return the matching next step.</step>
  <step>Otherwise assess complexity, risk, and blocking unknowns.</step>
  <step>Select `fast` or `standart`, then record confidence and escalation triggers.</step>
  <step>Return the active mode and exactly one next-step command.</step>
</workflow>

<decision_rules>
  <reuse_existing_mode>
    <condition>If a valid mode is already recorded and the request does not explicitly ask to change it, keep the recorded mode and skip reselection.</condition>
  </reuse_existing_mode>
  <fast_mode>
    <condition>Use when complexity is small or medium, risks are controllable, and unknowns are limited.</condition>
    <condition>Typical indicators: one team, low compliance pressure, no critical migration, no public API breakage.</condition>
    <condition>Time pressure is high and a one-iteration plan is acceptable.</condition>
  </fast_mode>
  <standart_mode>
    <condition>Use when complexity or risk is high, or when unknowns can invalidate architecture decisions.</condition>
    <condition>Typical indicators: multi-team coordination, compliance or security constraints, migrations, or external contracts.</condition>
    <condition>Traceability from brief to PRD, arch, epics, and tasks is required before implementation.</condition>
  </standart_mode>
  <escalation>
    <condition>Start in fast mode, then escalate to standart mode if critical unknowns remain after pulse-scan.</condition>
    <condition>Escalate when the gate is CONCERNS or FAIL and corrective actions exceed the fast timebox.</condition>
  </escalation>
</decision_rules>

<output_requirements>
  <item>If mode selection was skipped, explicitly say the recorded mode is being kept.</item>
  <item>If a new mode was selected, include `Chosen mode: fast | standart` and `Confidence: high | medium | low`.</item>
  <item>Include 3-5 reasons plus the primary risks or constraints.</item>
  <item>Include escalation triggers when the active mode is `fast`.</item>
  <item>Include exactly one next-step command: `project-fast-init` or `project-standart-brief`.</item>
</output_requirements>

<quality_rules>
  <rule importance="critical">Mode choice must be justified by explicit risk or complexity criteria, not preference.</rule>
  <rule importance="critical">If confidence is low, include concrete data needed to confirm or revise the decision.</rule>
  <rule importance="high">Escalation triggers are mandatory for fast mode.</rule>
</quality_rules>

<validation>
  <item importance="critical">If a prior mode was kept, the output states that selection was skipped and names the next-step command.</item>
  <item importance="critical">If a new mode was chosen, the output includes the mode, confidence, reasons, risks or constraints, and next-step command.</item>
  <item importance="high">Required preload skills are satisfied and the handoff or escalation condition is explicit.</item>
</validation>
