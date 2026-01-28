---
name: coder-csharp-conventions
description: C# coding conventions, naming rules, and modern language patterns (C# 10-12). Use when writing C# code, reviewing naming, or applying modern C# features like records, pattern matching, nullable reference types.
---
<skill_overview>
  <purpose>Ensure C# code follows Microsoft official guidelines and modern patterns</purpose>
  <triggers>
    <trigger>Writing new C# code</trigger>
    <trigger>Reviewing naming conventions</trigger>
    <trigger>Using modern C# features</trigger>
    <trigger>Refactoring legacy C# code</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions">Microsoft C# Coding Conventions</source>
    <source url="https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/identifier-names">Microsoft Identifier Naming</source>
    <source>Framework Design Guidelines (Cwalina &amp; Abrams)</source>
  </sources>
</skill_overview>
<naming_conventions>
  <rule name="PascalCase">
    <applies_to>Types, namespaces, public members, methods, properties, events, constants, enum values</applies_to>
    <examples>
      <example>public class UserService { }</example>
      <example>public void ProcessOrder() { }</example>
      <example>public string FirstName { get; set; }</example>
      <example>public const int MaxRetryCount = 3;</example>
      <example>public enum OrderStatus { Pending, Completed }</example>
    </examples>
  </rule>
  
  <rule name="camelCase">
    <applies_to>Parameters, local variables</applies_to>
    <examples>
      <example>void ProcessOrder(int orderId, string customerName)</example>
      <example>var itemCount = 0;</example>
      <example>var isValid = true;</example>
    </examples>
  </rule>
  
  <rule name="_camelCase">
    <applies_to>Private instance fields</applies_to>
    <examples>
      <example>private readonly ILogger _logger;</example>
      <example>private readonly IUserRepository _userRepository;</example>
      <example>private int _retryCount;</example>
    </examples>
  </rule>
  
  <rule name="s_camelCase">
    <applies_to>Private static fields</applies_to>
    <examples>
      <example>private static readonly HttpClient s_httpClient = new();</example>
      <example>private static int s_instanceCount;</example>
    </examples>
  </rule>
  
  <rule name="IPrefix">
    <applies_to>Interfaces</applies_to>
    <examples>
      <example>public interface IUserRepository { }</example>
      <example>public interface IOrderService { }</example>
    </examples>
  </rule>
  
  <rule name="TPrefix">
    <applies_to>Generic type parameters</applies_to>
    <examples>
      <example>public class Repository&lt;TEntity&gt; where TEntity : class</example>
      <example>public interface IHandler&lt;TRequest, TResponse&gt;</example>
    </examples>
  </rule>
  
  <rule name="AsyncSuffix">
    <applies_to>Async methods returning Task/ValueTask</applies_to>
    <examples>
      <example>public async Task&lt;User&gt; GetUserAsync(int id)</example>
      <example>public async Task SaveChangesAsync(CancellationToken ct)</example>
    </examples>
  </rule>
  <anti_patterns>
    <avoid reason="Outdated, reduces readability">Hungarian notation: strName, intCount, btnSubmit</avoid>
    <avoid reason="Unclear meaning">Abbreviations: usr, msg, btn, mgr, ctx</avoid>
    <avoid reason="Not descriptive">Single letters except loop counters: var x = GetUser();</avoid>
    <avoid reason="Redundant">Type in name: userString, orderList, countInt</avoid>
    <avoid reason="Inconsistent">Mixing styles: _UserName, userName, user_name</avoid>
  </anti_patterns>
</naming_conventions>
<modern_csharp_patterns>
  <pattern name="records">
    <description>Immutable reference types with value-based equality</description>
    <use_for>DTOs, API responses, value objects, immutable state</use_for>
    <not_for>Entities with identity, mutable domain objects</not_for>
    <examples>
      <example title="Simple record">
        <code>public record UserDto(string FirstName, string LastName, string Email);</code>
      </example>
      <example title="Record with additional members">
        <code>
public record OrderSummary(int Id, decimal Total, DateTimeOffset CreatedAt)
{
    public string FormattedTotal =&gt; Total.ToString("C");
}
        </code>
      </example>
      <example title="Record struct for performance">
        <code>public readonly record struct Point(int X, int Y);</code>
      </example>
    </examples>
  </pattern>
  
  <pattern name="primary_constructors">
    <description>Constructor parameters available throughout class body</description>
    <use_for>DI injection, simple initialization, reducing boilerplate</use_for>
    <examples>
      <example title="Service with DI">
        <code>
public class UserService(IUserRepository repository, ILogger&lt;UserService&gt; logger)
{
    public async Task&lt;User?&gt; GetUserAsync(int id)
    {
        logger.LogInformation("Getting user {Id}", id);
        return await repository.FindByIdAsync(id);
    }
}
        </code>
      </example>
      <example title="With property assignment">
        <code>
public class OrderProcessor(IOrderService orderService)
{
    public IOrderService OrderService { get; } = orderService;
}
        </code>
      </example>
    </examples>
  </pattern>
  
  <pattern name="required_members">
    <description>Enforce property initialization at construction</description>
    <use_for>Request/command objects, configuration, ensuring valid state</use_for>
    <examples>
      <example title="Required properties">
        <code>
public class CreateUserRequest
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    public string? DisplayName { get; init; }
}
// Usage: var request = new CreateUserRequest { Email = "...", Password = "..." };
        </code>
      </example>
      <example title="With SetsRequiredMembers">
        <code>
public class User
{
    [SetsRequiredMembers]
    public User(string email) =&gt; Email = email;
    
    public required string Email { get; init; }
}
        </code>
      </example>
    </examples>
  </pattern>
  
  <pattern name="nullable_reference_types">
    <description>Compiler-enforced null safety</description>
    <rules>
      <rule>Enable in project: &lt;Nullable&gt;enable&lt;/Nullable&gt;</rule>
      <rule>Use ? for nullable: string? optionalName</rule>
      <rule>Non-nullable by default: string requiredName</rule>
      <rule>Avoid ! operator - use proper null checks</rule>
    </rules>
    <examples>
      <example title="Nullable parameters and returns">
        <code>
public User? FindByEmail(string email);  // May return null
public User GetById(int id);              // Never returns null (throws if not found)
public void Process(string? input);       // Accepts null
        </code>
      </example>
      <example title="Null checking patterns">
        <code>
// Pattern matching
if (user is { Email: var email })
{
    SendEmail(email);
}
// Null coalescing
var name = user?.DisplayName ?? "Anonymous";
// Null conditional
var length = user?.Name?.Length ?? 0;
        </code>
      </example>
    </examples>
  </pattern>
  
  <pattern name="pattern_matching">
    <description>Declarative type checking and destructuring</description>
    <examples>
      <example title="Switch expression">
        <code>
var message = response switch
{
    { StatusCode: 200 } =&gt; "Success",
    { StatusCode: 404 } =&gt; "Not found",
    { StatusCode: &gt;= 500 } =&gt; "Server error",
    _ =&gt; "Unknown"
};
        </code>
      </example>
      <example title="Property pattern">
        <code>
if (order is { Status: OrderStatus.Completed, Total: &gt; 100 })
{
    ApplyDiscount(order);
}
        </code>
      </example>
      <example title="List pattern">
        <code>
var result = numbers switch
{
    [] =&gt; "Empty",
    [var single] =&gt; $"Single: {single}",
    [var first, .., var last] =&gt; $"First: {first}, Last: {last}"
};
        </code>
      </example>
    </examples>
  </pattern>
  
  <pattern name="file_scoped_namespaces">
    <description>Reduce nesting with file-scoped namespace</description>
    <example>
      <code>
namespace MyApp.Services;
public class UserService
{
    // No extra nesting level
}
      </code>
    </example>
  </pattern>
  
  <pattern name="global_usings">
    <description>Reduce repetitive using statements</description>
    <example title="GlobalUsings.cs">
      <code>
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using Microsoft.Extensions.Logging;
      </code>
    </example>
  </pattern>
</modern_csharp_patterns>
<async_await_rules>
  <rule priority="critical">Always async/await all the way up - never sync over async</rule>
  <rule priority="critical">Never use .Result or .Wait() - causes deadlocks</rule>
  <rule priority="high">Return Task, not void (except event handlers)</rule>
  <rule priority="high">Accept CancellationToken for cancellable operations</rule>
  <rule priority="medium">Use ConfigureAwait(false) in library code</rule>
  <rule priority="medium">Suffix async methods with Async</rule>
  
  <examples>
    <good title="Proper async method">
      <code>
public async Task&lt;User?&gt; GetUserAsync(int id, CancellationToken ct = default)
{
    var user = await _repository.FindByIdAsync(id, ct);
    return user;
}
      </code>
    </good>
    <good title="Library code with ConfigureAwait">
      <code>
public async Task&lt;byte[]&gt; DownloadAsync(string url)
{
    var response = await _httpClient.GetAsync(url).ConfigureAwait(false);
    return await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
}
      </code>
    </good>
    <bad title="Sync over async - DEADLOCK RISK">
      <code>
// NEVER DO THIS
var user = GetUserAsync(id).Result;
var data = FetchDataAsync().GetAwaiter().GetResult();
      </code>
    </bad>
  </examples>
</async_await_rules>
<dependency_injection>
  <lifetimes>
    <lifetime name="Transient">
      <description>New instance every injection</description>
      <use_for>Lightweight, stateless services; services with no shared state</use_for>
      <example>services.AddTransient&lt;IEmailSender, EmailSender&gt;();</example>
    </lifetime>
    <lifetime name="Scoped">
      <description>One instance per request/scope</description>
      <use_for>DbContext, Unit of Work, request-specific state</use_for>
      <example>services.AddScoped&lt;IUserRepository, UserRepository&gt;();</example>
    </lifetime>
    <lifetime name="Singleton">
      <description>Single instance for app lifetime</description>
      <use_for>Configuration, HttpClient, caches, thread-safe services</use_for>
      <example>services.AddSingleton&lt;ICacheService, CacheService&gt;();</example>
    </lifetime>
  </lifetimes>
  
  <rules>
    <rule>Register interfaces, not implementations</rule>
    <rule>Never inject Scoped into Singleton - causes captive dependency</rule>
    <rule>Avoid service locator pattern (GetService in constructors)</rule>
    <rule>Use Options pattern for configuration</rule>
  </rules>
  
  <options_pattern>
    <example>
      <code>
// appsettings.json
{
  "Email": {
    "SmtpHost": "smtp.example.com",
    "SmtpPort": 587,
    "FromAddress": "noreply@example.com"
  }
}
// Configuration class
public class EmailSettings
{
    public required string SmtpHost { get; init; }
    public required int SmtpPort { get; init; }
    public required string FromAddress { get; init; }
}
// Registration
builder.Services.Configure&lt;EmailSettings&gt;(
    builder.Configuration.GetSection("Email"));
// Usage with primary constructor
public class EmailService(IOptions&lt;EmailSettings&gt; options)
{
    private readonly EmailSettings _settings = options.Value;
    
    public void Send(string to, string subject, string body)
    {
        // Use _settings.SmtpHost, etc.
    }
}
      </code>
    </example>
  </options_pattern>
</dependency_injection>
<performance_tips>
  <tip name="string_builder">
    <description>Use StringBuilder for multiple string concatenations</description>
    <code>
var sb = new StringBuilder();
foreach (var item in items)
{
    sb.AppendLine(item.Name);
}
return sb.ToString();
    </code>
  </tip>
  
  <tip name="span_memory">
    <description>Use Span&lt;T&gt; for stack-allocated buffers</description>
    <code>
Span&lt;byte&gt; buffer = stackalloc byte[256];
int bytesRead = stream.Read(buffer);
    </code>
  </tip>
  
  <tip name="array_pool">
    <description>Use ArrayPool for temporary large arrays</description>
    <code>
var array = ArrayPool&lt;byte&gt;.Shared.Rent(4096);
try
{
    // Use array
}
finally
{
    ArrayPool&lt;byte&gt;.Shared.Return(array);
}
    </code>
  </tip>
  
  <tip name="avoid_linq_multiple_enumeration">
    <description>Materialize LINQ once</description>
    <code>
// Bad: enumerates twice
var items = GetItems().Where(x =&gt; x.IsActive);
var count = items.Count();  // First enumeration
var list = items.ToList();  // Second enumeration
// Good: materialize once
var items = GetItems().Where(x =&gt; x.IsActive).ToList();
var count = items.Count;  // No enumeration, just property access
    </code>
  </tip>
</performance_tips>