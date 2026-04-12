---
name: planning-scope-definition
description: Use when a plan must define in-scope work, exclusions, assumptions, and non-goals
---

<purpose>
  <item>Define task boundaries before implementation so the plan stays focused and reviewable.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the user asks what is in scope, out of scope, assumed, or explicitly not part of the task.</item>
  <item importance="high">Use before implementation when scope creep, hidden assumptions, or unclear boundaries would weaken the plan.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<inputs>
  <required>Goal, requirements, or task statement</required>
  <optional>Constraints, deadlines, risks, or process limits</optional>
  <optional>Adjacent areas that must not be touched</optional>
</inputs>

<workflow>
  <step>Extract the target outcome and any stated constraints that limit scope.</step>
  <step>List in-scope work as concrete outcomes, behaviors, or deliverables.</step>
  <step>List out-of-scope items as explicit exclusions, with short reasons when the exclusion protects against scope creep.</step>
  <step>Record assumptions that materially affect implementation, sequencing, or estimates.</step>
  <step>Record open questions only if they can change boundaries, priorities, or approval.</step>
</workflow>

<output_requirements>
  <requirement>Provide sections named `In scope`, `Out of scope`, `Assumptions`, and `Open questions`.</requirement>
  <requirement>State each scope item as a verifiable claim tied to the task inputs or constraints.</requirement>
  <requirement>Keep exclusions explicit enough that reviewers can tell what will not be done in this task.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">In-scope and out-of-scope items are concrete, verifiable claims rather than vague intentions.</rule>
  <rule importance="high">Out-of-scope items are specific enough to prevent scope creep.</rule>
  <rule importance="high">Assumptions and open questions only remain if they can change boundaries, priorities, or implementation approach.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required scope sections and each section is tied to task inputs, constraints, or stated risks.</item>
  <item importance="critical">The output makes boundary decisions explicit enough that reviewers can distinguish planned work from exclusions.</item>
  <item importance="high">Open questions and assumptions are limited to items that can materially change scope or priorities.</item>
</validation>

<do_not>
  <item importance="critical">Do not turn assumptions into hidden commitments.</item>
  <item importance="high">Do not list generic future improvements as in-scope work without evidence from the request.</item>
</do_not>
