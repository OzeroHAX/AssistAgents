import { MCP } from '../mcp-registry.js';
import { AGENT_IDS, type AgentMcpConfig } from './types.js';

export const DEV_MCP_CONFIG: AgentMcpConfig = {
  id: AGENT_IDS.DEV,
  placeholderToken: '{{mcp_dev_permissions}}',
  allowedMcpIds: [MCP.CONTEXT7, MCP.GITHUB_GREP],
};
