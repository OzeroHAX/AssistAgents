---
name: review-doc-quality
description: Documentation quality checklist: accuracy, completeness, consistency, and freshness
---

<when_to_use>
  <trigger>A short quality gate is needed before publishing a document</trigger>
  <trigger>An audit of existing documentation fitness is required</trigger>
</when_to_use>

<input_requirements>
  <required>Document text or diff</required>
  <required>Target audience and expected reading outcome</required>
  <optional>Relevant links to product/interfaces/contracts</optional>
</input_requirements>

<core_checks>
  <check priority="P0">Accuracy: facts, commands, parameters, and examples are correct and reproducible</check>
  <check priority="P0">Completeness: prerequisites, main flow, errors, and next steps are covered</check>
  <check priority="P1">Consistency: unified terminology, entity naming, and section structure</check>
  <check priority="P1">Clarity: text is scannable, steps are short, and each step outcome is clear</check>
  <check priority="P1">Freshness: versions, update date, and document owner are specified</check>
  <check priority="P2">Accessibility/readability: neutral language, clear labels, minimal ambiguity</check>
</core_checks>

<pass_criteria>
  <rule>All P0 items are confirmed</rule>
  <rule>Actions and priorities are defined for P1/P2 findings</rule>
</pass_criteria>

<do_not>
  <item importance="critical">Do not publish a document with non-reproducible commands and examples</item>
  <item importance="high">Do not hide known limitations and caveats</item>
</do_not>

<output_requirements>
  <requirement>Review result: PASS or FAIL</requirement>
  <requirement>List of quality defects with priorities and proposed fixes</requirement>
</output_requirements>
