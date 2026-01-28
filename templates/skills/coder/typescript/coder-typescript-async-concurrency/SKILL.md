---
name: coder-typescript-async-concurrency
description: Async/await, Promise composition, cancellation, and concurrency limits for TypeScript/JavaScript. Use when writing async code.
---
<skill_overview>
  <purpose>Write reliable async code with clear error handling and bounded concurrency</purpose>
  <triggers>
    <trigger>Writing async functions or promise chains</trigger>
    <trigger>Parallelizing independent tasks</trigger>
    <trigger>Adding cancellation or timeouts</trigger>
    <trigger>Debugging unhandled rejections</trigger>
  </triggers>
  <sources>
    <source url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">MDN Promise Reference</source>
    <source url="https://nodejs.org/api/globals.html#class-abortcontroller">Node.js AbortController</source>
  </sources>
</skill_overview>
<async_await_rules>
  <rules>
    <rule>Use async/await end-to-end; avoid mixing with callbacks</rule>
    <rule>Return Promise from async functions, never void</rule>
    <rule>Do not ignore rejected promises; handle or propagate</rule>
  </rules>
</async_await_rules>
<promise_composition>
  <rules>
    <rule>Use Promise.all for independent work that must all succeed</rule>
    <rule>Use Promise.allSettled when partial failures are acceptable</rule>
    <rule>Use Promise.race or Promise.any for first-success strategies</rule>
  </rules>
  <example>
    <code>
const results = await Promise.allSettled([
  fetchProfile(userId),
  fetchOrders(userId)
]);
    </code>
  </example>
</promise_composition>
<error_handling>
  <rules>
    <rule>Wrap awaited operations in try/catch at boundaries</rule>
    <rule>Normalize errors to a consistent shape for callers</rule>
    <rule>Use unknown in catch and narrow explicitly</rule>
  </rules>
</error_handling>
<cancellation>
  <rules>
    <rule>Pass AbortSignal through async call chains</rule>
    <rule>Abort work on timeouts or user cancellation</rule>
  </rules>
  <example>
    <code>
const controller = new AbortController();
const { signal } = controller;

const task = fetch(url, { signal });
controller.abort();
await task;
    </code>
  </example>
</cancellation>
<concurrency_limits>
  <rules>
    <rule>Bound concurrency for IO-heavy operations</rule>
    <rule>Queue excess tasks instead of spawning unbounded promises</rule>
  </rules>
</concurrency_limits>
<anti_patterns>
  <avoid name="serial_awaits">Awaiting independent tasks sequentially</avoid>
  <avoid name="floating_promises">Creating promises without awaiting or handling</avoid>
  <avoid name="unbounded_parallelism">Launching too many requests at once</avoid>
</anti_patterns>
