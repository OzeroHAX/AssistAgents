---
name: docs-architecture-context
description: Define what counts as architecture, the canonical sources of truth, and how ai-docs/project/arch/architecture.md should be used.
---

<skill_overview>
  <purpose>Keep architectural documentation consistent and focused, so agents and humans share the same mental model.</purpose>
  <triggers>
    <trigger>You need to interpret or update project architecture docs</trigger>
    <trigger>You need to decide whether a change is architectural</trigger>
    <trigger>You need to standardize where architecture is documented</trigger>
  </triggers>
</skill_overview>

<definitions>
  <architecture>
    <what_it_includes>Components/services/modules, boundaries, key data flows, infrastructure dependencies, core contracts, and non-functional constraints.</what_it_includes>
    <what_it_excludes>Small refactors inside an existing module, minor config tweaks without topology/contract changes, and routine endpoint additions inside an unchanged service boundary.</what_it_excludes>
  </architecture>
  <canonical_doc>
    <rule>Single source of truth: ai-docs/project/arch/architecture.md (Architecture Full format).</rule>
    <rule>If the file exists, treat it as default context when discussing architecture.</rule>
  </canonical_doc>
</definitions>

<sources_of_truth>
  <source>ai-docs/project/arch/architecture.md (canonical narrative)</source>
  <source>ai-docs/project/specs/ (contracts)</source>
  <source>ADR/decision log (if present) as supporting rationale, not as the architecture itself</source>
  <source>Code + config as the real system of record; docs must match or call out drift</source>
</sources_of_truth>
