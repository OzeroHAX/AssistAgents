---
name: coder-csharp-security
description: C#/.NET security best practices. Use when handling untrusted input, secrets, or cryptography.
---
<skill_overview>
  <purpose>Reduce security risk with safe APIs, validation, and proper crypto usage</purpose>
  <triggers>
    <trigger>Validating external input</trigger>
    <trigger>Working with secrets or tokens</trigger>
    <trigger>Using cryptography APIs</trigger>
    <trigger>Designing secure defaults</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/dotnet/standard/security/secure-coding-guidelines">Secure Coding Guidelines</source>
    <source url="https://learn.microsoft.com/en-us/dotnet/standard/security/cryptography-model">Cryptography Model</source>
  </sources>
</skill_overview>
<input_validation>
  <rules>
    <rule>Validate all input from untrusted sources</rule>
    <rule>Prefer allow-lists over deny-lists</rule>
    <rule>Fail fast with clear validation errors</rule>
  </rules>
</input_validation>
<secrets_handling>
  <rules>
    <rule>Never hardcode secrets in source code</rule>
    <rule>Do not log secrets or tokens</rule>
    <rule>Use environment variables or secret stores for secrets</rule>
  </rules>
</secrets_handling>
<cryptography>
  <rules>
    <rule>Use high-level algorithms: Aes, HMACSHA256/512, RSA/ECDsa</rule>
    <rule>Use RandomNumberGenerator for secure randomness</rule>
    <rule>Prefer one-shot hashing APIs for simplicity</rule>
  </rules>
  <example>
    <code>
using System.Security.Cryptography;

byte[] bytes = new byte[32];
RandomNumberGenerator.Fill(bytes);
    </code>
  </example>
</cryptography>
<unsafe_apis>
  <rules>
    <rule>Avoid BinaryFormatter and other obsolete serializers</rule>
    <rule>Prefer safe serializers with explicit schemas</rule>
  </rules>
</unsafe_apis>
<anti_patterns>
  <avoid name="string_secrets">Storing secrets in string literals</avoid>
  <avoid name="weak_random">Using Random for security tokens</avoid>
  <avoid name="no_validation">Trusting external input without validation</avoid>
</anti_patterns>
