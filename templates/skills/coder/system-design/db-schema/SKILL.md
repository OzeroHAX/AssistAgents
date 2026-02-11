---
name: coder-system-design-db-schema
description: Database schema design and migration safety rules for production systems.
---

<when_to_use>
  <trigger>Designing relational schema for new services or major feature changes</trigger>
  <trigger>Planning schema evolution and data migrations in production</trigger>
  <trigger>Reviewing index/constraint strategy and multi-tenant data isolation</trigger>
</when_to_use>

<input_requirements>
  <required>Core entities and relationships</required>
  <required>Read/write access patterns and query shapes</required>
  <required>Data retention, audit, and compliance constraints</required>
  <required>Deployment constraints (downtime, lock tolerance, rollback)</required>
</input_requirements>

<design_principles>
  <principle priority="P0">Start normalized; denormalize only for measured bottlenecks</principle>
  <principle priority="P0">Enforce integrity in database using PK/FK/unique/check constraints</principle>
  <principle priority="P0">Design indexes from real query predicates and sort patterns</principle>
  <principle priority="P1">Use compatibility-first schema evolution via expand and contract</principle>
  <principle priority="P1">Treat tenant isolation as explicit schema and policy decision</principle>
  <principle priority="P1">Separate audit history needs from soft-delete convenience</principle>
</design_principles>

<decision_points>
  <item>Normalization vs denormalization based on read latency and write amplification tradeoff</item>
  <item>Tenant model: database-per-tenant vs schema-per-tenant vs shared-schema with tenant_id</item>
  <item>Deletion model: hard delete vs soft delete vs temporal/audit tables</item>
  <item>Key strategy: surrogate vs natural keys with interoperability constraints</item>
</decision_points>

<migration_safety_checklist>
  <item>Migration is split into expand, backfill, switch, and contract phases</item>
  <item>Lock impact and long-running DDL risk are analyzed before rollout</item>
  <item>Online index strategy is used where supported</item>
  <item>Backfill is batched, idempotent, and observable</item>
  <item>Rollback or roll-forward path is explicitly documented</item>
  <item>Post-migration validation queries are defined before deploy</item>
</migration_safety_checklist>

<quality_rules>
  <rule importance="critical">Do not perform breaking schema changes without compatibility window</rule>
  <rule importance="critical">Do not rely on app-level validation for integrity-critical constraints only</rule>
  <rule importance="high">Do not ship index changes without query-path rationale</rule>
  <rule importance="high">Do not run unbounded data backfill during peak load without controls</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not rename/drop hot-path columns and tables in same release as app switch</item>
  <item importance="high">Do not add broad indexes "just in case"</item>
  <item importance="high">Do not treat soft delete as complete audit solution</item>
</do_not>

<output_requirements>
  <requirement>Schema proposal with constraints and index rationale</requirement>
  <requirement>Phased migration plan with safety controls</requirement>
  <requirement>Verification SQL and rollback strategy</requirement>
  <requirement>Risks and operational caveats</requirement>
</output_requirements>

<references>
  <source url="https://www.postgresql.org/docs/16/sql-altertable.html">PostgreSQL ALTER TABLE</source>
  <source url="https://www.postgresql.org/docs/16/explicit-locking.html">PostgreSQL Explicit Locking</source>
  <source url="https://www.postgresql.org/docs/16/sql-createindex.html">PostgreSQL CREATE INDEX</source>
  <source url="https://www.postgresql.org/docs/16/indexes-multicolumn.html">PostgreSQL Multicolumn Indexes</source>
  <source url="https://www.postgresql.org/docs/16/indexes-partial.html">PostgreSQL Partial Indexes</source>
  <source url="https://www.postgresql.org/docs/16/ddl-rowsecurity.html">PostgreSQL Row Level Security</source>
  <source url="https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns">Azure SQL SaaS Tenancy Patterns</source>
  <source url="https://martinfowler.com/articles/evodb.html">Evolutionary Database Design</source>
</references>
