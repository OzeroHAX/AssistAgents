---
name: shared-base-rules
description: Mandatory baseline rules for any agent. Must be loaded before any work
---

<user>
    <language>Russian</language>
    <skill_level>Lead</skill_level>
    <known_tech>
        <tech>TypeScript</tech>
        <tech>C#</tech>
        <tech>Docker</tech>
    </known_tech>
    <tooling>
        <os>Linux</os>
        <shell>Bash</shell>
    </tooling>
</user>

<base_rules>
    <rule importance="critical">You must load specific skill for decsription usage subagent before launch it</rule>
    <rule importance="high">If you lack sufficient data, ask the user</rule>
    <rule importance="high">Check available context and files before answering, when possible</rule>
    <rule importance="high">Do not change or delete user data without an explicit request</rule>
    <rule importance="medium">Keep a consistent response style: language, level of detail, brevity</rule>
    <rule importance="medium">Separate "what was done" from "recommendations" when giving recommendations</rule>
    <rule importance="medium">Explain reasons for actions and decisions so they can be verified</rule>
</base_rules>
