---
name: skill-authoring
description: Create, update, or review project-local OpenCode skills in .opencode/skills; use when authoring a new skill from requirements or repository code, or auditing an existing SKILL.md
---

<when_to_use>
  <trigger>Create a new OpenCode skill from scratch</trigger>
  <trigger>Update or refactor an existing project-local skill</trigger>
  <trigger>Review a SKILL.md for correctness, trigger quality, or missing rules</trigger>
  <trigger>Generate repository-specific skills from code, configs, and workflow evidence</trigger>
</when_to_use>

<modes>
  <mode name="author">Create or update a skill from requirements or repository evidence</mode>
  <mode name="review">Audit an existing skill and report gaps by severity</mode>
</modes>

<required_inputs>
  <author_from_requirements>
    <required>Reusable task or capability the skill should encode</required>
    <required>When the skill should trigger</required>
    <required>Out-of-scope or non-goals</required>
    <optional>Preferred skill name</optional>
    <optional>Need for references, scripts, or assets</optional>
  </author_from_requirements>
  <author_from_code>
    <required>Repository area or files to analyze</required>
    <required>The recurring coding or workflow pattern to capture</required>
    <required>Evidence files, configs, or commands that justify the extracted rules</required>
    <optional>Framework or library scope</optional>
  </author_from_code>
  <review>
    <required>Path to the skill directory or SKILL.md</required>
    <optional>Expected goal or acceptance criteria for the skill</optional>
  </review>
</required_inputs>

<blocking_conditions>
  <blocker>The target capability is unclear or combines multiple unrelated skills</blocker>
  <blocker>Trigger conditions are missing or too vague to write a reliable description</blocker>
  <blocker>Repository evidence is missing for code-derived rules</blocker>
  <blocker>The review target path is not provided or cannot be found</blocker>
</blocking_conditions>

<hard_rules>
  <rule importance="critical">Write project-local skills under `.opencode/skills/<skill-name>/SKILL.md` unless the user explicitly requests a different compatible location</rule>
  <rule importance="critical">`name` must match the containing directory name exactly and satisfy `^[a-z0-9]+(-[a-z0-9]+)*$`</rule>
  <rule importance="critical">`description` must state both what the skill does and when it should be used; treat description as the primary trigger signal</rule>
  <rule importance="critical">One skill must represent one coherent capability; split unrelated responsibilities into separate skills</rule>
  <rule importance="high">Keep `SKILL.md` concise; move bulky or variant-specific details into `references/` when needed</rule>
  <rule importance="high">Prefer reusable rules, workflows, and quality gates over copying repository implementation details</rule>
  <rule importance="high">If creating from code, every non-obvious rule should be traceable to inspected files, configs, or executed checks</rule>
  <rule importance="high">If the active agent cannot write, do the analysis or review and hand off the concrete write step instead of inventing write access</rule>
  <rule importance="medium">Use forward slashes in skill paths and resource references</rule>
</hard_rules>

<author_workflow>
  <step order="1">Classify the task: `author-from-requirements`, `author-from-code`, or `update-existing`</step>
  <step order="2">Confirm the minimum required inputs are present; if a blocker remains, stop and ask for the missing data</step>
  <step order="3">Define the smallest useful skill boundary and decide whether the request needs one skill or multiple skills</step>
  <step order="4">Choose the skill name and draft a trigger-oriented description</step>
  <step order="5">Select the minimum body structure: purpose, when-to-use, workflow or checklist, rules, do-not, references if needed</step>
  <step order="6">If authoring from code, extract reusable patterns from repository evidence rather than copying code dumps</step>
  <step order="7">Write or update `SKILL.md` and add `references/`, `scripts/`, or `assets/` only when they clearly reduce ambiguity or repetition</step>
  <step order="8">Run the review workflow on the resulting skill and fix all `critical` and `high` findings before finishing</step>
</author_workflow>

<author_from_code_guidance>
  <rule>Start with manifests, configs, representative modules, tests, and canonical verification commands</rule>
  <rule>Capture patterns that remain useful across future tasks: structure, conventions, checks, edge-case handling, and anti-patterns</rule>
  <rule>Do not turn one-time implementation details into universal skill rules</rule>
  <rule>When multiple stacks or frameworks differ materially, prefer separate skills or separate reference files instead of one overloaded skill</rule>
</author_from_code_guidance>

<review_workflow>
  <step order="1">Validate frontmatter: presence, `name`, `description`, regex, and `name == directory`</step>
  <step order="2">Check whether the description clearly communicates trigger conditions</step>
  <step order="3">Check capability focus: one coherent job, no mixed responsibilities</step>
  <step order="4">Check body quality: concise, actionable, and not bloated with obvious or time-sensitive content</step>
  <step order="5">Check resource design: whether `references/`, `scripts/`, or `assets/` are missing, misused, or duplicating `SKILL.md`</step>
  <step order="6">Report findings by severity: `critical`, `high`, `medium`; if none, state that explicitly and note residual risks</step>
</review_workflow>

<review_findings>
  <critical>Invalid path or layout, invalid frontmatter, broken trigger description, or scope so broad that the skill cannot trigger reliably</critical>
  <high>Missing workflow or checklist, duplicated bulky details, ungrounded code-derived rules, or ambiguous split between multiple skills</high>
  <medium>Naming drift, weak examples, missing anti-patterns, or opportunities to extract references</medium>
</review_findings>

<recommended_body_sections>
  <section>Use one clear opening section such as `<purpose>` or `<when_to_use>`</section>
  <section>Include a short actionable workflow or checklist for the core task</section>
  <section>Include rules or quality gates and a `<do_not>` or equivalent anti-pattern section when misuse is plausible</section>
  <section>Add `<references>` only when external or detailed local material is actually needed</section>
</recommended_body_sections>

<quality_checklist>
  <item>Path is `.opencode/skills/<skill-name>/SKILL.md`</item>
  <item>Frontmatter contains valid `name` and trigger-oriented `description`</item>
  <item>`name` matches the directory name exactly</item>
  <item>The skill covers one reusable capability</item>
  <item>Body is concise and structured for on-demand loading</item>
  <item>Code-derived rules are backed by repository evidence</item>
  <item>References or scripts exist only when they reduce ambiguity or repetition</item>
  <item>All `critical` and `high` review findings are resolved before completion</item>
</quality_checklist>

<do_not>
  <item importance="critical">Do not create nested runtime paths like `.opencode/skills/group/name/` for OpenCode-only skills</item>
  <item importance="critical">Do not write a generic description like "helper skill" or "tools for coding"</item>
  <item importance="high">Do not dump long code excerpts or repository-specific noise into the skill body</item>
  <item importance="high">Do not duplicate generic skill-authoring methodology inside task-specific commands if this skill can own it</item>
  <item importance="high">Do not mark a reviewed skill as good without explicitly checking frontmatter, trigger quality, and scope boundaries</item>
</do_not>

<references>
  <source url="https://opencode.ai/docs/ru/skills/">OpenCode Skills documentation</source>
  <source url="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices">Claude skill authoring best practices</source>
  <source url="https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills">GitHub Copilot agent skills guide</source>
</references>
