---
name: coder-system-design-api-design
description: Use when designing or reviewing HTTP API contracts for versioning, compatibility, errors, pagination, and observability.
---

<when_to_use>
  <trigger>Designing new HTTP APIs or evolving existing contracts</trigger>
  <trigger>Reviewing API changes for compatibility and client impact</trigger>
  <trigger>Defining versioning, error model, pagination, and idempotency</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when a narrower review, testing, or domain-specific skill is the better fit.</item>
</when_not_to_use>
<input_requirements>
  <required>API consumers and usage patterns</required>
  <required>Resource model and operation set</required>
  <required>Compatibility policy and deprecation expectations</required>
  <required>Operational requirements (SLOs, observability, rate limits)</required>
</input_requirements>

<workflow>
  <step>Gather consumers, resource model, compatibility policy, and operational constraints.</step>
  <step>Choose versioning, error format, idempotency, pagination/filtering, and correlation defaults as one coherent contract.</step>
  <step>Check same-major compatibility, retry behavior, client impact, and deprecation path, then produce contract notes with decisions and open risks.</step>
</workflow>

<design_rules>
  <rule priority="P0">Model resources and use HTTP semantics consistently</rule>
  <rule priority="P0">Pick one versioning strategy and enforce it platform-wide</rule>
  <rule priority="P0">Use machine-readable error format with stable codes/types</rule>
  <rule priority="P0">Support idempotency for retried mutations</rule>
  <rule priority="P1">Ship pagination from first release for list endpoints</rule>
  <rule priority="P1">Keep filtering/sorting grammar explicit</rule>
  <rule priority="P1">Require correlation and trace headers</rule>
  <rule priority="P1">Keep backward compatibility within the same major version</rule>
  <rule priority="P2">Use explicit deprecation and sunset timelines</rule>
</design_rules>

<decision_matrix>
  <item>Versioning: path major for public API unless platform standard mandates header/query versioning</item>
  <item>Error model: prefer RFC 9457 problem details over custom ad-hoc envelopes</item>
  <item>Pagination: cursor/page token for mutable datasets; offset only for small stable datasets</item>
</decision_matrix>

<checklist>
  <item>Status codes are accurate and documented per operation</item>
  <item>Error payload includes stable identifier and actionable detail</item>
  <item>Idempotency behavior is documented for retries and duplicates</item>
  <item>List endpoints define page bounds and continuation tokens</item>
  <item>Compatibility impact and migration/deprecation notes are evaluated for each contract change</item>
</checklist>

<do_not>
  <item importance="critical">Do not introduce breaking field or behavior changes in same major version</item>
  <item importance="high">Do not require clients to parse free-text error messages</item>
  <item importance="high">Do not add pagination later for high-volume endpoints</item>
</do_not>

<output_requirements>
  <requirement>Contract summary with versioning and compatibility notes</requirement>
  <requirement>Error and idempotency strategy</requirement>
  <requirement>Pagination/filtering contract and limits</requirement>
  <requirement>Observability and deprecation plan</requirement>
</output_requirements>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="high">Decisions are traceable to client, retry, and compatibility requirements, and verifiable from the summary or inspected artifacts.</item>
</validation>
<references>
  <source url="https://www.rfc-editor.org/rfc/rfc9110.html">RFC 9110 HTTP Semantics</source>
  <source url="https://www.rfc-editor.org/rfc/rfc9457.html">RFC 9457 Problem Details</source>
  <source url="https://www.rfc-editor.org/rfc/rfc9745.html">RFC 9745 Deprecation Header</source>
  <source url="https://www.rfc-editor.org/rfc/rfc8594.html">RFC 8594 Sunset Header</source>
  <source url="https://google.aip.dev/180">Google AIP-180 Backward Compatibility</source>
  <source url="https://google.aip.dev/185">Google AIP-185 Versioning</source>
  <source url="https://google.aip.dev/158">Google AIP-158 Pagination</source>
  <source url="https://google.aip.dev/160">Google AIP-160 Filtering</source>
  <source url="https://www.openapis.org/">OpenAPI Specification</source>
</references>
