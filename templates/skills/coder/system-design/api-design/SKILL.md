---
name: coder-system-design-api-design
description: API design rules for stable, observable, backward-compatible HTTP APIs.
---

<when_to_use>
  <trigger>Designing new HTTP APIs or evolving existing contracts</trigger>
  <trigger>Reviewing API changes for compatibility and client impact</trigger>
  <trigger>Defining versioning, error model, pagination, and idempotency</trigger>
</when_to_use>

<input_requirements>
  <required>API consumers and usage patterns</required>
  <required>Resource model and operation set</required>
  <required>Compatibility policy and deprecation expectations</required>
  <required>Operational requirements (SLOs, observability, rate limits)</required>
</input_requirements>

<design_rules>
  <rule priority="P0">Model nouns as resources and use HTTP semantics consistently</rule>
  <rule priority="P0">Define one explicit versioning strategy and enforce it platform-wide</rule>
  <rule priority="P0">Use machine-readable error format with stable codes/types</rule>
  <rule priority="P0">Support idempotency for mutating operations with retries</rule>
  <rule priority="P1">Ship pagination from first release for list endpoints</rule>
  <rule priority="P1">Keep filtering/sorting grammar explicit and validated</rule>
  <rule priority="P1">Require request correlation and trace propagation headers</rule>
  <rule priority="P1">Treat backward compatibility as mandatory default in same major version</rule>
  <rule priority="P2">Use explicit deprecation timeline and sunset communication</rule>
</design_rules>

<decision_matrix>
  <item>Versioning: path major for public API unless platform standard mandates header/query versioning</item>
  <item>Error model: prefer RFC 9457 problem details over custom ad-hoc envelopes</item>
  <item>Pagination: cursor/page token for mutable datasets; offset only for small stable datasets</item>
</decision_matrix>

<checklist>
  <item>Status codes are accurate and documented per operation</item>
  <item>Error payload includes stable identifier and actionable detail</item>
  <item>Idempotency behavior is documented for retries and duplicate submission</item>
  <item>List endpoints define page size bounds and continuation token behavior</item>
  <item>Compatibility impact is evaluated for each contract change</item>
</checklist>

<do_not>
  <item importance="critical">Do not introduce breaking field or behavior changes in same major version</item>
  <item importance="high">Do not require clients to parse free-text error messages</item>
  <item importance="high">Do not add pagination later for high-volume endpoints</item>
</do_not>

<output_requirements>
  <requirement>API contract summary with versioning and compatibility notes</requirement>
  <requirement>Error model and idempotency strategy</requirement>
  <requirement>Pagination/filtering contract and limits</requirement>
  <requirement>Observability and deprecation plan</requirement>
</output_requirements>

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
