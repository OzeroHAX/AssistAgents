---
name: testing-security
description: Basic security testing (OWASP, auth, data exposure)
---

<input_requirements>
  <required>Authorization model and roles</required>
  <required>List of critical endpoints/functions</required>
  <required>Data classification and risk areas</required>
  <required>Allowed check set and environment</required>
  <optional>Access to logs/monitoring and request-id</optional>
</input_requirements>

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

<do_not>
  <item importance="critical">Do not run security tests without permission</item>
  <item importance="critical">Do not test production without permission</item>
  <item importance="high">Do not perform destructive actions and mass deletions</item>
  <item importance="high">Do not extract or store real user data</item>
</do_not>

<example_checks>
  <check>Verify User role access to an Admin resource (must be forbidden)</check>
  <check>Verify session expiration and inaccessibility after logout</check>
  <check>Verify handling of dangerous characters in input fields</check>
</example_checks>
