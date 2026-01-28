---
name: coder-rust-tower-http
description: tower-http middleware best practices including tracing, CORS, compression, and timeouts. Use when adding HTTP layers.
---
<skill_overview>
  <purpose>Apply reusable HTTP middleware with tower-http safely</purpose>
  <triggers>
    <trigger>Adding request/response tracing</trigger>
    <trigger>Configuring CORS</trigger>
    <trigger>Enabling compression or timeouts</trigger>
    <trigger>Propagating request IDs</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/tower-rs/tower-http">tower-http GitHub</source>
    <source url="https://docs.rs/tower-http">tower-http Docs</source>
  </sources>
</skill_overview>
<layer_selection>
  <rules>
    <rule>Enable only required tower-http features in Cargo.toml</rule>
    <rule>Prefer TraceLayer for request spans and latency</rule>
    <rule>Use CorsLayer for browser-facing APIs</rule>
    <rule>Use TimeoutLayer for external calls and slow handlers</rule>
  </rules>
</layer_selection>
<ordering>
  <rules>
    <rule>Set request IDs early, propagate later</rule>
    <rule>Place tracing outside of compression for full visibility</rule>
    <rule>Keep security layers (CORS) near the edge</rule>
  </rules>
</ordering>
<request_ids>
  <rules>
    <rule>Use SetRequestIdLayer + PropagateRequestIdLayer</rule>
    <rule>Use a consistent header name (X-Request-Id)</rule>
  </rules>
</request_ids>
<cors>
  <rules>
    <rule>Do not use permissive CORS in production</rule>
    <rule>Whitelist origins, methods, and headers explicitly</rule>
    <rule>Align allow_credentials with specific origins</rule>
  </rules>
</cors>
<compression>
  <rules>
    <rule>Enable compression only for sizable responses</rule>
    <rule>Avoid compressing already compressed formats</rule>
  </rules>
</compression>
<anti_patterns>
  <avoid name="permissive_cors">Avoid CorsLayer::permissive in prod</avoid>
  <avoid name="double_timeout">Avoid stacking multiple timeouts</avoid>
  <avoid name="log_pii">Avoid logging sensitive headers in TraceLayer</avoid>
</anti_patterns>
