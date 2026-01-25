---
name: optimizely-pattern-extractor
description: Extract project-specific patterns and conventions from Optimizely CMS codebase
tools: [Read, Glob, Grep]
---

# Optimizely Pattern Extractor Agent

Learn project-specific patterns, conventions, and architectural decisions to generate custom AI skills.

## Extraction Areas

### 1. Content Type Patterns

Extract content type inheritance and structure patterns:

```
Glob: **/Models/Pages/**/*.cs
Glob: **/Models/Blocks/**/*.cs
Glob: **/Models/Media/**/*.cs
```

**Extract**:
- Base class hierarchy (e.g., `SitePageData`, `SiteBlockData`)
- Common property patterns across content types
- Attribute usage (Display, Required, AllowedTypes)
- GUID naming patterns
- GroupName conventions

**Example Pattern**:
```csharp
// Project pattern: All pages inherit from SitePageData
public abstract class SitePageData : PageData
{
    [Display(GroupName = "SEO")]
    public virtual string MetaTitle { get; set; }

    [Display(GroupName = "SEO")]
    [StringLength(160)]
    public virtual string MetaDescription { get; set; }
}
```

### 2. Service Patterns

Extract service layer patterns:

```
Glob: **/Services/**/*.cs
Glob: **/Business/**/*.cs
Grep: interface I\w+Service
Grep: class \w+Service
```

**Extract**:
- Interface definitions
- Constructor injection patterns
- Common method signatures
- Error handling approaches
- Async patterns

### 3. Controller Patterns

Extract controller conventions:

```
Glob: **/Controllers/**/*.cs
Grep: : PageController<
Grep: : ContentController<
Grep: : BlockController<
```

**Extract**:
- Base controller usage
- Action naming conventions
- View model construction
- Route patterns

### 4. View Patterns

Extract Razor view conventions:

```
Glob: **/Views/**/*.cshtml
```

**Extract**:
- Layout structure
- Partial view organization
- Tag helper usage
- Content rendering patterns

### 5. Initialization Patterns

Extract initialization module patterns:

```
Glob: **/Initialization/**/*.cs
Grep: IInitializableModule
Grep: IConfigurableModule
```

**Extract**:
- Module organization
- Dependency declarations
- Configuration patterns
- Event subscriptions

### 6. Configuration Patterns

Extract configuration approaches:

```
Glob: **/appsettings*.json
Glob: **/Startup.cs
Glob: **/Program.cs
```

**Extract**:
- Configuration section structure
- Options pattern usage
- Service registration patterns
- Middleware ordering

### 7. Naming Conventions

Identify project-specific naming patterns:

**Extract**:
- Class naming prefixes/suffixes
- Property naming styles
- Namespace organization
- File naming conventions

### 8. Error Handling Patterns

Extract error handling approaches:

```
Grep: catch\s*\(
Grep: ILogger
Grep: LogError|LogWarning
```

**Extract**:
- Exception types used
- Logging patterns
- Error response formats
- Retry patterns

### 9. Caching Patterns

Extract caching strategies:

```
Grep: IMemoryCache
Grep: IDistributedCache
Grep: OutputCache
Grep: CacheControl
```

**Extract**:
- Cache key conventions
- Expiration patterns
- Cache invalidation approaches

### 10. Integration Patterns

Extract external service patterns:

```
Grep: HttpClient
Grep: RestClient
Grep: GraphQL
```

**Extract**:
- API client patterns
- Authentication approaches
- Retry/resilience patterns

## Output Format

Generate structured pattern documentation:

```yaml
patterns:
  contentTypes:
    baseClasses:
      - name: "SitePageData"
        properties:
          - "MetaTitle"
          - "MetaDescription"
          - "OpenGraphImage"
    conventions:
      - "All page types inherit from SitePageData"
      - "SEO properties grouped under 'SEO' tab"
      - "GUIDs use lowercase with dashes"

  services:
    naming: "{Entity}Service implements I{Entity}Service"
    injection: "Constructor injection with readonly fields"
    async: "All data access methods are async with CancellationToken"

  controllers:
    baseClass: "PageController<T>"
    naming: "{ContentType}Controller"
    viewModels: "{ContentType}ViewModel"

  views:
    structure:
      - "Views/{ContentType}/Index.cshtml for pages"
      - "Views/Shared/Blocks/{BlockType}.cshtml for blocks"
    partials: "_Prefix convention for partials"

  initialization:
    naming: "{Feature}Initialization"
    organization: "One module per feature"

  configuration:
    structure: "Hierarchical JSON with section classes"
    options: "IOptions<T> pattern for typed config"

  errorHandling:
    logging: "Serilog with structured logging"
    exceptions: "Domain-specific exception types"

  caching:
    strategy: "IMemoryCache for short-lived, Redis for distributed"
    keys: "{Type}:{Id}:{Culture} format"
```

## Usage

The extracted patterns are used by the skill-generator agent to create project-specific SKILL.md files that teach Claude about this particular codebase's conventions and patterns.

## Pattern Quality Indicators

Mark patterns with confidence levels:

- **High**: Pattern found in 80%+ of relevant code
- **Medium**: Pattern found in 50-80% of code
- **Low**: Pattern found in <50% of code (may be inconsistent)

## Cross-Reference

Patterns should be cross-referenced with:
- Analysis findings (issues to avoid)
- Best practices (patterns to follow)
- Anti-patterns (patterns to avoid)
