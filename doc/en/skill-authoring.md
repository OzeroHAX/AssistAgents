# Skill-Authoring Guide

This guide explains the end-user workflow for `/skill-authoring`: what it does, how the command/agent/skill split works, which files it creates, how static validation and trigger tests work, and what the final apply step actually confirms.

This guide is for end users working on project-local skills. It does not describe package-maintainer workflows.

## Installed Layout

This guide assumes AssistAgents is already installed under:

```text
~/.opencode/
```

Relevant paths:

- project-local skills: `./.opencode/skills/<skill-name>/`
- globally installed `skill-authoring` scripts: `~/.opencode/skills/skill-authoring/scripts/`
- interactive run artifacts: `./ai-docs/skill-authoring/interactive-runs/`
- isolated report artifacts: `./ai-docs/skill-authoring/test-runs/`

The source skill you usually work on is local to the current project. The validator and trigger-report scripts come from the globally installed package.

## How `/skill-authoring` Is Structured

`/skill-authoring` now has four layers with distinct roles:

1. Command
   `/skill-authoring` is the user-facing entry point. You use it directly in chat. You do not need to choose the runtime agent manually.
2. Dedicated agent
   The command routes to a dedicated `skill-authoring` agent with a narrow, low-variance runtime path.
3. `skill-authoring` skill
   This skill contains the authoring methodology: meaning resolution, quality rules, references policy, preview/apply contract, and validation expectations.
4. Scripts
   Bundled scripts perform deterministic checks such as static validation and isolated trigger reports.

This separation matters because:

- the command is just the entry point;
- the dedicated agent keeps the runtime flow stable;
- the skill defines the authoring rules;
- the scripts handle repeatable checks.

## Supported Modes

### 1. Interactive full mode

This is the default.

Use it when you want:

- requirement clarification;
- static validation;
- quality-rubric review;
- saved interactive run history;
- a prepared proposal package;
- prepared trigger tests when they make sense.

### 2. Interactive quick mode

Use it only when you explicitly want speed over the full authoring cycle.

Quick mode still:

- reads the target skill;
- shows a preview before changing the target skill;
- requires an explicit final decision.

Quick mode normally skips:

- interactive run history;
- static validation;
- rubric scoring;
- prepared trigger tests.

Common hints:

- `quick`
- `fast`
- `skip validation`
- `no tests`
- `without evaluation`

### 3. Terminal isolated report mode

Use this outside the chat when you want reproducible trigger evaluation and a saved report.

This mode:

- runs static validation;
- runs trigger evals only;
- writes report artifacts under `ai-docs/skill-authoring/test-runs/<run-id>/`;
- may generate a suggested candidate inside the run directory;
- never overwrites the source skill automatically.

There is no background content-result evaluation in this mode. It is static validation plus trigger evaluation only.

## Interactive Flow

### 1. Start the command

You run `/skill-authoring` directly in chat, for example:

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md
```

The command routes the request through the dedicated authoring agent automatically.

### 2. Resolve action, target, mode, and meaning source

The workflow first resolves:

- action: `create`, `check`, `improve`, or `review`
- target skill path
- mode: `full` or `quick`
- meaning source:
  - `explicit_intended_meaning`
  - `partial_intended_meaning`
  - `no_external_meaning`

It also classifies the dominant knowledge form:

- `inline_contract`
- `local_references`
- `project_references`
- `external_on_demand`
- `deterministic_scripts`

### 3. Confirm meaning only when needed

If you already described what the skill should mean during `check` or `improve`, that intended meaning is used directly and no inferred-meaning confirmation is required.

If you provided only part of the intended behavior, `skill-authoring` should ask narrow clarification questions first.

Only when there is no reliable external meaning, it should:

- infer the current meaning from the existing skill text;
- show that interpretation explicitly;
- ask whether that meaning is correct.

That meaning-confirmation step is the only place where `question` UI is preferred.

### 4. Start the run history in full mode

As soon as deeper analysis starts in full mode, `skill-authoring` writes interactive artifacts under:

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/
```

Important boundary:

- before the final decision, the target skill stays unchanged;
- but full mode is allowed to write proposal artifacts under `ai-docs/skill-authoring/**`.

So pre-apply writes inside `ai-docs/skill-authoring/**` are expected in full mode. Only the real target skill subtree remains read-only until `apply`.

### 5. Analyze and prepare the proposal package

In full mode, `skill-authoring` may prepare:

- findings;
- validation reports;
- rubric notes;
- the prepared draft under `after/target-skill.md`;
- prepared trigger tests under `after/tests/`;
- proposal summary and visible diff artifacts.

For reusable skills, full interactive `check` and `improve` normally prepare trigger tests by default unless there is a concrete reason not to.

Prepared trigger tests stay under the run directory until you choose `apply`.

### 6. Show the preview in chat

Before any target-skill write, `skill-authoring` must show a user-visible preview in chat:

- key findings or weaknesses;
- the scope of the prepared proposal;
- the exact diff or draft;
- any future apply routes for supporting files such as trigger tests.

The diff must appear in the visible chat message. Hidden reasoning does not count.

### 7. Final decision is in chat, not in a separate dialog

After the preview, the same visible chat message should end with one explicit final decision prompt.

The valid final outcomes are:

- `apply`
- `reject`
- `revise: <extra instructions>`

This prompt must:

- name the target skill;
- show the concrete `from -> to` route for the prepared draft;
- mention any other files in scope, such as prepared trigger tests;
- stay short;
- avoid repeating the full rationale and full diff.

There is no second `approve` step anymore.
There is no final `question` dialog anymore.

### 8. What each final decision means

- `apply`
  Apply the whole prepared proposal package currently in scope.
- `reject`
  Leave the target skill unchanged.
- `revise: ...`
  Keep the same run id, keep the same proposal context, and revise the prepared draft instead of starting a new run.

If multiple files are listed in scope, `apply` applies all of them unless you explicitly narrow scope.

### 9. Apply and finalize

Only after `apply` may `skill-authoring`:

- update the target `SKILL.md`;
- copy prepared trigger tests into `<skill-dir>/assets/tests/`;
- finalize `approval.md` and `final-summary.md`;
- reuse the already prepared validation result when the applied result matches the validated draft exactly.

## Interactive Run Id and Artifact Layout

Run ids use this format:

```text
<utc-timestamp>-<action>-<skill-slug>
```

Example:

```text
20260410T130821Z-check-task-use-research-code-strategy
```

Timestamp-only run ids are invalid.

### Full interactive run tree

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/
  request.md
  approval.md
  before/
    target-skill.md
    inferred-summary.md
    validation.json
    validation.md
    verdict.md
  proposal/
    summary.md
    skill.diff.md
  after/
    target-skill.md
    validation.json
    validation.md
    change-plan.md
    tests/
      trigger-evals.json
  final-summary.md
```

### Meaning of the main files

- `request.md`
  Raw request plus resolved context.
- `approval.md`
  The final user decision and scope.
- `before/target-skill.md`
  Snapshot of the source skill before changes.
- `before/inferred-summary.md`
  Inferred current meaning and any user correction, when that step was needed.
- `before/validation.json` and `before/validation.md`
  Static validation of the current source skill.
- `before/verdict.md`
  Short explanation of what is weak or notable before changes.
- `proposal/summary.md`
  Human-readable summary of the proposal.
- `proposal/skill.diff.md`
  The exact diff shown in chat.
- `after/target-skill.md`
  Prepared draft intended for application.
- `after/validation.json` and `after/validation.md`
  Validation of the prepared draft.
- `after/change-plan.md`
  Saved change plan and rationale.
- `after/tests/`
  Canonical prepared tests subtree for the proposal package.
- `final-summary.md`
  Final explanation of what was applied or concluded.

`proposal/tests/` is no longer part of the canonical flow. Prepared tests live under `after/tests/`.

## Static Validation

Static validation is the default deterministic check for skill structure and quality.

### Validate an existing skill

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --skill ./.opencode/skills/<skill-name>/SKILL.md \
  --out ai-docs/skill-authoring/manual-validation/report.json \
  --markdown-out ai-docs/skill-authoring/manual-validation/report.md
```

`--skill` accepts either a skill directory or a direct `SKILL.md` path.

### Validate a prepared draft file

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --text-file ai-docs/skill-authoring/interactive-runs/<run-id>/after/target-skill.md \
  --path-label ./.opencode/skills/<skill-name>/SKILL.md \
  --out ai-docs/skill-authoring/interactive-runs/<run-id>/after/validation.json \
  --markdown-out ai-docs/skill-authoring/interactive-runs/<run-id>/after/validation.md
```

### Validate draft text from stdin

```bash
cat draft-skill.md | node ~/.opencode/skills/skill-authoring/scripts/content/validate-skill.mjs \
  --stdin \
  --path-label ./.opencode/skills/<skill-name>/SKILL.md
```

Static validation reports:

- structural status such as `PASS` or `NEEDS_IMPROVEMENT`;
- deterministic findings and recommendations;
- a quality rubric with `1..10` scores;
- reasons and improvement notes for the scores.

## Trigger Tests

Trigger tests validate loading behavior. They answer:

- does the skill load when it should?
- does it stay unloaded when it should not?

### Real trigger tests in the skill

The real installed trigger test file belongs in:

```text
./.opencode/skills/<skill-name>/assets/tests/trigger-evals.json
```

Minimal shape:

```json
{
  "skill": "project-local-skill",
  "threshold": 0.5,
  "runsPerQuery": 3,
  "queries": [
    {
      "query": "Do the intended trigger behavior here.",
      "shouldTrigger": true
    },
    {
      "query": "Do a near-miss task that should not load the skill.",
      "shouldTrigger": false
    }
  ]
}
```

### Prepared trigger tests during interactive work

During full interactive `check` or `improve`, `skill-authoring` may prepare trigger tests under:

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/after/tests/trigger-evals.json
```

These are only prepared proposal artifacts.
They are copied into the real skill’s `assets/tests/` only if you later choose `apply`.

### Preferred way to run isolated trigger evaluation

Use the report runner:

```bash
node ~/.opencode/skills/skill-authoring/scripts/content/run-report.mjs \
  --skill ./.opencode/skills/<skill-name>/SKILL.md \
  --install-command "<your AssistAgents refresh command>"
```

This writes a reproducible report under:

```text
ai-docs/skill-authoring/test-runs/<run-id>/
```

It never overwrites the source skill automatically.

### Low-level trigger command

Use this only when you want to debug a single trigger eval set directly:

```bash
node ~/.opencode/skills/skill-authoring/scripts/trigger/run-trigger-eval.mjs \
  --eval-set ./.opencode/skills/<skill-name>/assets/tests/trigger-evals.json \
  --skill-dir ./.opencode/skills/<skill-name> \
  --runtime-root ai-docs/skill-authoring/test-runs/manual-trigger/runtime \
  --install-command "<your AssistAgents refresh command>"
```

Optional flags you may need:

- `--run-dir <dir>`
- `--threshold <number>`
- `--runs-per-query <number>`
- `--timeout-ms <number>`

## Recommended Usage Patterns

### Check an existing project skill

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md
```

### Check with explicit intended meaning

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. The skill should mean: <intended behavior>. Evaluate the current text against that meaning and prepare a non-applied proposal if needed.
```

### Improve an existing project skill

```text
/skill-authoring improve .opencode/skills/<skill-name>. This is a <goal-driven or instruction-driven> change. <your request>
```

### Quick edit

```text
/skill-authoring improve .opencode/skills/<skill-name> quick. <exact requested change>
```

### Create a new project skill

```text
/skill-authoring create .opencode/skills/<skill-name>. <desired behavior>
```

## Practical Boundaries

- The dedicated authoring agent is selected automatically by `/skill-authoring`.
- Full mode may write proposal artifacts under `ai-docs/skill-authoring/**` before the final decision.
- The real target skill stays unchanged until `apply`.
- The same run id should be reused when you `revise`, `reject`, or `apply` the same shown proposal.
- Terminal report mode never overwrites the source skill automatically.
- User-facing explanations follow the session language, but resulting `SKILL.md` content stays in English.
