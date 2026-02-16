import { MCP } from '../mcp-registry.js';
import { AGENT_IDS, type AgentMcpConfig } from './types.js';

export const TESTER_MCP_CONFIG: AgentMcpConfig = {
  id: AGENT_IDS.TESTER,
  placeholderToken: '{{mcp_tester_permissions}}',
  allowedMcpIds: [MCP.CONTEXT7, MCP.GITHUB_GREP, MCP.CHROME_DEVTOOLS],
};
