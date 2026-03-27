---
name: planning-estimation
description: "Time and effort estimation: select a method, produce a range with assumptions, and flag uncertainty drivers. Use when sizing tasks, planning sprints, scoping contracts, or communicating timelines to stakeholders."
---

<when_to_use>
  <trigger>Sizing a feature, epic, or project for roadmap planning</trigger>
  <trigger>Sprint or iteration planning requires effort estimates</trigger>
  <trigger>Stakeholders or contracts need a timeline commitment with confidence range</trigger>
</when_to_use>

<input_requirements>
  <required>Change inventory or work decomposition (list of tasks/components)</required>
  <required>Known constraints (deadline, team capacity, dependencies)</required>
  <optional>Blockers, quality gates, or process constraints</optional>
</input_requirements>

<method>
  <step>Break work into estimable units by phase (analysis, implementation, testing, rollout) or by component</step>
  <step>Choose and name an estimation method: three-point (optimistic/likely/pessimistic), t-shirt sizing (S/M/L/XL), or story points</step>
  <step>Produce a range for each unit — never a single number when uncertainty exists</step>
  <step>State assumptions explicitly (e.g., "assumes existing auth service is stable")</step>
  <step>List factors that could move the estimate up or down (unknowns, external dependencies, scope creep)</step>
</method>

<example>
  **Method:** Three-point estimation

  | Task | Optimistic | Likely | Pessimistic | Expected |
  |------|-----------|--------|-------------|----------|
  | API endpoints | 2d | 3d | 5d | 3.2d |
  | Frontend integration | 1d | 2d | 4d | 2.2d |
  | Testing + QA | 1d | 2d | 3d | 2d |
  | **Total** | **4d** | **7d** | **12d** | **7.4d** |

  **Assumptions:** Auth service is stable; design specs are finalized.
  **Risk factors:** If design changes mid-sprint, add 2-3d. If auth requires rework, add 3-5d.
</example>

<output_format>
  <section>Work breakdown</section>
  <section>Estimation method and rationale</section>
  <section>Estimate range per unit and total</section>
  <section>Assumptions</section>
  <section>Factors that could change the estimate</section>
</output_format>

<quality_rules>
  <rule importance="critical">The estimate is derived from decomposition, not from intuition alone</rule>
  <rule importance="critical">A range and explicit assumptions are always provided</rule>
  <rule importance="high">Uncertainty drivers are listed with their potential impact on the range</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not give a single exact number without a range when uncertainty exists</item>
  <item importance="high">Do not conflate an estimate with a delivery commitment — clarify the difference</item>
  <item importance="high">Do not skip the assumptions section; unstated assumptions are the top source of blown estimates</item>
</do_not>
