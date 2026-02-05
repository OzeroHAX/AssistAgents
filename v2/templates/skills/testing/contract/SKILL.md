---
name: testing-contract
description: API contract testing (OpenAPI/Pact, compatibility)
---

<input_requirements>
  <required>Providers and consumers (consumer/provider)</required>
  <required>Contract source (OpenAPI/Pact) and version</required>
  <required>Environments for provider and consumer verification</required>
  <optional>Versioning and compatibility rules</optional>
  <optional>List of critical contracts and endpoints</optional>
</input_requirements>

<design_rules>
  <rule importance="critical">The contract specifies required and optional fields</rule>
  <rule importance="high">The contract includes success and error responses</rule>
  <rule importance="high">Contract changes are versioned</rule>
  <rule importance="medium">The contract contains no secrets or real data</rule>
</design_rules>

<execution_rules>
  <rule importance="critical">The provider passes contract verification</rule>
  <rule importance="high">Consumer expectations are verified automatically</rule>
  <rule importance="high">Backward compatibility is verified on changes</rule>
  <rule importance="high">Contract and service versions are recorded</rule>
  <rule importance="medium">Failures are classified as breaking/non-breaking</rule>
</execution_rules>

<coverage>
  <focus>
    <item>Required fields and data types</item>
    <item>Optional fields and default values</item>
    <item>Error codes and error format</item>
    <item>Pagination/sorting/filtering</item>
    <item>Authorization and access control</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">All checks are reproducible and documented</rule>
  <rule importance="high">There is a link between the contract and the test/check</rule>
  <rule importance="high">Results include contract versions and identifiers</rule>
  <rule importance="medium">Artifacts are recorded (reports/logs)</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not publish contracts without passing verification</item>
  <item importance="high">Do not mix consumer and provider environments</item>
  <item importance="high">Do not accept breaking changes without bumping the version</item>
</do_not>

<example_checks>
  <check>Verify that the provider returns required fields per contract</check>
  <check>Verify error format and response codes</check>
</example_checks>
