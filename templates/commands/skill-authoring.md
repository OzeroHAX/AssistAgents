---
description: Create, validate, or refine an OpenCode skill with preview-first interactive edits and optional terminal eval reports
agent: build/skill-authoring
---
You are executing the `/skill-authoring` command.

Mandatory first step:
- Load `skill-authoring`.

Purpose:
- Route this request through the `skill-authoring` workflow.
- Keep interactive authoring and validation inside the current session.
- Treat `skill-authoring` as the source of truth for workflow, quality rules, references policy, validation, preview/apply behavior, and quick/full semantics.

Inputs:
- `$ARGUMENTS` is free-form and may contain:
  - action: `create`, `check`, `improve`, `review`
  - target skill path or skill name
  - intended behavior, trigger expectations, and non-trigger expectations
  - test intents, example prompts, or trigger phrases
  - execution mode hints such as `quick`, `fast`, `skip validation`, `no tests`, or `without evaluation`

Routing rules:
- For `create`, default the target to `.opencode/skills/<skill-name>/SKILL.md` unless the user explicitly names another path.
- If the user explicitly provides a target path, use it as-is, including internal maintainer paths such as `templates/skills/**`.
- Full mode is the default. Use quick mode only when the user explicitly requests speed over evaluation.
- Interactive flows stay in the current session. Do not launch nested OpenCode sessions.
- Terminal-only validation or trigger benchmarking must be presented as manual commands for a separate terminal when needed.

Output expectation:
- In `check`, produce review findings and, when justified, a non-applied proposal.
- In `check`, keep prepared draft files and prepared test files under `ai-docs/skill-authoring/**` until the user explicitly chooses the final apply decision.
- In `create` and `improve`, use preview-before-apply and one explicit final decision prompt in chat: `apply`, `reject`, or `revise: ...`.
- Persist interactive and benchmark artifacts under `ai-docs/skill-authoring/**` only as required by `skill-authoring`.
