# Scoring Model

Use these thresholds for content and trigger loops unless the user gives stricter criteria.

## Content loop

`scripts/content/run-iteration.mjs` computes these sections:

- Routing
- Assertions
- Artifacts
- Lint

Default weights:

- Routing: `0.35`
- Assertions: `0.35`
- Artifacts: `0.15`
- Lint: `0.15`

Suggested interpretation:

- `>= 0.90`: production-grade
- `0.80 - 0.89`: acceptable with minor caveats
- `< 0.80`: iterate again or reject

## Trigger loop

Default pass condition:

- Positive query passes when `trigger_rate >= threshold`
- Negative query passes when `trigger_rate < threshold`

Default `threshold`: `0.5`

Suggested interpretation:

- `>= 0.90`: excellent trigger quality
- `0.75 - 0.89`: acceptable
- `< 0.75`: keep iterating

## Stop reasons

Use one of:

- `passed_threshold`
- `no_meaningful_progress`
- `max_iterations`
- `llm_command_missing`
- `manual_stop`

## Direct OpenCode usage

When `skill-authoring` is used from an OpenCode session rather than a standalone script:

- keep run artifacts under `ai-docs/skill-authoring/runs/<run-id>/`
- keep persistent eval assets under `ai-docs/skill-authoring/workspaces/<skill-slug>/`
- let the active session inspect summaries and write diagnoses/refinements when no external LLM command is configured
