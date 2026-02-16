---
name: planning-migration-strategy
description: Migration strategy for data/schemas/contracts: compatibility, phases, verification
---

<purpose>
  <item>Design a migration that preserves data integrity and compatibility</item>
</purpose>

<inputs>
  <required>What we migrate (schema/data/API) and why</required>
  <optional>Data volume, time windows, downtime constraints</optional>
  <optional>Backward-compatibility requirements</optional>
</inputs>

<common_patterns>
  <pattern>expand/contract</pattern>
  <pattern>dual-read / dual-write</pattern>
  <pattern>backfill in background</pattern>
  <pattern>versioned API / events</pattern>
</common_patterns>

<method>
  <step>Identify migration objects and dependencies (tables, indexes, consumers)</step>
  <step>Select a migration pattern and justify it (why it fits the constraints)</step>
  <step>Split into phases: preparation -> compatibility -> transfer -> cutover -> cleanup</step>
  <step>Define integrity/correctness verification (checksums, counts, sampling)</step>
  <step>Explicitly describe compatibility during the migration window (which versions coexist)</step>
</method>

<output_format>
  <section>Migration objects</section>
  <section>Chosen pattern + rationale</section>
  <section>Phases</section>
  <section>Compatibility window</section>
  <section>Data verification</section>
</output_format>

<quality_rules>
  <rule importance="critical">Data integrity verification exists (not only "ran the migration")</rule>
  <rule importance="high">Compatibility during the migration window is described explicitly</rule>
</quality_rules>
