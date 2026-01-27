---
name: optimizely-skill-generator
description: Generate project-specific AI skills based on extracted Optimizely patterns
tools: [Read, Glob, Grep, Write]
---

# Optimizely Skill Generator Agent

Generate project-specific SKILL.md files to teach Claude about this codebase's patterns and conventions.

## Skill Generation Process

### 1. Input: Pattern Extraction Results

Use patterns extracted by the pattern-extractor agent:
- Content type patterns
- Service layer patterns
- Controller patterns
- Configuration patterns
- Naming conventions

### 2. Generate Skills Directory

Create skills in the project's `.claude/skills/` directory:

```
.claude/
└── skills/
    ├── optimizely-content-types/
    │   └── SKILL.md
    ├── optimizely-services/
    │   └── SKILL.md
    ├── optimizely-controllers/
    │   └── SKILL.md
    └── project-conventions/
        └── SKILL.md
```

### 3. Skill File Format

Each SKILL.md follows this structure:

```markdown
---
name: {skill-name}
description: {brief description}
version: 1.0.0
---

# {Skill Title}

## Overview
{What this skill teaches}

## Patterns

### Pattern 1: {Pattern Name}
{Description}

**Example:**
```{language}
{code example from actual codebase}
```

### Pattern 2: {Pattern Name}
...

## Conventions
- {Convention 1}
- {Convention 2}

## Anti-Patterns
- {What to avoid}

## References
- {File paths to examples in codebase}
```

## Generated Skills

### 1. Content Types Skill

**File**: `.claude/skills/optimizely-content-types/SKILL.md`

```markdown
---
name: optimizely-content-types
description: Optimizely content type patterns for this project
version: 1.0.0
---

# Optimizely Content Types

## Overview
This skill teaches the content type patterns used in this Optimizely CMS project.

## Base Classes

### SitePageData
All page types inherit from this base class.

**Location**: `src/Core/Models/Pages/SitePageData.cs`

**Properties**:
- `MetaTitle` - SEO title
- `MetaDescription` - SEO description
- `OpenGraphImage` - Social sharing image

**Example**:
```csharp
[ContentType(
    GUID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    DisplayName = "Article Page",
    GroupName = "Content")]
public class ArticlePage : SitePageData
{
    [Display(Name = "Heading", Order = 100)]
    [Required]
    public virtual string Heading { get; set; }

    [Display(Name = "Main Content", Order = 200)]
    public virtual XhtmlString MainBody { get; set; }
}
```

## Conventions
- Always include GUID attribute
- Use DisplayName for editor-friendly names
- Group properties with Display(Order = X)
- SEO properties in "SEO" group

## Anti-Patterns
- Content types without GUIDs
- Direct inheritance from PageData (use SitePageData)
- Missing Display attributes
```

### 2. Services Skill

**File**: `.claude/skills/optimizely-services/SKILL.md`

```markdown
---
name: optimizely-services
description: Service layer patterns for this Optimizely project
version: 1.0.0
---

# Service Layer Patterns

## Overview
This skill teaches the service layer patterns used in this project.

## Interface Pattern

All services follow the I{Name}Service pattern:

**Example**:
```csharp
public interface IArticleService
{
    Task<IEnumerable<ArticleViewModel>> GetRelatedArticlesAsync(
        ContentReference contentLink,
        int count = 5,
        CancellationToken cancellationToken = default);
}
```

## Implementation Pattern

**Example**:
```csharp
public class ArticleService : IArticleService
{
    private readonly IContentLoader _contentLoader;
    private readonly IUrlResolver _urlResolver;
    private readonly ILogger<ArticleService> _logger;

    public ArticleService(
        IContentLoader contentLoader,
        IUrlResolver urlResolver,
        ILogger<ArticleService> logger)
    {
        _contentLoader = contentLoader;
        _urlResolver = urlResolver;
        _logger = logger;
    }

    public async Task<IEnumerable<ArticleViewModel>> GetRelatedArticlesAsync(
        ContentReference contentLink,
        int count = 5,
        CancellationToken cancellationToken = default)
    {
        // Implementation
    }
}
```

## Conventions
- All data access methods are async
- Include CancellationToken parameter
- Use constructor injection
- Log errors with structured logging

## Registration

Register in DI container:
```csharp
services.AddScoped<IArticleService, ArticleService>();
```
```

### 3. Controllers Skill

**File**: `.claude/skills/optimizely-controllers/SKILL.md`

```markdown
---
name: optimizely-controllers
description: Controller patterns for this Optimizely project
version: 1.0.0
---

# Controller Patterns

## Overview
This skill teaches controller patterns for Optimizely content.

## Page Controller Pattern

**Example**:
```csharp
public class ArticlePageController : PageController<ArticlePage>
{
    private readonly IArticleService _articleService;

    public ArticlePageController(IArticleService articleService)
    {
        _articleService = articleService;
    }

    public async Task<IActionResult> Index(ArticlePage currentPage)
    {
        var viewModel = await _articleService.GetArticleViewModelAsync(currentPage);
        return View(viewModel);
    }
}
```

## Conventions
- Thin controllers - delegate to services
- Async actions when possible
- ViewModels, not direct content types
- One primary action per controller
```

### 4. Project Conventions Skill

**File**: `.claude/skills/project-conventions/SKILL.md`

Consolidates all project-specific conventions:
- Naming standards
- File organization
- Configuration patterns
- Error handling approaches

### 5. Testing Patterns Skill

**File**: `.claude/skills/testing-patterns/SKILL.md`

**Template**:
```markdown
---
name: testing-patterns
description: Testing patterns for this Optimizely CMS project
version: 1.0.0
---

# Testing Patterns

## Overview
This skill teaches testing patterns used in this Optimizely CMS project.

## Test Framework

This project uses **{TestFramework}** for testing.

### Mocking Library
{MockingLibrary}

## Content Mocking

### ContentLoader Mock
```csharp
{ContentLoaderMockExample}
```

### ContentReference Setup
```csharp
{ContentReferenceMockExample}
```

## Service Testing

### Unit Test Pattern
```csharp
{ServiceTestExample}
```

## Controller Testing

### Page Controller Test
```csharp
{ControllerTestExample}
```

## Integration Testing

### Test Fixtures
```csharp
{IntegrationFixtureExample}
```

## Conventions
- {TestConvention1}
- {TestConvention2}

## Anti-Patterns
- {TestAntiPattern1}
```

### 6. Error Handling Skill

**File**: `.claude/skills/error-handling/SKILL.md`

**Template**:
```markdown
---
name: error-handling
description: Error handling patterns for this Optimizely CMS project
version: 1.0.0
---

# Error Handling Patterns

## Overview
This skill teaches error handling patterns used in this project.

## Logging

### Framework
{LoggingFramework}

### Pattern
```csharp
{LoggingPattern}
```

### Structured Logging
```csharp
{StructuredLoggingExample}
```

## Custom Exceptions

{CustomExceptionList}

### Exception Hierarchy
```csharp
{ExceptionHierarchyExample}
```

## API Error Responses

### ProblemDetails
```csharp
{ProblemDetailsExample}
```

## Resilience Patterns

### Polly Integration
```csharp
{PollyExample}
```

## Conventions
- {ErrorConvention1}
- {ErrorConvention2}
```

### 7. Skill Metadata

**Output**: `.claude/skills/.meta.json`

**Template**:
```json
{
  "version": "1.0.0",
  "generatedAt": "{ISO_TIMESTAMP}",
  "generatedBy": "optimizely-cms-analyzer",
  "projectHash": "{PROJECT_HASH}",
  "skills": [
    {
      "name": "optimizely-content-types",
      "file": "optimizely-content-types/SKILL.md",
      "patternsFound": {ContentTypePatternCount}
    },
    {
      "name": "optimizely-services",
      "file": "optimizely-services/SKILL.md",
      "patternsFound": {ServicePatternCount}
    },
    {
      "name": "optimizely-controllers",
      "file": "optimizely-controllers/SKILL.md",
      "patternsFound": {ControllerPatternCount}
    },
    {
      "name": "testing-patterns",
      "file": "testing-patterns/SKILL.md",
      "patternsFound": {TestPatternCount}
    },
    {
      "name": "error-handling",
      "file": "error-handling/SKILL.md",
      "patternsFound": {ErrorPatternCount}
    },
    {
      "name": "project-conventions",
      "file": "project-conventions/SKILL.md",
      "patternsFound": {ConventionCount}
    }
  ],
  "statistics": {
    "filesAnalyzed": {FilesAnalyzed},
    "patternsExtracted": {TotalPatterns},
    "codeExamples": {ExampleCount}
  }
}
```

## Output

After generating skills, provide summary:

```yaml
skillsGenerated:
  - path: ".claude/skills/optimizely-content-types/SKILL.md"
    patterns: 5
    examples: 8
  - path: ".claude/skills/optimizely-services/SKILL.md"
    patterns: 3
    examples: 4
  - path: ".claude/skills/optimizely-controllers/SKILL.md"
    patterns: 2
    examples: 3
  - path: ".claude/skills/project-conventions/SKILL.md"
    patterns: 10
    examples: 15
totalPatterns: 20
codeExamples: 30
```

## Usage Note

Generated skills are used by Claude to:
1. Write code matching project conventions
2. Suggest improvements aligned with patterns
3. Avoid anti-patterns specific to this codebase
4. Maintain consistency with existing code
