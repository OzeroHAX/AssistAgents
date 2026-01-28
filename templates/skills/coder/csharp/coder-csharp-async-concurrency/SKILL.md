---
name: coder-csharp-async-concurrency
description: C# async/await and concurrency best practices. Use when writing async code, coordinating tasks, or handling cancellation.
---
<skill_overview>
  <purpose>Build reliable async flows and safe multi-threaded code</purpose>
  <triggers>
    <trigger>Writing async methods</trigger>
    <trigger>Coordinating multiple tasks</trigger>
    <trigger>Adding cancellation support</trigger>
    <trigger>Working with concurrent collections</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/async-scenarios">Async Scenarios</source>
    <source url="https://learn.microsoft.com/en-us/dotnet/standard/collections/thread-safe/">Thread-Safe Collections</source>
    <source url="https://learn.microsoft.com/en-us/dotnet/core/extensions/channels">System.Threading.Channels</source>
  </sources>
</skill_overview>
<async_await_rules>
  <rules>
    <rule>Use async/await end-to-end; avoid blocking waits</rule>
    <rule>Return Task/ValueTask, not void (except event handlers)</rule>
    <rule>Use ConfigureAwait(false) in library code</rule>
  </rules>
</async_await_rules>
<task_coordination>
  <rules>
    <rule>Use Task.WhenAll for independent work</rule>
    <rule>Use Task.WhenAny for first-completion patterns</rule>
    <rule>Handle exceptions from all tasks</rule>
  </rules>
  <example>
    <code>
await Task.WhenAll(fetchUserTask, fetchOrdersTask);
    </code>
  </example>
</task_coordination>
<cancellation>
  <rules>
    <rule>Accept CancellationToken in cancellable APIs</rule>
    <rule>Pass the token to all awaited operations</rule>
    <rule>Respect cancellation promptly</rule>
  </rules>
</cancellation>
<concurrency_primitives>
  <rules>
    <rule>Use ConcurrentDictionary, ConcurrentQueue, ConcurrentBag for shared collections</rule>
    <rule>Use Channel for producer-consumer pipelines</rule>
    <rule>Keep lock scope minimal and consistent</rule>
  </rules>
</concurrency_primitives>
<deadlocks>
  <rules>
    <rule>Never use .Result or .Wait on async operations</rule>
    <rule>Avoid blocking inside async methods</rule>
    <rule>Do not capture synchronization context in libraries</rule>
  </rules>
</deadlocks>
<anti_patterns>
  <avoid name="sync_over_async">Blocking on async tasks</avoid>
  <avoid name="async_void">async void outside event handlers</avoid>
  <avoid name="shared_mutable_state">Mutable shared state without synchronization</avoid>
</anti_patterns>
