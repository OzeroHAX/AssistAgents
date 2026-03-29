---
name: skill-authoring
description: Use when creating, revising, or stress-testing OpenCode skills, including trigger tuning, content eval loops, analyzer/refiner passes, and decisions about whether a file should remain a standalone skill
---

<purpose>
  <item>Author skills as reusable behavioral contracts, not topic summaries.</item>
  <item>Drive iterative skill improvement through evaluation, diagnosis, refinement, and reruns.</item>
  <item>Keep the orchestration brief; load detailed rules, schemas, and scoring from references only when needed.</item>
</purpose>

<when_to_use>
  <item importance="critical">Creating a new skill from requirements, examples, or an observed workflow.</item>
  <item importance="critical">Modifying an existing skill that under-triggers, over-triggers, or produces weak behavior.</item>
  <item importance="high">Running a quality loop for a skill body, description, or eval set.</item>
  <item importance="high">Deciding whether an artifact should stay a skill, split into multiple skills, or be downgraded into references/assets/scripts.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use this skill to execute the runtime task that another skill should handle.</item>
  <item importance="critical">Do not treat this skill as a generic writing assistant for arbitrary markdown files.</item>
</when_not_to_use>

<core_principles>
  <rule importance="critical">Interview first. Weak requirements create weak skills.</rule>
  <rule importance="critical">Separate execution, judging, diagnosis, and refinement into distinct passes.</rule>
  <rule importance="critical">When running directly inside OpenCode, the current session may perform analyzer/refiner passes; separate subprocess LLM commands are an optional automation layer, not the only valid workflow.</rule>
  <rule importance="critical">Run baseline comparisons whenever a measurable baseline exists.</rule>
  <rule importance="critical">Prefer concise orchestration here and progressive disclosure through references and scripts.</rule>
  <rule importance="critical">Keep all skill metadata and body text in English.</rule>
  <rule importance="critical">Keep repository skills in YAML frontmatter plus XML-like body format.</rule>
</core_principles>

<loading_sequence>
  <step order="1">Read `references/authoring-rules.md` before drafting or judging any skill.</step>
  <step order="1.1">Read `shared-docs-paths` and treat `ai-docs/skill-authoring/**` as the default persistent workspace for this skill.</step>
  <step order="1.2">When the target skill lives under `.opencode/skills/**` in a real project, read `references/project-skills-guide.md` before building evals or starting a refinement loop.</step>
  <step order="2">Read `references/eval-format.md` before creating content eval cases.</step>
  <step order="3">Read `references/trigger-eval-format.md` before tuning or benchmarking `description` triggering.</step>
  <step order="4">Read `references/scoring-model.md` before deciding pass/fail or stop conditions.</step>
  <step order="5">Load `references/analyzer-contract.md` and `references/refiner-contract.md` only when running diagnosis or rewrite passes.</step>
</loading_sequence>

<workflow>
  <phase name="capture_intent">
    <step>Extract as much context as possible from the current conversation before asking new questions.</step>
    <step>Ask for missing inputs: target behavior, trigger contexts, non-trigger contexts, expected outputs, failure modes, dependencies, and concrete examples.</step>
    <step>Be persistent when the request is underspecified. It is better to delay drafting than to encode invalid assumptions.</step>
  </phase>
  <phase name="draft_skill">
    <step>Draft or revise the skill body using repository-standard XML-like sections.</step>
    <step>Keep `SKILL.md` focused on workflow and decision logic; move detailed rules, examples, and schemas into references when the body becomes too heavy.</step>
    <step>Add bundled scripts only when deterministic behavior or repeated helper logic justifies them.</step>
  </phase>
  <phase name="build_eval_sets">
    <step>Create or update a content eval set for the skill body when the behavior is objectively testable.</step>
    <step>Create or update a trigger eval set for the frontmatter `description` when trigger quality matters.</step>
    <step>Persist eval assets, run summaries, diagnoses, and diffs under `ai-docs/skill-authoring/**` rather than temporary directories.</step>
    <step>Use realistic prompts, ambiguous edge cases, and near-miss negatives.</step>
  </phase>
  <phase name="run_content_loop">
    <step>Run executor pass for the candidate skill and for a baseline (`without_skill` or `old_skill`) when the comparison is meaningful.</step>
    <step>Run judge pass for routing, assertions, expected artifacts, and skill lint.</step>
    <step>Run analyzer pass and store a structured diagnosis. In direct OpenCode usage, the active session may perform this pass and persist the result; scripted subprocesses are optional.</step>
    <step>Run refiner pass and produce the next candidate skill. In direct OpenCode usage, the active session may perform this pass and persist the updated skill plus diff.</step>
    <step>If trigger eval data exists, run a separate description loop and apply the best description to the refined candidate before the next content iteration.</step>
  </phase>
  <phase name="run_trigger_loop">
    <step>Evaluate `description` with positive and negative trigger queries.</step>
    <step>Split evals into train and held-out test sets when enough queries exist.</step>
    <step>Use a separate LLM session to propose a new `description` based on failed triggers and false triggers.</step>
    <step>Select the best description by held-out performance when test data exists.</step>
  </phase>
  <phase name="finalize">
    <step>Summarize score evolution, key changes, remaining risks, and stop reason in a compact timeline artifact.</step>
    <step>State explicitly whether the result is production-grade, acceptable with caveats, or rejected.</step>
  </phase>
</workflow>

<script_usage>
  <rule importance="critical">Prefer the bundled scripts under `scripts/` over ad-hoc reinvention when running eval loops.</rule>
  <rule importance="high">For direct OpenCode runs, use `scripts/content/run-iteration.mjs` and `scripts/trigger/run-trigger-eval.mjs` as deterministic helpers, then let the current session inspect outputs and refine the skill.</rule>
  <rule importance="high">Use `scripts/content/run-loop.mjs` when you explicitly want a fully scripted loop.</rule>
  <rule importance="high">Use `scripts/trigger/run-trigger-loop.mjs` for description optimization when repeated trigger checks are needed.</rule>
  <rule importance="high">Use `scripts/content/analyze-results.mjs` and `scripts/content/refine-skill.mjs` as separate diagnosis and rewrite stages.</rule>
</script_usage>

<stop_conditions>
  <item>Stop when the configured score threshold is reached.</item>
  <item>Stop when two consecutive iterations fail to produce meaningful improvement.</item>
  <item>Stop when the configured iteration cap is reached.</item>
  <item>If quality remains insufficient, preserve the best candidate and explicitly record unresolved issues.</item>
</stop_conditions>

<output_requirements>
  <requirement>Produce or update the skill, its eval assets, and run artifacts rather than only discussing them abstractly.</requirement>
  <requirement>Default persistent workspace: `ai-docs/skill-authoring/workspaces/<skill-or-request-slug>/`.</requirement>
  <requirement>Default run artifacts path: `ai-docs/skill-authoring/runs/<run-id>/`.</requirement>
  <requirement>Keep a readable timeline of iterations so a human can see what changed and why.</requirement>
  <requirement>When using separate analyzer/refiner sessions, save their prompts and outputs as artifacts when practical.</requirement>
  <requirement>State whether the skill should remain standalone, split, or be converted into supporting resources.</requirement>
</output_requirements>
