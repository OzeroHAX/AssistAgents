---
name: coder-typescript-vuejs-composables
description: Vue 3 composables best practices: naming, inputs/outputs, cleanup, and effect scope.
---
<skill_overview>
  <purpose>Design reusable, testable composables with predictable lifecycles</purpose>
  <triggers>
    <trigger>Extracting reusable logic from components</trigger>
    <trigger>Building shared stateful utilities</trigger>
    <trigger>Adding side effects in composables</trigger>
  </triggers>
  <sources>
    <source url="https://vuejs.org/guide/reusability/composables.html">Composables</source>
    <source url="https://vuejs.org/guide/components/provide-inject.html">Provide / Inject</source>
  </sources>
</skill_overview>
<naming_and_usage>
  <rules>
    <rule>Name composables with use* prefix (useMouse, useFetch)</rule>
    <rule>Call composables synchronously in setup or <script setup></rule>
    <rule>Return a plain object of refs and functions</rule>
  </rules>
</naming_and_usage>
<inputs_outputs>
  <rules>
    <rule>Accept refs or plain values for flexibility</rule>
    <rule>Expose minimal surface area (only what callers need)</rule>
    <rule>Keep state internal unless it must be shared</rule>
  </rules>
  <example>
    <code>
export function useMouse() {
  const x = ref(0);
  const y = ref(0);
  return { x, y };
}
    </code>
  </example>
</inputs_outputs>
<side_effects>
  <rules>
    <rule>Register side effects in onMounted and cleanup in onUnmounted</rule>
    <rule>Do not access window/document during SSR</rule>
  </rules>
</side_effects>
<provide_inject>
  <rules>
    <rule>Prefer providing mutation functions, not raw mutable state</rule>
    <rule>Use readonly() for injected state when appropriate</rule>
    <rule>Use Symbol keys in libraries to avoid collisions</rule>
  </rules>
</provide_inject>
<anti_patterns>
  <avoid name="global_side_effects">Running effects at import time</avoid>
  <avoid name="reactive_return">Returning reactive() instead of plain refs</avoid>
  <avoid name="missing_cleanup">No teardown for subscriptions/listeners</avoid>
</anti_patterns>
