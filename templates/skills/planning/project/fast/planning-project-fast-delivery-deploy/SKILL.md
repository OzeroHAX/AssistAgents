---
name: planning-project-fast-delivery-deploy
description: Fast result delivery: local run, shareable demo, minimal deployment, and rollback.
---

<skill_overview>
  <purpose>Make the result usable/demoable with minimal effort.</purpose>
  <triggers>
    <trigger>User needs to "show a friend/colleague" or give someone access</trigger>
    <trigger>User gets stuck on deployment/sharing</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Prefer the simplest delivery path (local) unless deployment is explicitly required.</rule>
  <rule>If deployment is needed, pick the simplest option for the chosen stack.</rule>
  <rule>Write run/access steps so another person can follow them.</rule>
</rules>

<output_template>
  <section name="How to Run">
    <item>Prerequisites</item>
    <item>Command to run</item>
    <item>Where to see the result</item>
  </section>
  <section name="Sharing">
    <item>Option A: local (screen share / in-person)</item>
    <item>Option B: link/deploy (if needed)</item>
  </section>
  <section name="Rollback">
    <item>What can be quickly disabled/reverted</item>
  </section>
</output_template>
