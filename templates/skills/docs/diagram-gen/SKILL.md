---
name: docs-diagram-gen
description: Use when the request is to add or refine a Mermaid diagram inside architecture, flow, or scenario documentation
---

<purpose>
  <item>Add Mermaid diagrams to architecture, flow, and scenario documents.</item>
  <item>Visualize components, actors, transitions, and decision paths in a documentation-friendly form.</item>
  <item>Keep diagrams tied to a concrete document artifact rather than producing standalone generic graphics.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the user explicitly asks for a Mermaid diagram in an architecture document, flow description, or scenario/use-case document.</item>
  <item importance="high">Use when the task is to turn documented components, actors, steps, or relationships into a Mermaid block that improves an existing or new document.</item>
  <item importance="high">Use when the output should clarify system structure, request flow, sequence, state changes, or scenario paths for readers of documentation.</item>
</when_to_use>

<input_requirements>
  <required>The target document or enough context to identify whether the artifact is architecture, flow, or scenario documentation.</required>
  <required>The components, actors, steps, states, or relationships that must appear in the diagram.</required>
  <required>Any naming, boundary, or scope constraints that the diagram must preserve from the surrounding document.</required>
</input_requirements>

<workflow>
  <step>Confirm the request is for Mermaid-based documentation support rather than a general-purpose chart, UI mockup, or implementation task.</step>
  <step>Identify the document intent—architecture, flow, or scenario—and choose a Mermaid structure that matches that intent.</step>
  <step>Extract only the documented entities, steps, and relationships needed for the diagram; do not invent extra product or implementation details.</step>
  <step>Produce a Mermaid code block and concise surrounding text or label that can be inserted into the target document.</step>
</workflow>

<output_requirements>
  <requirement>Return or write a Mermaid code block that fits the requested documentation context.</requirement>
  <requirement>Keep labels and relationships consistent with the source document terminology.</requirement>
  <requirement>Prefer documentation-ready diagrams that explain architecture, flows, or scenarios over decorative or presentation-only graphics.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for arbitrary charts, dashboards, or generic graphs that are not part of architecture, flow, or scenario documentation.</item>
  <item importance="critical">Do not use for UI wireframes, screen mockups, design comps, or other visual design tasks.</item>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="high">Do not use when a stronger authoring or review skill is required to drive the surrounding document behavior.</item>
</when_not_to_use>
<validation>
  <item importance="critical">The request is specifically about adding or refining a Mermaid diagram in architecture, flow, or scenario documentation.</item>
  <item importance="high">The selected diagram structure matches the documentation intent and does not drift into arbitrary graphing or UI design.</item>
  <item importance="high">The output is a documentation-ready Mermaid block with terms grounded in the source material.</item>
  <item importance="high">Implementation, testing, review, and unrelated graphics tasks should route elsewhere.</item>
</validation>
