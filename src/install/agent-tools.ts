export type ToolPermission =
  | 'Read'
  | 'Write'
  | 'Edit'
  | 'Glob'
  | 'Grep'
  | 'Bash'
  | 'WebFetch'
  | 'WebSearch'
  | 'Task'
  | 'Skill';

const TOOL_MAP: Record<string, ReadonlyArray<ToolPermission>> = {
  'planning/plan': ['Read', 'Glob', 'Grep', 'Bash'],
  'planning/project': ['Read', 'Glob', 'Grep', 'Bash'],
  'review/reviewer': ['Read', 'Glob', 'Grep'],
  'test/tester': ['Read', 'Glob', 'Grep', 'Bash', 'WebFetch'],
  'build/dev': ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash', 'Task', 'Skill'],
  'ask/ask': ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch', 'Task', 'Skill'],
  'assist/research/code-research': ['Read', 'Glob', 'Grep', 'Bash'],
  'assist/research/web-research': ['WebFetch', 'WebSearch'],
};

export function getClaudeToolsForAgent(agentId: string): ToolPermission[] {
  const tools = TOOL_MAP[agentId];
  if (!tools) return ['Read', 'Glob', 'Grep'];
  return Array.from(new Set(tools));
}
