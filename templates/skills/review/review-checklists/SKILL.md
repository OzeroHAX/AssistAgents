---
name: review-checklists
description: Comprehensive checklists for code review across Security, Performance, Logic, and Testing.
---
<skill_overview>
  <purpose>Ensure no critical aspects are missed during code review by providing domain-specific checklists.</purpose>
  <triggers>
    <trigger>Performing the "Deep Pass" or "Test Review" steps of the review process.</trigger>
  </triggers>
</skill_overview>

<checklist_security>
  <item><strong>Input Validation</strong>: Are all inputs (API, user, file) validated and sanitized?</item>
  <item><strong>Authentication/Authorization</strong>: Are sensitive endpoints protected? Are permission checks correct?</item>
  <item><strong>Secrets</strong>: Are any keys, tokens, or passwords hardcoded? (Check logs too!)</item>
  <item><strong>Data Exposure</strong>: Is sensitive data (PII) accidentally returned in API responses?</item>
  <item><strong>Dependencies</strong>: Are new dependencies necessary and trustworthy?</item>
</checklist_security>

<checklist_performance>
  <item><strong>Database</strong>: Check for N+1 queries, missing indexes, or selecting unnecessary columns (`SELECT *`).</item>
  <item><strong>Loops</strong>: Avoid expensive operations (I/O, DB calls) inside loops.</item>
  <item><strong>Memory</strong>: Check for large object allocations or memory leaks (e.g., unclosed streams/listeners).</item>
  <item><strong>Async</strong>: Are promises handled correctly? Is `await` used sequentially when parallel `Promise.all` would work?</item>
  <item><strong>Frontend</strong>: Check for unnecessary re-renders or large bundle additions.</item>
</checklist_performance>

<checklist_reliability_logic>
  <item><strong>Error Handling</strong>: Are errors caught? Are they logged with context? Is the user experience graceful on failure?</item>
  <item><strong>Null/Undefined</strong>: Check for potential null pointer exceptions or undefined access.</item>
  <item><strong>Concurrency</strong>: Check for race conditions in shared state.</item>
  <item><strong>State Management</strong>: Is state mutation predictable?</item>
  <item><strong>Edge Cases</strong>: Empty arrays, zero values, max values, negative numbers, special characters.</item>
</checklist_reliability_logic>

<checklist_testing>
  <item><strong>Existence</strong>: Is there a corresponding test for the new code?</item>
  <item><strong>Coverage</strong>: Do tests cover the happy path, error paths, and edge cases?</item>
  <item><strong>Independence</strong>: Do tests rely on external state or execution order?</item>
  <item><strong>Assertions</strong>: Are assertions specific? (Avoid `assert(true)` or weak checks).</item>
  <item><strong>Readability</strong>: Are tests easy to understand? Do they document the behavior?</item>
</checklist_testing>

<checklist_maintainability>
  <item><strong>Naming</strong>: Do names reveal intent? (e.g., `isUserActive` vs `status`).</item>
  <item><strong>Complexity</strong>: Can functions be simplified or broken down?</item>
  <item><strong>Duplication</strong>: Is code copy-pasted? Can it be refactored into a utility?</item>
  <item><strong>Comments</strong>: Do comments explain *why*, not *what*? Are TODOs actionable?</item>
  <item><strong>Configuration</strong>: Are magic numbers/strings extracted to constants or config?</item>
</checklist_maintainability>

<language_specific_pointers>
  <important_rule>
    When reviewing code in a specific language or framework, ensure you are familiar with its conventions and best practices.
    If available, use specialized knowledge sources or skills for that technology stack.
  </important_rule>
</language_specific_pointers>
