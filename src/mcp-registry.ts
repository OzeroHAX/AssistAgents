import type { KeyFiles } from './config-template.js';

export type KeyId = 'zaiApi' | 'context7' | 'tavily';

export type McpId =
  | 'tavily-search'
  | 'ddg-search'
  | 'zai-web-search'
  | 'zai-web-reader'
  | 'context7'
  | 'github-grep'
  | 'deepwiki'
  | 'chrome-devtools';

export type AgentMcpPermissionGroup =
  | 'webResearch'
  | 'tester'
  | 'planner'
  | 'dev'
  | 'review';

type McpConfig = {
  type: 'remote' | 'local';
  url?: string;
  headers?: Record<string, string>;
  command?: string[];
};

type McpDefinition = {
  id: McpId;
  label: string;
  requiresKeys: KeyId[];
  toolPattern?: string;
  renderConfig: (keyFiles: KeyFiles) => McpConfig;
};

const MCP_REGISTRY: readonly McpDefinition[] = [
  {
    id: 'tavily-search',
    label: 'tavily-search',
    requiresKeys: ['tavily'],
    toolPattern: 'tavily-search*',
    renderConfig: (keyFiles) => ({
      type: 'remote',
      url: `https://mcp.tavily.com/mcp/?tavilyApiKey={file:${keyFiles.tavily}}`,
    }),
  },
  {
    id: 'ddg-search',
    label: 'ddg-search',
    requiresKeys: [],
    toolPattern: 'ddg-search*',
    renderConfig: () => ({
      type: 'local',
      command: ['uvx', 'duckduckgo-mcp-server'],
    }),
  },
  {
    id: 'zai-web-search',
    label: 'zai-web-search',
    requiresKeys: ['zaiApi'],
    toolPattern: 'zai-web-search*',
    renderConfig: (keyFiles) => ({
      type: 'remote',
      url: 'https://api.z.ai/api/mcp/web_search_prime/mcp',
      headers: {
        Authorization: `Bearer {file:${keyFiles.zaiApi}}`,
      },
    }),
  },
  {
    id: 'zai-web-reader',
    label: 'zai-web-reader',
    requiresKeys: ['zaiApi'],
    toolPattern: 'zai-web-reader*',
    renderConfig: (keyFiles) => ({
      type: 'remote',
      url: 'https://api.z.ai/api/mcp/web_reader/mcp',
      headers: {
        Authorization: `Bearer {file:${keyFiles.zaiApi}}`,
      },
    }),
  },
  {
    id: 'context7',
    label: 'context7',
    requiresKeys: ['context7'],
    toolPattern: 'context7*',
    renderConfig: (keyFiles) => ({
      type: 'remote',
      url: 'https://mcp.context7.com/mcp',
      headers: {
        CONTEXT7_API_KEY: `{file:${keyFiles.context7}}`,
      },
    }),
  },
  {
    id: 'github-grep',
    label: 'github-grep',
    requiresKeys: [],
    toolPattern: 'github-grep*',
    renderConfig: () => ({
      type: 'remote',
      url: 'https://mcp.grep.app',
    }),
  },
  {
    id: 'deepwiki',
    label: 'deepwiki',
    requiresKeys: [],
    toolPattern: 'deepwiki*',
    renderConfig: () => ({
      type: 'remote',
      url: 'https://mcp.deepwiki.com/mcp',
    }),
  },
  {
    id: 'chrome-devtools',
    label: 'chrome-devtools',
    requiresKeys: [],
    toolPattern: 'chrome-devtools*',
    renderConfig: () => ({
      type: 'local',
      command: ['npx', '-y', 'chrome-devtools-mcp@latest'],
    }),
  },
];

const PERMISSION_GROUP_MCP_IDS: Record<AgentMcpPermissionGroup, readonly McpId[]> = {
  webResearch: ['tavily-search', 'ddg-search', 'zai-web-search', 'zai-web-reader', 'context7', 'github-grep', 'deepwiki'],
  tester: ['context7', 'github-grep', 'chrome-devtools'],
  planner: ['context7', 'github-grep'],
  dev: ['context7', 'github-grep'],
  review: ['context7', 'github-grep'],
};

export const ALL_MCP_IDS: McpId[] = MCP_REGISTRY.map((mcp) => mcp.id);

export function getMcpDefinitions(): readonly McpDefinition[] {
  return MCP_REGISTRY;
}

export function getAllMcpToolPatterns(): string[] {
  return MCP_REGISTRY.map((definition) => definition.toolPattern)
    .filter((pattern): pattern is string => typeof pattern === 'string')
    .sort((a, b) => a.localeCompare(b));
}

export function renderMcpConfigEntries(keyFiles: KeyFiles, enabledMcpIds?: readonly McpId[]): Record<string, McpConfig> {
  const enabled = new Set(enabledMcpIds ?? ALL_MCP_IDS);
  const entries: Record<string, McpConfig> = {};

  for (const definition of MCP_REGISTRY) {
    if (!enabled.has(definition.id)) continue;
    entries[definition.id] = definition.renderConfig(keyFiles);
  }

  return entries;
}

export function collectRequiredKeys(enabledMcpIds: readonly McpId[]): KeyId[] {
  const enabled = new Set(enabledMcpIds);
  const keys = new Set<KeyId>();

  for (const definition of MCP_REGISTRY) {
    if (!enabled.has(definition.id)) continue;
    for (const keyId of definition.requiresKeys) keys.add(keyId);
  }

  return Array.from(keys);
}

export function getMcpIdsRequiringKey(enabledMcpIds: readonly McpId[], keyId: KeyId): McpId[] {
  const enabled = new Set(enabledMcpIds);
  return MCP_REGISTRY.filter((definition) => enabled.has(definition.id) && definition.requiresKeys.includes(keyId)).map((definition) => definition.id);
}

export function getDefaultEnabledMcpIds(keyFilledState: Record<KeyId, boolean>): McpId[] {
  const enabled: McpId[] = [];

  for (const definition of MCP_REGISTRY) {
    if (definition.requiresKeys.length === 0) {
      enabled.push(definition.id);
      continue;
    }

    const allRequiredPresent = definition.requiresKeys.every((keyId) => keyFilledState[keyId]);
    if (allRequiredPresent) enabled.push(definition.id);
  }

  return enabled;
}

function getPermissionPatternsForGroup(enabledMcpIds: readonly McpId[], group: AgentMcpPermissionGroup): string[] {
  const enabled = new Set(enabledMcpIds);
  const allowedMcpIds = new Set(PERMISSION_GROUP_MCP_IDS[group]);
  return MCP_REGISTRY.filter((definition) => enabled.has(definition.id) && allowedMcpIds.has(definition.id) && definition.toolPattern)
    .map((definition) => definition.toolPattern as string);
}

export function getWebResearchPermissionPatterns(enabledMcpIds: readonly McpId[]): string[] {
  return getPermissionPatternsForGroup(enabledMcpIds, 'webResearch');
}

export function getTesterPermissionPatterns(enabledMcpIds: readonly McpId[]): string[] {
  return getPermissionPatternsForGroup(enabledMcpIds, 'tester');
}

export function getPlannerPermissionPatterns(enabledMcpIds: readonly McpId[]): string[] {
  return getPermissionPatternsForGroup(enabledMcpIds, 'planner');
}

export function getDevPermissionPatterns(enabledMcpIds: readonly McpId[]): string[] {
  return getPermissionPatternsForGroup(enabledMcpIds, 'dev');
}

export function getReviewPermissionPatterns(enabledMcpIds: readonly McpId[]): string[] {
  return getPermissionPatternsForGroup(enabledMcpIds, 'review');
}
