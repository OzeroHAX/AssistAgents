---
name: coder-rust-testing
description: Rust unit and integration testing best practices. Use when writing tests or setting up test structure.
---
<skill_overview>
  <purpose>Write fast, reliable, and maintainable Rust tests</purpose>
  <triggers>
    <trigger>Writing unit tests</trigger>
    <trigger>Adding integration tests</trigger>
    <trigger>Testing async code</trigger>
    <trigger>Improving test reliability</trigger>
  </triggers>
  <sources>
    <source url="https://doc.rust-lang.org/book/ch11-00-testing.html">The Rust Book - Testing</source>
  </sources>
</skill_overview>
<test_structure>
  <rules>
    <rule>Use #[cfg(test)] mod tests in the same module for unit tests</rule>
    <rule>Put integration tests in tests/ as separate crates</rule>
    <rule>Keep tests independent and deterministic</rule>
  </rules>
</test_structure>
<arrange_act_assert>
  <rule>Structure each test with Arrange, Act, Assert</rule>
  <example>
    <code>
#[test]
fn add_two_numbers_returns_sum() {
    let result = add(2, 3);
    assert_eq!(5, result);
}
    </code>
  </example>
</arrange_act_assert>
<async_tests>
  <rules>
    <rule>Use an async test harness provided by your runtime</rule>
    <rule>Avoid sleeps; use timeouts and deterministic inputs</rule>
  </rules>
</async_tests>
<assertions>
  <rules>
    <rule>Use assert!, assert_eq!, assert_ne! for clarity</rule>
    <rule>Use matches! for enum pattern assertions</rule>
  </rules>
</assertions>
<anti_patterns>
  <avoid name="order_dependent">Tests that depend on execution order</avoid>
  <avoid name="real_external">Hitting real external services in unit tests</avoid>
  <avoid name="global_mutable">Global mutable state shared across tests</avoid>
</anti_patterns>
