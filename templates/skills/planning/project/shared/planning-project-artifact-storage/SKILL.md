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
  <rule>Default base directory for ALL planning artifacts: ai-docs/project (create if missing).</rule>
  <rule>Use ASCII-only slugs and file names unless the repo already uses Unicode for docs.</rule>
  <rule>Every artifact must link to its upstream artifact(s) (e.g., epic -> PRD; story -> epic + ADRs).</rule>
  <rule>Prefer stable filenames for canonical docs (PRD.md, arch/architecture.md) and timestamped filenames for drafts/revisions.</rule>
</rules>

<recommended_structure>
  <option name="flat">
    <when>Small project, minimal docs</when>
    <layout>
      <item>ai-docs/project/PRD.md</item>
      <item>ai-docs/project/arch/architecture.md</item>
      <item>ai-docs/project/epics-<slug>.md</item>
      <item>ai-docs/project/story-<slug>.md</item>
      <item>ai-docs/project/tasks-<slug>.md</item>
    </layout>
  </option>
  <option name="grouped">
    <when>Multiple epics/stories or long-lived project</when>
    <layout>
      <item>ai-docs/project/brief/</item>
      <item>ai-docs/project/prd/</item>
      <item>ai-docs/project/arch/</item>
      <item>ai-docs/project/epics/</item>
      <item>ai-docs/project/stories/</item>
      <item>ai-docs/project/tasks/</item>
    </layout>
  </option>
</recommended_structure>

<naming>
  <canonical_docs>
    <rule>PRD: ai-docs/project/PRD.md</rule>
    <rule>Architecture: ai-docs/project/arch/architecture.md</rule>
  </canonical_docs>
  <timestamped_docs>
    <rule>Format: YYYYMMDD-HHMMSS-{slug}.md</rule>
    <rule>slug: ASCII, lowercase, words-with-hyphens, max 60 chars</rule>
  </timestamped_docs>
  <story_files>
    <rule>Format: story-{slug}.md (or story-{NNN}-{slug}.md if ordering matters)</rule>
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
