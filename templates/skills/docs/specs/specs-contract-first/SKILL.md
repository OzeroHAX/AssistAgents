---
name: docs-specs-contract-first
description: Spec-first / contract-first documentation workflow for APIs (OpenAPI/AsyncAPI), examples, validation, and linking contract tests.
---

<skill_overview>
  <purpose>Keep interfaces explicit and verifiable: write contracts first, then implement.</purpose>
  <triggers>
    <trigger>User asks to create or update an API specification</trigger>
    <trigger>Need to document contracts for consumers/producers</trigger>
    <trigger>Need to link contract tests to documented specs</trigger>
  </triggers>
  <sources>
    <source url="https://spec.openapis.org/oas/latest.html">OpenAPI Specification</source>
    <source url="https://github.com/asyncapi/spec">AsyncAPI Specification</source>
  </sources>
</skill_overview>

<storage>
  <rule>Directory map + write access lives in docs-storage-artifact-registry</rule>
  <rule>Store specifications under ai-docs/project/specs/ (project-specific structure).</rule>
  <rule>Contract tests live in the codebase (not in ai-docs/); docs must link to their locations.</rule>
  <rule>If the project already has spec validation tooling, document the exact commands used (lint/validate/generate).</rule>
</storage>

<workflow>
  <step>1. Define contract (paths/events, schemas, errors) and examples payloads.</step>
  <step>2. Identify consumers/producers and review contract shape.</step>
  <step>3. Validate/lint spec using project tooling (if available).</step>
  <step>4. Link contract tests (paths in repo) and note verification steps.</step>
</workflow>
