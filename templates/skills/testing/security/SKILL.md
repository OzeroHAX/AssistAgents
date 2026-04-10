---
name: testing-security
description: Use when manual security testing must verify auth, access control, sessions, input handling, or data exposure with explicit evidence
---

<when_to_use>
  <trigger>Manual verification of authn/authz, forbidden paths, sessions, or data exposure in an approved environment</trigger>
  <trigger>Need reproducible checks with role context, evidence, and pass-fail outcomes</trigger>
  <trigger>Need safe validation of input handling, CSRF, rate limiting, or misconfiguration without destructive actions</trigger>
</when_to_use>

<input_requirements>
  <required>Authorization model and roles</required>
  <required>Critical endpoints/functions</required>
  <required>Data classification and risk areas</required>
  <required>Allowed checks, environment, and destructive boundaries</required>
  <optional>Access to logs/monitoring and request-id</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for implementation, planning, static review, or dependency scanning.</item>
  <item importance="critical">Do not use for exploit development, destructive testing, or production testing without explicit permission.</item>
  <item importance="high">Do not use for automation design or general non-security verification.</item>
</when_not_to_use>

<workflow>
  <step>Confirm the approved environment, allowed checks, roles, critical surfaces, and destructive boundaries.</step>
  <step>Define positive, forbidden, negative, and abuse scenarios with expected outcomes.</step>
  <step>Execute safe checks for authn/authz, sessions, input handling, CSRF, rate limiting, misconfiguration, and data exposure while recording evidence.</step>
  <step>Compare observed and expected behavior; separate confirmed issues from inconclusive checks.</step>
  <step>Summarize pass-fail results, evidence, risk context, and environment limits.</step>
</workflow>

<execution_rules>
  <rule importance="critical">Verify authn/authz for each role and forbidden path</rule>
  <rule importance="critical">Verify session management (expiration, logout, refresh)</rule>
  <rule importance="high">Verify input validation (XSS/SQLi) without destroying data</rule>
  <rule importance="high">Verify CSRF for state-changing operations (if applicable)</rule>
  <rule importance="high">Verify rate limiting and abuse blocking</rule>
  <rule importance="medium">Check data leaks in responses, logs, and errors</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Broken access control</item>
    <item>Authentication failures</item>
    <item>Security misconfiguration</item>
    <item>Data exposure (PII/secrets)</item>
    <item>Validation and injection vulnerabilities</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">All steps are reproducible and documented</rule>
  <rule importance="high">Role, token, and request context are stated</rule>
  <rule importance="high">Evidence exists (request/response, request-id)</rule>
  <rule importance="medium">Risk assessment is tied to data and roles</rule>
</quality_rules>

<output_requirements>
  <requirement>For each scenario, record role, target surface, request context, expected result, observed result, and pass-fail status.</requirement>
  <requirement>Record evidence, environment assumptions, data constraints, and request-id.</requirement>
  <requirement>Separate confirmed vulnerabilities, hardening gaps, and inconclusive checks; tie risk to affected roles and data.</requirement>
</output_requirements>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not run security tests without permission</item>
  <item importance="critical">Do not test production without permission</item>
  <item importance="high">Do not perform destructive actions and mass deletions</item>
  <item importance="high">Do not extract or store real user data</item>
</do_not>

<example_checks>
  <check>Verify User role access to an Admin resource (must be forbidden)</check>
  <check>Verify session expiration and inaccessibility after logout</check>
</example_checks>
