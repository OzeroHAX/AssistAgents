---
name: coder-typescript-logging
description: TypeScript/JavaScript logging best practices: structured logs, levels, context, and redaction. Use when adding or reviewing logging code.
---
<skill_overview>
  <purpose>Produce logs that are searchable, consistent, and safe</purpose>
  <triggers>
    <trigger>Adding log statements</trigger>
    <trigger>Choosing log levels</trigger>
    <trigger>Designing structured log fields</trigger>
    <trigger>Handling sensitive data in logs</trigger>
  </triggers>
  <sources>
    <source url="https://signoz.io/guides/pino-logger/">Structured Logging Practices (Pino guide)</source>
  </sources>
</skill_overview>
<log_levels>
  <level name="trace">
    <use_for>Very detailed diagnostics and internal state</use_for>
    <production>Disabled</production>
  </level>
  <level name="debug">
    <use_for>Development debugging, transient details</use_for>
    <production>Rarely enabled</production>
  </level>
  <level name="info">
    <use_for>Key business events and normal flow</use_for>
    <production>Default</production>
    <example>order.created</example>
  </level>
  <level name="warn">
    <use_for>Recoverable issues and retries</use_for>
    <production>Always enabled</production>
  </level>
  <level name="error">
    <use_for>Failures requiring investigation</use_for>
    <production>Always enabled</production>
  </level>
  <level name="fatal">
    <use_for>Process-critical failures</use_for>
    <production>Always enabled + alerts</production>
  </level>
</log_levels>
<structured_logging>
  <principles>
    <rule>Log JSON objects, not interpolated strings</rule>
    <rule>Use stable field names for queries</rule>
    <rule>Keep message short and event-oriented</rule>
  </principles>
  <correct>
    <code>
logger.info(
  { event: "order.created", orderId, userId, totalCents, durationMs },
  "Order created"
);
    </code>
  </correct>
  <incorrect>
    <code>
logger.info(`Order ${orderId} created for ${userId} in ${durationMs}ms`);
    </code>
  </incorrect>
</structured_logging>
<context_fields>
  <recommended>
    <field>event</field>
    <field>requestId</field>
    <field>traceId</field>
    <field>userId</field>
    <field>component</field>
    <field>durationMs</field>
  </recommended>
</context_fields>
<sensitive_data>
  <never_log>
    <item>Passwords and secrets</item>
    <item>Tokens, API keys, session IDs</item>
    <item>Credit card numbers and CVV</item>
    <item>Personal identifiers unless required</item>
  </never_log>
  <redaction>
    <code>
function redactEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 3)}***@${domain}`;
}
    </code>
  </redaction>
</sensitive_data>
<correlation_ids>
  <rules>
    <rule>Propagate requestId or traceId across async boundaries</rule>
    <rule>Include correlation IDs in every log line for a request</rule>
  </rules>
</correlation_ids>
<performance>
  <rules>
    <rule>Avoid heavy serialization for disabled levels</rule>
    <rule>Do not log inside tight loops at info level</rule>
    <rule>Prefer structured fields over string concatenation</rule>
  </rules>
</performance>
<anti_patterns>
  <avoid name="string_interpolation_only">Using only interpolated strings</avoid>
  <avoid name="log_sensitive">Logging secrets or PII</avoid>
  <avoid name="too_chatty">Info logs for every small operation</avoid>
</anti_patterns>
