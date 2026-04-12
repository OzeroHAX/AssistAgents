import type { McpId } from './mcp-registry.js';
import { getAllMcpToolPatterns, renderMcpConfigEntries } from './mcp-registry.js';
import type { KeyFiles } from './key-registry.js';

export type ConfigTemplateOptions = {
  plugins?: string[];
  enabledMcpIds?: McpId[];
};

export function renderGlobalConfigJsonc(keyFiles: KeyFiles, options: ConfigTemplateOptions = {}): string {
  const pluginSection =
    options.plugins && options.plugins.length > 0
      ? `,
  "plugin": ${JSON.stringify(options.plugins)}`
      : '';

  const mcp = renderMcpConfigEntries(keyFiles, options.enabledMcpIds);
  const mcpSection = JSON.stringify(mcp, null, 2)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
  const mcpPermissionDenySection = getAllMcpToolPatterns()
    .map((pattern) => `    "${pattern}": "deny"`)
    .join(',\n');

  return `{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {
    "messages_undo": "ctrl+alt+z",
    "session_new": "ctrl+alt+n",
    "command_list": "ctrl+alt+p"
  },
  "watcher": {
    "ignore": [
      "node_modules/**",
      "dist/**",
      ".git/**",
      ".venv/**",
      "bin/**"
    ]
  },
  "permission": {
    "bash": "deny",
    "codesearch": "deny",
    "doom_loop": "deny",
    "edit": "deny",
    "external_directory": "deny",
    "glob": "deny",
    "grep": "deny",
    "list": "deny",
    "lsp": "deny",
    "question": "deny",
    "read": "deny",
    "task": "deny",
    "todoread": "deny",
    "todowrite": "deny",
    "webfetch": "deny",
    "websearch": "deny",
    "skill": "deny",
    // MCP
${mcpPermissionDenySection}
  },
  "agent": {
    "doc": {
      "permission": {
        "write": {
          "*": "deny",
          "ai-docs/guides/**.md": "allow",
          "*ai-docs/guides/**.md": "allow",
          "ai-docs/changelogs/**.md": "allow",
          "*ai-docs/changelogs/**.md": "allow"
        },
        "edit": {
          "*": "deny",
          "ai-docs/guides/**.md": "allow",
          "*ai-docs/guides/**.md": "allow",
          "ai-docs/changelogs/**.md": "allow",
          "*ai-docs/changelogs/**.md": "allow"
        }
      }
    },
    "project": {
      "permission": {
        "write": {
          "*": "deny",
          "ai-docs/project/**.md": "allow",
          "*ai-docs/project/**.md": "allow",
          "ai-docs/project/status.json": "allow",
          "*ai-docs/project/status.json": "allow"
        },
        "edit": {
          "*": "deny",
          "ai-docs/project/**.md": "allow",
          "*ai-docs/project/**.md": "allow",
          "ai-docs/project/status.json": "allow",
          "*ai-docs/project/status.json": "allow"
        }
      }
    },
    "planner": {
      "permission": {
        "write": {
          "*": "deny",
          "ai-docs/dev-plans/**.md": "allow",
          "*ai-docs/dev-plans/**.md": "allow"
        },
        "edit": {
          "*": "deny",
          "ai-docs/dev-plans/**.md": "allow",
          "*ai-docs/dev-plans/**.md": "allow"
        }
      }
    },
    "skill-authoring": {
      "permission": {
        "external_directory": {
          "~/.opencode/skills/skill-authoring/**": "allow"
        },
        "write": {
          "*": "deny",
          ".opencode/skills/**": "allow",
          "*.opencode/skills/**": "allow",
          "templates/skills/**": "allow",
          "*templates/skills/**": "allow",
          "ai-docs/skill-authoring/**": "allow",
          "*ai-docs/skill-authoring/**": "allow"
        },
        "edit": {
          "*": "deny",
          ".opencode/skills/**": "allow",
          "*.opencode/skills/**": "allow",
          "templates/skills/**": "allow",
          "*templates/skills/**": "allow",
          "ai-docs/skill-authoring/**": "allow",
          "*ai-docs/skill-authoring/**": "allow"
        }
      }
    },
    "test": {
      "permission": {
        "write": {
          "*": "deny",
          "ai-docs/reports/test-reports/**.md": "allow",
          "*ai-docs/reports/test-reports/**.md": "allow",
          "ai-docs/reports/bug-reports/**.md": "allow",
          "*ai-docs/reports/bug-reports/**.md": "allow"
        },
        "edit": {
          "*": "deny",
          "ai-docs/reports/test-reports/**.md": "allow",
          "*ai-docs/reports/test-reports/**.md": "allow",
          "ai-docs/reports/bug-reports/**.md": "allow",
          "*ai-docs/reports/bug-reports/**.md": "allow"
        }
      }
    },
    "explore": { "disable": true },
    "build": { "disable": true },
    "plan": { "disable": true }
  }${pluginSection},
  "mcp": ${mcpSection}
}
`;
}
