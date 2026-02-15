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

## 3) Use the Recommended Delivery Loop

Short iterations are more reliable than one huge prompt:

1. `build/planner` - create a minimal, verifiable plan.
2. `build/dev` - implement step by step.
3. `test` - verify behavior and capture outcomes.
4. `review` - run quality/risk checks.
5. Repeat until done criteria are met.

## 4) Minimal First Iteration Example

1. Give `build/planner` one specific change to plan.
2. Pass that plan to `build/dev` and ask it to execute with verification.
3. Run `test` to confirm the result.
4. Run `review` to validate quality and risks.

## 5) When to Use `ask`

`ask` is useful for quick questions and read-only context research without making changes.

## 6) When to Use `project`

Use `project` when you need project-level work, not a single code change:

- formalizing requirements and boundaries (scope);
- maintaining PRD, architecture decisions, and use cases;
- decomposition into epics/tasks;
- updating project status and artifacts before implementation.
