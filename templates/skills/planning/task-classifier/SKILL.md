---
name: planning-task-classifier
description: Use when planning must first classify the work as bug, feature, refactor, or migration
---

<purpose>
  <item>Choose the task type early so later planning uses the right priorities and avoids mismatched assumptions.</item>
</purpose>

<when_to_use>
  <item importance="critical">Use when the next planning choice depends on whether the work is a bug, feature, refactor, or migration.</item>
  <item importance="high">Use when the input mixes signals and the dominant planning concern is still unclear.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use to implement changes or write production code.</item>
  <item importance="high">Do not use when the task type is already explicit and a narrower planning skill should drive the answer.</item>
  <item importance="high">Do not use for scope definition, change inventory, impact analysis, or test strategy.</item>
</when_not_to_use>

<input_requirements>
  <required>Task description or issue statement</required>
  <optional>AC, expected vs actual, repro, incidents, logs, screenshots, or rollout constraints</optional>
</input_requirements>

<classification>
  <type id="bug">
    <signals>
      <item>Expected vs actual, error, crash, regression, or incident</item>
      <item>Repro, triggering conditions, or operational impact</item>
    </signals>
    <planning_focus>
      <item>Confirm repro and failure boundaries</item>
      <item>Prefer the smallest safe fix with rollback and regression coverage</item>
    </planning_focus>
  </type>
  <type id="feature">
    <signals>
      <item>New capability or user-facing behavior</item>
      <item>AC, user value, or rollout expectations</item>
    </signals>
    <planning_focus>
      <item>Clarify AC and edge cases</item>
      <item>Make scope and rollout expectations explicit</item>
    </planning_focus>
  </type>
  <type id="refactor">
    <signals>
      <item>Quality, maintainability, or performance improvement without intended external behavior change</item>
      <item>Technical debt or engineering pain is cited</item>
    </signals>
    <planning_focus>
      <item>Preserve existing behavior</item>
      <item>Use measurable improvement goals and regression coverage</item>
    </planning_focus>
  </type>
  <type id="migration">
    <signals>
      <item>Schema, data, contract, or infrastructure change requires compatibility handling</item>
      <item>Backfill, dual-write, cutover, or phased transition is involved</item>
    </signals>
    <planning_focus>
      <item>Protect data integrity and compatibility</item>
      <item>Use staged migration with explicit verification</item>
    </planning_focus>
  </type>
</classification>

<workflow>
  <step>Extract the signals from the input that point to each type.</step>
  <step>Choose the dominant type and state confidence.</step>
  <step>If evidence is mixed, name the leading alternative and the missing information that could change the call.</step>
  <step>Return only the classifier result and the planning focus for the chosen type.</step>
</workflow>

<output_requirements>
  <requirement>Provide `Task type + confidence`, `Why`, `Planning focus`, and `Key unknowns`.</requirement>
  <requirement>`Why` cites concrete input signals rather than generic definitions.</requirement>
  <requirement>`Key unknowns` includes only information that could change the classification or its emphasis.</requirement>
</output_requirements>

<quality_rules>
  <rule importance="critical">Classify from task signals, not assumptions.</rule>
  <rule importance="critical">If confidence is low, say so and name the leading alternative.</rule>
  <rule importance="high">Stay at classification level; do not expand into a full plan.</rule>
</quality_rules>

<validation>
  <item importance="critical">The chosen type is tied to concrete task signals or constraints.</item>
  <item importance="critical">Confidence and ambiguity are explicit when the case is not clear-cut.</item>
  <item importance="high">The result stays at classifier level and uses the required sections.</item>
</validation>

<do_not>
  <item importance="critical">Do not force certainty when the evidence is incomplete.</item>
  <item importance="high">Do not let downstream planning preferences override the classification evidence.</item>
</do_not>
