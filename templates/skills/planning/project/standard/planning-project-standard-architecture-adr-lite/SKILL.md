---
name: planning-project-standard-architecture-adr-lite
description: Minimal architecture doc + ADR-lite decisions to constrain implementation and keep consistency.
---

<skill_overview>
  <purpose>Make key technical decisions explicit so implementation and task breakdown stay consistent.</purpose>
  <triggers>
    <trigger>PRD is ready and technical decisions need to be fixed</trigger>
    <trigger>Multiple valid architectures exist and trade-offs matter</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Architecture is a constraint document: specify what we do and what we do NOT do.</rule>
  <rule>Capture decisions as ADR-lite entries (context, options, decision, rationale).</rule>
  <rule>Prefer minimal viable architecture for v1; defer scale/polish unless required by NFRs.</rule>
</rules>

<architecture_template>
  <template>
  # Architecture: {name}

  ## Constraints
  - From PRD NFRs: ...

  ## High-Level Design
  - Components: ...
  - Data flow: ...
  - Integration points: ...

  ## Data Model (Lite)
  - Entities: ...
  - Key relationships: ...

  ## API / Contracts (Lite)
  - External API surface (if any): ...
  - Internal boundaries: ...

  ## Error Handling
  - Error categories and user-visible behavior: ...

  ## Security
  - AuthN/AuthZ: ...
  - Sensitive data handling: ...

  ## Observability
  - Logs/metrics/traces expectations: ...

  ## ADRs
  - ADR-001: ...
  - ADR-002: ...
  </template>
</architecture_template>

<adr_lite_template>
  <template>
  ### ADR-XXX: {title}
  - Status: Proposed|Accepted|Deprecated|Superseded
  - Date: YYYY-MM-DD
  - Context: ...
  - Options:
    1) ...
    2) ...
  - Decision: ...
  - Rationale: ...
  </template>
</adr_lite_template>
