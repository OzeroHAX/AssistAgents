---
name: planning-requirements-extraction
description: Use when a planning request must be converted into explicit goals, requirements, acceptance criteria, and bug repro details
---

<purpose>
  <item>Convert a planning request into verifiable requirements before solution design or implementation.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when a feature, bug, or change request must be restated as explicit goals, constraints, and acceptance criteria.</item>
  <item importance="high">Use when the input contains mixed intent, evidence, or bug symptoms and the next planning step needs a clean requirement baseline.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use for task classification, scope definition, or test planning unless the request first needs requirement extraction.</item>
</when_not_to_use>

<input_requirements>
  <required>Task description, request text, or bug report</required>
  <optional>Constraints, desired UX, acceptance hints, docs, logs, or stack traces</optional>
  <optional>Relevant planning sources such as `ai-docs/project/brief.md`, `ai-docs/project/prd.md`, or task docs</optional>
</input_requirements>

<workflow>
  <step>Restate the requested outcome as a behavior or user-visible result, not an implementation plan.</step>
  <step>Extract functional requirements and preserve constraints or dependencies that affect acceptable solutions.</step>
  <step>Add non-functional requirements only when the input gives evidence they matter.</step>
  <step>Derive 3-7 verifiable acceptance criteria; if evidence is missing, record an open question instead of inventing one.</step>
  <step>For bugs, separate facts from hypotheses and capture observed vs expected plus repro steps, or state that repro is unknown.</step>
</workflow>

<output_requirements>
  <requirement>Return sections for Goal, Functional requirements, Non-functional requirements (if any), Acceptance criteria, Bug repro / observed vs expected (if bug), and Open questions.</requirement>
  <requirement>Keep the result implementation-agnostic; do not turn requirements into technical tasks or design decisions.</requirement>
  <requirement>Surface missing evidence as open questions.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Acceptance criteria are specific, verifiable, and free of implementation details.</rule>
  <rule importance="high">Constraints and dependencies are preserved when they affect the result.</rule>
  <rule importance="high">For bugs, facts are separated from hypotheses.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output contains the required sections and each section is tied to the request, evidence, or stated constraints.</item>
  <item importance="critical">Acceptance criteria are testable or observable, and missing evidence is surfaced as an open question.</item>
  <item importance="high">For bugs, observed vs expected and repro are explicit, or the lack of a reliable repro is stated plainly.</item>
</validation>

<do_not>
  <item importance="critical">Do not turn requirements into technical tasks.</item>
  <item importance="high">Do not invent acceptance criteria without evidence.</item>
  <item importance="high">Do not mix bug facts with hypotheses.</item>
</do_not>
