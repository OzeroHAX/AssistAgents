import type { KeyFiles, KeyId } from './key-registry.js';

export const MCP = {
  TAVILY_SEARCH: 'tavily-search',
  DDG_SEARCH: 'ddg-search',
  ZAI_WEB_SEARCH: 'zai-web-search',
  ZAI_WEB_READER: 'zai-web-reader',
  CONTEXT7: 'context7',
  GITHUB_GREP: 'github-grep',
  DEEPWIKI: 'deepwiki',
  CHROME_DEVTOOLS: 'chrome-devtools',
} as const;

export type McpId = (typeof MCP)[keyof typeof MCP];

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
    id: MCP.TAVILY_SEARCH,
    label: 'tavily-search',
    requiresKeys: ['tavily'],
    toolPattern: 'tavily-search*',
    renderConfig: (keyFiles) => ({
      type: 'remote',
      url: `https://mcp.tavily.com/mcp/?tavilyApiKey={file:${keyFiles.tavily}}`,
    }),
  },
  {
    id: MCP.DDG_SEARCH,
    label: 'ddg-search',
    requiresKeys: [],
    toolPattern: 'ddg-search*',
    renderConfig: () => ({
      type: 'local',
      command: ['uvx', 'duckduckgo-mcp-server'],
    }),
  },
  {
    id: MCP.ZAI_WEB_SEARCH,
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
    id: MCP.ZAI_WEB_READER,
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
    id: MCP.CONTEXT7,
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
    id: MCP.GITHUB_GREP,
    label: 'github-grep',
    requiresKeys: [],
    toolPattern: 'github-grep*',
    renderConfig: () => ({
      type: 'remote',
      url: 'https://mcp.grep.app',
    }),
  },
  {
    id: MCP.DEEPWIKI,
    label: 'deepwiki',
    requiresKeys: [],
    toolPattern: 'deepwiki*',
    renderConfig: () => ({
      type: 'remote',
      url: 'https://mcp.deepwiki.com/mcp',
    }),
  },
  {
    id: MCP.CHROME_DEVTOOLS,
    label: 'chrome-devtools',
    requiresKeys: [],
    toolPattern: 'chrome-devtools*',
    renderConfig: () => ({
      type: 'local',
      command: ['npx', '-y', 'chrome-devtools-mcp@latest'],
    }),
  },
];

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

export function getToolPatternsForMcpIds(enabledMcpIds: readonly McpId[], allowedMcpIds: readonly McpId[]): string[] {
  const enabled = new Set(enabledMcpIds);
  const allowed = new Set(allowedMcpIds);
  return MCP_REGISTRY.filter((definition) => enabled.has(definition.id) && allowed.has(definition.id) && definition.toolPattern)
    .map((definition) => definition.toolPattern as string);
}
