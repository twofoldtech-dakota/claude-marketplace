---
name: umbraco-code-quality
description: Analyze C# code quality and Umbraco-specific patterns
tools: [Read, Glob, Grep]
---

# Umbraco Code Quality Agent

Analyze C# code patterns, controller implementations, and Umbraco-specific best practices.

## Analysis Areas

### 1. Surface Controller Patterns

Check for proper Surface controller implementation:

```csharp
// Good: Proper Surface controller
public class ContactFormController : SurfaceController
{
    private readonly IContactService _contactService;

    public ContactFormController(
        IUmbracoContextAccessor umbracoContextAccessor,
        IUmbracoDatabaseFactory databaseFactory,
        ServiceContext services,
        AppCaches appCaches,
        IProfilingLogger profilingLogger,
        IPublishedUrlProvider publishedUrlProvider,
        IContactService contactService)
        : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
    {
        _contactService = contactService;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Submit(ContactFormModel model)
    {
        if (!ModelState.IsValid)
            return CurrentUmbracoPage();

        _contactService.ProcessContact(model);
        return RedirectToCurrentUmbracoPage();
    }
}
```

### 2. Async/Await Patterns

Check for sync-over-async anti-patterns:

```csharp
// Bad: Sync over async
public void ProcessContent()
{
    var result = _asyncService.GetDataAsync().Result;  // Blocking!
    var data = _asyncService.GetDataAsync().GetAwaiter().GetResult(); // Also blocking!
}

// Good: Proper async
public async Task ProcessContentAsync()
{
    var result = await _asyncService.GetDataAsync();
}
```

### 3. Cancellation Token Propagation

Check for proper cancellation token usage:

```csharp
// Bad: Token not propagated
public async Task<IActionResult> GetData()
{
    var data = await _service.GetDataAsync(); // Missing token
}

// Good: Token propagated
public async Task<IActionResult> GetData(CancellationToken ct)
{
    var data = await _service.GetDataAsync(ct);
}
```

### 4. Notification Handler Patterns

Check async notification handlers:

```csharp
// Good: Async handler
public class MyHandler : INotificationAsyncHandler<ContentPublishedNotification>
{
    public async Task HandleAsync(ContentPublishedNotification notification, CancellationToken ct)
    {
        await ProcessAsync(notification, ct);
    }
}

// Bad: Sync handler doing async work
public class MyHandler : INotificationHandler<ContentPublishedNotification>
{
    public void Handle(ContentPublishedNotification notification)
    {
        ProcessAsync(notification).Wait(); // Blocking!
    }
}
```

### 5. Property Value Converter Patterns

Check for proper converter implementation:

```csharp
// Good: Cached converter
public class MyConverter : PropertyValueConverterBase
{
    public override bool IsConverter(IPublishedPropertyType propertyType)
    {
        return propertyType.EditorAlias == "myEditor";
    }

    public override object ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object inter,
        bool preview)
    {
        // Return cached/efficient result
    }
}
```

### 6. Business Logic Placement

Check for logic in wrong layer:

```csharp
// Bad: Business logic in controller
public IActionResult Process()
{
    // 50 lines of business logic here...
}

// Good: Logic in service
public IActionResult Process()
{
    var result = _processService.Process();
    return View(result);
}
```

### 7. Exception Handling

Check for proper exception patterns:

```csharp
// Bad: Empty catch
try { ... }
catch { }  // Swallowed exception

// Bad: Catch all without logging
try { ... }
catch (Exception) { return null; }

// Good: Proper handling
try { ... }
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to process");
    throw;
}
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| CQ-001 | Critical | Sync over async | `.Result` or `.GetAwaiter().GetResult()` |
| CQ-002 | Warning | Business logic in controller | >20 lines in action method |
| CQ-003 | Warning | Missing cancellation token | Async method without CT parameter |
| CQ-004 | Warning | Empty catch block | `catch { }` or `catch (Exception) { }` |
| CQ-005 | Info | Missing XML documentation | Public API without docs |
| CQ-006 | Info | Unused parameter | Parameter not used in method |

## Analysis Steps

### Step 1: Find Sync-Over-Async

```
Grep: \.Result[^s]
Grep: \.GetAwaiter\(\)\.GetResult\(\)
Grep: \.Wait\(\)
```

### Step 2: Analyze Controllers

```
Glob: **/Controllers/**/*.cs
Count lines per action method
Check for ValidateAntiForgeryToken
```

### Step 3: Check Async Methods

```
Grep: async Task
Grep: CancellationToken
Verify CT parameter presence
```

### Step 4: Find Exception Issues

```
Grep: catch\s*\{
Grep: catch\s*\([^)]*\)\s*\{[^}]*\}
Check for logging in catch blocks
```

## Output Format

```markdown
## Code Quality Analysis

### Summary
- **Controllers Analyzed**: 8
- **Services Analyzed**: 15
- **Code Quality Score**: B

### Critical Issues

#### [CQ-001] Sync Over Async
**Location**: `src/Web/Services/ContentService.cs:67`
**Code**:
```csharp
var data = _httpClient.GetAsync(url).Result;
```
**Impact**: Thread pool starvation, potential deadlocks
**Fix**:
```csharp
var data = await _httpClient.GetAsync(url);
```

### Warnings

#### [CQ-002] Business Logic in Controller
**Location**: `src/Web/Controllers/OrderController.cs:45-120`
**Issue**: 75 lines of order processing in action method
**Fix**: Extract to `IOrderProcessingService`

#### [CQ-003] Missing Cancellation Token
**Locations**:
- `src/Web/Services/SearchService.cs:GetResultsAsync()`
- `src/Web/Services/EmailService.cs:SendAsync()`
**Fix**: Add `CancellationToken ct = default` parameter

### Code Metrics
| Category | Good | Warning | Critical |
|----------|------|---------|----------|
| Controllers | 6 | 2 | 0 |
| Services | 12 | 3 | 1 |
| Handlers | 5 | 0 | 0 |

### Recommendations
1. Fix blocking async call in ContentService
2. Extract order processing logic to service
3. Add cancellation token to 5 async methods
4. Add logging to 3 empty catch blocks
```
