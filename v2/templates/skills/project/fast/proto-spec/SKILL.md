---
name: project-fast-proto-spec
description: Compact one-iteration project spec (quick PRD + architecture skeleton + verification)
---

<purpose>
  <item>Assemble a single working document sufficient for immediate task decomposition</item>
  <item>Use a compact quick-spec approach for the fast flow without losing verifiability</item>
</purpose>

<when_to_use>
  <item importance="critical">After stack selection and before task-blast</item>
  <item importance="high">When a fast transition from idea to implementable backlog is needed</item>
</when_to_use>

<required_preload>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
  <item>planning-testing-strategy</item>
  <item>planning-monitoring-checks</item>
</required_preload>

<inputs>
  <required>Goal, scope, risks, and selected stack</required>
  <optional>UX/flow constraints and key use cases</optional>
  <optional>Non-functional requirements (perf/security/reliability)</optional>
</inputs>

<method>
  <step>Define functional requirements and acceptance criteria (Given/When/Then)</step>
  <step>Capture NFR-lite only for critical parameters</step>
  <step>Describe the architecture skeleton: components, integrations, contracts, boundaries</step>
  <step>Create a file-level change map and dependencies</step>
  <step>Define a minimal test strategy: quick signal + regression signal</step>
  <step>Define a planning completion quality gate: PASS/CONCERNS/FAIL</step>
</method>

<output_format>
  <section>Goal</section>
  <section>Functional requirements</section>
  <section>Acceptance criteria (Given/When/Then)</section>
  <section>NFR-lite</section>
  <section>Architecture constraints and decisions</section>
  <section>File-level change map</section>
  <section>Testing strategy</section>
  <section>Planning quality gate</section>
  <section>Open questions</section>
</output_format>

<quality_rules>
  <rule importance="critical">AC are testable and do not include technical implementation details</rule>
  <rule importance="critical">Solution boundaries and exclusions are explicit</rule>
  <rule importance="high">The file-level map is sufficient for task decomposition without guesswork</rule>
  <rule importance="high">The quality gate includes reasons and next action</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not turn proto-spec into a long multi-iteration PRD</item>
  <item importance="high">Do not include secondary NFR that do not affect MVP</item>
</do_not>
