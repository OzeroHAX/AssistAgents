---
name: skill-authoring
description: Use when creating, validating, or revising OpenCode skills, including interactive requirement gathering, preview-based edits, static validation, and isolated terminal eval reports
---

<purpose>
  <item>Author skills as reusable behavioral contracts, not topic summaries.</item>
  <item>Keep interactive authoring inside the current OpenCode session so the skill can inspect real project context without spawning nested sessions.</item>
  <item>Use isolated runtime checks only through separate terminal scripts that produce reports and recommendations without modifying the source skill.</item>
  <item>Keep the orchestration brief; load detailed rules, schemas, checklists, and scoring from references only when needed.</item>
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
  <rule importance="critical">Distinguish between goal-driven requests and strict instruction-driven requests before proposing changes.</rule>
  <rule importance="critical">Do not trigger nested OpenCode sessions from an interactive OpenCode chat when creating, editing, or validating a skill.</rule>
  <rule importance="critical">Use isolated runtime checks only through external terminal scripts, not through an in-chat self-spawned loop.</rule>
  <rule importance="critical">If terminal-only validation or benchmark commands are relevant, present them as manual commands for the user to run in a separate terminal. Do not try to execute them from the interactive chat flow.</rule>
  <rule importance="critical">Prefer concise orchestration here and progressive disclosure through references and scripts.</rule>
  <rule importance="critical">Decide the form of knowledge deliberately: keep only the core behavioral contract in `SKILL.md`, add `references/` only for stable on-demand knowledge, prefer project files for project-specific truth, prefer external docs on demand for broad ecosystems, and prefer `scripts/` for deterministic logic.</rule>
  <rule importance="critical">Do not use ad-hoc Python or shell one-liners to read reference markdown, dump file contents, or emulate validation logic when native file-reading tools and bundled scripts already cover the task.</rule>
  <rule importance="critical">Prefer the shortest sufficient wording in drafted skills. Remove repetition unless a repeated idea adds distinct routing, execution, or validation signal.</rule>
  <rule importance="critical">Do not create `references/` just because the user mentioned best practices, standards, or documentation. Create them only when they add reusable, stable, and repeatedly needed on-demand value.</rule>
  <rule importance="critical">Do not stop at structural pass/fail. Also optimize the skill against the quality rubric in `references/scoring-model.md`, especially clarity, narrow scope, precision, concision, and non-redundancy.</rule>
  <rule importance="critical">Communicate with the user in the active session language, but keep all resulting skill metadata and body text in English.</rule>
  <rule importance="critical">All user-facing inferred summaries, clarifying questions, findings, rationale, and approval prompts must use the active session language from `shared-base-rules`. Keep only the target skill content and exact diff text in English when needed.</rule>
  <rule importance="critical">Keep all skill metadata and body text in English.</rule>
  <rule importance="critical">Keep repository skills in YAML frontmatter plus XML-like body format.</rule>
  <rule importance="critical">For interactive create/improve flows, do not modify the target skill until the user has seen a proposed diff and confirmed it.</rule>
  <rule importance="critical">For interactive create/improve flows, keep the target skill read-only before approval. Pre-approval writes are allowed only under `ai-docs/skill-authoring/interactive-runs/**` for history, draft validation, and proposed test artifacts.</rule>
  <rule importance="critical">A diff counts as shown only when it appears in a user-visible chat message. Hidden reasoning, internal notes, or a bare confirmation question do not satisfy the preview requirement.</rule>
</core_principles>

<loading_sequence>
  <step order="1">Read `references/authoring-rules.md` before drafting or judging any skill.</step>
  <step order="1.1">Read `references/runtime-modes.md` before deciding whether the task is interactive authoring/validation or isolated terminal benchmarking.</step>
  <step order="1.2">Read `references/interactive-checklist.md` before creating, changing, or validating a skill from the current chat.</step>
  <step order="1.3">Read `references/interactive-run-history.md` before finalizing an interactive edit or check flow.</step>
  <step order="2">Read `references/scoring-model.md` before interpreting static validation or isolated eval scores.</step>
  <step order="3">When this skill needs its own bundled references or scripts, prefer the installed `skill-authoring` directory that was loaded into the session. Use repository-local copies only as a fallback when the installed path is unavailable.</step>
  <step order="4">When an interactive run id must be created inside the chat, use the UTC timestamp shape from `date -u +%Y%m%dT%H%M%SZ` and append `-<action>-<skill-slug>`.</step>
</loading_sequence>

<input_requirements>
  <required>The user request, including whether the task is `create`, `check`, `improve`, or `review`, and the target skill path or name when available.</required>
  <required>The active session language and baseline interaction rules from `shared-base-rules`.</required>
  <required>The current skill contents or enough repository context to inspect the target skill honestly.</required>
  <optional>Examples, trigger phrases, expected outputs, failure modes, project files, or reusable references that constrain the intended behavior.</optional>
  <optional>The requested execution path, such as `full` or explicit `quick` mode, plus any approval or persistence constraints.</optional>
</input_requirements>

<workflow>
  <phase name="capture_intent">
    <step>Extract as much context as possible from the current conversation before asking new questions.</step>
    <step>Classify the request as either `goal_driven` or `instruction_driven`.</step>
    <step>Also classify the execution path as either `full` or `quick`. Use `quick` only when the user explicitly asks to skip validation, testing, scoring, or the usual authoring cycle.</step>
    <step>Classify the dominant knowledge form needed by the skill: `inline_contract`, `local_references`, `project_references`, `external_on_demand`, or `deterministic_scripts`.</step>
    <step>Decide which meaning source is authoritative for this run: `explicit_intended_meaning`, `partial_intended_meaning`, or `no_external_meaning`.</step>
    <step>For `goal_driven`, optimize the skill in the best defensible way that satisfies the stated intent.</step>
    <step>For `instruction_driven`, apply the requested change narrowly and do not broaden scope without explicit approval.</step>
    <step>If the user already supplied a clear intended meaning for `check` or `improve`, treat that intended meaning as authoritative for this run and skip inferred-summary confirmation.</step>
    <step>If the user supplied only partial intended meaning, ask a small number of focused clarification questions first instead of jumping straight to inferred-summary confirmation.</step>
    <step>Only when there is still no reliable external meaning after that, infer a short comprehensive summary from the current skill contents before doing deeper evaluation.</step>
    <step>Show that inferred summary to the user in the active session language and ask whether it matches the intended meaning of the skill only in the `no_external_meaning` path.</step>
    <step>For this confirmation step, use one compact visible prompt only. Do not include the wider plan, step statuses, file lists, validation results, run-history paths, rubric scores, or proposal notes.</step>
    <step>Name the target skill explicitly in that confirmation prompt so the user can see which skill is being interpreted.</step>
    <step>The inferred summary confirmation must always include the actual inferred meaning in the same visible prompt. Never ask "did I understand correctly?" without showing the summary itself.</step>
    <step>Use a question dialog or UI prompt for this step by default when it can display the summary and the response options together.</step>
    <step>Fall back to one short plain-text chat question only when the available question UI truly cannot show the summary itself in the same prompt.</step>
    <step>When using a question dialog for inferred-summary confirmation, keep it to one prompt with a short header, the target skill name, the inferred summary, and exactly three outcomes: confirm, correct, or stop.</step>
    <step>Keep the inferred summary compact by default: usually one short paragraph or a small bullet list focused only on the current meaning, trigger boundary, non-trigger boundary, and expected result. Do not omit important meaning just to satisfy a rigid size target.</step>
    <step>Offer only three outcomes at this step: confirm, correct, or stop. Do not begin scoring, critique, or proposal generation until the user has confirmed or corrected the inferred summary.</step>
    <step>If the user corrects the inferred summary, treat that mismatch as important evidence that the skill currently communicates its purpose poorly or ambiguously.</step>
    <step>When explicit intended meaning is present, use the current skill text only for gap analysis and findings. Do not ask the user to confirm the current inferred meaning again.</step>
    <step>Ask for missing inputs: target behavior, trigger contexts, non-trigger contexts, expected outputs, failure modes, dependencies, concrete examples, and reusable project references.</step>
    <step>Be persistent when the request is underspecified. It is better to delay drafting than to encode invalid assumptions.</step>
    <step>If the user-provided requirements conflict with skill rules, explain the conflict and ask for a corrected decision instead of silently encoding an invalid skill.</step>
  </phase>
  <phase name="interactive_create_or_improve">
    <step>Treat `create`, `improve`, and interactive `check` as in-chat operations on the current repository context.</step>
    <step>If the execution path is `quick`, limit the work to target inspection, a compact proposal, preview, approval, and direct application.</step>
    <step>For create, default the target to `.opencode/skills/<skill-name>/SKILL.md` unless the user explicitly asked for another path.</step>
    <step>If `name` or `description` are missing, generate them in English after clarifying intent; if provided in another language, translate them into English.</step>
    <step>Require enough information to understand what the skill does, when it should trigger, when it must not trigger, what output it should produce, and what examples or project files anchor the behavior.</step>
    <step>Keep `SKILL.md` limited to the core behavioral contract: trigger, boundaries, inputs, workflow, outputs, and validation.</step>
    <step>Create `references/` only when the skill needs narrow, stable, repeatedly useful knowledge that should be loaded on demand rather than carried in `SKILL.md`.</step>
    <step>When the relevant knowledge is mainly project-specific, prefer project files and local conventions over generic packaged references.</step>
    <step>When the relevant knowledge is broad, variable, or ecosystem-wide, do not copy it into the skill; encode only the decision criteria and when to consult external sources.</step>
    <step>When the relevant logic is deterministic or repeatedly executed, prefer `scripts/` over longer prose or oversized references.</step>
    <step>Draft or revise the skill body using repository-standard XML-like sections.</step>
    <step>Keep `SKILL.md` focused on workflow and decision logic; add bundled scripts only when deterministic behavior or repeated helper logic justifies them.</step>
    <step>Once the draft is structurally valid, run one extra compression pass in memory: shorten wording, merge adjacent duplicates, and remove taxonomic restatements that do not improve routing or execution.</step>
    <step>Before any write, persist the detailed proposal package under the interactive run directory: change plan, draft skill, draft validation, proposed tests, and detailed rationale.</step>
    <step>Skip interactive run history, draft validation, and proposed tests entirely in `quick` mode unless the user explicitly asks to keep those artifacts.</step>
    <step>In the chat itself, keep the preview compact: summarize only the key findings in the active session language, list the files included in scope, point to the saved proposal artifacts, and show the exact diff or initial draft.</step>
    <step>Do not dump the full change plan, full rationale, and full test definitions into the chat if they are already written under the interactive run directory.</step>
    <step>Explain only the decisive reasons for each change in-chat, in the active session language: vague trigger criteria, weak boundaries, missing validation, over-broad description, unclear output contract, or other concrete defects.</step>
  </phase>
  <phase name="interactive_validation">
    <step>If the execution path is `quick`, skip this phase entirely.</step>
    <step>Use `scripts/content/validate-skill.mjs` as the deterministic validator for metadata, structure, and required sections.</step>
    <step>Use the validator directly with its standard invocation shapes instead of probing `--help` during normal runs.</step>
    <step>Standard source-skill invocation: `node "<installed-skill-authoring>/scripts/content/validate-skill.mjs" --skill "<target-skill-path>" --out "<validation-json-path>" --markdown-out "<validation-md-path>"`.</step>
    <step>When validating a proposed draft rather than the source file, use the validator's draft input modes (`--text-file` or `--stdin`) instead of ad-hoc `node -e` snippets.</step>
    <step>Standard draft-file invocation: `node "<installed-skill-authoring>/scripts/content/validate-skill.mjs" --text-file "<draft-file-path>" --path-label "<target-skill-path>" --out "<validation-json-path>" --markdown-out "<validation-md-path>"`.</step>
    <step>Standard stdin-draft invocation: `node "<installed-skill-authoring>/scripts/content/validate-skill.mjs" --stdin --path-label "<target-skill-path>" --out "<validation-json-path>" --markdown-out "<validation-md-path>"`.</step>
    <step>Use `--help` only as a fallback when the invocation contract is genuinely uncertain or the script behavior appears inconsistent with the known standard shapes.</step>
    <step>For reference reading and target inspection, prefer native file-reading, glob, and search tools. Do not fall back to ad-hoc `python -c` or shell dump commands unless the task truly requires a bundled Python script.</step>
    <step>Read the rubric metrics from `references/scoring-model.md` and score the skill qualitatively, not only structurally.</step>
    <step>For each rubric metric, capture a `1..10` score plus a short reason and improvement note in the report artifacts.</step>
    <step>When rubric scores are shown in chat or markdown artifacts, render them as a Markdown table with `Metric`, `Score`, `Reason`, and `Improvement` columns; prefer inline code formatting for scores and outcomes.</step>
    <step>Also verify that the knowledge is placed in the right form: core contract in `SKILL.md`, stable narrow detail in `references/`, project truth in project files, broad variable detail left to external on-demand lookup, and deterministic behavior in `scripts/`.</step>
    <step>After deterministic validation, ask follow-up questions guided by `references/interactive-checklist.md` to assess whether the skill is specific, reusable, and behaviorally valid.</step>
    <step>For interactive create or improve flows, do not run isolated runtime evals by default.</step>
    <step>If validation finds defects during create or improve, propose further improvements as diffs and keep the source unchanged until the user explicitly chooses `apply` in the final decision prompt.</step>
    <step>For interactive `check`, produce findings, weaknesses, and recommended improvements in the active session language, but keep any prepared fix non-applied until the user explicitly chooses `apply` in the final decision prompt.</step>
    <step>After a `check` preview has shown a non-applied proposal, do not append a second bridging question like "if you want, I can convert this into improve-flow". There is no separate continuation stage.</step>
    <step>If a non-applied `check` proposal is ready, move directly from the visible preview to the final decision prompt.</step>
    <step>After a non-applied `check` proposal, end the visible chat message cleanly. Do not append generic optional next-step offers such as extra compression passes, commit help, or benchmark suggestions unless the user explicitly requested those follow-ups.</step>
    <step>For interactive `check` without prior behavioral context, do not score or critique the skill until the user has confirmed or corrected the inferred summary of what the skill currently means.</step>
    <step>For interactive `check` or `improve` with explicit intended meaning, use that intended meaning as the evaluation baseline or target behavior directly.</step>
    <step>The summary-confirmation step is not a mini-report. Keep it isolated, compact, and limited to meaning confirmation only.</step>
    <step>When interactive `check` should also prepare a likely fix, produce a non-applied proposal package inside the current run directory: detailed rationale, exact diff, and any suggested trigger tests under `after/tests/`.</step>
    <step>For full interactive `check` or `improve` on a reusable skill, prepare trigger tests under `after/tests/` by default unless the user explicitly asked to skip them or there is a concrete reason trigger testing is not meaningful for that skill.</step>
    <step>If trigger tests are intentionally omitted from a full interactive proposal, state the reason explicitly in the saved artifacts and in the visible preview instead of silently dropping them.</step>
    <step>During an interactive `check`, do not write proposed trigger tests into the target skill's `<skill-dir>/assets/tests/` subtree before the final decision. Keep them only under the current run's prepared draft package until the user chooses `apply`.</step>
    <step>Use `after/**` as the single canonical prepared apply package for interactive proposals. Use `proposal/**` only for explanatory artifacts such as summary and visible diff.</step>
    <step>Read `references/trigger-eval-format.md` only when you are actually preparing or reviewing trigger tests for the prepared proposal package under `after/tests/` or for isolated trigger eval files under `<skill-dir>/assets/tests/`.</step>
    <step>As soon as interactive analysis begins, start an `ai-docs/skill-authoring/interactive-runs/<run-id>/` history and write the request, current skill snapshot, and before-validation artifacts there.</step>
    <step>Format interactive run ids as `<utc-timestamp>-<action>-<skill-slug>`, where `<utc-timestamp>` uses the UTC shape `YYYYMMDDTHHMMSSZ` and `<skill-slug>` is a short readable slug derived from the target skill.</step>
    <step>Do not create timestamp-only interactive run directories. Always include both the action and the skill slug.</step>
    <step>When the run id is generated inside the chat, prefer `date -u +%Y%m%dT%H%M%SZ` or an equivalent UTC timestamp generator instead of ad-hoc Python.</step>
    <step>Persist the inferred summary and any user correction under the interactive run history before continuing to full evaluation.</step>
    <step>Write the current proposed target state, preliminary static validation, and proposed tests into `after/` while the draft is being prepared, even before approval.</step>
    <step>Validate the prepared draft before approval and treat that result as the canonical static validation for the proposal package.</step>
    <step>Before presenting the proposal, improve obviously low rubric scores when this can be done without broadening scope or contradicting the user's instructions.</step>
    <step>If the proposal package includes supporting files such as trigger tests, keep the full file contents in the run artifacts. In chat, summarize those files by purpose and saved path unless the user explicitly asks to inspect their contents.</step>
  </phase>
  <phase name="isolated_terminal_eval">
    <step>Use isolated runtime checks only when the user explicitly wants a benchmark/report or when a terminal command is being run outside the current OpenCode chat.</step>
    <step>Store isolated benchmark trigger cases under `<skill-dir>/assets/tests/`, using top-level `trigger-evals.json`.</step>
    <step>Use `scripts/content/run-report.mjs` as the default isolated runner. It may create a suggested candidate inside the run directory, but it must never overwrite the source skill.</step>
    <step>In isolated report mode, run static validation plus trigger-only evaluation.</step>
    <step>Use `scripts/trigger/run-trigger-eval.mjs` only to debug one sub-step of the isolated benchmark.</step>
    <step>When isolated checks find problems, place diagnoses, scores, metrics, and any suggested corrected skill under the run directory and let the user decide whether to replace the source skill.</step>
  </phase>
  <phase name="finalize">
    <step>Before writing changes in an interactive chat flow, prepare the proposal package under the interactive run directory, then send a user-visible chat message containing a compact proposal summary in the active session language, a compact visible Markdown rubric table, plus the exact diff.</step>
    <step>For `check` previews, the visible rubric table must appear in the chat message itself, not only inside saved validation artifacts. Include at least overall score/outcome and the weakest metrics with short reasons.</step>
    <step>Do not collapse rubric quality into plain bullets only when a preview is already presenting validation results; keep the visible table and optionally add one short sentence after it.</step>
    <step>When showing a diff in chat, prefer a fenced `diff` code block and omit timestamp noise when it does not add decision value.</step>
    <step>Keep the diff fence language exactly `diff` and preserve raw `+` and `-` prefixes instead of converting the diff into prose or list items.</step>
    <step>Prefer canonical git-style unified diff headers in the visible preview: `diff --git a/<target-path> b/<target-path>`, then `--- a/<target-path>` and `+++ b/<target-path>`.</step>
    <step>Do not use the temporary prepared draft path under `ai-docs/skill-authoring/interactive-runs/**` as the `+++` header inside the visible diff. Keep the draft path only in the separate future apply route lines.</step>
    <step>In `quick` mode, the proposal package may remain entirely in-memory; preview-first approval still remains mandatory.</step>
    <step>For a non-applied `check` preview, the visible chat close should normally stop after the compact status and scope summary. Do not append a separate closing line like "changes are not applied" when that state is already implicit from the non-applied proposal.</step>
    <step>For a non-applied `check` preview, show the exact diff for the prepared skill draft in chat, but do not dump the full contents of supporting JSON test files unless the user explicitly asked for those contents.</step>
    <step>If supporting files such as trigger tests are part of the proposal package, label them in chat as future apply routes or files included in scope if applied. Do not present them as already-written target files.</step>
    <step>When a non-applied `check` proposal is ready, end the visible preview with the final decision prompt itself. Do not add a separate continuation instruction line or a second confirmation stage.</step>
    <step>For the final apply step, use a concrete plain-chat decision prompt rather than a generic yes/no question.</step>
    <step>Keep the final decision prompt short. It is a transfer confirmation, not a second review.</step>
    <step>Name the target skill explicitly in the final decision prompt.</step>
    <step>In full mode, state exactly which prepared draft is about to be applied and where it will go: from `ai-docs/skill-authoring/interactive-runs/<run-id>/after/target-skill.md` to the real target skill path.</step>
    <step>In quick mode, state exactly which target skill path will be updated even if no `after/` artifact exists.</step>
    <step>Do not repeat the detailed diff, long rationale, rubric scores, plan text, or full comparison in the final decision prompt. That information belongs to the earlier preview and saved artifacts.</step>
    <step>Ask the user to type exactly one of these outcomes in chat: `apply`, `reject`, or `revise: <extra instructions>`.</step>
    <step>When a `check` run has shown a non-applied proposal, show this final decision prompt in the same visible preview message instead of waiting for a separate continuation message.</step>
    <step>Do not introduce a second confirmation dialog or a separate `approve` step after the preview has already shown the final decision prompt.</step>
    <step>If the user types `apply` before the required final decision prompt has been shown for the current proposal, do not apply yet. First show the required final decision prompt, then wait for a fresh `apply`.</step>
    <step>During the pre-approval phase, do not modify the target skill path or `ai-docs/skill-authoring/test-runs/**`.</step>
    <step>If the proposal package includes multiple file changes, enumerate them explicitly. `apply` applies to all enumerated files unless the user narrows scope.</step>
    <step>Only after the user has explicitly chosen `apply` in response to the shown final decision prompt may you write the approved target skill change and any approved `assets/tests/**` files from the prepared proposal package.</step>
    <step>When approved tests are applied, copy the prepared trigger tests subtree as approved. Do not silently drop top-level `trigger-evals.json`.</step>
    <step>Interactive history must live under `ai-docs/skill-authoring/interactive-runs/<run-id>/` and test benchmark reports under `ai-docs/skill-authoring/test-runs/<run-id>/`.</step>
    <step>When the user revises, rejects, or applies a shown proposal, keep using the current run id and current interactive run directory. Do not start a fresh run id unless a genuinely new authoring run begins.</step>
    <step>After approval, update the interactive run record with approval scope, final target state, and final explanation.</step>
    <step>Do not rerun static validation after approval if the applied result exactly matches the already validated draft stored under `after/`. Reuse the draft validation artifacts instead.</step>
    <step>Rerun static validation after approval only if the applied content differs from the prepared draft that was validated earlier.</step>
    <step>Use the question tool or UI prompt only for meaning confirmation and narrow clarifications, not for the final apply decision after the preview.</step>
    <step>State explicitly whether the result is valid, valid with caveats, or rejected, and separate static validation findings from isolated benchmark findings.</step>
    <step>In `quick` mode, state explicitly that validation, scoring, and tests were skipped by request.</step>
  </phase>
</workflow>

<script_usage>
  <rule importance="critical">Prefer the bundled scripts under `scripts/` over ad-hoc reinvention for deterministic validation and isolated benchmarking.</rule>
  <rule importance="high">If no bundled script is needed, prefer native read/glob/search tools over ad-hoc Python or shell wrappers.</rule>
  <rule importance="high">Use `scripts/content/validate-skill.mjs` as the default deterministic validator in interactive mode.</rule>
  <rule importance="high">Use `scripts/content/run-report.mjs` as the default isolated benchmark/report runner from a terminal.</rule>
  <rule importance="high">In report mode, use trigger evals only.</rule>
  <rule importance="high">Use `scripts/trigger/run-trigger-eval.mjs` only as a low-level debug helper.</rule>
  <rule importance="high">Treat `run-trigger-loop.mjs` and automated refiner passes as internal/advanced tools, not the default workflow.</rule>
</script_usage>

<stop_conditions>
  <item>Interactive mode stops when the user has enough information to confirm, reject, or revise the proposed change.</item>
  <item>Static validation stops when all required checks pass or the remaining open questions have been surfaced clearly.</item>
  <item>Isolated benchmark mode stops after producing a report, any optional suggested candidate in the run directory, and a clear recommendation.</item>
</stop_conditions>

<validation>
  <item importance="critical">Use the active session language for inferred summaries, questions, findings, and rationale, while keeping resulting skill metadata and body text in English.</item>
  <item importance="critical">For interactive create or improve flows, show a user-visible preview before any target-skill write and wait for explicit approval.</item>
  <item importance="critical">Place knowledge in the right form: core contract in `SKILL.md`, narrow stable detail in `references/`, project truth in project files, broad variable detail in external on-demand lookups, and deterministic logic in `scripts/`.</item>
  <item importance="high">In `full` mode, persist interactive history, draft validation, and any proposed tests under `ai-docs/skill-authoring/**` from the start of analysis.</item>
  <item importance="high">In `quick` mode, state explicitly which checks, scoring, tests, or history artifacts were skipped by request.</item>
  <item importance="high">The final result must either improve or validate the target skill, or clearly explain why the skill remains ambiguous, weak, or blocked.</item>
</validation>

<output_requirements>
  <requirement>Interactive create/edit/check must work without nested OpenCode sessions.</requirement>
  <requirement>Interactive validation must explain what is weak, what is missing, and what additional information is required.</requirement>
  <requirement>Full interactive runs must persist a readable history under `ai-docs/skill-authoring/interactive-runs/<run-id>/` from the start of analysis.</requirement>
  <requirement>Explicit quick-edit requests may skip interactive run history, validation, scoring, and tests, but must still use preview-before-apply and explicit approval.</requirement>
  <requirement>Isolated benchmark trigger tests live under `<skill-dir>/assets/tests/`.</requirement>
  <requirement>Default isolated run artifacts path: `ai-docs/skill-authoring/test-runs/<run-id>/`.</requirement>
  <requirement>Suggested corrected skills produced by isolated benchmarking must be written only inside the run directory, never over the source skill.</requirement>
  <requirement>State whether the skill should remain standalone, split, or be converted into supporting resources.</requirement>
</output_requirements>
