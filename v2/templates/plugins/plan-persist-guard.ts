const BLOCK_MESSAGE =
  'Plan persistence guard: save or update a plan in ai-docs/dev-plans/*.md before running implementation or mutating actions.';

type SessionState = {
  guardRequired: boolean;
  planningTurnActive: boolean;
  planSaved: boolean;
};

const sessionState = new Map<string, SessionState>();

function getSessionKey(input: unknown): string {
  if (!input || typeof input !== 'object') return 'global';
  const data = input as Record<string, unknown>;
  const id = data.sessionID ?? data.sessionId ?? data.session ?? data.id;
  return typeof id === 'string' && id.length > 0 ? id : 'global';
}

function getOrCreateState(sessionKey: string): SessionState {
  const existing = sessionState.get(sessionKey);
  if (existing) return existing;

  const created: SessionState = {
    guardRequired: false,
    planningTurnActive: false,
    planSaved: false,
  };
  sessionState.set(sessionKey, created);
  return created;
}

function normalizePath(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\\/g, '/');
}

function isDevPlanPath(pathValue: unknown): boolean {
  const p = normalizePath(pathValue);
  return /(^|\/)ai-docs\/dev-plans\/[^/]+\.md$/i.test(p);
}

function getPathFromArgs(args: unknown): string {
  if (!args || typeof args !== 'object') return '';
  const a = args as Record<string, unknown>;
  const direct = a.filePath ?? a.file_path ?? a.path;
  return normalizePath(direct);
}

function isToolSuccessful(output: unknown): boolean {
  if (!output || typeof output !== 'object') return true;
  const o = output as Record<string, unknown>;
  if (typeof o.error === 'string' && o.error.length > 0) return false;
  if (o.error && typeof o.error === 'object') return false;
  return true;
}

function isPlanningSkillLoad(input: unknown): boolean {
  if (!input || typeof input !== 'object') return false;
  const data = input as Record<string, unknown>;
  if (data.tool !== 'skill') return false;
  const args = data.args as Record<string, unknown> | undefined;
  const name = args?.name;
  return typeof name === 'string' && name.startsWith('planning-');
}

function isAssistantMessageCompleted(event: unknown): boolean {
  if (!event || typeof event !== 'object') return false;
  const ev = event as Record<string, unknown>;
  if (ev.type !== 'message.updated') return false;

  const props = ev.properties as Record<string, unknown> | undefined;
  const info = props?.info as Record<string, unknown> | undefined;
  const role = info?.role;
  const status = info?.status;
  const completed = info?.completed;

  if (role !== 'assistant') return false;
  if (completed === true) return true;
  return status === 'completed';
}

function isMutatingTool(input: unknown): boolean {
  if (!input || typeof input !== 'object') return false;
  const data = input as Record<string, unknown>;
  const tool = data.tool;
  if (typeof tool !== 'string') return false;

  if (tool === 'edit' || tool === 'write' || tool === 'apply_patch') return true;

  if (tool === 'task') {
    const args = (data.args ?? {}) as Record<string, unknown>;
    const subagentType = args.subagent_type;
    return !(typeof subagentType === 'string' && subagentType.startsWith('assist/research/'));
  }

  if (tool === 'bash') {
    const args = (data.args ?? {}) as Record<string, unknown>;
    const command = typeof args.command === 'string' ? args.command.trim().toLowerCase() : '';
    if (!command) return false;

    const readonly = [
      'git status',
      'git diff',
      'git log',
      'git show',
      'git ls-files',
      'git rev-parse',
      'ls',
      'pwd',
      'tree',
      'find',
      'head',
      'cat',
      'grep',
      'rg',
      'date',
    ];

    return !readonly.some((prefix) => command === prefix || command.startsWith(`${prefix} `));
  }

  return false;
}

const PlanPersistGuardPlugin = async () => {
  return {
    'tool.execute.after': async (input: unknown, output: unknown) => {
      const sessionKey = getSessionKey(input);
      const state = getOrCreateState(sessionKey);

      if (isPlanningSkillLoad(input)) {
        state.guardRequired = true;
        state.planningTurnActive = true;
      }

      if (!isToolSuccessful(output)) {
        return;
      }

      if (!input || typeof input !== 'object') return;
      const data = input as Record<string, unknown>;
      const tool = data.tool;

      if (tool !== 'write' && tool !== 'edit') {
        return;
      }

      const args = data.args;
      const filePath = getPathFromArgs(args);
      if (isDevPlanPath(filePath)) {
        state.planSaved = true;
      }
    },

    event: async ({ event }: { event: unknown }) => {
      if (!isAssistantMessageCompleted(event)) {
        return;
      }

      const sessionKey = getSessionKey((event as Record<string, unknown>)?.properties);
      const state = getOrCreateState(sessionKey);

      if (state.planningTurnActive && !state.planSaved) {
        throw new Error(BLOCK_MESSAGE);
      }

      state.planningTurnActive = false;
    },

    'tool.execute.before': async (input: unknown) => {
      const sessionKey = getSessionKey(input);
      const state = getOrCreateState(sessionKey);

      if (!state.guardRequired || state.planSaved) {
        return;
      }

      if (!isMutatingTool(input)) {
        return;
      }

      if (!input || typeof input !== 'object') {
        throw new Error(BLOCK_MESSAGE);
      }

      const data = input as Record<string, unknown>;
      if (data.tool === 'write' || data.tool === 'edit') {
        const filePath = getPathFromArgs(data.args);
        if (isDevPlanPath(filePath)) {
          return;
        }
      }

      throw new Error(BLOCK_MESSAGE);
    },
  };
};

export default PlanPersistGuardPlugin;
