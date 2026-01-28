---
name: coder-csharp-efcore-queries
description: Entity Framework Core query optimization, performance best practices, and common pitfalls. Use when writing LINQ queries, optimizing database access, or debugging EF Core performance issues.
---
<skill_overview>
  <purpose>Write efficient EF Core queries and avoid performance pitfalls</purpose>
  <triggers>
    <trigger>Writing LINQ queries with EF Core</trigger>
    <trigger>Optimizing slow database queries</trigger>
    <trigger>Debugging N+1 or performance issues</trigger>
    <trigger>Bulk data operations</trigger>
    <trigger>Deciding between query approaches</trigger>
  </triggers>
  <sources>
    <source url="https://learn.microsoft.com/en-us/ef/core/performance/">EF Core Performance</source>
    <source url="https://learn.microsoft.com/en-us/ef/core/querying/">Querying Data</source>
  </sources>
</skill_overview>
<query_rules>
  <rule name="always_use_asnotracking" priority="critical">
    <description>Use AsNoTracking() for ALL read-only queries</description>
    <why>Reduces memory, skips change detection, significantly faster</why>
    <examples>
      <good>
        <code>
var users = await context.Users
    .AsNoTracking()
    .Where(u =&gt; u.IsActive)
    .ToListAsync();
        </code>
      </good>
      <good>
        <code>
// Projections are automatically no-tracking
var userDtos = await context.Users
    .Where(u =&gt; u.IsActive)
    .Select(u =&gt; new UserDto(u.Id, u.Name, u.Email))
    .ToListAsync();
        </code>
      </good>
      <bad>
        <code>
// BAD: Tracking enabled for read-only data
var users = await context.Users
    .Where(u =&gt; u.IsActive)
    .ToListAsync();
        </code>
      </bad>
    </examples>
    <exception>When you need to update entities after loading</exception>
  </rule>
  
  <rule name="prefer_projections" priority="high">
    <description>Select only needed fields with Select()</description>
    <why>Less data transferred, no tracking overhead, faster queries</why>
    <examples>
      <good>
        <code>
// Only load what you need
var userData = await context.Users
    .Where(u =&gt; u.Id == userId)
    .Select(u =&gt; new
    {
        u.Id,
        u.DisplayName,
        u.Email,
        OrderCount = u.Orders.Count(),
        LastOrder = u.Orders
            .OrderByDescending(o =&gt; o.CreatedAt)
            .Select(o =&gt; o.CreatedAt)
            .FirstOrDefault()
    })
    .FirstOrDefaultAsync();
        </code>
      </good>
      <bad>
        <code>
// BAD: Loading entire entity when only few fields needed
var user = await context.Users
    .Include(u =&gt; u.Orders)
    .FirstOrDefaultAsync(u =&gt; u.Id == userId);
var name = user?.DisplayName;
var orderCount = user?.Orders.Count;
        </code>
      </bad>
    </examples>
  </rule>
  
  <rule name="avoid_n_plus_1" priority="critical">
    <description>Never access navigation properties in loops without eager loading</description>
    <problem>
      <code>
// BAD: N+1 queries - 1 query for blogs + N queries for posts
var blogs = await context.Blogs.ToListAsync();
foreach (var blog in blogs)
{
    Console.WriteLine($"{blog.Name}: {blog.Posts.Count} posts"); // Query per blog!
}
      </code>
    </problem>
    <solutions>
      <solution name="eager_loading">
        <code>
var blogs = await context.Blogs
    .Include(b =&gt; b.Posts)
    .AsNoTracking()
    .ToListAsync();
        </code>
      </solution>
      <solution name="projection" recommended="true">
        <code>
var blogData = await context.Blogs
    .Select(b =&gt; new
    {
        b.Name,
        PostCount = b.Posts.Count()
    })
    .ToListAsync();
        </code>
      </solution>
      <solution name="explicit_loading">
        <code>
var blog = await context.Blogs.FirstAsync(b =&gt; b.Id == id);
await context.Entry(blog)
    .Collection(b =&gt; b.Posts)
    .LoadAsync();
        </code>
      </solution>
    </solutions>
  </rule>
  
  <rule name="use_split_queries" priority="high">
    <description>Use AsSplitQuery() when including multiple collections</description>
    <why>Prevents cartesian explosion (exponential row multiplication)</why>
    <problem>
      <code>
// BAD: Cartesian explosion
// If blog has 10 posts and 5 contributors = 50 rows returned
var blogs = await context.Blogs
    .Include(b =&gt; b.Posts)
    .Include(b =&gt; b.Contributors)
    .ToListAsync();
      </code>
    </problem>
    <solution>
      <code>
// GOOD: Separate queries, no explosion
var blogs = await context.Blogs
    .Include(b =&gt; b.Posts)
    .Include(b =&gt; b.Contributors)
    .AsSplitQuery()
    .AsNoTracking()
    .ToListAsync();
      </code>
    </solution>
  </rule>
  
  <rule name="filter_include" priority="medium">
    <description>Filter included collections when you don't need all</description>
    <example>
      <code>
// Only include active posts from last month
var blogs = await context.Blogs
    .Include(b =&gt; b.Posts
        .Where(p =&gt; p.IsPublished)
        .Where(p =&gt; p.CreatedAt &gt; DateTime.UtcNow.AddMonths(-1))
        .OrderByDescending(p =&gt; p.CreatedAt)
        .Take(5))
    .AsNoTracking()
    .ToListAsync();
      </code>
    </example>
  </rule>
</query_rules>
<bulk_operations>
  <description>Use ExecuteUpdate/ExecuteDelete for bulk operations (EF Core 7+)</description>
  <why>Direct SQL execution, no entity loading, no change tracking</why>
  
  <execute_update>
    <description>Update multiple rows without loading entities</description>
    <examples>
      <example name="simple_update">
        <code>
// Deactivate inactive users
await context.Users
    .Where(u =&gt; u.LastLoginAt &lt; DateTime.UtcNow.AddYears(-1))
    .ExecuteUpdateAsync(u =&gt; u
        .SetProperty(x =&gt; x.IsActive, false)
        .SetProperty(x =&gt; x.DeactivatedAt, DateTime.UtcNow));
        </code>
      </example>
      <example name="computed_update">
        <code>
// Give 10% raise to all employees in department
await context.Employees
    .Where(e =&gt; e.DepartmentId == deptId)
    .ExecuteUpdateAsync(e =&gt; e
        .SetProperty(x =&gt; x.Salary, x =&gt; x.Salary * 1.10m));
        </code>
      </example>
    </examples>
  </execute_update>
  
  <execute_delete>
    <description>Delete multiple rows without loading entities</description>
    <examples>
      <example name="simple_delete">
        <code>
// Delete old logs
await context.Logs
    .Where(l =&gt; l.CreatedAt &lt; DateTime.UtcNow.AddMonths(-6))
    .ExecuteDeleteAsync();
        </code>
      </example>
      <example name="soft_delete_cleanup">
        <code>
// Permanently delete soft-deleted records older than 30 days
await context.Users
    .IgnoreQueryFilters()
    .Where(u =&gt; u.IsDeleted)
    .Where(u =&gt; u.DeletedAt &lt; DateTime.UtcNow.AddDays(-30))
    .ExecuteDeleteAsync();
        </code>
      </example>
    </examples>
  </execute_delete>
  
  <comparison>
    <row operation="Update 10K rows" execute_method="~300ms" savechanges="~5000ms" />
    <row operation="Delete 10K rows" execute_method="~200ms" savechanges="~4000ms" />
  </comparison>
</bulk_operations>
<compiled_queries>
  <description>Pre-compile frequently executed queries for performance</description>
  <when_to_use>
    <case>Hot path queries executed many times</case>
    <case>Queries where compilation overhead is measurable</case>
  </when_to_use>
  <when_not_to_use>
    <case>Rarely executed queries</case>
    <case>Queries with dynamic structure</case>
  </when_not_to_use>
  <example>
    <code>
public class UserRepository
{
    // Compile once, reuse many times
    private static readonly Func&lt;AppDbContext, int, Task&lt;User?&gt;&gt; GetByIdQuery =
        EF.CompileAsyncQuery((AppDbContext db, int id) =&gt;
            db.Users.FirstOrDefault(u =&gt; u.Id == id));
    
    private static readonly Func&lt;AppDbContext, string, IAsyncEnumerable&lt;User&gt;&gt; SearchByEmailQuery =
        EF.CompileAsyncQuery((AppDbContext db, string email) =&gt;
            db.Users.Where(u =&gt; u.Email.Contains(email)));
    
    private readonly AppDbContext _context;
    
    public async Task&lt;User?&gt; GetByIdAsync(int id)
    {
        return await GetByIdQuery(_context, id);
    }
    
    public IAsyncEnumerable&lt;User&gt; SearchByEmailAsync(string email)
    {
        return SearchByEmailQuery(_context, email);
    }
}
    </code>
  </example>
</compiled_queries>
<pagination>
  <description>Always paginate large result sets</description>
  <example>
    <code>
public async Task&lt;PagedResult&lt;UserDto&gt;&gt; GetUsersAsync(int page, int pageSize)
{
    var query = context.Users
        .AsNoTracking()
        .Where(u =&gt; u.IsActive)
        .OrderBy(u =&gt; u.CreatedAt);
    
    var totalCount = await query.CountAsync();
    
    var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(u =&gt; new UserDto(u.Id, u.Name, u.Email))
        .ToListAsync();
    
    return new PagedResult&lt;UserDto&gt;(items, totalCount, page, pageSize);
}
    </code>
  </example>
  <warning>Always include OrderBy before Skip/Take for consistent results</warning>
</pagination>
<pitfalls>
  <pitfall name="cartesian_explosion">
    <symptom>Query returns many more rows than expected, slow performance</symptom>
    <cause>Multiple Include() on collections without AsSplitQuery()</cause>
    <solution>Use AsSplitQuery() or separate queries</solution>
  </pitfall>
  
  <pitfall name="lazy_loading_disposed_context">
    <symptom>NullReferenceException or ObjectDisposedException</symptom>
    <cause>Accessing navigation property after DbContext is disposed</cause>
    <solution>Eager load with Include() or project with Select()</solution>
  </pitfall>
  
  <pitfall name="tracking_large_datasets">
    <symptom>High memory usage, OutOfMemoryException</symptom>
    <cause>Loading thousands of tracked entities</cause>
    <solution>Use AsNoTracking(), pagination, or streaming with AsAsyncEnumerable()</solution>
  </pitfall>
  
  <pitfall name="client_evaluation">
    <symptom>Warning about client evaluation, slow queries</symptom>
    <cause>Using methods that can't be translated to SQL</cause>
    <solution>Rewrite query to use translatable methods or move filtering to SQL</solution>
    <example>
      <code>
// BAD: Client evaluation - loads all users, filters in memory
var users = await context.Users
    .Where(u =&gt; MyCustomMethod(u.Name))  // Can't translate
    .ToListAsync();
// GOOD: Use translatable method
var users = await context.Users
    .Where(u =&gt; u.Name.Contains(searchTerm))  // Translates to LIKE
    .ToListAsync();
      </code>
    </example>
  </pitfall>
  
  <pitfall name="multiple_savechanges">
    <symptom>Multiple database round-trips, potential partial updates</symptom>
    <cause>Calling SaveChanges multiple times in one operation</cause>
    <solution>Batch changes and call SaveChanges once</solution>
  </pitfall>
  
  <pitfall name="query_in_loop">
    <symptom>Slow performance, many database queries</symptom>
    <cause>Executing queries inside foreach loops</cause>
    <solution>Load all needed data before loop or use batch queries</solution>
    <example>
      <code>
// BAD: Query per ID
foreach (var id in userIds)
{
    var user = await context.Users.FindAsync(id);  // N queries
}
// GOOD: Single query
var users = await context.Users
    .Where(u =&gt; userIds.Contains(u.Id))
    .ToDictionaryAsync(u =&gt; u.Id);  // 1 query
      </code>
    </example>
  </pitfall>
</pitfalls>
<raw_sql>
  <description>Use raw SQL when LINQ can't express the query efficiently</description>
  <methods>
    <method name="FromSqlInterpolated">
      <description>Safe interpolation with automatic parameterization</description>
      <code>
var minDate = DateTime.UtcNow.AddDays(-30);
var users = await context.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE CreatedAt &gt; {minDate}")
    .Where(u =&gt; u.IsActive)  // Can chain LINQ
    .ToListAsync();
      </code>
    </method>
    <method name="SqlQuery" version="EF Core 8+">
      <description>Execute arbitrary SQL returning specific types</description>
      <code>
var stats = await context.Database
    .SqlQuery&lt;UserStats&gt;($@"
        SELECT 
            DepartmentId,
            COUNT(*) as UserCount,
            AVG(Salary) as AvgSalary
        FROM Users
        GROUP BY DepartmentId")
    .ToListAsync();
      </code>
    </method>
  </methods>
  <warning>Never use string concatenation for user input - always use parameterized queries</warning>
</raw_sql>
<change_tracker_optimization>
  <description>Optimize change tracker for bulk operations</description>
  <techniques>
    <technique name="disable_auto_detect">
      <code>
context.ChangeTracker.AutoDetectChangesEnabled = false;
try
{
    foreach (var item in items)
    {
        context.Items.Add(item);
    }
    await context.SaveChangesAsync();
}
finally
{
    context.ChangeTracker.AutoDetectChangesEnabled = true;
}
      </code>
    </technique>
    <technique name="clear_tracker">
      <code>
// After SaveChanges, clear tracked entities to free memory
await context.SaveChangesAsync();
context.ChangeTracker.Clear();
      </code>
    </technique>
    <technique name="attach_for_update">
      <code>
// Update without loading
var user = new User { Id = userId, Name = newName };
context.Attach(user);
context.Entry(user).Property(u =&gt; u.Name).IsModified = true;
await context.SaveChangesAsync();
      </code>
    </technique>
  </techniques>
</change_tracker_optimization>
<query_checklist>
  <item>Is this read-only? → Add AsNoTracking()</item>
  <item>Do I need all columns? → Use Select() projection</item>
  <item>Multiple collections? → Add AsSplitQuery()</item>
  <item>Large result set? → Add pagination</item>
  <item>Query in loop? → Refactor to batch query</item>
  <item>Bulk update/delete? → Use ExecuteUpdate/ExecuteDelete</item>
  <item>Hot path query? → Consider compiled query</item>
</query_checklist>