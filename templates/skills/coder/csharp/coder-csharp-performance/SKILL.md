---
name: coder-csharp-performance
description: C#/.NET performance best practices. Use when optimizing allocations, hot paths, or async performance.
---
<skill_overview>
  <purpose>Improve runtime performance with allocation-aware and measurable changes</purpose>
  <triggers>
    <trigger>Profiling slow code paths</trigger>
    <trigger>Reducing allocations or GC pressure</trigger>
    <trigger>Optimizing async or I/O-heavy code</trigger>
    <trigger>Improving startup or throughput</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/dotnet/standard/performance/">.NET Performance</source>
    <source url="https://learn.microsoft.com/en-us/dotnet/standard/memory-and-spans/">Memory and Spans</source>
    <source url="https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals">GC Fundamentals</source>
  </sources>
</skill_overview>
<measurement>
  <rules>
    <rule>Measure before and after every change</rule>
    <rule>Use representative inputs and realistic data sizes</rule>
    <rule>Optimize the slowest 10% first</rule>
  </rules>
</measurement>
<allocations>
  <rules>
    <rule>Avoid unnecessary allocations in hot paths</rule>
    <rule>Reuse buffers with ArrayPool for large temporary arrays</rule>
    <rule>Use StringBuilder for repeated concatenation</rule>
    <rule>Prefer stackalloc + Span&lt;T&gt; for small, short-lived buffers</rule>
  </rules>
  <example>
    <code>
Span&lt;byte&gt; buffer = stackalloc byte[128];
// Fill buffer without heap allocation
    </code>
  </example>
</allocations>
<spans_and_memory>
  <rules>
    <rule>Prefer Span&lt;T&gt; and ReadOnlySpan&lt;T&gt; for sync APIs</rule>
    <rule>Use Memory&lt;T&gt; only when data must outlive the stack frame</rule>
    <rule>Do not capture Span&lt;T&gt; across async/await</rule>
  </rules>
</spans_and_memory>
<linq_and_enumeration>
  <rules>
    <rule>Avoid multiple enumeration; materialize once if needed</rule>
    <rule>Prefer simple loops over complex LINQ in hot paths</rule>
  </rules>
</linq_and_enumeration>
<async_performance>
  <rules>
    <rule>Use ValueTask for cached or synchronous completions</rule>
    <rule>Avoid sync-over-async (.Result, .Wait)</rule>
    <rule>Pass CancellationToken to cancellable operations</rule>
  </rules>
</async_performance>
<gc_considerations>
  <rules>
    <rule>Keep large objects (>= 85 KB) to a minimum</rule>
    <rule>Dispose IDisposables promptly</rule>
    <rule>Avoid long-lived object graphs when possible</rule>
  </rules>
</gc_considerations>
<anti_patterns>
  <avoid name="premature_optimization">Optimizing without measurements</avoid>
  <avoid name="hot_path_linq">Heavy LINQ in tight loops</avoid>
  <avoid name="large_object_churn">Repeated LOH allocations</avoid>
</anti_patterns>
