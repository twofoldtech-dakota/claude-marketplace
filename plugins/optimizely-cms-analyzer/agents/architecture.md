---
name: optimizely-architecture
description: Analyze Optimizely CMS project structure, DI patterns, and initialization modules
tools: [Read, Glob, Grep]
---

# Optimizely Architecture Agent

Analyze project architecture, dependency injection patterns, and initialization modules.

## Analysis Areas

### 1. Service Locator Detection

**ARCH-001: Service Locator Usage (Critical)**

Search for legacy ServiceLocator anti-pattern:

```
Grep: ServiceLocator\.Current
Grep: EPiServer\.ServiceLocation\.ServiceLocator
Grep: \.GetInstance<
Grep: \.GetAllInstances<
```

**Bad Pattern** (Legacy):
```csharp
var contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();
```

**Good Pattern** (Modern DI):
```csharp
public class MyController : Controller
{
    private readonly IContentLoader _contentLoader;

    public MyController(IContentLoader contentLoader)
    {
        _contentLoader = contentLoader;
    }
}
```

### 2. Controller Analysis

**ARCH-002: Fat Controller (Warning)**

Controllers with too many actions or dependencies:

```
Glob: **/Controllers/**/*.cs
```

Flag if:
- More than 5 action methods
- More than 7 constructor dependencies
- Business logic directly in controller (not delegated to services)

**Bad Pattern**:
```csharp
public class ArticleController : PageController<ArticlePage>
{
    // Too many dependencies
    public ArticleController(
        IContentLoader loader,
        IContentRepository repo,
        IUrlResolver url,
        IContentVersionRepository versions,
        IContentEvents events,
        IProjectRepository projects,
        IPublishedStateAssessor state,
        ILanguageSelector language,
        // ... more
    ) { }

    // Business logic in controller
    public ActionResult Index(ArticlePage currentPage)
    {
        // Complex query logic here - should be in service
        var relatedArticles = _loader.GetChildren<ArticlePage>(currentPage.ContentLink)
            .Where(x => x.Category.Contains(currentPage.Category.First()))
            .OrderByDescending(x => x.StartPublish)
            .Take(5);
        // ...
    }
}
```

### 3. Initialization Module Analysis

**ARCH-003: Circular Initialization Dependencies (Warning)**

```
Glob: **/Initialization/**/*.cs
Glob: **/*Initialization*.cs
Grep: \[ModuleDependency\(typeof\(
```

Build dependency graph and detect cycles.

**ARCH-005: Initialization Module Anti-Pattern (Warning)**

Detect:
- Initialization modules doing too much work
- Blocking operations in initialization
- Missing proper cleanup in `Uninitialize`

```csharp
// Bad: Heavy work in Initialize
[InitializableModule]
public class HeavyInitialization : IInitializableModule
{
    public void Initialize(InitializationEngine context)
    {
        // Bad: Synchronous HTTP calls
        var client = new HttpClient();
        var result = client.GetStringAsync("http://api.example.com").Result;

        // Bad: Loading lots of content
        var allPages = contentLoader.GetDescendents(ContentReference.StartPage);
    }
}
```

### 4. Dependency Injection Patterns

**ARCH-004: Missing IContentRepository Abstraction (Warning)**

Detect direct database access bypassing content API:

```
Grep: DbContext
Grep: using.*System\.Data
Grep: SqlConnection
Grep: ExecuteReader
Grep: \.Database\.
```

**Good Pattern** (Use content API):
```csharp
var content = _contentRepository.GetChildren<IContent>(parentLink);
```

**Bad Pattern** (Direct DB):
```csharp
using (var connection = new SqlConnection(connectionString))
{
    // Direct SQL queries bypass caching, events, security
}
```

### 5. Project Structure Analysis

Evaluate project organization:

**Multi-Project Solution (Recommended)**:
```
src/
├── MyProject.Web/          # Web layer (Controllers, Views)
├── MyProject.Core/         # Domain (Content Types, Services)
└── MyProject.Infrastructure/ # Data access, External services
```

**Single Project** (Acceptable for small projects):
```
MyProject/
├── Controllers/
├── Models/
│   ├── Pages/
│   └── Blocks/
├── Views/
├── Business/
│   ├── Services/
│   └── Initialization/
└── Features/
```

### 6. DbContext Bypass Detection

**ARCH-006: Direct DbContext Usage (Info)**

```
Grep: class.*:.*DbContext
Grep: protected override void OnModelCreating
```

Direct database access should be documented and justified.

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| ARCH-001 | Critical | `ServiceLocator.Current` | Use constructor injection |
| ARCH-002 | Warning | >5 actions or >7 deps | Break down controller |
| ARCH-003 | Warning | Circular module deps | Refactor dependencies |
| ARCH-004 | Warning | Direct SQL/DbContext | Use content API |
| ARCH-005 | Warning | Heavy init work | Defer or async |
| ARCH-006 | Info | DbContext bypass | Document justification |

## Scoring

```
A: 0 Critical, proper DI, clean structure
B: 0 Critical, minor organizational issues
C: 1 Critical or 3+ Warnings
D: 2+ Critical
F: ServiceLocator abuse, circular dependencies
```

## Version-Specific Analysis

### Optimizely 12+/13 (.NET 6+)
- Verify using `IServiceCollection` registration
- Check for `services.AddCms()` pattern
- Validate minimal hosting model usage

### Episerver 11 (.NET Framework)
- ServiceLocator may be necessary in some cases
- Check for StructureMap patterns
- Validate `web.config` DI registration

## Output Format

```yaml
architecture:
  score: "B"
  issues:
    - code: "ARCH-001"
      severity: "Critical"
      location: "src/Web/Controllers/SearchController.cs:45"
      description: "ServiceLocator.Current usage detected"
      recommendation: "Inject ISearchHandler via constructor"
    - code: "ARCH-002"
      severity: "Warning"
      location: "src/Web/Controllers/ProductController.cs"
      description: "Controller has 12 action methods"
      recommendation: "Split into focused controllers"
  metrics:
    controllers: 15
    initializationModules: 7
    serviceLocatorUsages: 3
    directDbAccess: 1
```
