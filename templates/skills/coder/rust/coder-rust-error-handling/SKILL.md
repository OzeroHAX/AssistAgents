---
name: coder-rust-error-handling
description: Rust error handling, validation, and Result best practices. Use when designing error flows or mapping errors across boundaries.
---
<skill_overview>
  <purpose>Design predictable and ergonomic error handling in Rust</purpose>
  <triggers>
    <trigger>Designing error types</trigger>
    <trigger>Propagating errors with Result</trigger>
    <trigger>Mapping errors at API boundaries</trigger>
    <trigger>Choosing between panic and Result</trigger>
  </triggers>
  <sources>
    <source url="https://doc.rust-lang.org/book/ch09-00-error-handling.html">The Rust Book - Error Handling</source>
  </sources>
</skill_overview>
<panic_vs_result>
  <use_panic_when>
    <case>Unrecoverable, invariant-breaking failures</case>
    <case>Bug in the program (logic error)</case>
  </use_panic_when>
  <use_result_when>
    <case>Expected errors (not found, validation)</case>
    <case>I/O or external dependency failures</case>
  </use_result_when>
</panic_vs_result>
<error_types>
  <rules>
    <rule>Define a dedicated error enum for a module or service</rule>
    <rule>Implement Display and Error for custom errors</rule>
    <rule>Use From to convert lower-level errors</rule>
  </rules>
  <example>
    <code>
enum ServiceError { NotFound, InvalidInput, Io(std::io::Error) }
    </code>
  </example>
</error_types>
<propagation>
  <rules>
    <rule>Use ? to propagate errors</rule>
    <rule>Add context with map_err or custom variants</rule>
    <rule>Preserve original error for debugging</rule>
  </rules>
</propagation>
<boundary_mapping>
  <rules>
    <rule>Map internal errors to public error codes/messages</rule>
    <rule>Do not leak sensitive details to clients</rule>
  </rules>
</boundary_mapping>
<anti_patterns>
  <avoid name="unwrap_in_flow">Avoid unwrap/expect for normal flow</avoid>
  <avoid name="string_errors">Avoid plain String errors without structure</avoid>
  <avoid name="panic_for_validation">Do not panic on validation failures</avoid>
</anti_patterns>
