---
name: review-code-security
description: Use for security review of a code change or concrete technical artifact affecting access control, untrusted input, secrets, PII, dependencies, or security-sensitive configuration.
---

<when_to_use>
  <trigger>Changes affect access control, untrusted input, tokens, payments, PII, dependencies, or security-sensitive configuration</trigger>
  <trigger>A security verdict is needed before merge or approval</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use without a concrete artifact under review, such as a diff, code snippet, implementation decision, or security-relevant document.</item>
  <item importance="high">Do not use for general style, performance, or maintainability review unless a concrete security risk is in scope.</item>
</when_not_to_use>

<input_requirements>
  <required>Concrete artifact under review: PR diff, code snippet, implementation decision, or security-relevant document</required>
  <required>Role and access model for the changed area</required>
  <required>External inputs and trust boundaries for the changed area</required>
  <optional>Logging, secret-handling, or data-classification policy</optional>
</input_requirements>

<workflow>
  <step>Identify relevant attack surfaces: auth, privileges, untrusted inputs, secrets or PII, dependencies, configuration, and error paths.</step>
  <step>Check the relevant surfaces against the core checks and tie each finding to concrete evidence in the artifact.</step>
  <step>For each risk, state severity, exploitation scenario, impact, blocking status, and mitigation or acceptance condition.</step>
  <step>Call out missing context explicitly when it limits confidence.</step>
  <step>Finish with an explicit verdict: security-pass or security-fail.</step>
</workflow>

<core_checks>
  <check priority="P0">AuthN/AuthZ: permissions are enforced on the server side, with no client-side bypasses</check>
  <check priority="P0">Input validation: untrusted data is validated and normalized</check>
  <check priority="P0">Data exposure: no secrets/PII in responses, logs, or errors</check>
  <check priority="P1">Dependency hygiene: new dependencies are known and not obviously risky</check>
  <check priority="P1">Secure defaults: secure default values and fail-closed behavior</check>
  <check priority="P1">Error handling: error messages do not reveal internal details</check>
</core_checks>

<quality_rules>
  <rule importance="critical">Each security risk includes an exploitation scenario and impact level</rule>
  <rule importance="high">Critical risks without mitigation are marked as blocking</rule>
  <rule importance="high">Findings are tied to specific code areas or artifact sections</rule>
</quality_rules>

<validation>
  <item importance="critical">Each finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity, blocking status, and mitigation or acceptance conditions are explicit.</item>
  <item importance="high">The review stays within security-review scope and does not drift into unrelated execution work.</item>
</validation>

<do_not>
  <item importance="critical">Do not publish real secrets in examples or comments</item>
  <item importance="high">Do not rely only on linters without manual access-logic review</item>
</do_not>

<output_requirements>
  <requirement>List security risks with severity, evidence, exploitation scenario, impact, and recommended mitigation</requirement>
  <requirement>Explicit verdict: security-pass or security-fail</requirement>
  <requirement>Call out any missing context that affects confidence</requirement>
</output_requirements>
