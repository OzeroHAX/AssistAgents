---
description: Create, validate, or refine an OpenCode skill with persisted artifacts under ai-docs/skill-authoring
agent: build/dev
---
You are executing the `/skill-authoring` command.

Mandatory first step:
- Load `skill-authoring`.

Goal:
- Create a new skill, validate an existing skill, or improve a weak skill through the `skill-authoring` workflow.
- Persist all inputs, eval assets, metrics, diagnoses, and conclusions under `ai-docs/skill-authoring/**`.

Inputs:
- `$ARGUMENTS` is free-form and may contain:
  - action: `create`, `check`, `improve`, `review`
  - target skill path or skill name
  - one or more test intents, example prompts, or trigger phrases

Default persistence layout:

```text
ai-docs/skill-authoring/
  workspaces/<skill-or-request-slug>/
    request.md
    evals/
      content-evals.json
      trigger-evals.json
      prompts/
      fixtures/
  runs/<run-id>/
    timeline.md
    run.json
    iteration-*/
```

Required workflow:

1. Interpret the request
   - Determine whether the user wants to create, check, or improve a skill.
   - Resolve the target skill path if one was provided; otherwise derive a stable slug for the request workspace.

2. Prepare workspace in `ai-docs/skill-authoring`
   - Create or update `request.md` with:
     - raw request
     - target skill path/name
     - intended behavior
     - non-trigger behavior
     - provided test value(s)
     - assumptions and open questions
   - Create or update `evals/content-evals.json` when behavior can be tested through OpenCode runs.
   - Create or update `evals/trigger-evals.json` when `description` trigger quality matters.

3. Use `skill-authoring` workflow
   - For repository-local validation, prefer the bundled scripted loop over manual per-step orchestration.
   - Use bundled `skill-authoring/scripts/*` as deterministic helpers for execution, scoring, parsing, and artifact generation.
   - Default scripted entry point for `check` and `improve`: `templates/skills/skill-authoring/scripts/content/run-loop.mjs`.
   - Use absolute filesystem paths when invoking bundled node scripts for `--eval-set`, `--trigger-eval-set`, `--skill-dir`, `--results-dir`, `--runtime-root`, and `--install-cwd`.
   - Only drop to `run-trigger-eval.mjs` or `run-iteration.mjs` directly for debugging a specific sub-step.
   - Do not store run outputs in temporary directories when repository-local `ai-docs/skill-authoring/**` is available.

4. Evaluate and refine
   - If checking or improving an existing skill, run content evals and, when useful, trigger evals.
   - When a baseline comparison is meaningful, use `--without-skill-baseline true` or `--baseline-skill-dir <path>` instead of silently skipping it.
   - For `check` on a single existing skill, default to `--without-skill-baseline true` unless the user explicitly asked for a different baseline.
   - For trigger checks, prefer bounded timeouts and visible progress rather than long opaque waits.
   - If the skill is weak, write diagnosis and refinement artifacts under the run directory, then revise the skill and rerun.
   - If no further improvement is justified, stop and state why.

5. Final report
   - List created/updated skill files.
   - List created/updated `ai-docs/skill-authoring/**` artifacts.
   - State whether the skill passed, failed, or needs another refinement cycle.

Hard requirements:
- Keep the skill itself in English if it is created or updated.
- Keep run artifacts and summaries readable; Markdown is preferred for human-facing reports and JSON for machine-facing metrics.
- Prefer repository-local `ai-docs/skill-authoring/**` over `/tmp/**`.
- If test values were supplied in `$ARGUMENTS`, convert them into concrete content and/or trigger eval cases instead of ignoring them.
- When using scripted evals, prefer `final-summary.md`, `timeline.md`, and `run.json` as the primary human-readable outputs.
