---
name: project-fast-proto-spec
description: Use when fast planning must convert the chosen MVP stack into a one-iteration proto-spec before `project-fast-task-blast`
---

<purpose>
  <item>Produce one compact proto-spec that is sufficient for immediate task decomposition.</item>
</purpose>

<when_to_use>
  <item importance="critical">After `project-fast-stack-pick` and before `project-fast-task-blast` when the iteration still needs its planning spec.</item>
  <item importance="high">When fast planning must lock AC, architecture, file impact, and a planning gate in one artifact.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use outside the active fast-planning stage or for implementation, delivery execution, or runtime work.</item>
  <item importance="high">Do not use when a verified proto-spec already exists or when the work needs a long multi-iteration PRD.</item>
</when_not_to_use>
<required_preload>
  <item>planning-requirements-extraction</item>
  <item>planning-scope-definition</item>
  <item>planning-testing-strategy</item>
  <item>planning-monitoring-checks</item>
</required_preload>

<input_requirements>
  <required>Goal, scope, critical risks, and the chosen stack for the current fast-planning iteration.</required>
  <optional>Key UX or flow constraints that change acceptance criteria or architecture boundaries.</optional>
  <optional>Critical non-functional constraints that materially affect MVP delivery.</optional>
</input_requirements>

<workflow>
  <step>Turn the goal and scope into functional requirements plus testable Given/When/Then acceptance criteria without implementation detail leakage.</step>
  <step>Keep only the NFR-lite constraints that materially affect architecture, delivery risk, or verification.</step>
  <step>Describe the architecture skeleton, contracts, and explicit solution boundaries.</step>
  <step>Map file-level changes and dependencies for `project-fast-task-blast`.</step>
  <step>Define the minimum testing strategy and the planning quality gate, then record open questions or escalation conditions.</step>
</workflow>

<output_requirements>
  <requirement>Produce exactly these sections: Goal, Functional requirements, Acceptance criteria (Given/When/Then), NFR-lite, Architecture constraints and decisions, File-level change map, Testing strategy, Planning quality gate, Open questions.</requirement>
  <requirement>Keep the acceptance criteria testable and implementation-agnostic, and keep the architecture and file map concrete for decomposition.</requirement>
  <requirement>The planning quality gate must be `PASS`, `CONCERNS`, or `FAIL` with reasons, next action, and an explicit handoff to `project-fast-task-blast` or escalation from the fast flow.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Acceptance criteria are testable and do not encode technical implementation steps.</rule>
  <rule importance="critical">Architecture boundaries and file-level impact are explicit enough for decomposition.</rule>
  <rule importance="high">The planning quality gate includes reasons, next action, and any escalation trigger.</rule>
</quality_rules>

<validation>
  <item importance="critical">The proto-spec contains all required sections and each section is concrete enough to support immediate task decomposition.</item>
  <item importance="critical">Required preload skills are satisfied, and the AC, architecture, and file map align with the chosen stack and scope.</item>
  <item importance="high">The handoff to `project-fast-task-blast` or the escalation condition is explicit.</item>
</validation>
<do_not>
  <item importance="critical">Do not turn the proto-spec into a long multi-iteration PRD.</item>
  <item importance="high">Do not add secondary NFRs or speculative details that do not affect the current MVP iteration.</item>
</do_not>
