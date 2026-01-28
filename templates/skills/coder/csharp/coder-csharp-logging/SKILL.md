---
name: coder-csharp-logging
description: .NET logging and observability best practices. Use when configuring logging, implementing structured logs, setting up health checks, or integrating with monitoring systems.
---
<skill_overview>
  <purpose>Implement effective logging and observability for .NET applications</purpose>
  <triggers>
    <trigger>Setting up logging infrastructure</trigger>
    <trigger>Writing log statements</trigger>
    <trigger>Configuring Serilog</trigger>
    <trigger>Adding health checks</trigger>
    <trigger>Implementing distributed tracing</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/">Microsoft Logging Documentation</source>
    <source url="https://github.com/serilog/serilog/wiki">Serilog Wiki</source>
  </sources>
</skill_overview>
<log_levels>
  <level name="Trace">
    <use_for>Detailed debugging, method entry/exit, variable states</use_for>
    <production>Never enabled</production>
  </level>
  <level name="Debug">
    <use_for>Development info, SQL queries, API calls</use_for>
    <production>Rarely enabled</production>
  </level>
  <level name="Information">
    <use_for>Application flow, business events, significant actions</use_for>
    <production>Default level</production>
    <example>Order {OrderId} created for customer {CustomerId}</example>
  </level>
  <level name="Warning">
    <use_for>Recoverable issues, retries, deprecated usage</use_for>
    <production>Always enabled</production>
    <example>Retrying API call, attempt {Attempt}</example>
  </level>
  <level name="Error">
    <use_for>Failures requiring investigation, exceptions</use_for>
    <production>Always enabled</production>
    <example>Failed to process payment for order {OrderId}</example>
  </level>
  <level name="Critical">
    <use_for>System failures, data loss, immediate attention needed</use_for>
    <production>Always enabled + alerts</production>
    <example>Database connection lost</example>
  </level>
</log_levels>
<structured_logging>
  <principle>Use message templates, NOT string interpolation</principle>
  
  <correct>
    <code>
// CORRECT: Structured logging with templates
_logger.LogInformation("Order {OrderId} created for customer {CustomerId}", 
    orderId, customerId);
// Output includes queryable properties: OrderId=123, CustomerId=456
    </code>
  </correct>
  <incorrect>
    <code>
// WRONG: String interpolation loses structure
_logger.LogInformation($"Order {orderId} created for customer {customerId}");
// Output is just text, cannot query by OrderId or CustomerId
    </code>
  </incorrect>
  <naming>
    <convention>PascalCase for property names</convention>
    <examples>
      <good>{OrderId}, {CustomerId}, {DurationMs}</good>
      <bad>{order_id}, {ORDERID}, {order}</bad>
    </examples>
  </naming>
</structured_logging>
<loggermessage_source_generator>
  <description>High-performance, zero-allocation logging (.NET 6+)</description>
  <benefits>
    <benefit>5-10x faster than string interpolation</benefit>
    <benefit>Automatic enabled check</benefit>
    <benefit>Type-safe message templates</benefit>
    <benefit>Zero allocations</benefit>
  </benefits>
  <example>
    <code>
public static partial class OrderLogs
{
    [LoggerMessage(
        EventId = 1000,
        Level = LogLevel.Information,
        Message = "Order {OrderId} created for customer {CustomerId}")]
    public static partial void OrderCreated(
        this ILogger logger, 
        string orderId, 
        string customerId);
    
    [LoggerMessage(
        EventId = 2000,
        Level = LogLevel.Warning,
        Message = "Payment retry {Attempt} for order {OrderId}")]
    public static partial void PaymentRetry(
        this ILogger logger, 
        int attempt, 
        string orderId);
    
    [LoggerMessage(
        EventId = 3000,
        Level = LogLevel.Error,
        Message = "Failed to process order {OrderId}: {ErrorCode}")]
    public static partial void OrderFailed(
        this ILogger logger, 
        string orderId, 
        string errorCode);
}
// Usage
_logger.OrderCreated(order.Id, order.CustomerId);
_logger.PaymentRetry(attempt, orderId);
    </code>
  </example>
</loggermessage_source_generator>
<serilog>
  <setup>
    <code>
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithProperty("Application", "MyApp")
    
    .WriteTo.Console(outputTemplate: 
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    
    .WriteTo.File("logs/app-.txt", 
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30)
    
    .WriteTo.Seq("http://localhost:5341")
    
    .CreateLogger();
// ASP.NET Core integration
builder.Host.UseSerilog();
// Request logging middleware
app.UseSerilogRequestLogging();
    </code>
  </setup>
  <log_context>
    <description>Add properties to all logs in a scope</description>
    <code>
// In middleware - adds to all logs in request
using (LogContext.PushProperty("UserId", userId))
using (LogContext.PushProperty("CorrelationId", correlationId))
{
    await next(context);
}
// All logs inside automatically include UserId and CorrelationId
_logger.LogInformation("Processing request");
// Output: UserId=123, CorrelationId=abc-def, Message="Processing request"
    </code>
  </log_context>
</serilog>
<correlation_ids>
  <middleware>
    <code>
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    
    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers["X-Correlation-ID"]
            .FirstOrDefault() ?? Guid.NewGuid().ToString();
        
        context.Response.Headers["X-Correlation-ID"] = correlationId;
        
        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }
}
// Register before other middleware
app.UseMiddleware&lt;CorrelationIdMiddleware&gt;();
    </code>
  </middleware>
</correlation_ids>
<exception_logging>
  <rules>
    <rule>Always pass exception object to logger</rule>
    <rule>Include context (IDs, operation name)</rule>
    <rule>Don't duplicate exception message in log message</rule>
  </rules>
  <correct>
    <code>
try
{
    await ProcessOrderAsync(order);
}
catch (Exception ex)
{
    _logger.LogError(ex, 
        "Failed to process order {OrderId} for customer {CustomerId}",
        order.Id, order.CustomerId);
    throw;
}
    </code>
  </correct>
  <incorrect>
    <code>
// WRONG: Missing exception object
_logger.LogError("Error: " + ex.Message);
// WRONG: Duplicating exception message
_logger.LogError(ex, "Error: {Message}", ex.Message);
    </code>
  </incorrect>
</exception_logging>
<sensitive_data>
  <never_log>
    <item>Passwords (even hashed)</item>
    <item>Credit card numbers</item>
    <item>Social security numbers</item>
    <item>API keys and secrets</item>
    <item>JWT tokens</item>
    <item>Personal health information</item>
  </never_log>
  <redaction>
    <code>
// Redact sensitive data before logging
_logger.LogInformation("User {Email} logged in from {IpAddress}",
    RedactEmail(user.Email), 
    RedactIp(ipAddress));
private string RedactEmail(string email)
{
    var parts = email.Split('@');
    return parts[0][..Math.Min(3, parts[0].Length)] + "***@" + parts[1];
}
    </code>
  </redaction>
</sensitive_data>
<health_checks>
  <setup>
    <code>
builder.Services.AddHealthChecks()
    .AddCheck("self", () =&gt; HealthCheckResult.Healthy())
    .AddSqlServer(connectionString, name: "database", tags: new[] { "db" })
    .AddRedis(redisConnection, name: "redis", tags: new[] { "cache" })
    .AddUrlGroup(new Uri("https://api.example.com/health"), name: "external-api");
// Endpoints
app.MapHealthChecks("/health"); // All checks
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check =&gt; check.Tags.Contains("ready")
});
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check =&gt; check.Tags.Contains("live")
});
    </code>
  </setup>
  <custom_check>
    <code>
public class ExternalApiHealthCheck : IHealthCheck
{
    private readonly HttpClient _http;
    
    public async Task&lt;HealthCheckResult&gt; CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken ct = default)
    {
        try
        {
            var response = await _http.GetAsync("/health", ct);
            return response.IsSuccessStatusCode
                ? HealthCheckResult.Healthy()
                : HealthCheckResult.Degraded($"Status: {response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("API unavailable", ex);
        }
    }
}
builder.Services.AddHealthChecks()
    .AddCheck&lt;ExternalApiHealthCheck&gt;("external-api");
    </code>
  </custom_check>
</health_checks>
<opentelemetry>
  <setup>
    <code>
builder.Services.AddOpenTelemetry()
    .ConfigureResource(r =&gt; r.AddService("MyApp"))
    .WithTracing(tracing =&gt;
    {
        tracing.AddAspNetCoreInstrumentation();
        tracing.AddHttpClientInstrumentation();
        tracing.AddSqlClientInstrumentation();
        tracing.AddSource("MyApp");
    })
    .WithMetrics(metrics =&gt;
    {
        metrics.AddAspNetCoreInstrumentation();
        metrics.AddRuntimeInstrumentation();
        metrics.AddMeter("MyApp");
    });
// Export to Azure Application Insights
builder.Services.AddOpenTelemetry()
    .UseAzureMonitor(options =&gt;
    {
        options.ConnectionString = config["APPLICATIONINSIGHTS_CONNECTION_STRING"];
    });
    </code>
  </setup>
  <custom_activity>
    <code>
using var activity = Activity.StartActivity("ProcessOrder");
activity?.SetTag("order.id", orderId);
activity?.SetTag("customer.id", customerId);
try
{
    await ProcessAsync();
    activity?.SetStatus(ActivityStatusCode.Ok);
}
catch (Exception ex)
{
    activity?.RecordException(ex);
    activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
    throw;
}
    </code>
  </custom_activity>
  <custom_metrics>
    <code>
public class OrderMetrics
{
    private readonly Counter&lt;long&gt; _ordersProcessed;
    private readonly Histogram&lt;double&gt; _processingTime;
    
    public OrderMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("MyApp.Orders");
        
        _ordersProcessed = meter.CreateCounter&lt;long&gt;(
            "orders.processed",
            description: "Number of orders processed");
        
        _processingTime = meter.CreateHistogram&lt;double&gt;(
            "order.processing.duration",
            unit: "ms",
            description: "Order processing time");
    }
    
    public void RecordOrderProcessed(string status) =&gt;
        _ordersProcessed.Add(1, new KeyValuePair&lt;string, object?&gt;("status", status));
    
    public void RecordProcessingTime(double ms) =&gt;
        _processingTime.Record(ms);
}
    </code>
  </custom_metrics>
</opentelemetry>