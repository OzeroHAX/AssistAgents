# Interactive Validation Checklist

Use this checklist when creating, changing, or validating a skill from the current chat.

## Required questions for creation

- What job should the skill do?
- What exact kinds of user prompts should trigger it?
- What prompts should explicitly not trigger it?
- What output or artifact should success produce?
- What project files, examples, or conventions should the skill generalize from?
- What bad behavior is unacceptable?
- Does the user want to provide `name` and `description`, or should they be generated?

If any of these answers are missing or contradictory, ask follow-up questions before drafting.

## Required checks for editing

- Is the request a narrow instruction-driven change or a broader goal-driven change?
- Is the requested change valid under skill rules?
- Does the current skill already make trigger and non-trigger boundaries explicit?
- Does the skill define workflow, inputs, outputs, and validation clearly enough?
- Is the proposed change small enough to stay within the user-approved scope?

## Required checks for validation

- Did the user already provide a clear intended meaning for the skill in this run?
- If yes, was that intended meaning used directly instead of triggering inferred-summary confirmation?
- If the user provided only partial intended meaning, were narrow clarification questions used before falling back to inferred-summary confirmation?
- If the user did not explain the intended behavior, can you summarize the skill's current meaning from its own text in a short, comprehensive way?
- Has the user confirmed that inferred summary, or corrected it?
- Was that confirmation step shown as one compact prompt rather than a status report or mini-plan?
- Did that prompt explicitly name the target skill?
- Did the visible prompt include the inferred summary itself, rather than asking for confirmation without the interpretation?
- If the UI supports it, was that confirmation shown through the `question` dialog rather than plain chat text?
- Did the prompt avoid validation scores, file paths, run-history paths, and proposal details at this stage?
- If the user corrected it, does that indicate ambiguity, weak boundaries, or misleading wording in the current skill?
- Were native file-reading/search tools and bundled scripts used instead of ad-hoc Python or shell wrappers?
- When bundled `skill-authoring` references or scripts were needed, were they read from the installed skill directory first rather than falling back to repository-local copies unnecessarily?
- Does `name` satisfy naming rules?
- Does `description` satisfy length rules and stay trigger-oriented?
- Are `when_to_use` and `when_not_to_use` specific enough?
- Is the workflow reusable rather than one-off?
- Are outputs and success criteria explicit?
- Are there obvious false-positive or false-negative trigger risks?
- Can the text be shortened without losing trigger precision or execution clarity?
- Do `purpose`, `when_to_use`, `output_requirements`, and `validation` each add distinct information?
- Are any adjacent bullets effectively paraphrases that should be merged into one stronger sentence?
- Is the proposed contract close to the minimum wording that still preserves routing, execution, and validation signal?

If the user wants a repair proposal after validation, also prepare:

- the inferred-summary record and any user correction
- a rubric table with `1..10` scores, reasons, and improvements
- an exact non-applied diff
- detailed rationale for each suggested change
- any prepared trigger tests under `after/tests/`, to be mapped into `<skill-dir>/assets/tests/` only if the user later chooses `apply`
- for full interactive checks on reusable skills, trigger tests should be prepared by default unless there is an explicit reason to omit them
- a note about which findings are structural only and which need runtime benchmarking
- a clear list of which files would be changed if the user chooses `apply`
- a deterministic validation command for the proposed draft, using `validate-skill.mjs --text-file` or `--stdin`, not an ad-hoc inline eval
- direct standard validator invocations without a routine `--help` detour unless the command contract was genuinely unclear
- an interactive run id that follows `<utc-timestamp>-<action>-<skill-slug>` rather than a bare timestamp
- no extra chat bridge like "if you want, I can convert this into improve-flow" after a non-applied `check` proposal has already been shown
- no generic optional tail like "I can do one more compression pass" after a non-applied `check` proposal unless the user explicitly asked for that follow-up

## Preview contract

Before any write, show:

1. what will change
2. why each change is needed
3. the exact diff or initial draft
4. which files are included in the proposal package
5. which rubric metrics are currently weakest and why
6. the skill name plus the exact future apply route from the prepared draft to the target path
7. the final decision prompt should follow immediately after the preview rather than through a separate continuation step

Prefer rendering the visible diff as a fenced `diff` code block and omit timestamp noise when it does not help the user's decision.
For supporting files such as trigger-test JSON, summarize the file purpose and saved path instead of dumping the full file contents into chat unless the user explicitly asked to inspect them.
If target test files are part of scope, describe them as future apply routes or scope-if-applied, not as already-written target files.

Then wait for one of these outcomes:

- apply
- reject
- revise

Final apply prompt rules:

- keep it short;
- include the skill name;
- include the exact `from -> to` apply route;
- do not repeat the long diff, rationale, scores, or comparison there.
- keep the final decision in plain chat as the closing lines of the visible preview message.
- ask for exactly one of these chat responses: `apply`, `reject`, or `revise: <extra instructions>`.
- do not open a separate `question` dialog for the final apply step.
- do not treat `apply` as valid consent unless this final decision prompt has already been shown for the current proposal.
- if a non-applied `check` proposal is ready, show the final decision prompt immediately after the preview instead of requiring a separate continuation message.

For a non-applied `check` preview, acceptable closing shape:

- concise status
- files in scope
- proposal artifact path if useful
- immediate final decision prompt in chat

Do not append unrelated optional next steps unless the user explicitly requested them.
Do not append a separate "changes are not applied" line when the proposal is already clearly presented as non-applied.
Do not print a separate continuation cue like `примени` or `давай` if the final decision prompt can be shown immediately.
Do not start a new run id when the user revises, rejects, or applies the same shown proposal.
Do not silently omit trigger tests from a full interactive reusable-skill proposal; if they are absent, the reason must be explicit.
