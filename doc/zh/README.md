# OpenCode AssistAgents - 用户文档

本文档包含 `@ozerohax/assistagents` 包的完整用户文档，涵盖安装、启动和日常使用。

## 适用人群

- 需要对代码、决策和执行步骤拥有完全控制权的开发者，而非依赖不透明的"魔法"操作。
- 受够了 LLM 不可预测性，希望拥有可预测工作流程的用户：`计划 -> 实现 -> 测试 -> 审查`。

## 目录

1. [安装指南](./installation.md)
2. [快速开始](./quick-start.md)
3. [智能体及其使用场景](./agents.md)
4. [集成与 API 密钥](./integrations-and-keys.md)
5. [更新与备份](./update-and-backup.md)
6. [故障排除](./troubleshooting.md)
7. [常见问题](./faq.md)

## 包简介

`assistagents` 是一个交互式安装程序，用于准备 `~/.opencode` 目录：

- 从包模板安装/更新 `agents`、`skills` 和 `commands`；
- 可选将实验性的基于哈希的工具安装到 `tools`；
- 帮助启用 MCP 集成；
- 将密钥存储在 `~/.opencode/keys`；
- 生成 `~/.opencode/opencode.jsonc`，包含所需的 MCP 配置和权限限制。

## 项目本地 Coder Skills

若要为当前项目生成编码规则，请使用斜杠命令 `/init-agent-assist-code`。

请通过 `build/dev` 智能体运行此命令。

- 不带参数运行：根据仓库代码和配置自动识别语言。
- 带参数运行：传入逗号分隔的语言列表，例如 `typescript,csharp`。
- 输出位置：在当前仓库的 `.opencode/skills/coder/` 中创建或更新项目本地 skills。

详细步骤与示例请查看[快速开始](./quick-start.md)。

## 重要限制

- 安装程序仅在交互式 TTY 终端中运行。
- 重新运行安装程序会替换 `~/.opencode/agents`、`~/.opencode/skills` 和 `~/.opencode/commands`。
- 如果这些目录中有手动编辑的内容，请在更新前启用备份。
