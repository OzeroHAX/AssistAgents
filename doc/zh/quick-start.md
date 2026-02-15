# 快速开始

本流程帮助您在安装后立即开始使用 AssistAgents。

## 1) 安装包

```bash
npx -g @ozerohax/assistagents@latest
```

## 2) 确认安装的结构

`~/.opencode` 中应包含以下内容：

- `agents`
- `skills`
- `keys`
- `opencode.jsonc`

## 3) 使用推荐的交付循环

短迭代比一次性的大提示更可靠：

1. `build/planner` - 创建最小可验证计划。
2. `build/dev` - 逐步实现。
3. `test` - 验证行为并捕获结果。
4. `review` - 运行质量/风险检查。
5. 重复直到满足完成条件。

## 4) 最小首次迭代示例

1. 给 `build/planner` 一个具体的更改任务来规划。
2. 将该计划传递给 `build/dev`，并要求它带验证实现。
3. 运行 `test` 确认结果。
4. 运行 `review` 验证质量和风险。

## 5) 何时使用 `ask`

`ask` 适用于快速提问和只读上下文研究，而不进行任何更改。

## 6) 何时使用 `project`

当您需要项目级工作而非单个代码更改时，使用 `project`：

- 规范化需求和边界（范围）；
- 维护 PRD、架构决策和用例；
- 分解为史诗/任务；
- 在实现前更新项目状态和工件。
