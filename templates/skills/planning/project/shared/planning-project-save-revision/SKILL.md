---
name: planning-project-save-revision
description: Plan saving and revision rules: what to change, how to document updates, and how to keep history.
---

<skill_overview>
  <purpose>Keep the plan as a living document: save, update, and preserve history.</purpose>
  <triggers>
    <trigger>User wants the plan saved to disk</trigger>
    <trigger>User asks to revise/simplify/change the plan</trigger>
  </triggers>
</skill_overview>

<file_naming>
  <rule>Directory map + naming rules live in docs-storage-artifact-registry</rule>
</file_naming>

<revision_rules>
  <rule>Add updates under: "## Revision: YYYY-MM-DD".</rule>
  <rule>Keep a "Revision History" table at the end of the document.</rule>
  <rule>Major change = session plan or scope changes; minor change = wording/clarity.</rule>
</revision_rules>

<revision_history_template>
  <template>
| Date | Changes |
|------|---------|
| YYYY-MM-DD | Initial plan |
| YYYY-MM-DD | Adjusted X, simplified Y |
  </template>
</revision_history_template>
