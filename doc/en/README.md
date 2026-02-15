# OpenCode AssistAgents - User Documentation

This section contains complete user documentation for installing, launching, and day-to-day work with the `@ozerohax/assistagents` package.

## Who This Is For

- Developers who need full control over code, decisions, and execution steps instead of opaque "magic."
- Users who are tired of LLM unpredictability and want a predictable workflow: `plan -> implement -> test -> review`.

## Contents

1. [Installation](./installation.md)
2. [Quick Start](./quick-start.md)
3. [Agents and When to Use Them](./agents.md)
4. [Integrations and API Keys](./integrations-and-keys.md)
5. [Update and Backups](./update-and-backup.md)
6. [Troubleshooting](./troubleshooting.md)
7. [FAQ](./faq.md)

## Package in Brief

`assistagents` is an interactive installer that prepares the `~/.opencode` directory:

- installs/updates `agents` and `skills` from package templates;
- optionally installs experimental hash-based tools into `tools`;
- helps enable MCP integrations;
- stores keys in `~/.opencode/keys`;
- generates `~/.opencode/opencode.jsonc` with the required MCP config and permission restrictions.

## Important Constraints

- The installer only works in an interactive TTY terminal.
- Re-running it replaces `~/.opencode/agents` and `~/.opencode/skills`.
- If you have manual edits in these directories, enable backup before updating.
