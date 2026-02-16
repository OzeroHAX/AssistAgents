# Troubleshooting

## `assistagents failed: This installer only works in interactive TUI mode (TTY not found).`

Cause: the installer was started in a non-interactive environment.

What to do:

- run the command in a regular terminal;
- do not run installer in a non-interactive CI shell;
- if you use a wrapper, verify stdin/stdout are available as TTY.

## Integration Is Enabled but Tools Are Unavailable

Possible causes:

- required key was not entered;
- integration was auto-disabled by installer;
- `opencode.jsonc` is outdated.

What to do:

1. Re-run the installer.
2. Select required MCP integrations.
3. Enter/update keys for required services.

## Hash-Based File Tools Are Missing

Cause: `Enable experimental hash-based file tools` was not enabled.

What to do:

- re-run the installer;
- enable the hash tools option.

## Custom Edits in Agents/Skills/Commands Are Gone

Cause: re-running installer replaces `~/.opencode/agents`, `~/.opencode/skills`, and `~/.opencode/commands` with templates.

What to do:

- restore needed edits from backup;
- next time, enable zip backup before updating.

## Basic Diagnostics

- Check that these exist: `~/.opencode/opencode.jsonc`, `~/.opencode/agents`, `~/.opencode/skills`, `~/.opencode/commands`.
- Ensure `~/.opencode/keys` contains key files for active integrations.
- If issue remains, repeat installation in a clean interactive terminal session.
