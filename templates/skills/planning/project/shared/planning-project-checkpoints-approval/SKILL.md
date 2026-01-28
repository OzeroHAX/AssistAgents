---
name: planning-project-checkpoints-approval
description: Key checkpoints and human approval gates to reduce the risk of going down the wrong path.
---

<skill_overview>
  <purpose>Add stop points where results are verified and confirmed before proceeding.</purpose>
  <triggers>
    <trigger>There is a risk of misunderstanding requirements</trigger>
    <trigger>There are meaningful trade-offs or external dependencies</trigger>
    <trigger>The project impacts users/data/money</trigger>
  </triggers>
</skill_overview>

<recommended_checkpoints>
  <checkpoint>After success metric + scope are locked (before detailed planning)</checkpoint>
  <checkpoint>After selecting stack/tools (before investing in integrations/infra)</checkpoint>
  <checkpoint>After the first end-to-end slice works (before expanding scope)</checkpoint>
  <checkpoint>Before deployment/sharing access (before others can use it)</checkpoint>
</recommended_checkpoints>

<rule>
  For each checkpoint specify: what is shown, how to verify (yes/no), and what changes if the answer is "no".
</rule>
