# 集成与 API 密钥

以下是基于项目配置和官方提供商页面的 MCP 集成用途说明。

重要提示：本文档中的"需要密钥"状态遵循当前 AssistAgents 的实现，而非所有理论上的提供商侧选项。

## 各集成用途

### `tavily-search`（`TAVILY_API_KEY`）

- 用途：通过 Tavily MCP 进行网络搜索和数据提取。
- 适用于：智能体工作流中的外部研究任务。
- 在 AssistAgents 中：需要密钥。
- 官方文档：Tavily MCP - `https://docs.tavily.com/documentation/mcp`。

### `ddg-search`（无需密钥）

- 用途：通过 DuckDuckGo MCP 服务器进行网络搜索。
- 适用于：快速搜索和基础研究，无需设置 API 密钥。
- 在 AssistAgents 中：无需密钥。
- 来源：PyPI `duckduckgo-mcp-server` - `https://pypi.org/project/duckduckgo-mcp-server/`。

### `zai-web-search`（`ZAI_API_KEY`）

- 用途：通过 Z.AI Web Search MCP 进行网络搜索。
- 适用于：在开发过程中获取最新的外部信息和链接。
- 在 AssistAgents 中：需要密钥。
- 官方文档：`https://docs.z.ai/devpack/mcp/search-mcp-server`。

### `zai-web-reader`（`ZAI_API_KEY`）

- 用途：通过 Z.AI Web Reader MCP 读取网页/提取内容。
- 适用于：获取页面内容，而不仅仅是搜索结果。
- 在 AssistAgents 中：需要密钥。
- 官方文档：`https://docs.z.ai/devpack/mcp/reader-mcp-server`。

### `context7`（`CONTEXT7_API_KEY`）

- 用途：最新的库/框架文档和示例。
- 适用于：准确的 API/版本级指导。
- 在 AssistAgents 中：需要密钥。
- 官方文档：`https://github.com/upstash/context7`。

### `github-grep`（无需密钥）

- 用途：在公共 GitHub 仓库中搜索真实代码示例。
- 适用于：API/库的实际使用模式。
- 在 AssistAgents 中：无需密钥，端点 `https://mcp.grep.app`。

### `deepwiki`（无需密钥）

- 用途：将 DeepWiki MCP 用作外部的面向仓库的知识源。
- 适用于：快速了解仓库概览和相关上下文。
- 在 AssistAgents 中：无需密钥，端点 `https://mcp.deepwiki.com/mcp`。
- 注意：关于限制/配额公开文档可能会随时间变化；请查看提供商更新。

### `chrome-devtools`（无需密钥）

- 用途：通过 DevTools MCP 控制和调试实时 Chrome 浏览器。
- 适用于：UI 诊断、控制台/网络检查和性能追踪。
- 在 AssistAgents 中：无需密钥，本地启动 `npx -y chrome-devtools-mcp@latest`。
- 官方文档：`https://github.com/ChromeDevTools/chrome-devtools-mcp`。

## 如何获取密钥

### `TAVILY_API_KEY`

1. 打开 Tavily：`https://www.tavily.com/`。
2. 进入仪表板：`https://app.tavily.com/home`。
3. 创建/复制 API 密钥，并在安装程序中提供为 `TAVILY_API_KEY`。

### `ZAI_API_KEY`

1. 打开 Z.AI API 密钥控制台：`https://z.ai/manage-apikey/apikey-list`。
2. 创建 API 密钥。
3. 将此密钥同时用于 `zai-web-search` 和 `zai-web-reader`。
4. 您需要 API 余额或 Z.AI Coding Plan 订阅（Pro 或更高版本）。

### `CONTEXT7_API_KEY`

1. 打开仪表板：`https://context7.com/dashboard`。
2. 生成/复制密钥。
3. 在安装程序中提供为 `CONTEXT7_API_KEY`。

## 密钥存储位置

密钥作为单独的文件保存在 `~/.opencode/keys/` 中：

- `zai_api.txt`（`ZAI_API_KEY`）
- `context7.txt`（`CONTEXT7_API_KEY`）
- `tavily_search.txt`（`TAVILY_API_KEY`）

这些文件通过 `{file:...}` 条目从 `~/.opencode/opencode.jsonc` 引用。

## 安装程序如何处理密钥

- 如果密钥已存在，安装程序会询问是保留还是替换。
- 如果密钥缺失，安装程序会询问是否现在输入。
- 如果未提供必需的密钥，依赖的集成会自动禁用。

## 实用建议

- 保持 `~/.opencode/keys/` 对用户账户私有。
- 不要将密钥文件提交到 git。
- 更改密钥后，重新运行安装程序以刷新最终的 MCP 配置。
