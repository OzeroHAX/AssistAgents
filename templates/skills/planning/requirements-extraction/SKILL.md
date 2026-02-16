---
name: planning-requirements-extraction
description: Extract requirements from a request: behavior, AC, constraints; for bugs - repro
---

<purpose>
  <item>Convert the original request into verifiable requirements and acceptance signals</item>
</purpose>

<inputs>
  <required>Task description</required>
  <optional>For a bug: repro steps, environment, logs/stacktrace</optional>
  <optional>For a feature: user goal, constraints, desired UX</optional>
</inputs>

<method>
  <step>State the goal as a behavior/outcome change</step>
  <step>List functional requirements (what must happen)</step>
  <step>List non-functional requirements (perf, security, reliability) only if relevant</step>
  <step>Define 3-7 acceptance criteria (AC) that are verifiable by a test or observation</step>
  <step>For a bug: capture observed vs expected and repro (or explicitly state that repro is unknown)</step>
</method>

<output_format>
  <section>Goal</section>
  <section>Functional requirements</section>
  <section>Non-functional requirements (if any)</section>
  <section>Acceptance criteria</section>
  <section>Bug repro / observed vs expected (if bug)</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">AC are specific, verifiable, and contain no implementation details</rule>
  <rule importance="high">Constraints/dependencies are not lost (if they affect the plan)</rule>
  <rule importance="high">For bugs, facts are explicitly separated from hypotheses</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not turn requirements into a list of technical tasks</item>
  <item importance="high">Do not invent AC without evidence - if data is missing, it is an open question</item>
</do_not>
