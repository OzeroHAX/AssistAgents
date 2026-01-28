---
name: coder-typescript-vuejs-testing
description: Vue 3 testing best practices: unit, component, and e2e tests with recommended tooling.
---
<skill_overview>
  <purpose>Test Vue components and composables with fast, reliable patterns</purpose>
  <triggers>
    <trigger>Writing unit tests for logic or composables</trigger>
    <trigger>Testing components and slots</trigger>
    <trigger>Adding end-to-end coverage</trigger>
  </triggers>
  <sources>
    <source url="https://vuejs.org/guide/scaling-up/testing">Testing</source>
    <source url="https://test-utils.vuejs.org/guide/">Vue Test Utils</source>
  </sources>
</skill_overview>
<test_types>
  <unit>
    <description>Test composables and pure logic in isolation</description>
  </unit>
  <component>
    <description>Test component behavior via props, events, and slots</description>
  </component>
  <e2e>
    <description>Test full user flows in a real browser</description>
  </e2e>
</test_types>
<tooling>
  <rules>
    <rule>Use Vitest for unit tests in Vite projects</rule>
    <rule>Use Vue Test Utils for component testing</rule>
    <rule>Use Playwright or Cypress for e2e</rule>
  </rules>
</tooling>
<component_testing>
  <rules>
    <rule>Test public behavior, not implementation details</rule>
    <rule>Use async/await for updates after trigger/setValue</rule>
    <rule>Prefer shallow mocks only when necessary</rule>
  </rules>
  <example>
    <code>
import { render } from "@testing-library/vue";
import MyComponent from "./MyComponent.vue";

test("renders title", () => {
  const { getByText } = render(MyComponent, { props: { title: "Hello" } });
  getByText("Hello");
});
    </code>
  </example>
</component_testing>
<composables_testing>
  <rules>
    <rule>Call composables directly when they only use reactivity</rule>
    <rule>Wrap composables with a host app when lifecycle is required</rule>
  </rules>
</composables_testing>
<anti_patterns>
  <avoid name="testing_internals">Asserting on private state or methods</avoid>
  <avoid name="flaky_time">Real timers instead of fake or deterministic inputs</avoid>
  <avoid name="over_mocking">Mocking Vue internals unnecessarily</avoid>
</anti_patterns>
