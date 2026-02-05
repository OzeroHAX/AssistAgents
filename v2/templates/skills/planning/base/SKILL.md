---
name: planning-base
description: Planning baseline for changes: format, principles, quality
---

<purpose>
  <item>Provide a universal change plan skeleton: short, verifiable, no hidden assumptions</item>
  <item>Define quality rules: what a good plan looks like and what not to do</item>
</purpose>

<when_to_use>
  <item importance="critical">Always before producing a change plan</item>
  <item importance="high">When the task is ambiguous and questions/assumptions must be captured</item>
</when_to_use>

<core_principles>
  <rule importance="critical">Separate facts, assumptions, and decisions</rule>
  <rule importance="critical">The plan must be verifiable: every step can be confirmed by a test/observation</rule>
  <rule importance="high">Changes are incremental, with stop points</rule>
  <rule importance="high">Do not replace requirements with solutions: first "what", then "how"</rule>
  <rule importance="high">Write only relevant sections: do not fill the template for the sake of it</rule>
</core_principles>

<default_output_format>
  <section>Goal</section>
  <section>Constraints</section>
  <section>Proposed change</section>
  <section>Risks</section>
  <section>Verification</section>
  <section>Rollout / rollback (if needed)</section>
  <section>Open questions</section>
</default_output_format>

<quality_rules>
  <rule importance="critical">The goal is stated as behavior/outcome, not as a list of actions</rule>
  <rule importance="critical">Acceptance criteria exist (what "done" means)</rule>
  <rule importance="high">Boundaries are stated: what we explicitly do NOT do in this task</rule>
  <rule importance="high">A verification plan exists (at least: one quick signal + one regression check)</rule>
  <rule importance="medium">Open questions are explicitly listed and affect the plan</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not produce a plan built on hidden assumptions</item>
  <item importance="critical">Do not mix independent goals into one change-set without a reason</item>
  <item importance="high">Do not add "nice-to-have improvements" without a clear goal</item>
</do_not>

<examples>
  <good>
    <case>Goal: remove 500s on /orders. Proposed change: add a guard for null tax and a regression test. Verification: the repro is gone, the test is green. Risks: may affect tax calculation. Open questions: do we have legacy clients without tax?</case>
    <why>Has a goal, a concrete change, verification, risks, and questions</why>
  </good>
  <bad>
    <case>Do something and check manually.</case>
    <why>No verifiability and no specifics</why>
  </bad>
</examples>
