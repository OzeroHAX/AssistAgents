---
name: testing-contract
description: Use when verifying provider-consumer API contract compatibility and versioning from an OpenAPI or Pact-style contract; not for ad-hoc endpoint behavior checks
---

<when_to_use>
  <item importance="critical">Use when verifying provider-consumer compatibility against a formal contract or contract version, especially before publishing a change.</item>
</when_to_use>

<input_requirements>
  <required>Provider and consumer under verification</required>
  <required>Contract source and contract version or artifact</required>
  <required>Provider and consumer versions or build identifiers</required>
  <required>Verification environments</required>
  <optional>Versioning and compatibility rules</optional>
  <optional>Changed endpoints or critical integrations</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for ad-hoc endpoint behavior checks or manual API testing without contract-governance intent.</item>
  <item importance="critical">Do not use as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step importance="critical">Confirm the provider-consumer pair, contract source/version, service versions, environments, and the rule for breaking versus non-breaking changes.</step>
  <step importance="critical">Identify the changed or risky contract surfaces: fields, responses, authorization rules, and collection behavior such as pagination, sorting, and filtering.</step>
  <step importance="critical">Run provider verification and consumer expectation checks against the same contract version.</step>
  <step importance="high">Compare with the previous compatible version when needed, classify failures as breaking or non-breaking, and produce the final recommendation with evidence.</step>
</workflow>

<execution_rules>
  <rule importance="critical">Provider verification and consumer expectation checks use the same contract version</rule>
  <rule importance="critical">The provider passes contract verification before publication or release</rule>
  <rule importance="high">Backward compatibility is verified on changes</rule>
  <rule importance="high">Contract and service versions are recorded</rule>
  <rule importance="medium">Failures are classified as breaking or non-breaking</rule>
</execution_rules>

<output_requirements>
  <requirement importance="critical">Produce a summary with provider, consumer, contract source/version, service versions, environments, and overall pass-fail status.</requirement>
  <requirement importance="critical">For each failed or risky interaction, record the expected contract behavior, observed result, affected interaction, and whether the issue is breaking or non-breaking.</requirement>
  <requirement importance="high">State whether a version bump or contract update is required and link the supporting report, log, or diff evidence.</requirement>
</output_requirements>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not publish contracts without passing verification</item>
  <item importance="high">Do not mix consumer and provider environments</item>
  <item importance="high">Do not accept breaking changes without bumping the version</item>
</do_not>

<example_checks>
  <check>Verify that the provider returns required fields per contract</check>
  <check>Verify error format and response codes</check>
  <check>Verify backward compatibility after adding an optional field</check>
</example_checks>
