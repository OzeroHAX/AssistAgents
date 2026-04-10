#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getFlag,
  parseCliArgs,
  parseSkillMarkdown,
  resolveSkillEntry,
  writeJsonFile,
  writeTextFile,
} from '../shared/fs.mjs';
import { lintSkillText } from './score-lint.mjs';

function hasTag(body, tagName) {
  return new RegExp(`<${tagName}(\\s|>)`, 'i').test(body);
}

function renderChecklistItem(pass, label) {
  return `${pass ? '[x]' : '[ ]'} ${label}`;
}

function countWords(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .match(/\b[\p{L}\p{N}_-]+\b/gu)?.length ?? 0;
}

function extractSectionText(body, tagName) {
  const match = body.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, 'i'));
  return match?.[1] ?? '';
}

function buildSectionWordCounts(body, tagNames) {
  return Object.fromEntries(
    tagNames.map((tagName) => [tagName, countWords(extractSectionText(body, tagName))]),
  );
}

function normalizedSectionTerms(text) {
  const stopwords = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'from', 'into', 'under', 'than', 'when', 'what', 'which',
    'where', 'while', 'will', 'would', 'could', 'should', 'must', 'have', 'has', 'had', 'into', 'onto', 'over',
    'your', 'their', 'them', 'they', 'then', 'than', 'each', 'item', 'step', 'required', 'optional', 'importance',
    'critical', 'high', 'guide', 'skill', 'document', 'documents', 'request', 'output', 'outputs', 'validation',
    'purpose', 'workflow', 'input', 'inputs', 'requirements', 'requirement', 'user', 'users',
  ]);

  return new Set(
    (text
      .replace(/<[^>]+>/g, ' ')
      .toLowerCase()
      .match(/\b[a-z][a-z0-9-]{3,}\b/g) ?? [])
      .filter((term) => !stopwords.has(term))
  );
}

function overlapRatio(leftTerms, rightTerms) {
  if (leftTerms.size === 0 || rightTerms.size === 0) return 0;
  const intersection = [...leftTerms].filter((term) => rightTerms.has(term)).length;
  return intersection / Math.min(leftTerms.size, rightTerms.size);
}

function countOccurrences(text, regex) {
  return text.match(regex)?.length ?? 0;
}

function countSectionEntries(sectionText, tagNames) {
  return tagNames.reduce((count, tagName) => count + countOccurrences(sectionText, new RegExp(`<${tagName}(\\s|>)`, 'gi')), 0);
}

function clampScore(score) {
  return Math.max(1, Math.min(10, Math.round(score)));
}

function buildMetric(id, label, score, reason, improvement, evidence = []) {
  return {
    id,
    label,
    score: clampScore(score),
    reason,
    improvement,
    evidence,
  };
}

function summarizeQualityOutcome(overallScore) {
  if (overallScore >= 8.5) return 'production_grade';
  if (overallScore >= 7) return 'good_with_minor_caveats';
  if (overallScore >= 5.5) return 'usable_but_needs_refinement';
  return 'needs_major_improvement';
}

function buildQualityRubric({
  skillText,
  parsed,
  checks,
  lint,
  bodyWordCount,
  sectionWordCounts,
  overlapSignals,
}) {
  const body = parsed.body.trim();
  const whenToUseText = extractSectionText(body, 'when_to_use');
  const whenNotToUseText = extractSectionText(body, 'when_not_to_use');
  const workflowText = extractSectionText(body, 'workflow');
  const outputText = extractSectionText(body, 'output_requirements');
  const validationText = extractSectionText(body, 'validation');
  const purposeText = extractSectionText(body, 'purpose');
  const inputsText = extractSectionText(body, 'input_requirements');

  const whenToUseItems = countSectionEntries(whenToUseText, ['item']);
  const whenNotToUseItems = countSectionEntries(whenNotToUseText, ['item']);
  const workflowSteps = countSectionEntries(workflowText, ['step']);
  const outputRequirements = countSectionEntries(outputText, ['requirement', 'item']);
  const validationItems = countSectionEntries(validationText, ['item', 'requirement']);
  const repeatedQualifierCount = countOccurrences(
    `${parsed.description} ${body}`,
    /\b(practical|concrete|project-specific|actionable|explicit|specific)\b/gi,
  );
  const broadWording = /\b(help|handle|work with|manage|various|generic|different kinds of|anything related)\b/i.test(
    `${parsed.description} ${body}`,
  );
  const projectSignals = countOccurrences(
    skillText,
    /ai-docs\/|`[^`\n]*\/[^`\n]*`|`[^`\n]*\.(md|json|yaml|yml|ts|js|py|sh)`|\b(project-specific|repo|repository|artifact|package|workflow|environment|tool|process|path|command)\b/gi,
  );
  const gotchaSignals = countOccurrences(body, /\b(gotcha|warning|warnings|caution|pitfall|failure|constraint)\b/gi);
  const lineCount = skillText.split(/\r?\n/).length;
  const highOverlap = overlapSignals.some((value) => value >= 0.45);
  const referenceSignals = /references\/|scripts\/|assets\//.test(skillText);

  const metrics = [];

  const scopePenalties = (broadWording ? 2 : 0) + (bodyWordCount > 360 ? 2 : bodyWordCount > 260 ? 1 : 0) + (highOverlap ? 2 : 0);
  metrics.push(buildMetric(
    'scope_coherence',
    'Scope Coherence',
    10 - scopePenalties,
    scopePenalties > 0
      ? 'The skill still shows signs of breadth or overlap that can blur its single responsibility.'
      : 'The skill stays focused on one coherent job without obvious responsibility creep.',
    'Keep the skill narrowly centered on one job and remove any adjacent responsibilities that can live elsewhere.',
    [
      broadWording ? 'Broad helper wording appears in the metadata or body.' : null,
      bodyWordCount > 260 ? `Body length is ${bodyWordCount} words.` : null,
      highOverlap ? 'Section overlap suggests multiple sections restate the same concern.' : null,
    ].filter(Boolean),
  ));

  const specializedValueScore = 3 + (projectSignals >= 3 ? 4 : projectSignals >= 1 ? 2 : 0) + (gotchaSignals > 0 ? 2 : 0) + (checks.inputs ? 1 : 0);
  metrics.push(buildMetric(
    'specialized_value',
    'Specialized Value',
    specializedValueScore,
    specializedValueScore >= 8
      ? 'The skill contains concrete project-facing signals instead of relying only on generic advice.'
      : 'The skill still reads somewhat generic and could use more concrete project, artifact, or failure-mode detail.',
    'Add concrete project conventions, artifacts, failure modes, or terminology that the base model would not reliably infer.',
    [
      projectSignals > 0 ? `${projectSignals} concrete project/artifact signals detected.` : 'Few concrete project or artifact signals detected.',
      gotchaSignals > 0 ? `${gotchaSignals} gotcha/warning signals detected.` : null,
    ].filter(Boolean),
  ));

  const triggerPrecisionScore = 2 + (checks.whenToUse ? 3 : 0) + (lint.checks.find((item) => item.id === 'L2')?.pass ? 2 : 0) + (parsed.description.length >= 40 && parsed.description.length <= 180 ? 2 : 0) - (broadWording ? 2 : 0) - (sectionWordCounts.when_to_use > 90 ? 1 : 0);
  metrics.push(buildMetric(
    'trigger_precision',
    'Trigger Precision',
    triggerPrecisionScore,
    triggerPrecisionScore >= 8
      ? 'The skill gives a strong signal for when it should load.'
      : 'Trigger guidance is present but still leaves room for over-triggering or interpretive drift.',
    'Tighten the trigger language so the intended request shape is obvious and near-miss scenarios are easier to reject.',
    [
      checks.whenToUse ? `${whenToUseItems} trigger items present.` : 'No explicit when_to_use section.',
      broadWording ? 'Broad wording weakens trigger precision.' : null,
    ].filter(Boolean),
  ));

  const nonTriggerPrecisionScore = 2 + (checks.whenNotToUse ? 4 : 0) + (whenNotToUseItems >= 2 ? 2 : 0) + (whenNotToUseItems >= 4 ? 1 : 0) - (sectionWordCounts.when_not_to_use > 90 ? 1 : 0);
  metrics.push(buildMetric(
    'non_trigger_precision',
    'Non-Trigger Precision',
    nonTriggerPrecisionScore,
    nonTriggerPrecisionScore >= 8
      ? 'The skill makes its exclusion boundaries explicit.'
      : 'Non-trigger boundaries exist but could still be sharper or more complete.',
    'Add or refine near-miss exclusions so competing skills and non-skill scenarios are easier to separate.',
    [
      checks.whenNotToUse ? `${whenNotToUseItems} exclusion items present.` : 'No explicit when_not_to_use section.',
    ],
  ));

  const descriptionQualityScore = 2 + (lint.checks.find((item) => item.id === 'L2')?.pass ? 3 : 0) + (parsed.description.length >= 40 && parsed.description.length <= 180 ? 2 : 0) + (/^use when\b/i.test(parsed.description) ? 1 : 0) - (broadWording ? 2 : 0);
  metrics.push(buildMetric(
    'description_quality',
    'Description Quality',
    descriptionQualityScore,
    descriptionQualityScore >= 8
      ? 'The description is specific, trigger-oriented, and reasonably calibrated in length.'
      : 'The description needs sharper trigger wording or tighter calibration.',
    'Rewrite the description as a concise trigger statement that distinguishes this skill from nearby ones.',
    [
      `Description length: ${parsed.description.length}.`,
      /^use when\b/i.test(parsed.description) ? 'Description uses trigger-oriented phrasing.' : 'Description does not start with a clear trigger phrase.',
    ],
  ));

  const completenessScore = ((checks.whenToUse ? 1 : 0) + (checks.whenNotToUse ? 1 : 0) + (checks.inputs ? 1 : 0) + (checks.workflow ? 1 : 0) + (checks.outputs ? 1 : 0) + (checks.validation ? 1 : 0)) / 6 * 10;
  metrics.push(buildMetric(
    'behavioral_completeness',
    'Behavioral Completeness',
    completenessScore,
    completenessScore >= 8
      ? 'The main behavioral contract is covered end to end.'
      : 'Important parts of the behavioral contract are still missing or underdefined.',
    'Make sure trigger conditions, exclusions, inputs, workflow, outputs, and validation all exist and agree with each other.',
    [
      `${Object.values(checks).filter(Boolean).length}/6 core structural areas are present.`,
    ],
  ));

  const unambiguityScore = 4 + (checks.whenToUse ? 1 : 0) + (checks.whenNotToUse ? 1 : 0) + (checks.outputs ? 1 : 0) + (checks.validation ? 1 : 0) - (broadWording ? 2 : 0) - (highOverlap ? 2 : 0);
  metrics.push(buildMetric(
    'unambiguity',
    'Unambiguity',
    unambiguityScore,
    unambiguityScore >= 8
      ? 'The contract is direct enough that two readers should interpret it similarly.'
      : 'Some wording is still broad or repetitive enough to allow competing interpretations.',
    'Replace generic or overlapping phrases with one concrete interpretation of what the skill should do and reject.',
    [
      broadWording ? 'Broad helper wording remains.' : null,
      highOverlap ? 'Section overlap suggests interpretive blur.' : null,
    ].filter(Boolean),
  ));

  const workflowClarityScore = 2 + (checks.workflow ? 3 : 0) + (workflowSteps >= 3 ? 3 : workflowSteps >= 1 ? 1 : 0) + (sectionWordCounts.workflow > 0 && sectionWordCounts.workflow <= 100 ? 1 : 0);
  metrics.push(buildMetric(
    'workflow_clarity',
    'Workflow Clarity',
    workflowClarityScore,
    workflowClarityScore >= 8
      ? 'The workflow is explicit and easy to follow.'
      : 'The workflow exists but could be clearer, shorter, or more reusable.',
    'Express the method as a short reusable sequence with clear decision points and expected outcomes.',
    [
      checks.workflow ? `${workflowSteps} workflow steps present.` : 'No explicit workflow section.',
      sectionWordCounts.workflow ? `Workflow section length: ${sectionWordCounts.workflow} words.` : null,
    ].filter(Boolean),
  ));

  const outputContractScore = 2 + (checks.outputs ? 4 : 0) + (outputRequirements >= 2 ? 2 : outputRequirements === 1 ? 1 : 0) + (projectSignals >= 1 ? 1 : 0);
  metrics.push(buildMetric(
    'output_contract_quality',
    'Output Contract Quality',
    outputContractScore,
    outputContractScore >= 8
      ? 'The expected output is explicit enough to judge and test.'
      : 'The output contract exists but could be sharper about artifact shape, structure, or destination.',
    'Specify exactly what the agent must produce, how it should be structured, and where it belongs when relevant.',
    [
      checks.outputs ? `${outputRequirements} output requirements detected.` : 'No explicit output requirements section.',
    ],
  ));

  const validationStrengthScore = 1 + (checks.validation ? 5 : 0) + (validationItems >= 2 ? 2 : validationItems === 1 ? 1 : 0) + (/\b(check|verify|acceptable|success|must|reject)\b/i.test(validationText) ? 1 : 0);
  metrics.push(buildMetric(
    'validation_strength',
    'Validation Strength',
    validationStrengthScore,
    validationStrengthScore >= 8
      ? 'The skill explains how to tell whether the result is acceptable.'
      : 'Validation exists but could be more explicit about pass/fail expectations.',
    'Turn validation into concrete checks that clearly distinguish acceptable from weak output.',
    [
      checks.validation ? `${validationItems} validation items detected.` : 'No validation section detected.',
    ],
  ));

  const concisionScore = 10 - (parsed.description.length > 180 ? 2 : 0) - (bodyWordCount > 500 ? 4 : bodyWordCount > 360 ? 3 : bodyWordCount > 260 ? 1 : 0) - (repeatedQualifierCount > 8 ? 2 : repeatedQualifierCount > 4 ? 1 : 0);
  metrics.push(buildMetric(
    'concision',
    'Concision',
    concisionScore,
    concisionScore >= 8
      ? 'The wording is reasonably economical for the amount of signal it carries.'
      : 'The skill uses more words than necessary to convey its contract.',
    'Shorten repeated phrasing and merge near-synonyms until the contract reaches its shortest sufficient form.',
    [
      `Body length: ${bodyWordCount} words.`,
      repeatedQualifierCount > 0 ? `${repeatedQualifierCount} repeated qualifier hits detected.` : null,
    ].filter(Boolean),
  ));

  const nonRedundancyScore = 10 - (highOverlap ? 3 : 0) - (repeatedQualifierCount > 8 ? 3 : repeatedQualifierCount > 4 ? 1 : 0) - (bodyWordCount > 360 ? 2 : 0);
  metrics.push(buildMetric(
    'non_redundancy',
    'Non-Redundancy',
    nonRedundancyScore,
    nonRedundancyScore >= 8
      ? 'Adjacent sections mostly add distinct signal rather than paraphrasing one another.'
      : 'Several sections appear to restate similar ideas instead of adding new decision or execution signal.',
    'Remove repeated qualifiers and ensure each section contributes a distinct decision, workflow, boundary, or validation signal.',
    [
      highOverlap ? `Max overlap signal: ${Math.max(...overlapSignals).toFixed(2)}.` : null,
      repeatedQualifierCount > 0 ? `${repeatedQualifierCount} repeated qualifier hits detected.` : null,
    ].filter(Boolean),
  ));

  const progressiveDisclosureScore = 5 + (referenceSignals ? 2 : 0) + (lineCount <= 220 ? 2 : lineCount <= 500 ? 1 : -2) - (!referenceSignals && bodyWordCount > 360 ? 2 : 0);
  metrics.push(buildMetric(
    'progressive_disclosure',
    'Progressive Disclosure',
    progressiveDisclosureScore,
    progressiveDisclosureScore >= 8
      ? 'The core instructions stay compact enough, with room to offload heavier detail when needed.'
      : 'The skill may still be carrying too much detail in the main body instead of keeping the core contract lean.',
    'Keep the main skill focused on the behavioral contract and push heavier detail into references, scripts, or assets when justified.',
    [
      referenceSignals ? 'The skill references auxiliary resources or structured outputs.' : 'No explicit disclosure signals detected.',
      `Total lines: ${lineCount}.`,
    ],
  ));

  const reusabilityScore = 3 + (checks.workflow ? 3 : 0) + (checks.inputs ? 1 : 0) + (checks.outputs ? 1 : 0) + (/this request|current conversation|for the above/i.test(body) ? -2 : 1);
  metrics.push(buildMetric(
    'procedural_reusability',
    'Procedural Reusability',
    reusabilityScore,
    reusabilityScore >= 8
      ? 'The skill describes a reusable method rather than a one-off answer.'
      : 'The skill still needs clearer procedural framing to generalize reliably across similar requests.',
    'Describe the reusable method, required inputs, and expected outputs so the skill generalizes beyond one conversation.',
    [
      checks.workflow ? 'Workflow present.' : 'Workflow missing.',
      /this request|current conversation|for the above/i.test(body) ? 'One-off conversational wording detected.' : 'No obvious one-off wording detected.',
    ],
  ));

  const overallScore = Number(
    (metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length).toFixed(2)
  );

  return {
    overallScore,
    outcome: summarizeQualityOutcome(overallScore),
    metrics,
  };
}

export function buildStaticValidation(skillText, skillPath = null) {
  const parsed = parseSkillMarkdown(skillText);
  const lint = lintSkillText(skillText);
  const body = parsed.body.trim();

  const checks = {
    whenToUse: hasTag(body, 'when_to_use'),
    whenNotToUse: hasTag(body, 'when_not_to_use'),
    workflow: hasTag(body, 'workflow'),
    inputs: hasTag(body, 'input_requirements') || hasTag(body, 'inputs') || hasTag(body, 'preconditions'),
    outputs: hasTag(body, 'output_requirements') || hasTag(body, 'outputs'),
    validation: hasTag(body, 'validation') || hasTag(body, 'self_check'),
  };

  const findings = [];
  const recommendations = [];
  const followUpQuestions = [];
  const advisories = [];

  if (!checks.whenToUse) {
    findings.push('The skill does not make trigger conditions explicit.');
    recommendations.push('Add a `when_to_use` section with concrete trigger language.');
    followUpQuestions.push('Which user prompts or situations must trigger this skill?');
  }

  if (!checks.whenNotToUse) {
    findings.push('The skill does not make non-trigger boundaries explicit.');
    recommendations.push('Add a `when_not_to_use` section with near-miss cases and exclusions.');
    followUpQuestions.push('Which prompts should explicitly not load this skill?');
  }

  if (!checks.workflow) {
    findings.push('The skill does not describe an explicit workflow.');
    recommendations.push('Add a `workflow` section that explains the reusable method, not a one-off answer.');
    followUpQuestions.push('What exact sequence or decision logic should the skill follow?');
  }

  if (!checks.inputs) {
    findings.push('The skill does not describe required inputs or preconditions.');
    recommendations.push('Add `input_requirements` or `preconditions` so missing context can be detected early.');
    followUpQuestions.push('What information, files, or prerequisites must be available before the skill can run well?');
  }

  if (!checks.outputs) {
    findings.push('The skill does not define expected outputs clearly enough.');
    recommendations.push('Add `output_requirements` that describe artifact shape, file targets, or expected response form.');
    followUpQuestions.push('What output or artifact should the skill produce when it succeeds?');
  }

  if (!checks.validation) {
    findings.push('The skill does not state how success should be validated.');
    recommendations.push('Add a `validation` or `self_check` section with pass/fail expectations.');
    followUpQuestions.push('How should the agent know that the skill output is acceptable?');
  }

  if (parsed.description.length < 15) {
    findings.push('The description is so short that trigger intent is likely underspecified.');
    recommendations.push('Make the description specific enough to distinguish the skill from nearby skills.');
  }

  if (/\b(help|handle|work with|manage)\b/i.test(parsed.description) && parsed.description.length < 120) {
    findings.push('The description uses broad wording that may over-trigger.');
    recommendations.push('Prefer concrete trigger language over generic helper phrasing.');
  }

  const bodyWordCount = countWords(body);
  const sectionWordCounts = buildSectionWordCounts(body, [
    'purpose',
    'when_to_use',
    'input_requirements',
    'workflow',
    'output_requirements',
    'when_not_to_use',
    'validation',
  ]);
  if (parsed.description.length > 180) {
    advisories.push('The description is fairly long. Check whether it can be shortened without losing trigger precision.');
  }

  if (bodyWordCount > 360) {
    advisories.push(`The skill body is quite long (${bodyWordCount} words). Try to shorten or merge repeated statements before accepting it as final.`);
  } else if (bodyWordCount > 260) {
    advisories.push('The skill body is fairly long. Check whether any repeated wording can be removed while preserving behavior.');
  }

  if (sectionWordCounts.when_to_use > 90) {
    advisories.push('The `when_to_use` section is long. Check whether the trigger criteria can be expressed with fewer near-synonyms.');
  }

  if (sectionWordCounts.when_not_to_use > 90) {
    advisories.push('The `when_not_to_use` section is long. Check whether the exclusion list can be merged into fewer stronger boundaries.');
  }

  if (sectionWordCounts.validation > 70) {
    advisories.push('The `validation` section is fairly long. Check whether it is repeating signals already covered by `when_to_use` or `output_requirements`.');
  }

  const purposeTerms = normalizedSectionTerms(extractSectionText(body, 'purpose'));
  const whenToUseTerms = normalizedSectionTerms(extractSectionText(body, 'when_to_use'));
  const outputTerms = normalizedSectionTerms(extractSectionText(body, 'output_requirements'));
  const validationTerms = normalizedSectionTerms(extractSectionText(body, 'validation'));
  const overlapSignals = [
    overlapRatio(purposeTerms, whenToUseTerms),
    overlapRatio(purposeTerms, outputTerms),
    overlapRatio(whenToUseTerms, validationTerms),
    overlapRatio(outputTerms, validationTerms),
  ];
  if (overlapSignals.some((value) => value >= 0.45)) {
    advisories.push('Some sections appear semantically repetitive. Check whether adjacent sections can be deduplicated.');
  }

  if (!lint.pass) {
    findings.push(...lint.failedRules.map((rule) => `${rule.id}: ${rule.reason}`));
  }

  const status = lint.pass && findings.length === 0 ? 'PASS' : 'NEEDS_IMPROVEMENT';
  const qualityRubric = buildQualityRubric({
    skillText,
    parsed,
    checks,
    lint,
    bodyWordCount,
    sectionWordCounts,
    overlapSignals,
  });

  return {
    skill: {
      path: skillPath ? path.resolve(skillPath) : null,
      name: parsed.name,
      nameLength: parsed.name.length,
      description: parsed.description,
      descriptionLength: parsed.description.length,
    },
    status,
    lint,
    structure: checks,
    findings,
    recommendations: Array.from(new Set(recommendations)),
    followUpQuestions: Array.from(new Set(followUpQuestions)),
    advisories: Array.from(new Set(advisories)),
    qualityRubric,
    metrics: {
      descriptionLength: parsed.description.length,
      bodyWordCount,
      sectionWordCounts,
    },
  };
}

export function renderStaticValidationMarkdown(report) {
  const lines = [
    `# Skill Validation: ${report.skill.name}`,
    '',
    `- Path: ${report.skill.path ?? '(unspecified)'}`,
    `- Status: ${report.status}`,
    `- Name length: ${report.skill.nameLength}`,
    `- Description length: ${report.skill.descriptionLength}`,
    `- Lint score: ${report.lint.score.toFixed(3)}`,
    `- Quality rubric score: ${report.qualityRubric.overallScore.toFixed(2)}/10`,
    `- Quality rubric outcome: ${report.qualityRubric.outcome}`,
    '',
    '## Structural checklist',
    '',
    renderChecklistItem(report.structure.whenToUse, 'Explicit trigger conditions'),
    renderChecklistItem(report.structure.whenNotToUse, 'Explicit non-trigger boundaries'),
    renderChecklistItem(report.structure.inputs, 'Inputs or preconditions'),
    renderChecklistItem(report.structure.workflow, 'Workflow or decision logic'),
    renderChecklistItem(report.structure.outputs, 'Output requirements'),
    renderChecklistItem(report.structure.validation, 'Validation or self-check'),
    '',
  ];

  if (report.findings.length > 0) {
    lines.push('## Findings', '');
    for (const finding of report.findings) {
      lines.push(`- ${finding}`);
    }
    lines.push('');
  }

  if (report.recommendations.length > 0) {
    lines.push('## Recommendations', '');
    for (const recommendation of report.recommendations) {
      lines.push(`- ${recommendation}`);
    }
    lines.push('');
  }

  if ((report.advisories?.length ?? 0) > 0) {
    lines.push('## Advisories', '');
    for (const advisory of report.advisories) {
      lines.push(`- ${advisory}`);
    }
    lines.push('');
  }

  if ((report.qualityRubric?.metrics?.length ?? 0) > 0) {
    lines.push('## Quality Rubric', '');
    for (const metric of report.qualityRubric.metrics) {
      lines.push(`- ${metric.label}: ${metric.score}/10`);
      lines.push(`  Reason: ${metric.reason}`);
      lines.push(`  Improvement: ${metric.improvement}`);
    }
    lines.push('');
  }

  if (report.followUpQuestions.length > 0) {
    lines.push('## Follow-up Questions', '');
    for (const question of report.followUpQuestions) {
      lines.push(`- ${question}`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function renderHelp() {
  return `Usage:
  node validate-skill.mjs --skill <skill-dir-or-SKILL.md> [--out report.json] [--markdown-out report.md]
  node validate-skill.mjs --text-file <draft-skill.md> [--path-label <display-path>] [--out report.json] [--markdown-out report.md]
  node validate-skill.mjs --stdin [--path-label <display-path>] [--out report.json] [--markdown-out report.md]

Validate an existing skill file or a proposed draft skill without modifying the source file.

Options:
  --skill <path>         Validate a skill directory or SKILL.md file on disk
  --text-file <path>     Validate raw skill markdown from a file
  --stdin                Read raw skill markdown from stdin
  --path-label <value>   Label to show in the report when validating draft text
  --out <path>           Write JSON report to this file
  --markdown-out <path>  Write Markdown summary to this file
  --help                 Show this help message
`;
}

async function readStdinText() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === 'string' ? chunk : chunk.toString('utf8'));
  }
  return chunks.join('');
}

async function main() {
  const { flags, positionals } = parseCliArgs(process.argv.slice(2));
  if (getFlag(flags, '--help', 'false') === 'true') {
    process.stdout.write(renderHelp());
    return;
  }

  const target = getFlag(flags, '--skill', positionals[0]);
  const textFile = getFlag(flags, '--text-file');
  const readFromStdin = getFlag(flags, '--stdin', 'false') === 'true';
  const pathLabel = getFlag(flags, '--path-label');
  const outputPath = getFlag(flags, '--out');
  const markdownPath = getFlag(flags, '--markdown-out');

  const modesUsed = [Boolean(target), Boolean(textFile), readFromStdin].filter(Boolean).length;
  if (modesUsed !== 1) {
    throw new Error('Choose exactly one input mode: --skill, --text-file, or --stdin. Use --help for details.');
  }

  let skillText = '';
  let reportPath = null;

  if (target) {
    const entry = resolveSkillEntry(target);
    skillText = await fs.readFile(entry.skillFile, 'utf8');
    reportPath = entry.skillFile;
  } else if (textFile) {
    const resolved = path.resolve(textFile);
    skillText = await fs.readFile(resolved, 'utf8');
    reportPath = pathLabel ?? resolved;
  } else {
    skillText = await readStdinText();
    reportPath = pathLabel ?? '(stdin draft)';
  }

  if (skillText.trim().length === 0) {
    throw new Error('No skill text was provided. Pass --skill, --text-file, or non-empty stdin.');
  }

  const report = buildStaticValidation(skillText, reportPath);

  if (outputPath) {
    await writeJsonFile(outputPath, report);
  }

  const markdown = renderStaticValidationMarkdown(report);
  if (markdownPath) {
    await writeTextFile(markdownPath, markdown);
  }

  if (!outputPath && !markdownPath) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else if (!outputPath) {
    process.stdout.write(markdown);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((error) => {
    process.stderr.write(`validate-skill failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
