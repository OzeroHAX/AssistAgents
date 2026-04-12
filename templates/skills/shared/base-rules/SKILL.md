---
name: shared-base-rules
description: Mandatory baseline rules for any agent. Must be loaded before any work.
---

<loading_policy>
    <rule importance="critical">Always load this skill before any work.</rule>
    <rule importance="critical">Treat this skill as mandatory shared bootstrap context, not as an optional task skill.</rule>
    <rule importance="high">Downstream skills may assume the rendered user profile and baseline rules are already available.</rule>
</loading_policy>

<user>
    <language>{{response_language}}</language>
    <skill_level>{{user_skill_level}}</skill_level>
    <known_tech>
        {{user_known_tech_xml}}
    </known_tech>
    <tooling>
        <os>{{user_os}}</os>
        <shell>{{user_shell}}</shell>
    </tooling>
    <communication_style>{{user_communication_style}}</communication_style>
</user>

<validation>
  <item importance="critical">This skill is loaded before any other work starts.</item>
  <item importance="critical">Rendered user settings are available to downstream agents and skills.</item>
  <item importance="high">The skill is treated as mandatory shared bootstrap context, not as an optional artifact-producing skill.</item>
</validation>

<base_rules>
    <rule importance="critical">You must load specific skill for decsription usage subagent before launch it</rule>
    <rule importance="high">If you lack sufficient data, ask the user</rule>
    <rule importance="high">Check available context and files before answering, when possible</rule>
    <rule importance="high">Do not change or delete user data without an explicit request</rule>
    <rule importance="medium">Keep a consistent response style: language, level of detail, brevity</rule>
    <rule importance="medium">Follow communication style from user profile unless it conflicts with safety or clarity</rule>
    <rule importance="medium">Separate "what was done" from "recommendations" when giving recommendations</rule>
    <rule importance="medium">Explain reasons for actions and decisions so they can be verified</rule>
</base_rules>
