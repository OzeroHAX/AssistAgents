# 安装指南

## 环境要求

- Node.js `>= 18`
- 可访问交互式终端（TTY）

检查 Node.js 版本：

```bash
node -v
```

## 安装命令

```bash
npx -g @ozerohax/assistagents@latest
```

更新到最新版本也使用相同的命令。

## 安装过程

安装程序会逐步询问以下内容：

1. 是否为当前的 `~/.opencode` 创建 zip 备份。
2. 智能体的首选响应语言。
3. 是否为选定的智能体显式设置模型（可选）。
4. 是否启用实验性的基于哈希的文件工具。
5. 启用哪些 MCP 集成。
6. 仅为需要密钥的集成提供密钥值。

## 更新的路径

安装过程中会覆盖/创建以下内容：

- `~/.opencode/agents/`
- `~/.opencode/skills/`
- `~/.opencode/tools/`（如果启用了哈希工具）
- `~/.opencode/keys/`
- `~/.opencode/opencode.jsonc`

## 运行前须知

- 如果您在 `~/.opencode/agents` 和 `~/.opencode/skills` 中有手动编辑的内容，请启用备份。
- 如果在 CI 或非交互式 shell 中运行，安装会失败，因为没有可用的 TTY。
