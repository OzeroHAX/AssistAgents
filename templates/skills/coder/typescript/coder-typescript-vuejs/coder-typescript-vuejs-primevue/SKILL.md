---
name: coder-typescript-vuejs-primevue
description: Use when working with PrimeVue for docs access, theming, and examples.
---
<skill_overview>
  <purpose>Access official PrimeVue documentation via CLI helper for components, theming, and guides</purpose>
  <triggers>
    <trigger>Working with PrimeVue components</trigger>
    <trigger>Need component props, events, slots, or examples</trigger>
    <trigger>Theming or configuration questions</trigger>
    <trigger>Migration from PrimeVue 3 to 4</trigger>
  </triggers>
  <sources>
    <source url="https://primevue.org">PrimeVue Official Documentation</source>
    <source url="https://primevue.org/theming">PrimeVue Theming Guide</source>
  </sources>
</skill_overview>
<cli_helper>
  <path>.opencode/skills/coder/typescript/coder-typescript-vuejs/coder-typescript-vuejs-primevue/scripts/primevue-docs.js</path>
  <rules>
    <rule priority="critical">DO NOT use Context7 for PrimeVue—use ONLY this CLI helper</rule>
    <rule priority="critical">CLI fetches from official primevue.org/llms/* endpoints maintained by PrimeVue team</rule>
    <rule>Requires Node 18+ (uses built-in fetch)</rule>
  </rules>
  <commands>
    <command name="list">
      <description>List all components grouped by category</description>
      <examples>
        <example>node {path} list</example>
        <example>node {path} list --names              # Names only</example>
        <example>node {path} list --category form      # Filter by category</example>
      </examples>
    </command>
    <command name="component">
      <description>Get component documentation</description>
      <examples>
        <example>node {path} component datatable       # Full docs</example>
        <example>node {path} component button --props  # Props only</example>
        <example>node {path} component dialog --events # Events only</example>
        <example>node {path} component card --slots    # Slots only</example>
        <example>node {path} component menu --examples # Examples only</example>
        <example>node {path} datatable                 # Shorthand</example>
      </examples>
    </command>
    <command name="search">
      <description>Search across all docs</description>
      <examples>
        <example>node {path} search "row selection"</example>
        <example>node {path} search "virtual scroll" --context</example>
      </examples>
    </command>
    <command name="guides">
      <description>List available guides</description>
      <examples>
        <example>node {path} guides</example>
      </examples>
    </command>
    <command name="guide">
      <description>Get specific guide</description>
      <examples>
        <example>node {path} guide configuration</example>
        <example>node {path} guide theming</example>
      </examples>
    </command>
    <command name="theming">
      <description>Get theming documentation</description>
      <examples>
        <example>node {path} theming</example>
      </examples>
    </command>
  </commands>
</cli_helper>
<categories>
  <rules>
    <rule>Use --category flag with list command to filter components</rule>
  </rules>
  <category name="form">InputText, Select, Checkbox, DatePicker, AutoComplete</category>
  <category name="data">DataTable, DataView, Tree, TreeTable, Paginator</category>
  <category name="panel">Accordion, Card, Panel, Fieldset, TabView, Splitter</category>
  <category name="overlay">Dialog, Drawer, Popover, ConfirmDialog, Tooltip</category>
  <category name="menu">Menu, Menubar, MegaMenu, ContextMenu, Breadcrumb</category>
  <category name="button">Button, SplitButton, SpeedDial</category>
  <category name="media">Image, Galleria, Carousel, Avatar, Badge, ProgressBar</category>
  <category name="directive">Ripple, Tooltip, FocusTrap, AnimateOnScroll</category>
</categories>
<component_aliases>
  <rules>
    <rule>PrimeVue 4 renamed several components; CLI accepts both old and new names</rule>
  </rules>
  <alias old="calendar" new="datepicker" />
  <alias old="sidebar" new="drawer" />
  <alias old="overlaypanel" new="popover" />
  <alias old="inputswitch" new="toggleswitch" />
  <alias old="dropdown" new="select" />
</component_aliases>
<setup>
  <rules>
    <rule>Import PrimeVue config and theme preset</rule>
    <rule>Register components globally or import per-component</rule>
  </rules>
  <example>
    <code>
import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Button from "primevue/button";
import App from "./App.vue";

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: ".dark-mode",
      cssLayer: false
    }
  },
  ripple: true
});

app.component("Button", Button);
app.mount("#app");
    </code>
  </example>
</setup>
<workflow>
  <rules>
    <rule>Identify the component or topic needed</rule>
    <rule>Run CLI: node {path} component &lt;name&gt; for full docs</rule>
    <rule>Use flags (--props, --events, --slots, --examples) for specific sections</rule>
    <rule>Use search for cross-documentation queries</rule>
  </rules>
</workflow>
<anti_patterns>
  <avoid name="context7_for_primevue">Using Context7 instead of CLI helper for PrimeVue docs</avoid>
  <avoid name="hardcoded_docs">Relying on outdated hardcoded information instead of fetching current docs</avoid>
  <avoid name="old_component_names">Using PrimeVue 3 component names without checking aliases</avoid>
</anti_patterns>
