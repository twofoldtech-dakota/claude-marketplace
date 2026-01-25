---
name: optimizely-conventions
description: Analyze Optimizely CMS naming conventions, project structure, and coding standards
tools: [Read, Glob, Grep]
---

# Optimizely Conventions Agent

Analyze naming conventions, project organization, and coding standards.

## Analysis Areas

### 1. Content Type Naming

**CONV-001: Content Type Naming (Warning)**

Content types should follow conventions:

```
Glob: **/Models/Pages/**/*.cs
Glob: **/Models/Blocks/**/*.cs
```

**Conventions**:
- Page types: `{Name}Page` (e.g., `ArticlePage`, `ProductPage`)
- Block types: `{Name}Block` (e.g., `HeroBlock`, `TeaserBlock`)
- Media types: `{Name}File` or `{Name}Media` (e.g., `ImageFile`, `VideoFile`)

**Bad Naming**:
```csharp
public class Article : PageData { }        // Missing "Page" suffix
public class HeroComponent : BlockData { } // Should be "Block"
public class Image : MediaData { }         // Too generic
```

**Good Naming**:
```csharp
public class ArticlePage : PageData { }
public class HeroBlock : BlockData { }
public class ImageFile : ImageData { }
```

### 2. Property Alias Convention

**CONV-002: Property Alias Convention (Warning)**

Property names should be PascalCase and descriptive:

```
Grep: public virtual.*\s+[a-z]\w*\s*\{
```

**Bad Naming**:
```csharp
public virtual string txt { get; set; }
public virtual string mainTxt { get; set; }
public virtual ContentReference img { get; set; }
```

**Good Naming**:
```csharp
public virtual string Heading { get; set; }
public virtual string MainContent { get; set; }
public virtual ContentReference HeroImage { get; set; }
```

### 3. View/Template Matching

**CONV-003: View/Template Mismatch (Warning)**

Views should match content type names:

```
Glob: **/Views/**/*.cshtml
Glob: **/Models/Pages/**/*.cs
```

**Expected Pattern**:
- `ArticlePage.cs` → `Views/ArticlePage/Index.cshtml`
- `HeroBlock.cs` → `Views/Shared/Blocks/HeroBlock.cshtml`

### 4. Initialization Module Naming

**CONV-004: Non-Specific Initialization Module Name (Warning)**

Initialization modules should have specific names:

```
Grep: class\s+\w*Initialization\s*:
```

**Bad Naming**:
```csharp
public class Initialization : IInitializableModule { }
public class MyInit : IConfigurableModule { }
```

**Good Naming**:
```csharp
public class DependencyResolverInitialization : IConfigurableModule { }
public class ContentEventsInitialization : IInitializableModule { }
public class SearchIndexInitialization : IInitializableModule { }
```

### 5. Partial View Naming

**CONV-005: Partial View Prefix (Info)**

Partial views should start with underscore:

```
Glob: **/Views/Shared/**/*.cshtml
```

**Convention**:
- Partial views: `_Header.cshtml`, `_Footer.cshtml`
- Full views: `Index.cshtml`, `Details.cshtml`

### 6. Configuration Structure

**CONV-006: Flat Configuration Structure (Info)**

Configuration should be organized hierarchically:

```
Glob: **/appsettings*.json
```

**Bad Structure**:
```json
{
  "SiteName": "My Site",
  "SiteUrl": "https://example.com",
  "SmtpHost": "mail.example.com"
}
```

**Good Structure**:
```json
{
  "Site": {
    "Name": "My Site",
    "Url": "https://example.com"
  },
  "Email": {
    "SmtpHost": "mail.example.com"
  }
}
```

### 7. Model Naming Ambiguity

**CONV-007: Ambiguous Model Name (Info)**

Avoid generic or ambiguous names:

```
Glob: **/Models/**/*.cs
```

**Bad Names**:
```csharp
public class Data { }
public class Model { }
public class Item { }
public class Content { }
```

**Good Names**:
```csharp
public class ArticleData { }
public class SearchResultModel { }
public class ProductListItem { }
public class ContentSummary { }
```

### 8. Folder Structure Conventions

**Recommended Project Structure**:

```
src/
├── MyProject.Web/
│   ├── Controllers/
│   │   └── ArticlePageController.cs
│   ├── Views/
│   │   ├── ArticlePage/
│   │   │   └── Index.cshtml
│   │   └── Shared/
│   │       ├── Blocks/
│   │       ├── _Layout.cshtml
│   │       └── _ViewImports.cshtml
│   ├── wwwroot/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── Features/
│       └── Search/
│           ├── SearchController.cs
│           └── SearchService.cs
├── MyProject.Core/
│   ├── Models/
│   │   ├── Pages/
│   │   ├── Blocks/
│   │   └── Media/
│   ├── Services/
│   └── Extensions/
└── MyProject.Infrastructure/
    ├── Data/
    └── External/
```

### 9. Service Naming Conventions

Services should follow interface/implementation pattern:

**Convention**:
- Interface: `I{Name}Service`
- Implementation: `{Name}Service`

**Bad**:
```csharp
public class ArticleHelper { }
public class ContentUtils { }
public interface IDoStuff { }
```

**Good**:
```csharp
public interface IArticleService { }
public class ArticleService : IArticleService { }
public interface IContentResolver { }
public class ContentResolver : IContentResolver { }
```

### 10. Controller Naming

Controllers should match their content types:

**Convention**: `{ContentTypeName}Controller`

**Bad**:
```csharp
public class ArticleCtrl : PageController<ArticlePage> { }
public class Articles : PageController<ArticlePage> { }
```

**Good**:
```csharp
public class ArticlePageController : PageController<ArticlePage> { }
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| CONV-001 | Warning | Missing Page/Block suffix | Add type suffix |
| CONV-002 | Warning | Non-PascalCase property | Rename property |
| CONV-003 | Warning | View doesn't match model | Rename or create view |
| CONV-004 | Warning | Generic init module name | Use specific name |
| CONV-005 | Info | Partial without underscore | Add underscore prefix |
| CONV-006 | Info | Flat config | Organize hierarchically |
| CONV-007 | Info | Ambiguous model name | Use specific name |

## Scoring

```
A: All conventions followed
B: Minor naming issues
C: Multiple convention violations
D: Widespread naming problems
F: No consistent conventions
```

## Output Format

```yaml
conventions:
  score: "B"
  issues:
    - code: "CONV-001"
      severity: "Warning"
      location: "src/Core/Models/Pages/Article.cs"
      description: "Content type missing 'Page' suffix"
      recommendation: "Rename to 'ArticlePage'"
    - code: "CONV-002"
      severity: "Warning"
      location: "src/Core/Models/Pages/HomePage.cs:15"
      description: "Property 'mainContent' is not PascalCase"
      recommendation: "Rename to 'MainContent'"
  metrics:
    contentTypesChecked: 20
    namingIssues: 5
    viewMismatches: 2
    flatConfigurations: 1
```

## Optimizely Naming Best Practices

1. **Content Types**: Always suffix with type (Page, Block, Media)
2. **Properties**: PascalCase, descriptive names
3. **Views**: Match content type structure
4. **Services**: Interface + Implementation pattern
5. **Controllers**: Match content type name
6. **Initialization**: Specific, descriptive names
7. **Configuration**: Hierarchical JSON structure
