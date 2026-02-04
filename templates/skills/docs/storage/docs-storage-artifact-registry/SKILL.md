---
name: docs-storage-artifact-registry
description: Single source of truth for documentation/planning artifact storage: directory map, naming rules, and agent write access.
---

<skill_overview>
  <purpose>Make artifact storage discoverable and consistent: one place to answer “where does this go?” and “who is allowed to write here?”.</purpose>
  <triggers>
    <trigger>You are about to write a doc/plan artifact and need the correct directory</trigger>
    <trigger>User asks where a certain artifact should be stored</trigger>
    <trigger>You need to understand which agent is allowed to write to a path</trigger>
    <trigger>You are defining or reviewing storage/naming conventions</trigger>
  </triggers>
</skill_overview>

<scope>
  <rule>This registry describes storage under ai-docs/ and agent write access as encoded in agent templates permissions.</rule>
  <rule>If the repository already has a canonical storage doc, align with it; otherwise this file is the canonical storage reference.</rule>
</scope>

<base>
  <rule>Primary base for project artifacts: ai-docs/project/</rule>
  <rule>Planning-only plans (non-project specific): ai-docs/plan/</rule>
  <rule>Prefer ASCII-only slugs and filenames unless the repo already uses Unicode in docs.</rule>
</base>

<directory_map>
  <entry>
    <path>ai-docs/project/guides/</path>
    <purpose>How-to / guide / overview / ops docs (human-readable).</purpose>
    <naming>Prefer timestamped: YYYYMMDD-HHMMSS-<slug>.md</naming>
  </entry>

  <entry>
    <path>ai-docs/project/</path>
    <purpose>Project-level canonical docs and subdirectories (recommended grouped layout).</purpose>
    <naming>Canonical files are stable; drafts/revisions are timestamped.</naming>
    <examples>
      <item>ai-docs/project/PRD.md</item>
      <item>ai-docs/project/brief/</item>
      <item>ai-docs/project/prd/</item>
      <item>ai-docs/project/epics/</item>
      <item>ai-docs/project/stories/</item>
      <item>ai-docs/project/tasks/</item>
    </examples>
  </entry>
  <entry>
    <path>ai-docs/project/specs/</path>
    <purpose>Contract-first specs (OpenAPI/AsyncAPI) + examples. Structure is project-specific.</purpose>
    <naming>Use stable filenames that match the spec/tooling conventions for the project.</naming>
  </entry>
  <entry>
    <path>ai-docs/project/changes/</path>
    <purpose>Change notes for fixes/changes (why/what/impact/verification).</purpose>
    <naming>Prefer timestamped: YYYYMMDD-HHMMSS-<slug>.md</naming>
  </entry>
  <entry>
    <path>ai-docs/project/arch/</path>
    <purpose>Architecture docs. Canonical file: ai-docs/project/arch/architecture.md</purpose>
    <naming>Stable canonical filename (do not timestamp).</naming>
  </entry>
  <entry>
    <path>ai-docs/plan/</path>
    <purpose>Ad-hoc planning documents (not necessarily project docs). Intended for “Planning Agent (Read-Only)”.</purpose>
    <naming>Timestamped: YYYYMMDD-HHMMSS-<slug>.md</naming>
  </entry>
</directory_map>

<naming_rules>
  <timestamped>
    <rule>Format: YYYYMMDD-HHMMSS-<slug>.md</rule>
    <rule>slug: ASCII, lowercase, words-with-hyphens, max 60 chars</rule>
  </timestamped>
  <canonical>
    <rule>Keep canonical docs stable (example: ai-docs/project/arch/architecture.md).</rule>
    <rule>Preferred canonical project doc: ai-docs/project/PRD.md</rule>
  </canonical>
</naming_rules>

<task_id_rules>
  <rule>Task ID format: KEY-001 (3 digits, zero-padded).</rule>
  <rule>Choose KEY by context: TASK-001 (default), DOC-001 (docs), TEST-001 (testing), ADR-001 (architecture decision records), etc.</rule>
</task_id_rules>

<agent_write_access>
  <rule>Source of truth is agent templates (permission.edit rules). Keep this section in sync with those templates.</rule>

  <notes>
    <rule>"allow" means the agent can write without additional approval.</rule>
    <rule>"ask" means writes are possible but require explicit approval (see agent template permissions).</rule>
  </notes>

  <matrix_by_path>
    <entry>
      <path>ai-docs/project/guides/**</path>
      <agents>
        <allow>
          <item>Documentation Agent</item>
          <item>Project Planning Agent (Read-Only)</item>
        </allow>
        <ask>
          <item>Build Dev Agent</item>
        </ask>
      </agents>
    </entry>

    <entry>
      <path>ai-docs/project/specs/**</path>
      <agents>
        <allow>
          <item>Documentation Agent</item>
          <item>Project Planning Agent (Read-Only)</item>
        </allow>
        <ask>
          <item>Build Dev Agent</item>
        </ask>
      </agents>
    </entry>

    <entry>
      <path>ai-docs/project/changes/**</path>
      <agents>
        <allow>
          <item>Documentation Agent</item>
          <item>Project Planning Agent (Read-Only)</item>
        </allow>
        <ask>
          <item>Build Dev Agent</item>
        </ask>
      </agents>
    </entry>

    <entry>
      <path>ai-docs/project/arch/**</path>
      <agents>
        <allow>
          <item>Architecture Docs Subagent</item>
        </allow>
        <ask>
          <item>Build Dev Agent</item>
        </ask>
      </agents>
    </entry>

    <entry>
      <path>ai-docs/plan/**.md</path>
      <agents>
        <allow>
          <item>Planning Agent (Read-Only)</item>
        </allow>
        <ask>
          <item>Build Dev Agent</item>
        </ask>
      </agents>
    </entry>
  </matrix_by_path>
</agent_write_access>

<conflict_safety>
  <rule>Before writing, read the current file content (if it exists).</rule>
  <rule>Do not overwrite existing docs without showing what changes and asking for approval.</rule>
</conflict_safety>
