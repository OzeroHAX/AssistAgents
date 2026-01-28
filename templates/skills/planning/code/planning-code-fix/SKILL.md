---
name: planning-code-fix
description: Step-by-step planning for code fixes and bug resolution. Use when you need to analyze an issue, identify root cause, plan safe incremental changes, and define testing strategy before implementing a fix.
---
<skill_overview>
  <purpose>Structure and plan code fixes before implementation to ensure safe, testable, and reversible changes</purpose>
  <triggers>
    <trigger>Bug report or issue needs to be analyzed and fixed</trigger>
    <trigger>Error in production or tests needs investigation</trigger>
    <trigger>Refactoring required to fix underlying problem</trigger>
    <trigger>Need to plan a fix before writing code</trigger>
    <trigger>Complex fix spanning multiple files or modules</trigger>
  </triggers>
</skill_overview>
<clarification_strategy>
  <when_to_ask>
    <condition>Issue description is vague or incomplete</condition>
    <condition>Multiple possible interpretations of the problem</condition>
    <condition>Need to confirm reproduction steps</condition>
    <condition>Unclear which behavior is expected vs actual</condition>
    <condition>Fix has significant trade-offs requiring user decision</condition>
  </when_to_ask>
  <how_to_ask>
    <instruction>Use the "question" tool to ask clarifying questions</instruction>
    <instruction>Ask specific, actionable questions (not open-ended)</instruction>
    <instruction>Batch related questions together (max 2-3 at once)</instruction>
    <instruction>Provide context why you're asking</instruction>
  </how_to_ask>
  <examples>
    <good_question>
      <context>The error occurs on login, but I found two auth flows.</context>
      <question>Is this happening with OAuth login, password login, or both?</question>
    </good_question>
    <good_question>
      <context>I can fix this with a null check (quick) or by refactoring the data flow (proper).</context>
      <question>Should I do a minimal fix now, or a more thorough refactoring?</question>
    </good_question>
    <bad_question>
      <question>What's wrong?</question>
      <why_bad>Too vague, doesn't show any analysis effort</why_bad>
    </bad_question>
  </examples>
</clarification_strategy>
<root_cause_analysis>
  <technique name="5-whys">
    <description>Iteratively ask "why?" to peel away symptom layers until reaching actionable root cause</description>
    <guidelines>
      <guideline>Stop when you reach an actionable systemic issue (3-7 iterations typical)</guideline>
      <guideline>Don't settle for surface-level causes or "human error"</guideline>
      <guideline>Focus on processes/systems, not individuals</guideline>
      <guideline>Keep asking until you hit your influence boundary</guideline>
    </guidelines>
    <example>
      <problem>Users unable to login</problem>
      <why n="1">Authentication service returns 500 error</why>
      <why n="2">Database connection pool exhausted</why>
      <why n="3">Connections not being released</why>
      <why n="4">Error handling in async function doesn't close connections</why>
      <why n="5">Missing try-finally block in database client wrapper</why>
      <root_cause>Missing error handling that properly closes database connections</root_cause>
    </example>
  </technique>
  <technique name="systematic-debugging">
    <steps>
      <step>Reproduce reliably — create minimal, deterministic reproduction steps</step>
      <step>Gather observability data — metrics (what's wrong) → logs (what happened) → traces (where/why)</step>
      <step>Isolate the scope — binary search through code/system layers</step>
      <step>Form hypothesis — write down your theory before diving into code</step>
      <step>Verify fix — not just "it works" but that the bug scenario is addressed</step>
    </steps>
  </technique>
</root_cause_analysis>
<planning_phases>
  <phase name="1-understand" title="Understand the Problem">
    <steps>
      <step>Read the issue/bug report completely</step>
      <step>Identify symptoms vs root cause (symptoms ≠ cause)</step>
      <step>Determine reproduction steps</step>
      <step>Check if issue is intermittent or consistent</step>
      <step>Use "question" tool if critical info is missing</step>
    </steps>
    <output>Clear problem statement with reproduction steps</output>
  </phase>
  
  <phase name="2-locate" title="Locate Affected Code">
    <steps>
      <step>Identify entry point (route, handler, function)</step>
      <step>Trace code path from entry to error</step>
      <step>List all affected files and functions</step>
      <step>Check related tests and their status</step>
    </steps>
    <output>File list with line numbers and call chain</output>
  </phase>
  
  <phase name="3-analyze" title="Root Cause Analysis">
    <steps>
      <step>Apply 5 Whys technique to identify true root cause</step>
      <step>Identify the exact line(s) causing the issue</step>
      <step>Understand why the current code fails</step>
      <step>Check git history for recent changes in affected area</step>
      <step>Look for similar issues or patterns elsewhere</step>
    </steps>
    <output>Root cause explanation with evidence (file paths, line numbers)</output>
  </phase>
  
  <phase name="4-design" title="Design the Fix">
    <steps>
      <step>Propose minimal change that fixes the issue</step>
      <step>Consider alternative approaches</step>
      <step>Evaluate impact on other code</step>
      <step>Check backward compatibility</step>
      <step>Plan incremental steps if fix is complex</step>
      <step>Ask user via "question" if trade-offs need decision</step>
    </steps>
    <output>Fix approach with rationale and alternatives considered</output>
    <scope_checklist>
      <dont>Don't add features while fixing bugs</dont>
      <dont>Don't refactor unrelated code</dont>
      <dont>Don't improve "code nearby"</dont>
      <dont>Don't add error handling for impossible scenarios</dont>
    </scope_checklist>
  </phase>
  
  <phase name="5-test" title="Testing Strategy">
    <steps>
      <step>Define test that reproduces the bug (should fail before fix)</step>
      <step>Plan unit tests for the fix</step>
      <step>Identify integration tests needed</step>
      <step>Consider edge cases and regression risks</step>
    </steps>
    <output>Test plan with specific test cases</output>
  </phase>
  
  <phase name="6-rollback" title="Rollback Plan">
    <steps>
      <step>Define conditions when rollback is needed</step>
      <step>Ensure fix is easily reversible</step>
      <step>Document any data migrations</step>
      <step>Consider feature flag for risky fixes</step>
    </steps>
    <output>Rollback criteria and procedure</output>
  </phase>
</planning_phases>
<output_template>
  <section name="Problem Summary">
    <content>2-3 sentences describing the issue</content>
  </section>
  <section name="Reproduction Steps">
    <content>Numbered steps to reproduce</content>
  </section>
  <section name="Affected Files">
    <content>List of files with line numbers</content>
  </section>
  <section name="Root Cause">
    <content>Explanation with code evidence (5 Whys result)</content>
  </section>
  <section name="Proposed Fix">
    <content>Step-by-step changes to make</content>
  </section>
  <section name="Alternatives Considered">
    <content>Other approaches and why not chosen</content>
  </section>
  <section name="Test Plan">
    <content>Specific tests to add/modify</content>
  </section>
  <section name="Rollback Conditions">
    <content>When and how to revert</content>
  </section>
  <section name="Risk Assessment">
    <content>Low/Medium/High with explanation</content>
  </section>
</output_template>
<principles>
  <principle name="minimal-change">Fix only what's broken, avoid scope creep. One bug → one fix → one PR</principle>
  <principle name="test-first">Write failing test before implementing fix</principle>
  <principle name="incremental">Break complex fixes into small, reviewable steps (&lt;400 lines per PR)</principle>
  <principle name="reversible">Every change should be easy to rollback</principle>
  <principle name="evidence-based">Support analysis with file paths and line numbers</principle>
  <principle name="no-assumptions">Verify hypotheses with actual code inspection</principle>
  <principle name="ask-dont-guess">Use "question" tool when info is missing, don't assume</principle>
</principles>
<examples>
  <example name="good-analysis">
    <issue>Login fails with 500 error after server restart</issue>
    <analysis>
      Root cause (5 Whys): Session store not initialized before first request.
      Why 1: store.get() returns undefined
      Why 2: store.init() not called
      Why 3: init() moved to lazy loading in commit abc123
      Why 4: Lazy loading doesn't handle concurrent first requests
      Evidence: src/auth/session.ts:42 - store.get() called before store.init()
    </analysis>
  </example>
  <example name="bad-analysis">
    <issue>Login fails with 500 error</issue>
    <analysis>Probably a database issue, will add try-catch everywhere</analysis>
    <why_bad>No evidence, no root cause, shotgun fix approach</why_bad>
  </example>
</examples>
<anti_patterns>
  <avoid name="shotgun-debugging">Adding try-catch or null checks without understanding cause</avoid>
  <avoid name="big-bang-fix">Large refactoring disguised as bug fix</avoid>
  <avoid name="assumption-driven">Guessing without code inspection</avoid>
  <avoid name="test-skipping">Fixing without adding regression test</avoid>
  <avoid name="silent-confusion">Proceeding with unclear requirements instead of asking</avoid>
  <avoid name="scope-creep">Improving "nearby" code while fixing a bug</avoid>
</anti_patterns>
