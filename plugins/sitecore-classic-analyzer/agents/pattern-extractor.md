# Pattern Extractor Agent - Sitecore Classic

Extract project-specific patterns from Sitecore 10.x codebases to generate AI-enhancing skills.

## Agent Configuration

**Name**: `pattern-extractor`
**Tools**: `Read, Glob, Grep`
**Purpose**: Detect and document coding patterns specific to this project

## Pattern Categories

### 1. Service Layer Patterns

**Detection Strategy**:
```
1. Find all classes ending in "Service"
2. Identify base classes and interfaces
3. Detect constructor injection patterns
4. Analyze method signatures and return types
5. Check for caching decorators
```

**Files to Scan**:
- `**/Services/**/*.cs`
- `**/Foundation/**/code/**/*Service.cs`
- `**/Feature/**/code/**/*Service.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Base service class | `class.*Service.*:.*ServiceBase` | `NavigationService : ServiceBase<INavigationService>` |
| Interface convention | `I{Name}Service` paired with `{Name}Service` | `ISearchService` / `SearchService` |
| Constructor injection | Constructor with `ILogger`, `IConfiguration`, etc. | DI pattern usage |
| Async patterns | Methods returning `Task<T>` | Async service methods |

**Output Format**:
```yaml
servicePatterns:
  baseClass: "ServiceBase<T>"
  interfaceConvention: "I{Name}Service"
  registration: "Scoped"
  commonDependencies:
    - ILogger<T>
    - ISitecoreContext
    - IContentSearchService
  examples:
    - name: NavigationService
      file: src/Feature/Navigation/code/Services/NavigationService.cs
```

### 2. Repository Patterns

**Detection Strategy**:
```
1. Find classes with "Repository" in name
2. Identify generic repository patterns
3. Detect caching strategies
4. Analyze query patterns (Content Search vs direct)
```

**Files to Scan**:
- `**/Repositories/**/*.cs`
- `**/*Repository.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Generic repository | `IRepository<T>` | `IRepository<Article>` |
| Caching decorator | `Cached*Repository` | `CachedArticleRepository` |
| Content Search usage | `ContentSearchManager.GetIndex` | Search-based queries |
| Glass Mapper integration | `ISitecoreContext`, `IGlassHtml` | ORM patterns |

### 3. Controller Patterns

**Detection Strategy**:
```
1. Find classes inheriting from Controller
2. Identify rendering controller base classes
3. Analyze action method patterns
4. Detect model binding conventions
```

**Files to Scan**:
- `**/Controllers/**/*.cs`
- `**/*Controller.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Base controller | Custom base class inheritance | `RenderingController` |
| Action naming | Method naming conventions | `Index`, `Get{Resource}` |
| Model binding | `[FromRoute]`, `[FromQuery]` usage | Parameter binding |
| Error handling | Try/catch patterns in actions | Exception handling |

### 4. Pipeline Processor Patterns

**Detection Strategy**:
```
1. Find classes inheriting from processor base classes
2. Identify pipeline registration patterns
3. Detect processor ordering
```

**Files to Scan**:
- `**/Pipelines/**/*.cs`
- `**/*Processor.cs`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| HTTP pipeline | `: HttpRequestProcessor` | Request processors |
| Item pipeline | `: ItemProcessor` | Item event processors |
| Custom pipeline | Custom pipeline definitions | Domain-specific pipelines |

### 5. Configuration Patterns

**Detection Strategy**:
```
1. Analyze App_Config/Include structure
2. Identify naming conventions for patch files
3. Detect environment-specific configurations
4. Find role-based configurations
```

**Files to Scan**:
- `**/App_Config/Include/**/*.config`
- `**/*.module.json`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Patch naming | File naming convention | `Feature.Navigation.config` |
| Layer organization | Folder structure | `/Foundation/`, `/Feature/`, `/Project/` |
| Environment configs | `env:require` attributes | Production-specific settings |
| Role configs | `role:require` attributes | CM/CD specific settings |

### 6. Dependency Injection Patterns

**Detection Strategy**:
```
1. Find IServicesConfigurator implementations
2. Analyze service registration patterns
3. Detect lifetime choices (Transient, Scoped, Singleton)
```

**Files to Scan**:
- `**/*Configurator.cs`
- `**/DependencyInjection/**/*.cs`
- `**/RegisterDependencies.cs`

**Output Format**:
```yaml
diPatterns:
  configuratorBase: "IServicesConfigurator"
  registrationFile: "RegisterDependencies.cs"
  lifetimeDefaults:
    services: "Scoped"
    repositories: "Scoped"
    factories: "Transient"
  conventions:
    - "services.AddTransient<I{Name}, {Name}>();"
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
    "services": [...],
    "repositories": [...],
    "controllers": [...],
    "pipelines": [...],
    "configuration": [...],
    "dependencyInjection": [...]
  },
  "statistics": {
    "totalPatternsFound": 45,
    "servicesAnalyzed": 12,
    "controllersAnalyzed": 15,
    "configFilesAnalyzed": 28
  },
  "examples": [
    {
      "pattern": "ServiceBase<T>",
      "file": "src/Feature/Navigation/code/Services/NavigationService.cs",
      "snippet": "..." // Sanitized
    }
  ]
}
```

## Privacy

- Skip files matching `.claudeignore`
- Do not extract hardcoded values
- Sanitize code snippets (remove credentials)
- Focus on structure, not implementation details
