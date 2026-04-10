# Interactive Run History

When an interactive `create`, `improve`, or `check` flow starts, persist a readable history under:

```text
ai-docs/skill-authoring/interactive-runs/<run-id>/
```

Start writing this history as soon as analysis begins. The target skill still stays read-only until approval.

## Run id format

Use this format for interactive run ids:

```text
<utc-timestamp>-<action>-<skill-slug>
```

Rules:

- `<utc-timestamp>` uses the UTC shape `YYYYMMDDTHHMMSSZ`.
- Prefer generating it with `date -u +%Y%m%dT%H%M%SZ` when the run id is created inside the chat.
- `<action>` is one of `create`, `check`, `improve`, or `review`.
- `<skill-slug>` is a short readable slug derived from the target skill name or path.
- Do not create timestamp-only run directories.
- Do not omit the action or the skill slug.

## Minimum artifacts

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
  final-summary.md
```

## Artifact meanings

- `request.md`
  The raw user request plus any clarified scope.
- `approval.md`
  What the user chose to apply, reject, revise, or narrow.
- `before/target-skill.md`
  The source skill before edits.
- `before/inferred-summary.md`
  A short comprehensive summary of what the current skill appears to mean, plus any user confirmation or correction. Use this when `check` started without enough external behavioral context.
- `before/validation.json` and `before/validation.md`
  Static validation results before edits.
- `before/verdict.md`
  Short explanation of what was weak before the change.
- `proposal/summary.md`
  Human-readable explanation of what was proposed and why.
- `proposal/skill.diff.md`
  The exact diff that was shown to the user.
- `after/target-skill.md`
  The current proposed target skill draft; after approval, this should match the applied result.
- `after/validation.json` and `after/validation.md`
  Preliminary static validation for the proposed target state. If the applied result matches the prepared draft, keep these files as the final validation record and do not rerun validation.
- `after/change-plan.md`
  Human-readable plan of what is intended to change and why.
- `after/tests/`
  The single canonical prepared test subtree for the proposal package. Keep any proposed trigger tests here before the final decision, and if the user later chooses `apply`, apply this subtree as a whole rather than cherry-picking only nested files.
- `final-summary.md`
  Full explanation of what changed, what improved, what remains risky, and whether further isolated benchmarking is recommended.

## Chat vs history split

- Put the full plan, full rationale, and full proposed test contents in the interactive run directory.
- In the chat, keep the approval preview compact:
  - key findings
  - files in scope
  - path to the saved proposal artifacts
  - exact diff or draft
- In chat, refer to target file paths as future apply routes until approval. Before approval, the real target skill subtree remains unchanged.
- Do not duplicate long plan prose in both the chat and the saved artifacts.

## Run continuity rule

- Reuse the same `<run-id>` while the user is revising, rejecting, or approving the same shown proposal.
- Start a fresh run id only for a genuinely new `create`, `check`, `improve`, or `review` run.

## Scope rule

If the proposal included:

- a skill diff
- test files
- other supporting files

then approval applies to all of them unless the user explicitly narrows scope.

Do not silently drop approved test files.
Do not silently drop approved top-level eval files such as `trigger-evals.json`.
