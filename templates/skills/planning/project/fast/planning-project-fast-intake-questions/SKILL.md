---
name: planning-project-fast-intake-questions
description: Fast project intake via 5-7 targeted questions to remove ambiguity and lock constraints.
---

<skill_overview>
  <purpose>Quickly collect the minimum inputs: goal, output format, constraints, resources, and a binary success definition.</purpose>
  <triggers>
    <trigger>User asks for a project plan but the description is vague</trigger>
    <trigger>Output format, audience, timeline, or budget constraints are unclear</trigger>
    <trigger>There are multiple plausible interpretations of the request</trigger>
  </triggers>
</skill_overview>

<rules>
  <rule>Ask exactly 5-7 questions in a single question tool call.</rule>
  <rule>Make questions binary or multiple-choice whenever possible.</rule>
  <rule>Avoid philosophical or learning-oriented questions.</rule>
  <rule>Each question must materially change the plan (stack/scope/order/risks).</rule>
</rules>

<question_set>
  <question n="1" name="problem">
    <goal>Get a one-sentence problem statement.</goal>
    <prompt>One sentence: "I want to build X that does Y for Z".</prompt>
  </question>
  <question n="2" name="output_format">
    <goal>Lock the output/delivery format.</goal>
    <options>
      <option>Web page / web app</option>
      <option>Bot (Telegram/Discord/Slack)</option>
      <option>CLI tool</option>
      <option>Automation / workflow</option>
      <option>Scheduled job / script</option>
      <option>Other (specify)</option>
    </options>
  </question>
  <question n="3" name="time_budget">
    <goal>Get a realistic time budget.</goal>
    <options>
      <option>1 session (2-3 hours)</option>
      <option>2-3 sessions (6-9 hours)</option>
      <option>4-5 sessions (10-15 hours)</option>
      <option>More (this is no longer "fast")</option>
    </options>
  </question>
  <question n="4" name="constraints">
    <goal>Make constraints and risks explicit.</goal>
    <options multiple="true">
      <option>Strictly no deployment (local is fine)</option>
      <option>Need simple deployment / shareable link</option>
      <option>Must integrate with an external service/API</option>
      <option>Budget constraint (free/minimal)</option>
      <option>Data/security/privacy constraints</option>
    </options>
  </question>
  <question n="5" name="data">
    <goal>Identify data sources and input shape.</goal>
    <options>
      <option>User input only (runtime)</option>
      <option>Existing files/data</option>
      <option>API/DB-backed data</option>
      <option>Combination</option>
    </options>
  </question>
  <question n="6" name="tech_comfort">
    <goal>Select a realistic implementation approach.</goal>
    <options>
      <option>Comfortable writing code</option>
      <option>Somewhat comfortable; keep it minimal</option>
      <option>Prefer no-code / low-code</option>
    </options>
  </question>
  <question n="7" name="success">
    <goal>Lock a binary definition of done.</goal>
    <prompt>Project works if ... (one verifiable action, yes/no).</prompt>
  </question>
</question_set>

<output>
  <expectation>After answers, move directly to: success metric/scope -> MVP slicing -> session plan -> delivery/validation.</expectation>
</output>
