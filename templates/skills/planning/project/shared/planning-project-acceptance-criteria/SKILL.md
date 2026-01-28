---
name: planning-project-acceptance-criteria
description: Acceptance criteria for tasks and milestones using Given/When/Then and a binary definition of done.
---

<skill_overview>
  <purpose>Make progress measurable and remove ambiguity about what "done" means.</purpose>
  <triggers>
    <trigger>You need to verify outcomes of milestones/features</trigger>
    <trigger>The plan is vague ("do X") without a verification method</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>No percent-complete. Only done/not done.</rule>
  <rule>Acceptance criteria describe behavior, not implementation.</rule>
  <rule>1 task = 1-3 acceptance criteria (no more).</rule>
</rules>

<formats>
  <format name="given-when-then">
    <template>Given [context], when [action], then [expected result].</template>
  </format>
  <format name="checklist">
    <template>
      - Input: ...
      - Action: ...
      - Expectation: ...
      - Negative case: ...
    </template>
  </format>
</formats>

<examples>
  <example name="good">
    <criteria>
      <item>Given an empty form, when I click "Save", then I see a validation error and nothing is saved.</item>
      <item>Given valid input, when I click "Save", then I see a confirmation and the record appears in the list.</item>
    </criteria>
  </example>
  <example name="bad">
    <criteria>
      <item>"Saving should work"</item>
    </criteria>
  </example>
</examples>
