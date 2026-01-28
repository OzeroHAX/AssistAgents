---
name: coder-rust-logging
description: Rust logging and observability with tracing. Use when adding structured logs, spans, or configuring subscribers.
---
<skill_overview>
  <purpose>Implement structured logging and tracing for Rust services</purpose>
  <triggers>
    <trigger>Adding logs or diagnostics</trigger>
    <trigger>Creating spans around operations</trigger>
    <trigger>Configuring tracing subscribers</trigger>
    <trigger>Ensuring sensitive data is not logged</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/tokio-rs/tracing">Tracing GitHub</source>
  </sources>
</skill_overview>
<events_and_spans>
  <rules>
    <rule>Use spans for operations with duration</rule>
    <rule>Use events for point-in-time facts</rule>
    <rule>Attach structured fields to both spans and events</rule>
  </rules>
</events_and_spans>
<structured_logging>
  <rules>
    <rule>Prefer structured fields over string interpolation</rule>
    <rule>Use consistent field names and types</rule>
  </rules>
  <example>
    <code>
tracing::info!(user_id, action = "login", "user action");
    </code>
  </example>
</structured_logging>
<instrumentation>
  <rules>
    <rule>Use #[instrument] to create spans automatically</rule>
    <rule>Skip sensitive fields with #[instrument(skip(secret))]</rule>
  </rules>
  <example>
    <code>
#[tracing::instrument(skip(password))]
fn authenticate(username: &str, password: &str) { /* ... */ }
    </code>
  </example>
</instrumentation>
<subscriber_setup>
  <rules>
    <rule>Initialize a subscriber early in main</rule>
    <rule>Use env-based filtering for log levels</rule>
    <rule>Keep default level reasonable for production</rule>
  </rules>
  <example>
    <code>
tracing_subscriber::fmt().with_env_filter("info").init();
    </code>
  </example>
</subscriber_setup>
<sensitive_data>
  <never_log>
    <item>Passwords and tokens</item>
    <item>API keys and secrets</item>
    <item>PII when not required</item>
  </never_log>
</sensitive_data>
<anti_patterns>
  <avoid name="println_logging">Avoid println! for production logging</avoid>
  <avoid name="log_spam">Avoid high-cardinality fields in info logs</avoid>
</anti_patterns>
