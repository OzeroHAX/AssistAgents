---
name: skill-authoring
description: Create, refine, and validate high-quality skills when defining agent behavior, improving existing skills, or ensuring skill reliability under real-world conditions
---

# SKILL: Skill Authoring

## PURPOSE

Define, improve, and validate skills as reusable behavioral units for agents.

A skill is NOT documentation.  
A skill is NOT a checklist.  

A skill is a **behavioral contract** that:
- triggers under specific conditions
- enforces a consistent execution pattern
- produces verifiable outcomes

---

## WHEN TO USE

Use this skill when:

- creating a new skill
- modifying or refactoring an existing skill
- reviewing skill quality or correctness
- investigating why a skill does not trigger or does not affect behavior

Do NOT use this skill when:

- executing tasks
- implementing features
- writing application code
- performing runtime decision-making unrelated to skill design

---

## CORE PRINCIPLES

1. **Trigger-first design**
   - If the skill does not trigger → the skill is broken
   - Description MUST clearly encode WHEN to use

2. **Single responsibility**
   - One skill = one stable behavioral pattern
   - No mixing planning, execution, and validation in one skill

3. **Behavior over text**
   - A skill must CHANGE agent behavior
   - If behavior is unchanged → skill is invalid

4. **Deterministic contract**
   - Inputs, actions, and outputs must be clear
   - Ambiguity leads to inconsistent execution

5. **Verifiability**
   - Every skill must produce evidence or observable outcome

---

## STRUCTURE REQUIREMENTS

Each skill MUST include:

### 1. Frontmatter

```md
name: clear, specific, action-oriented
description: describes WHEN to use (NOT how it works)
