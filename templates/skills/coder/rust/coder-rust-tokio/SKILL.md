---
name: coder-rust-tokio
description: Tokio async runtime best practices including tasks, timeouts, channels, and blocking isolation. Use when writing async Rust services.
---
<skill_overview>
  <purpose>Build reliable async services on the Tokio runtime</purpose>
  <triggers>
    <trigger>Starting or configuring the Tokio runtime</trigger>
    <trigger>Spawning concurrent tasks</trigger>
    <trigger>Applying timeouts and cancellation</trigger>
    <trigger>Using async channels and synchronization</trigger>
    <trigger>Mixing blocking and async work</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/tokio-rs/tokio">Tokio GitHub</source>
    <source url="https://docs.rs/tokio">Tokio Docs</source>
  </sources>
</skill_overview>
<runtime>
  <rules>
    <rule>Use #[tokio::main] only in binaries</rule>
    <rule>Avoid creating multiple runtimes in one process</rule>
    <rule>Pick multi_thread for servers, current_thread for CLI</rule>
  </rules>
</runtime>
<tasks>
  <rules>
    <rule>Use tokio::spawn for concurrent async tasks</rule>
    <rule>Always handle JoinHandle results</rule>
    <rule>Prefer JoinSet for managing many tasks</rule>
  </rules>
  <example>
    <code>
let handle = tokio::spawn(async move { do_work().await });
let result = handle.await?;
    </code>
  </example>
</tasks>
<timeouts_and_cancellation>
  <rules>
    <rule>Wrap external calls with tokio::time::timeout</rule>
    <rule>Use tokio::select! for cancellation paths</rule>
    <rule>Propagate cancellation by dropping senders</rule>
  </rules>
  <example>
    <code>
let res = tokio::time::timeout(Duration::from_secs(2), call()).await;
    </code>
  </example>
</timeouts_and_cancellation>
<channels>
  <rules>
    <rule>Use bounded channels for backpressure</rule>
    <rule>Pick mpsc for work queues, oneshot for single reply</rule>
    <rule>Handle closed channels without panic</rule>
  </rules>
</channels>
<blocking_work>
  <rules>
    <rule>Never call blocking code on async runtime threads</rule>
    <rule>Use spawn_blocking for CPU-bound or blocking I/O</rule>
    <rule>Prefer tokio::fs and tokio::net for async I/O</rule>
  </rules>
</blocking_work>
<anti_patterns>
  <avoid name="std_sleep">Avoid std::thread::sleep in async code</avoid>
  <avoid name="fire_and_forget">Avoid spawning tasks without tracking them</avoid>
  <avoid name="blocking_in_async">Avoid blocking calls inside async handlers</avoid>
</anti_patterns>
