---
name: coder-typescript-error-handling
description: TypeScript error handling and validation best practices. Use when designing error types, handling exceptions, or modeling failures in TS.
---
<skill_overview>
  <purpose>Handle failures explicitly and safely with strong types</purpose>
  <triggers>
    <trigger>Throwing or catching errors</trigger>
    <trigger>Designing error types</trigger>
    <trigger>Modeling expected failures</trigger>
    <trigger>Validating external inputs</trigger>
  </triggers>
  <sources>
    <source url="https://www.typescriptlang.org/docs/handbook/2/narrowing.html">TypeScript Handbook - Narrowing</source>
    <source url="https://www.typescriptlang.org/tsconfig/useUnknownInCatchVariables.html">TSConfig useUnknownInCatchVariables</source>
  </sources>
</skill_overview>
<principles>
  <rule>Use exceptions for truly unexpected failures</rule>
  <rule>Model expected failures in the type system</rule>
  <rule>Never lose stack traces when rethrowing</rule>
  <rule>Validate at boundaries, trust inside</rule>
</principles>
<throwing>
  <rules>
    <rule>Throw Error objects, not strings or plain objects</rule>
    <rule>Use specific error classes with context</rule>
    <rule>Include cause when rethrowing</rule>
  </rules>
  <example>
    <code>
class ValidationError extends Error {
  public readonly field: string;

  constructor(field: string, message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ValidationError";
    this.field = field;
  }
}

function requireEmail(email: string | undefined): string {
  if (!email) {
    throw new ValidationError("email", "Email is required");
  }
  return email;
}
    </code>
  </example>
</throwing>
<catching>
  <rules>
    <rule>Use unknown in catch blocks and narrow explicitly</rule>
    <rule>Catch only what you can handle; rethrow the rest</rule>
    <rule>Never use "throw error"; use "throw" to preserve stack trace</rule>
  </rules>
  <example>
    <code>
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

try {
  await doWork();
} catch (error: unknown) {
  if (error instanceof ValidationError) {
    return { ok: false, message: error.message, field: error.field };
  }
  if (isError(error)) {
    throw error;
  }
  throw new Error("Unknown failure", { cause: error });
}
    </code>
  </example>
</catching>
<result_pattern>
  <description>Use a Result type for expected failures and business rules</description>
  <example>
    <code>
type Result&lt;T, E&gt; =
  | { ok: true; value: T }
  | { ok: false; error: E };

type CreateUserError =
  | { kind: "EmailInUse"; email: string }
  | { kind: "WeakPassword" };

function createUser(email: string, password: string): Result&lt;User, CreateUserError&gt; {
  if (!isStrongPassword(password)) {
    return { ok: false, error: { kind: "WeakPassword" } };
  }
  if (emailExists(email)) {
    return { ok: false, error: { kind: "EmailInUse", email } };
  }
  return { ok: true, value: { id: "u1", email } };
}
    </code>
  </example>
</result_pattern>
<validation>
  <rules>
    <rule>Validate external inputs (IO, APIs) as early as possible</rule>
    <rule>Use type guards or assertion functions to narrow types</rule>
  </rules>
  <example>
    <code>
function assertString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string") {
    throw new ValidationError(name, "Expected string");
  }
}

function parsePayload(payload: unknown) {
  assertString((payload as { id?: unknown }).id, "id");
  return { id: (payload as { id: string }).id };
}
    </code>
  </example>
</validation>
<anti_patterns>
  <avoid name="throw_string">throw "error"; // loses stack and metadata</avoid>
  <avoid name="string_matching">Matching on error.message text</avoid>
  <avoid name="swallow_errors">catch (e) { /* ignore */ }</avoid>
  <avoid name="any_catch">catch (e: any) { /* ... */ }</avoid>
</anti_patterns>
