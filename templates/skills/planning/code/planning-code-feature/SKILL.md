---
name: planning-code-feature
description: Step-by-step planning for new feature implementation. Use when you need to clarify scope, decompose functionality into deliverable increments, and plan implementation approach before coding.
---
<skill_overview>
  <purpose>Structure and plan new features before implementation to ensure clear scope, deliverable increments, and manageable complexity</purpose>
  <triggers>
    <trigger>New feature request needs to be planned</trigger>
    <trigger>User story needs decomposition into tasks</trigger>
    <trigger>Feature spans multiple components or modules</trigger>
    <trigger>Need to clarify scope and acceptance criteria</trigger>
    <trigger>Complex feature requiring incremental delivery</trigger>
  </triggers>
</skill_overview>
<clarification_strategy>
  <when_to_ask>
    <condition>Feature scope is vague or too broad</condition>
    <condition>Multiple valid interpretations of requirements</condition>
    <condition>Need to clarify edge cases and constraints</condition>
    <condition>Unclear acceptance criteria or "definition of done"</condition>
    <condition>Trade-offs between complexity and delivery time</condition>
    <condition>Dependencies on external systems or teams</condition>
  </when_to_ask>
  <how_to_ask>
    <instruction>Use the "question" tool to ask clarifying questions</instruction>
    <instruction>Ask about user value and expected outcomes</instruction>
    <instruction>Focus on concrete behaviors, not abstract features</instruction>
    <instruction>Batch related questions together (max 2-3 at once)</instruction>
  </how_to_ask>
  <examples>
    <good_question>
      <context>You want a "user notifications" feature. I see two approaches: email-only or email + in-app.</context>
      <question>Should this include in-app notifications, or email is enough for now?</question>
    </good_question>
    <good_question>
      <context>The feature requires displaying user data. We can show last 10 items (simple) or implement pagination (proper).</context>
      <question>How many items do users typically have? Should I implement pagination from the start?</question>
    </good_question>
    <bad_question>
      <question>What do you want the feature to do?</question>
      <why_bad>Too vague, doesn't show any analysis effort</why_bad>
    </bad_question>
  </examples>
</clarification_strategy>
<planning_phases>
  <phase name="1-scope" title="Define Scope">
    <steps>
      <step>Understand the user value — who benefits and how?</step>
      <step>Identify core functionality vs nice-to-haves</step>
      <step>Define what's explicitly OUT of scope</step>
      <step>List constraints (time, tech, dependencies)</step>
      <step>Use "question" tool to clarify ambiguous requirements</step>
    </steps>
    <output>Clear scope statement with in/out boundaries</output>
    <validation_questions>
      <question>Can someone walk me through what success looks like?</question>
      <question>What could go wrong that we haven't talked about?</question>
      <question>What needs to exist before we can start this work?</question>
    </validation_questions>
  </phase>
  
  <phase name="2-decompose" title="Decompose Functionality">
    <steps>
      <step>Break feature into user-facing behaviors (not technical tasks)</step>
      <step>Apply INVEST criteria to each piece</step>
      <step>Identify the MVP — smallest valuable increment</step>
      <step>Order increments by dependency and value</step>
      <step>Ensure each increment is independently testable</step>
    </steps>
    <output>Ordered list of increments with clear scope</output>
    <invest_criteria>
      <criterion name="Independent">Can be developed and deployed on its own</criterion>
      <criterion name="Negotiable">Room for discussion on implementation</criterion>
      <criterion name="Valuable">Delivers user or business value</criterion>
      <criterion name="Estimable">Team understands enough to size</criterion>
      <criterion name="Small">Fits within reasonable time (1-3 days)</criterion>
      <criterion name="Testable">Clear success criteria</criterion>
    </invest_criteria>
    <splitting_strategies>
      <strategy>Split by workflow steps (create → edit → delete)</strategy>
      <strategy>Split by data variations (single → bulk → import)</strategy>
      <strategy>Split by user roles (basic user → admin)</strategy>
      <strategy>Split by edge cases (happy path first → error handling)</strategy>
      <strategy>Split by platform (web → mobile → API)</strategy>
    </splitting_strategies>
  </phase>
  
  <phase name="3-plan" title="Implementation Plan">
    <steps>
      <step>Map increments to affected files/components</step>
      <step>Identify external dependencies and blockers</step>
      <step>Define acceptance criteria for each increment</step>
      <step>Plan testing approach (unit → integration → E2E)</step>
      <step>Consider backward compatibility and feature flags</step>
    </steps>
    <output>Implementation plan with file list and acceptance criteria</output>
    <acceptance_criteria_format>
      <template>Given [context], when [action], then [expected result]</template>
      <guidelines>
        <guideline>Make criteria testable and measurable</guideline>
        <guideline>Cover happy path and key error cases</guideline>
        <guideline>Avoid implementation details in criteria</guideline>
      </guidelines>
    </acceptance_criteria_format>
  </phase>
</planning_phases>
<output_template>
  <section name="Feature Summary">
    <content>2-3 sentences: what the feature does and who benefits</content>
  </section>
  <section name="Scope">
    <subsection name="In Scope">Core functionality to implement</subsection>
    <subsection name="Out of Scope">Explicitly excluded for now</subsection>
  </section>
  <section name="Increments">
    <content>Ordered list of deliverable pieces (MVP first)</content>
    <increment_format>
      <field>Name — short description</field>
      <field>Acceptance Criteria — Given/When/Then</field>
      <field>Files — affected components</field>
    </increment_format>
  </section>
  <section name="Dependencies">
    <content>External systems, APIs, or blockers</content>
  </section>
  <section name="Testing Approach">
    <content>What tests to add for each increment</content>
  </section>
  <section name="Risks">
    <content>Technical or scope risks with mitigation</content>
  </section>
</output_template>
<principles>
  <principle name="user-value-first">Every increment should deliver visible value, not just technical progress</principle>
  <principle name="vertical-slices">Deliver thin end-to-end slices, not horizontal layers</principle>
  <principle name="mvp-mindset">Build smallest thing that validates the approach, then iterate</principle>
  <principle name="explicit-scope">What's OUT of scope is as important as what's IN</principle>
  <principle name="testable-increments">If you can't test it independently, decompose further</principle>
  <principle name="ask-early">Clarify requirements before coding, not during</principle>
</principles>
<anti_patterns>
  <avoid name="big-bang-delivery">Building everything before showing anything</avoid>
  <avoid name="technical-only-tasks">Increments like "set up database" without user value</avoid>
  <avoid name="scope-ambiguity">Starting without clear in/out boundaries</avoid>
  <avoid name="feature-creep">Adding requirements during implementation</avoid>
  <avoid name="assumption-driven">Guessing user needs instead of clarifying</avoid>
  <avoid name="untestable-scope">Defining work that can't be verified</avoid>
</anti_patterns>
