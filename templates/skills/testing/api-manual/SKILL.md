---
name: testing-api-manual
description: Use for manual API checks with reproducible HTTP requests and explicit response verification; not contract compatibility governance or automation design
---

<when_to_use>
  <trigger>Manual API verification from endpoint contracts, examples, or acceptance criteria</trigger>
  <trigger>Manual endpoint behavior checks against approved environments</trigger>
  <trigger>Need reproducible curl or HTTP requests with explicit pass-fail evidence</trigger>
</when_to_use>

<input_requirements>
  <required>Base environment URL</required>
  <required>Auth scheme and access</required>
  <required>Endpoints and contracts list (params, bodies, responses)</required>
  <optional>Spec (OpenAPI/Swagger) and API version</optional>
  <optional>Test data and initial state</optional>
  <optional>Rate limit and timeout constraints</optional>
</input_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for provider-consumer contract compatibility governance or versioning decisions.</item>
  <item importance="critical">Do not use for automation design or as a replacement for implementation, planning, or static review work.</item>
  <item importance="high">Do not use in production or destructive environments without explicit permission.</item>
</when_not_to_use>

<workflow>
  <step>Confirm environment, auth, endpoint contracts, data assumptions, and destructive boundaries.</step>
  <step>Prepare reproducible requests, variables, and correlation identifiers.</step>
  <step>Define positive, negative, and edge scenarios with expected status, schema, and outcome.</step>
  <step>Execute requests and record headers, parameters, dependencies, and responses.</step>
  <step>Summarize pass-fail evidence, defects, and environment or data constraints.</step>
</workflow>

<execution_rules>
  <rule importance="critical">Every request must be reproducible</rule>
  <rule importance="critical">Verify status code and response contract</rule>
  <rule importance="high">Cover positive and negative scenarios</rule>
  <rule importance="high">Record headers and parameters that affect behavior</rule>
  <rule importance="high">Verify response schema and field types</rule>
  <rule importance="high">Verify pagination, sorting, and filtering</rule>
  <rule importance="high">Verify idempotency where applicable</rule>
  <rule importance="medium">Note dependencies between requests (chain)</rule>
</execution_rules>

<coverage>
  <focus>
    <item>CRUD scenarios</item>
    <item>Input validation</item>
    <item>Authorization and access control</item>
    <item>Errors and edge cases</item>
    <item>Pagination/filtering/sorting</item>
    <item>Rate limiting and error codes</item>
  </focus>
</coverage>

<quality_rules>
  <rule importance="critical">Expected outcome is stated unambiguously</rule>
  <rule importance="high">No duplicate scenarios with different wording</rule>
  <rule importance="high">Server and client errors are distinguished and verified separately</rule>
  <rule importance="high">Record request-id/correlation-id when available</rule>
  <rule importance="medium">If result recording is needed, use a single consistent format</rule>
</quality_rules>

<output_requirements>
  <requirement>For each scenario, list the request, expected result, observed result, and pass-fail outcome.</requirement>
  <requirement>Record environment assumptions, test data, and headers or parameters that materially affect behavior.</requirement>
  <requirement>Separate positive, negative, and edge findings and include response snippets or request identifiers when relevant.</requirement>
</output_requirements>

<validation>
  <item importance="critical">Scenarios or checks are reproducible and have explicit expected results.</item>
  <item importance="critical">Environment, data, and execution constraints are recorded or assumed explicitly.</item>
  <item importance="high">Result capture, pass-fail signals, or evidence recording are explicit.</item>
</validation>

<do_not>
  <item importance="critical">Do not run destructive requests in production</item>
  <item importance="high">Do not use real user data</item>
  <item importance="high">Do not mutate state unless the scenario requires it</item>
  <item importance="high">Do not leak tokens/keys into shell history or logs</item>
</do_not>

<example_templates>
  <template>curl -X GET "$BASE_URL/resource" -H "Authorization: Bearer $TOKEN"</template>
  <template>curl -X POST "$BASE_URL/resource" -H "Content-Type: application/json" -d '{"key":"value"}'</template>
  <template>curl -X GET "$BASE_URL/resource?page=1&limit=20" -H "Authorization: Bearer $TOKEN"</template>
</example_templates>
