# Eval Harness

This directory contains a minimal evaluation harness for measuring real AssistAgents behavior through OpenCode.

Goals:

- validate routing: which skills were actually loaded for a prompt
- validate output quality with lightweight deterministic rubrics
- capture run artifacts and metrics for later comparison
- keep every run isolated from the user's real `~/.opencode`

## Why isolated runtime

The harness keeps one shared runtime under `eval/runtime` and overrides `HOME`, `XDG_CONFIG_HOME`, and `XDG_DATA_HOME`.
It also keeps a cached base `.opencode` install there and restores a clean working runtime from that cache before each run.
This lets the suite call `npm run dev:fast` without overwriting the real user installation.
Each case also gets a clean workspace copy under `eval/runs/<run-id>/cases/<case-id>/attempt-<n>/workspace`.
The runner initializes a local git repo in that workspace so OpenCode treats the copied fixture as the nearest project root.
This keeps source fixtures immutable while still avoiding `/tmp`-based workspaces.

## Main commands

```bash
npm run eval:run
npm run eval:run -- --case docs-changelog-positive-01
npm run eval:run:relaxed -- --case docs-changelog-positive-01
npm run eval:compare -- --current eval/runs/<run-id>/summary.json --baseline eval/baselines/current.json
```

Utilities:

```bash
npm run eval:parse -- --file eval/runs/<run-id>/cases/<case-id>/events.ndjson
```

## Directory layout

```text
eval/
  cases/       # JSON case definitions
  prompts/     # prompt text files
  rubrics/     # deterministic quality checks
  fixtures/    # repos and attachments used by cases
  runtime/     # reusable isolated OpenCode runtime + cached base install
  runs/        # generated run artifacts
  scripts/     # runner, parser, judges, compare utility
```

## Case format

Each case is a JSON file with these key fields:

```json
{
  "id": "docs-changelog-positive-01",
  "agent": "doc",
  "promptFile": "eval/prompts/docs/changelog-fast-replace.md",
  "fixtureDir": "eval/fixtures/repos/docs-space",
  "attachments": [],
  "expectedFiles": ["ai-docs/changelogs/fast-replace.md"],
  "requiredSkills": ["docs-changelog"],
  "forbiddenSkills": ["docs-guide"],
  "allowedBootstrapSkills": ["shared-base-rules", "shared-docs-paths"],
  "allowedOptionalSkills": ["review-doc-quality", "review-doc-strategy"],
  "strictUnexpectedSkills": false,
  "rubricFile": "eval/rubrics/docs-changelog.json",
  "repeat": 1,
  "tags": ["docs", "routing", "quality"]
}
```

## Rubric format

Rubrics are JSON files with weighted deterministic checks.

Supported checks:

- `regex_any`: at least one pattern must match
- `regex_none`: no pattern may match
- `min_length`: response length must be above threshold

Example:

```json
{
  "id": "docs-changelog",
  "passThreshold": 0.75,
  "checks": [
    {
      "id": "mentions_feature",
      "kind": "regex_any",
      "weight": 2,
      "description": "Mentions the fast-replace mode",
      "patterns": ["fast-replace"]
    }
  ]
}
```

## Artifacts per run

Each run writes:

- `install.log` and `install.err.log`
- `install-decision.json`
- per-case `events.ndjson`
- per-case `stderr.log`
- per-case `normalized-trace.json`
- per-case `metrics.json`
- per-case `judgment.json`
- per-case `final-response.md`
- per-case `workspace/` with the isolated repo copy used for the run
- top-level `summary.json`
- top-level `summary.jsonl`
- top-level `permission-profile.json`

For artifact-producing cases, add `expectedFiles`. A case only truly passes when those files exist after the run.

## Permission profiles

By default the harness uses `strict`.
Use `relaxed-artifact-writes` only as a fallback/debug mode when you want to isolate skill behavior from OpenCode permission-layer behavior.

The relaxed mode post-processes only the isolated runtime config and copied agent files under `eval/runtime/home/.opencode/`
and grants `write`, `edit`, and `apply_patch` to artifact-writing agents (`doc`, `project`, `test`).
The shipped package templates remain unchanged.

Use `npm run eval:run:relaxed` or `--permission-profile relaxed-artifact-writes` when you explicitly want that fallback.

## Install reuse

The runner automatically decides whether a reinstall is needed.
It hashes:

- `templates/`
- `src/config-template.ts`

If the fingerprint is unchanged, it reuses the cached base install under `eval/runtime/base-opencode` and restores a clean working `.opencode` from it.
If the fingerprint changed, the cache is rebuilt by running the install command again.

`--skip-install` forces reuse of the cached base install and errors if that cache does not exist yet.

## Current limitations

- Event parsing is heuristic because OpenCode raw event schema may change.
- Token metrics are estimated from the best usage candidate found in the event stream.
- Exported sessions are best-effort: the runner tries to detect a session id from raw events and only exports when it succeeds.

That is enough for early routing and regression tracking. If later you want stronger semantic judging, add an LLM judge as a second pass on top of the saved artifacts.
