# Runtime Modes

`skill-authoring` now has two distinct modes. Do not mix them.

## 1. Interactive authoring and validation

Use this mode inside an OpenCode chat when the user wants to:

- create a new skill
- improve an existing skill
- inspect or validate a skill interactively

Rules:

- stay inside the current session
- do not launch nested OpenCode sessions
- inspect real project files directly when needed
- prefer native read/glob/search tools for inspection
- do not use ad-hoc Python or shell wrappers just to print reference files or emulate existing validators
- ask follow-up questions when requirements are incomplete or contradictory
- show a preview and get approval before writing anything
- use static validation first
- if an isolated benchmark command is relevant, print it as a manual command for a separate terminal rather than trying to run it here

Typical tools:

- `scripts/content/validate-skill.mjs`
- direct file inspection
- native read/glob/search helpers
- user-visible proposal summaries and diffs
- draft validation via `validate-skill.mjs --text-file` or `validate-skill.mjs --stdin`

Artifacts:

- `ai-docs/skill-authoring/interactive-runs/<run-id>/`

## 2. Isolated terminal benchmarking

Use this mode only from a terminal command outside the current OpenCode chat when the user wants:

- isolated trigger checks
- reproducible benchmark artifacts
- a report with scores, diagnosis, and optional suggested candidate skill

Rules:

- use a fresh isolated runtime for the benchmark
- keep tests inside `<skill-dir>/assets/tests/`
- never overwrite the source skill from the isolated report
- write any suggested corrected skill into the run directory only
- default to static validation plus trigger evals only

Artifacts:

- `ai-docs/skill-authoring/test-runs/<run-id>/`

Typical tools:

- `scripts/content/run-report.mjs`
- `scripts/trigger/run-trigger-eval.mjs`
