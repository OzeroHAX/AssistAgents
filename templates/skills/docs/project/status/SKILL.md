---
name: docs-project-status
description: status.json as the single tracker of project stage and readiness
---

<doc_description>
  <item>Stores the current project state in a structured format.</item>
  <item>Captures stage, gate status, blockers, and next action.</item>
  <item>Serves as a single source of status for planning flow.</item>
</doc_description>

<when_not_to_use>
  <item importance="critical">Do not use to execute implementation, review, or testing itself.</item>
  <item importance="high">Do not use when a stronger authoring or review skill is required to drive behavior.</item>
</when_not_to_use>
<validation>
  <item importance="critical">The skill clearly maps to a concrete document artifact and intended use.</item>
  <item importance="high">Required sections, expected content, or the handoff to a stronger authoring skill are explicit.</item>
  <item importance="high">The descriptor is not mistaken for runtime execution of the underlying work.</item>
</validation>