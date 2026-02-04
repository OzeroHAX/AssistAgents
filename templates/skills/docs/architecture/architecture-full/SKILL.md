---
name: docs-architecture-full
description: Template and guidance for the canonical Architecture Full document stored at ai-docs/project/arch/architecture.md.
---

<skill_overview>
  <purpose>Produce a single, high-signal architecture doc that is usable as default context for dev and planning agents.</purpose>
  <triggers>
    <trigger>User requests architecture documentation</trigger>
    <trigger>Architectural changes were made and the doc needs an update</trigger>
    <trigger>Architecture doc is missing and user agrees to create it</trigger>
  </triggers>
</skill_overview>

<output>
  <rule>Write to: ai-docs/project/arch/architecture.md</rule>
  <rule>Prefer ASCII-only unless the repository already uses Unicode in docs.</rule>
  <rule>Keep it as one file; link out to specs and ADRs as needed.</rule>
</output>

<template>
  <section>## Context</section>
  <section>## System Overview</section>
  <section>## Components and Boundaries</section>
  <section>## Key Data Flows</section>
  <section>## Dependencies and Infrastructure</section>
  <section>## Contracts (Links)</section>
  <section>## Decisions (Links)</section>
  <section>## Non-Functional Requirements / Constraints</section>
  <section>## Operational Notes</section>
  <section>## Risks and Trade-offs</section>
  <section>## Open Questions</section>
</template>

<guidance>
  <rule>Describe boundaries with intent: what each component owns and what it must not own.</rule>
  <rule>Prefer a small number of canonical flows; link to deeper docs for details.</rule>
  <rule>When updating, explicitly call out what changed and why.</rule>
</guidance>
