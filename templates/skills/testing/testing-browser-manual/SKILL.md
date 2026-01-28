---
name: testing-browser-manual
description: Manual browser testing with Chrome DevTools MCP. Use when testing web applications through browser automation.
---
<skill_overview>
  <purpose>Test web applications manually through browser automation using Chrome DevTools MCP</purpose>
  <triggers>
    <trigger>Opening web pages and navigating</trigger>
    <trigger>Interacting with UI elements (click, type, select)</trigger>
    <trigger>Taking screenshots for verification</trigger>
    <trigger>Inspecting page elements and network requests</trigger>
  </triggers>
</skill_overview>

<page_navigation>
  <overview>Navigating through web pages</overview>
  <actions>
    <action name="Open URL">
      <description>Navigate to a specific web address</description>
      <considerations>
        <consideration>Wait for page to fully load before interacting</consideration>
        <consideration>Check for redirects and final URL</consideration>
        <consideration>Handle both HTTP and HTTPS protocols</consideration>
      </considerations>
    </action>

    <action name="Back">
      <description>Go back to previous page in history</description>
      <use>Verifying browser back button functionality</use>
    </action>

    <action name="Forward">
      <description>Go forward in history after going back</description>
      <use>Verifying browser forward button functionality</use>
    </action>

    <action name="Refresh">
      <description>Reload current page</description>
      <use>Checking data updates, clearing cache issues</use>
    </action>
  </actions>
</page_navigation>

<element_locators>
  <overview>Methods to find elements on a page</overview>
  <locator_type name="ID">
    <description>Find element by unique ID attribute</description>
    <advantages>Fast, reliable, single match</advantages>
    <limitations>ID must be unique and stable</limitations>
    <usage>Prefer when available and unique</usage>
  </locator_type>

  <locator_type name="CSS Selector">
    <description>Find element using CSS syntax</description>
    <examples>
      <example>.classname - Elements with specific class</example>
      <example>elementname - All elements with tag name</example>
      <example>#id - Element with specific ID</example>
      <example>[attribute="value"] - Elements with specific attribute</example>
      <example>parent > child - Direct child element</example>
      <example>ancestor descendant - Nested descendant</example>
    </examples>
    <advantages>Flexible, powerful, browser-supported</advantages>
    <limitations>Can be brittle if page structure changes</limitations>
  </locator_type>

  <locator_type name="XPath">
    <description>Find element using XPath expression</description>
    <examples>
      <example>//div[@class="test"] - Element with specific class</example>
      <example>//button[contains(text(), "Submit")] - Button containing text</example>
      <example>//input[@id="email"] - Element with specific ID</example>
      <example>//a[@href="/login"] - Link with specific href</example>
    </examples>
    <advantages>Can navigate DOM tree, supports complex conditions</advantages>
    <limitations>Slower than CSS, can be brittle</limitations>
  </locator_type>

  <locator_type name="Text Content">
    <description>Find element by visible text</description>
    <usage>Good for buttons, links, labels with unique text</usage>
    <limitations>Not reliable if text changes frequently</limitations>
  </locator_type>

  <locator_type name="Data Attributes">
    <description>Find element using data-* attributes</description>
    <advantages>Intended for testing, stable across changes</advantages>
    <examples>data-testid="submit-button", data-test="email-input"</examples>
  </locator_type>
</element_locators>

<element_interaction>
  <overview>Interacting with different types of page elements</overview>
  <interaction_type name="Click">
    <description>Trigger click event on element</description>
    <applies_to>Buttons, links, checkboxes, radio buttons</applies_to>
    <considerations>
      <consideration>Ensure element is visible and enabled before clicking</consideration>
      <consideration>Element may have event handlers that prevent click</consideration>
      <consideration>Click may trigger navigation, modal, or in-page action</consideration>
    </considerations>
  </interaction_type>

  <interaction_type name="Type/Enter Text">
    <description>Input text into field</description>
    <applies_to>Text inputs, textareas, contenteditable elements</applies_to>
    <considerations>
      <consideration>Clear existing text if needed before typing</consideration>
      <consideration>Field may have character limits or validation</consideration>
      <consideration>Special characters and formatting may be handled differently</consideration>
    </considerations>
  </interaction_type>

  <interaction_type name="Select">
    <description>Select option from dropdown or list</description>
    <applies_to>select elements, list boxes, custom dropdowns</applies_to>
    <considerations>
      <consideration>Select by value, text, or index depending on element type</consideration>
      <consideration>Selection may trigger dependent fields or validation</consideration>
    </considerations>
  </interaction_type>

  <interaction_type name="Check/Uncheck">
    <description>Toggle checkbox state</description>
    <applies_to>Checkbox inputs</applies_to>
    <considerations>
      <consideration>Checkbox may be read-only or disabled</consideration>
      <consideration>Toggling may trigger dependent fields</consideration>
    </considerations>
  </interaction_type>

  <interaction_type name="Radio Button">
    <description>Select radio button in group</description>
    <applies_to>Radio button inputs</applies_to>
    <considerations>
      <consideration>Selecting one radio button deselects others in same group</consideration>
      <consideration>Radio buttons may be read-only or disabled</consideration>
    </considerations>
  </interaction_type>

  <interaction_type name="Upload File">
    <description>Upload file through file input</description>
    <applies_to>File input elements</applies_to>
    <considerations>
      <consideration>File size and type restrictions may apply</consideration>
      <consideration>Upload may trigger progress indicator or validation</consideration>
    </considerations>
  </interaction_type>
</element_interaction>

<form_testing>
  <overview>Testing form functionality</overview>
  <test_scenarios>
    <scenario name="Empty Fields">
      <description>Submit form with required fields empty</description>
      <expected>Validation errors shown, form not submitted</expected>
    </scenario>

    <scenario name="Invalid Data">
      <description>Submit form with invalid format (email, phone, etc.)</description>
      <expected>Validation errors for invalid fields</expected>
    </scenario>

    <scenario name="Valid Data">
      <description>Submit form with all valid data</description>
      <expected>Form submitted successfully, confirmation shown</expected>
    </scenario>

    <scenario name="Partial Data">
      <description>Submit form with some optional fields filled</description>
      <expected>Form accepted if required fields are valid</expected>
    </scenario>

    <scenario name="Maximum Length">
      <description>Enter maximum allowed characters in fields</description>
      <expected>Characters limited or accepted if within limit</expected>
    </scenario>

    <scenario name="Special Characters">
      <description>Enter special characters and unicode</description>
      <expected>Characters properly handled or validated</expected>
    </scenario>

    <scenario name="Reset/Cancel">
      <description>Click reset or cancel button</description>
      <expected>Form cleared or submission cancelled</expected>
    </scenario>
  </test_scenarios>

  <validation_checks>
    <check>Required field indicators visible</check>
    <check>Validation messages appear in correct location</check>
    <check>Messages clearly describe what is wrong</check>
    <check>Field highlights indicate validation status</check>
    <check>Submit button disabled until valid (if applicable)</check>
    <check>Form data persists after validation errors</check>
    <check>Confirmation message or redirect after successful submit</check>
  </validation_checks>
</form_testing>

<dynamic_content>
  <overview>Handling pages with dynamic content</overview>
  <challenges>
    <challenge>Content loads asynchronously via AJAX</challenge>
    <challenge>Elements appear/disappear based on interactions</challenge>
    <challenge>Spinners and loading indicators</challenge>
    <challenge>Infinite scroll and lazy loading</challenge>
  </challenges>

  <strategies>
    <strategy name="Wait for Element">
      <description>Wait until element becomes visible/interactive</description>
      <consideration>Use explicit waits, avoid fixed timeouts</consideration>
    </strategy>

    <strategy name="Check Loading State">
      <description>Wait for loading indicators to disappear</description>
      <indicators>Spinners, skeletons, progress bars</indicators>
    </strategy>

    <strategy name="Poll for Content">
      <description>Periodically check if expected content appears</description>
      <consideration>Set maximum wait time to avoid infinite loops</consideration>
    </strategy>

    <strategy name="Scroll to Element">
      <description>Scroll page to bring element into view</description>
      <use>For elements below fold or in scrollable containers</use>
    </strategy>
  </strategies>
</dynamic_content>

<screenshots>
  <overview>Taking and using screenshots for testing</overview>
  <use_cases>
    <use_case name="Visual Verification">
      <description>Capture current page state for visual inspection</description>
      <examples>After form submit, on error page, after action</examples>
    </use_case>

    <use_case name="Bug Documentation">
      <description>Capture evidence of visual bugs or issues</description>
      <examples>Layout issues, incorrect colors, missing elements</examples>
    </use_case>

    <use_case name="Progress Tracking">
      <description>Document test progress and coverage</description>
      <examples>Pages visited, states reached, steps completed</examples>
    </use_case>

    <use_case name="Regression Testing">
      <description>Compare current state to baseline screenshots</description>
      <examples>Before and after changes, A/B testing</examples>
    </use_case>
  </use_cases>

  <best_practices>
    <practice>Take screenshot at relevant points, not after every action</practice>
    <practice>Include descriptive filename indicating context</practice>
    <practice>Capture full page or relevant section based on need</practice>
    <practice>Use screenshots in bug reports with clear descriptions</practice>
    <practice>Consider device orientation and viewport size</practice>
  </best_practices>
</screenshots>

<inspect_elements>
  <overview>Using browser inspection tools for testing</overview>
  <inspections>
    <inspection name="DOM Structure">
      <description>View HTML structure and element hierarchy</description>
      <use>Finding locators, understanding page structure</use>
    </inspection>

    <inspection name="Computed Styles">
      <description>View applied CSS styles for element</description>
      <use>Checking layout, colors, fonts, spacing</use>
    </inspection>

    <inspection name="Element Attributes">
      <description>View all attributes of element</description>
      <use>Finding data attributes, IDs, classes, custom attributes</use>
    </inspection>

    <inspection name="Box Model">
      <description>View margin, border, padding dimensions</description>
      <use>Debugging layout issues</use>
    </inspection>

    <inspection name="Event Listeners">
      <description>View attached event handlers</description>
      <use>Understanding element behavior</use>
    </inspection>
  </inspections>
</inspect_elements>

<network_monitoring>
  <overview>Monitoring network requests and responses</overview>
  <information_available>
    <info>Request URL and method</info>
    <info>Request headers (including authentication)</info>
    <info>Request body (POST/PUT/PATCH)</info>
    <info>Response status code</info>
    <info>Response headers</info>
    <info>Response body and timing</info>
    <info>Request/response size</info>
  </information_available>

  <use_cases>
    <use_case>Verify API requests are triggered correctly</use_case>
    <use_case>Check authentication tokens in headers</use_case>
    <use_case>Debug failing API calls with error details</use_case>
    <use_case>Monitor performance and load times</use_case>
    <use_case>Verify data sent in requests</use_case>
  </use_cases>
</network_monitoring>

<console_logs>
  <overview>Checking browser console for errors and logs</overview>
  <log_types>
    <type name="Errors">
      <description>JavaScript errors and exceptions</description>
      <significance>Indicates broken functionality or bugs</significance>
    </type>

    <type name="Warnings">
      <description>Non-critical issues or deprecated usage</description>
      <significance>May indicate future problems</significance>
    </type>

    <type name="Info/Log">
      <description>General informational messages</description>
      <significance>Useful for debugging and tracing</significance>
    </type>
  </log_types>

  <checks>
    <check>Page loads without JavaScript errors</check>
    <check>Actions do not trigger new errors</check>
    <check>Warnings are understood and acceptable</check>
    <check>Error messages provide useful debugging information</check>
    <check>Check for 404/500 errors in Network tab alongside Console</check>
  </checks>
</console_logs>

<accessibility_deep_dive>
  <overview>Essential accessibility checks for manual testing</overview>
  <tools>
    <tool>Chrome DevTools > Lighthouse</tool>
    <tool>Accessibility Tree inspector</tool>
  </tools>
  <critical_checks>
    <check name="Keyboard Navigation">
      <action>Use ONLY Tab and Enter/Space</action>
      <verify>Focus indicator is always visible</verify>
      <verify>No keyboard traps</verify>
      <verify>Order is logical (top-left to bottom-right)</verify>
    </check>
    <check name="Screen Reader Basics">
      <action>Inspect ARIA labels</action>
      <verify>Buttons have discernible text (not just icons)</verify>
      <verify>Inputs have associated labels</verify>
    </check>
    <check name="Visuals">
      <action>Check color contrast</action>
      <verify>Text meets WCAG AA (4.5:1)</verify>
      <verify>Zoom page to 200% - layout shouldn't break</verify>
    </check>
  </critical_checks>
</accessibility_deep_dive>

<cookies_and_storage>
  <overview>Verifying cookies and browser storage</overview>
  <storage_types>
    <type name="Cookies">
      <description>HTTP cookies for session management</description>
      <checks>
        <check>Session cookie set after login</check>
        <check>Cookie expiration time appropriate</check>
        <check>Secure and HttpOnly flags set for sensitive cookies</check>
        <check>Cookies sent with subsequent requests</check>
      </checks>
    </type>

    <type name="Local Storage">
      <description>Persistent client-side storage</description>
      <checks>
        <check>User preferences saved correctly</check>
        <check>Data persists across sessions</check>
        <check>Data cleared appropriately on logout</check>
      </checks>
    </type>

    <type name="Session Storage">
      <description>Temporary client-side storage</description>
      <checks>
        <check>Data available during session</check>
        <check>Data cleared on tab close</check>
      </checks>
    </type>
  </storage_types>
</cookies_and_storage>

<mobile_emulation>
  <overview>Testing on different device viewports</overview>
  <considerations>
    <consideration>Responsive layout adapts to different screen sizes</consideration>
    <consideration>Touch targets are large enough on mobile</consideration>
    <consideration>Horizontal scrolling avoided on mobile</consideration>
    <consideration>Navigation works with touch gestures</consideration>
  </considerations>

  <common_viewports>
    <viewport name="Desktop">1920x1080</viewport>
    <viewport name="Laptop">1366x768</viewport>
    <viewport name="Tablet">768x1024</viewport>
    <viewport name="Mobile">375x667</viewport>
  </common_viewports>
</mobile_emulation>

<cross_browser_testing>
  <overview>Testing across different browsers</overview>
  <browsers>
    <browser name="Chrome">Most common, modern features</browser>
    <browser name="Firefox">Different rendering engine, unique features</browser>
    <browser name="Safari">Mac/iOS default, stricter privacy features</browser>
    <browser name="Edge">Chromium-based with Microsoft integration</browser>
  </browsers>

  <common_differences>
    <difference>Default fonts and rendering</difference>
    <difference>CSS implementation variations</difference>
    <difference>JavaScript engine differences</difference>
    <difference>Autocomplete and form behavior</difference>
  </common_differences>
</cross_browser_testing>

<testing_workflows>
  <overview>Common testing workflows and scenarios</overview>
  <workflow name="User Registration">
    <steps>
      <step>Navigate to registration page</step>
      <step>Fill in registration form</step>
      <step>Submit form</step>
      <step>Verify confirmation or email sent</step>
      <step>Optional: Verify email received</step>
    </steps>
  </workflow>

  <workflow name="User Login">
    <steps>
      <step>Navigate to login page</step>
      <step>Enter credentials</step>
      <step>Submit form</step>
      <step>Verify redirect to dashboard</step>
      <step>Verify user name displayed</step>
      <step>Verify session cookie set</step>
    </steps>
  </workflow>

  <workflow name="Complete Purchase">
    <steps>
      <step>Browse products</step>
      <step>Add item to cart</step>
      <step>Navigate to cart</step>
      <step>Review cart contents</step>
      <step>Proceed to checkout</step>
      <step>Enter shipping information</step>
      <step>Select payment method</step>
      <step>Complete payment</step>
      <step>Verify order confirmation</step>
    </steps>
  </workflow>
</testing_workflows>

<common_issues>
  <overview>Common issues encountered in browser testing</overview>
  <issue>
    <description>Element not interactable</description>
    <solutions>
      <solution>Element may be hidden or obscured by other elements</solution>
      <solution>Element may have opacity or visibility set to hidden</solution>
      <solution>May need to scroll element into view first</solution>
    </solutions>
  </issue>

  <issue>
    <description>Element not found</description>
    <solutions>
      <solution>Locator may be incorrect or outdated</solution>
      <solution>Element may be in iframe or shadow DOM</solution>
      <solution>Element may load dynamically</solution>
      <solution>Page may still be loading</solution>
    </solutions>
  </issue>

  <issue>
    <description>Test timing issues</description>
    <solutions>
      <solution>Explicit waits instead of fixed timeouts</solution>
      <solution>Wait for specific conditions, not arbitrary time</solution>
      <solution>Check for loading indicators before proceeding</solution>
    </solutions>
  </issue>

  <issue>
    <description>Flaky tests</description>
    <solutions>
      <solution>Ensure tests are independent and isolated</solution>
      <solution>Clean up state between tests</solution>
      <solution>Avoid hard-coded data and timestamps</solution>
      <solution>Use stable locators that don't change</solution>
    </solutions>
  </issue>
</common_issues>

<accessibility_testing>
  <overview>Basic accessibility checks during browser testing</overview>
  <checks>
    <check>Images have alt text</check>
    <check>Form labels are associated with inputs</check>
    <check>Focus order is logical</check>
    <check>Keyboard navigation works without mouse</check>
    <check>Color contrast meets minimum requirements</check>
    <check>Error messages are accessible to screen readers</check>
    <check>Heading hierarchy is correct</check>
    <check>Interactive elements are focusable</check>
  </checks>
</accessibility_testing>
