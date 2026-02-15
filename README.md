![Banner](banner.jpeg)

OpenCode AssistAgents is a ready-to-use agent pack for OpenCode users, built by a developer for developers who want tighter control over what agents do.
It installs practical agents, skills, and optional integrations so you can run a clear delivery loop: plan -> implement -> test -> review.

> [!WARNING]
> Early version: expect occasional rough edges. If you hit one, please open an issue/PR.

## Install / update

Requirements: Node.js >= 18.

```bash
npx -g @ozerohax/assistagents@latest
```

Run the same command again any time to update to the latest version.

## What the installer does

The installer is interactive and asks you to:

1. Choose backup behavior (create zip backup or skip).
2. Choose your preferred response language for agents.
3. Optionally enable experimental hash-based file tools.
4. Select MCP integrations to enable.
5. Enter keys only for integrations that need them.

Then it installs/replaces:

- `~/.opencode/agents/`
- `~/.opencode/skills/`
- `~/.opencode/tools/` (only if hash tools are enabled)
- `~/.opencode/keys/`
- `~/.opencode/opencode.jsonc`

## Daily workflow (recommended)

Use short loops instead of one giant prompt:

1. Run `build/planner` to get a minimal, verifiable plan.
2. Run `build/dev` to implement one step at a time.
3. Run `test` to verify behavior and capture evidence.
4. Run `review` for quality and risk checks.
5. Repeat until done criteria are clearly met.

## Which agent to use

Main agent IDs (path-based, under `~/.opencode/agents`):

- `build/dev` - code changes, fixes, and implementation.
- `build/planner` - read-only implementation planning.
- `test` - test orchestration and test/bug report artifacts.
- `review` - read-only code review and risk assessment.
- `doc` - guides/changelogs in allowed docs scope.
- `project` - project artifacts under `ai-docs/project/**`.
- `ask` - quick Q&A and read-only research.

The system also includes specialized subagents for focused code/web research and decomposition that primary agents can delegate to.

## Integrations and keys

Supported MCP integrations include:

- Search/research tools (`tavily-search`, `ddg-search`, `zai-web-search`, `zai-web-reader`, `github-grep`, `deepwiki`)
- Library docs lookup (`context7`)
- Browser verification (`chrome-devtools`)

Keys are stored as files in `~/.opencode/keys/` and referenced from `~/.opencode/opencode.jsonc`.
If a key-dependent integration is enabled but no key is provided, it is automatically disabled.

## Important behavior to know

- Re-running installer **replaces** `agents/` and `skills/` with the packaged versions.
- If you made manual edits in those directories, use backup mode before updating.
- The installer requires an interactive TTY terminal.

## Quick troubleshooting

- `assistagents failed: This installer only works in interactive TUI mode (TTY not found).`
  - Run from a normal terminal (not a non-interactive CI shell).
- A key-based integration is missing at runtime.
  - Re-run installer and provide/update the matching key file.
- You enabled hash tools but they are not available.
  - Re-run installer and confirm `Enable experimental hash-based file tools` is enabled.

---

OpenCode is a trademark of its respective owner. This project is not affiliated with or endorsed by OpenCode.