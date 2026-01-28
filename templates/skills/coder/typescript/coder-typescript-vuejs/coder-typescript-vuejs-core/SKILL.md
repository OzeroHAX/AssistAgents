---
name: coder-typescript-vuejs-core
description: Vue 3 core best practices for SFCs, <script setup>, components, props/emits, and slots with TypeScript.
---
<skill_overview>
  <purpose>Write clean, typed Vue components with predictable data flow</purpose>
  <triggers>
    <trigger>Creating or refactoring Vue SFCs</trigger>
    <trigger>Defining props/emits with TypeScript</trigger>
    <trigger>Designing component APIs and slots</trigger>
  </triggers>
  <sources>
    <source url="https://vuejs.org/guide/scaling-up/sfc">Single-File Components</source>
    <source url="https://vuejs.org/api/sfc-script-setup">SFC <script setup></source>
    <source url="https://vuejs.org/guide/components/props">Props</source>
    <source url="https://vuejs.org/guide/components/events">Component Events</source>
    <source url="https://vuejs.org/guide/components/slots">Slots</source>
  </sources>
</skill_overview>
<script_setup>
  <rules>
    <rule>Use <script setup> as the default SFC syntax</rule>
    <rule>Keep top-level bindings minimal and focused</rule>
    <rule>Prefer defineProps/defineEmits for typed component APIs</rule>
  </rules>
  <example>
    <code>
&lt;script setup lang="ts"&gt;
const props = defineProps&lt;{ id: string; title?: string }&gt;();
const emit = defineEmits&lt;{ (e: "save", id: string): void }&gt;();
&lt;/script&gt;
    </code>
  </example>
</script_setup>
<props_emits>
  <rules>
    <rule>Keep props immutable; never mutate props directly</rule>
    <rule>Use explicit emit signatures for type safety</rule>
    <rule>Prefer one-way data flow; use events for updates</rule>
  </rules>
</props_emits>
<component_design>
  <rules>
    <rule>Keep components small with clear responsibilities</rule>
    <rule>Prefer composition over deep inheritance-style hierarchies</rule>
    <rule>Expose minimal surface area (props/slots/emits)</rule>
  </rules>
</component_design>
<slots>
  <rules>
    <rule>Use named slots for complex layouts</rule>
    <rule>Document slot props for consumers</rule>
  </rules>
</slots>
<template_hygiene>
  <rules>
    <rule>Keep templates declarative; move logic into computed or methods</rule>
    <rule>Use key on v-for with stable identifiers</rule>
  </rules>
</template_hygiene>
<anti_patterns>
  <avoid name="prop_mutation">Mutating props inside child components</avoid>
  <avoid name="template_logic">Complex logic directly in template</avoid>
  <avoid name="implicit_events">Emitting events without declaration</avoid>
</anti_patterns>
