# Refiner Contract

Use a separate LLM session for rewrites.

## For skill-body refinement

- Input: current `SKILL.md`, analyzer diagnosis, and iteration summary
- Output: full revised `SKILL.md`
- Preserve YAML frontmatter and XML-like body format
- Keep all skill text in English
- Prefer concise changes that directly address the diagnosis

Return format:

```text
<updated_skill>
...full SKILL.md...
</updated_skill>
```

## For description refinement

- Input: current description, failed triggers, false triggers, and held-out constraints
- Output: only the revised description text
- Stay comfortably under `1024` characters
- Generalize from failures instead of enumerating eval queries

Return format:

```text
<description>
Use this skill when ...
</description>
```
