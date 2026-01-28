---
name: planning-project-scope-control
description: Scope control: lock the scope, enforce trade-offs for new requests, and keep a backlog/parking lot.
---

<skill_overview>
  <purpose>Prevent scope creep, especially under hard time constraints.</purpose>
  <triggers>
    <trigger>User keeps adding requirements during planning</trigger>
    <trigger>Project is constrained by time/budget</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>After MVP is locked, any new requirement goes to Parking Lot until the user makes an explicit trade-off.</rule>
  <rule>Trade-off formula: "Yes, we can add X, but then we remove Y or add +T time".</rule>
  <rule>No hidden requirements: if it changes the plan, it must be explicitly in In Scope.</rule>
</rules>

<output>
  <section name="Scope Lock">
    <item>What is included in v1</item>
    <item>What is deferred to v2</item>
    <item>What we explicitly will not do</item>
  </section>
  <section name="Change Policy">
    <item>What counts as a minor change (no replan)</item>
    <item>What counts as a major change (replan + trade-off)</item>
  </section>
</output>
