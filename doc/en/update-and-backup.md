# Update and Backups

## How to Update AssistAgents

Use the same command as installation:

```bash
npx -g @ozerohax/assistagents@latest
```

## What an Update Replaces

Re-running the installer replaces:

- `~/.opencode/agents`
- `~/.opencode/skills`

It may also overwrite `~/.opencode/tools` (if hash tools are enabled).

It updates `~/.opencode/opencode.jsonc` too, and can create a backup of the previous config as `.bak-YYYYMMDD-HHmmss`.

## When Backup Should Be Enabled

Enable zip backup if:

- you manually edited files in `agents` or `skills`;
- you want a safe rollback point after update;
- you are changing MCP/key config and want a snapshot first.

## Safe Update Practice

1. Close active sessions that rely on current agents.
2. Run installer with backup enabled.
3. Verify required MCP integrations stayed enabled.
4. Run a short smoke check: `build/planner` -> `build/dev` -> `test`.
