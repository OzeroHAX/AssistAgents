---
name: coder-rules-clean-code
description: Clean code execution rules for coding agents with verifiable quality gates.
---

<when_to_use>
  <trigger>Implementing or refactoring code in any repository area</trigger>
  <trigger>Need to keep changes minimal, readable, and maintainable</trigger>
  <trigger>Need objective acceptance checks before task completion</trigger>
</when_to_use>

<input_requirements>
  <required>Task goal and scope boundaries</required>
  <required>Target files or modules</required>
  <required>Project conventions and existing patterns</required>
  <required>Verification commands (tests/lint/typecheck/build as applicable)</required>
</input_requirements>

<execution_workflow>
  <step>Explore relevant files and constraints before edits</step>
  <step>Plan minimal change that solves requested problem only</step>
  <step>Implement in small coherent edits following local conventions</step>
  <step>Verify with required commands and observable outcomes</step>
</execution_workflow>

<core_principles>
  <principle priority="P0">Prefer smallest safe change that satisfies requirements</principle>
  <principle priority="P0">Keep code intention explicit; avoid hidden side effects</principle>
  <principle priority="P0">Follow repository naming, structure, and style patterns</principle>
  <principle priority="P1">Reduce complexity instead of adding speculative abstractions</principle>
  <principle priority="P1">Treat tests and checks as completion criteria, not optional extras</principle>
  <principle priority="P2">Document only non-obvious tradeoffs and constraints</principle>
</core_principles>

<checklist>
  <item>Diff is limited to in-scope files and behavior</item>
  <item>No duplicate logic introduced when existing utility fits</item>
  <item>Error and edge paths are handled where required by task</item>
  <item>Formatting/lint/type checks pass for changed scope</item>
  <item>Behavior is validated by tests or reproducible command output</item>
</checklist>

<quality_rules>
  <rule importance="critical">Do not mark task done without verifiable evidence</rule>
  <rule importance="critical">Claims about code behavior must be grounded in inspected files or executed checks</rule>
  <rule importance="high">Additional behavior outside requirements must be explicit and justified</rule>
  <rule importance="high">Refactors are allowed only when they directly reduce risk of requested change</rule>
</quality_rules>

<do_not>
  <item importance="critical">Do not use destructive git or shell shortcuts without explicit approval</item>
  <item importance="critical">Do not hardcode secrets, credentials, or environment-specific values</item>
  <item importance="high">Do not pad solution with unused abstractions or premature optimization</item>
  <item importance="high">Do not treat "looks fine" as test evidence</item>
</do_not>

<output_requirements>
  <requirement>List changed files and why each changed</requirement>
  <requirement>List verification commands and results</requirement>
  <requirement>List remaining risks, assumptions, or follow-up items</requirement>
</output_requirements>

<references>
  <source url="https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide/">OpenAI Codex Prompting Guide</source>
  <source url="https://code.claude.com/docs/en/best-practices">Claude Code Best Practices</source>
  <source url="https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks">GitHub Copilot Coding Agent Best Practices</source>
  <source url="https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api">OpenAI Prompt Engineering Best Practices</source>
  <source url="https://google.github.io/eng-practices/review/reviewer/standard.html">Google Engineering Practices: Review Standard</source>
  <source url="https://docs.sonarsource.com/sonarqube-server/10.8/core-concepts/clean-code/definition">SonarQube Clean Code Definition</source>
</references>
