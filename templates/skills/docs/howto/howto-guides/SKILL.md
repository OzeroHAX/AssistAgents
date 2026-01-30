---
name: docs-howto-guides
description: How-to/guide/overview/ops documentation templates and best practices (stored under ai-docs/project/guides/).
---

<skill_overview>
  <purpose>Create practical, runnable docs that let a reader complete a task and verify success.</purpose>
  <triggers>
    <trigger>User asks for a how-to or step-by-step guide</trigger>
    <trigger>User asks for an operational runbook / ops notes</trigger>
    <trigger>User asks for an overview doc for a subsystem</trigger>
  </triggers>
</skill_overview>

<template>
  <section>## Purpose</section>
  <section>## Audience</section>
  <section>## Prerequisites</section>
  <section>## Steps</section>
  <section>## Verification</section>
  <section>## Troubleshooting</section>
  <section>## References</section>
</template>

<quality_rules>
  <rule>Prefer copy/pasteable commands with expected outputs or checks.</rule>
  <rule>Include at least one verification step that proves success.</rule>
  <rule>Call out risky operations explicitly (data loss, production impact).</rule>
</quality_rules>
