# Content Eval Format

Content evals measure the skill body, not just frontmatter triggering.

Store them near the skill workspace, for example:

```text
ai-docs/
  skill-authoring/
    workspaces/
      <skill-slug>/
        evals/
          content-evals.json
          prompts/
          fixtures/
```

## Schema

```json
{
  "skill": "docs-changelog",
  "agent": "doc",
  "threshold": 0.8,
  "cases": [
    {
      "id": "docs-changelog-positive-01",
      "promptFile": "prompts/docs-changelog.md",
      "fixtureDir": "fixtures/docs-space",
      "attachments": [],
      "expectedFiles": ["ai-docs/changelogs/fast-replace.md"],
      "requiredSkills": ["docs-changelog"],
      "forbiddenSkills": ["docs-guide"],
      "allowedSkills": ["shared-base-rules", "shared-docs-paths"],
      "strictUnexpectedSkills": false,
      "assertions": [
        {
          "id": "mentions_fast_replace",
          "kind": "regex_any",
          "description": "Mentions the fast-replace mode",
          "patterns": ["fast-replace"],
          "weight": 2
        }
      ]
    }
  ]
}
```

## Case fields

- `id`: stable case id
- `promptFile`: relative path to the prompt text
- `fixtureDir`: relative path to a copied workspace fixture
- `attachments`: optional attachment paths
- `expectedFiles`: files that must exist after the run
- `requiredSkills`: skills that must load
- `forbiddenSkills`: skills that must not load
- `allowedSkills`: optional allowlist for strict routing checks
- `strictUnexpectedSkills`: fail if extra skills load outside the allowlist
- `assertions`: weighted checks used by `score-assertions.mjs`

## Supported assertion kinds

Current deterministic checks:

- `regex_any`
- `regex_none`
- `min_length`
- `file_exists`
- `file_regex_any`

Prefer realistic prompts and evals that distinguish the candidate from its baseline.

Example bundle:

- `assets/examples/docs-changelog/content-evals.json`
- `assets/examples/docs-changelog/trigger-evals.json`
