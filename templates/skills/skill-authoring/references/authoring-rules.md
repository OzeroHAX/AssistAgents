# Skill Authoring Rules

Use these rules before drafting, reviewing, or splitting a skill.

## Non-negotiable rules

- Keep YAML frontmatter with `name` and `description`.
- Keep `name` compatible with OpenCode skill naming rules: 1-64 chars, lowercase letters/digits, single hyphens only, no leading/trailing hyphen, no `--`.
- For installed skills, the containing directory must match `name`.
- Keep the skill body in repository-standard XML-like sections.
- Write all skill metadata and body text in English.
- Make the description define when to use the skill, not how to execute it.
- Keep `description` within OpenCode limits: 1-1024 characters, while still remaining specific enough for correct trigger selection.
- Make the body define inputs, actions, outputs, boundaries, and validation.
- Prefer the shortest wording that preserves trigger precision, execution clarity, and validation strength.
- Do not repeat the same idea across `purpose`, `when_to_use`, `output_requirements`, and `validation` unless a section truly adds new signal.
- Prefer one precise sentence over multiple near-synonyms when the routing meaning stays the same.
- If a valid draft still feels bloated, default to rewriting it shorter before accepting it as final.
- Keep isolated benchmark assets under `assets/tests/` inside the skill when runtime checks are needed.
- Do not keep a weak pseudo-skill when a reference, asset, or script is the honest representation.
- A narrow exception to usual compactness guidance is acceptable for foundational meta-skills that centralize reusable authoring or orchestration policy, but only when the extra length adds real control value and still uses progressive disclosure for details.

Note for this repository:

- Source templates under `templates/skills/**` may live in a taxonomy that differs from the final installed skill directory.
- Package installation must flatten each skill into `~/.opencode/skills/<name>/SKILL.md` (or the equivalent target root) so the installed layout matches OpenCode rules.

## Execution contract

Each production-grade skill must make these elements observable:

- Trigger conditions or `when_to_use` guidance
- Inputs or preconditions
- Actions, workflow, or method
- Outputs, artifact shape, or output requirements
- Boundaries, exclusions, or `when_not_to_use`
- Validation or pass/fail criteria

## Knowledge placement decisions

Before adding `references/`, `assets/`, or `scripts/`, decide what form of knowledge the skill actually needs.

- `inline_contract`
  Use only `SKILL.md` when the behavior can stay short, explicit, and self-contained.
- `local_references`
  Use `references/` only for narrow, stable, repeatedly useful material that should be loaded on demand instead of bloating `SKILL.md`.
- `project_references`
  For project skills, prefer project files, local conventions, and existing artifacts when they are the real source of truth.
- `external_on_demand`
  If the relevant knowledge is broad, variable, or ecosystem-wide, do not copy it into the skill. Keep only decision criteria and the conditions for consulting external sources.
- `deterministic_scripts`
  If part of the behavior is deterministic, repeatable, or better expressed as code, prefer `scripts/` over more prose.

Decision factors:

- `scope breadth`: how broad the knowledge domain is
- `stability`: how stable the knowledge is over time
- `specificity`: whether the knowledge is universal or project-specific
- `reuse frequency`: whether the material will be needed repeatedly
- `load necessity`: whether the material is needed almost every time or only in some cases
- `determinism`: whether code is a better representation than prose

Hard rules:

- Do not create `references/` only because the user mentioned best practices, standards, or documentation.
- Do not turn `SKILL.md` into a dump of framework or ecosystem documentation.
- Do not duplicate the same material across `SKILL.md` and `references/`.
- Prefer the smallest valid `SKILL.md` first; add `references/` only when they create real on-demand value.
- For project skills, prefer project truth over generic external doctrine.
- For broad domains, prefer decision criteria plus external on-demand lookup over large embedded knowledge.
- For deterministic behavior, prefer `scripts/` over prose inflation.

## Baseline review questions

- Does the description trigger for the intended user intent?
- Does the skill measurably change agent behavior?
- Are outputs verifiable rather than subjective-only?
- Are misuse cases and anti-patterns explicit?
- Is the skill narrow enough to stay coherent?
- Is the XML-like structure clear and consistent?
- Is all user-visible skill text in English?
- Can any section be shortened without losing routing or behavioral signal?
- Are adjacent sections adding new information instead of restating the same idea?
- Are repeated qualifiers such as "practical", "concrete", "project-specific", or "actionable" carrying new information each time, or just inflating the text?
- Is the knowledge placed in the right form: `SKILL.md`, `references/`, project files, external on-demand lookup, or `scripts/`?

## Lint rules

These rule ids are used by `scripts/content/score-lint.mjs`.

| Rule | Meaning |
| --- | --- |
| `L1` | Frontmatter contains `name` and `description` |
| `L2` | Description is trigger-oriented rather than workflow-oriented |
| `L3` | Body uses XML-like tagged sections |
| `L4` | Boundaries are explicit through `when_not_to_use` or `loading_policy` |
| `L5` | Workflow or execution logic is explicit |
| `L6` | Output or validation requirements are explicit |
| `L7` | Skill body is English-only enough to preserve trigger clarity |

## Split-or-downgrade decisions

Split the skill when:

- It mixes multiple unrelated outcomes
- One part is reusable while another is highly variant-specific
- The instructions are bloated because multiple domains/frameworks are crammed together

Downgrade to references/assets/scripts when:

- The artifact does not define behavior
- The content is mostly background information or examples
- Deterministic logic belongs in executable code
