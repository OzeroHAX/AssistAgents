---
name: review-arch-full-check
description: "Full architecture review: validate decisions, trade-offs, NFRs, risks, and rollback plans before launch. Use when evaluating major system changes, new service introductions, or initiatives with long-term architectural consequences."
---

<when_to_use>
  <trigger>Major changes to architecture or public contracts</trigger>
  <trigger>High risk in reliability, security, or scalability</trigger>
  <trigger>Before launching an initiative with long-term consequences</trigger>
</when_to_use>

<input_requirements>
  <required>ADR or equivalent document with options and selected approach</required>
  <required>Change goals and success criteria</required>
  <required>Description of impact on NFRs (reliability, performance, security, operability)</required>
  <required>Rollout and rollback plan</required>
  <optional>Cost estimate and team constraints</optional>
</input_requirements>

<method>
  <step>Review the ADR problem statement — verify it explains why the current state is insufficient. GATE: if the problem is vague, stop and request clarification before proceeding.</step>
  <step>Validate options: confirm at least two alternatives were evaluated; check that rejection rationale cites specific criteria, not just preference. GATE: if trade-offs are undocumented, flag as blocking.</step>
  <step>Check decision traceability: verify links to ADRs, tasks, and implementation artifacts exist and are reachable.</step>
  <step>Assess each NFR dimension using this checklist:
    - Reliability: [ ] SLOs defined, [ ] failure modes enumerated, [ ] circuit breakers / retries specified
    - Performance: [ ] baseline metrics captured, [ ] load projections documented, [ ] degradation thresholds set
    - Security: [ ] threat model updated, [ ] new attack surfaces listed, [ ] auth/authz changes reviewed
    - Observability: [ ] dashboards identified, [ ] alerting rules specified, [ ] runbook updated</step>
  <step>Build risk register: for each risk, document severity (Critical/High/Medium/Low), likelihood, mitigation plan, and assigned owner. GATE: critical risks without mitigations or owners are blocking.</step>
  <step>Evaluate rollout/rollback: verify the plan includes feature flags or canary stages, measurable go/no-go signals, and a tested rollback procedure with estimated time to revert.</step>
</method>

<example>
  **NFR Assessment Snippet:**

  | Dimension | Impact | Mitigation | Owner |
  |-----------|--------|------------|-------|
  | Reliability | New SPOF in cache layer | Circuit breaker + fallback to direct DB reads | Platform team |
  | Performance | +15ms p99 from serialization | Benchmark before/after; accept if within SLO | Backend team |
  | Security | New public API endpoint | WAF rules + rate limiting + auth required | Security team |

  **Risk Register Entry:**
  - **Risk:** Cache invalidation race condition during deploy
  - **Severity:** High | **Likelihood:** Medium
  - **Mitigation:** Blue-green deploy with dual-write period; verify cache consistency post-switch
  - **Owner:** Platform team
</example>

<quality_rules>
  <rule importance="critical">A decision without explicit trade-offs and consequences is not considered ready</rule>
  <rule importance="critical">Critical risks have mitigations and assigned owners</rule>
  <rule importance="high">There are measurable signals of post-release success and degradation</rule>
  <rule importance="high">The rollout/rollback plan is realistic and verifiable</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not approve architecture without validating NFR impact</item>
  <item importance="high">Do not leave irreversible changes without a rollback strategy</item>
  <item importance="high">Do not stop at diagrams without operational implications</item>
</do_not>

<output_requirements>
  <requirement>Final status: approve, approve-with-conditions, or reject</requirement>
  <requirement>List of launch conditions and mandatory follow-up steps</requirement>
  <requirement>Explicit risk register with severity, likelihood, mitigation, and owner</requirement>
</output_requirements>
