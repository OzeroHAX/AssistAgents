import type { EvalCase, ParsedTrace, RoutingJudgment } from './types.js';

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function judgeRouting(testCase: EvalCase, trace: ParsedTrace): RoutingJudgment {
  const requiredSkills = unique(testCase.requiredSkills ?? []);
  const forbiddenSkills = unique(testCase.forbiddenSkills ?? []);
  const allowedSkills = new Set([
    ...requiredSkills,
    ...(testCase.allowedBootstrapSkills ?? []),
    ...(testCase.allowedOptionalSkills ?? []),
  ]);

  const loadedSkills = unique(trace.loadedSkills);
  const requiredMisses = requiredSkills.filter((skill) => !loadedSkills.includes(skill));
  const forbiddenHits = forbiddenSkills.filter((skill) => loadedSkills.includes(skill));
  const unexpectedSkills = testCase.strictUnexpectedSkills
    ? loadedSkills.filter((skill) => !allowedSkills.has(skill))
    : [];

  const recall = requiredSkills.length === 0
    ? 1
    : (requiredSkills.length - requiredMisses.length) / requiredSkills.length;
  const precision = loadedSkills.length === 0
    ? 1
    : (loadedSkills.length - forbiddenHits.length - unexpectedSkills.length) / loadedSkills.length;

  return {
    pass: requiredMisses.length === 0 && forbiddenHits.length === 0 && unexpectedSkills.length === 0,
    recall,
    precision: Math.max(0, precision),
    requiredMisses,
    forbiddenHits,
    unexpectedSkills,
  };
}
