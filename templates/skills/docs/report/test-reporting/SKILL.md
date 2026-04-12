---
name: docs-report-test-reporting
description: Use when the request is to author a test report summarizing verification scope, run results, and discovered issues
---

<purpose>
  <item>Produce a test-report artifact from completed or attempted verification work.</item>
  <item>Keep test reporting separate from running tests, test planning, and standalone bug reporting.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the user asks for a test report, QA report, verification summary, or regression report artifact.</item>
  <item importance="high">Use when the output should capture executed checks, outcomes, issues, blockers, and a readiness signal.</item>
  <item importance="high">Use when the artifact belongs under `ai-docs/reports/test-reports/**` or another explicit test-report path.</item>
</when_to_use>

<input_requirements>
  <required>The verified scope, feature, build, or release candidate covered by the report.</required>
  <required>Executed checks or scenarios with outcomes and evidence.</required>
  <required>Any discovered issues, blockers, or links to related bug reports.</required>
  <required>The target report path or enough naming context to derive one.</required>
</input_requirements>

<workflow>
  <step>Confirm the request is for authoring a test-report artifact, not for executing tests.</step>
  <step>Collect scope, executed checks, outcomes, evidence, and any blocked or not-run areas.</step>
  <step>Write a concise report that separates passed, failed, blocked, and not-run coverage when relevant.</step>
  <step>Record discovered issues or linked bug reports and end with a readiness or risk signal.</step>
  <step>Save the artifact under `ai-docs/reports/test-reports/<name>.md` or the user-specified report path.</step>
</workflow>

<output_requirements>
  <requirement>Create or update the requested test-report artifact.</requirement>
  <requirement>State scope, executed checks, outcomes, and discovered issues or blockers.</requirement>
  <requirement>Make blocked or not-run coverage explicit when relevant.</requirement>
  <requirement>End with a concise readiness or risk signal.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="critical">Do not use for per-defect bug reports.</item>
  <item importance="high">Do not use for test strategy, test plans, or test cases.</item>
  <item importance="high">Do not use when a broader authoring or review skill is required to drive behavior.</item>
</when_not_to_use>

<validation>
  <item importance="critical">The request is for a test-report artifact rather than test execution or test planning.</item>
  <item importance="high">The result states scope, executed checks, outcomes, and issues or blockers.</item>
  <item importance="high">The artifact path is a test-report location, preferably `ai-docs/reports/test-reports/**`, unless the user overrides it.</item>
  <item importance="high">The result is not mistaken for a standalone bug report.</item>
</validation>
