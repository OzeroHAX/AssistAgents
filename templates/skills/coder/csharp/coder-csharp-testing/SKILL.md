---
name: coder-csharp-testing
description: C# unit and integration testing best practices. Use when writing tests, setting up test projects, mocking dependencies, or testing with EF Core and ASP.NET Core.
---
<skill_overview>
  <purpose>Write effective, maintainable tests following industry best practices</purpose>
  <triggers>
    <trigger>Writing unit tests</trigger>
    <trigger>Setting up integration tests</trigger>
    <trigger>Mocking dependencies</trigger>
    <trigger>Testing EF Core repositories</trigger>
    <trigger>Testing ASP.NET Core APIs</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/dotnet/core/testing/">Microsoft Testing Documentation</source>
    <source url="https://xunit.net/">xUnit Official Documentation</source>
  </sources>
</skill_overview>
<framework_choice>
  <recommendation>Use xUnit for new projects</recommendation>
  <why>
    <reason>Modern design by original NUnit authors</reason>
    <reason>New instance per test (better isolation)</reason>
    <reason>No class-level attributes needed</reason>
    <reason>Community standard for .NET</reason>
  </why>
  <comparison>
    <framework name="xUnit">
      <test_attr>[Fact], [Theory]</test_attr>
      <setup>Constructor + IDisposable</setup>
      <isolation>New instance per test</isolation>
    </framework>
    <framework name="NUnit">
      <test_attr>[Test], [TestCase]</test_attr>
      <setup>[SetUp], [TearDown]</setup>
      <isolation>Same instance per class</isolation>
    </framework>
    <framework name="MSTest">
      <test_attr>[TestMethod]</test_attr>
      <setup>[TestInitialize]</setup>
      <isolation>Same instance per class</isolation>
    </framework>
  </comparison>
</framework_choice>
<unit_testing>
  <pattern name="arrange_act_assert" required="true">
    <description>Structure every test with AAA pattern</description>
    <example>
      <code>
[Fact]
public void Add_TwoPositiveNumbers_ReturnsSum()
{
    // Arrange
    var calculator = new Calculator();
    
    // Act
    var result = calculator.Add(2, 3);
    
    // Assert
    Assert.Equal(5, result);
}
      </code>
    </example>
  </pattern>
  <naming_convention>
    <format>[Method]_[Scenario]_[ExpectedResult]</format>
    <examples>
      <good>Add_TwoPositiveNumbers_ReturnsSum</good>
      <good>GetUser_NonExistentId_ReturnsNull</good>
      <good>CreateOrder_EmptyCart_ThrowsException</good>
      <bad>Test1, TestAdd, CalculatorTest</bad>
    </examples>
  </naming_convention>
  <assertions>
    <principle>One logical assertion per test</principle>
    <note>Multiple related assertions for same concept are OK</note>
    <example>
      <code>
[Fact]
public void CreateUser_ValidInput_ReturnsUserWithCorrectProperties()
{
    var user = _service.CreateUser("john@example.com", "John");
    
    // Multiple assertions for one logical concept (user created correctly)
    Assert.NotNull(user);
    Assert.Equal("john@example.com", user.Email);
    Assert.Equal("John", user.Name);
    Assert.True(user.Id > 0);
}
      </code>
    </example>
  </assertions>
  <test_isolation>
    <rules>
      <rule>No shared mutable state between tests</rule>
      <rule>Don't depend on test execution order</rule>
      <rule>Each test must be independently runnable</rule>
      <rule>Clean up resources in Dispose</rule>
    </rules>
    <example>
      <code>
public class OrderServiceTests : IDisposable
{
    private readonly Mock&lt;IOrderRepository&gt; _mockRepo;
    private readonly OrderService _service;
    
    public OrderServiceTests()
    {
        // Fresh instance for each test
        _mockRepo = new Mock&lt;IOrderRepository&gt;();
        _service = new OrderService(_mockRepo.Object);
    }
    
    public void Dispose()
    {
        // Cleanup if needed
    }
}
      </code>
    </example>
  </test_isolation>
  <private_methods>
    <rule>NEVER test private methods directly</rule>
    <why>
      <reason>Tests should verify public behavior, not implementation</reason>
      <reason>Makes refactoring harder</reason>
      <reason>If private method is complex, extract to separate class</reason>
    </why>
    <solution>Test through public API or extract to testable class</solution>
  </private_methods>
</unit_testing>
<mocking>
  <library_choice>
    <recommendation>Moq (most popular) or NSubstitute (cleaner syntax)</recommendation>
  </library_choice>
  <moq_patterns>
    <setup_returns>
      <code>
var mockRepo = new Mock&lt;IUserRepository&gt;();
mockRepo.Setup(r =&gt; r.GetById(1))
    .Returns(new User { Id = 1, Name = "John" });
var service = new UserService(mockRepo.Object);
      </code>
    </setup_returns>
    <setup_async>
      <code>
mockRepo.Setup(r =&gt; r.GetByIdAsync(It.IsAny&lt;int&gt;()))
    .ReturnsAsync(new User { Id = 1 });
      </code>
    </setup_async>
    <verify>
      <code>
// Verify method was called
mockRepo.Verify(r =&gt; r.Save(It.IsAny&lt;User&gt;()), Times.Once());
// Verify with specific argument
mockRepo.Verify(r =&gt; r.Save(It.Is&lt;User&gt;(u =&gt; u.Email == "test@example.com")));
// Verify never called
mockRepo.Verify(r =&gt; r.Delete(It.IsAny&lt;int&gt;()), Times.Never());
      </code>
    </verify>
    <matchers>
      <code>
It.IsAny&lt;int&gt;()           // Any value
It.Is&lt;User&gt;(u =&gt; u.Id &gt; 0) // Condition
It.IsIn(1, 2, 3)          // One of values
It.IsRegex(@"^\d+$")      // Regex match
      </code>
    </matchers>
  </moq_patterns>
  <when_to_mock>
    <mock>External dependencies (APIs, databases, file system)</mock>
    <mock>Slow operations</mock>
    <mock>Non-deterministic operations (DateTime, Random)</mock>
    <dont_mock>Value objects, DTOs, simple classes</dont_mock>
    <dont_mock>The class under test</dont_mock>
  </when_to_mock>
  <best_practices>
    <practice>Setup only what you need for the test</practice>
    <practice>Prefer Returns over Verify when possible</practice>
    <practice>Use strict mocks sparingly</practice>
    <practice>Don't mock what you don't own (wrap it first)</practice>
  </best_practices>
</mocking>
<testing_efcore>
  <principle name="dont_mock_dbcontext" priority="critical">
    <description>NEVER mock DbContext - use real database instead</description>
    <why>
      <reason>LINQ queries don't work correctly with mocks</reason>
      <reason>Change tracking doesn't work</reason>
      <reason>Tests pass but production fails</reason>
    </why>
  </principle>
  <sqlite_inmemory recommended="true">
    <description>Use SQLite in-memory for fast, realistic tests</description>
    <example>
      <code>
public class RepositoryTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _context;
    
    public RepositoryTests()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();
        
        var options = new DbContextOptionsBuilder&lt;AppDbContext&gt;()
            .UseSqlite(_connection)
            .Options;
        
        _context = new AppDbContext(options);
        _context.Database.EnsureCreated();
    }
    
    [Fact]
    public async Task Add_ValidEntity_SavesSuccessfully()
    {
        var repo = new UserRepository(_context);
        var user = new User { Email = "test@example.com" };
        
        await repo.AddAsync(user);
        
        var saved = await _context.Users.FindAsync(user.Id);
        Assert.NotNull(saved);
        Assert.Equal("test@example.com", saved.Email);
    }
    
    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();
    }
}
      </code>
    </example>
  </sqlite_inmemory>
  <inmemory_provider>
    <warning>Use only for simple cases - NOT a real relational database</warning>
    <limitations>
      <limit>No referential integrity</limit>
      <limit>No transactions</limit>
      <limit>Different SQL translation</limit>
    </limitations>
  </inmemory_provider>
  <testcontainers>
    <description>Use for critical integration tests with real database</description>
    <example>
      <code>
public class DatabaseFixture : IAsyncLifetime
{
    private readonly MsSqlContainer _container;
    public string ConnectionString =&gt; _container.GetConnectionString();
    
    public DatabaseFixture()
    {
        _container = new MsSqlBuilder()
            .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
            .Build();
    }
    
    public async Task InitializeAsync() =&gt; await _container.StartAsync();
    public async Task DisposeAsync() =&gt; await _container.StopAsync();
}
      </code>
    </example>
  </testcontainers>
</testing_efcore>
<integration_testing>
  <webapplicationfactory>
    <description>Standard for ASP.NET Core integration tests</description>
    <example>
      <code>
public class ApiTests : IClassFixture&lt;WebApplicationFactory&lt;Program&gt;&gt;
{
    private readonly HttpClient _client;
    
    public ApiTests(WebApplicationFactory&lt;Program&gt; factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetUsers_ReturnsSuccessStatusCode()
    {
        var response = await _client.GetAsync("/api/users");
        
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json", 
            response.Content.Headers.ContentType?.MediaType);
    }
}
      </code>
    </example>
  </webapplicationfactory>
  <custom_factory>
    <description>Override services for testing</description>
    <example>
      <code>
public class CustomWebApplicationFactory&lt;TProgram&gt; 
    : WebApplicationFactory&lt;TProgram&gt; where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =&gt;
        {
            // Replace real database with SQLite
            var descriptor = services.SingleOrDefault(
                d =&gt; d.ServiceType == typeof(DbContextOptions&lt;AppDbContext&gt;));
            services.Remove(descriptor);
            
            services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
                options.UseSqlite("DataSource=:memory:"));
            
            // Replace external services with fakes
            services.AddScoped&lt;IEmailService, FakeEmailService&gt;();
        });
        
        builder.UseEnvironment("Testing");
    }
}
      </code>
    </example>
  </custom_factory>
  <test_authentication>
    <example>
      <code>
public class TestAuthHandler : AuthenticationHandler&lt;AuthenticationSchemeOptions&gt;
{
    protected override Task&lt;AuthenticateResult&gt; HandleAuthenticateAsync()
    {
        var claims = new[] 
        { 
            new Claim(ClaimTypes.Name, "TestUser"),
            new Claim(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "TestScheme");
        
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
      </code>
    </example>
  </test_authentication>
</integration_testing>
<code_coverage>
  <philosophy>
    <principle>Coverage is a tool, not a goal</principle>
    <principle>Focus on critical paths, not 100%</principle>
    <principle>Test without assertions = coverage without value</principle>
  </philosophy>
  <targets>
    <target scenario="High-risk systems (financial)">80-90%</target>
    <target scenario="Business applications">70-80%</target>
    <target scenario="Internal tools">50-70%</target>
  </targets>
  <what_not_to_test>
    <skip>Auto-generated code</skip>
    <skip>Configuration/startup code</skip>
    <skip>Simple DTOs</skip>
    <skip>Third-party library wrappers</skip>
  </what_not_to_test>
  <tool recommendation="Coverlet">
    <command>dotnet test --collect:"XPlat Code Coverage"</command>
  </tool>
</code_coverage>
<theory_tests>
  <description>Parameterized tests for multiple inputs</description>
  <example>
    <code>
[Theory]
[InlineData(1, 2, 3)]
[InlineData(-1, 1, 0)]
[InlineData(0, 0, 0)]
public void Add_VariousInputs_ReturnsCorrectSum(int a, int b, int expected)
{
    var calculator = new Calculator();
    
    var result = calculator.Add(a, b);
    
    Assert.Equal(expected, result);
}
[Theory]
[MemberData(nameof(GetTestData))]
public void Process_TestCases_ReturnsExpected(Order order, bool expected)
{
    var result = _service.IsValid(order);
    Assert.Equal(expected, result);
}
public static IEnumerable&lt;object[]&gt; GetTestData()
{
    yield return new object[] { new Order { Total = 100 }, true };
    yield return new object[] { new Order { Total = 0 }, false };
}
    </code>
  </example>
</theory_tests>