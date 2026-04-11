---
name: docs-report-bug-reporting
description: Use when the request is to author a per-defect bug report with reproduction steps, expected vs actual behavior, impact, and priority
---

<purpose>
  <item>Produce a reproducible, triage-ready bug-report artifact for one defect.</item>
  <item>Keep bug reporting separate from defect fixing, test execution, and aggregate test reporting.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the user asks for a bug report, defect report, or regression defect artifact for a specific problem.</item>
  <item importance="high">Use when the result should capture reproduction steps, expected vs actual behavior, impact, evidence, and severity or priority.</item>
  <item importance="high">Use when the artifact belongs under `ai-docs/reports/bug-reports/**` or another explicit bug-report path.</item>
</when_to_use>

<input_requirements>
  <required>The affected feature, environment, build, or other defect context.</required>
  <required>Reproduction steps or enough observed behavior to describe how the defect appears.</required>
  <required>Expected behavior, actual behavior, and impact.</required>
  <required>Available evidence plus the target report path or enough naming context to derive one.</required>
</input_requirements>

<workflow>
  <step>Confirm the request is for authoring a bug-report artifact rather than for fixing, reviewing, or testing the defect.</step>
  <step>Collect context, reproduction steps, expected behavior, actual behavior, impact, and available evidence.</step>
  <step>Write a concise report that makes reproduction clear and surfaces severity or priority.</step>
  <step>Save the artifact under `ai-docs/reports/bug-reports/<name>.md` or the user-specified path, and make missing evidence or unknown triage signals explicit.</step>
</workflow>

<output_requirements>
  <requirement>Create or update the requested bug-report artifact.</requirement>
  <requirement>State context, reproduction steps, expected behavior, actual behavior, impact, and evidence when available.</requirement>
  <requirement>Make severity or priority explicit, or state that it is still unknown.</requirement>
  <requirement>Keep the report scoped to one defect.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="critical">Do not use for aggregate QA or test reports that summarize many checks or issues.</item>
  <item importance="high">Do not use for feature requests, change proposals, or root-cause analysis write-ups.</item>
  <item importance="high">Do not use when a broader authoring or review skill is required to drive the overall workflow.</item>
</when_not_to_use>

<validation>
  <item importance="critical">The request is for a bug-report artifact rather than defect fixing, test execution, or aggregate QA reporting.</item>
  <item importance="high">The result makes reproduction steps and expected vs actual behavior explicit enough for another person to understand the defect.</item>
  <item importance="high">The result states impact plus severity or priority, or explains why that triage signal is still unknown.</item>
  <item importance="high">The artifact path is a bug-report location, preferably `ai-docs/reports/bug-reports/**`, unless the user overrides it.</item>
</validation>
