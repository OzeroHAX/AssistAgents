---
name: coder-rules-debug-requirements
description: Use when investigating functional bugs, crashes, regressions, or incidents that need reproducible diagnosis and a verified fix.
---

<when_to_use>
  <trigger>Investigating functional bugs, crashes, regressions, or production incidents</trigger>
  <trigger>Need a reproducible debug workflow that narrows symptom to root cause</trigger>
  <trigger>Need explicit proof that a bug fix works and is regression-protected</trigger>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for project planning, document authoring, or runtime test execution.</item>
  <item importance="high">Do not use when review, general testing, or another domain-specific skill is the better fit without an active debug problem.</item>
</when_not_to_use>
<input_requirements>
  <required>Symptom statement and impact</required>
  <required>Expected vs actual behavior</required>
  <required>Minimal reproducible example (steps/data)</required>
  <required>Environment fingerprint (version, config, flags)</required>
  <required>Evidence pack (errors, logs, traces, timestamps)</required>
</input_requirements>

<workflow>
  <step>Confirm the symptom, impact, and current reproducible signal</step>
  <step>Build the smallest repro and localize the failing layer or boundary</step>
  <step>State the leading hypothesis and the evidence needed to confirm or reject it</step>
  <step>Apply the smallest root-cause fix for the confirmed failure mode</step>
  <step>Verify the fix with before/after evidence and add regression protection</step>
  <step>Record residual risks, unknowns, and follow-up actions</step>
</workflow>

<quality_rules>
  <rule importance="critical">No reproducible signal means no claim of confirmed fix</rule>
  <rule importance="critical">Bugfix is incomplete without regression protection</rule>
  <rule importance="high">Fix must target root cause, not only symptom masking</rule>
  <rule importance="high">Verification must include evidence from commands or telemetry</rule>
</quality_rules>

<validation>
  <item importance="critical">Required outputs, constraints, and boundaries are explicit and complete.</item>
  <item importance="critical">The expected behavior can be verified by commands, evidence, or inspected artifacts.</item>
  <item importance="high">The skill stays inside its coding/design scope and does not drift into unrelated planning or review work.</item>
</validation>
<required_signals>
  <signal>Repro rate before and after fix</signal>
  <signal>Error rate or failure count change</signal>
  <signal>Latency/perf guardrail impact when relevant</signal>
  <signal>Regression suite result for affected path</signal>
</required_signals>

<do_not>
  <item importance="critical">Do not debug by guesswork without hypothesis</item>
  <item importance="critical">Do not close issue without reproducible verification</item>
  <item importance="high">Do not skip regression test because fix "looks obvious"</item>
  <item importance="high">Do not merge broad refactor as hidden hotfix</item>
</do_not>

<output_requirements>
  <requirement>Problem statement with expected vs actual behavior and current impact</requirement>
  <requirement>Root cause summary and impacted components or boundaries</requirement>
  <requirement>Fix summary with evidence of verification</requirement>
  <requirement>Regression artifact added and location</requirement>
  <requirement>Residual risks, open questions, or follow-up actions</requirement>
</output_requirements>

<references>
  <source url="https://stackoverflow.com/help/minimal-reproducible-example">Stack Overflow MRE Guide</source>
  <source url="https://web.mit.edu/6.005/www/fa15/classes/11-debugging/">MIT Debugging Workflow</source>
  <source url="https://platform.openai.com/docs/guides/evaluation-best-practices">OpenAI Evaluation Best Practices</source>
  <source url="https://platform.openai.com/docs/guides/evals">OpenAI Evals Guide</source>
  <source url="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents">Anthropic: Demystifying Evals for AI Agents</source>
  <source url="https://sre.google/sre-book/postmortem-culture/">Google SRE Postmortem Culture</source>
  <source url="https://opentelemetry.io/docs/concepts/context-propagation/">OpenTelemetry Context Propagation</source>
</references>
