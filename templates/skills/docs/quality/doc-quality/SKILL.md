---
name: docs-quality
description: Minimum quality bar for documentation artifacts (purpose, audience, sources, verification, risks, and dating).
---

<skill_overview>
  <purpose>Prevent low-signal docs by enforcing a minimal quality checklist.</purpose>
  <triggers>
    <trigger>You are drafting any doc artifact (guide/spec/change note/architecture)</trigger>
    <trigger>You are about to save a doc to disk</trigger>
  </triggers>
</skill_overview>

<checklist>
  <item>Purpose: why this doc exists, in one sentence</item>
  <item>Audience: who should read it</item>
  <item>Context: assumptions and scope boundaries</item>
  <item>Sources: links to code paths, diffs, specs, or external references</item>
  <item>Verification: how to check the doc is correct (commands, tests, checks)</item>
  <item>Risks/Trade-offs: what could go wrong, what is intentionally not covered</item>
  <item>Date/Status: last updated and current status (draft/ready)</item>
</checklist>

<anti_patterns>
  <avoid name="hand_wavy">Vague statements without actionable steps or references</avoid>
  <avoid name="no_verification">No way to verify success</avoid>
  <avoid name="duplicate_sources">Repeating PRD/ADR content instead of linking</avoid>
</anti_patterns>
