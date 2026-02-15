# Integrations and API Keys

Below is the purpose of MCP integrations based on project configuration and official provider pages.

Important: the "key required" status in this document follows the current AssistAgents implementation, not all theoretical provider-side options.

## What Each Integration Is For

### `tavily-search` (`TAVILY_API_KEY`)

- Purpose: web search and data extraction via Tavily MCP.
- Useful for: external research tasks in agent workflows.
- In AssistAgents: key is required.
- Official: Tavily MCP docs - `https://docs.tavily.com/documentation/mcp`.

### `ddg-search` (no key)

- Purpose: web search via a DuckDuckGo MCP server.
- Useful for: quick search and basic research without API key setup.
- In AssistAgents: no key required.
- Source: PyPI `duckduckgo-mcp-server` - `https://pypi.org/project/duckduckgo-mcp-server/`.

### `zai-web-search` (`ZAI_API_KEY`)

- Purpose: web search via Z.AI Web Search MCP.
- Useful for: getting up-to-date external information and links during development.
- In AssistAgents: key is required.
- Official: `https://docs.z.ai/devpack/mcp/search-mcp-server`.

### `zai-web-reader` (`ZAI_API_KEY`)

- Purpose: web page reading/content extraction via Z.AI Web Reader MCP.
- Useful for: retrieving page content, not only search results.
- In AssistAgents: key is required.
- Official: `https://docs.z.ai/devpack/mcp/reader-mcp-server`.

### `context7` (`CONTEXT7_API_KEY`)

- Purpose: up-to-date library/framework docs and examples.
- Useful for: accurate API/version-level guidance.
- In AssistAgents: key is required.
- Official: `https://github.com/upstash/context7`.

### `github-grep` (no key)

- Purpose: search real code examples in public GitHub repositories.
- Useful for: practical usage patterns for APIs/libraries.
- In AssistAgents: no key required, endpoint `https://mcp.grep.app`.

### `deepwiki` (no key)

- Purpose: use DeepWiki MCP as an external repo-oriented knowledge source.
- Useful for: quick repository overviews and related context.
- In AssistAgents: no key required, endpoint `https://mcp.deepwiki.com/mcp`.
- Note: public docs around limits/quotas may change over time; check provider updates.

### `chrome-devtools` (no key)

- Purpose: control and debug a live Chrome browser through DevTools MCP.
- Useful for: UI diagnostics, console/network inspection, and performance traces.
- In AssistAgents: no key required, local launch `npx -y chrome-devtools-mcp@latest`.
- Official: `https://github.com/ChromeDevTools/chrome-devtools-mcp`.

## How to Get Keys

### `TAVILY_API_KEY`

1. Open Tavily: `https://www.tavily.com/`.
2. Go to dashboard: `https://app.tavily.com/home`.
3. Create/copy an API key and provide it as `TAVILY_API_KEY` in the installer.

### `ZAI_API_KEY`

1. Open Z.AI API key console: `https://z.ai/manage-apikey/apikey-list`.
2. Create an API key.
3. Use this key for both `zai-web-search` and `zai-web-reader`.
4. You need either API balance or a Z.AI Coding Plan subscription (Pro or higher).

### `CONTEXT7_API_KEY`

1. Open dashboard: `https://context7.com/dashboard`.
2. Generate/copy the key.
3. Provide it to the installer as `CONTEXT7_API_KEY`.

## Where Keys Are Stored

Keys are saved as separate files in `~/.opencode/keys/`:

- `zai_api.txt` (`ZAI_API_KEY`)
- `context7.txt` (`CONTEXT7_API_KEY`)
- `tavily_search.txt` (`TAVILY_API_KEY`)

These files are referenced from `~/.opencode/opencode.jsonc` via `{file:...}` entries.

## How the Installer Handles Keys

- If a key already exists, the installer asks whether to keep or replace it.
- If a key is missing, the installer asks whether to enter it now.
- If a required key is not provided, dependent integrations are disabled automatically.

## Practical Recommendations

- Keep `~/.opencode/keys/` private to the user account.
- Do not commit key files to git.
- After changing keys, re-run the installer to refresh final MCP configuration.
