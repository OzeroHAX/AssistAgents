---
name: testing-api-manual
description: Manual REST API testing with curl commands. Use when testing API endpoints via bash.
---
<skill_overview>
  <purpose>Test REST API endpoints manually using curl and interpret responses correctly</purpose>
  <triggers>
    <trigger>Testing API endpoints with curl</trigger>
    <trigger>Validating HTTP status codes</trigger>
    <trigger>Testing authentication headers</trigger>
    <trigger>Checking JSON response structure</trigger>
  </triggers>
</skill_overview>

<http_methods>
  <overview>HTTP methods and their proper use in API testing</overview>
  <method name="GET">
    <purpose>Retrieve data from server</purpose>
    <use_cases>
      <case>Fetch a single resource by ID</case>
      <case>List all resources with optional filters</case>
      <case>Search and query data</case>
    </use_cases>
    <expectations>
      <expectation>Response is idempotent - same request returns same data</expectation>
      <expectation>No side effects on server</expectation>
      <expectation>Status code 200 (OK), 404 (Not Found), or 206 (Partial Content)</expectation>
    </expectations>
  </method>

  <method name="POST">
    <purpose>Create a new resource on server</purpose>
    <use_cases>
      <case>Create new user, product, order</case>
      <case>Submit forms and data</case>
      <case>Trigger server-side actions</case>
    </use_cases>
    <expectations>
      <expectation>Not idempotent - multiple requests create multiple resources</expectation>
      <expectation>Request body contains data to create</expectation>
      <expectation>Status code 201 (Created), 400 (Bad Request), or 409 (Conflict)</expectation>
      <expectation>Response includes Location header with new resource URL</expectation>
    </expectations>
  </method>

  <method name="PUT">
    <purpose>Replace entire resource with new data</purpose>
    <use_cases>
      <case>Full update of a resource</case>
      <case>Replace all fields of an object</case>
    </use_cases>
    <expectations>
      <expectation>Idempotent - same request produces same result</expectation>
      <expectation>Request body contains complete resource data</expectation>
      <expectation>Status code 200 (OK), 204 (No Content), or 404 (Not Found)</expectation>
    </expectations>
  </method>

  <method name="PATCH">
    <purpose>Partial update of a resource</purpose>
    <use_cases>
      <case>Update specific fields only</case>
      <case>Increment values, toggle flags</case>
    </use_cases>
    <expectations>
      <expectation>Not always idempotent - depends on operation</expectation>
      <expectation>Request body contains only fields to update</expectation>
      <expectation>Status code 200 (OK), 204 (No Content), or 400 (Bad Request)</expectation>
    </expectations>
  </method>

  <method name="DELETE">
    <purpose>Delete a resource from server</purpose>
    <use_cases>
      <case>Remove user, product, order</case>
      <case>Cancel deletion</case>
    </use_cases>
    <expectations>
      <expectation>Idempotent - deleting same resource twice has same result</expectation>
      <expectation>Status code 204 (No Content), 404 (Not Found), or 403 (Forbidden)</expectation>
      <expectation>Confirm destructive operations before executing</expectation>
    </expectations>
  </method>
</http_methods>

<request_chaining>
  <overview>Techniques to link multiple API requests into a workflow</overview>
  <concept>Capture outputs from one request to use as inputs for the next</concept>
  <common_flows>
    <flow name="Auth Flow">
      <step>Login -> Capture Token</step>
      <step>Use Token in Authorization header for protected routes</step>
    </flow>
    <flow name="CRUD Flow">
      <step>Create Resource -> Capture ID</step>
      <step>Get Resource (using ID)</step>
      <step>Update Resource (using ID)</step>
      <step>Delete Resource (using ID)</step>
    </flow>
  </common_flows>
  <implementation>
    <bash_example>
      # 1. Login and extract token (using jq)
      TOKEN=$(curl -s -X POST /login ... | jq -r .token)
      
      # 2. Use token
      curl -H "Authorization: Bearer $TOKEN" /api/profile
    </bash_example>
  </implementation>
</request_chaining>

<contract_validation>
  <overview>Verifying API responses against defined schemas</overview>
  <importance>Ensures frontend/backend sync and prevents integration bugs</importance>
  <checks>
    <check>Required fields are present</check>
    <check>Field types match (string vs number)</check>
    <check>Enums match allowed values</check>
    <check>Nullable fields are handled correctly</check>
  </checks>
  <tools>
    <tool>Manual: Visually compare response with TypeScript interface/Swagger</tool>
    <tool>Automated: Use `ajv` or `zod` in scripts to validate JSON</tool>
  </tools>
</contract_validation>

<data_generation_heuristics>
  <overview>Strategies for generating effective test data</overview>
  <strategy name="Boundary Testing">
    <description>Test values at the edges of valid ranges</description>
    <examples>
      <val>Empty strings: ""</val>
      <val>Max length strings</val>
      <val>Zero, negative numbers, max integer</val>
    </examples>
  </strategy>
  <strategy name="Fuzzing Lite">
    <description>Send unexpected data types</description>
    <examples>
      <val>Send number as string: "123"</val>
      <val>Send null where string expected</val>
      <val>Send boolean where int expected</val>
      <val>Send HTML/JS injection payloads</val>
    </examples>
  </strategy>
</data_generation_heuristics>

<status_codes>
  <overview>HTTP status codes and their meaning in API responses</overview>
  <category name="Success (2xx)">
    <code value="200">
      <meaning>OK - Request succeeded</meaning>
      <use>GET, PUT, PATCH responses with data</use>
    </code>
    <code value="201">
      <meaning>Created - Resource created successfully</meaning>
      <use>POST responses</use>
    </code>
    <code value="204">
      <meaning>No Content - Request succeeded but no response body</meaning>
      <use>DELETE, PUT responses</use>
    </code>
  </category>

  <category name="Redirection (3xx)">
    <code value="301">
      <meaning>Moved Permanently - Resource has new URL</meaning>
      <note>Use new URL for future requests</note>
    </code>
    <code value="302">
      <meaning>Found - Temporary redirect</meaning>
      <note>Continue using original URL</note>
    </code>
  </category>

  <category name="Client Error (4xx)">
    <code value="400">
      <meaning>Bad Request - Invalid request data</meaning>
      <check>Validate request body, headers, format</check>
    </code>
    <code value="401">
      <meaning>Unauthorized - Missing or invalid authentication</meaning>
      <check>Verify authentication token, credentials</check>
    </code>
    <code value="403">
      <meaning>Forbidden - Valid auth but insufficient permissions</meaning>
      <check>Verify user has required permissions</check>
    </code>
    <code value="404">
      <meaning>Not Found - Resource does not exist</meaning>
      <check>Verify URL and resource ID</check>
    </code>
    <code value="409">
      <meaning>Conflict - Resource already exists or conflicts with state</meaning>
      <check>Duplicate entry, version conflict</check>
    </code>
    <code value="422">
      <meaning>Unprocessable Entity - Valid format but semantic errors</meaning>
      <check>Business logic validation errors</check>
    </code>
    <code value="429">
      <meaning>Too Many Requests - Rate limit exceeded</meaning>
      <check>Wait or reduce request frequency</check>
    </code>
  </category>

  <category name="Server Error (5xx)">
    <code value="500">
      <meaning>Internal Server Error - Unhandled server error</meaning>
      <action>Check server logs, report to development</action>
    </code>
    <code value="502">
      <meaning>Bad Gateway - Invalid response from upstream server</meaning>
      <action>Check upstream service status</action>
    </code>
    <code value="503">
      <meaning>Service Unavailable - Server temporarily down</meaning>
      <action>Retry later or check status page</action>
    </code>
  </category>
</status_codes>

<request_headers>
  <overview>Common HTTP headers used in API requests</overview>
  <header name="Content-Type">
    <purpose>Specifies media type of request body</purpose>
    <common_values>
      <value>application/json - JSON data</value>
      <value>application/x-www-form-urlencoded - Form data</value>
      <value>multipart/form-data - File uploads</value>
      <value>text/plain - Plain text</value>
    </common_values>
  </header>

  <header name="Authorization">
    <purpose>Authentication credentials</purpose>
    <types>
      <type>Bearer {token} - JWT or OAuth token</type>
      <type>Basic {credentials} - Base64 encoded username:password</type>
      <type>ApiKey {key} - API key in header</type>
    </types>
  </header>

  <header name="Accept">
    <purpose>Specifies acceptable response format</purpose>
    <common_values>
      <value>application/json</value>
      <value>application/xml</value>
      <value>*/* - Any format</value>
    </common_values>
  </header>

  <header name="User-Agent">
    <purpose>Identifies client making request</purpose>
    <use>Server may respond differently based on client</use>
  </header>

  <header name="Accept-Encoding">
    <purpose>Specifies acceptable compression algorithms</purpose>
    <common_values>gzip, deflate, br</common_values>
  </header>

  <header name="If-None-Match">
    <purpose>ETag for conditional GET requests</purpose>
    <use>Caching - returns 304 if resource unchanged</use>
  </header>

  <header name="If-Match">
    <purpose>ETag for conditional PUT/PATCH requests</purpose>
    <use>Prevents lost updates - returns 412 if resource modified</use>
  </header>
</request_headers>

<response_headers>
  <overview>Important headers in API responses</overview>
  <header name="Content-Type">
    <purpose>Specifies media type of response body</purpose>
    <note>Verify matches expected format</note>
  </header>

  <header name="Content-Length">
    <purpose>Size of response body in bytes</purpose>
    <use>Verify response完整性</use>
  </header>

  <header name="Location">
    <purpose>URL of newly created or redirected resource</purpose>
    <use>After 201 Created or 3xx redirects</use>
  </header>

  <header name="ETag">
    <purpose>Identifier for response version</purpose>
    <use>For caching and conditional requests</use>
  </header>

  <header name="Cache-Control">
    <purpose>Directives for caching</purpose>
    <common_values>no-cache, max-age, private</common_values>
  </header>

  <header name="WWW-Authenticate">
    <purpose>Authentication challenge</purpose>
    <use>After 401 Unauthorized response</use>
  </header>

  <header name="X-RateLimit-Limit">
    <purpose>Maximum requests per time window</purpose>
    <use>For rate-limited APIs</use>
  </header>

  <header name="X-RateLimit-Remaining">
    <purpose>Remaining requests in current window</purpose>
    <use>For rate-limited APIs</use>
  </header>
</response_headers>

<authentication>
  <overview>Authentication methods commonly used in REST APIs</overview>
  <type name="Bearer Token">
    <description>JWT or OAuth access token in Authorization header</description>
    <workflow>
      <step>Obtain token from authentication endpoint</step>
      <step>Include token in Authorization header: Bearer {token}</step>
      <step>Refresh token before expiration if using refresh tokens</step>
    </workflow>
    <considerations>
      <consideration>Store token securely, not in version control</consideration>
      <consideration>Token may expire - check for 401 responses</consideration>
      <consideration>Some APIs require refresh token workflow</consideration>
    </considerations>
  </type>

  <type name="API Key">
    <description>Static key identifying client or application</description>
    <locations>
      <location>Header: X-API-Key: {key}</location>
      <location>Header: Authorization: ApiKey {key}</location>
      <location>Query parameter: api_key={key}</location>
    </locations>
    <considerations>
      <consideration>Key may be tied to IP or rate limits</consideration>
      <consideration>Do not expose key in client-side code</consideration>
      <consideration>Rotate keys periodically for security</consideration>
    </considerations>
  </type>

  <type name="Basic Auth">
    <description>Username and password encoded in Base64</description>
    <workflow>
      <step>Combine username:password</step>
      <step>Encode to Base64</step>
      <step>Include in Authorization header: Basic {encoded_credentials}</step>
    </workflow>
    <considerations>
      <consideration>Not secure over HTTP - use HTTPS only</consideration>
      <consideration>Credentials sent with every request</consideration>
      <consideration>Consider using session tokens instead</consideration>
    </considerations>
  </type>

  <type name="Session Cookies">
    <description>Server-managed session with cookie</description>
    <workflow>
      <step>Login via POST to authentication endpoint</step>
      <step>Server returns session cookie</step>
      <step>Include cookie in subsequent requests</step>
    </workflow>
    <considerations>
      <consideration>Cookie must be stored and sent with requests</consideration>
      <consideration>May have expiration time</consideration>
      <consideration>CSRF tokens may be required for state-changing requests</consideration>
    </considerations>
  </type>
</authentication>

<json_response_validation>
  <overview>Validating JSON response structure and content</overview>
  <structure_checks>
    <check name="Valid JSON">
      <description>Response body is valid JSON format</description>
      <signs_of_error>Unclosed braces, unquoted keys, trailing commas</signs_of_error>
    </check>

    <check name="Expected Fields Present">
      <description>Required fields exist in response</description>
      <examples>id, name, created_at, status</examples>
    </check>

    <check name="Data Types Match">
      <description>Field types match expectations</description>
      <types>
        <type>String - text values</type>
        <type>Number - integers and floats</type>
        <type>Boolean - true/false</type>
        <type>Array - list of objects</type>
        <type>Object - nested structure</type>
        <type>Null - empty/missing value</type>
      </types>
    </check>

    <check name="Field Values Valid">
      <description>Values are within expected ranges or constraints</description>
      <examples>Status is one of valid statuses, dates are in correct format, IDs are non-zero</examples>
    </check>
  </structure_checks>

  <nested_objects>
    <description>Validating nested JSON structures</description>
    <steps>
      <step>Identify nested objects or arrays in response</step>
      <step>Verify nested structure matches expected schema</step>
      <step>Check required fields within nested objects</step>
      <step>Validate array contents if present</step>
    </steps>
  </nested_objects>

  <pagination>
    <description>Handling paginated API responses</description>
    <patterns>
      <pattern>offset/limit parameters</pattern>
      <pattern>page/per_page parameters</pattern>
      <pattern>cursor-based pagination with next/prev links</pattern>
    </patterns>
    <checks>
      <check>Total count field present</check>
      <check>Current page/offset matches request</check>
      <check>Next/previous page links if applicable</check>
      <check>Array size matches requested limit</check>
    </checks>
  </pagination>
</json_response_validation>

<error_responses>
  <overview>Interpreting and handling API error responses</overview>
  <response_structure>
    <field name="error">String error message</field>
    <field name="message">Detailed explanation of error</field>
    <field name="code">Machine-readable error code</field>
    <field name="details">Array of validation errors or additional context</field>
    <field name="timestamp">When error occurred</field>
    <field name="path">Which endpoint or field caused error</field>
  </response_structure>

  <validation_errors>
    <description>4xx errors due to invalid input</description>
    <signs>
      <sign>Array of field-specific errors</sign>
      <sign>Field names in error messages</sign>
      <sign>Specific validation rules mentioned (required, format, length)</sign>
    </signs>
  </validation_errors>

  <server_errors>
    <description>5xx errors due to server issues</description>
    <actions>
      <action>Check if issue is reproducible</action>
      <action>Note timestamp and request details</action>
      <action>Report to development team with reproduction steps</action>
      <action>Check server status pages if available</action>
    </actions>
  </server_errors>
</error_responses>

<rate_limiting>
  <overview>Dealing with rate-limited APIs</overview>
  <indicators>
    <indicator>HTTP 429 status code</indicator>
    <indicator>Retry-After header present</indicator>
    <indicator>X-RateLimit-* headers in response</indicator>
  </indicators>

  <strategies>
    <strategy name="Wait and Retry">
      <description>Wait for time specified in Retry-After header</description>
      <consideration>Use exponential backoff if Retry-After not provided</consideration>
    </strategy>

    <strategy name="Reduce Request Frequency">
      <description>Slow down request rate to stay within limits</description>
      <consideration>Monitor X-RateLimit-Remaining header</consideration>
    </strategy>

    <strategy name="Batch Requests">
      <description>Combine multiple operations into single request if API supports</description>
      <consideration>Reduces total request count</consideration>
    </strategy>
  </strategies>
</rate_limiting>

<testing_safety>
  <overview>Safety guidelines for manual API testing</overview>
  <rules>
    <rule>Confirm before running POST/PUT/PATCH/DELETE on production URLs</rule>
    <rule>Use test or staging environments when available</rule>
    <rule>Use non-destructive test data</rule>
    <rule>Check for data deletion or modification after destructive tests</rule>
    <rule>Never commit authentication tokens or API keys to version control</rule>
    <rule>Be cautious with endpoints that affect billing or payments</rule>
    <rule>Test authentication and authorization thoroughly before modifying data</rule>
    <rule>Document any destructive tests for proper cleanup</rule>
  </rules>
</testing_safety>

<common_pitfalls>
  <overview>Mistakes to avoid when manually testing APIs</overview>
  <pitfall>
    <description>Assuming 200 status means success without checking response body</description>
    <consequence>Errors may be in response body even with 200 status</consequence>
  </pitfall>

  <pitfall>
    <description>Not checking Content-Type header</description>
    <consequence>Response may be different format than expected</consequence>
  </pitfall>

  <pitfall>
    <description>Ignoring authentication token expiration</description>
    <consequence>Tests fail intermittently with 401 errors</consequence>
  </pitfall>

  <pitfall>
    <description>Testing only success cases</description>
    <consequence>Error cases and edge cases remain untested</consequence>
  </pitfall>

  <pitfall>
    <description>Not documenting test parameters and results</description>
    <consequence>Difficult to reproduce issues or track progress</consequence>
  </pitfall>

  <pitfall>
    <description>Testing against production without proper precautions</description>
    <consequence>Real data may be modified or deleted</consequence>
  </pitfall>
</common_pitfalls>
