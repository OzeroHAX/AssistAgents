---
name: review-code-security
description: Security-focused code review: auth, validation, data exposure, dependencies, and configuration
---

<when_to_use>
  <trigger>Changes affect input data, access, tokens, payments, or PII</trigger>
  <trigger>A security gate is needed before merge</trigger>
</when_to_use>

<input_requirements>
  <required>Role and access model for the changed area</required>
  <required>List of external inputs: APIs, forms, files, events</required>
  <required>PR diff</required>
  <optional>Logging and secret-handling policy</optional>
</input_requirements>

<core_checks>
  <check priority="P0">AuthN/AuthZ: permissions are enforced on the server side, with no client-side bypasses</check>
  <check priority="P0">Input validation: untrusted data is validated and normalized</check>
  <check priority="P0">Data exposure: no secrets/PII in responses, logs, or errors</check>
  <check priority="P1">Dependency hygiene: new dependencies are known and not obviously risky</check>
  <check priority="P1">Secure defaults: secure default values and fail-closed behavior</check>
  <check priority="P1">Error handling: error messages do not reveal internal details</check>
</core_checks>

<quality_rules>
  <rule importance="critical">Any security risk includes an exploitation scenario and impact level</rule>
  <rule importance="high">Critical risks without mitigation are marked as blocking</rule>
  <rule importance="high">Comments are tied to specific code areas</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not publish real secrets in examples or comments</item>
  <item importance="high">Do not rely only on linters without manual access-logic review</item>
</do_not>

<output_requirements>
  <requirement>Short list of risks with severity and recommended mitigation</requirement>
  <requirement>Explicit verdict: security-pass or security-fail</requirement>
</output_requirements>
