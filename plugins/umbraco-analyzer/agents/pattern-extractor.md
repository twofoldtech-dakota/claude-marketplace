# Pattern Extractor Agent - Umbraco

Extract project-specific patterns from Umbraco codebases to generate AI-enhancing skills.

## Agent Configuration

**Name**: `pattern-extractor`
**Tools**: `Read, Glob, Grep`
**Purpose**: Detect and document coding patterns specific to this project

## Pattern Categories

### 1. Composer Patterns

**Detection Strategy**:
```
1. Find all IComposer implementations
2. Analyze service registrations
3. Detect notification handler registrations
4. Identify ordering attributes
5. Check for composition dependencies
```

**Files to Scan**:
- `**/Composers/**/*.cs`
- `**/*Composer.cs`
- `**/Composition/**/*.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Composer base | `IComposer` implementation | Service registration |
| Ordering | `[ComposeAfter]`, `[ComposeBefore]` | Composition order |
| Notification registration | `AddNotificationHandler` | Event handling |
| Service lifetime | `AddScoped`, `AddTransient`, `AddSingleton` | DI lifetimes |

**Output Format**:
```yaml
composerPatterns:
  namingConvention: "{Feature}Composer"
  location: "Composers/"
  orderingUsed: true
  commonRegistrations:
    - services: "Scoped"
    - handlers: "Transient"
  examples:
    - name: NavigationComposer
      file: Composers/NavigationComposer.cs
```

### 2. Service Patterns

**Detection Strategy**:
```
1. Find service classes and their interfaces
2. Identify common base classes
3. Detect constructor injection patterns
4. Analyze async patterns
```

**Files to Scan**:
- `**/Services/**/*.cs`
- `**/*Service.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Interface convention | `I{Name}Service` | Service abstraction |
| Async methods | `Task<T>` returns with `Async` suffix | Async patterns |
| Cancellation | `CancellationToken` parameters | Cancellation support |
| Caching | `IAppCache`, `HybridCache` usage | Cache patterns |

### 3. Controller Patterns

**Detection Strategy**:
```
1. Find Surface controllers
2. Identify API controllers
3. Detect render controllers
4. Analyze action patterns
```

**Files to Scan**:
- `**/Controllers/**/*.cs`
- `**/*Controller.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Surface controller | `: SurfaceController` | Form handling |
| API controller | `: UmbracoApiController` | JSON APIs |
| Render controller | `: RenderController` | Custom routing |
| Action naming | Method naming conventions | RESTful patterns |

**Output Format**:
```yaml
controllerPatterns:
  surfaceControllers:
    count: 6
    namingConvention: "{Feature}SurfaceController"
    baseClass: "SurfaceController"
  apiControllers:
    count: 4
    namingConvention: "{Feature}ApiController"
    baseClass: "UmbracoApiController"
```

### 4. Notification Handler Patterns

**Detection Strategy**:
```
1. Find INotificationHandler implementations
2. Identify handled notification types
3. Analyze async vs sync handlers
4. Detect handler ordering
```

**Files to Scan**:
- `**/Handlers/**/*.cs`
- `**/NotificationHandlers/**/*.cs`
- `**/*Handler.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Async handler | `INotificationAsyncHandler<T>` | Async notifications |
| Sync handler | `INotificationHandler<T>` | Sync notifications |
| Content events | `ContentPublishedNotification` | Content lifecycle |
| Media events | `MediaSavedNotification` | Media lifecycle |

### 5. Property Value Converter Patterns

**Detection Strategy**:
```
1. Find IPropertyValueConverter implementations
2. Identify converted types
3. Detect caching strategies
4. Analyze conversion patterns
```

**Files to Scan**:
- `**/PropertyValueConverters/**/*.cs`
- `**/*Converter.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Converter class | `IPropertyValueConverter` | Property conversion |
| Editor alias | `PropertyEditorAlias` attribute | Editor binding |
| Cache level | `PropertyCacheLevel` | Cache strategy |
| Return type | `ConvertIntermediateToObject` return | Output type |

### 6. Backoffice Extension Patterns (v14+)

**Detection Strategy**:
```
1. Find umbraco-package.json files
2. Analyze Lit component implementations
3. Detect property editor registrations
4. Identify dashboard extensions
```

**Files to Scan**:
- `**/App_Plugins/**/*.ts`
- `**/App_Plugins/**/*.js`
- `**/umbraco-package.json`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Package manifest | `umbraco-package.json` | Extension config |
| Lit element | `@customElement` | Custom elements |
| Property editor | `propertyEditorUi` | Editor extensions |
| Dashboard | `dashboard` extension type | Backoffice dashboards |

## Execution

```bash
# The agent executes these steps:

1. Glob for pattern-specific files
2. Read and analyze file contents
3. Extract pattern metadata
4. Build pattern documentation
5. Return structured pattern data
```

## Output Schema

```json
{
  "patterns": {
    "composers": [...],
    "services": [...],
    "controllers": [...],
    "notificationHandlers": [...],
    "propertyConverters": [...],
    "backofficeExtensions": [...]
  },
  "statistics": {
    "totalPatternsFound": 38,
    "composersAnalyzed": 8,
    "servicesAnalyzed": 15,
    "controllersAnalyzed": 10
  },
  "examples": [
    {
      "pattern": "IComposer",
      "file": "Composers/NavigationComposer.cs",
      "snippet": "..." // Sanitized
    }
  ]
}
```

### 7. Testing Patterns

**Detection Strategy**:
```
1. Identify test framework (xUnit, NUnit, MSTest)
2. Find test project organization
3. Detect mocking strategies
4. Analyze Umbraco-specific test patterns
5. Check for integration test patterns
```

**Files to Scan**:
- `**/*.Tests/**/*.cs`
- `**/Tests/**/*.cs`
- `**/*Tests.cs`
- `**/*Test.cs`
- `**/*.csproj`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Test framework | Package references | xUnit, NUnit |
| Mocking framework | `Mock<T>`, `Substitute.For<T>` | Moq, NSubstitute |
| Umbraco mocking | `PublishedContentMock` | Content mocking |
| Naming convention | Test method names | BDD or AAA style |
| Integration tests | `UmbracoIntegrationTest` base | Integration patterns |
| Frontend tests | Jest, Playwright for Lit | Backoffice tests |

**Output Format**:
```yaml
testingPatterns:
  backend:
    framework: "xUnit"
    mockingLibrary: "NSubstitute"
    umbracoMocking: "Umbraco.Cms.Tests.Common"
    namingConvention: "Should_{Behavior}_When_{Condition}"
  frontend:
    framework: "Jest"
    litTesting: "@open-wc/testing"
    e2e: "Playwright"
  organization:
    structure: "Separate test projects"
    naming: "{Project}.Tests"
  examples:
    - name: NavigationServiceTests
      file: tests/Services/NavigationServiceTests.cs
```

### 8. Error Handling Patterns

**Detection Strategy**:
```
1. Find exception handling patterns
2. Identify logging conventions
3. Detect Umbraco-specific error handling
4. Analyze notification-based error propagation
5. Check error response patterns
```

**Files to Scan**:
- `**/Exceptions/**/*.cs`
- `**/*Exception.cs`
- `**/Handlers/**/*.cs`
- `**/Middleware/**/*.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Logging | `ILogger<T>` usage | Microsoft.Extensions.Logging |
| Custom exceptions | Exception class definitions | Domain exceptions |
| Notification errors | `CancelOperation` in handlers | Notification cancellation |
| Middleware errors | Exception middleware | Global error handling |
| API errors | `ProblemDetails` usage | RFC 7807 responses |
| Validation errors | ModelState, FluentValidation | Input validation |

**Output Format**:
```yaml
errorHandlingPatterns:
  logging:
    framework: "Microsoft.Extensions.Logging"
    pattern: "ILogger<T> constructor injection"
    structuredLogging: true
    sinks: ["Console", "Serilog"]
  customExceptions:
    - name: "ContentNotFoundException"
      file: "Exceptions/ContentNotFoundException.cs"
  notificationErrors:
    cancellation: "messages.Add(EventMessage) + e.Cancel = true"
    pattern: "Validate in handler, cancel on failure"
  apiErrors:
    format: "ProblemDetails"
    middleware: "UseExceptionHandler"
  validation:
    library: "FluentValidation"
    pattern: "Validator per model"
```

## Execution

```bash
# The agent executes these steps:

1. Glob for pattern-specific files
2. Read and analyze file contents
3. Extract pattern metadata
4. Build pattern documentation
5. Return structured pattern data
```

## Output Schema

```json
{
  "patterns": {
    "composers": [...],
    "services": [...],
    "controllers": [...],
    "notificationHandlers": [...],
    "propertyConverters": [...],
    "backofficeExtensions": [...],
    "testing": [...],
    "errorHandling": [...]
  },
  "statistics": {
    "totalPatternsFound": 38,
    "composersAnalyzed": 8,
    "servicesAnalyzed": 15,
    "controllersAnalyzed": 10,
    "testFilesAnalyzed": 20,
    "errorPatternsFound": 5
  },
  "examples": [
    {
      "pattern": "IComposer",
      "file": "Composers/NavigationComposer.cs",
      "snippet": "..." // Sanitized
    }
  ]
}
```

## Privacy

- Skip files matching `.claudeignore`
- Do not extract connection strings
- Sanitize code snippets
- Focus on structure, not implementation details
