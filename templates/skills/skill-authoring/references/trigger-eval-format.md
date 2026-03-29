# Trigger Eval Format

Trigger evals measure whether `description` causes the skill to load when it should.

## Schema

```json
{
  "skill": "docs-changelog",
  "threshold": 0.5,
  "runsPerQuery": 3,
  "queries": [
    {
      "query": "Update the changelog for the new fast-replace mode and mention the non-interactive flag.",
      "shouldTrigger": true
    },
    {
      "query": "Write a general guide for using the docs folder layout.",
      "shouldTrigger": false
    }
  ]
}
```

## Query rules

- Use realistic user phrasing, not abstract labels.
- Include near-miss negatives, not obviously unrelated negatives.
- Cover multiple phrasings for the same intent.
- Keep enough task substance that OpenCode would benefit from consulting a skill.

## Loop guidance

- Use train/test split when there are enough queries.
- Repeat each query multiple times to measure trigger variance.
- Stop optimizing if score plateaus or overfitting signs appear.
