# Scoring Model

Use these thresholds for static validation and isolated reports unless the user gives stricter criteria.

## Static validation

`scripts/content/validate-skill.mjs` reports two layers:

1. Deterministic structural validation
2. Heuristic quality rubric

The structural layer decides whether the skill is formally usable.
The quality rubric estimates how well the skill follows best practices.

### Structural status

- `PASS`: metadata, structure, boundaries, workflow, outputs, and validation are explicit enough
- `NEEDS_IMPROVEMENT`: one or more structural or metadata expectations are still weak

### Quality rubric

Each metric is scored `1..10` and must include:

- `score`
- `reason`
- `improvement`

Suggested interpretation:

- `9-10`: excellent, little or no change needed
- `7-8`: solid, but still improvable
- `5-6`: acceptable skeleton, but quality gaps are visible
- `3-4`: weak; likely to misroute, confuse, or underperform
- `1-2`: poor; major rewrite needed

Default quality metrics:

| Metric | Meaning |
| --- | --- |
| `scope_coherence` | The skill solves one coherent, narrow job rather than several mixed responsibilities. |
| `specialized_value` | The skill adds concrete project or domain value beyond generic model knowledge. |
| `trigger_precision` | It is clear when the skill should load. |
| `non_trigger_precision` | It is clear when the skill must not load. |
| `description_quality` | The frontmatter description is trigger-oriented, specific, and well-calibrated. |
| `behavioral_completeness` | Inputs, workflow, outputs, boundaries, and validation are all covered. |
| `unambiguity` | The instructions are concrete enough to avoid competing interpretations. |
| `workflow_clarity` | The procedure is understandable, reusable, and easy to follow. |
| `output_contract_quality` | The expected result or artifact is explicit and testable. |
| `validation_strength` | The skill explains how to verify success or reject weak output. |
| `concision` | The wording is as short as possible without losing needed signal. |
| `non_redundancy` | Adjacent sections do not restate the same idea without adding value. |
| `progressive_disclosure` | Core instructions stay compact and heavier detail is pushed into references, assets, or scripts when justified. |
| `procedural_reusability` | The skill teaches a reusable method, not a one-off answer tied to one prompt. |

Suggested overall interpretation:

- `>= 8.5`: `production_grade`
- `7.0 - 8.4`: `good_with_minor_caveats`
- `5.5 - 6.9`: `usable_but_needs_refinement`
- `< 5.5`: `needs_major_improvement`

## Trigger loop

Default pass condition:

- Positive query passes when `trigger_rate >= threshold`
- Negative query passes when `trigger_rate < threshold`

Default `threshold`: `0.5`

Suggested interpretation:

- `>= 0.90`: excellent trigger quality
- `0.75 - 0.89`: acceptable
- `< 0.75`: the isolated report should recommend description changes

## Report outcomes

- `valid`
- `valid_with_caveats`
- `needs_changes`

## Interactive OpenCode usage

When `skill-authoring` is used from an OpenCode session:

- prefer static validation over isolated runtime checks
- do not spawn nested OpenCode sessions
- use both structural findings and rubric scores to ask clarifying questions or propose diffs
- improve low-scoring quality metrics before presenting a proposal when the fix is obvious and still within scope
- always include score reasons in the saved report so the user can see why a metric is weak
- persist interactive history under `ai-docs/skill-authoring/interactive-runs/<run-id>/`

## Terminal isolated usage

When `skill-authoring` is used through `run-report.mjs`:

- keep run artifacts under `ai-docs/skill-authoring/test-runs/<run-id>/`
- keep test assets inside `<skill-dir>/assets/tests/`
- in report mode, evaluate trigger quality only
- if a suggested corrected skill is produced, keep it inside the run directory and let the user decide whether to replace the source skill
