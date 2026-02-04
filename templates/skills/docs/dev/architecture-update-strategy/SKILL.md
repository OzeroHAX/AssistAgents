---
name: docs-dev-architecture-update-strategy
description: Strategy for dev/planning agents to propose and coordinate architecture doc updates via the architecture subagent.
---

<skill_overview>
  <purpose>Make architecture updates predictable: offer at the end, avoid duplicates, and update only after user consent.</purpose>
  <triggers>
    <trigger>You finished a task and suspect architectural changes happened</trigger>
    <trigger>User asks to create/update the architecture doc</trigger>
    <trigger>Planning produced architectural decisions that should be reflected in architecture.md</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Read ai-docs/project/arch/architecture.md early if it exists.</rule>
  <rule>Classify whether changes are architectural using the architecture consistency checklist/indicators.</rule>
  <rule>Offer an architecture doc update only at the end of work. Set arch_update_offered=true to avoid repeating.</rule>
  <rule>If user agrees, invoke assist/docs/architecture-docs with: what changed, why it is architectural, and any links/diffs.</rule>
  <rule>If architecture doc is missing, offer creation. If declined, proceed with a one-line risk note.</rule>
</rules>

<task_formulation>
  <purpose>Help the architecture docs subagent produce a correct, high-signal update without guessing.</purpose>
  <principles>
    <principle>Be explicit: create vs update, and the intended audience (dev-only vs broader).</principle>
    <principle>Describe the change in architecture terms: boundaries, key flows, dependencies, contracts, and NFR/constraints.</principle>
    <principle>Provide concrete evidence: changed files, config diffs, new modules/services, removed components.</principle>
    <principle>Give constraints: keep canonical path ai-docs/project/arch/architecture.md; keep the doc as a single file.</principle>
    <principle>State expected output format: (1) proposed doc, (2) change summary by section, (3) open questions.</principle>
    <principle>If the work is large, orchestrate it as stages: draft -> review -> apply (caller coordinates).</principle>
  </principles>

  <inputs>
    <required>
      <item>Goal: create|update ai-docs/project/arch/architecture.md</item>
      <item>Why this is architectural (1-3 bullets, tied to indicators)</item>
      <item>What changed (high level) + intended end state</item>
      <item>Scope boundaries: what is in/out of the architecture update</item>
    </required>
    <evidence>
      <item>Changed files list (preferably grouped by subsystem)</item>
      <item>git diff --stat (or an equivalent summary)</item>
      <item>Key config changes (ports, env vars, services, DB/broker/cache)</item>
      <item>Contract/spec links if relevant: ai-docs/project/specs/* (or code paths)</item>
      <item>Decision links if available (ADR/notes) - link, do not restate</item>
    </evidence>
    <optional>
      <item>Current architecture doc issues you already noticed (bullets)</item>
      <item>New risks/trade-offs, NFR constraints (latency/SLOs, security, compliance)</item>
      <item>Deployment/runtime topology notes (containers, workers, queues)</item>
      <item>Open questions that block accurate documentation</item>
    </optional>
  </inputs>

  <prompt_template>
    <template>
      Task: [Create|Update] ai-docs/project/arch/architecture.md

      Context
      - Audience: [dev|mixed]
      - Reason (architectural):
        - ...

      What changed
      - ...

      Evidence
      - Changed files:
        - ...
      - Diff summary (git diff --stat):
        - ...
      - Config/infra changes:
        - ...
      - Contracts/specs (links/paths):
        - ...

      Constraints
      - Keep single canonical file at ai-docs/project/arch/architecture.md
      - Do not invent details not supported by evidence; ask questions if needed

      Output expectations
      - Provide: updated doc + concise section-by-section change summary + open questions
    </template>
  </prompt_template>

  <examples>
    <good>
      <task>Update architecture.md to reflect split of monolith into 2 services + new Redis cache layer. Include new boundaries and key data flow for checkout.</task>
      <evidence>Provide diff stat + list of new service entrypoints + docker/compose changes + new env vars.</evidence>
      <why>Clear goal, clear architectural impact, evidence provided.</why>
    </good>
    <bad>
      <task>Update architecture docs.</task>
      <why>No scope, no evidence, forces guessing.</why>
    </bad>
  </examples>
</task_formulation>

<agent_limitations>
  <cannot>Assume architecture details without evidence provided by the caller or existing docs.</cannot>
  <cannot>Write outside ai-docs/project/arch/.</cannot>
  <note>The caller should paste the key evidence (diff summary, file list) into the subagent prompt.</note>
</agent_limitations>

<depth_levels>
  <level name="standard">Update boundaries/flows/dependencies + concise change summary</level>
  <level name="deep">Standard + risks/trade-offs + NFR constraints + operational notes + open questions</level>
</depth_levels>
