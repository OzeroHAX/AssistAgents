---
name: coder-rust-sqlx-config
description: SQLx configuration, connection pools, and migrations. Use when setting up databases or managing schema changes.
---
<skill_overview>
  <purpose>Configure SQLx safely and consistently across environments</purpose>
  <triggers>
    <trigger>Setting up a database pool</trigger>
    <trigger>Adding or running migrations</trigger>
    <trigger>Configuring database URLs and features</trigger>
    <trigger>Bootstrapping DB on startup</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/launchbadge/sqlx">SQLx GitHub</source>
  </sources>
</skill_overview>
<pooling>
  <rules>
    <rule>Use a single shared pool for the app lifetime</rule>
    <rule>Configure max connections based on DB limits</rule>
    <rule>Store the pool in app state and reuse it</rule>
  </rules>
  <example>
    <code>
let pool = sqlx::PgPool::connect(&database_url).await?;
    </code>
  </example>
</pooling>
<configuration>
  <rules>
    <rule>Use DATABASE_URL from environment, never hardcode creds</rule>
    <rule>Enable only the database and runtime features you need</rule>
    <rule>Fail fast if the database is unreachable at startup</rule>
  </rules>
</configuration>
<migrations>
  <rules>
    <rule>Generate migrations with sqlx migrate add</rule>
    <rule>Keep migrations in a dedicated migrations/ directory</rule>
    <rule>Apply migrations via sqlx migrate run or migrate! at startup</rule>
    <rule>In production, apply migrations in a controlled step</rule>
  </rules>
  <example>
    <code>
sqlx::migrate!("./migrations").run(&pool).await?;
    </code>
  </example>
</migrations>
<environment>
  <rules>
    <rule>Use separate databases for dev, test, and prod</rule>
    <rule>Never run destructive migrations against prod by default</rule>
  </rules>
</environment>
