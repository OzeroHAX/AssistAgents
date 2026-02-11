---
name: review-doc-strategy
description: Documentation review strategy: readiness criteria, review flow, and feedback format
---

<when_to_use>
  <trigger>A unified documentation review process must be defined</trigger>
  <trigger>New or substantially updated instructions/guides are being published</trigger>
</when_to_use>

<input_requirements>
  <required>Document type (guide, runbook, API, ADR, onboarding)</required>
  <required>Target audience and their task</required>
  <required>Document draft or change diff</required>
  <optional>Project style guide and glossary</optional>
</input_requirements>

<review_flow>
  <step order="1">Check document fitness for the target user task</step>
  <step order="2">Check accuracy of facts, commands, and examples</step>
  <step order="3">Check scenario completeness: prerequisites, steps, expected result, troubleshooting</step>
  <step order="4">Check consistency of terminology, structure, and tone</step>
  <step order="5">Record publication status and required revisions</step>
</review_flow>

<severity_model>
  <level name="blocking">An issue that prevents the reader from completing the task safely and correctly</level>
  <level name="major">A significant gap or ambiguity that increases error risk</level>
  <level name="minor">Local improvements to wording, structure, or examples</level>
</severity_model>

<quality_rules>
  <rule importance="critical">The document is evaluated against the user task, not formal text volume</rule>
  <rule importance="high">All blocking findings are tied to specific locations and are fixable</rule>
  <rule importance="high">The review conclusion includes a decision: publish or revise</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not accept a document with factual errors for the sake of publication speed</item>
  <item importance="high">Do not suggest stylistic edits that do not improve clarity</item>
</do_not>

<output_requirements>
  <requirement>Short verdict and list of required fixes</requirement>
  <requirement>List of recommended improvements separated from required ones</requirement>
</output_requirements>
