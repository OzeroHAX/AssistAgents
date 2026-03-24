import type { EvalPermissionProfile } from './runtime-permissions.js';

export type EvalCase = {
  id: string;
  agent: string;
  promptFile: string;
  fixtureDir: string;
  attachments?: string[];
  expectedFiles?: string[];
  requiredSkills?: string[];
  forbiddenSkills?: string[];
  allowedBootstrapSkills?: string[];
  allowedOptionalSkills?: string[];
  strictUnexpectedSkills?: boolean;
  rubricFile?: string;
  repeat?: number;
  tags?: string[];
};

export type QualityRubricCheck =
  | {
      id: string;
      kind: 'regex_any';
      description: string;
      patterns: string[];
      weight?: number;
    }
  | {
      id: string;
      kind: 'regex_none';
      description: string;
      patterns: string[];
      weight?: number;
    }
  | {
      id: string;
      kind: 'min_length';
      description: string;
      min: number;
      weight?: number;
    };

export type QualityRubric = {
  id: string;
  passThreshold?: number;
  checks: QualityRubricCheck[];
};

export type UsageMetrics = {
  input: number | null;
  output: number | null;
  total: number | null;
  estimated: boolean;
  candidatesFound: number;
};

export type ToolCallTrace = {
  name: string;
  eventPath: string;
};

export type ParsedTrace = {
  eventCount: number;
  parseErrors: number;
  sessionIds: string[];
  toolCalls: ToolCallTrace[];
  skillCalls: Array<{ eventPath: string; matchedSkills: string[] }>;
  loadedSkills: string[];
  responseText: string;
  usage: UsageMetrics;
};

export type RoutingJudgment = {
  pass: boolean;
  recall: number;
  precision: number;
  requiredMisses: string[];
  forbiddenHits: string[];
  unexpectedSkills: string[];
};

export type QualityCheckResult = {
  id: string;
  description: string;
  pass: boolean;
  weight: number;
};

export type QualityJudgment = {
  rubricId: string;
  pass: boolean;
  score: number;
  totalWeight: number;
  earnedWeight: number;
  checks: QualityCheckResult[];
};

export type CaseResult = {
  caseId: string;
  attempt: number;
  agent: string;
  title: string;
  runDir: string;
  promptFile: string;
  fixtureDir: string;
  workspaceDir: string;
  attachments: string[];
  expectedFiles: string[];
  missingExpectedFiles: string[];
  exitCode: number | null;
  startedAt: string;
  finishedAt: string;
  latencyMs: number;
  eventsFile: string;
  stderrFile: string;
  sessionFile: string | null;
  trace: ParsedTrace;
  routing: RoutingJudgment;
  quality: QualityJudgment | null;
  pass: boolean;
};

export type RunSummary = {
  runId: string;
  createdAt: string;
  completedAt: string;
  installCommand: string;
  opencodeBin: string;
  permissionProfile: EvalPermissionProfile;
  install: {
    performed: boolean;
    reason: string;
    fingerprint: string;
    stateFile: string;
  };
  runtime: {
    rootDir: string;
    baseOpencodeDir: string;
    homeDir: string;
    xdgConfigHome: string;
    xdgDataHome: string;
  };
  selectedCases: string[];
  results: CaseResult[];
  aggregate: {
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    averageLatencyMs: number;
    averageQualityScore: number | null;
  };
};
