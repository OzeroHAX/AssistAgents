import { MCP } from '../mcp-registry.js';
import { AGENT_IDS, type AgentMcpConfig } from './types.js';

export const PROJECT_MCP_CONFIG: AgentMcpConfig = {
  id: AGENT_IDS.PROJECT,
  placeholderToken: '{{mcp_project_permissions}}',
  allowedMcpIds: [ ],
};
