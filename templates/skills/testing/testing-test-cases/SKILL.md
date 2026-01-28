---
name: testing-test-cases
description: Creating and documenting test cases for manual testing. Use when documenting test scenarios.
---
<skill_overview>
  <purpose>Create well-structured test cases that are clear, reproducible, and maintainable</purpose>
  <triggers>
    <trigger>Documenting test scenarios</trigger>
    <trigger>Creating test case specifications</trigger>
    <trigger>Reviewing test case quality</trigger>
  </triggers>
</skill_overview>

<test_case_structure>
  <overview>Standard fields in a test case</overview>
  <fields>
    <field name="Test Case ID">
      <description>Unique identifier for the test case</description>
      <format>TC_MODULE_NUMBER (e.g., TC_AUTH_001, TC_ORD_012)</format>
      <purpose>Easy reference and tracking</purpose>
    </field>

    <field name="Title">
      <description>Clear, concise description of what is being tested</description>
      <format>Should start with verb, be specific and meaningful</format>
      <examples>
        <good>Verify user login with valid credentials</good>
        <good>Check password validation for weak password</good>
        <good>Test product search with empty results</good>
        <bad>Login test</bad>
        <bad>Test form</bad>
        <bad>Check it works</bad>
      </examples>
    </field>

    <field name="Priority">
      <description>Importance level of the test case</description>
      <values>
        <value>Critical - Must pass before release</value>
        <value>High - Important feature, should be tested</value>
        <value>Medium - Standard functionality</value>
        <value>Low - Edge cases, nice to test</value>
      </values>
    </field>

    <field name="Module">
      <description>Functional area or component being tested</description>
      <examples>Authentication, User Profile, Orders, Payments, Search</examples>
    </field>

    <field name="Pre-conditions">
      <description>State and requirements before test execution</description>
      <examples>
        <example>User account exists with email: test@example.com</example>
        <example>User is logged in with valid credentials</example>
        <example>Database contains at least one product</example>
        <example>Application is running and accessible</example>
      </examples>
    </field>

    <field name="Test Steps">
      <description>Detailed, numbered sequence of actions</description>
      <guidelines>
        <guideline>Each step should be clear and unambiguous</guideline>
        <guideline>Steps should be ordered and sequential</guideline>
        <guideline>Include navigation details (page names, URLs)</guideline>
        <guideline>Specify element identifiers (IDs, labels, placeholders)</guideline>
        <guideline>Include data to be entered in forms</guideline>
      </guidelines>
    </field>

    <field name="Test Data">
      <description>Specific data values used in the test</description>
      <types>
        <type>Input values - Data entered into forms or fields</type>
        <type>Test credentials - Usernames, passwords, tokens</type>
        <type>URLs - Specific endpoints or pages</type>
        <type>IDs - Resource identifiers for lookup/update/delete</type>
      </types>
    </field>

    <field name="Expected Result">
      <description>What should happen if the system works correctly</description>
      <guidelines>
        <guideline>Be specific and observable</guideline>
        <guideline>Include UI changes, redirects, messages</guideline>
        <guideline>Verify both successful outcomes and error cases</guideline>
        <guideline>Check data persistence if applicable</guideline>
      </guidelines>
    </field>

    <field name="Actual Result">
      <description>What actually happened during test execution</description>
      <purpose>Documented after running the test</purpose>
      <fill>Filled during test execution</fill>
    </field>

    <field name="Status">
      <description>Test outcome after execution</description>
      <values>
        <value>Pass - Test passed as expected</value>
        <value>Fail - Test failed, system did not behave as expected</value>
        <value>Blocked - Cannot execute due to defect or dependency</value>
        <value>Skipped - Not executed, intentionally omitted</value>
        <value>Not Run - Not yet executed</value>
      </values>
    </field>

    <field name="Defect ID">
      <description>Link to bug report if test failed</description>
      <format>BUG-123, JIRA-456, etc.</format>
    </field>

    <field name="Notes/Comments">
      <description>Additional observations, issues, or recommendations</description>
      <examples>Workarounds found, additional edge cases discovered</examples>
    </field>
  </fields>
</test_case_structure>

<test_case_template>
  <overview>Standard template for test case documentation</overview>
  <format>
    <section>Test Case ID: TC_MODULE_XXX</section>
    <section>Title: [Clear description of what is tested]</section>
    <section>Priority: [Critical/High/Medium/Low]</section>
    <section>Module: [Functional area]</section>
    <section>Designed By: [Author name]</section>
    <section>Date: [Creation date]</section>
    <separator/>
    <section>Pre-conditions:</section>
    <list>
      <item>Pre-condition 1</item>
      <item>Pre-condition 2</item>
    </list>
    <separator/>
    <section>Test Steps:</section>
    <list>
      <item>1. [Action description]</item>
      <item>2. [Action description]</item>
      <item>3. [Action description]</item>
    </list>
    <separator/>
    <section>Test Data:</section>
    <list>
      <item>Field: value</item>
      <item>Field: value</item>
    </list>
    <separator/>
    <section>Expected Result:</section>
    <list>
      <item>Expected outcome 1</item>
      <item>Expected outcome 2</item>
    </list>
    <separator/>
    <section>Actual Result: [Filled during execution]</section>
    <section>Status: [Pass/Fail/Blocked/Skipped/Not Run]</section>
    <section>Defect ID: [If failed]</section>
    <section>Notes: [Additional observations]</section>
  </format>
</test_case_template>

<writing_test_steps>
  <overview>Best practices for writing test steps</overview>
  <guidelines>
    <guideline>Be specific and precise in descriptions</guideline>
    <guideline>Use clear, simple language</guideline>
    <guideline>One action per step</guideline>
    <guideline>Include navigation details (which page, which section)</guideline>
    <guideline>Specify exact data to enter</guideline>
    <guideline>Identify elements clearly (buttons, links, fields)</guideline>
    <guideline>Number steps sequentially</guideline>
    <guideline>Keep steps at appropriate granularity</guideline>
  </guidelines>

  <examples>
    <example type="good">
      <step>1. Navigate to /login page</step>
      <step>2. Enter "test@example.com" in email field</step>
      <step>3. Enter "Password123!" in password field</step>
      <step>4. Click "Login" button</step>
      <step>5. Verify redirect to /dashboard page</step>
    </example>
    <example type="bad">
      <step>1. Login</step>
      <step>2. Fill form</step>
      <step>3. Submit</step>
      <step>4. Check if it works</step>
    </example>
  </examples>
</writing_test_steps>

<defining_expected_results>
  <overview>Writing clear and verifiable expected results</overview>
  <guidelines>
    <guideline>Describe observable outcomes</guideline>
    <guideline>Be specific about what to check</guideline>
    <guideline>Include UI changes, page redirects, messages</guideline>
    <guideline>Verify data persistence when applicable</guideline>
    <guideline>Check multiple aspects where relevant</guideline>
  </guidelines>

  <examples>
    <example type="good">
      User is redirected to /dashboard page
      User's full name is displayed in header
      Session cookie is set
      Success message "Welcome back!" is shown
    </example>
    <example type="bad">
      It works
      Everything is fine
      Login successful
    </example>
  </examples>
</defining_expected_results>

<pre_conditions>
  <overview>Documenting required state before test execution</overview>
  <types>
    <type name="User State">
      <description>User account status and data</description>
      <examples>User exists, user is active, user has specific role</examples>
    </type>

    <type name="Application State">
      <description>Application configuration and status</description>
      <examples>Application is running, feature is enabled, database is accessible</examples>
    </type>

    <type name="Data State">
      <description>Required data in system</description>
      <examples>Product exists in catalog, order has specific status, user has permissions</examples>
    </type>

    <type name="Environment State">
      <description>Environment and configuration</description>
      <examples>Running on staging environment, API endpoints are accessible, test data is available</examples>
    </type>
  </types>

  <examples>
    <example>User account exists with email: test@example.com and password: Password123!</example>
    <example>User is logged out</example>
    <example>Database contains at least one product with ID: 123</example>
    <example>Application is accessible at http://localhost:3000</example>
    <example>Payment gateway is in test mode</example>
  </examples>
</pre_conditions>

<test_data_management>
  <overview>Managing test data in test cases</overview>
  <considerations>
    <consideration>Use generic test data when possible</consideration>
    <consideration>Avoid hard-coded production data</consideration>
    <consideration>Document data dependencies between tests</consideration>
    <consideration>Specify where data comes from (pre-created, generated, API)</consideration>
  </considerations>

  <data_types>
    <type name="Static Data">
      <description>Fixed values that don't change</description>
      <examples>Email addresses, usernames, product names</examples>
    </type>

    <type name="Dynamic Data">
      <description>Data generated or fetched during test</description>
      <examples>Timestamps, random IDs, generated user data</examples>
    </type>

    <type name="Pre-existing Data">
      <description>Data already in system before test</description>
      <examples>Existing users, products, orders</examples>
    </type>
  </data_types>
</test_data_management>

<test_case_classification>
  <overview>Categorizing test cases for better organization</overview>

  <category name="By Functionality">
    <description>Group tests by feature or module</description>
    <examples>Authentication, User Management, Orders, Payments, Search</examples>
  </category>

  <category name="By Type">
    <description>Classify by test type</description>
    <types>
      <type>Functional - Tests specific functionality</type>
      <type>Regression - Verify existing features after changes</type>
      <type>Smoke - Quick sanity tests on main features</type>
      <type>Sanity - Focused tests on specific functionality</type>
      <type>Integration - Tests between components</type>
      <type>UI - Tests visual aspects and user experience</type>
    </types>
  </category>

  <category name="By Priority">
    <description>Organize by importance</description>
    <types>
      <type>Critical - Core functionality, must work</type>
      <type>High - Important features</type>
      <type>Medium - Standard features</type>
      <type>Low - Edge cases, minor features</type>
    </types>
  </category>

  <category name="By Complexity">
    <description>Group by complexity level</description>
    <types>
      <type>Simple - Single step, straightforward</type>
      <type>Moderate - Multiple steps, some conditions</type>
      <type>Complex - Many steps, multiple conditions</type>
    </types>
  </category>
</test_case_classification>

<test_case_review>
  <overview>Quality criteria for test cases</overview>
  <quality_checklist>
    <check>Test case ID is unique and follows naming convention</check>
    <check>Title clearly describes what is being tested</check>
    <check>Priority is appropriate for the feature</check>
    <check>Pre-conditions are clearly stated</check>
    <check>Test steps are clear, sequential, and unambiguous</check>
    <check>Each step describes a single action</check>
    <check>Test data is specified where needed</check>
    <check>Expected results are specific and verifiable</check>
    <check>Test case is independent and can run alone</check>
    <check>Test case is reproducible by another tester</check>
  </quality_checklist>
</test_case_review>

<linking_test_cases>
  <overview>Connecting related test cases</overview>
  <relationships>
    <relationship name="Dependency">
      <description>Test case requires another test to pass first</description>
      <example>Test "Create order" depends on "Create user"</example>
    </relationship>

    <relationship name="Related">
      <description>Tests cover related functionality</description>
      <example>Login tests are related to registration tests</example>
    </relationship>

    <relationship name="Duplicate">
      <description>Tests cover same scenario</description>
      <action>Consider merging or clarifying differences</action>
    </relationship>
  </relationships>
</linking_test_cases>

<versioning_test_cases>
  <overview>Managing test case changes over time</overview>
  <considerations>
    <consideration>Update test cases when requirements change</consideration>
    <consideration>Archive outdated test cases instead of deleting</consideration>
    <consideration>Track version history for audits</consideration>
    <consideration>Communicate changes to team</consideration>
  </considerations>
</versioning_test_cases>
