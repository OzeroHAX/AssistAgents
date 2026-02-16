import type { McpId } from '../mcp-registry.js';

export const AGENT_IDS = {
  WEB_RESEARCH: 'web-research',
  TESTER: 'tester',
  PLANNER: 'planner',
  DEV: 'dev',
  REVIEW: 'review',
  PROJECT: 'project',
} as const;

export type AgentId = (typeof AGENT_IDS)[keyof typeof AGENT_IDS];

export type AgentMcpConfig = {
  id: AgentId;
  placeholderToken: string;
  allowedMcpIds: readonly McpId[];
};
