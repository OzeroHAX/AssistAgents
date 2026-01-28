---
name: coder-typescript-conventions
description: TypeScript coding conventions, naming rules, and type-system best practices. Use when writing or reviewing TS code, configuring strictness, or designing types.
---
<skill_overview>
  <purpose>Write idiomatic, type-safe TypeScript with consistent naming and strictness</purpose>
  <triggers>
    <trigger>Writing new TypeScript code</trigger>
    <trigger>Reviewing naming and style</trigger>
    <trigger>Designing types or public APIs</trigger>
    <trigger>Configuring tsconfig strictness</trigger>
  </triggers>
  <sources>
    <source url="https://github.com/microsoft/TypeScript/wiki/Coding-guidelines">TypeScript Coding Guidelines</source>
    <source url="https://www.typescriptlang.org/tsconfig/strict.html">TSConfig Strict Option</source>
    <source url="https://www.typescriptlang.org/docs/handbook/2/narrowing.html">TypeScript Handbook - Narrowing</source>
  </sources>
</skill_overview>
<naming_conventions>
  <rule name="PascalCase">
    <applies_to>Types, interfaces, classes, enums, enum members</applies_to>
    <examples>
      <example>type UserProfile = { id: string; email: string };</example>
      <example>interface HttpClient { request(url: string): Promise&lt;Response&gt;; }</example>
      <example>class OrderService { }</example>
      <example>enum OrderStatus { Pending, Completed }</example>
    </examples>
  </rule>
  <rule name="camelCase">
    <applies_to>Functions, methods, variables, parameters, properties</applies_to>
    <examples>
      <example>function calculateTotal(items: Item[]) { /* ... */ }</example>
      <example>const retryCount = 3;</example>
    </examples>
  </rule>
  <rule name="SCREAMING_SNAKE_CASE">
    <applies_to>Constants and literal configuration</applies_to>
    <examples>
      <example>const MAX_RETRY_COUNT = 3;</example>
    </examples>
  </rule>
  <rule name="no_interface_prefix">
    <applies_to>Interfaces</applies_to>
    <description>Do not prefix interfaces with "I"</description>
    <examples>
      <good>interface UserRepository { }</good>
      <bad>interface IUserRepository { }</bad>
    </examples>
  </rule>
  <rule name="file_naming">
    <applies_to>File names</applies_to>
    <description>Use kebab-case for file names</description>
    <examples>
      <good>user-profile.ts</good>
      <bad>UserProfile.ts</bad>
    </examples>
  </rule>
</naming_conventions>
<tsconfig_strictness>
  <rule priority="critical">Enable "strict": true for all new code</rule>
  <recommended_options>
    <option>strictNullChecks</option>
    <option>noImplicitAny</option>
    <option>noUncheckedIndexedAccess</option>
    <option>exactOptionalPropertyTypes</option>
    <option>useUnknownInCatchVariables</option>
  </recommended_options>
  <example>
    <code>
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true
  }
}
    </code>
  </example>
</tsconfig_strictness>
<type_system_best_practices>
  <rule>Prefer "unknown" over "any" and narrow explicitly</rule>
  <rule>Use discriminated unions for variant data</rule>
  <rule>Write type guards for runtime checks</rule>
  <rule>Use "never" for exhaustive checks in switches</rule>
  <examples>
    <example title="Unknown vs any">
      <code>
function parseJson(input: string): unknown {
  return JSON.parse(input);
}

const value = parseJson("{\"id\":1}");
if (typeof value === "object" && value !== null && "id" in value) {
  // value is now narrowed
}
      </code>
    </example>
    <example title="Discriminated union">
      <code>
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size * shape.size;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
      </code>
    </example>
    <example title="Type guard">
      <code>
function isError(value: unknown): value is Error {
  return value instanceof Error;
}
      </code>
    </example>
  </examples>
</type_system_best_practices>
<immutability>
  <rules>
    <rule>Prefer const and readonly for shared data</rule>
    <rule>Use ReadonlyArray and readonly properties for inputs</rule>
    <rule>Use "as const" for literal inference</rule>
  </rules>
  <example>
    <code>
const roles = ["admin", "user"] as const;
type Role = typeof roles[number];

function setRole(userId: string, role: Role, flags: ReadonlyArray&lt;string&gt;) {
  // flags cannot be mutated here
}
    </code>
  </example>
</immutability>
<module_boundaries>
  <rules>
    <rule>Export explicit, stable APIs; keep helpers private</rule>
    <rule>Prefer named exports over default for consistency</rule>
    <rule>Avoid barrel files that hide dependencies in large codebases</rule>
  </rules>
</module_boundaries>
<anti_patterns>
  <avoid name="any_everywhere">Using "any" as a shortcut</avoid>
  <avoid name="optional_everything">Overusing optional properties instead of unions</avoid>
  <avoid name="loose_nulls">Mixing null and undefined without clear semantics</avoid>
</anti_patterns>
