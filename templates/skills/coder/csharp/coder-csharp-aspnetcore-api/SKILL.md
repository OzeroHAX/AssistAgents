---
name: coder-csharp-aspnetcore-api
description: ASP.NET Core Web API best practices including controllers, Minimal APIs, authentication, caching, and OpenAPI. Use when building REST APIs, configuring authentication, or optimizing API performance.
---
<skill_overview>
  <purpose>Build robust, performant, and well-documented ASP.NET Core APIs</purpose>
  <triggers>
    <trigger>Creating new API endpoints</trigger>
    <trigger>Choosing Controllers vs Minimal APIs</trigger>
    <trigger>Setting up authentication/authorization</trigger>
    <trigger>Implementing caching or rate limiting</trigger>
    <trigger>Documenting APIs with OpenAPI</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/aspnet/core/web-api/">Microsoft Web API Documentation</source>
  </sources>
</skill_overview>
<controllers_vs_minimal>
  <use_controllers_when>
    <case>Large applications with complex routing</case>
    <case>Need filters, model binding features</case>
    <case>Team prefers MVC structure</case>
    <case>Complex authorization with filters</case>
  </use_controllers_when>
  <use_minimal_when>
    <case>Microservices, small APIs</case>
    <case>Simple endpoints without much middleware</case>
    <case>Performance-critical scenarios</case>
    <case>Prefer less ceremony/boilerplate</case>
  </use_minimal_when>
  <controller_example>
    <code>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserDto), 200)]
    [ProducesResponseType(404)]
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user == null ? NotFound() : Ok(user);
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(UserDto), 201)]
    [ProducesResponseType(400)]
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; Create(CreateUserDto dto)
    {
        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }
}
    </code>
  </controller_example>
  <minimal_example>
    <code>
var app = builder.Build();
var users = app.MapGroup("/api/users");
users.MapGet("/{id}", async (int id, IUserService service) =&gt;
    await service.GetByIdAsync(id) is UserDto user
        ? TypedResults.Ok(user)
        : TypedResults.NotFound())
    .WithName("GetUserById")
    .Produces&lt;UserDto&gt;(200)
    .Produces(404);
users.MapPost("/", async (CreateUserDto dto, IUserService service) =&gt;
{
    var user = await service.CreateAsync(dto);
    return TypedResults.Created($"/api/users/{user.Id}", user);
})
.WithName("CreateUser")
.Produces&lt;UserDto&gt;(201);
    </code>
  </minimal_example>
</controllers_vs_minimal>
<dtos_and_mapping>
  <principle>Never expose entities directly - always use DTOs</principle>
  <why>
    <reason>Security: prevent over-posting attacks</reason>
    <reason>Decoupling: API contract independent of database</reason>
    <reason>Control: expose only needed fields</reason>
  </why>
  <mapping_options>
    <option name="Manual">Fastest, explicit, most control</option>
    <option name="Mapperly">Source-generated, fast, compile-time safe</option>
    <option name="Mapster">Faster than AutoMapper, good DX</option>
    <option name="AutoMapper">Most features, slower</option>
  </mapping_options>
  <example>
    <code>
// Entity (never expose directly)
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }  // Never expose!
    public DateTime CreatedAt { get; set; }
}
// DTOs (expose these)
public record UserDto(int Id, string Email, DateTime CreatedAt);
public record CreateUserDto(string Email, string Password);
// Manual mapping
public static UserDto ToDto(this User user) =&gt;
    new(user.Id, user.Email, user.CreatedAt);
    </code>
  </example>
</dtos_and_mapping>
<authentication>
  <jwt_setup>
    <code>
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =&gt;
    {
        options.Authority = "https://your-auth-server";
        options.Audience = builder.Configuration["Auth:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
    });
builder.Services.AddAuthorization();
app.UseAuthentication();
app.UseAuthorization();
    </code>
  </jwt_setup>
  <policy_authorization>
    <code>
// Define policies
builder.Services.AddAuthorization(options =&gt;
{
    options.AddPolicy("AdminOnly", policy =&gt;
        policy.RequireRole("Admin"));
    
    options.AddPolicy("CanEditOrders", policy =&gt;
        policy.RequireClaim("Permission", "Orders.Edit"));
    
    options.AddPolicy("MinAge18", policy =&gt;
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});
// Apply to endpoints
[Authorize(Policy = "AdminOnly")]
public IActionResult AdminAction() =&gt; Ok();
// Minimal API
app.MapDelete("/orders/{id}", DeleteOrder)
    .RequireAuthorization("CanEditOrders");
    </code>
  </policy_authorization>
</authentication>
<pagination>
  <implementation>
    <code>
public record PagedResult&lt;T&gt;(
    IEnumerable&lt;T&gt; Items,
    int TotalCount,
    int Page,
    int PageSize)
{
    public int TotalPages =&gt; (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious =&gt; Page &gt; 1;
    public bool HasNext =&gt; Page &lt; TotalPages;
}
[HttpGet]
public async Task&lt;ActionResult&lt;PagedResult&lt;UserDto&gt;&gt;&gt; GetUsers(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
{
    var query = _context.Users
        .AsNoTracking()
        .OrderBy(u =&gt; u.CreatedAt);
    
    var totalCount = await query.CountAsync();
    
    var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(u =&gt; u.ToDto())
        .ToListAsync();
    
    return Ok(new PagedResult&lt;UserDto&gt;(items, totalCount, page, pageSize));
}
    </code>
  </implementation>
  <rule>Always include OrderBy before Skip/Take</rule>
</pagination>
<caching>
  <output_caching description=".NET 7+">
    <code>
builder.Services.AddOutputCache(options =&gt;
{
    options.DefaultExpirationTimeSpan = TimeSpan.FromMinutes(5);
});
app.UseOutputCache();
// Apply to endpoint
app.MapGet("/products", GetProducts)
    .CacheOutput(p =&gt; p.Expire(TimeSpan.FromMinutes(10)));
// With tag for invalidation
app.MapGet("/products/{id}", GetProduct)
    .CacheOutput(p =&gt; p.Tag("products"));
app.MapPost("/products", async (Product p, IOutputCacheStore cache) =&gt;
{
    // Invalidate cache after create
    await cache.EvictByTagAsync("products", default);
    return Results.Created();
});
    </code>
  </output_caching>
  <response_caching>
    <code>
builder.Services.AddResponseCaching();
app.UseResponseCaching();
[HttpGet]
[ResponseCache(Duration = 60, VaryByQueryKeys = new[] { "page" })]
public IActionResult GetProducts() =&gt; Ok();
    </code>
  </response_caching>
</caching>
<rate_limiting description=".NET 7+">
  <code>
builder.Services.AddRateLimiter(options =&gt;
{
    options.AddFixedWindowLimiter("fixed", opt =&gt;
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10;
    });
    
    options.AddSlidingWindowLimiter("sliding", opt =&gt;
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 4;
    });
    
    options.RejectionStatusCode = 429;
});
app.UseRateLimiter();
app.MapGet("/api/resource", GetResource)
    .RequireRateLimiting("fixed");
  </code>
</rate_limiting>
<response_compression>
  <code>
builder.Services.AddResponseCompression(options =&gt;
{
    options.EnableForHttps = true;
    options.Providers.Add&lt;BrotliCompressionProvider&gt;();
    options.Providers.Add&lt;GzipCompressionProvider&gt;();
});
builder.Services.Configure&lt;BrotliCompressionProviderOptions&gt;(options =&gt;
    options.Level = CompressionLevel.Fastest);
app.UseResponseCompression(); // Before endpoints
  </code>
</response_compression>
<openapi>
  <setup>
    <code>
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =&gt;
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "API for managing resources"
    });
    
    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
    
    // JWT auth in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
});
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
    </code>
  </setup>
  <xml_comments>
    <code>
/// &lt;summary&gt;
/// Gets a user by ID
/// &lt;/summary&gt;
/// &lt;param name="id"&gt;The user identifier&lt;/param&gt;
/// &lt;returns&gt;The user or 404 if not found&lt;/returns&gt;
/// &lt;response code="200"&gt;Returns the user&lt;/response&gt;
/// &lt;response code="404"&gt;User not found&lt;/response&gt;
[HttpGet("{id}")]
[ProducesResponseType(typeof(UserDto), 200)]
[ProducesResponseType(404)]
public async Task&lt;ActionResult&lt;UserDto&gt;&gt; GetById(int id)
    </code>
  </xml_comments>
  <csproj_setting>
    <code>
&lt;PropertyGroup&gt;
  &lt;GenerateDocumentationFile&gt;true&lt;/GenerateDocumentationFile&gt;
  &lt;NoWarn&gt;$(NoWarn);1591&lt;/NoWarn&gt;
&lt;/PropertyGroup&gt;
    </code>
  </csproj_setting>
</openapi>
<versioning>
  <setup>
    <code>
builder.Services.AddApiVersioning(options =&gt;
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version"));
});
// URL versioning
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
public class UsersController : ControllerBase
{
    [HttpGet, MapToApiVersion("1.0")]
    public IActionResult GetV1() =&gt; Ok("v1");
    
    [HttpGet, MapToApiVersion("2.0")]
    public IActionResult GetV2() =&gt; Ok("v2");
}
    </code>
  </setup>
</versioning>