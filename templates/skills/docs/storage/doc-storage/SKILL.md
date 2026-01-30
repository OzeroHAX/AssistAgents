---
name: docs-storage
description: Storage rules for documentation artifacts under ai-docs/project (paths, naming, and safe concurrent updates).
---

<skill_overview>
  <purpose>Keep documentation discoverable, stable, and safe to update concurrently.</purpose>
  <triggers>
    <trigger>You are about to write docs to disk</trigger>
    <trigger>You need to pick a file path/name for a new doc</trigger>
    <trigger>You are updating an existing doc and need conflict-safe behavior</trigger>
  </triggers>
</skill_overview>

<base>
  <rule>All docs artifacts live under ai-docs/project/ (create directories if missing).</rule>
  <rule>Use ASCII-only slugs and filenames unless the repo already uses Unicode in docs.</rule>
</base>

<structure>
  <rule>Architecture (canonical): ai-docs/project/arch/architecture.md (written only by the architecture subagent).</rule>
  <rule>Guides: ai-docs/project/guides/</rule>
  <rule>Specs: ai-docs/project/specs/</rule>
  <rule>Change notes: ai-docs/project/changes/</rule>
</structure>

<conflict_safety>
  <rule>Before writing, always read the current file content (if it exists).</rule>
  <rule>If you would overwrite content, show a concise summary of differences and ask for explicit approval.</rule>
  <rule>If the user wants to merge changes, do not auto-merge silently; ask the user to choose: overwrite / manual merge / cancel.</rule>
</conflict_safety>
