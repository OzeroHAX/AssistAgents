# Analyzer Contract

Use a separate LLM session for diagnosis.

The analyzer should inspect:

- skill contents
- content or trigger scores
- failing cases
- routing misses or false triggers
- missing artifacts
- lint failures
- prior iteration history when available

## Required JSON shape

```json
{
  "executiveSummary": "Short diagnosis",
  "changeTargets": ["description", "body", "evals"],
  "rootCauses": [
    {
      "id": "trigger-too-broad",
      "severity": "high",
      "evidence": ["False trigger on query X"],
      "recommendation": "Narrow the description toward changelog-specific intents"
    }
  ],
  "changePlan": [
    {
      "priority": 1,
      "target": "description",
      "action": "Rewrite opening sentence to focus on release-note and changelog tasks"
    }
  ],
  "stopOrContinue": "continue"
}
```

The analyzer must generalize from failures rather than overfitting to a single prompt.
