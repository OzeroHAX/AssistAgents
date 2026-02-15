# 故障排除

## `assistagents failed: This installer only works in interactive TUI mode (TTY not found).`

原因：安装程序在非交互式环境中启动。

解决方法：

- 在常规终端中运行命令；
- 不要在非交互式 CI shell 中运行安装程序；
- 如果使用包装器，请验证 stdin/stdout 是否可用作 TTY。

## 集成已启用但工具不可用

可能原因：

- 未输入必需的密钥；
- 集成被安装程序自动禁用；
- `opencode.jsonc` 已过期。

解决方法：

1. 重新运行安装程序。
2. 选择所需的 MCP 集成。
3. 为所需服务输入/更新密钥。

## 基于哈希的文件工具缺失

原因：未启用"启用实验性的基于哈希的文件工具"选项。

解决方法：

- 重新运行安装程序；
- 启用哈希工具选项。

## Agents/Skills 中的自定义编辑丢失

原因：重新运行安装程序会用模板替换 `~/.opencode/agents` 和 `~/.opencode/skills`。

解决方法：

- 从备份中恢复需要的编辑；
- 下次更新前启用 zip 备份。

## 基本诊断

- 检查以下文件是否存在：`~/.opencode/opencode.jsonc`、`~/.opencode/agents`、`~/.opencode/skills`。
- 确保 `~/.opencode/keys` 包含活动集成的密钥文件。
- 如果问题仍然存在，请在干净的交互式终端会话中重复安装。
