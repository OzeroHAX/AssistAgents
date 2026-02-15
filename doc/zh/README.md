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

- 从包模板安装/更新 `agents` 和 `skills`；
- 可选将实验性的基于哈希的工具安装到 `tools`；
- 帮助启用 MCP 集成；
- 将密钥存储在 `~/.opencode/keys`；
- 生成 `~/.opencode/opencode.jsonc`，包含所需的 MCP 配置和权限限制。

## 重要限制

- 安装程序仅在交互式 TTY 终端中运行。
- 重新运行安装程序会替换 `~/.opencode/agents` 和 `~/.opencode/skills`。
- 如果这些目录中有手动编辑的内容，请在更新前启用备份。
