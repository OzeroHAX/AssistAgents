---
name: skill-authoring
description: Use when creating, refining, or validating skills to ensure they trigger correctly, enforce consistent behavior, and produce verifiable outcomes
---

<purpose>
  <item>Define, improve, and validate skills as reusable behavioral units for agents.</item>
  <item>A skill is a behavioral contract: it triggers under specific conditions, enforces consistent execution, and produces verifiable outcomes.</item>
</purpose>

<when_to_use>
  <item importance="critical">Creating a new skill.</item>
  <item importance="critical">Modifying an existing skill.</item>
  <item importance="high">Validating skill quality.</item>
  <item importance="high">Debugging skill behavior.</item>
</when_to_use>

<when_not_to_use>
  <item importance="critical">Do not use for runtime task execution.</item>
  <item importance="critical">Do not use as a replacement for implementation or coding workflows.</item>
</when_not_to_use>

<core_principles>
  <rule importance="critical">Trigger-first design.</rule>
  <rule importance="critical">Single responsibility.</rule>
  <rule importance="critical">Behavior over topic description.</rule>
  <rule importance="critical">Deterministic contract.</rule>
  <rule importance="critical">Verifiability.</rule>
  <rule importance="critical">English-only skill definition.</rule>
  <rule importance="critical">YAML frontmatter plus XML-like body format.</rule>
</core_principles>

<authoring_requirements>
  <rule importance="critical">Every skill MUST keep YAML frontmatter with `name` and `description`.</rule>
  <rule importance="critical">For skills in this package, the skill body MUST use XML-like tagged sections consistent with the rest of `templates/skills/**`.</rule>
  <rule importance="critical">Do not author the skill body as markdown headings plus free-form narrative blocks.</rule>
  <rule importance="critical">All skill metadata and body text MUST be written in English.</rule>
  <rule importance="high">The description defines when to use the skill, not how to execute it.</rule>
  <rule importance="high">The body defines behavior, inputs, outputs, and boundaries, not only a topic label.</rule>
  <rule importance="high">If a skill is too weak to define behavior, convert it into a reference, asset, or support file instead of pretending it is a full skill.</rule>
</authoring_requirements>

<execution_contract>
  <required>Trigger conditions or `when_to_use` guidance.</required>
  <required>Inputs or input requirements.</required>
  <required>Actions, workflow, or method.</required>
  <required>Outputs, artifact shape, or output requirements.</required>
  <required>Boundaries, exclusions, anti-patterns, or `do_not` rules.</required>
  <required>Observable validation, quality rules, or pass/fail criteria.</required>
</execution_contract>

<validation_workflow>
  <step order="1">Baseline test: simulate the task without the skill; weaker behavior or failure must be visible.</step>
  <step order="2">Apply the skill: simulate the same task with the skill; behavior must improve in a measurable way.</step>
  <step order="3">Pressure test ambiguous input, incomplete input, conflicting requirements, and edge cases.</step>
  <step order="4">Regression check: ensure no harmful side effects on unrelated behavior.</step>
  <step order="5">Format check: verify YAML frontmatter, XML-like body structure, and English-only wording.</step>
</validation_workflow>

<self_check>
  <item>Does it trigger reliably?</item>
  <item>Does it change behavior in a measurable way?</item>
  <item>Is it testable?</item>
  <item>Are outputs verifiable?</item>
  <item>Are boundaries explicit?</item>
  <item>Can it fail?</item>
  <item>Is the entire skill definition written in English?</item>
  <item>Does the body use the XML-like format used by the rest of the package?</item>
</self_check>

<do_not>
  <item importance="critical">Do not author a skill as a topic summary with no execution contract.</item>
  <item importance="critical">Do not mix multiple unrelated behaviors into one skill.</item>
  <item importance="critical">Do not mix languages in frontmatter or body text.</item>
  <item importance="critical">Do not use markdown-heading body format for skills in this package.</item>
  <item importance="high">Do not rely on subjective success criteria only.</item>
  <item importance="high">Do not keep a weak pseudo-skill when a reference or template would be more honest.</item>
</do_not>

<output_requirements>
  <requirement>For create or update tasks: produce a revised skill file that uses YAML frontmatter and an XML-like body, written in English.</requirement>
  <requirement>For validation tasks: produce a score, failed rules, a concise summary, and concrete fix suggestions.</requirement>
  <requirement>State whether the reviewed file should remain a standalone skill, be split, or be downgraded into a support/reference artifact.</requirement>
</output_requirements>

<linting>
  <rule importance="critical">A skill MUST pass all lint checks to be considered production-grade.</rule>
</linting>

<lint_rules>
  <rule id="L1" name="Trigger clarity">
    <pass_condition>The description clearly defines when to use the skill.</pass_condition>
    <pass_condition>The description does not explain workflow.</pass_condition>
    <fail_if>The description explains how instead of when.</fail_if>
    <fail_if>The description is generic, such as "handles tasks" or "improves quality".</fail_if>
  </rule>

  <rule id="L2" name="Single responsibility">
    <pass_condition>The skill defines one coherent behavior.</pass_condition>
    <fail_if>The skill mixes planning and execution.</fail_if>
    <fail_if>The skill mixes unrelated domains or outcomes.</fail_if>
  </rule>

  <rule id="L3" name="Execution contract">
    <pass_condition>The skill defines inputs.</pass_condition>
    <pass_condition>The skill defines actions.</pass_condition>
    <pass_condition>The skill defines outputs.</pass_condition>
    <pass_condition>The skill defines boundaries.</pass_condition>
    <fail_if>Any execution-contract element is missing or vague.</fail_if>
  </rule>

  <rule id="L4" name="Verifiability">
    <pass_condition>The skill defines an observable outcome or a validation method.</pass_condition>
    <fail_if>Success cannot be verified.</fail_if>
    <fail_if>The output is subjective only.</fail_if>
  </rule>

  <rule id="L5" name="Anti-patterns">
    <pass_condition>The skill includes common mistakes or explicit `do_not` rules.</pass_condition>
    <fail_if>Misuse is possible but not addressed.</fail_if>
  </rule>

  <rule id="L6" name="Behavior impact">
    <pass_condition>The skill changes agent behavior in a measurable way.</pass_condition>
    <fail_if>The skill only restates best practices.</fail_if>
    <fail_if>The skill adds no enforcement or constraints.</fail_if>
  </rule>

  <rule id="L7" name="Boundary clarity">
    <pass_condition>The skill clearly states when not to use it.</pass_condition>
    <fail_if>The skill overlaps heavily with others and has no exclusions.</fail_if>
    <fail_if>No exclusion conditions are defined.</fail_if>
  </rule>

  <rule id="L8" name="Non-ambiguity">
    <pass_condition>The instructions are deterministic.</pass_condition>
    <fail_if>Vague wording such as "properly" or "carefully" carries the behavior.</fail_if>
    <fail_if>Interpretation can vary significantly.</fail_if>
  </rule>

  <rule id="L9" name="English-only skill text">
    <pass_condition>Metadata and body are written in English.</pass_condition>
    <pass_condition>Examples, rules, and output formats are written in English.</pass_condition>
    <fail_if>Non-English language is used in frontmatter or skill body.</fail_if>
    <fail_if>Mixed-language wording can affect trigger clarity or execution.</fail_if>
  </rule>

  <rule id="L10" name="XML-like body format">
    <pass_condition>The body uses XML-like tagged sections consistent with the repository skill style.</pass_condition>
    <pass_condition>Frontmatter remains YAML with `name` and `description`.</pass_condition>
    <fail_if>The body is written primarily as markdown headings or free-form prose blocks.</fail_if>
    <fail_if>The body structure is inconsistent with the repository skill format.</fail_if>
  </rule>
</lint_rules>

<scoring>
  <rule>Each lint rule is PASS = 1 and FAIL = 0.</rule>
  <production_grade>10/10</production_grade>
  <acceptable>8-9/10</acceptable>
  <reject>0-7/10</reject>
</scoring>

<ci_output_format>
  <required_field>skill</required_field>
  <required_field>score</required_field>
  <required_field>maxScore</required_field>
  <required_field>status</required_field>
  <required_field>failedRules</required_field>
  <required_field>summary</required_field>
  <required_field>fixSuggestions</required_field>
  <example>{"skill":"skill-name","score":8,"maxScore":10,"status":"FAIL","failedRules":["L9","L10"],"summary":"Skill uses non-English text and the body is not in XML-like format.","fixSuggestions":["Rewrite metadata and instructions in English","Convert the body to repository-standard XML-like sections"]}</example>
</ci_output_format>
