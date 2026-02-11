import { MCP } from '../mcp-registry.js';
import { AGENT_IDS, type AgentMcpConfig } from './types.js';

export const REVIEW_MCP_CONFIG: AgentMcpConfig = {
  id: AGENT_IDS.REVIEW,
  placeholderToken: '{{mcp_review_permissions}}',
  allowedMcpIds: [MCP.CONTEXT7, MCP.GITHUB_GREP],
};
