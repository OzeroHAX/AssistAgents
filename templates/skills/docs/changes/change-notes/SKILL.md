---
name: docs-changes-change-notes
description: Minimal change-note template for documenting fixes/changes (stored under ai-docs/project/changes/).
---

<skill_overview>
  <purpose>Capture why a fix/change happened, what changed, impact, and how it was verified.</purpose>
  <triggers>
    <trigger>User asks to document a fix</trigger>
    <trigger>User asks to produce release/change notes for a specific change</trigger>
  </triggers>
</skill_overview>

<template>
  <section>## Context</section>
  <section>## Root Cause / Motivation</section>
  <section>## Change</section>
  <section>## Impact</section>
  <section>## Verification</section>
  <section>## Links</section>
</template>

<naming>
  <rule>Prefer timestamped files: ai-docs/project/changes/YYYYMMDD-HHMMSS-<slug>.md</rule>
</naming>
