---
name: coder-system-design-external-api
description: Reliable and secure external API integration patterns for production-grade services.
---

<when_to_use>
  <trigger>Integrating third-party APIs or partner services</trigger>
  <trigger>Designing resilience around network and provider failures</trigger>
  <trigger>Handling provider limits, auth lifecycle, and contract evolution</trigger>
</when_to_use>

<input_requirements>
  <required>Provider SLA/SLO and rate limit policy</required>
  <required>Auth method and credential lifecycle constraints</required>
  <required>Error model and retry semantics from provider docs</required>
  <required>Business criticality and degradation tolerance</required>
</input_requirements>

<integration_workflow>
  <step>Document provider contract, limits, and deprecation policy</step>
  <step>Define timeout budget and retry eligibility matrix</step>
  <step>Implement resilience layer (timeouts, retries, circuit breaker, limiter)</step>
  <step>Add idempotency and duplicate submission controls for mutations</step>
  <step>Add observability, alerts, and runbooks before rollout</step>
  <step>Verify compatibility continuously with contract checks</step>
</integration_workflow>

<reliability_patterns>
  <pattern>Use bounded retries with exponential backoff and jitter for transient failures only</pattern>
  <pattern>Use circuit breaker with half-open probing to prevent cascade failures</pattern>
  <pattern>Use client-side throttling and respect 429 plus Retry-After semantics</pattern>
  <pattern>Use graceful degradation or fallback for non-critical dependency paths</pattern>
  <pattern>Use async decoupling where provider latency is highly variable</pattern>
</reliability_patterns>

<security_controls>
  <control>Use least-privilege scopes and short-lived credentials where possible</control>
  <control>Automate secret rotation, revocation, and audit logging</control>
  <control>Protect token refresh flows and enforce strict validation</control>
  <control>Prevent secret leakage in logs, traces, and error payloads</control>
</security_controls>

<quality_rules>
  <rule importance="critical">No external call path is accepted without explicit timeout</rule>
  <rule importance="critical">No mutating operation is accepted without idempotency plan</rule>
  <rule importance="high">No retry policy is accepted without limits and jitter</rule>
  <rule importance="high">No provider integration is accepted without observability signals and alerting</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not apply retries blindly to all errors</item>
  <item importance="high">Do not ignore provider deprecation/change notices</item>
  <item importance="high">Do not keep long-lived static credentials without rotation</item>
</do_not>

<output_requirements>
  <requirement>Integration architecture and failure-mode strategy</requirement>
  <requirement>Timeout, retry, and rate-limit policy summary</requirement>
  <requirement>Security controls and secret lifecycle plan</requirement>
  <requirement>Monitoring signals, SLO impact, and runbook pointers</requirement>
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
