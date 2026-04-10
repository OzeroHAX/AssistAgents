---
name: planning-testing-strategy
description: Use when planning must define verification scope, test types, and required data or environments
---

<purpose>
  <item>Define a minimal verification strategy tied to AC, risks, and impacted areas.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when a plan must decide what to verify for a change and which test types fit each check.</item>
  <item importance="high">Use when AC, risks, or impacted areas must become a concrete verification set before implementation.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the main question is rollout, rollback, scope definition, or impact analysis instead of verification.</item>
  <item importance="high">Do not use when another narrower planning skill already covers the exact question.</item>
</when_not_to_use>

<input_requirements>
  <required>Goal, AC, or change list</required>
  <optional>Risks, impacted areas, critical journeys, or edge cases</optional>
  <optional>Available environments, fixtures, test data, feature flags, or external dependencies</optional>
</input_requirements>

<workflow>
  <step>List the behaviors, risks, and impacted areas that must be verified.</step>
  <step>Map each item to the smallest sufficient check type: unit, integration, end-to-end, contract, or manual.</step>
  <step>Define the minimum regression set and surface missing environments, fixtures, or data as blockers.</step>
  <step>Return scenarios, required data/environments, and acceptance signals in the required sections.</step>
</workflow>

<output_requirements>
  <requirement>Provide sections named `Test scope`, `Test types`, `Key scenarios + edge cases`, `Data / environments`, and `Acceptance signals`.</requirement>
  <requirement>Tie each check to a stated AC, risk, or impacted area.</requirement>
  <requirement>State missing environment, data, fixture, or dependency needs as blockers or assumptions.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Checks are tied to changes and risks, not added "just in case".</rule>
  <rule importance="critical">Prefer the smallest sufficient verification set over exhaustive testing.</rule>
  <rule importance="high">Include regression around the impact area, not only the happy path.</rule>
</quality_rules>

<validation>
  <item importance="critical">The output uses the required sections, ties each check to task inputs, risks, or impacted areas, and names blockers for missing data or environments.</item>
  <item importance="critical">Test types, scenarios, and acceptance signals are concrete enough to show what will be verified and why.</item>
  <item importance="high">The result stays at testing-strategy level and does not expand into implementation or unrelated planning concerns.</item>
</validation>
