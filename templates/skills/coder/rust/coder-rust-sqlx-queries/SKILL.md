---
name: coder-rust-sqlx-queries
description: SQLx query patterns, compile-time validation, and performance best practices. Use when writing database queries.
---
<skill_overview>
  <purpose>Write safe, validated, and efficient SQLx queries</purpose>
  <triggers>
    <trigger>Writing SQL queries with SQLx</trigger>
    <trigger>Using compile-time query macros</trigger>
    <trigger>Optimizing database access patterns</trigger>
    <trigger>Working with transactions</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/launchbadge/sqlx">SQLx GitHub</source>
  </sources>
</skill_overview>
<query_rules>
  <rule name="prefer_query_macros" priority="high">
    <description>Use query! or query_as! for compile-time validation</description>
  </rule>
  <rule name="bind_params" priority="critical">
    <description>Always bind parameters, never concatenate user input</description>
  </rule>
  <rule name="fetch_methods" priority="medium">
    <description>Use fetch_one, fetch_optional, fetch_all appropriately</description>
  </rule>
  <example>
    <code>
let rec = sqlx::query!("SELECT id FROM users WHERE email = $1", email)
    .fetch_optional(&pool)
    .await?;
    </code>
  </example>
</query_rules>
<compile_time_checks>
  <rules>
    <rule>Ensure DATABASE_URL is available at build time</rule>
    <rule>Use sqlx prepare and SQLX_OFFLINE for offline builds</rule>
  </rules>
</compile_time_checks>
<transactions>
  <rules>
    <rule>Wrap multi-step changes in a transaction</rule>
    <rule>Pass &mut Transaction to query calls</rule>
  </rules>
  <example>
    <code>
let mut tx = pool.begin().await?;
sqlx::query!("DELETE FROM items WHERE id = $1", id)
    .execute(&mut tx)
    .await?;
tx.commit().await?;
    </code>
  </example>
</transactions>
<performance>
  <rules>
    <rule>Batch queries instead of querying in loops</rule>
    <rule>Prefer streaming fetch for large result sets</rule>
  </rules>
</performance>
<anti_patterns>
  <avoid name="string_concat_sql">Never build SQL via string concatenation</avoid>
  <avoid name="pool_per_request">Do not create a new pool per request</avoid>
  <avoid name="n_plus_one">Avoid running queries inside loops</avoid>
</anti_patterns>
