---
name: agent-common-rules
description: Common interaction rules for agents (questions/confirmations via question tool; skill loading on-demand).
---

<skill_overview>
  <purpose>Keep agent instructions consistent and reduce conflicts across templates.</purpose>
  <triggers>
    <trigger>Any agent interaction that may ask the user questions or request confirmation.</trigger>
    <trigger>Any task that requires planning, coding, or delegated research.</trigger>
  </triggers>
</skill_overview>

<core_rules>
  <rule>
    <title>Questions via question tool</title>
    <text>All user questions must use the question tool. Do NOT ask questions in chat.</text>
  </rule>

  <rule>
    <title>Approvals/confirmations via question tool</title>
    <text>All approvals and confirmations must use the question tool. Do NOT ask for approval in chat.</text>
  </rule>
</core_rules>

<skill_loading_policy>
  <rule>
    <title>Skills are on-demand</title>
    <text>Do not load skills for simple read-only operations (read/grep/glob/list) unless needed for correctness. Load skills before planning, delegated research (subagents), or coding, and load language/framework skills when writing or modifying code in that scope.</text>
  </rule>
</skill_loading_policy>
