# Skill-Authoring Prompt Templates

Use these prompts directly in an OpenCode chat with `/skill-authoring`.

For the full flow, artifact layout, static validation, trigger tests, and final `apply / reject / revise: ...` contract, see the [Skill-Authoring Guide](./skill-authoring.md).

Rules:

- Keep the user-facing chat in the user's language.
- Keep the resulting `SKILL.md` content in English.
- Show the diff in visible chat before changing the target skill.
- In full mode, pre-apply artifacts under `ai-docs/skill-authoring/**` are expected.
- Before `apply`, the real target skill must remain unchanged.
- The final decision should be one of: `apply`, `reject`, or `revise: ...`.

## 1. Create a New Project Skill

```text
/skill-authoring create .opencode/skills/<skill-name>. This is a goal-driven change. I want a skill that does the following: <desired behavior>. Use the relevant project files as references, ask any missing questions, propose the first version, show the diff in chat, and end with a final decision prompt. Keep the target skill unchanged until I explicitly type apply. After apply, write the skill and run static validation. Keep the final skill text in English.
```

## 2. Improve an Existing Project Skill

```text
/skill-authoring improve .opencode/skills/<skill-name>. This is a <instruction-driven or goal-driven> change. I want the skill to change in this way: <request>. Use relevant project files as context. Show the proposed diff with rationale first, keep the real target skill unchanged until I type apply, and finish the preview with apply / reject / revise: ... . Then apply the approved change and run static validation. Keep the final skill text in English.
```

## 3. Check an Existing Project Skill

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. Validate the current skill, infer and confirm its current meaning only if I did not already describe the intended meaning, point out weak spots, prepare a non-applied proposal when justified, and end the preview with apply / reject / revise: ... .
```

## 4. Check Against an Explicit Intended Meaning

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. The skill should mean: <intended behavior>. Evaluate the current text against that meaning, skip inferred-meaning confirmation, prepare a non-applied proposal if needed, and end with apply / reject / revise: ... .
```

## 5. Quick Edit

```text
/skill-authoring improve .opencode/skills/<skill-name> quick. Make only this change: <exact requested change>. Show the diff first, keep the target skill unchanged until I type apply, then apply it. Skip validation and tests.
```
