# Quick Start

This flow helps you start working with AssistAgents right after installation.

## 1) Install the Package

```bash
npx -g @ozerohax/assistagents@latest
```

## 2) Confirm the Installed Structure

Expected entries in `~/.opencode`:

- `agents`
- `skills`
- `keys`
- `opencode.jsonc`

## 3) Generate Project-Local Coder Skills (Optional)

If you want repository-specific coding rules, use this slash command:

```text
/init-agent-assist-code
```

What this command does:

- creates or updates skills only under `.opencode/skills/coder/` in the current repository;
- auto-detects languages from code and configs when no arguments are provided;
- supports an explicit comma-separated language list via `$ARGUMENTS`, for example:

```text
/init-agent-assist-code typescript,csharp
```

When to run it:

- right after installing/updating AssistAgents in a new project;
- after significant stack changes (new language, framework, test runner, linter);
- when you want to re-sync local coder skills with current repository state.

## 4) Use the Recommended Delivery Loop

Short iterations are more reliable than one huge prompt:

1. `build/planner` - create a minimal, verifiable plan.
2. `build/dev` - implement step by step.
3. `test` - verify behavior and capture outcomes.
4. `review` - run quality/risk checks.
5. Repeat until done criteria are met.

## 5) Minimal First Iteration Example

1. Give `build/planner` one specific change to plan.
2. Pass that plan to `build/dev` and ask it to execute with verification.
3. Run `test` to confirm the result.
4. Run `review` to validate quality and risks.

## 6) When to Use `ask`

`ask` is useful for quick questions and read-only context research without making changes.

## 7) When to Use `project`

Use `project` when you need project-level work, not a single code change:

- formalizing requirements and boundaries (scope);
- maintaining PRD, architecture decisions, and use cases;
- decomposition into epics/tasks;
- updating project status and artifacts before implementation.
