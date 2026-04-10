# Project Skills Guide

Use this guide for skills that live inside a real project under:

```text
.opencode/skills/<skill-name>/
```

Prefer this guide only for project-local examples. The primary runtime contract now lives in:

- `references/runtime-modes.md`
- `references/interactive-checklist.md`

## Source of truth

For project-local skills, the source of truth is the skill file itself:

```text
.opencode/skills/<skill-name>/SKILL.md
```

Do not treat `~/.opencode` as the edit target.

## Two supported modes

### 1. Interactive create / improve / check

Use this mode inside an OpenCode chat.

What happens:

- the current session inspects project files directly
- `skill-authoring` asks follow-up questions if requirements are weak or contradictory
- it proposes a draft or diff
- it waits for approval
- after approval it updates the source skill
- it runs static validation, not an isolated runtime loop

What does not happen by default:

- no nested OpenCode sessions
- no automatic isolated benchmark
- no automatic source overwrite from an external run artifact

### 2. Terminal isolated report

Use this mode from a terminal when you want reproducible runtime checks.

What happens:

- a fresh isolated runtime is created
- test cases are read from the skill folder
- OpenCode runs the cases in isolation
- a report is written under `ai-docs/skill-authoring/test-runs/<run-id>/`
- any suggested corrected skill is written only into that run directory

What does not happen:

- the source skill is not overwritten automatically

## Skill-local test layout

When isolated benchmarking is needed, keep tests inside the skill:

```text
.opencode/skills/<skill-name>/
  SKILL.md
  assets/
    tests/
      trigger-evals.json
```

Use `trigger-evals.json` when `description` quality matters.

## How to create a new project skill

Start in the project root and use `/skill-authoring`.

Example:

```text
/skill-authoring create .opencode/skills/angular-component. I want a skill that creates Angular components according to our project conventions. Use relevant project files as references, ask any missing questions, propose the first version, show the diff, and wait for confirmation before writing.
```

If isolated benchmarking will be needed later, add tests under:

```text
.opencode/skills/angular-component/assets/tests/
```

## How to improve an existing project skill

Example:

```text
/skill-authoring improve .opencode/skills/angular-component. I want to narrow the trigger criteria and clarify the output contract. Show the diff with rationale first, wait for confirmation, then apply the change and validate the skill statically.
```

## How to check an existing project skill

Use interactive check for structural and semantic review:

```text
/skill-authoring check .opencode/skills/angular-component. Validate the existing skill, point out weak spots, ask any missing questions, and do not modify the file without my confirmation.
```

Use terminal report mode for isolated runtime checks:

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/run-report.mjs \
  --skill .opencode/skills/angular-component \
  --install-command "assistagents-setup --fast-replace --language <your-language>"
```

By default this report mode runs:

- static validation
- trigger evals, if `assets/tests/trigger-evals.json` exists

## What interactive validation must cover

- Is `name` valid?
- Is `description` trigger-oriented and specific enough?
- Are trigger and non-trigger boundaries explicit?
- Does the skill define workflow, inputs, outputs, and validation?
- Is the skill general enough to be reusable but narrow enough not to over-trigger?

## What isolated reports should produce

- static validation summary
- trigger score, if trigger tests exist
- diagnosis and recommendations
- optional suggested corrected skill under the run directory

The user decides whether that suggested skill should replace the source file.
