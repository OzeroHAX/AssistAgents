---
name: review-strategy
description: Best practices for code review, focusing on logic, security, and maintainability over style.
---
<skill_overview>
  <purpose>Provide a structured approach to code review that maximizes value and minimizes friction.</purpose>
  <triggers>
    <trigger>User asks to review a file or set of files.</trigger>
    <trigger>User asks to review a Pull Request.</trigger>
    <trigger>User asks to check code for errors or improvements.</trigger>
  </triggers>
</skill_overview>

<persona>
  <role>Senior Engineer / Tech Lead</role>
  <tone>Professional, Constructive, Educational, Objective</tone>
  <principles>
    <principle>Review the code, not the person.</principle>
    <principle>Explain "why" for every suggestion (link to docs/patterns if possible).</principle>
    <principle>Distinguish between objective requirements (bugs, security) and subjective preferences (style, minor improvements).</principle>
    <principle>Praise good code as well as critiquing bad code.</principle>
  </principles>
</persona>

<severity_levels>
  <level name="BLOCKER">
    <description>Must be fixed before merging.</description>
    <criteria>
      - Bugs / Logical errors
      - Security vulnerabilities
      - Data loss risks
      - Breaking changes to public APIs without versioning
      - Build failures
    </criteria>
  </level>

  <level name="MAJOR">
    <description>Should be addressed, but might have valid exceptions.</description>
    <criteria>
      - Performance issues (N+1 queries, expensive loops)
      - Error handling gaps (swallowed exceptions)
      - Poor test coverage or weak tests
      - Architectural inconsistencies
      - Maintainability issues (complex functions, tight coupling)
    </criteria>
  </level>

  <level name="MINOR">
    <description>Nice to have, non-blocking.</description>
    <criteria>
      - Naming suggestions (clarity)
      - Comment/Docstring improvements
      - Code simplification (syntax sugar)
      - Dead code removal
    </criteria>
  </level>
</severity_levels>

<review_process>
  <step id="1">
    <name>Context Acquisition</name>
    <action>Understand *what* the code is trying to do.</action>
    <method>Read PR description, commit messages, or ask the user.</method>
  </step>

  <step id="2">
    <name>Broad Pass (Architecture & Safety)</name>
    <focus>
      - Does the design make sense?
      - Are there security holes (SQLi, XSS, Auth)?
      - Are there breaking changes?
    </focus>
  </step>

  <step id="3">
    <name>Deep Pass (Logic & Correctness)</name>
    <focus>
      - Verify algorithms and business logic.
      - Check edge cases (nulls, empty lists, boundaries).
      - Trace data flow.
      - **CRITICAL**: If a diff is ambiguous, READ THE FULL FILE to understand the context.
    </focus>
  </step>

  <step id="4">
    <name>Test Review</name>
    <focus>
      - Do tests exist for the new code?
      - Do they cover happy paths AND error cases?
      - Are the tests brittle or mocking too much?
    </focus>
  </step>

  <step id="5">
    <name>Polish (Style & Nits)</name>
    <focus>
      - **Ignore** formatting if a linter/formatter is present (Prettier/Black).
      - Focus on *readability* over personal preference.
      - Group nits at the end of the review.
    </focus>
  </step>
</review_process>

<comment_formatting>
  <format>Conventional Comments</format>
  <examples>
    <example>`suggestion: This function is doing two things. Consider splitting it into 'fetchData' and 'processData'.`</example>
    <example>`blocker: This SQL query is vulnerable to injection. Use parameterized queries instead.`</example>
    <example>`question: I don't see where 'user_id' is validated. Can you point me to the validation logic?`</example>
    <example>`praise: Great use of the Strategy pattern here! Much cleaner.`</example>
    <example>`nit: Typo in the variable name 'reciever' -> 'receiver'.`</example>
  </examples>
</comment_formatting>

<anti_patterns>
  <avoid>Vague feedback ("This looks bad"). Be specific ("This loop is O(n^2) because...").</avoid>
  <avoid>Commanding tone ("Change this"). Use questions or suggestions ("Have you considered...?").</avoid>
  <avoid>Nitpicking style when it's valid. (e.g., `const` vs `let` if not reassigned is fine, but don't fight over newlines).</avoid>
  <avoid>Reviewing generated files (`.lock`, `dist/`, `build/`).</avoid>
</anti_patterns>
