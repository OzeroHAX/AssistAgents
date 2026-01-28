---
name: coder-rust-async-concurrency
description: Rust concurrency and async best practices using std and language features. Use when writing thread-safe or async code.
---
<skill_overview>
  <purpose>Write correct, deadlock-free concurrent Rust code</purpose>
  <triggers>
    <trigger>Spawning threads or tasks</trigger>
    <trigger>Sharing state across threads</trigger>
    <trigger>Using channels for message passing</trigger>
    <trigger>Writing async/await code</trigger>
  </triggers>
  <sources>
    <source url="https://doc.rust-lang.org/book/ch16-00-concurrency.html">The Rust Book - Concurrency</source>
    <source url="https://doc.rust-lang.org/book/ch17-00-async-await.html">The Rust Book - Async/Await</source>
  </sources>
</skill_overview>
<message_passing>
  <rules>
    <rule>Prefer channels to avoid shared mutable state</rule>
    <rule>Move ownership through channels to enforce safety</rule>
  </rules>
  <example>
    <code>
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();
tx.send(42).unwrap();
let value = rx.recv().unwrap();
    </code>
  </example>
</message_passing>
<shared_state>
  <rules>
    <rule>Use Arc&lt;Mutex&lt;T&gt;&gt; or Arc&lt;RwLock&lt;T&gt;&gt; for shared mutable state</rule>
    <rule>Keep lock scopes minimal and consistent</rule>
    <rule>Handle poison errors explicitly</rule>
  </rules>
</shared_state>
<send_sync>
  <rules>
    <rule>Use types that implement Send and Sync across threads</rule>
    <rule>Avoid Rc and RefCell in multi-threaded code</rule>
  </rules>
</send_sync>
<async_guidelines>
  <rules>
    <rule>Use async/await for I/O-bound work</rule>
    <rule>Do not block inside async functions</rule>
    <rule>Async code still needs an executor to run</rule>
  </rules>
</async_guidelines>
<deadlocks>
  <rules>
    <rule>Lock in a consistent order</rule>
    <rule>Drop guards before calling into other code</rule>
  </rules>
</deadlocks>
<anti_patterns>
  <avoid name="rc_in_threads">Using Rc&lt;T&gt; across threads</avoid>
  <avoid name="long_lock_scope">Holding a lock across long operations</avoid>
  <avoid name="blocking_in_async">Blocking I/O inside async code</avoid>
</anti_patterns>
