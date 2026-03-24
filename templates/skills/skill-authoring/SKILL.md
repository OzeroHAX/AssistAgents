---
name: skill-authoring
description: Use when creating, refining, or validating skills to ensure they trigger correctly, enforce consistent behavior, and produce verifiable outcomes
---

# SKILL: Skill Authoring

## PURPOSE

Define, improve, and validate skills as reusable behavioral units for agents.

A skill is a **behavioral contract** that:
- triggers under specific conditions
- enforces consistent execution
- produces verifiable outcomes

---

## WHEN TO USE

Use when:

- creating a new skill
- modifying an existing skill
- validating skill quality
- debugging skill behavior

Do NOT use for runtime execution or coding tasks

---

## CORE PRINCIPLES

- Trigger-first design
- Single responsibility
- Behavior over text
- Deterministic contract
- Verifiability
- English-only skill definition

All skill metadata and instructions MUST be written in English.

This includes:
- frontmatter fields
- section titles
- rules and examples
- output templates

Even if a skill helps produce user-facing artifacts in another language, the skill itself MUST stay in English.

---

## VALIDATION (MANDATORY)

### Baseline Test
Simulate WITHOUT skill → must expose failure

### Apply Skill
Simulate WITH skill → must improve behavior

### Pressure Testing
Test:

- ambiguous input
- incomplete input
- conflicting requirements
- edge cases

### Regression Check
Ensure no side effects on unrelated behavior

---

## SELF-CHECK

- Does it trigger?
- Does it change behavior?
- Is it testable?
- Are outputs verifiable?
- Are boundaries explicit?
- Can it fail?
- Is the entire skill definition written in English?

---

# 🧪 SKILL LINTING (CI MODE)

Use this section to automatically validate skill quality.

A skill MUST pass all checks.

---

## LINT RULES

### L1 — Trigger clarity

- description clearly defines WHEN to use
- no workflow explanation in description

FAIL IF:
- description explains "how"
- description is generic ("handles tasks", "improves quality")

---

### L2 — Single responsibility

- skill defines ONE coherent behavior

FAIL IF:
- mixes planning + execution
- mixes unrelated domains

---

### L3 — Execution contract

Skill MUST define:

- inputs (explicit or implied)
- actions (what agent must do)
- outputs (result or artifact)
- boundaries (what NOT to do)

FAIL IF:
- any of the above is missing or vague

---

### L4 — Verifiability

Skill MUST define:

- observable outcome OR
- validation method

FAIL IF:
- success cannot be verified
- output is subjective only

---

### L5 — Anti-patterns

Skill MUST include:

- common mistakes OR
- explicit "do not" rules

FAIL IF:
- misuse is possible but not addressed

---

### L6 — Behavior impact

Skill MUST:

- change agent behavior in a measurable way

FAIL IF:
- skill only describes best practices
- no enforcement or constraints

---

### L7 — Boundary clarity

Skill MUST clearly state:

- when NOT to use

FAIL IF:
- skill overlaps heavily with others
- no exclusion conditions

---

### L8 — Non-ambiguity

- instructions are deterministic
- no vague terms like "properly", "carefully"

FAIL IF:
- interpretation varies significantly

---

### L9 — English-only skill text

- metadata and body are written in English
- examples, rules, and output formats are written in English

FAIL IF:
- non-English language is used in frontmatter or skill body
- mixed-language wording can affect trigger clarity or execution

---

## SCORING

Each rule:

- PASS = 1
- FAIL = 0

### Result:

- 9/9 → Production-grade
- 7–8 → Acceptable (needs improvement)
- ≤6 → Reject

---

## CI OUTPUT FORMAT

When validating a skill, produce:

```json
{
  "skill": "skill-name",
  "score": 7,
  "maxScore": 9,
  "status": "FAIL",
  "failedRules": ["L3", "L9"],
  "summary": "Missing execution contract and contains non-English text",
  "fixSuggestions": [
    "Define explicit output format",
    "Rewrite metadata and instructions in English"
  ]
}
