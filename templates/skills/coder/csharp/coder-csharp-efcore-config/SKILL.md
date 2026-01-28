---
name: coder-csharp-efcore-config
description: Entity Framework Core configuration, entity design, DbContext setup, and migrations. Use when designing entities, configuring relationships, setting up DbContext, or managing database schema.
---
<skill_overview>
  <purpose>Properly configure EF Core entities, relationships, and DbContext</purpose>
  <triggers>
    <trigger>Creating new entities or DbContext</trigger>
    <trigger>Configuring entity relationships</trigger>
    <trigger>Setting up database schema</trigger>
    <trigger>Managing migrations</trigger>
    <trigger>Configuring value converters or query filters</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/ef/core/">Microsoft EF Core Documentation</source>
    <source url="https://learn.microsoft.com/en-us/ef/core/modeling/">Creating and Configuring a Model</source>
  </sources>
</skill_overview>
<migrations_policy>
  <principle name="no_manual_migrations" priority="critical">
    <description>NEVER create or edit migration files manually. Always use CLI or Package Manager Console.</description>
    <allowed_commands>
      <command tool="CLI">dotnet ef migrations add MigrationName</command>
      <command tool="CLI">dotnet ef database update</command>
      <command tool="CLI">dotnet ef migrations remove</command>
      <command tool="PMC">Add-Migration MigrationName</command>
      <command tool="PMC">Update-Database</command>
      <command tool="PMC">Remove-Migration</command>
    </allowed_commands>
    <forbidden>
      <action>Manually creating migration .cs files</action>
      <action>Manually editing Up()/Down() methods</action>
      <action>Using EnsureCreated() in production</action>
    </forbidden>
  </principle>
  
  <naming_convention>
    <description>Use descriptive migration names</description>
    <good>AddUserEmailIndex, CreateOrdersTable, AddSoftDeleteToProducts</good>
    <bad>Migration1, Update, Fix, Changes</bad>
  </naming_convention>
  
  <ci_cd_approach>
    <description>Apply migrations on application startup for simple deployments</description>
    <code>
// Program.cs
var app = builder.Build();
// Apply pending migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService&lt;AppDbContext&gt;();
    db.Database.Migrate();
}
app.Run();
    </code>
    <production_alternative>
      <description>Generate SQL script for production deployments</description>
      <command>dotnet ef migrations script --idempotent -o migrate.sql</command>
    </production_alternative>
  </ci_cd_approach>
  
  <warnings>
    <warning>EnsureCreated() bypasses migrations and cannot track schema changes - ONLY for testing</warning>
    <warning>Never mix EnsureCreated() and Migrate() on the same database</warning>
  </warnings>
</migrations_policy>
<entity_configuration>
  <principle name="use_ientitytypeconfiguration" priority="high">
    <description>Organize entity configurations in separate classes, one per entity</description>
    <structure>
      <folder>Data/Configurations/</folder>
      <file>UserConfiguration.cs</file>
      <file>OrderConfiguration.cs</file>
      <file>ProductConfiguration.cs</file>
    </structure>
    <example>
      <code>
// Data/Configurations/UserConfiguration.cs
public class UserConfiguration : IEntityTypeConfiguration&lt;User&gt;
{
    public void Configure(EntityTypeBuilder&lt;User&gt; builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u =&gt; u.Id);
        
        // Properties
        builder.Property(u =&gt; u.Email)
            .IsRequired()
            .HasMaxLength(256);
            
        builder.Property(u =&gt; u.DisplayName)
            .HasMaxLength(100);
            
        builder.Property(u =&gt; u.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Indexes
        builder.HasIndex(u =&gt; u.Email)
            .IsUnique();
            
        // Relationships
        builder.HasMany(u =&gt; u.Orders)
            .WithOne(o =&gt; o.User)
            .HasForeignKey(o =&gt; o.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
// DbContext
public class AppDbContext : DbContext
{
    public DbSet&lt;User&gt; Users =&gt; Set&lt;User&gt;();
    public DbSet&lt;Order&gt; Orders =&gt; Set&lt;Order&gt;();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply all configurations from assembly
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);
    }
}
      </code>
    </example>
  </principle>
  
  <principle name="fluent_api_vs_annotations">
    <description>Prefer Fluent API for complex configurations</description>
    <precedence>Fluent API &gt; Data Annotations &gt; Conventions</precedence>
    <when_annotations>
      <case>Simple validations: [Required], [MaxLength], [StringLength]</case>
      <case>Display attributes: [Display], [DisplayName]</case>
      <case>Basic constraints: [Key], [DatabaseGenerated]</case>
    </when_annotations>
    <when_fluent_api>
      <case>Relationships and foreign keys</case>
      <case>Complex indexes (composite, filtered, unique)</case>
      <case>Value converters</case>
      <case>Query filters</case>
      <case>Table/column naming when differs from property</case>
      <case>Precision, default values</case>
    </when_fluent_api>
  </principle>
</entity_configuration>
<dbcontext_setup>
  <registration>
    <description>Register DbContext as Scoped (default, one per request)</description>
    <basic>
      <code>
builder.Services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
      </code>
    </basic>
    <with_resilience>
      <code>
builder.Services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default"),
        sqlOptions =&gt;
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
        }));
      </code>
    </with_resilience>
    <with_pooling>
      <description>For high-throughput scenarios</description>
      <code>
builder.Services.AddDbContextPool&lt;AppDbContext&gt;(options =&gt;
    options.UseSqlServer(connectionString),
    poolSize: 128);
      </code>
    </with_pooling>
  </registration>
  
  <context_structure>
    <code>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions&lt;AppDbContext&gt; options) 
        : base(options) { }
    
    // DbSets
    public DbSet&lt;User&gt; Users =&gt; Set&lt;User&gt;();
    public DbSet&lt;Order&gt; Orders =&gt; Set&lt;Order&gt;();
    public DbSet&lt;Product&gt; Products =&gt; Set&lt;Product&gt;();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        
        // Global query filters
        modelBuilder.Entity&lt;User&gt;().HasQueryFilter(u =&gt; !u.IsDeleted);
        modelBuilder.Entity&lt;Order&gt;().HasQueryFilter(o =&gt; !o.IsDeleted);
    }
    
    // Override SaveChanges for audit fields
    public override Task&lt;int&gt; SaveChangesAsync(CancellationToken ct = default)
    {
        foreach (var entry in ChangeTracker.Entries&lt;IAuditable&gt;())
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = DateTime.UtcNow;
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return base.SaveChangesAsync(ct);
    }
}
    </code>
  </context_structure>
</dbcontext_setup>
<relationships>
  <one_to_many>
    <code>
// User has many Orders
builder.HasMany(u =&gt; u.Orders)
    .WithOne(o =&gt; o.User)
    .HasForeignKey(o =&gt; o.UserId)
    .OnDelete(DeleteBehavior.Cascade);
    </code>
  </one_to_many>
  
  <many_to_many>
    <code>
// Product &lt;-&gt; Category (with explicit join entity)
builder.HasMany(p =&gt; p.Categories)
    .WithMany(c =&gt; c.Products)
    .UsingEntity&lt;ProductCategory&gt;(
        j =&gt; j.HasOne(pc =&gt; pc.Category)
              .WithMany()
              .HasForeignKey(pc =&gt; pc.CategoryId),
        j =&gt; j.HasOne(pc =&gt; pc.Product)
              .WithMany()
              .HasForeignKey(pc =&gt; pc.ProductId));
    </code>
  </many_to_many>
  
  <one_to_one>
    <code>
// User has one Profile
builder.HasOne(u =&gt; u.Profile)
    .WithOne(p =&gt; p.User)
    .HasForeignKey&lt;UserProfile&gt;(p =&gt; p.UserId);
    </code>
  </one_to_one>
</relationships>
<global_query_filters>
  <description>Automatically apply filters to all queries</description>
  <use_cases>
    <use_case name="soft_delete">
      <code>
modelBuilder.Entity&lt;User&gt;().HasQueryFilter(u =&gt; !u.IsDeleted);
modelBuilder.Entity&lt;Order&gt;().HasQueryFilter(o =&gt; !o.IsDeleted);
      </code>
    </use_case>
    <use_case name="multi_tenancy">
      <code>
// Inject tenant ID via DbContext constructor
public class AppDbContext : DbContext
{
    private readonly string _tenantId;
    
    public AppDbContext(DbContextOptions options, ITenantService tenant) 
        : base(options)
    {
        _tenantId = tenant.CurrentTenantId;
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity&lt;Order&gt;()
            .HasQueryFilter(o =&gt; o.TenantId == _tenantId);
    }
}
      </code>
    </use_case>
  </use_cases>
  <bypass>
    <code>
// When you need unfiltered data
var allUsers = await context.Users
    .IgnoreQueryFilters()
    .ToListAsync();
    </code>
  </bypass>
</global_query_filters>
<value_converters>
  <description>Convert between .NET types and database types</description>
  <examples>
    <example name="enum_to_string">
      <code>
builder.Property(o =&gt; o.Status)
    .HasConversion&lt;string&gt;()
    .HasMaxLength(20);
      </code>
    </example>
    <example name="custom_conversion">
      <code>
builder.Property(u =&gt; u.Tags)
    .HasConversion(
        v =&gt; string.Join(',', v),
        v =&gt; v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
      </code>
    </example>
    <example name="encrypted_field">
      <code>
builder.Property(u =&gt; u.SocialSecurityNumber)
    .HasConversion(
        v =&gt; _encryptor.Encrypt(v),
        v =&gt; _encryptor.Decrypt(v));
      </code>
    </example>
  </examples>
</value_converters>
<json_columns>
  <description>Store complex objects as JSON (EF Core 7+)</description>
  <example>
    <code>
public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ContactInfo Contact { get; set; }  // Stored as JSON
}
public class ContactInfo
{
    public string Email { get; set; }
    public string Phone { get; set; }
    public Address Address { get; set; }
}
// Configuration
builder.OwnsOne(a =&gt; a.Contact, contact =&gt;
{
    contact.ToJson();
    contact.OwnsOne(c =&gt; c.Address);
});
// Query JSON properties
var authors = await context.Authors
    .Where(a =&gt; a.Contact.Address.City == "London")
    .ToListAsync();
    </code>
  </example>
</json_columns>
<entity_design_guidelines>
  <guideline name="base_entity">
    <code>
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
public abstract class SoftDeletableEntity : BaseEntity
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
    </code>
  </guideline>
  
  <guideline name="navigation_properties">
    <rule>Use ICollection&lt;T&gt; for collections, not List&lt;T&gt;</rule>
    <rule>Initialize collections in constructor or with = new List&lt;T&gt;()</rule>
    <rule>Make navigation properties virtual only if using lazy loading</rule>
  </guideline>
  
  <guideline name="foreign_keys">
    <rule>Always include explicit FK property alongside navigation</rule>
    <code>
public class Order
{
    public int Id { get; set; }
    
    // FK property
    public int UserId { get; set; }
    
    // Navigation property
    public User User { get; set; }
}
    </code>
  </guideline>
</entity_design_guidelines>