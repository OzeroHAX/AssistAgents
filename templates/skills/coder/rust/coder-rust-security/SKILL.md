---
name: coder-rust-security
description: Rust security best practices focused on safety, unsafe code boundaries, and input validation.
---
<skill_overview>
  <purpose>Maintain Rust safety guarantees and reduce security risks</purpose>
  <triggers>
    <trigger>Using unsafe code</trigger>
    <trigger>Handling untrusted input</trigger>
    <trigger>FFI boundaries</trigger>
    <trigger>Working with shared state</trigger>
  </triggers>
  <sources>
    <source url="https://doc.rust-lang.org/nomicon/meet-safe-and-unsafe.html">The Rustonomicon - Meet Safe and Unsafe</source>
    <source url="https://doc.rust-lang.org/nomicon/what-unsafe-does.html">The Rustonomicon - What Unsafe Does</source>
  </sources>
</skill_overview>
<safe_vs_unsafe>
  <rules>
    <rule>Prefer safe Rust; avoid unsafe unless strictly necessary</rule>
    <rule>Keep unsafe blocks small and well-audited</rule>
    <rule>Document invariants required by unsafe code</rule>
  </rules>
</safe_vs_unsafe>
<unsafe_boundaries>
  <rules>
    <rule>Validate all inputs to unsafe functions</rule>
    <rule>Wrap unsafe code in safe, minimal APIs</rule>
    <rule>Never create invalid values (bad enum discriminants, null fn pointers)</rule>
  </rules>
</unsafe_boundaries>
<input_validation>
  <rules>
    <rule>Treat external input as untrusted</rule>
    <rule>Parse into validated types (newtypes, enums)</rule>
    <rule>Fail fast on invalid input</rule>
  </rules>
</input_validation>
<secrets_handling>
  <rules>
    <rule>Do not log secrets or credentials</rule>
    <rule>Avoid keeping secrets in long-lived Strings</rule>
  </rules>
</secrets_handling>
<anti_patterns>
  <avoid name="large_unsafe">Large unsafe blocks without invariants</avoid>
  <avoid name="unchecked_input">Parsing input without validation</avoid>
  <avoid name="leaky_logs">Logging sensitive data</avoid>
</anti_patterns>
