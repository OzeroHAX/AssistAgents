---
name: coder-rules-debug-requirements
description: Debugging requirements protocol from reproducible issue to verified fix and regression protection.
---

<when_to_use>
  <trigger>Investigating functional bugs, crashes, regressions, or production incidents</trigger>
  <trigger>Need structured debug flow for coding agent execution</trigger>
  <trigger>Need explicit completion criteria for bug fixes</trigger>
</when_to_use>

<input_requirements>
  <required>Symptom statement and impact</required>
  <required>Expected vs actual behavior</required>
  <required>Minimal reproducible example (steps/data)</required>
  <required>Environment fingerprint (version, config, flags)</required>
  <required>Evidence pack (errors, logs, traces, timestamps)</required>
</input_requirements>

<debug_workflow>
  <step>Triage impact and confirm current reproducibility</step>
  <step>Build minimal reproducible case</step>
  <step>Localize failing layer and narrow search space</step>
  <step>State testable hypothesis and instrumentation plan</step>
  <step>Apply minimal root-cause fix</step>
  <step>Verify fix against acceptance criteria</step>
  <step>Add regression test/eval that fails before and passes after</step>
  <step>Record residual risks and follow-up actions</step>
</debug_workflow>

<quality_rules>
  <rule importance="critical">No reproducible signal means no claim of confirmed fix</rule>
  <rule importance="critical">Bugfix is incomplete without regression protection</rule>
  <rule importance="high">Fix must target root cause, not only symptom masking</rule>
  <rule importance="high">Verification must include evidence from commands or telemetry</rule>
</quality_rules>

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
  <requirement>Problem statement with expected vs actual</requirement>
  <requirement>Root cause summary and impacted components</requirement>
  <requirement>Fix summary with evidence of verification</requirement>
  <requirement>Regression artifact added and location</requirement>
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
