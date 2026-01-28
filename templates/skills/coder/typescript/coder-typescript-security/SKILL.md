---
name: coder-typescript-security
description: TypeScript security best practices: input validation, safe APIs, and secure randomness. Use when handling untrusted data.
---
<skill_overview>
  <purpose>Reduce security risk by validating inputs and avoiding unsafe patterns</purpose>
  <triggers>
    <trigger>Parsing external input or JSON</trigger>
    <trigger>Handling user-provided data</trigger>
    <trigger>Generating tokens or identifiers</trigger>
    <trigger>Working with dynamic object keys</trigger>
  </triggers>
  <sources>
    <source url="https://www.typescriptlang.org/docs/handbook/2/narrowing.html">TypeScript Handbook - Narrowing</source>
    <source url="https://nodejs.org/api/crypto.html">Node.js Crypto</source>
  </sources>
</skill_overview>
<input_validation>
  <rules>
    <rule>Treat external input as unknown</rule>
    <rule>Validate shape and types at boundaries</rule>
    <rule>Use type guards or assertions to narrow</rule>
  </rules>
  <example>
    <code>
type UserPayload = { id: string; role: "admin" | "user" };

function isUserPayload(value: unknown): value is UserPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "role" in value
  );
}
    </code>
  </example>
</input_validation>
<dynamic_code>
  <rules>
    <rule>Never use eval or new Function</rule>
    <rule>Avoid setTimeout or setInterval with string arguments</rule>
  </rules>
</dynamic_code>
<prototype_pollution>
  <rules>
    <rule>Do not trust user-supplied object keys</rule>
    <rule>Use Object.create(null) for dictionaries</rule>
    <rule>Use hasOwnProperty checks for dynamic keys</rule>
  </rules>
  <example>
    <code>
const dict = Object.create(null) as { [key: string]: string };
const key = getUserKey();
if (Object.prototype.hasOwnProperty.call(dict, key)) {
  useValue(dict[key]);
}
    </code>
  </example>
</prototype_pollution>
<secure_randomness>
  <rules>
    <rule>Use crypto.randomUUID or crypto.randomBytes for tokens</rule>
    <rule>Never use Math.random for secrets</rule>
  </rules>
  <example>
    <code>
import { randomUUID } from "node:crypto";

const requestId = randomUUID();
    </code>
  </example>
</secure_randomness>
<anti_patterns>
  <avoid name="trusting_any">Casting external input to any</avoid>
  <avoid name="string_eval">Executing dynamic code from strings</avoid>
  <avoid name="weak_random">Using Math.random for secrets</avoid>
</anti_patterns>
