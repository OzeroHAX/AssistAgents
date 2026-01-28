---
name: coder-typescript-vuejs-performance
description: Vue 3 performance best practices: rendering, memoization, list rendering, and component boundaries.
---
<skill_overview>
  <purpose>Keep Vue rendering fast and avoid unnecessary updates</purpose>
  <triggers>
    <trigger>Optimizing large lists or frequent updates</trigger>
    <trigger>Reducing unnecessary re-renders</trigger>
    <trigger>Designing component boundaries for performance</trigger>
  </triggers>
  <sources>
    <source url="https://vuejs.org/guide/best-practices/performance">Performance Best Practices</source>
    <source url="https://vuejs.org/guide/essentials/list">List Rendering</source>
  </sources>
</skill_overview>
<rendering_optimizations>
  <rules>
    <rule>Use v-memo to skip updates for stable subtrees</rule>
    <rule>Use v-once for static content</rule>
    <rule>Keep props stable to avoid child updates</rule>
  </rules>
</rendering_optimizations>
<list_rendering>
  <rules>
    <rule>Always provide stable, unique keys in v-for</rule>
    <rule>Avoid using array index as key for mutable lists</rule>
    <rule>Virtualize very large lists</rule>
  </rules>
</list_rendering>
<computed_vs_methods>
  <rules>
    <rule>Use computed for cached derived state</rule>
    <rule>Use methods for actions or uncached calculations</rule>
  </rules>
</computed_vs_methods>
<component_boundaries>
  <rules>
    <rule>Avoid excessive component nesting for tiny templates</rule>
    <rule>Use keep-alive for caching expensive component trees</rule>
    <rule>Lazy-load non-critical components</rule>
  </rules>
</component_boundaries>
<anti_patterns>
  <avoid name="unstable_keys">Using non-unique or unstable v-for keys</avoid>
  <avoid name="over_componentization">Many small components that re-render together</avoid>
  <avoid name="reactive_everything">Making large immutable data deeply reactive</avoid>
</anti_patterns>
