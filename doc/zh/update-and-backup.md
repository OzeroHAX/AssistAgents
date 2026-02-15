# 更新与备份

## 如何更新 AssistAgents

使用与安装相同的命令：

```bash
npx -g @ozerohax/assistagents@latest
```

## 更新会替换什么

重新运行安装程序会替换：

- `~/.opencode/agents`
- `~/.opencode/skills`

如果启用了哈希工具，还可能覆盖 `~/.opencode/tools`。

也会更新 `~/.opencode/opencode.jsonc`，并可以将之前的配置备份为 `.bak-YYYYMMDD-HHmmss`。

## 何时应该启用备份

在以下情况下启用 zip 备份：

- 您手动编辑了 `agents` 或 `skills` 中的文件；
- 您希望在更新后有一个安全的回滚点；
- 您正在更改 MCP/密钥配置，希望先创建快照。

## 安全更新实践

1. 关闭依赖当前智能体的活动会话。
2. 在启用备份的情况下运行安装程序。
3. 验证所需的 MCP 集成保持启用状态。
4. 运行简短的冒烟检查：`build/planner` -> `build/dev` -> `test`。
