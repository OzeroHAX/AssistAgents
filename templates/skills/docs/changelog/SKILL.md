---
name: docs-changelog
description: Use when the request is to author a concise changelog entry or release note from concrete completed user-visible changes for a task or release
---

<purpose>
  <item>Produce concise changelog artifacts that summarize completed user-visible changes.</item>
  <item>Keep change history scannable without repeating full implementation details.</item>
  <item>Route changelog work to `ai-docs/changelogs/**` by default.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the user explicitly asks for a changelog entry, release note, release summary, or "what changed" note.</item>
  <item importance="high">Use when the expected artifact is a short record of completed task or release changes, not a procedural document.</item>
  <item importance="high">Use when the output should be saved under `ai-docs/changelogs/**` or another explicit changelog path.</item>
</when_to_use>

<input_requirements>
  <required>Concrete change details, source notes, or user-provided release context.</required>
  <required>The changelog scope: task, feature, fix, or release.</required>
  <required>The artifact path or enough naming context to derive one.</required>
</input_requirements>

<workflow>
  <step>Confirm the request is asking for a changelog or release-note artifact rather than procedural or structural documentation.</step>
  <step>Extract only completed user-visible changes and their impact; avoid tutorial steps and internal implementation noise unless the user explicitly asks for them.</step>
  <step>Write a concise release-note style entry that states what changed and why it matters.</step>
  <step>Save the artifact under `ai-docs/changelogs/<name>.md` or the user-specified changelog path.</step>
</workflow>

<output_requirements>
  <requirement>Create or update the requested changelog artifact path.</requirement>
  <requirement>Keep the note concise, user-visible, and easy to scan.</requirement>
  <requirement>Summarize change and impact without turning the document into instructions or documentation taxonomy.</requirement>
</output_requirements>

<when_not_to_use>
  <item importance="critical">Do not use for stepwise instructions, incident-handling references, or recovery procedures.</item>
  <item importance="critical">Do not use for repository-map questions, document-placement requests, or broader documentation taxonomy.</item>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="high">Do not use when the request is broad documentation research rather than authoring a specific changelog artifact.</item>
</when_not_to_use>

<validation>
  <item importance="critical">The request clearly asks for a changelog or release-note style artifact that summarizes changes.</item>
  <item importance="high">The artifact target is a changelog path, preferably under `ai-docs/changelogs/**`, unless the user overrides it.</item>
  <item importance="high">The output stays concise, user-visible, and non-procedural.</item>
  <item importance="high">Procedural and structural documentation requests should route elsewhere.</item>
</validation>
