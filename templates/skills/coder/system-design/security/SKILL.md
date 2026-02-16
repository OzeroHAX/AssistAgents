---
name: coder-system-design-security
description: Security-by-design baseline for architecture decisions, controls, and verification.
---

<when_to_use>
  <trigger>Designing or reviewing architecture with user, service, or data trust boundaries</trigger>
  <trigger>Handling sensitive data, auth flows, secrets, or third-party dependencies</trigger>
  <trigger>Need explicit security gates before implementation or release</trigger>
</when_to_use>

<input_requirements>
  <required>System context and trust boundaries</required>
  <required>Data classification and retention rules</required>
  <required>AuthN/AuthZ model and identity providers</required>
  <required>Compliance and risk constraints</required>
  <required>Deployment and supply-chain context</required>
</input_requirements>

<security_baseline>
  <item>Threat model exists for critical paths and is updated on architecture changes</item>
  <item>Authorization is deny-by-default and checked server-side per request</item>
  <item>Secrets are centrally managed with rotation and audit trails</item>
  <item>Sensitive data classes are mapped to handling and access policies</item>
  <item>Encryption in transit and at rest is enforced with key lifecycle controls</item>
  <item>Supply chain has dependency governance and artifact provenance controls</item>
  <item>Logging includes security-relevant events with redaction of sensitive values</item>
</security_baseline>

<decision_framework>
  <step>Classify data and business impact</step>
  <step>Map trust boundaries and attacker paths</step>
  <step>Select control level (baseline, enhanced, critical)</step>
  <step>Record decisions and residual risk in architecture notes</step>
  <step>Attach verification gates to delivery pipeline</step>
</decision_framework>

<quality_rules>
  <rule importance="critical">No implicit trust based on network location alone</rule>
  <rule importance="critical">No plaintext secret handling in code, logs, or build outputs</rule>
  <rule importance="high">No privileged operation without auditable identity and authorization</rule>
  <rule importance="high">No release of critical path without security verification evidence</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not rely only on edge/gateway auth checks</item>
  <item importance="high">Do not keep long-lived credentials without rotation policy</item>
  <item importance="high">Do not log tokens, passwords, private keys, or sensitive PII</item>
  <item importance="high">Do not skip threat-model update for major architecture changes</item>
</do_not>

<output_requirements>
  <requirement>Security checklist result with pass/fail and evidence</requirement>
  <requirement>Decision summary with selected controls and rationale</requirement>
  <requirement>Open risks with owner and mitigation plan</requirement>
  <requirement>Required runtime monitoring and incident hooks</requirement>
</output_requirements>

<references>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html">OWASP Threat Modeling Cheat Sheet</source>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html">OWASP Authorization Cheat Sheet</source>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">OWASP Secrets Management Cheat Sheet</source>
  <source url="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html">OWASP Logging Cheat Sheet</source>
  <source url="https://csrc.nist.gov/pubs/sp/800/207/final">NIST SP 800-207 Zero Trust Architecture</source>
  <source url="https://csrc.nist.gov/pubs/sp/800/218/final">NIST SP 800-218 SSDF</source>
  <source url="https://slsa.dev/spec/v1.0/levels">SLSA Levels</source>
  <source url="https://www.cisa.gov/resources-tools/resources/secure-by-design">CISA Secure by Design</source>
</references>
