---
name: coder-system-design-external-api
description: Use when designing or reviewing production external API integrations for auth, limits, retries, idempotency, and failure handling.
---

<when_to_use>
  <trigger>Designing or reviewing third-party API integrations for production services</trigger>
  <trigger>Choosing provider auth, timeout, retry, idempotency, and rate-limit strategy</trigger>
  <trigger>Planning resilience, observability, and contract-change handling for an external dependency</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use for first-party or internal API contract design when `coder-system-design-api-design` is the better fit.</item>
</when_not_to_use>
<input_requirements>
  <required>Provider contract, SLA/SLO, rate limits, and deprecation policy</required>
  <required>Auth method, credential lifecycle constraints, and secret-handling requirements</required>
  <required>Error model, retry semantics, and mutation idempotency expectations</required>
  <required>Business criticality, degradation tolerance, and observability requirements</required>
</input_requirements>

<workflow>
  <step>Gather provider contract, auth, limits, mutation semantics, business criticality, and deprecation policy.</step>
  <step>Choose timeout budget, retry eligibility, throttling, idempotency, fallback, and secret-handling controls as one integration policy.</step>
  <step>Check observability, compatibility verification, and runbook expectations, then produce the integration strategy with open risks.</step>
</workflow>

<reliability_patterns>
  <pattern>Use bounded retries with backoff and jitter only for transient failures</pattern>
  <pattern>Use circuit breaker with half-open probing to prevent cascades</pattern>
  <pattern>Respect 429 and Retry-After with client-side throttling</pattern>
  <pattern>Use graceful degradation for non-critical dependency paths</pattern>
  <pattern>Use async decoupling when provider latency is highly variable</pattern>
</reliability_patterns>

<security_controls>
  <control>Use least-privilege scopes and short-lived credentials where possible</control>
  <control>Automate secret rotation and revocation, and protect refresh flows</control>
  <control>Prevent secret leakage in logs, traces, and error payloads</control>
</security_controls>

<quality_rules>
  <rule importance="critical">No external call path is accepted without explicit timeout</rule>
  <rule importance="critical">No mutating provider operation is accepted without idempotency or duplicate-submission control</rule>
  <rule importance="high">No retry policy is accepted without eligibility limits, jitter, and 429 handling</rule>
  <rule importance="high">No provider integration is accepted without observability and contract-change handling</rule>
</quality_rules>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">Decisions are traceable to provider documentation and business criticality.</item>
  <item importance="high">The summary shows monitoring, failure handling, and compatibility checks.</item>
</validation>
<do_not>
  <item importance="critical">Do not apply retries blindly to all errors</item>
  <item importance="high">Do not treat provider SDK defaults as a sufficient production policy</item>
  <item importance="high">Do not keep long-lived static credentials without rotation</item>
</do_not>

<output_requirements>
  <requirement>Integration strategy with provider constraints and failure modes</requirement>
  <requirement>Timeout, retry, throttling, and idempotency policy summary</requirement>
  <requirement>Auth and secret lifecycle control plan</requirement>
  <requirement>Monitoring, compatibility-check, and degradation or runbook notes</requirement>
</output_requirements>

<references>
  <source url="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/">AWS Builders Library: Timeouts, Retries, Backoff with Jitter</source>
  <source url="https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker">Azure Circuit Breaker Pattern</source>
  <source url="https://www.rfc-editor.org/rfc/rfc6585">RFC 6585 (429 Too Many Requests)</source>
  <source url="https://docs.stripe.com/api/idempotent_requests">Stripe Idempotent Requests</source>
  <source url="https://www.rfc-editor.org/rfc/rfc9700">RFC 9700 OAuth 2.0 Security BCP</source>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">OWASP Secrets Management Cheat Sheet</source>
  <source url="https://docs.pact.io/consumer">Pact Consumer Contract Testing</source>
</references>
