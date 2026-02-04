---
name: planning-project-artifact-storage
description: Standardized storage rules for planning artifacts under ai-docs/project (paths, naming, and cross-linking).
---

<skill_overview>
  <purpose>Keep all planning artifacts discoverable and consistently named so context stays stable across sessions and agents.</purpose>
  <triggers>
    <trigger>You are producing planning artifacts (brief/PRD/architecture/epics/stories/tasks)</trigger>
    <trigger>User wants the plan saved to disk or asks "where is the doc?"</trigger>
    <trigger>Multiple artifacts need to reference each other</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Source of truth for directory map + naming + agent write access: docs-storage-artifact-registry</rule>
  <rule>Default base directory for ALL planning artifacts: ai-docs/project (create if missing).</rule>
  <rule>Use ASCII-only slugs and file names unless the repo already uses Unicode for docs.</rule>
  <rule>Every artifact must link to its upstream artifact(s) (e.g., epic -> PRD; story -> epic + ADRs).</rule>
  <rule>Prefer stable filenames for canonical docs (PRD.md, arch/architecture.md) and timestamped filenames for drafts/revisions.</rule>
</rules>

<recommended_structure>
  <option name="flat">
    <when>Small project, minimal docs</when>
    <layout>
      <item>Use skill docs-storage-artifact-registry</item>
    </layout>
  </option>
  <option name="grouped">
    <when>Multiple epics/stories or long-lived project</when>
    <layout>
      <item>Use skill docs-storage-artifact-registry</item>
    </layout>
  </option>
</recommended_structure>

<naming>
  <canonical_docs>
    <rule>Canonical paths live in docs-storage-artifact-registry</rule>
  </canonical_docs>
  <timestamped_docs>
    <rule>Use skill docs-storage-artifact-registry</rule>
  </timestamped_docs>
  <story_files>
    <rule>Use skill docs-storage-artifact-registry</rule>
  </story_files>
</naming>

<cross_linking>
  <rule>Each doc starts with a short "Context" block listing upstream docs and current status.</rule>
  <template>
    ## Context
    - Upstream: PRD.md, arch/architecture.md
    - This doc: ...
    - Status: draft|ready|deprecated
  </template>
</cross_linking>
