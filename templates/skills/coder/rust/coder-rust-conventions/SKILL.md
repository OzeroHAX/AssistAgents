---
name: coder-rust-conventions
description: Rust coding conventions, naming rules, and idiomatic patterns (rustfmt, clippy, ownership). Use when writing or reviewing Rust code.
---
<skill_overview>
  <purpose>Write idiomatic, readable, and maintainable Rust</purpose>
  <triggers>
    <trigger>Writing new Rust code</trigger>
    <trigger>Reviewing naming and style</trigger>
    <trigger>Refactoring for idiomatic patterns</trigger>
    <trigger>Setting formatting and lint rules</trigger>
  </triggers>
  <sources>
    <source url="https://rust-lang.github.io/api-guidelines/">Rust API Guidelines</source>
    <source url="https://rust-lang.github.io/rustfmt/">rustfmt</source>
    <source url="https://github.com/rust-lang/rust-clippy">Clippy</source>
  </sources>
</skill_overview>
<naming_conventions>
  <rule name="snake_case">Functions, variables, modules, files</rule>
  <rule name="PascalCase">Types, traits, enums, enum variants</rule>
  <rule name="SCREAMING_SNAKE_CASE">Constants, static items</rule>
  <rule name="as_">Use as_* for cheap conversions</rule>
  <rule name="to_">Use to_* for potentially expensive conversions</rule>
</naming_conventions>
<formatting>
  <rules>
    <rule>Always run cargo fmt before commit</rule>
    <rule>Prefer trailing commas to reduce diff noise</rule>
    <rule>Avoid manual alignment; let rustfmt decide</rule>
  </rules>
</formatting>
<ownership_and_borrowing>
  <rules>
    <rule>Prefer borrowing over cloning</rule>
    <rule>Take &str or &[T] for read-only inputs</rule>
    <rule>Use iterators instead of index-based loops</rule>
    <rule>Return owned values when caller should own data</rule>
  </rules>
  <example>
    <code>
fn find_user(name: &str, users: &[User]) -> Option<&User> { /* ... */ }
    </code>
  </example>
</ownership_and_borrowing>
<pattern_matching>
  <rules>
    <rule>Use exhaustive match for enums</rule>
    <rule>Avoid catch-all _ unless truly unreachable</rule>
    <rule>Use if let / while let for single-variant matches</rule>
  </rules>
</pattern_matching>
<anti_patterns>
  <avoid name="unwrap_in_prod">Avoid unwrap/expect in non-test code</avoid>
  <avoid name="clone_everywhere">Do not clone to silence borrow checker</avoid>
  <avoid name="large_mutable_state">Avoid large mutable shared state</avoid>
</anti_patterns>
