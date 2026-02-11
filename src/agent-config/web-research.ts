import { MCP } from '../mcp-registry.js';
import { AGENT_IDS, type AgentMcpConfig } from './types.js';

export const WEB_RESEARCH_MCP_CONFIG: AgentMcpConfig = {
  id: AGENT_IDS.WEB_RESEARCH,
  placeholderToken: '{{mcp_web_research_permissions}}',
  allowedMcpIds: [
    MCP.TAVILY_SEARCH,
    MCP.DDG_SEARCH,
    MCP.ZAI_WEB_SEARCH,
    MCP.ZAI_WEB_READER,
    MCP.CONTEXT7,
    MCP.GITHUB_GREP,
    MCP.DEEPWIKI,
  ],
};
