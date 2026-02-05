---
name: planning-task-classifier
description: Classify a task (bug/feature/refactor/migration) and what the plan must emphasize
---

<purpose>
  <item>Determine the task type and what matters most for that type</item>
  <item>Reduce planning mistakes (e.g., planning a bug like a feature)</item>
</purpose>

<inputs>
  <required>Short task description</required>
  <optional>Artifacts: logs/errors/AC/screenshots/incident links</optional>
</inputs>

<classification>
  <type id="bug">
    <signals>
      <item>There is "expected vs actual"</item>
      <item>There is an error/crash/regression/incident</item>
      <item>There is a repro or conditions under which it occurs</item>
    </signals>
    <planning_focus>
      <item>Confirm the repro</item>
      <item>Minimal fix</item>
      <item>Fast rollback</item>
    </planning_focus>
  </type>
  <type id="feature">
    <signals>
      <item>New functionality/behavior</item>
      <item>User value and acceptance criteria (AC)</item>
    </signals>
    <planning_focus>
      <item>Clear AC and edge cases</item>
      <item>In/out-of-scope boundaries</item>
      <item>Rollout and monitoring</item>
    </planning_focus>
  </type>
  <type id="refactor">
    <signals>
      <item>Goal: quality/maintainability/performance without changing external behavior</item>
      <item>There are metrics/pain/debt</item>
    </signals>
    <planning_focus>
      <item>Preserve behavior</item>
      <item>Improvement metrics</item>
      <item>Incremental steps and regression coverage</item>
    </planning_focus>
  </type>
  <type id="migration">
    <signals>
      <item>Schema/data/contracts/infra change in a way that requires compatibility</item>
      <item>There is data volume/windows/dual-write/backfill</item>
    </signals>
    <planning_focus>
      <item>Data integrity</item>
      <item>Backward compatibility</item>
      <item>Step-by-step migration and verification</item>
    </planning_focus>
  </type>
</classification>

<output_format>
  <section>Task type + confidence</section>
  <section>Why (signals)</section>
  <section>Planning focus</section>
  <section>Key unknowns</section>
</output_format>

<quality_rules>
  <rule importance="critical">Task type is justified by signals from the input</rule>
  <rule importance="high">If confidence is low, state it explicitly and list questions</rule>
</quality_rules>
