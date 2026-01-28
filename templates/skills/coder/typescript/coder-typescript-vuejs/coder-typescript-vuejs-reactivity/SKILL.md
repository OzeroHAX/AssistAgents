---
name: coder-typescript-vuejs-reactivity
description: Vue 3 reactivity best practices: ref/reactive, computed, watch/watchEffect, and lifecycle-safe patterns.
---
<skill_overview>
  <purpose>Use Vue reactivity correctly and efficiently with TypeScript</purpose>
  <triggers>
    <trigger>Managing component state with refs and reactive objects</trigger>
    <trigger>Deriving state with computed</trigger>
    <trigger>Responding to changes with watch or watchEffect</trigger>
  </triggers>
  <sources>
    <source url="https://vuejs.org/guide/essentials/reactivity-fundamentals">Reactivity Fundamentals</source>
    <source url="https://vuejs.org/guide/essentials/computed">Computed Properties</source>
    <source url="https://vuejs.org/guide/essentials/watchers">Watchers</source>
    <source url="https://vuejs.org/api/reactivity-core">Reactivity API</source>
  </sources>
</skill_overview>
<ref_vs_reactive>
  <rules>
    <rule>Use ref for primitives; use reactive for objects</rule>
    <rule>Prefer shallowRef/shallowReactive for large immutable structures</rule>
    <rule>Avoid destructuring reactive objects without toRefs</rule>
  </rules>
  <example>
    <code>
const state = reactive({ count: 0, label: "A" });
const { count } = toRefs(state);
    </code>
  </example>
</ref_vs_reactive>
<computed>
  <rules>
    <rule>Use computed for derived state that needs caching</rule>
    <rule>Keep computed getters side-effect free</rule>
    <rule>Prefer computed over methods for values used in templates</rule>
  </rules>
  <example>
    <code>
const total = computed(() => items.value.reduce((sum, i) => sum + i.price, 0));
    </code>
  </example>
</computed>
<watchers>
  <rules>
    <rule>Use watch for explicit sources and async side effects</rule>
    <rule>Use watchEffect for automatic dependency tracking</rule>
    <rule>Clean up effects with onCleanup when needed</rule>
  </rules>
</watchers>
<reactive_props>
  <rules>
    <rule>Prefer defineProps with types for clarity</rule>
    <rule>Do not mutate props; derive local state if needed</rule>
  </rules>
</reactive_props>
<anti_patterns>
  <avoid name="deep_watch">Deep watch on large objects without need</avoid>
  <avoid name="computed_side_effects">Side effects inside computed getters</avoid>
  <avoid name="lost_reactivity">Destructuring reactive without toRefs</avoid>
</anti_patterns>
