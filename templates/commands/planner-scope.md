---
description: Manage planner markdown scope patterns
agent: build/dev
---
You are executing a slash command: /planner-scope.

Goal: manage the list of allowed markdown file patterns that build/planner can edit or apply_patch.

Inputs:
- `$ARGUMENTS`: subcommand and arguments. Supported subcommands:
  - `list` - show current scope patterns
  - `add <glob>` - add a new pattern to scope
  - `add <glob> --force` - add a wide pattern (like `**/*.md`) with force
  - `remove <glob>` - remove a pattern from scope
  - `reset` - reset scope to default (`ai-docs/dev-plans/**.md` only)

Hard requirements:
- Execute the `assistagents` CLI tool via bash to perform the actual operation.
- Do not modify files directly; use the CLI.
- If the CLI is not found, suggest the user run `npx -g @ozerohax/assistagents@latest planner-scope ...`.

Process:

1) Parse `$ARGUMENTS` to determine subcommand and parameters.

2) Execute via bash:
   - `assistagents planner-scope list`
   - `assistagents planner-scope add <glob>`
   - `assistagents planner-scope add <glob> --force`
   - `assistagents planner-scope remove <glob>`
   - `assistagents planner-scope reset`

3) Report the result:
   - For `list`: show all patterns.
   - For `add`: confirm addition or show error.
   - For `remove`: confirm removal or show error.
   - For `reset`: confirm reset.

Validation rules (enforced by CLI):
- Patterns must end with `.md`.
- Absolute paths are never allowed.
- Parent directory references (`..`) are never allowed.
- Wide patterns (`**/*.md`, `**/**.md`, `*.md`) require `--force` flag.
- The default pattern `ai-docs/dev-plans/**.md` cannot be removed.

Output format:
- Print the CLI output.
- If changes were made, remind user to restart any active planner sessions.

Examples:
- `/planner-scope list`
- `/planner-scope add gsd-plans/**.md`
- `/planner-scope add docs/**/*.md`
- `/planner-scope remove gsd-plans/**.md`
- `/planner-scope reset`
