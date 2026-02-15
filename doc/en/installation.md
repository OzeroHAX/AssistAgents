# Installation

## Requirements

- Node.js `>= 18`
- Access to an interactive terminal (TTY)

Check your Node.js version:

```bash
node -v
```

## Install Command

```bash
npx -g @ozerohax/assistagents@latest
```

The same command is used to update to the latest version.

## What Happens During Installation

The installer asks step by step:

1. Whether to create a zip backup of the current `~/.opencode`.
2. Preferred response language for agents.
3. Whether to explicitly set models for selected agents (optional).
4. Whether to enable experimental hash-based file tools.
5. Which MCP integrations to enable.
6. Key values only for integrations that require them.

## Which Paths Are Updated

During setup, the installer overwrites/creates:

- `~/.opencode/agents/`
- `~/.opencode/skills/`
- `~/.opencode/tools/` (if hash tools are enabled)
- `~/.opencode/keys/`
- `~/.opencode/opencode.jsonc`

## What to Know Before Running

- If you have manual edits in `~/.opencode/agents` and `~/.opencode/skills`, enable backup.
- If you run in CI or a non-interactive shell, installation will fail because no TTY is available.
