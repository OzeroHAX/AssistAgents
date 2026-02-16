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

## 3) 生成项目本地 Coder Skills（可选）

如果您希望基于仓库生成本地编码规则，请使用以下斜杠命令：

```text
/init-agent-assist-code
```

该命令会：

- 仅在当前仓库的 `.opencode/skills/coder/` 下创建或更新 skills；
- 在未传参数时，根据代码和配置自动识别语言；
- 通过 `$ARGUMENTS` 支持显式语言列表（逗号分隔），例如：

```text
/init-agent-assist-code typescript,csharp
```

建议使用时机：

- 在新项目中安装/更新 AssistAgents 后立即执行；
- 技术栈发生明显变化后（新增语言、框架、测试工具、lint 工具）；
- 需要让本地 coder skills 与当前仓库状态重新同步时。

## 4) 使用推荐的交付循环

短迭代比一次性的大提示更可靠：

1. `build/planner` - 创建最小可验证计划。
2. `build/dev` - 逐步实现。
3. `test` - 验证行为并捕获结果。
4. `review` - 运行质量/风险检查。
5. 重复直到满足完成条件。

## 5) 最小首次迭代示例

1. 给 `build/planner` 一个具体的更改任务来规划。
2. 将该计划传递给 `build/dev`，并要求它带验证实现。
3. 运行 `test` 确认结果。
4. 运行 `review` 验证质量和风险。

## 6) 何时使用 `ask`

`ask` 适用于快速提问和只读上下文研究，而不进行任何更改。

## 7) 何时使用 `project`

当您需要项目级工作而非单个代码更改时，使用 `project`：

- 规范化需求和边界（范围）；
- 维护 PRD、架构决策和用例；
- 分解为史诗/任务；
- 在实现前更新项目状态和工件。
