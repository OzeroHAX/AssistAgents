---
name: project-fast-init
description: Quick project planning kickoff in one iteration (scope, goal, artifacts)
---

<purpose>
  <item>Capture the project goal, boundaries, and fast-planning readiness criteria</item>
  <item>Prepare the minimum artifact set for a single iteration</item>
</purpose>

<when_to_use>
  <item importance="critical">At the very start of fast planning for a new project or major initiative</item>
  <item importance="high">When you need to move quickly from idea to an implementable plan without a long discovery phase</item>
</when_to_use>

<required_preload>
  <item>shared-base-rules</item>
</required_preload>

<inputs>
  <required>User/stakeholder request in free form</required>
  <optional>Constraints on timeline, budget, team, and compliance</optional>
  <optional>Context of existing systems or integrations</optional>
</inputs>

<method>
  <step>Define the goal as a measurable outcome, not a list of actions</step>
  <step>Bound the fast iteration: define in-scope and out-of-scope</step>
  <step>Set a timebox for one planning iteration (usually 60-120 minutes)</step>
  <step>Define the minimum mandatory outputs of the fast flow</step>
  <step>Identify critical unknowns that can block a one-iteration plan</step>
</method>

<output_format>
  <section>Goal</section>
  <section>In scope</section>
  <section>Out of scope</section>
  <section>Timebox</section>
  <section>Minimal artifacts to produce</section>
  <section>Critical unknowns</section>
</output_format>

<quality_rules>
  <rule importance="critical">Task boundaries are explicitly defined and verifiable</rule>
  <rule importance="critical">There is a completion criterion for planning itself (planning done), not implementation</rule>
  <rule importance="high">The minimal artifact set is defined before detailed elaboration starts</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not move to implementation before fast-iteration boundaries are fixed</item>
  <item importance="high">Do not expand scope without explicit escalation to the standard flow</item>
</do_not>
