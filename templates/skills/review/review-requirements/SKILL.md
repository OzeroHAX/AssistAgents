---
name: review-requirements
description: Analyze task descriptions, tickets, and requirements for clarity, completeness, and feasibility.
---
<skill_overview>
  <purpose>Ensure that the task or requirement definition is clear, complete, and actionable before or during implementation.</purpose>
  <triggers>
    <trigger>User asks to review a task description or ticket.</trigger>
    <trigger>User provides a requirements document for a code review.</trigger>
    <trigger>Analyzing a PR description against the implemented code.</trigger>
  </triggers>
</skill_overview>

<checklist_requirements_quality>
  <item><strong>Clarity</strong>: Is the goal of the task unambiguous? Can it be interpreted in multiple ways?</item>
  <item><strong>Acceptance Criteria</strong>: Are there clear "Definition of Done" criteria? (Given/When/Then is preferred).</item>
  <item><strong>Scope Boundaries</strong>: Is it clear what is IN scope and what is OUT of scope?</item>
  <item><strong>Context</strong>: Is the "Why" (user value/business goal) explained?</item>
  <item><strong>Technical Feasibility</strong>: Are there obvious technical blockers or missing dependencies mentioned?</item>
  <item><strong>Edge Cases</strong>: Does the task consider error states, empty states, or boundary conditions?</item>
</checklist_requirements_quality>

<analysis_workflow>
  <step>Identify the core user value/problem statement.</step>
  <step>Check for missing information (e.g., designs, API specs, error handling behavior).</step>
  <step>Identify potential contradictions or logical gaps.</step>
  <step>Suggest specific improvements or clarifying questions.</step>
</analysis_workflow>

<implementation_verification>
  <description>When reviewing code against a task:</description>
  <check>Does the code cover ALL acceptance criteria?</check>
  <check>Does the code handle the edge cases mentioned in the task?</check>
  <check>Did the implementation drift from the original requirement? (Scope creep or missing features).</check>
</implementation_verification>

<common_gaps>
  <gap><strong>"Happy Path" Bias</strong>: Task only describes what happens when everything goes right.</gap>
  <gap><strong>Vague Terms</strong>: Using words like "fast", "better", "user-friendly" without metrics.</gap>
  <gap><strong>Missing UI/UX</strong>: "Add a button" without stating where, what it looks like, or loading states.</gap>
  <gap><strong>Data Migration</strong>: Forgetting about existing data when changing schemas.</gap>
</common_gaps>
