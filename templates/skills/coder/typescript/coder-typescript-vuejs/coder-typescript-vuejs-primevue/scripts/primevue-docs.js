#!/usr/bin/env node
"use strict";

const BASE_URL = "https://primevue.org/llms";
const COMPONENTS_URL = `${BASE_URL}/components`;
const MAX_SEARCH_MATCHES = 50;

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText} (${url})`);
  }
  return res.text();
}

function printUsage() {
  const text = `
PrimeVue Documentation CLI Helper
=================================

Usage:
  primevue-docs.js <command> [options]

Commands:
  list                     List all available components with descriptions
  list --names             List component names only (one per line)
  list --category <cat>    Filter by category: form, data, panel, overlay, menu, 
                           button, media, misc, directive
  
  component <name>         Get full documentation for a component
  component <name> --props Show only props table
  component <name> --events Show only events
  component <name> --slots Show only slots
  component <name> --examples Show only code examples
  
  search <query>           Search across all documentation
  search <query> --context Show surrounding context (±3 lines)
  
  guides                   List all available guides
  guide <name>             Get a specific guide (e.g., configuration, theming)
  
  theming                  Get theming/styling documentation
  
  help                     Show this help message

Examples:
  primevue-docs.js list
  primevue-docs.js list --category form
  primevue-docs.js component datatable
  primevue-docs.js component button --props
  primevue-docs.js search "row selection"
  primevue-docs.js search "virtual scroll" --context
  primevue-docs.js guide configuration

Notes:
  - Component names are case-insensitive
  - Search is case-insensitive and matches partial words
  - Data fetched from official PrimeVue LLM endpoints (primevue.org/llms/)
`.trim();
  console.log(text);
}

/**
 * Parse component entries from llms.txt
 * Format: - [Vue Button Component](https://primevue.org/button): Description
 */
function parseComponentsFromLlms(text) {
  const components = [];
  const lines = text.split(/\r?\n/);
  
  // Match: - [Title](url): Description
  const regex = /^-\s+\[([^\]]+)\]\(https:\/\/primevue\.org\/([^)]+)\):\s*(.*)$/;
  
  let inComponentsSection = false;
  
  for (const line of lines) {
    // Detect components section
    if (line.includes("## Components")) {
      inComponentsSection = true;
      continue;
    }
    
    // Stop at next section
    if (inComponentsSection && line.startsWith("## ") && !line.includes("Components")) {
      break;
    }
    
    if (!inComponentsSection) continue;
    
    const match = line.match(regex);
    if (match) {
      const [, title, slug, description] = match;
      
      // Skip guides and non-component entries
      if (slug.includes("/") || slug === "mcp") continue;
      
      // Determine category from title/description
      let category = "misc";
      const lowerTitle = title.toLowerCase();
      const lowerDesc = description.toLowerCase();
      
      if (/directive/i.test(title)) {
        category = "directive";
      } else if (/button|splitbutton|speeddial/i.test(slug)) {
        category = "button";
      } else if (/menu|menubar|megamenu|panelmenu|contextmenu|breadcrumb|dock|tabmenu|steps|tieredmenu/i.test(slug)) {
        category = "menu";
      } else if (/dialog|drawer|popover|confirmdialog|confirmpopup|dynamicdialog|tooltip|overlay/i.test(slug)) {
        category = "overlay";
      } else if (/panel|accordion|fieldset|card|divider|splitter|scrollpanel|tab|stepper|toolbar/i.test(slug)) {
        category = "panel";
      } else if (/datatable|dataview|tree|treetable|timeline|organizationchart|orderlist|picklist|paginator|virtualscroller/i.test(slug)) {
        category = "data";
      } else if (/input|select|checkbox|radio|toggle|slider|rating|knob|colorpicker|password|calendar|datepicker|autocomplete|multiselect|cascadeselect|listbox|editor|textarea|otp|mask|number|float|ifta|iconfield|fluid|form/i.test(slug)) {
        category = "form";
      } else if (/image|galleria|carousel|avatar|badge|chip|tag|skeleton|progressbar|progressspinner|meter|terminal/i.test(slug)) {
        category = "media";
      }
      
      components.push({
        name: slug,
        title: title,
        description: description.trim(),
        category: category
      });
    }
  }
  
  return components;
}

/**
 * Parse guides from llms.txt
 */
function parseGuidesFromLlms(text) {
  const guides = [];
  const lines = text.split(/\r?\n/);
  
  const regex = /^-\s+\[([^\]]+)\]\(https:\/\/primevue\.org\/([^)]+)\):\s*(.*)$/;
  
  let inGuidesSection = false;
  
  for (const line of lines) {
    if (line.includes("## Guides")) {
      inGuidesSection = true;
      continue;
    }
    
    if (inGuidesSection && line.startsWith("## ")) {
      break;
    }
    
    if (!inGuidesSection) continue;
    
    const match = line.match(regex);
    if (match) {
      const [, title, slug, description] = match;
      guides.push({
        name: slug.replace(/^guides\//, ""),
        title: title,
        description: description.trim(),
        url: `https://primevue.org/${slug}`
      });
    }
  }
  
  return guides;
}

async function listComponents(options = {}) {
  const text = await fetchText(`${BASE_URL}/llms.txt`);
  const components = parseComponentsFromLlms(text);
  
  if (components.length === 0) {
    console.log("No components found.");
    return;
  }
  
  let filtered = components;
  
  // Filter by category if specified
  if (options.category) {
    filtered = components.filter(c => c.category === options.category.toLowerCase());
    if (filtered.length === 0) {
      console.log(`No components found in category: ${options.category}`);
      console.log("\nAvailable categories: form, data, panel, overlay, menu, button, media, misc, directive");
      return;
    }
  }
  
  // Names only mode
  if (options.namesOnly) {
    filtered.forEach(c => console.log(c.name));
    return;
  }
  
  // Group by category
  const grouped = {};
  for (const comp of filtered) {
    if (!grouped[comp.category]) {
      grouped[comp.category] = [];
    }
    grouped[comp.category].push(comp);
  }
  
  const categoryOrder = ["form", "data", "panel", "overlay", "menu", "button", "media", "misc", "directive"];
  
  for (const cat of categoryOrder) {
    if (!grouped[cat]) continue;
    
    console.log(`\n## ${cat.toUpperCase()}`);
    console.log("─".repeat(60));
    
    for (const comp of grouped[cat]) {
      console.log(`  ${comp.name.padEnd(20)} ${comp.description.slice(0, 60)}${comp.description.length > 60 ? "..." : ""}`);
    }
  }
  
  console.log(`\nTotal: ${filtered.length} components`);
}

async function listGuides() {
  const text = await fetchText(`${BASE_URL}/llms.txt`);
  const guides = parseGuidesFromLlms(text);
  
  if (guides.length === 0) {
    console.log("No guides found.");
    return;
  }
  
  console.log("\n## GUIDES");
  console.log("─".repeat(60));
  
  for (const guide of guides) {
    console.log(`  ${guide.name.padEnd(20)} ${guide.description.slice(0, 55)}${guide.description.length > 55 ? "..." : ""}`);
  }
  
  console.log(`\nTotal: ${guides.length} guides`);
}

async function getComponent(name, options = {}) {
  if (!name) {
    throw new Error("Missing component name. Use: primevue-docs.js component <name>");
  }
  
  const safeName = String(name).toLowerCase();
  const url = `${COMPONENTS_URL}/${safeName}.md`;
  
  let text;
  try {
    text = await fetchText(url);
  } catch (err) {
    // Try alternative names
    const alternatives = {
      "calendar": "datepicker",
      "sidebar": "drawer", 
      "overlaypanel": "popover",
      "inputswitch": "toggleswitch",
      "chips": "chip",
      "messages": "message",
      "toast": "toast",
      "navbar": "menubar",
      "dropdown": "select"
    };
    
    if (alternatives[safeName]) {
      console.log(`Note: "${safeName}" is now "${alternatives[safeName]}" in PrimeVue 4+\n`);
      text = await fetchText(`${COMPONENTS_URL}/${alternatives[safeName]}.md`);
    } else {
      throw new Error(`Component "${name}" not found. Use "list" to see available components.`);
    }
  }
  
  // Filter sections if requested
  if (options.propsOnly) {
    const propsSection = extractSection(text, "### Props", "###");
    if (propsSection) {
      console.log("## Props\n");
      console.log(propsSection);
    } else {
      console.log("No props section found.");
    }
    return;
  }
  
  if (options.eventsOnly) {
    const eventsSection = extractSection(text, "### Emits", "###") || extractSection(text, "### Events", "###");
    if (eventsSection) {
      console.log("## Events\n");
      console.log(eventsSection);
    } else {
      console.log("No events section found.");
    }
    return;
  }
  
  if (options.slotsOnly) {
    const slotsSection = extractSection(text, "### Slots", "###");
    if (slotsSection) {
      console.log("## Slots\n");
      console.log(slotsSection);
    } else {
      console.log("No slots section found.");
    }
    return;
  }
  
  if (options.examplesOnly) {
    const examples = extractCodeExamples(text);
    if (examples.length > 0) {
      console.log(`## Code Examples (${examples.length} found)\n`);
      examples.forEach((ex, i) => {
        console.log(`### Example ${i + 1}`);
        console.log(ex);
        console.log("");
      });
    } else {
      console.log("No code examples found.");
    }
    return;
  }
  
  // Full documentation
  console.log(text);
}

function extractSection(text, startMarker, endMarker) {
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) return null;
  
  const afterStart = text.slice(startIdx + startMarker.length);
  const endIdx = afterStart.indexOf(endMarker);
  
  if (endIdx === -1) {
    return afterStart.trim();
  }
  
  return afterStart.slice(0, endIdx).trim();
}

function extractCodeExamples(text) {
  const examples = [];
  const regex = /```vue([\s\S]*?)```/g;
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    examples.push(match[1].trim());
  }
  
  return examples;
}

async function searchDocs(query, options = {}) {
  if (!query) {
    throw new Error("Missing search query. Use: primevue-docs.js search <query>");
  }
  
  const url = `${BASE_URL}/llms-full.txt`;
  const text = await fetchText(url);
  const q = String(query).toLowerCase();
  const lines = text.split(/\r?\n/);
  
  let matches = 0;
  const contextLines = options.context ? 3 : 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().includes(q)) {
      matches++;
      
      if (contextLines > 0) {
        console.log(`\n--- Match ${matches} (line ${i + 1}) ---`);
        const start = Math.max(0, i - contextLines);
        const end = Math.min(lines.length - 1, i + contextLines);
        for (let j = start; j <= end; j++) {
          const prefix = j === i ? ">>>" : "   ";
          console.log(`${prefix} ${j + 1}: ${lines[j]}`);
        }
      } else {
        console.log(`${i + 1}: ${line}`);
      }
      
      if (matches >= MAX_SEARCH_MATCHES) {
        console.log(`\n[Stopped at ${MAX_SEARCH_MATCHES} matches]`);
        return;
      }
    }
  }
  
  if (matches === 0) {
    console.log(`No matches found for "${query}".`);
  } else {
    console.log(`\n[Found ${matches} matches]`);
  }
}

async function getGuide(name) {
  if (!name) {
    throw new Error("Missing guide name. Use: primevue-docs.js guide <name>");
  }
  
  const safeName = String(name).toLowerCase();
  
  // Try direct guide URL first
  let url = `${BASE_URL}/guides/${safeName}.md`;
  
  try {
    const text = await fetchText(url);
    console.log(text);
  } catch {
    // Try without guides/ prefix
    url = `${BASE_URL}/${safeName}.md`;
    try {
      const text = await fetchText(url);
      console.log(text);
    } catch {
      throw new Error(`Guide "${name}" not found. Use "guides" to list available guides.`);
    }
  }
}

async function getTheming() {
  // Fetch styled mode documentation
  const text = await fetchText(`${BASE_URL}/styled.md`);
  console.log(text);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === "-h" || command === "--help" || command === "help") {
    printUsage();
    return;
  }
  
  // Parse flags
  const hasFlag = (flag) => args.includes(flag);
  const getFlagValue = (flag) => {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) {
      return args[idx + 1];
    }
    return null;
  };
  
  switch (command) {
    case "list":
    case "list-components":
      await listComponents({
        namesOnly: hasFlag("--names"),
        category: getFlagValue("--category")
      });
      return;
      
    case "guides":
    case "list-guides":
      await listGuides();
      return;
      
    case "guide":
      await getGuide(args[1]);
      return;
      
    case "component":
    case "comp":
    case "c":
      await getComponent(args[1], {
        propsOnly: hasFlag("--props"),
        eventsOnly: hasFlag("--events"),
        slotsOnly: hasFlag("--slots"),
        examplesOnly: hasFlag("--examples")
      });
      return;
      
    case "search":
    case "s":
      await searchDocs(args.slice(1).filter(a => !a.startsWith("--")).join(" "), {
        context: hasFlag("--context")
      });
      return;
      
    case "theming":
    case "theme":
    case "styled":
      await getTheming();
      return;
      
    default:
      // Assume it's a component name if not recognized
      if (!command.startsWith("-")) {
        await getComponent(command);
        return;
      }
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
