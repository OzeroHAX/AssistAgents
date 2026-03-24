import type { QualityJudgment, QualityRubric } from './types.js';

function weightOf(weight: number | undefined): number {
  return typeof weight === 'number' && weight > 0 ? weight : 1;
}

export function judgeQuality(responseText: string, rubric: QualityRubric): QualityJudgment {
  const checks = rubric.checks.map((check) => {
    let pass = false;

    switch (check.kind) {
      case 'regex_any':
        pass = check.patterns.some((pattern) => new RegExp(pattern, 'imu').test(responseText));
        break;
      case 'regex_none':
        pass = check.patterns.every((pattern) => !new RegExp(pattern, 'imu').test(responseText));
        break;
      case 'min_length':
        pass = responseText.trim().length >= check.min;
        break;
      default:
        pass = false;
    }

    return {
      id: check.id,
      description: check.description,
      pass,
      weight: weightOf(check.weight),
    };
  });

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = checks.reduce((sum, check) => sum + (check.pass ? check.weight : 0), 0);
  const score = totalWeight === 0 ? 1 : earnedWeight / totalWeight;

  return {
    rubricId: rubric.id,
    pass: score >= (rubric.passThreshold ?? 1),
    score,
    totalWeight,
    earnedWeight,
    checks,
  };
}
