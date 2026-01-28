---
name: coder-csharp-error-handling
description: C# error handling, validation, and Result pattern best practices. Use when handling exceptions, implementing validation, designing error responses, or choosing between exceptions and Result types.
---
<skill_overview>
  <purpose>Implement robust error handling following modern .NET patterns</purpose>
  <triggers>
    <trigger>Handling exceptions in services</trigger>
    <trigger>Implementing validation logic</trigger>
    <trigger>Designing API error responses</trigger>
    <trigger>Choosing Result pattern vs exceptions</trigger>
    <trigger>Setting up global exception handling</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/">Microsoft Exception Handling</source>
  </sources>
</skill_overview>
<exceptions_vs_result>
  <use_exceptions_when>
    <case>Truly exceptional, unexpected failures</case>
    <case>System-level errors (I/O, network, hardware)</case>
    <case>In constructors (can't return Result)</case>
    <case>Framework boundaries expecting exceptions</case>
    <case>Programming errors (null, out of range)</case>
  </use_exceptions_when>
  <use_result_when>
    <case>Expected business failures (validation, not found)</case>
    <case>Multiple possible failure modes</case>
    <case>Performance-critical hot paths</case>
    <case>Domain layer business logic</case>
    <case>Compile-time safety for error handling</case>
  </use_result_when>
  <example_comparison>
    <code>
// Exception: Unexpected failure
if (connection == null)
    throw new InvalidOperationException("Connection not initialized");
// Result: Expected business outcome
public Result&lt;User&gt; GetUser(int id)
{
    var user = _repository.Find(id);
    if (user == null)
        return Result.Fail("User not found");  // Expected case
    return Result.Ok(user);
}
    </code>
  </example_comparison>
</exceptions_vs_result>
<exception_best_practices>
  <throwing>
    <rule>Throw for truly exceptional conditions only</rule>
    <rule>Use specific exception types</rule>
    <rule>Include context in exception message</rule>
    <example>
      <code>
// Good: Specific exception with context
throw new ArgumentNullException(nameof(email), "Email is required for user creation");
// Good: Use built-in guard methods (.NET 6+)
ArgumentNullException.ThrowIfNull(user);
ArgumentException.ThrowIfNullOrEmpty(email);
// Bad: Generic exception
throw new Exception("Error occurred");
      </code>
    </example>
  </throwing>
  <catching>
    <rule>Catch specific exceptions first, general last</rule>
    <rule>Use exception filters (when clause) for fine-grained control</rule>
    <rule>Always use "throw;" not "throw ex;" to preserve stack trace</rule>
    <example>
      <code>
try
{
    await ProcessOrderAsync(order);
}
catch (ValidationException ex)
{
    _logger.LogWarning(ex, "Validation failed for order {OrderId}", order.Id);
    return BadRequest(ex.Errors);
}
catch (NotFoundException ex)
{
    return NotFound(ex.Message);
}
catch (Exception ex) when (ex is TimeoutException or HttpRequestException)
{
    _logger.LogWarning(ex, "Transient error, will retry");
    throw; // Preserve stack trace!
}
catch (Exception ex)
{
    _logger.LogError(ex, "Unexpected error processing order {OrderId}", order.Id);
    throw; // Never "throw ex;"
}
      </code>
    </example>
  </catching>
  <custom_exceptions>
    <template>
      <code>
public class OrderProcessingException : Exception
{
    public string OrderId { get; }
    public string ErrorCode { get; }
    
    public OrderProcessingException(string orderId, string message, string errorCode)
        : base(message)
    {
        OrderId = orderId;
        ErrorCode = errorCode;
    }
    
    public OrderProcessingException(string orderId, string message, Exception inner)
        : base(message, inner)
    {
        OrderId = orderId;
    }
}
      </code>
    </template>
  </custom_exceptions>
</exception_best_practices>
<result_pattern>
  <libraries>
    <library name="FluentResults">Rich API, multiple errors, chaining</library>
    <library name="ErrorOr">Clean fluent API, functional style</library>
    <library name="OneOf">Discriminated unions, exhaustive matching</library>
  </libraries>
  <erroror_example>
    <code>
public async Task&lt;ErrorOr&lt;Order&gt;&gt; CreateOrderAsync(CreateOrderCommand cmd)
{
    if (cmd.Items.Count == 0)
        return Error.Validation("Order must have items");
    
    var customer = await _customerRepo.FindAsync(cmd.CustomerId);
    if (customer == null)
        return Error.NotFound("Customer not found");
    
    if (!customer.IsActive)
        return Error.Validation("Customer account is inactive");
    
    var order = new Order(cmd);
    await _orderRepo.AddAsync(order);
    
    return order;
}
// Controller usage
[HttpPost]
public async Task&lt;IActionResult&gt; CreateOrder(CreateOrderDto dto)
{
    var result = await _orderService.CreateOrderAsync(dto.ToCommand());
    
    return result.Match(
        order =&gt; Ok(new OrderDto(order)),
        errors =&gt; Problem(errors.First().Description)
    );
}
    </code>
  </erroror_example>
  <chaining>
    <code>
public async Task&lt;ErrorOr&lt;OrderResult&gt;&gt; ProcessOrderAsync(int orderId)
{
    return await ValidateOrderAsync(orderId)
        .Then(order =&gt; CalculatePriceAsync(order))
        .Then(order =&gt; ProcessPaymentAsync(order))
        .Then(order =&gt; SendConfirmationAsync(order));
}
    </code>
  </chaining>
</result_pattern>
<validation>
  <fluentvalidation recommended="true">
    <description>Powerful, fluent validation with separation of concerns</description>
    <example>
      <code>
public class CreateUserValidator : AbstractValidator&lt;CreateUserDto&gt;
{
    public CreateUserValidator(IUserRepository repository)
    {
        RuleFor(x =&gt; x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MustAsync(async (email, ct) =&gt; 
                !await repository.ExistsAsync(email))
            .WithMessage("Email already registered");
        
        RuleFor(x =&gt; x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches("[A-Z]").WithMessage("Must contain uppercase")
            .Matches("[a-z]").WithMessage("Must contain lowercase")
            .Matches("[0-9]").WithMessage("Must contain number");
        
        RuleFor(x =&gt; x.Age)
            .InclusiveBetween(18, 120);
    }
}
      </code>
    </example>
  </fluentvalidation>
  <data_annotations>
    <description>Simple validation with attributes</description>
    <use_for>DTOs, simple input validation</use_for>
    <example>
      <code>
public class CreateUserDto
{
    [Required]
    [EmailAddress]
    public string Email { get; init; }
    
    [Required]
    [MinLength(8)]
    public string Password { get; init; }
    
    [Range(18, 120)]
    public int Age { get; init; }
}
      </code>
    </example>
  </data_annotations>
  <validation_layers>
    <layer name="Controller">Input format validation (DataAnnotations)</layer>
    <layer name="Service">Business rules (FluentValidation)</layer>
    <layer name="Domain">Invariants (guard clauses, exceptions)</layer>
  </validation_layers>
</validation>
<aspnetcore_error_handling>
  <iexceptionhandler recommended="true">
    <description>Global exception handling (.NET 8+)</description>
    <example>
      <code>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger&lt;GlobalExceptionHandler&gt; _logger;
    
    public GlobalExceptionHandler(ILogger&lt;GlobalExceptionHandler&gt; logger)
    {
        _logger = logger;
    }
    
    public async ValueTask&lt;bool&gt; TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken ct)
    {
        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
        
        var problemDetails = exception switch
        {
            ValidationException ex =&gt; new ProblemDetails
            {
                Type = "https://example.com/validation-error",
                Title = "Validation Error",
                Status = 400,
                Detail = ex.Message
            },
            NotFoundException =&gt; new ProblemDetails
            {
                Type = "https://example.com/not-found",
                Title = "Not Found",
                Status = 404
            },
            _ =&gt; new ProblemDetails
            {
                Type = "https://example.com/internal-error",
                Title = "Internal Server Error",
                Status = 500,
                Detail = "An unexpected error occurred"
            }
        };
        
        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;
        
        httpContext.Response.StatusCode = problemDetails.Status ?? 500;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, ct);
        
        return true;
    }
}
// Registration
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler&lt;GlobalExceptionHandler&gt;();
app.UseExceptionHandler();
      </code>
    </example>
  </iexceptionhandler>
  <problem_details>
    <description>RFC 7807 standard error format</description>
    <format>
      <code>
{
  "type": "https://example.com/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "Email is required",
  "instance": "/api/users",
  "traceId": "00-abc123..."
}
      </code>
    </format>
  </problem_details>
</aspnetcore_error_handling>
<logging_errors>
  <rules>
    <rule>Always include exception object: LogError(ex, "message")</rule>
    <rule>Add context: orderId, userId, operation name</rule>
    <rule>Use structured logging with templates</rule>
    <rule>Include correlation ID for tracing</rule>
  </rules>
  <example>
    <code>
try
{
    await ProcessOrderAsync(order);
}
catch (Exception ex)
{
    _logger.LogError(ex, 
        "Failed to process order {OrderId} for customer {CustomerId}. Amount: {Amount}",
        order.Id, order.CustomerId, order.TotalAmount);
    throw;
}
    </code>
  </example>
  <never_log>
    <item>Passwords (even hashed)</item>
    <item>Credit card numbers</item>
    <item>API keys and tokens</item>
    <item>Personal identification numbers</item>
  </never_log>
</logging_errors>
<anti_patterns>
  <avoid name="empty_catch">
    <bad>catch (Exception) { }</bad>
    <why>Swallows errors silently</why>
  </avoid>
  <avoid name="catch_and_throw_new">
    <bad>catch (Exception ex) { throw new Exception("Error", ex); }</bad>
    <why>Loses original exception type</why>
  </avoid>
  <avoid name="throw_ex">
    <bad>throw ex;</bad>
    <why>Resets stack trace</why>
    <good>throw;</good>
  </avoid>
  <avoid name="exception_for_flow_control">
    <bad>Using exceptions for expected business logic</bad>
    <why>Expensive, unclear intent</why>
    <good>Use Result pattern for expected failures</good>
  </avoid>
</anti_patterns>