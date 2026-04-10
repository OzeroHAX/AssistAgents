# Skill-Authoring 提示模板

在 OpenCode 聊天中直接通过 `/skill-authoring` 使用这些模板。

完整 flow、工件结构、static validation、trigger 测试，以及最终的 `apply / reject / revise: ...` 合同，请查看 [Skill-Authoring 指南](./skill-authoring.md)。

规则：

- 面向用户的聊天内容使用用户语言。
- 最终 `SKILL.md` 内容保持英文。
- 在修改 target skill 之前，必须在可见聊天中展示 diff。
- 在 full mode 中，`ai-docs/skill-authoring/**` 下的 pre-apply 工件是正常行为。
- 在 `apply` 之前，真实 target skill 必须保持不变。
- 最终结果必须是以下之一：`apply`、`reject`、`revise: ...`。

## 1. 创建新的 Project Skill

```text
/skill-authoring create .opencode/skills/<skill-name>. This is a goal-driven change. I want a skill that does the following: <desired behavior>. Use the relevant project files as references, ask any missing questions, propose the first version, show the diff in chat, and end the preview with apply / reject / revise: ... . Do not change the real target skill until I type apply. After apply, write the skill and run static validation. Keep the final skill text in English.
```

## 2. 改进已有的 Project Skill

```text
/skill-authoring improve .opencode/skills/<skill-name>. This is a <instruction-driven or goal-driven> change. I want the skill to change in this way: <request>. Use relevant project files as context. Show the proposed diff with rationale first, keep the real target skill unchanged until I type apply, and end the preview with apply / reject / revise: ... . Then apply the approved change and run static validation. Keep the final skill text in English.
```

## 3. 检查已有的 Project Skill

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. Validate the current skill, infer and confirm its current meaning only if I did not already describe the intended meaning, point out weak spots, prepare a non-applied proposal when justified, and end the preview with apply / reject / revise: ... .
```

## 4. 按明确的 Intended Meaning 进行检查

```text
/skill-authoring check .opencode/skills/<skill-name>/SKILL.md. The skill should mean: <intended behavior>. Evaluate the current text against that meaning, skip inferred-meaning confirmation when it is not needed, prepare a non-applied proposal if needed, and end with apply / reject / revise: ... .
```

## 5. 快速修改

```text
/skill-authoring improve .opencode/skills/<skill-name> quick. Make only this change: <exact requested change>. Show the diff first, keep the target skill unchanged until I type apply, then apply it. Skip validation and tests.
```
