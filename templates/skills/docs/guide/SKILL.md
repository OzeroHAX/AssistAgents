---
name: docs-guide
description: Use when the request is for a practical guide or setup/use instructions for a project-specific tool, package, environment, or repo operation
---

<purpose>
  <item>Create or update a guide that enables the intended audience to set up, run, use, or troubleshoot a concrete project artifact.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the request is for a guide, runbook, manual, or setup instructions tied to a concrete project-specific tool, workflow, environment, or repo operation.</item>
  <item importance="high">Use when the output must help someone complete a real task with explicit steps, commands, paths, options, constraints, or expected results.</item>
</when_to_use>

<input_requirements>
  <required>The tool, workflow, environment, or process being documented.</required>
  <required>The intended audience.</required>
  <optional>Prerequisites, dependencies, constraints, or target document path.</optional>
</input_requirements>

<workflow>
  <step>Confirm the request is about using or operating a concrete project artifact, not theory or architecture.</step>
  <step>Capture the audience, prerequisites, required steps, commands, constraints, and expected results.</step>
  <step>Structure the guide around the sections needed for execution, such as prerequisites, setup, usage, troubleshooting, and verification.</step>
  <step>Write concise instructions with exact project terms, commands, paths, and expected results.</step>
  <step>Create or update the document under <code>ai-docs/guides/&lt;name&gt;</code> unless another path was specified.</step>
</workflow>

<output_requirements>
  <requirement>Produce a structured guide with headings in execution order.</requirement>
  <requirement>Make prerequisites, commands, paths, options, expected results, and verification explicit.</requirement>
  <requirement>Keep the content practical and tied to the specific project artifact.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for architecture descriptions, technical overviews, or conceptual explanations.</item>
  <item importance="critical">Do not use for programming theory, coding standards, or design-pattern guidance.</item>
  <item importance="critical">Do not use for generic tutorials that are not tied to a concrete project artifact.</item>
  <item importance="critical">Do not use for implementation, code review, testing, or documentation-review tasks.</item>
</when_not_to_use>

<validation>
  <item importance="critical">The request is about setting up, using, operating, or troubleshooting a concrete project artifact.</item>
  <item importance="high">The guide contains enough explicit steps, commands, paths, or rules for the intended audience to act without extra context.</item>
  <item importance="high">The result stays practical and project-specific rather than conceptual or generic.</item>
</validation>
