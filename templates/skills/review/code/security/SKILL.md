---
name: review-code-security
description: "Security-focused code review: check auth, input validation, data exposure, dependencies, and configuration. Use when reviewing PRs that touch authentication, payment flows, PII handling, or external-facing APIs."
---

<when_to_use>
  <trigger>Changes affect input data, access control, tokens, payments, or PII</trigger>
  <trigger>A security gate is needed before merge</trigger>
  <trigger>New external-facing API endpoints or webhooks are introduced</trigger>
</when_to_use>

<input_requirements>
  <required>Role and access model for the changed area</required>
  <required>List of external inputs (APIs, forms, files, events)</required>
  <required>PR diff</required>
  <optional>Logging and secret-handling policy</optional>
</input_requirements>

<method>
  <step>Map the trust boundary: identify where untrusted data enters and how it flows through the changed code</step>
  <step>Run through each core check (see below) against the diff, noting specific code locations</step>
  <step>For each finding, document an exploitation scenario and assign a severity (Critical/High/Medium/Low)</step>
  <step>Verify that mitigations are in place or flag as blocking if missing</step>
</method>

<core_checks>
  <check priority="P0">AuthN/AuthZ: permissions are enforced server-side with no client-side bypasses (e.g., verify `req.user.role` before data access, not just UI hiding)</check>
  <check priority="P0">Input validation: untrusted data is validated, sanitized, and type-checked at the boundary (e.g., `zod.parse(input)` or equivalent)</check>
  <check priority="P0">Data exposure: no secrets, tokens, or PII in responses, logs, error messages, or stack traces</check>
  <check priority="P1">Dependency hygiene: new dependencies are from known sources, not deprecated, and free of known CVEs</check>
  <check priority="P1">Secure defaults: configuration uses fail-closed behavior (e.g., deny by default, HTTPS only, secure cookie flags)</check>
  <check priority="P1">Error handling: error messages reveal no internal paths, query structures, or stack details to callers</check>
</core_checks>

<example>
  **Finding:** Endpoint `/api/users/:id` returns full user record including `password_hash` field.
  **Exploitation:** Attacker enumerates user IDs to harvest password hashes for offline cracking.
  **Severity:** Critical
  **Mitigation:** Add a response DTO that explicitly allowlists fields; never return the raw DB model.
</example>

<quality_rules>
  <rule importance="critical">Every security finding includes an exploitation scenario and severity level</rule>
  <rule importance="high">Critical risks without mitigation are marked as merge-blocking</rule>
  <rule importance="high">Comments reference specific code locations (file and line)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not include real secrets, tokens, or credentials in examples or review comments</item>
  <item importance="high">Do not rely solely on automated linters — always manually review access-control logic</item>
  <item importance="high">Do not approve changes with unresolved Critical or High findings</item>
</do_not>

<output_requirements>
  <requirement>Findings list with severity, exploitation scenario, and recommended mitigation</requirement>
  <requirement>Explicit verdict: security-pass or security-fail (with blocking items listed)</requirement>
</output_requirements>
