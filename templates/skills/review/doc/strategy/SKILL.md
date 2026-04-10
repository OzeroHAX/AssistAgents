---
name: review-doc-strategy
description: Use when reviewing a documentation draft or diff for publication readiness, task fitness, and evidence-based feedback.
---

<when_to_use>
  <trigger>A documentation draft or diff must be reviewed before publish or merge.</trigger>
  <trigger>A guide, runbook, API document, ADR, or onboarding document needs a readiness verdict tied to the target user task.</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to edit the reviewed artifact directly.</item>
  <item importance="high">Do not use when there is no concrete draft, diff, or published artifact to review.</item>
  <item importance="high">Do not use for broad documentation governance design without a target review artifact.</item>
</when_not_to_use>

<input_requirements>
  <required>Document type (guide, runbook, API, ADR, onboarding)</required>
  <required>Target audience and the task they must complete</required>
  <required>Document draft, published artifact, or change diff</required>
  <optional>Project style guide, glossary, or documentation standards</optional>
</input_requirements>

<workflow>
  <step order="1">Confirm the review target, audience task, and evidence source (draft, artifact, or diff).</step>
  <step order="2">Check whether the document enables the target user to complete the task safely and correctly.</step>
  <step order="3">Verify factual accuracy, commands, examples, and expected results against the provided artifact context.</step>
  <step order="4">Check scenario completeness: prerequisites, steps, expected result, failure handling, and troubleshooting.</step>
  <step order="5">Record findings with severity, evidence, publication impact, and a final decision: publish or revise.</step>
</workflow>

<severity_model>
  <level name="blocking">An issue that prevents the reader from completing the task safely and correctly</level>
  <level name="major">A significant gap or ambiguity that increases error risk</level>
  <level name="minor">Local improvements to wording, structure, or examples</level>
</severity_model>

<quality_rules>
  <rule importance="critical">Judge the document against the target user task, not text volume or style alone.</rule>
  <rule importance="high">Tie each blocking or major finding to concrete evidence and a fixable change.</rule>
  <rule importance="high">Keep required fixes separate from recommended improvements.</rule>
  <rule importance="high">End with an explicit decision: publish or revise.</rule>
</quality_rules>

<validation>
  <item importance="critical">Each verdict and finding maps to concrete evidence, artifact context, or review criteria.</item>
  <item importance="critical">Severity and blocking status are explicit for each required fix.</item>
  <item importance="high">The review stays within review scope and does not drift into authoring or implementation work.</item>
  <item importance="high">The final output contains a publish/revise decision plus required and recommended actions.</item>
</validation>

<do_not>
  <item importance="critical">Do not accept a document with factual errors for the sake of publication speed.</item>
  <item importance="high">Do not suggest stylistic edits that do not improve clarity or task completion.</item>
</do_not>

<output_requirements>
  <requirement>Short verdict with explicit decision: `publish` or `revise`</requirement>
  <requirement>Required fixes with severity, evidence, and publication impact</requirement>
  <requirement>Recommended improvements listed separately from required fixes</requirement>
</output_requirements>
