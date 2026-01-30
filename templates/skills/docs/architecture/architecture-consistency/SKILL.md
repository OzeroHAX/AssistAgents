---
name: docs-architecture-consistency
description: Rules for detecting architectural changes and when/how to propose creating or updating ai-docs/project/arch/architecture.md.
---

<skill_overview>
  <purpose>Ensure architecture docs are offered at the right time without spamming, and only updated with explicit user consent.</purpose>
  <triggers>
    <trigger>End of a dev task where architectural changes may have happened</trigger>
    <trigger>Project planning produced architectural decisions or changes</trigger>
    <trigger>A documentation request depends on architecture context</trigger>
  </triggers>
</skill_overview>

<architectural_change_indicators>
  <indicator>New service/module or major subsystem</indicator>
  <indicator>Changed module/service boundaries or ownership</indicator>
  <indicator>Database/storage technology change or new storage layer</indicator>
  <indicator>New message broker / event bus / queueing layer</indicator>
  <indicator>New inter-service protocol or significant contract changes across modules</indicator>
  <indicator>New caching layer or changes to key data flows</indicator>
</architectural_change_indicators>

<non_architectural_examples>
  <example>New endpoint within an existing unchanged service boundary</example>
  <example>Local refactor without changing boundaries or data flows</example>
  <example>Minor config tweak that does not affect topology/flows/contracts</example>
</non_architectural_examples>

<behavior>
  <rule>Offer architecture doc creation/update only at the end of the current work ("end of work").</rule>
  <rule>Coordinate using an in-session flag: arch_update_offered=true; do not repeat the offer unless new architectural changes occur.</rule>
  <rule>If ai-docs/project/arch/architecture.md is missing: propose creating it; if declined, proceed with a one-line risk note and do not write a file.</rule>
  <rule>Generate/update the doc only after explicit user consent (use assist/docs/architecture-docs).</rule>
  <rule>Doc agents must not perform independent deep code analysis to infer architecture without provided context/diff.</rule>
</behavior>
