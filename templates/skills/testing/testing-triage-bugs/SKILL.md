---
name: testing-triage-bugs
description: Bug classification and documentation. Use when documenting defects found during testing.
---
<skill_overview>
  <purpose>Classify bugs effectively and write clear, reproducible bug reports</purpose>
  <triggers>
    <trigger>Documenting a bug found during testing</trigger>
    <trigger>Triaging bug reports</trigger>
    <trigger>Assigning severity and priority to defects</trigger>
  </triggers>
</skill_overview>

<bug_severity>
  <overview>Classifying bug impact on system functionality</overview>
  <levels>
    <level name="Critical">
      <description>Blocks main functionality or causes data loss</description>
      <criteria>
        <criterion>Application crashes completely</criterion>
        <criterion>Data loss or corruption</criterion>
        <criterion>Security vulnerability allowing data breach</criterion>
        <criterion>Payment processing fails</criterion>
        <criterion>Users cannot login or access system</criterion>
      </criteria>
      <action>Fix immediately, block release</action>
    </level>

    <level name="Major">
      <description>Significant feature doesn't work as expected</description>
      <criteria>
        <criterion>Core feature fails in common scenarios</criterion>
        <criterion>Important functionality is broken</criterion>
        <criterion>Workaround exists but is inconvenient</criterion>
        <criterion>Performance issues affecting many users</criterion>
      </criteria>
      <action>Fix soon, high priority</action>
    </level>

    <level name="Minor">
      <description>Minor issues that don't block functionality</description>
      <criteria>
        <criterion>Feature works but has minor issues</criterion>
        <criterion>UI/UX issues that don't affect functionality</criterion>
        <criterion>Documentation errors</criterion>
        <criterion>Inconvenient but acceptable workarounds</criterion>
      </criteria>
      <action>Fix in next release or when convenient</action>
    </level>

    <level name="Trivial">
      <description>Cosmetic issues or very minor problems</description>
      <criteria>
        <criterion>Spelling or grammar errors</criterion>
        <criterion>Minor UI inconsistencies</criterion>
        <criterion>Edge cases that rarely occur</criterion>
        <criterion>Issues with no impact on functionality</criterion>
      </criteria>
      <action>Fix when convenient, may defer</action>
    </level>
  </levels>
</bug_severity>

<bug_priority>
  <overview>Determining order of fixing bugs based on urgency</overview>
  <levels>
    <level name="P0 - Immediate">
      <description>Fix right now, stop everything else</description>
      <when>Critical production issues, security vulnerabilities, data loss</when>
    </level>

    <level name="P1 - High">
      <description>Fix as soon as possible</description>
      <when>Major functionality broken, high user impact, affecting many users</when>
    </level>

    <level name="P2 - Medium">
      <description>Fix in next release or sprint</description>
      <when>Minor issues, moderate user impact, acceptable workarounds</when>
    </level>

    <level name="P3 - Low">
      <description>Fix when convenient, may backlog</description>
      <when>Trivial issues, rare edge cases, cosmetic problems</when>
    </level>
  </levels>

  <priority_vs_severity>
    <note>Severity is about impact, Priority is about urgency</note>
    <examples>
      <example>Severity: Critical, Priority: P1 - Critical but no workaround, fix soon</example>
      <example>Severity: Major, Priority: P2 - Major issue but rare occurrence</example>
      <example>Severity: Minor, Priority: P1 - Minor but affecting many users</example>
    </examples>
  </priority_vs_severity>
</bug_priority>

<bug_report_template>
  <overview>Standard format for bug reports</overview>
  <sections>

    <section name="Summary">
      <description>Clear, concise title describing the bug</description>
      <guidelines>
        <guideline>Start with what is broken</guideline>
        <guideline>Include key details in title</guideline>
        <guideline>Keep under 80 characters if possible</guideline>
      </guidelines>
      <examples>
        <good>Login fails with "Invalid credentials" after correct password change</good>
        <good>Checkout button does nothing when cart has multiple items</good>
        <good>Application crashes when uploading image larger than 5MB</good>
        <bad>Login doesn't work</bad>
        <bad>Problem with checkout</bad>
        <bad>Bug in upload</bad>
      </examples>
    </section>

    <section name="Environment">
      <description>System and environment information</description>
      <fields>
        <field>Browser and version (e.g., Chrome 120.0.6099.109)</field>
        <field>Operating system (e.g., macOS 14.2, Windows 11)</field>
        <field>Device type (Desktop, Mobile, Tablet)</field>
        <field>Screen resolution (e.g., 1920x1080)</field>
        <field>Application URL or environment (Production, Staging, Local)</field>
        <field>Date and time of occurrence</field>
        <field>User role or account type (if applicable)</field>
      </fields>
    </section>

    <section name="Steps to Reproduce">
      <description>Detailed, step-by-step instructions to reproduce the bug</description>
      <guidelines>
        <guideline>Each step must be clear and unambiguous</guideline>
        <guideline>Include exact data entered</guideline>
        <guideline>Specify exact elements clicked or interacted with</guideline>
        <guideline>Include navigation details (pages, URLs)</guideline>
        <guideline>Steps should be reproducible by another person</guideline>
      </guidelines>
      <format>
        <step>1. Navigate to [URL/page]</step>
        <step>2. Click on [element]</step>
        <step>3. Enter [data] into [field]</step>
        <step>4. Click [button/link]</step>
        <step>5. Observe [result]</step>
      </format>
    </section>

    <section name="Actual Result">
      <description>What actually happened when following the steps</description>
      <guidelines>
        <guideline>Be specific and descriptive</guideline>
        <guideline>Include exact error messages</guideline>
        <guideline>Describe what is seen on screen</guideline>
        <guideline>Note any unexpected behavior</guideline>
      </guidelines>
      <examples>
        <example>User redirected to error page with message "500 Internal Server Error"</example>
        <example>Button does nothing, no error shown</example>
        <example>Form submits but data not saved, success message shown</example>
      </examples>
    </section>

    <section name="Expected Result">
      <description>What should have happened</description>
      <guidelines>
        <guideline>Describe correct behavior clearly</guideline>
        <guideline>Include what user should experience</guideline>
        <guideline>Reference requirements or design if applicable</guideline>
      </guidelines>
      <examples>
        <example>User should be redirected to dashboard</example>
        <example>Confirmation message should display</example>
        <example>Data should be saved and visible in list</example>
      </examples>
    </section>

    <section name="Screenshots/Videos">
      <description>Visual evidence of the bug</description>
      <types>
        <type>Screenshot of error or unexpected behavior</type>
        <type>Screenshot of the page where bug occurs</type>
        <type>Video demonstrating the bug (if applicable)</type>
        <type>Comparison screenshots (before/after) if visual regression</type>
      </types>
      <guidelines>
        <guideline>Include full visible area of issue</guideline>
        <guideline>Capture relevant error messages</guideline>
        <guideline>Use descriptive filenames</guideline>
        <guideline>Show context, not just the bug</guideline>
      </guidelines>
    </section>

    <section name="Logs">
      <description>Relevant console logs, server logs, or error messages</description>
      <types>
        <type>Browser console errors and warnings</type>
        <type>Network request/response details</type>
        <type>Server error logs (if accessible)</type>
        <type>Application logs with timestamps</type>
      </types>
      <guidelines>
        <guideline>Include full error messages</guideline>
        <guideline>Include stack traces if available</guideline>
        <guideline>Redact sensitive information (passwords, tokens)</guideline>
        <guideline>Include timestamps if relevant</guideline>
      </guidelines>
    </section>

    <section name="Additional Information">
      <description>Any other relevant details</description>
      <examples>
        <example>Bug is intermittent - occurs randomly</example>
        <example>Workaround exists: [describe workaround]</example>
        <example>First time bug observed, or regression?</example>
        <example>Number of users affected (if known)</example>
        <example>Frequency of occurrence</example>
      </examples>
    </section>
  </sections>
</bug_report_template>

<writing_effective_summaries>
  <overview>Best practices for bug report titles</overview>
  <guidelines>
    <guideline>Be specific and descriptive</guideline>
    <guideline>Include the feature or component</guideline>
    <guideline>Describe what is broken, not just "bug"</guideline>
    <guideline>Include key symptoms or error messages</guideline>
    <guideline>Keep it concise (under 80 characters ideal)</guideline>
    <guideline>Start with verb or noun (e.g., "Login fails", "Upload error")</guideline>
    <guideline>Avoid vague words like "issue", "problem", "doesn't work"</guideline>
  </guidelines>

  <examples>
    <good>Login form does not submit when email field contains "+" character</good>
    <good>Checkout page displays "undefined" when cart has 0 items</good>
    <good>Application crashes on iOS Safari when clicking "Upload" button</good>
    <good>Password reset link expires immediately after being sent</good>
    <good>User profile photo does not update after successful upload</good>

    <bad>Login doesn't work</bad>
    <bad>Checkout problem</bad>
    <bad>Upload button is broken</bad>
    <bad>Something is wrong with password</bad>
    <bad>Bug in profile</bad>
  </examples>
</writing_effective_summaries>

<writing_reproducible_steps>
  <overview>Creating clear, reproducible step-by-step instructions</overview>
  <guidelines>
    <guideline>Each step should be a single, clear action</guideline>
    <guideline>Number steps sequentially</guideline>
    <guideline>Be specific about elements clicked (IDs, labels, text)</guideline>
    <guideline>Include exact data entered in forms</guideline>
    <guideline>Specify navigation (page names, URLs)</guideline>
    <guideline>Include all necessary pre-conditions</guideline>
    <guideline>Test steps yourself before submitting</guideline>
  </guidelines>

  <example type="good">
    1. Navigate to http://localhost:3000/login
    2. Enter "test+special@example.com" in email field
    3. Enter "Password123!" in password field
    4. Click "Login" button
    5. Observe error message: "Invalid email format"
  </example>

  <example type="bad">
    1. Go to login
    2. Enter email and password
    3. Click login
    4. See error
  </example>
</writing_reproducible_steps>

<capturing_evidence>
  <overview>Collecting and documenting proof of bugs</overview>

  <screenshots>
    <purpose>Visual evidence of the bug</purpose>
    <when_to_take>
      <take>When visual UI issues are present</take>
      <take>When error messages are displayed</take>
      <take>When unexpected layout or styling occurs</take>
      <take>When before/after comparison is useful</take>
    </when_to_take>
    <guidelines>
      <guideline>Capture the full relevant area</guideline>
      <guideline>Show context, not just the bug</guideline>
      <guideline>Include error messages visible on screen</guideline>
      <guideline>Use descriptive filenames</guideline>
      <guideline>Redact sensitive information (passwords, tokens)</guideline>
    </guidelines>
  </screenshots>

  <videos>
    <purpose>Demonstrate bug behavior dynamically</purpose>
    <when_to_record>
      <record>When bug involves animations or transitions</record>
      <record>When bug is intermittent or hard to capture in screenshots</record>
      <record>When multiple steps need to be shown</record>
      <record>When interactions are complex</record>
    </when_to_record>
    <guidelines>
      <guideline>Keep videos short and focused</guideline>
      <guideline>Show clear steps to reproduce</guideline>
      <guideline>Highlight where the bug occurs</guideline>
      <guideline>Include audio commentary if helpful</guideline>
    </guidelines>
  </videos>

  <logs>
    <purpose>Technical details for developers</purpose>
    <types>
      <type>Browser console errors (JavaScript, network)</type>
      <type>Browser network tab (requests, responses, timing)</type>
      <type>Server logs (if available and accessible)</type>
      <type>Application logs with timestamps</type>
    </types>
    <guidelines>
      <guideline>Include full error messages and stack traces</guideline>
      <guideline>Include relevant request/response headers</guideline>
      <guideline>Include timestamps for time-related bugs</guideline>
      <guideline>Redact sensitive data (API keys, passwords)</guideline>
      <guideline>Include environment details</guideline>
    </guidelines>
  </logs>
</capturing_evidence>

<duplicate_detection>
  <overview>Determining if bug is already reported</overview>
  <checks>
    <check>Search for existing bugs with similar titles</check>
    <check>Review similar bugs in the same module</check>
    <check>Check if symptoms match known issues</check>
    <check>Verify if reported for same version/environment</check>
    <check>Check comments for workarounds or resolutions</check>
  </checks>

  <if_duplicate_found>
    <action>Add comment to existing bug with your findings</action>
    <action>Confirm the bug with your reproduction steps</action>
    <action>Add additional information if you have new details</action>
    <action>Note that you've reproduced the issue</action>
    <action>Link to the original bug in your notes</action>
  </if_duplicate_found>
</duplicate_detection>

<wishlist_vs_bug>
  <overview>Distinguishing between bugs and feature requests</overview>

  <bug>
    <description>Something doesn't work as expected or designed</description>
    <examples>
      <example>Feature crashes or produces errors</example>
      <example>Feature behavior differs from documentation</example>
      <example>Incorrect calculations or logic</example>
      <example>UI breaks or displays incorrectly</example>
    </examples>
  </bug>

  <wishlist>
    <description>New feature or enhancement request</description>
    <examples>
      <example>Add new functionality that doesn't exist</example>
      <example>Improve existing feature UX</example>
      <example>Add new integration or API</example>
      <example>Change how something works for better usability</example>
    </examples>
  </wishlist>

  <classification_guide>
    <question>Does it work differently than designed or documented? = Bug</question>
    <question>Is this about adding something new? = Wishlist</question>
    <question>Is this about improving something that works? = Wishlist</question>
    <question>Is this unexpected behavior or error? = Bug</question>
  </classification_guide>
</wishlist_vs_bug>

<bug_triage_process>
  <overview>Workflow for evaluating and prioritizing bugs</overview>
  <steps>
    <step number="1">Receive bug report</step>
    <step number="2">Check for duplicates</step>
    <step number="3">Reproduce the bug</step>
    <step number="4">Assign severity and priority</step>
    <step number="5">Categorize by component/module</step>
    <step number="6">Assign to developer or team</step>
    <step number="7">Set expected fix timeline</step>
    <step number="8">Track until resolved</step>
  </steps>
</bug_triage_process>

<verification_after_fix>
  <overview>Testing bugs after they are reported as fixed</overview>
  <steps>
    <step>Follow the original steps to reproduce</step>
    <step>Verify the bug no longer occurs</step>
    <step>Test related functionality to ensure no regressions</step>
    <step>Test edge cases around the fix</step>
    <step>Update bug report with verification status</step>
    <step>Mark as verified or reopen if bug persists</step>
  </steps>

  <verification_checklist>
    <check>Original issue is resolved</check>
    <check>No new issues introduced</check>
    <check>Related functionality still works</check>
    <check>Edge cases are covered</check>
    <check>No performance degradation</check>
  </verification_checklist>
</verification_after_fix>

<common_bug_reporting_mistakes>
  <overview>Mistakes to avoid when reporting bugs</overview>
  <mistake>
    <description>Vague summary title</description>
    <bad_example>"Something is wrong with login"</bad_example>
    <good_example>"Login button unresponsive after entering valid credentials"</good_example>
    <impact>Developers may misunderstand or ignore the bug</impact>
  </mistake>

  <mistake>
    <description>Incomplete or unclear steps to reproduce</description>
    <bad_example>"Try logging in, it doesn't work"</bad_example>
    <good_example>"1. Go to /login page, 2. Enter email 'test@example.com', 3. Click Login button"</good_example>
    <impact>Bug cannot be reproduced and is likely to be closed</impact>
  </mistake>

  <mistake>
    <description>Missing environment information</description>
    <impact>Developers cannot recreate the bug in their environment</impact>
  </mistake>

  <mistake>
    <description>No screenshots or visual evidence</description>
    <impact>Harder to understand and diagnose visual bugs</impact>
  </mistake>

  <mistake>
    <description>No expected result specified</description>
    <impact>Unclear what the correct behavior should be</impact>
  </mistake>

  <mistake>
    <description>Submitting duplicate bugs</description>
    <impact>Wastes time, creates confusion</impact>
  </mistake>

  <mistake>
    <description>Not testing before submitting</description>
    <impact>May report expected behavior as a bug</impact>
  </mistake>
</common_bug_reporting_mistakes>
