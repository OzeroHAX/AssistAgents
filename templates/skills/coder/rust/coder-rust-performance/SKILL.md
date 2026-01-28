---
name: coder-rust-performance
description: Rust performance best practices. Use when optimizing allocations, hot paths, or data structures.
---
<skill_overview>
  <purpose>Keep Rust code fast while staying idiomatic</purpose>
  <triggers>
    <trigger>Optimizing hot loops</trigger>
    <trigger>Reducing allocations</trigger>
    <trigger>Choosing data structures</trigger>
    <trigger>Measuring performance impact</trigger>
  </triggers>
  <sources>
    <source url="https://doc.rust-lang.org/book/ch13-04-performance.html">The Rust Book - Performance</source>
  </sources>
</skill_overview>
<zero_cost_abstractions>
  <rules>
    <rule>Use iterators and closures freely; they compile to efficient code</rule>
    <rule>Prefer expressive, safe code and measure before micro-optimizing</rule>
  </rules>
</zero_cost_abstractions>
<allocations>
  <rules>
    <rule>Prefer borrowing (&amp;str, &amp;[T]) over allocating (String, Vec)</rule>
    <rule>Pre-allocate with Vec::with_capacity when size is known</rule>
    <rule>Avoid unnecessary clones; pass references where possible</rule>
  </rules>
  <example>
    <code>
let mut buf = Vec::with_capacity(1024);
    </code>
  </example>
</allocations>
<hot_paths>
  <rules>
    <rule>Avoid repeated formatting or allocation in tight loops</rule>
    <rule>Reuse buffers and temporary values when possible</rule>
  </rules>
</hot_paths>
<measurement>
  <rules>
    <rule>Benchmark with realistic data sizes</rule>
    <rule>Compare before and after changes</rule>
  </rules>
</measurement>
<anti_patterns>
  <avoid name="premature_optimization">Optimizing before profiling</avoid>
  <avoid name="clone_in_loops">Cloning on each iteration</avoid>
  <avoid name="unbounded_growth">Growing collections without bounds</avoid>
</anti_patterns>
