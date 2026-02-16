---
name: testing-api-manual
description: Manually verify API behavior with reproducible requests and response checks; not contract version compatibility governance
---

<input_requirements>
  <required>Base environment URL</required>
  <required>Auth scheme and access</required>
  <required>Endpoints and contracts list (params, bodies, responses)</required>
  <optional>Spec (OpenAPI/Swagger) and API version</optional>
  <optional>Test data and initial state</optional>
  <optional>Rate limit and timeout constraints</optional>
</input_requirements>

<preparation>
  <steps>
    <step>Verify environment availability and basic health</step>
    <step>Prepare tokens/keys and store them in variables</step>
    <step>Prepare a minimal set of reusable curl templates</step>
    <step>Set up request-id/correlation-id variables (if used)</step>
  </steps>
</preparation>

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
