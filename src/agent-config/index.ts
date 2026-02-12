import { DEV_MCP_CONFIG } from './dev.js';
import { PLANNER_MCP_CONFIG } from './planner.js';
import { PROJECT_MCP_CONFIG } from './project.js';
import { REVIEW_MCP_CONFIG } from './review.js';
import { TESTER_MCP_CONFIG } from './tester.js';
import { AGENT_IDS, type AgentId, type AgentMcpConfig } from './types.js';
import { WEB_RESEARCH_MCP_CONFIG } from './web-research.js';

export const AGENT_MCP_CONFIGS: readonly AgentMcpConfig[] = [
  WEB_RESEARCH_MCP_CONFIG,
  TESTER_MCP_CONFIG,
  PLANNER_MCP_CONFIG,
  PROJECT_MCP_CONFIG,
  DEV_MCP_CONFIG,
  REVIEW_MCP_CONFIG,
];

export const AGENT_MCP_CONFIGS_BY_ID: Readonly<Record<AgentId, AgentMcpConfig>> = {
  [AGENT_IDS.WEB_RESEARCH]: WEB_RESEARCH_MCP_CONFIG,
  [AGENT_IDS.TESTER]: TESTER_MCP_CONFIG,
  [AGENT_IDS.PLANNER]: PLANNER_MCP_CONFIG,
  [AGENT_IDS.PROJECT]: PROJECT_MCP_CONFIG,
  [AGENT_IDS.DEV]: DEV_MCP_CONFIG,
  [AGENT_IDS.REVIEW]: REVIEW_MCP_CONFIG,
};

export { AGENT_IDS } from './types.js';
export type { AgentId, AgentMcpConfig } from './types.js';
