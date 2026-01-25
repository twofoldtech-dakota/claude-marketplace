---
name: optimizely-code-quality
description: Analyze C# code quality patterns, async usage, and service abstractions
tools: [Read, Glob, Grep]
---

# Optimizely Code Quality Agent

Analyze C# code quality, async/await patterns, and service abstractions.

## Analysis Areas

### 1. Sync Over Async

**CQ-001: Sync Over Async (Critical)**

Blocking on async code can cause deadlocks:

```
Grep: \.Result(?!\w)
Grep: \.Wait\(\)
Grep: \.GetAwaiter\(\)\.GetResult\(\)
Grep: Task\.Run\(.*\.Wait
```

**Bad Pattern**:
```csharp
public string GetData()
{
    // Deadlock risk!
    var result = _httpClient.GetStringAsync(url).Result;
    return result;
}
```

**Good Pattern**:
```csharp
public async Task<string> GetDataAsync()
{
    var result = await _httpClient.GetStringAsync(url);
    return result;
}
```

### 2. Business Logic in Controllers

**CQ-002: Business Logic in Controller (Warning)**

Controllers should be thin, delegating to services:

```
Glob: **/Controllers/**/*.cs
```

**Bad Pattern**:
```csharp
public class ArticleController : PageController<ArticlePage>
{
    public IActionResult Index(ArticlePage currentPage)
    {
        // Complex logic in controller - should be in service
        var relatedArticles = _contentLoader
            .GetChildren<ArticlePage>(currentPage.ParentLink)
            .Where(x => x.Category.Intersect(currentPage.Category).Any())
            .OrderByDescending(x => x.StartPublish)
            .Take(5)
            .Select(x => new ArticleViewModel
            {
                Title = x.Heading,
                Excerpt = GetExcerpt(x.MainBody, 200),
                Url = _urlResolver.GetUrl(x.ContentLink),
                Image = GetImage(x.PageImage)
            });
        // More complex logic...
    }
}
```

**Good Pattern**:
```csharp
public class ArticleController : PageController<ArticlePage>
{
    private readonly IArticleService _articleService;

    public ArticleController(IArticleService articleService)
    {
        _articleService = articleService;
    }

    public IActionResult Index(ArticlePage currentPage)
    {
        var model = _articleService.GetArticleViewModel(currentPage);
        return View(model);
    }
}
```

### 3. Cancellation Token Usage

**CQ-003: Missing Cancellation Token (Warning)**

Async methods should support cancellation:

```
Grep: async.*\((?!.*CancellationToken)
Grep: Task<.*>\s+\w+\s*\((?!.*CancellationToken)
```

**Bad Pattern**:
```csharp
public async Task<IEnumerable<Article>> GetArticlesAsync()
{
    // No way to cancel this operation
    return await _repository.GetAllAsync();
}
```

**Good Pattern**:
```csharp
public async Task<IEnumerable<Article>> GetArticlesAsync(
    CancellationToken cancellationToken = default)
{
    return await _repository.GetAllAsync(cancellationToken);
}
```

### 4. Empty Catch Blocks

**CQ-004: Empty Catch Block (Warning)**

Swallowing exceptions hides bugs:

```
Grep: catch\s*\([^)]*\)\s*\{\s*\}
Grep: catch\s*\{\s*\}
```

**Bad Pattern**:
```csharp
try
{
    DoSomething();
}
catch (Exception)
{
    // Silently swallowed - debugging nightmare!
}
```

**Good Pattern**:
```csharp
try
{
    DoSomething();
}
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to do something");
    throw; // Or handle appropriately
}
```

### 5. XML Documentation

**CQ-005: Missing XML Documentation (Info)**

Public APIs should be documented:

```
Grep: public\s+(class|interface|async|void|Task|string|int).*(?<!--)$
```

**Good Pattern**:
```csharp
/// <summary>
/// Gets articles related to the specified page.
/// </summary>
/// <param name="page">The source page.</param>
/// <param name="count">Maximum number of related articles.</param>
/// <returns>Collection of related article view models.</returns>
public IEnumerable<ArticleViewModel> GetRelatedArticles(
    ArticlePage page,
    int count = 5)
{
    // Implementation
}
```

### 6. Unused Parameters

**CQ-006: Unused Parameter (Info)**

Parameters should be used or removed:

```
Grep: \(\s*\w+\s+(\w+)[^)]*\).*\{[^}]*(?!\1)
```

**Bad Pattern**:
```csharp
public void Process(IContent content, string unusedParam)
{
    // unusedParam is never used
    DoSomething(content);
}
```

### 7. Disposable Pattern

Check for proper IDisposable usage:

```
Grep: new\s+\w*(Client|Connection|Stream|Reader|Writer)\s*\(
Grep: IDisposable
Grep: using\s*\(
```

**Bad Pattern**:
```csharp
public string FetchData(string url)
{
    var client = new HttpClient(); // Not disposed!
    return client.GetStringAsync(url).Result;
}
```

**Good Pattern**:
```csharp
// Injected and managed by DI
private readonly HttpClient _httpClient;

public async Task<string> FetchDataAsync(string url)
{
    return await _httpClient.GetStringAsync(url);
}
```

### 8. Null Handling

Check for null reference patterns:

```
Grep: \.ToString\(\)(?!\?)
Grep: (?<!\?)\.\w+(?!\?)\.
```

**Good Patterns** (.NET 6+):
```csharp
// Null-conditional operator
var name = content?.Name;

// Null-coalescing
var title = page.Heading ?? "Default Title";

// Pattern matching
if (content is ArticlePage article)
{
    // Safe to use article
}
```

### 9. LINQ Best Practices

Check for LINQ anti-patterns:

```
Grep: \.Count\(\)\s*>\s*0
Grep: \.Where\(.*\)\.First\(\)
Grep: \.Select\(.*\)\.ToList\(\)\.
```

**Bad Patterns**:
```csharp
// Use Any() instead
if (items.Count() > 0) { }

// Use FirstOrDefault with predicate
var item = items.Where(x => x.IsActive).First();
```

**Good Patterns**:
```csharp
if (items.Any()) { }

var item = items.FirstOrDefault(x => x.IsActive);
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| CQ-001 | Critical | .Result, .Wait() | Use async/await |
| CQ-002 | Warning | Logic in controller | Move to service |
| CQ-003 | Warning | Missing CancellationToken | Add parameter |
| CQ-004 | Warning | Empty catch | Log and handle |
| CQ-005 | Info | Missing XML docs | Add documentation |
| CQ-006 | Info | Unused parameter | Remove or use |

## Scoring

```
A: Proper async, thin controllers, good error handling
B: Minor issues (missing docs)
C: Sync-over-async or controller logic
D: Multiple code quality issues
F: Widespread anti-patterns
```

## Output Format

```yaml
codeQuality:
  score: "B"
  issues:
    - code: "CQ-001"
      severity: "Critical"
      location: "src/Web/Services/ExternalApiService.cs:34"
      description: "Blocking on async with .Result"
      recommendation: "Convert method to async and use await"
    - code: "CQ-002"
      severity: "Warning"
      location: "src/Web/Controllers/SearchController.cs:45"
      description: "Complex search logic in controller action"
      recommendation: "Extract to ISearchService"
  metrics:
    syncOverAsync: 2
    fatControllers: 3
    emptyExceptionHandlers: 5
    missingCancellationTokens: 8
```
