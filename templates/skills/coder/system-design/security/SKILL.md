---
name: coder-system-design-security
description: Use when designing or reviewing system architecture for trust boundaries, sensitive data, auth, secrets, or supply-chain risk.
---

<when_to_use>
  <trigger>Designing or reviewing architecture with trust boundaries or attacker paths</trigger>
  <trigger>Handling sensitive data, auth flows, secrets, or third-party dependencies</trigger>
  <trigger>Need explicit security controls, verification gates, or residual-risk decisions before release</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when API contract, schema migration, or external API integration design is the primary task.</item>
  <item importance="high">Do not use for incident response, penetration testing, or operational security testing.</item>
</when_not_to_use>
<input_requirements>
  <required>System context, trust boundaries, and sensitive-data paths</required>
  <required>AuthN/AuthZ model, identities, and privileged operations</required>
  <required>Compliance, business impact, and risk constraints</required>
  <required>Deployment model and supply-chain context</required>
</input_requirements>

<workflow>
  <step>Map trust boundaries, identities, sensitive-data paths, and dependencies.</step>
  <step>Choose controls for auth, secrets, encryption, logging, dependency governance, and monitoring from attacker paths and impact.</step>
  <step>Produce a security design summary with selected controls, verification gates, and residual risks.</step>
</workflow>

<security_baseline>
  <item>Threat models exist for critical paths and change with architecture</item>
  <item>Authorization is deny-by-default and checked server-side per request</item>
  <item>Secrets are centrally managed with rotation and audit trails</item>
  <item>Sensitive data classes are mapped to handling, retention, and access policies</item>
  <item>Encryption in transit and at rest is enforced with key lifecycle controls</item>
  <item>Supply chain has dependency governance and provenance controls</item>
  <item>Logging covers security-relevant events without leaking sensitive values</item>
</security_baseline>

<quality_rules>
  <rule importance="critical">No implicit trust based on network location alone</rule>
  <rule importance="critical">No plaintext secret handling in code, logs, or build outputs</rule>
  <rule importance="high">No privileged operation without auditable identity and authorization</rule>
  <rule importance="high">No critical-path release without security verification evidence</rule>
</quality_rules>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">Controls are traceable to trust boundaries, attacker paths, sensitive-data handling, and supply-chain context.</item>
  <item importance="high">The summary includes verification gates, residual risks, and required monitoring or incident hooks.</item>
</validation>
<do_not>
  <item importance="critical">Do not rely only on edge or gateway auth checks</item>
  <item importance="high">Do not keep long-lived credentials without rotation policy</item>
  <item importance="high">Do not log tokens, passwords, private keys, or sensitive PII</item>
  <item importance="high">Do not skip threat-model update for major architecture changes</item>
</do_not>

<output_requirements>
  <requirement>Security design summary with selected controls and rationale</requirement>
  <requirement>Security checklist result with pass/fail evidence expectations</requirement>
  <requirement>Open risks, owners, mitigation, and residual-risk note</requirement>
  <requirement>Required release gates, monitoring, and incident hooks</requirement>
</output_requirements>

<references>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html">OWASP Threat Modeling Cheat Sheet</source>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html">OWASP Authorization Cheat Sheet</source>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">OWASP Secrets Management Cheat Sheet</source>
  <source url="https://csrc.nist.gov/pubs/sp/800/207/final">NIST SP 800-207 Zero Trust Architecture</source>
  <source url="https://csrc.nist.gov/pubs/sp/800/218/final">NIST SP 800-218 SSDF</source>
  <source url="https://slsa.dev/spec/v1.0/levels">SLSA Levels</source>
</references>
