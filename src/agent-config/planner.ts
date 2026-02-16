import { MCP } from '../mcp-registry.js';
import { AGENT_IDS, type AgentMcpConfig } from './types.js';

export const PLANNER_MCP_CONFIG: AgentMcpConfig = {
  id: AGENT_IDS.PLANNER,
  placeholderToken: '{{mcp_planner_permissions}}',
  allowedMcpIds: [MCP.CONTEXT7, MCP.GITHUB_GREP],
};
