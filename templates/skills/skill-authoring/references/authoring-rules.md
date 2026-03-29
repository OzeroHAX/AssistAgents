# Skill Authoring Rules

Use these rules before drafting, reviewing, or splitting a skill.

## Non-negotiable rules

- Keep YAML frontmatter with `name` and `description`.
- Keep the skill body in repository-standard XML-like sections.
- Write all skill metadata and body text in English.
- Make the description define when to use the skill, not how to execute it.
- Make the body define inputs, actions, outputs, boundaries, and validation.
- Do not keep a weak pseudo-skill when a reference, asset, or script is the honest representation.

## Execution contract

Each production-grade skill must make these elements observable:

- Trigger conditions or `when_to_use` guidance
- Inputs or preconditions
- Actions, workflow, or method
- Outputs, artifact shape, or output requirements
- Boundaries, exclusions, or `when_not_to_use`
- Validation or pass/fail criteria

## Baseline review questions

- Does the description trigger for the intended user intent?
- Does the skill measurably change agent behavior?
- Are outputs verifiable rather than subjective-only?
- Are misuse cases and anti-patterns explicit?
- Is the skill narrow enough to stay coherent?
- Is the XML-like structure clear and consistent?
- Is all user-visible skill text in English?

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
