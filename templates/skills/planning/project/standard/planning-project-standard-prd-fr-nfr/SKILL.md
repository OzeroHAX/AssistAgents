---
name: planning-project-standard-prd-fr-nfr
description: PRD template for standard planning with FRs/NFRs, scope, success, risks, and acceptance criteria style guidance.
---

<skill_overview>
  <purpose>Translate the brief into a PRD that is specific enough to drive architecture and story breakdown.</purpose>
  <triggers>
    <trigger>Product brief exists and you need formal requirements</trigger>
    <trigger>Requirements are vague and must be made testable</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Requirements must be testable; avoid implementation details.</rule>
  <rule>FRs describe behavior; NFRs describe quality constraints (security, perf, reliability, etc.).</rule>
  <rule>Keep scope explicit: In/Out/Parking Lot.</rule>
</rules>

<output_template>
  <template>
  # PRD: {name}

  ## Summary
  - What we build and for whom (2-3 sentences)

  ## Goals and Success
  - Goals: ...
  - Binary success metric: ...

  ## Users / Personas
  - Persona 1: ...
  - Persona 2 (optional): ...

  ## Scope
  - In scope (v1): ...
  - Out of scope: ...
  - Parking lot: ...

  ## Functional Requirements (FR)
  - FR1: ...
  - FR2: ...

  ## Non-Functional Requirements (NFR)
  - Security: ...
  - Performance: ...
  - Reliability: ...
  - Observability: ...
  - Compliance (if any): ...

  ## Assumptions
  - ...

  ## Risks
  - Risk: ... -> Mitigation: ...

  ## Acceptance Criteria Guidance
  - Prefer Given/When/Then for user-visible behaviors
  </template>
</output_template>
