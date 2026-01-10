---
name: sitecore-classic-code-quality
description: Analyze C# code quality patterns in Sitecore 10.x projects
tools: [Read, Glob, Grep]
---

# Sitecore Classic Code Quality Agent

Analyze C# code patterns, dependency injection, and Sitecore-specific anti-patterns.

## Analysis Areas

### 1. Service Locator Anti-Pattern

Search for direct service location instead of constructor injection:

```csharp
// Anti-pattern to detect
ServiceLocator.ServiceProvider.GetService<IMyService>()
DependencyResolver.Current.GetService<IMyService>()
```

### 2. Dependency Injection Patterns

Verify proper DI registration via `IServicesConfigurator`:

```csharp
// Good pattern
public class RegisterDependencies : IServicesConfigurator
{
    public void Configure(IServiceCollection services)
    {
        services.AddTransient<IMyService, MyService>();
    }
}
```

Check for:
- Services registered with appropriate lifetime (Transient, Scoped, Singleton)
- Interfaces used for dependencies
- No manual instantiation of services with dependencies

### 3. Static Context Access

Flag usage of static Sitecore context in async code:

```csharp
// Dangerous in async - context may be null
Sitecore.Context.Item
Sitecore.Context.Database
Sitecore.Context.Site
```

### 4. Controller Rendering Patterns

Analyze controller implementations:

```csharp
// Good pattern
public class NavigationController : Controller
{
    private readonly INavigationService _service;

    public NavigationController(INavigationService service)
    {
        _service = service;
    }

    public ActionResult Index()
    {
        var item = RenderingContext.Current.Rendering.Item;
        // ...
    }
}
```

Check for:
- Constructor injection used
- No business logic in controllers (delegate to services)
- Proper null checking on datasource items
- No direct database queries

### 5. Glass Mapper / ORM Patterns

If Glass Mapper is detected, check for:

```csharp
// Anti-pattern: Lazy loading in loop
foreach (var item in items)
{
    var children = item.Children; // N+1 query
}

// Good: Eager load or use Content Search
```

### 6. Repository Pattern

Verify repository implementations:
- Use Content Search for queries
- Don't expose IQueryable outside repository
- Proper error handling

### 7. Null Checking

Check for missing null checks on Sitecore item access:

```csharp
// Risky - item could be null
var title = Sitecore.Context.Item["Title"];

// Better
var item = Sitecore.Context.Item;
if (item == null) return;
var title = item["Title"];
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| CQ-001 | Critical | Service Locator pattern | `ServiceLocator.` or `DependencyResolver.Current` |
| CQ-002 | Critical | Static Context in async | `Sitecore.Context.*` in async method |
| CQ-003 | Warning | Missing null checks | Item field access without null check |
| CQ-004 | Warning | Business logic in controller | Controller method >20 lines |
| CQ-005 | Warning | Raw database queries | `Database.GetItem()` without caching consideration |
| CQ-006 | Info | Missing interface | Service class without interface |
| CQ-007 | Info | Glass Mapper lazy loading | `.Children` or `.Parent` access in loops |

## Analysis Steps

### Step 1: Scan for Anti-Patterns

```
Grep: ServiceLocator\.ServiceProvider
Grep: DependencyResolver\.Current
Grep: Sitecore\.Context\. (in async methods)
```

### Step 2: Analyze Controllers

```
Glob: **/Controllers/**/*.cs
For each controller:
  - Check constructor for DI
  - Count lines per action method
  - Check for datasource null handling
```

### Step 3: Review Service Registrations

```
Grep: IServicesConfigurator
Grep: services\.Add(Transient|Scoped|Singleton)
```

### Step 4: Check ORM Usage

```
Grep: IGlassHtml
Grep: ISitecoreContext
Grep: \.Children
Grep: \.Parent
```

## Output Format

```markdown
## Code Quality Analysis

### Summary
- **Controllers Analyzed**: 15
- **Services Analyzed**: 23
- **Issues Found**: 8

### Critical Issues

#### [CQ-001] Service Locator Pattern
**Location**: `src/Feature/Search/code/Services/SearchService.cs:45`
**Code**:
```csharp
var logger = ServiceLocator.ServiceProvider.GetService<ILogger>();
```
**Fix**: Inject ILogger via constructor

### Warnings

#### [CQ-004] Business Logic in Controller
**Location**: `src/Feature/Navigation/code/Controllers/NavigationController.cs:23`
**Issue**: BuildNavigation method is 45 lines
**Fix**: Extract to INavigationService

### Recommendations
1. Create INavigationService and move BuildNavigation logic
2. Replace 3 ServiceLocator usages with constructor injection
3. Add null checks to 5 datasource access points
```
