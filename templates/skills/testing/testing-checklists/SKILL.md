---
name: testing-checklists
description: Creating checklists for regression, smoke, and feature testing. Use when organizing test coverage.
---
<skill_overview>
  <purpose>Create comprehensive checklists for structured manual testing and test coverage tracking</purpose>
  <triggers>
    <trigger>Creating regression test checklist</trigger>
    <trigger>Creating smoke test checklist</trigger>
    <trigger>Creating feature-specific checklist</trigger>
  </triggers>
</skill_overview>

<checklist_structure>
  <overview>Standard format for testing checklists</overview>
  <components>
    <component name="Checkbox">
      <description>Indicates item tested or not tested</description>
      <states>
        <state>[ ] - Not tested</state>
        <state>[x] - Tested and passed</state>
        <state>[!] - Tested and failed</state>
        <state>[~] - Tested with issues</state>
        <state>[?] - Blocked, cannot test</state>
      </states>
    </component>

    <component name="Description">
      <description>Clear description of what is being checked</description>
      <format>Action-oriented, specific, and observable</format>
    </component>

    <component name="Result">
      <description>Outcome of the check</description>
      <values>Pass, Fail, Partial, Blocked, N/A</values>
    </component>

    <component name="Notes">
      <description>Additional observations or issues</description>
      <use>Documenting specific problems, workarounds, or details</use>
    </component>

    <component name="Priority">
      <description>Importance level of the check</description>
      <values>Critical, High, Medium, Low</values>
    </component>
  </components>
</checklist_structure>

<checklist_types>
  <overview>Different types of checklists and their purposes</overview>

  <type name="Smoke Testing">
    <description>Quick sanity tests on main features to ensure system is stable enough for further testing</description>
    <characteristics>
      <characteristic>Tests critical paths only</characteristic>
      <characteristic>Fast to execute</characteristic>
      <characteristic>Covers happy paths</characteristic>
      <characteristic>Run after deployment or before full testing</characteristic>
    </characteristics>
    <when_to_use>
      <usage>After new deployment</usage>
      <usage>Before starting full regression test suite</usage>
      <usage>When system was down or had issues</usage>
      <usage>As first step in testing cycle</usage>
    </when_to_use>
  </type>

  <type name="Sanity Testing">
    <description>Focused tests on specific functionality that was changed or fixed</description>
    <characteristics>
      <characteristic>Tests specific changed features</characteristic>
      <characteristic>Narrower scope than smoke testing</characteristic>
      <characteristic>Targets bug fixes and new features</characteristic>
      <characteristic>Faster than full regression</characteristic>
    </characteristics>
    <when_to_use>
      <usage>After bug fix</usage>
      <usage>After feature implementation</usage>
      <usage>Before merging code changes</usage>
      <usage>When testing specific module</usage>
    </when_to_use>
  </type>

  <type name="Regression Testing">
    <description>Comprehensive tests to ensure existing functionality still works after changes</description>
    <characteristics>
      <characteristic>Covers all major functionality</characteristic>
      <characteristic>Tests previously working features</characteristic>
      <characteristic>Includes edge cases and negative scenarios</characteristic>
      <characteristic>Time-consuming but comprehensive</characteristic>
    </characteristics>
    <when_to_use>
      <usage>Before major release</usage>
      <usage>After significant changes</usage>
      <usage>Periodically to catch regressions</usage>
      <usage>When refactoring code</usage>
    </when_to_use>
  </type>

  <type name="Feature Checklist">
    <description>Comprehensive checklist for a specific feature or module</description>
    <characteristics>
      <characteristic>Covers all functionality of feature</characteristic>
      <characteristic>Includes positive and negative cases</characteristic>
      <characteristic>Tests integration points</characteristic>
      <characteristic>Used during feature development and QA</characteristic>
    </characteristics>
    <when_to_use>
      <usage>During feature development</usage>
      <usage>Before feature release</usage>
      <usage>For feature-specific regression</usage>
      <usage>For training new testers</usage>
    </when_to_use>
  </type>

  <type name="Cross-Browser Checklist">
    <description>Tests to verify application works across different browsers</description>
    <characteristics>
      <characteristic>Same tests on multiple browsers</characteristic>
      <characteristic>Focus on rendering and behavior differences</characteristic>
      <characteristic>Tests JavaScript, CSS, and user interactions</characteristic>
    </characteristics>
    <when_to_use>
      <usage>Before major release</usage>
      <usage>After major CSS/JS changes</usage>
      <usage>When browser-specific bugs reported</usage>
    </when_to_use>
  </type>

  <type name="Mobile Checklist">
    <description>Tests for mobile and tablet devices</description>
      <characteristic>Tests responsive design</characteristic>
      <characteristic>Tests touch interactions</characteristic>
      <characteristic>Tests performance on mobile</characteristic>
      <characteristic>Checks mobile-specific features</characteristic>
    </characteristics>
    <when_to_use>
      <usage>For responsive web applications</usage>
      <usage>After UI changes</usage>
      <usage>When mobile bugs reported</usage>
    </when_to_use>
  </type>
</checklist_types>

<organizing_checklists>
  <overview>Structuring checklists for clarity and efficiency</overview>

  <organization_principles>
    <principle>Group related checks together</principle>
    <principle>Order checks logically (happy paths first, then edge cases)</principle>
    <principle>Mark critical items clearly</principle>
    <principle>Keep checks focused and actionable</principle>
    <principle>Include both functional and non-functional checks</principle>
  </organization_principles>

  <common_sections>
    <section name="Pre-requisites">
      <description>Setup and configuration before testing</description>
      <examples>Environment setup, test data preparation, authentication</examples>
    </section>

    <section name="Happy Paths">
      <description>Positive test scenarios</description>
      <examples>Successful operations, valid inputs, normal usage</examples>
    </section>

    <section name="Negative Scenarios">
      <description>Error handling and invalid inputs</description>
      <examples>Empty fields, invalid formats, error messages</examples>
    </section>

    <section name="Edge Cases">
      <description>Boundary and corner cases</description>
      <examples>Maximum values, zero, special characters, concurrent operations</examples>
    </section>

    <section name="Integration">
      <description>Testing with other components</description>
      <examples>API calls, database interactions, external services</examples>
    </section>

    <section name="Security">
      <description>Security and permission checks</description>
      <examples>Authentication, authorization, input validation</examples>
    </section>

    <section name="Performance">
      <description>Load and response time checks</description>
      <examples>Page load time, API response time, large datasets</examples>
    </section>

    <section name="UI/UX">
      <description>User interface and experience checks</description>
      <examples>Layout, styling, usability, accessibility</examples>
    </section>
  </common_sections>
</organizing_checklists>

<prioritization>
  <overview>Marking checklist items by priority</overview>
  <priority_levels>
    <level name="Critical">
      <description>Must work, system unusable if failed</description>
      <examples>Login, authentication, core business logic, payment processing</examples>
      <action>Test first, block release if failed</action>
    </level>

    <level name="High">
      <description>Important feature, affects many users</description>
      <examples>Main workflows, common operations, frequently used features</examples>
      <action>Test early, serious if failed</action>
    </level>

    <level name="Medium">
      <description>Standard feature, affects some users</description>
      <examples>Secondary features, occasional operations</examples>
      <action>Test when time permits</action>
    </level>

    <level name="Low">
      <description>Minor feature, edge case, nice to have</description>
      <examples>Rarely used features, edge cases, minor UI issues</examples>
      <action>Test last or skip if time limited</action>
    </level>
  </priority_levels>
</prioritization>

<test_scenarios>
  <overview>Common test scenarios to include in checklists</overview>

  <scenario_category name="Authentication">
    <checks>
      <check>Login with valid credentials</check>
      <check>Login with invalid credentials</check>
      <check>Login with empty fields</check>
      <check>Forgot password flow</check>
      <check>Password reset functionality</check>
      <check>Logout functionality</check>
      <check>Session timeout</check>
      <check>Remember me functionality</check>
      <check>Social login (if applicable)</check>
    </checks>
  </scenario_category>

  <scenario_category name="Forms">
    <checks>
      <check>Submit with all valid data</check>
      <check>Submit with required fields empty</check>
      <check>Submit with invalid data formats</check>
      <check>Field length validation (min/max)</check>
      <check>Special character handling</check>
      <check>Reset/cancel form</check>
      <check>Form submission with network errors</check>
      <check>Form persistence after validation errors</check>
    </checks>
  </scenario_category>

  <scenario_category name="CRUD Operations">
    <checks>
      <check>Create new resource</check>
      <check>Read/view resource details</check>
      <check>Update existing resource</check>
      <check>Update specific fields</check>
      <check>Delete resource</check>
      <check>View list of resources</check>
      <check>Search/filter resources</check>
      <check>Sort resources</check>
    </checks>
  </scenario_category>

  <scenario_category name="API Responses">
    <checks>
      <check>Status codes are correct</check>
      <check>Response structure is valid</check>
      <check>Required fields present</check>
      <check>Data types match expectations</check>
      <check>Error messages are clear</check>
      <check>Pagination works correctly</check>
      <check>Rate limiting respected</check>
      <check>Authentication required properly</check>
    </checks>
  </scenario_category>

  <scenario_category name="UI/UX">
    <checks>
      <check>Layout correct on desktop</check>
      <check>Layout correct on mobile</check>
      <check>Layout correct on tablet</check>
      <check>Text is readable and properly formatted</check>
      <check>Buttons and links work correctly</check>
      <check>Modals and dialogs open/close correctly</check>
      <check>Loading indicators show appropriately</check>
      <check>Error messages are clear and helpful</check>
      <check>Success messages display correctly</check>
      <check>Navigation works as expected</check>
    </checks>
  </scenario_category>
</test_scenarios>

<cross_browser_testing_checklist>
  <overview>Browser-specific checks</overview>
  <browsers>
    <browser>Chrome</browser>
    <browser>Firefox</browser>
    <browser>Safari (Mac)</browser>
    <browser>Edge</browser>
  </browsers>
  <checks>
    <check>Layout renders correctly</check>
    <check>Styling applied as expected</check>
    <check>JavaScript functionality works</check>
    <check>Forms submit correctly</check>
    <check>Modals and popups display correctly</check>
    <check>Animations and transitions work</check>
    <check>Drag and drop works (if applicable)</check>
    <check>Audio/video plays correctly (if applicable)</check>
  </checks>
</cross_browser_testing_checklist>

<mobile_testing_checklist>
  <overview>Device-specific checks</overview>
  <device_types>
    <device>Mobile phone (portrait and landscape)</device>
    <device>Tablet (portrait and landscape)</device>
    <device>Desktop (various resolutions)</device>
  </device_types>
  <checks>
    <check>Responsive layout adapts correctly</check>
    <check>Horizontal scrolling avoided on mobile</check>
    <check>Touch targets large enough (min 44x44px)</check>
    <check>Zooming works correctly</check>
    <check>Scrolling works smoothly</check>
    <check>Hamburger menu appears on mobile</check>
    <check>Images resize appropriately</check>
    <check>Text is readable at mobile sizes</check>
    <check>Performance acceptable on mobile</check>
    <check>Touch interactions work correctly</check>
  </checks>
</mobile_testing_checklist>

<accessibility_checklist>
  <overview>Basic accessibility checks</overview>
  <checks>
    <check>Images have alt text</check>
    <check>Form labels are associated with inputs</check>
    <check>Focus order is logical</check>
    <check>All interactive elements are focusable</check>
    <check>Keyboard navigation works without mouse</check>
    <check>Color contrast meets minimum requirements</check>
    <check>Error messages are accessible to screen readers</check>
    <check>Heading hierarchy is correct (h1, h2, h3...)</check>
    <check>Links have descriptive text</check>
    <check>Dynamic content changes announced to screen readers</check>
    <check>No seizure-inducing flashing content</check>
  </checks>
</accessibility_checklist>

<performance_checklist>
  <overview>Performance-related checks</overview>
  <checks>
    <check>Page loads within acceptable time</check>
    <check>API responses are fast</check>
    <check>Large images optimized</check>
    <check>No console errors or warnings</check>
    <check>No memory leaks (check devtools)</check>
    <check>Animations are smooth (60fps)</check>
    <check>No layout thrashing</check>
    <check>Database queries are optimized</check>
    <check>Caching working correctly</check>
    <check>Bundle size is reasonable</check>
  </checks>
</performance_checklist>

<tracking_checklist_results>
  <overview>Documenting checklist execution</overview>
  <documentation>
    <field>Execution date and time</field>
    <field>Tester name</field>
    <field>Environment tested (staging, production, local)</field>
    <field>Browser/device information</field>
    <field>Overall result (Pass/Fail/Partial)</field>
    <field>Number of items passed/failed/blocked</field>
    <field>Links to bug reports for failed items</field>
    <field>Notes and observations</field>
    <field>Recommendations for next steps</field>
  </documentation>
</tracking_checklist_results>

<checklist_maintenance>
  <overview>Keeping checklists up to date</overview>
  <maintenance_tasks>
    <task>Add new checks for new features</task>
    <task>Remove checks for deprecated features</task>
    <task>Update checks when functionality changes</task>
    <task>Review and prioritize based on recent bugs</task>
    <task>Archive old versions before major changes</task>
    <task>Solicit feedback from testers on usability</task>
    <task>Keep checklists focused and manageable in size</task>
  </maintenance_tasks>
</checklist_maintenance>

<common_pitfalls>
  <overview>Mistakes to avoid when creating checklists</overview>
  <pitfall>
    <description>Checklists become too long and unwieldy</description>
    <consequence>Tests skip items or rush through</consequence>
    <solution>Split into smaller, focused checklists</solution>
  </pitfall>

  <pitfall>
    <description>Items are too vague or subjective</description>
    <consequence>Results vary between testers</consequence>
    <solution>Make items specific, observable, and verifiable</solution>
  </pitfall>

  <pitfall>
    <description>Checklists not updated when features change</description>
    <consequence>Testing outdated functionality, missing new features</consequence>
    <solution>Regular review and update cycle</solution>
  </pitfall>

  <pitfall>
    <description>No prioritization of items</description>
    <consequence>Critical items may be skipped when time is limited</consequence>
    <solution>Mark priority levels clearly</solution>
  </pitfall>

  <pitfall>
    <description>Checklist items not testable</description>
    <consequence>Items cannot be verified objectively</consequence>
    <solution>Ensure items are observable and measurable</solution>
  </pitfall>
</common_pitfalls>
