---
name: coder-rules-requirements
description: Requirement quality rules for coding tasks with traceable MUST/SHOULD and verifiable acceptance criteria.
---

<when_to_use>
  <trigger>Defining or validating coding task requirements before implementation</trigger>
  <trigger>Need to enforce definition of done and scope boundaries</trigger>
  <trigger>Need requirement-to-evidence traceability in reviews</trigger>
</when_to_use>

<normative_language>
  <rule>MUST indicates absolute requirement</rule>
  <rule>SHOULD indicates strong recommendation with documented exception</rule>
  <rule>MAY indicates optional behavior</rule>
</normative_language>

<input_requirements>
  <required>Task objective and in-scope boundaries</required>
  <required>Acceptance criteria with pass/fail expectations</required>
  <required>Quality gates (tests/lint/typecheck/security/perf as relevant)</required>
  <required>Constraints (security, compatibility, rollout, tooling)</required>
  <optional>Out-of-scope and future work notes</optional>
</input_requirements>

<requirement_categories>
  <category>Scope and intent</category>
  <category>Functional acceptance criteria</category>
  <category>Definition of done gates</category>
  <category>Constraints and guardrails</category>
  <category>Non-functional requirements</category>
  <category>Verification evidence</category>
</requirement_categories>

<writing_templates>
  <template>[REQ-ID] Subject MUST action under condition; verification command/result; evidence artifact</template>
  <template>[REQ-ID] Subject SHOULD behavior; allowed exception; compensating control</template>
  <template>[AC-ID] Given context, When action, Then expected observable result</template>
</writing_templates>

<quality_rules>
  <rule importance="critical">Every requirement is singular, unambiguous, and testable</rule>
  <rule importance="critical">Every AC maps to direct evidence in code/tests/behavior</rule>
  <rule importance="high">Out-of-scope changes are flagged explicitly</rule>
  <rule importance="high">NFRs are measurable when they affect release decisions</rule>
</quality_rules>

<checklist>
  <item>Requirements use explicit MUST/SHOULD/MAY intent</item>
  <item>Each REQ has verification method and evidence target</item>
  <item>AC coverage is complete and traceable</item>
  <item>DoD gates are declared before implementation starts</item>
  <item>Exceptions include rationale, owner, and expiration</item>
</checklist>

<do_not>
  <item importance="critical">Do not accept vague language like "improve" without metric</item>
  <item importance="high">Do not mix requirement and implementation preference without reason</item>
  <item importance="high">Do not mark done without traceability matrix</item>
</do_not>

<output_requirements>
  <requirement>Requirement table with REQ-ID, type, verification, evidence</requirement>
  <requirement>AC coverage matrix and uncovered gaps</requirement>
  <requirement>List of approved exceptions and compensating controls</requirement>
</output_requirements>

<references>
  <source url="https://www.rfc-editor.org/rfc/rfc2119.txt">RFC 2119</source>
  <source url="https://www.rfc-editor.org/rfc/rfc8174.txt">RFC 8174</source>
  <source url="https://scrumguides.org/scrum-guide.html">Scrum Guide (Definition of Done)</source>
  <source url="https://www.incose.org/docs/default-source/working-groups/requirements-wg/guidetowritingrequirements/incose_rwg_gtwr_v4_summary_sheet.pdf">INCOSE Requirements Writing Guide</source>
  <source url="https://iso25000.com/index.php/en/iso-25000-standards/iso-25010">ISO/IEC 25010 Overview</source>
  <source url="https://owasp.org/www-project-application-security-verification-standard/">OWASP ASVS</source>
</references>
