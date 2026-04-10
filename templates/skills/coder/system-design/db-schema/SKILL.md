---
name: coder-system-design-db-schema
description: Use when designing or reviewing production database schemas, constraints, indexes, and safe migrations.
---

<when_to_use>
  <trigger>Designing relational schema for new services or major feature changes</trigger>
  <trigger>Planning production schema evolution and data migrations</trigger>
  <trigger>Choosing index, constraint, tenant-isolation, or delete strategy</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when a narrower review, testing, or domain-specific skill is the better fit.</item>
</when_not_to_use>
<input_requirements>
  <required>Core entities and relationships</required>
  <required>Read/write access patterns and query shapes</required>
  <required>Data retention, audit, and compliance constraints</required>
  <required>Deployment constraints (downtime, lock tolerance, rollback)</required>
</input_requirements>

<workflow>
  <step>Gather entities, query paths, compliance needs, and rollout constraints.</step>
  <step>Choose keys, constraints, tenancy, delete or audit model, and indexes from access patterns.</step>
  <step>Plan expand, backfill, switch, and contract rollout with lock mitigation, validation SQL, and recovery path.</step>
</workflow>

<design_principles>
  <principle priority="P0">Start normalized; denormalize only for measured bottlenecks</principle>
  <principle priority="P0">Enforce integrity with PK/FK/unique/check constraints</principle>
  <principle priority="P0">Design indexes from real predicates and sort order</principle>
  <principle priority="P1">Use expand and contract for compatibility-first evolution</principle>
  <principle priority="P1">Make tenancy, delete model, and audit strategy explicit</principle>
</design_principles>

<decision_points>
  <item>Normalization vs denormalization from latency and write amplification tradeoff</item>
  <item>Tenant model: database-per-tenant vs schema-per-tenant vs shared-schema with tenant_id</item>
  <item>Delete model: hard delete vs soft delete vs temporal or audit tables</item>
  <item>Key strategy: surrogate vs natural keys under interoperability constraints</item>
</decision_points>

<migration_safety_checklist>
  <item>Use expand, backfill, switch, and contract phases</item>
  <item>Analyze DDL lock risk and online index options before rollout</item>
  <item>Keep backfills batched, idempotent, observable, and load-controlled</item>
  <item>Define validation queries plus rollback or roll-forward path before deploy</item>
</migration_safety_checklist>

<quality_rules>
  <rule importance="critical">Do not ship breaking schema changes without a compatibility window</rule>
  <rule importance="critical">Do not leave integrity-critical constraints only in application code</rule>
  <rule importance="high">Do not ship index changes without query-path rationale</rule>
  <rule importance="high">Do not run unbounded backfills during peak load without controls</rule>
</quality_rules>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">Decisions are traceable to query paths, integrity needs, and rollout constraints.</item>
  <item importance="high">Migration safety includes compatibility window, backfill controls, validation queries, and recovery path.</item>
</validation>
<do_not>
  <item importance="critical">Do not rename or drop hot-path columns and tables in the same release as the app switch</item>
  <item importance="high">Do not add broad indexes "just in case"</item>
  <item importance="high">Do not treat soft delete as a complete audit solution</item>
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
