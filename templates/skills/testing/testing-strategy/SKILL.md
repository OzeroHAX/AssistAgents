---
name: testing-strategy
description: Manual testing strategy and planning. Use when deciding what and how to test.
---
<skill_overview>
  <purpose>Plan and structure manual testing efforts effectively for maximum coverage and efficiency</purpose>
  <triggers>
    <trigger>Planning testing approach for new features</trigger>
    <trigger>Deciding between API and browser testing</trigger>
    <trigger>Organizing regression testing</trigger>
    <trigger>Prioritizing test scenarios</trigger>
  </triggers>
</skill_overview>

<testing_pyramid>
  <overview>Understanding the balance of different testing levels</overview>
  <levels>
    <level name="Manual Browser Tests (10%)">
      <purpose>End-to-end user flows through the UI</purpose>
      <when_to_use>Critical user paths, happy paths, key workflows</when_to_use>
      <characteristics>Slow, brittle, but closest to user experience</characteristics>
      <examples>Login flow, checkout process, registration</examples>
    </level>

    <level name="Manual API Tests (20%)">
      <purpose>Test API endpoints directly with curl</purpose>
      <when_to_use>API contracts, error handling, integration points</when_to_use>
      <characteristics>Faster than browser tests, focused on data and responses</characteristics>
      <examples>CRUD operations, authentication, error responses</examples>
    </level>

    <level name="Exploratory Testing (30%)">
      <purpose>Explore and discover issues without detailed scripts</purpose>
      <when_to_use>New features, finding edge cases, understanding behavior</when_to_use>
      <characteristics>Flexible, creative, finds unexpected issues</characteristics>
      <examples>Trying unusual inputs, combining features in novel ways</examples>
    </level>

    <level name="Checklists & Test Cases (40%)">
      <purpose>Structured, repeatable testing of documented scenarios</purpose>
      <when_to_use>Regression testing, feature coverage, documentation</when_to_use>
      <characteristics>Consistent, trackable, covers known scenarios</characteristics>
      <examples>Smoke tests, sanity tests, feature checklists</examples>
    </level>
  </levels>
</testing_pyramid>

<api_vs_browser_testing>
  <overview>When to test via API vs Browser</overview>

  <decision_factors>
    <factor name="Speed">
      <description>API tests are significantly faster than browser tests</description>
      <preference>Prefer API for speed, Browser for UX validation</preference>
    </factor>

    <factor name="Complexity">
      <description>Browser tests can test complex UI interactions</description>
      <preference>Browser for multi-step flows, API for single operations</preference>
    </factor>

    <factor name="Focus">
      <description>API tests focus on data, Browser tests focus on user experience</description>
      <preference>API for data validation, Browser for UI behavior</preference>
    </factor>

    <factor name="Stability">
      <description>API tests are less brittle than browser tests</description>
      <preference>API for regression, Browser for critical user paths</preference>
    </factor>

    <factor name="Coverage">
      <description>Browser tests cover frontend + backend together</description>
      <preference>Browser for end-to-end flows, API for backend logic</preference>
    </factor>
  </decision_factors>

  <use_api_testing_for>
    <scenario>CRUD operations (Create, Read, Update, Delete)</scenario>
    <scenario>Authentication and authorization</scenario>
    <scenario>Error handling and status codes</scenario>
    <scenario>Data validation and sanitization</scenario>
    <scenario>Performance testing of endpoints</scenario>
    <scenario>Testing integration with external services</scenario>
    <scenario>Batch operations and bulk actions</scenario>
    <scenario>Testing business logic directly</scenario>
  </use_api_testing_for>

  <use_browser_testing_for>
    <scenario>User flows and workflows</scenario>
    <scenario>UI interactions (clicks, forms, navigation)</scenario>
    <scenario>Visual regression and layout issues</scenario>
    <scenario>Responsive design and mobile testing</scenario>
    <scenario>Frontend state management</scenario>
    <scenario>User experience and usability</scenario>
    <scenario>Complex interactions (drag and drop, modals)</scenario>
    <scenario>Accessibility testing</scenario>
  </use_browser_testing_for>
</api_vs_browser_testing>

<exploratory_testing>
  <overview>Unstructured testing based on curiosity and experience</overview>
  <characteristics>
    <characteristic>No detailed test plan or scripts</characteristic>
    <characteristic>Tester designs tests on the fly</characteristic>
    <characteristic>Focuses on learning and discovery</characteristic>
    <characteristic>Finds edge cases and unexpected issues</characteristic>
  </characteristics>

  <when_to_use>
    <usage>Early in development when features are changing</usage>
    <usage>For new features to understand behavior</usage>
    <usage>When time is limited but need broad coverage</usage>
    <usage>After structured testing finds no issues</usage>
    <usage>For complex features that are hard to script</usage>
  </when_to_use>

  <exploratory_session_format>
    <field>Charter - Mission and focus of the session</field>
    <field>Timebox - Duration of the session (typically 60-90 minutes)</field>
    <field>Areas to explore - Specific modules or features to investigate</field>
    <field>Notes - Observations, bugs, questions</field>
    <field>Issues found - Bugs and defects discovered</field>
    <field>Follow-up - Questions for developers or further testing needs</field>
  </exploratory_session_format>

  <exploratory_techniques>
    <technique name="Error Guessing">
      <description>Based on experience, guess where errors might occur</description>
      <examples>Boundary values, unusual inputs, rapid operations</examples>
    </technique>

    <technique name="Data Flow Testing">
      <description>Follow data through the system</description>
      <examples>Check how data is stored, retrieved, transformed</examples>
    </technique>

    <technique name="State Testing">
      <description>Test different system states and transitions</description>
      <examples>Logged in vs logged out, empty vs full database</examples>
    </technique>

    <technique name="Scenario Testing">
      <description>Test realistic user scenarios</description>
      <examples>User cancels in middle of flow, uses back button</examples>
    </technique>
  </exploratory_techniques>
</exploratory_testing>

<smoke_testing>
  <overview>Quick validation that main functionality works</overview>
  <purpose>Determine if system is stable enough for detailed testing</purpose>
  <characteristics>
    <characteristic>Tests only critical paths</characteristic>
    <characteristic>Very fast to execute</characteristic>
    <characteristic>Tests happy paths only</characteristic>
    <characteristic>No deep edge case testing</characteristic>
  </characteristics>

  <when_to_run>
    <run>After new deployment</run>
    <run>Before starting full regression</run>
    <run>When system had critical issues</run>
    <run>As first test each day or session</run>
    <run>Before code merge</run>
  </when_to_run>

  <typical_smoke_test_scenarios>
    <scenario>Application loads and is accessible</scenario>
    <scenario>User can login</scenario>
    <scenario>Main navigation works</scenario>
    <scenario>Core CRUD operations work</scenario>
    <scenario>Database connection is stable</scenario>
    <scenario>External services are reachable</scenario>
  </typical_smoke_test_scenarios>

  <failure_criteria>
    <criterion>If smoke tests fail, do not proceed with detailed testing</criterion>
    <criterion>Report critical issues immediately</criterion>
    <criterion>Block deployment if smoke tests fail</criterion>
  </failure_criteria>
</smoke_testing>

<regression_testing>
  <overview>Comprehensive testing to ensure existing functionality still works</overview>
  <purpose>Find regressions introduced by new changes</purpose>
  <characteristics>
    <characteristic>Covers all major functionality</characteristic>
    <characteristic>Tests previously working features</characteristic>
    <characteristic>Includes edge cases and negative scenarios</characteristic>
    <characteristic>Time-consuming but comprehensive</characteristic>
  </characteristics>

  <when_to_run>
    <run>Before major release</run>
    <run>After significant code changes</run>
    <run>Periodically to catch subtle regressions</run>
    <run>After refactoring</run>
    <run>When fixing critical bugs</run>
  </when_to_run>

  <regression_strategy>
    <strategy name="Full Regression">
      <description>Test all features and functionality</description>
      <use>Before major releases or significant changes</use>
      <cost>High time investment</cost>
      <coverage>Maximum coverage</coverage>
    </strategy>

    <strategy name="Partial Regression">
      <description>Test only affected features and dependencies</description>
      <use>After targeted changes or bug fixes</use>
      <cost>Lower time investment</cost>
      <coverage>Targeted coverage</coverage>
    </strategy>

    <strategy name="Risk-Based Regression">
      <description>Prioritize high-risk and frequently used features</description>
      <use>When time is limited</use>
      <cost>Optimized time investment</cost>
      <coverage>Focused on critical areas</coverage>
    </strategy>
  </regression_strategy>

  <selecting_regression_tests>
    <criterion>Core business logic</criterion>
    <criterion>Frequently used features</criterion>
    <criterion>Previously buggy areas</criterion>
    <criterion>Complex functionality</criterion>
    <criterion>Integration points between modules</criterion>
    <criterion>High-risk areas (payments, authentication)</criterion>
  </selecting_regression_tests>
</regression_testing>

<sanity_testing>
  <overview>Focused testing on recently changed or fixed functionality</overview>
  <purpose>Verify that specific changes work as expected</purpose>
  <characteristics>
    <characteristic>Narrow scope, focused on changes</characteristic>
    <characteristic>Targets bug fixes and new features</characteristic>
    <characteristic>Faster than full regression</characteristic>
    <characteristic>May include related areas affected by changes</characteristic>
  </characteristics>

  <when_to_run>
    <run>After bug fix</run>
    <run>After feature implementation</run>
    <run>Before merging to main branch</run>
    <run>When testing specific module</run>
  </when_to_run>

  <sanity_testing_process>
    <step>Identify what was changed (code, configuration, data)</step>
    <step>Determine affected functionality</step>
    <step>Create focused test scenarios for changed areas</step>
    <step>Test both happy paths and edge cases</step>
    <step>Verify related features are not broken</step>
    <step>Document any issues found</step>
  </sanity_testing_process>
</sanity_testing>

<priority_based_testing>
  <overview>Testing based on importance when time is limited</overview>
  <prioritization_criteria>
    <criterion name="Business Impact">
      <description>How much business would be affected</description>
      <levels>Critical: Blocks business operations</levels>
      <levels>High: Major impact on users</levels>
      <levels>Medium: Moderate impact</levels>
      <levels>Low: Minor or rare impact</levels>
    </criterion>

    <criterion name="Frequency of Use">
      <description>How often the feature is used</description>
      <levels>Daily: Very frequent use</levels>
      <levels>Weekly: Regular use</levels>
      <levels>Monthly: Occasional use</levels>
      <levels>Rare: Infrequently used</levels>
    </criterion>

    <criterion name="User Impact">
      <description>Number of users affected</description>
      <levels>All users: Core feature for everyone</levels>
      <levels>Many users: Popular feature</levels>
      <levels>Some users: Niche feature</levels>
      <levels>Few users: Rarely used</levels>
    </criterion>

    <criterion name="Risk Level">
      <description>Risk of failure and consequences</description>
      <levels>Critical: Security, data loss, payments</levels>
      <levels>High: Major functionality broken</levels>
      <levels>Medium: Minor functionality broken</levels>
      <levels>Low: Minor issues or edge cases</levels>
    </criterion>
  </prioritization_criteria>

  <priority_matrix>
    <header>High business impact + High frequency = Critical priority</header>
    <header>High business impact + Low frequency = High priority</header>
    <header>Low business impact + High frequency = Medium priority</header>
    <header>Low business impact + Low frequency = Low priority</header>
  </priority_matrix>
</priority_based_testing>

<test_case_vs_checklist>
  <overview>Choosing between test cases and checklists</overview>

  <test_cases>
    <description>Detailed, scripted testing scenarios</description>
    <when_to_use>
      <use>For regression testing that needs to be repeatable</use>
      <use>When documenting exact steps and expectations</use>
      <use>For new testers or training</use>
      <use>When testing compliance or regulated scenarios</use>
      <use>For complex or critical functionality</use>
    </when_to_use>
    <advantages>Detailed, reproducible, trackable</advantages>
    <disadvantages>Time-consuming to create, may miss exploratory issues</disadvantages>
  </test_cases>

  <checklists>
    <description>Bulleted list of items to verify</description>
    <when_to_use>
      <use>For quick reference and guidance</use>
      <use>When testing speed is important</use>
      <use>For experienced testers who need reminders</use>
      <use>For smoke and sanity testing</use>
      <use>When flexibility in approach is needed</use>
    </when_to_use>
    <advantages>Fast, flexible, easy to create and maintain</advantages>
    <disadvantages>Less detailed, results vary between testers</disadvantages>
  </checklists>

  <guidelines>
    <guideline>Use test cases for critical, complex functionality</guideline>
    <guideline>Use checklists for quick reference and smoke tests</guideline>
    <guideline>Combine both - checklists for coverage, test cases for deep dives</guideline>
    <guideline>Start with checklists, convert to test cases for critical areas</guideline>
  </guidelines>
</test_case_vs_checklist>

<test_coverage>
  <overview>Assessing and managing test coverage</overview>
  <coverage_dimensions>
    <dimension name="Feature Coverage">
      <description>Percentage of features tested</description>
      <measurement>Count tested features / total features</measurement>
      <target>Core features: 100%, Secondary features: 80-90%</target>
    </dimension>

    <dimension name="Scenario Coverage">
      <description>Percentage of test scenarios covered</description>
      <measurement>Count executed scenarios / total documented scenarios</measurement>
      <target>Critical scenarios: 100%, Normal scenarios: 80-90%</target>
    </dimension>

    <dimension name="Path Coverage">
      <description>Percentage of code paths tested</description>
      <measurement>Count tested paths / total possible paths</measurement>
      <target>Happy paths: 100%, Edge cases: 70-80%</target>
    </dimension>
  </coverage_dimensions>

  <coverage_strategies>
    <strategy name="Coverage by Module">
      <description>Track coverage per module or feature</description>
      <benefit>Identify untested modules easily</benefit>
    </strategy>

    <strategy name="Coverage by Risk">
      <description>Prioritize high-risk areas for full coverage</description>
      <benefit>Focus on most critical functionality</benefit>
    </strategy>

    <strategy name="Coverage by User Journey">
      <description>Map coverage to user workflows</description>
      <benefit>Ensure key user paths are fully tested</benefit>
    </strategy>
  </coverage_strategies>
</test_coverage>

<time_management>
  <overview>Managing testing time effectively</overview>
  <strategies>
    <strategy name="Timeboxing">
      <description>Allocate fixed time for testing activities</description>
      <examples>60 minutes for exploratory testing, 30 minutes for smoke tests</examples>
      <benefit>Prevents over-testing, ensures coverage of multiple areas</benefit>
    </strategy>

    <strategy name="Session-Based Testing">
      <description>Organize testing into focused sessions</description>
      <examples>Morning session: API testing, Afternoon session: UI testing</examples>
      <benefit>Structured approach, clear goals per session</benefit>
    </strategy>

    <strategy name="MVP Testing">
      <description>Test minimum viable set first</description>
      <examples>Test happy paths, then edge cases, then negative scenarios</examples>
      <benefit>Ensure core functionality works before detailed testing</benefit>
    </strategy>

    <strategy name="Risk-Based Prioritization">
      <description>Test high-risk items first</description>
      <examples>Critical bugs > Major bugs > Minor bugs</examples>
      <benefit>Most important issues found and addressed first</benefit>
    </strategy>
  </strategies>
</time_management>

<planning_a_testing_session>
  <overview>How to structure a testing session</overview>
  <steps>
    <step number="1">
      <name>Understand the Goal</name>
      <description>What needs to be tested and why</description>
      <examples>New feature, bug fix verification, regression testing</examples>
    </step>

    <step number="2">
      <name>Gather Information</name>
      <description>Requirements, design docs, previous bugs</description>
      <examples>Read tickets, check PR descriptions, review issues</examples>
    </step>

    <step number="3">
      <name>Choose Approach</name>
      <description>Decide on testing method</description>
      <examples>API vs Browser, Structured vs Exploratory</examples>
    </step>

    <step number="4">
      <name>Create or Select Artifacts</name>
      <description>Test cases, checklists, or exploratory charter</description>
      <examples>Use existing test cases, create new checklist, define charter</examples>
    </step>

    <step number="5">
      <name>Set Up Environment</name>
      <description>Prepare testing environment and data</description>
      <examples>Get test accounts, prepare test data, configure environment</examples>
    </step>

    <step number="6">
      <name>Execute Testing</name>
      <description>Run tests and document results</description>
      <examples>Follow test cases, work through checklist, explore</examples>
    </step>

    <step number="7">
      <name>Report Results</name>
      <description>Document findings and bugs</description>
      <examples>Create bug reports, update test case status, write summary</examples>
    </step>
  </steps>
</planning_a_testing_session>

<collaboration>
  <overview>Working effectively with developers and other testers</overview>
  <collaboration_points>
    <point>Clarify requirements before testing begins</point>
    <point>Ask questions about expected behavior</point>
    <point>Provide clear bug reports with steps to reproduce</point>
    <point>Communicate blocking issues immediately</point>
    <point>Verify bug fixes promptly after deployment</point>
    <point>Share testing knowledge and insights</point>
    <point>Participate in code reviews when appropriate</point>
    <point>Provide feedback on testability of features</point>
  </collaboration_points>
</collaboration>
