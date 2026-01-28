---
name: coder-typescript-performance
description: TypeScript/JavaScript performance best practices: profiling, hot paths, memory, and async throughput. Use when optimizing TS code.
---
<skill_overview>
  <purpose>Improve runtime performance through measurement-driven changes</purpose>
  <triggers>
    <trigger>Profiling slow functions or scripts</trigger>
    <trigger>Optimizing hot paths</trigger>
    <trigger>Reducing memory pressure</trigger>
    <trigger>Improving startup time</trigger>
  </triggers>
  <sources>
    <source url="https://nodejs.org/api/perf_hooks.html">Node.js Performance Hooks</source>
  </sources>
</skill_overview>
<measurement>
  <rules>
    <rule>Measure before and after every optimization</rule>
    <rule>Use performance marks and measures instead of Date.now()</rule>
    <rule>Benchmark with representative data sizes</rule>
  </rules>
  <example>
    <code>
import { performance, PerformanceObserver } from "node:perf_hooks";

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.name, entry.duration);
  performance.clearMarks();
  performance.clearMeasures();
});
obs.observe({ type: "measure" });

performance.mark("start");
doWork();
performance.mark("end");
performance.measure("doWork", "start", "end");
    </code>
  </example>
</measurement>
<hot_paths>
  <rules>
    <rule>Avoid unnecessary allocations inside tight loops</rule>
    <rule>Precompile and reuse regular expressions</rule>
    <rule>Prefer simple loops over chained array methods in hot paths</rule>
    <rule>Do not JSON.parse or JSON.stringify inside loops</rule>
  </rules>
</hot_paths>
<data_structures>
  <rules>
    <rule>Use Map/Set for large dynamic key sets</rule>
    <rule>Use arrays for dense numeric indices</rule>
    <rule>Use plain objects for small fixed key sets</rule>
  </rules>
</data_structures>
<async_throughput>
  <rules>
    <rule>Run independent tasks in parallel with Promise.all</rule>
    <rule>Avoid serial awaits when concurrency is safe</rule>
    <rule>Limit concurrency to prevent overload</rule>
  </rules>
  <example>
    <code>
const [user, orders] = await Promise.all([
  fetchUser(userId),
  fetchOrders(userId)
]);
    </code>
  </example>
</async_throughput>
<memory_management>
  <rules>
    <rule>Clear timers and intervals when no longer needed</rule>
    <rule>Remove event listeners to avoid leaks</rule>
    <rule>Bound caches with size or TTL</rule>
  </rules>
</memory_management>
<anti_patterns>
  <avoid name="premature_optimization">Optimizing without profiling data</avoid>
  <avoid name="chatty_allocations">Creating new objects in tight loops</avoid>
  <avoid name="unbounded_cache">Growing in-memory caches without limits</avoid>
</anti_patterns>
