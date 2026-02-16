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

- installs/updates `agents`, `skills`, and `commands` from package templates;
- optionally installs experimental hash-based tools into `tools`;
- helps enable MCP integrations;
- stores keys in `~/.opencode/keys`;
- generates `~/.opencode/opencode.jsonc` with the required MCP config and permission restrictions.

## Project-Local Coder Skills

For project-specific coding rules, use the `/init-agent-assist-code` slash command.

Run this command via the `build/dev` agent.

- Run without arguments to auto-detect languages from repository code and configs.
- Run with arguments to pass a comma-separated language list, for example `typescript,csharp`.
- Output: creates or updates project-local skills in `.opencode/skills/coder/` inside the current repository.

For step-by-step usage and examples, see [Quick Start](./quick-start.md).

## Important Constraints

- The installer only works in an interactive TTY terminal.
- Re-running it replaces `~/.opencode/agents`, `~/.opencode/skills`, and `~/.opencode/commands`.
- If you have manual edits in these directories, enable backup before updating.
