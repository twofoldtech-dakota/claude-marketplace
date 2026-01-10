---
name: umbraco-conventions
description: Analyze naming conventions and structural patterns in Umbraco projects
tools: [Read, Glob, Grep]
---

# Umbraco Conventions Agent

Analyze document type naming, alias conventions, and code organization patterns.

## Analysis Areas

### 1. Document Type Naming

Check document type names:

```
Good (PascalCase):
- BlogPost
- ProductPage
- HomePage

Bad:
- blog_post (snake_case)
- blogpost (no separation)
- Blog Post (spaces in alias)
```

### 2. Property Alias Conventions

Check property aliases:

```
Good (camelCase):
- pageTitle
- heroImage
- metaDescription

Bad:
- PageTitle (PascalCase)
- page_title (snake_case)
- page-title (kebab-case)
```

### 3. Template Naming

Check template organization:

```
Views/
├── HomePage.cshtml           # Matches document type
├── BlogPost.cshtml
├── Partials/
│   ├── _Header.cshtml        # Underscore prefix
│   └── _Footer.cshtml
└── MacroPartials/
    └── RenderNavigation.cshtml
```

### 4. Composer Naming

Check Composer class names:

```csharp
// Good: Descriptive with Composer suffix
public class ServicesComposer : IComposer { }
public class NotificationHandlersComposer : IComposer { }

// Bad: Generic names
public class MyComposer : IComposer { }
public class Setup : IComposer { }
```

### 5. Controller Naming

Check controller names:

```csharp
// Good: Purpose-driven names
public class ContactFormController : SurfaceController { }
public class SearchApiController : UmbracoApiController { }

// Bad: Generic names
public class MyController : SurfaceController { }
```

### 6. App_Plugins Structure

Check plugin organization:

```
App_Plugins/
├── MyPackage/
│   ├── umbraco-package.json     # Required manifest
│   ├── dist/
│   │   ├── my-editor.js
│   │   └── my-editor.css
│   └── lang/
│       ├── en.js
│       └── da.js
```

### 7. Service/Repository Naming

Check service layer naming:

```csharp
// Good: Interface + Implementation pattern
public interface IProductService { }
public class ProductService : IProductService { }

public interface IProductRepository { }
public class ProductRepository : IProductRepository { }

// Bad: No interface or inconsistent naming
public class ProductHelper { }  // Helper is vague
public class Products { }       // Not descriptive
```

### 8. Model Naming

Check model classes:

```csharp
// Good: Clear purpose
public class ContactFormModel { }     // Form model
public class ProductViewModel { }     // View model
public class ProductDto { }           // Data transfer object

// Bad: Ambiguous
public class Product { }              // Is it entity? DTO? ViewModel?
```

### 9. Configuration Keys

Check appsettings structure:

```json
// Good: Organized by feature
{
  "MyApp": {
    "Email": {
      "SmtpHost": "...",
      "FromAddress": "..."
    },
    "Cache": {
      "Duration": "00:05:00"
    }
  }
}

// Bad: Flat structure
{
  "SmtpHost": "...",
  "CacheDuration": "..."
}
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| CONV-001 | Warning | Document type not PascalCase | snake_case or spaces in alias |
| CONV-002 | Warning | Property alias not camelCase | PascalCase or snake_case |
| CONV-003 | Warning | Template name mismatch | Template doesn't match doc type |
| CONV-004 | Warning | Generic Composer name | Composer without descriptive name |
| CONV-005 | Info | Missing partial underscore | Partial view without _ prefix |
| CONV-006 | Info | Flat configuration | Settings not grouped |
| CONV-007 | Info | Ambiguous model name | Model without suffix |

## Analysis Steps

### Step 1: Analyze Document Types

If ModelsBuilder output exists:

```
Glob: **/Models/Generated/*.cs
Extract class names
Check PascalCase pattern
```

Or check content in database/API.

### Step 2: Check Templates

```
Glob: **/Views/**/*.cshtml
Verify naming matches document types
Check partial views have _ prefix
```

### Step 3: Analyze Composers

```
Glob: **/*Composer*.cs
Grep: : IComposer
Check class names are descriptive
```

### Step 4: Check Services

```
Glob: **/Services/**/*.cs
Glob: **/Repositories/**/*.cs
Verify Interface + Implementation pattern
```

### Step 5: Analyze App_Plugins

```
Glob: **/App_Plugins/*/
Check for umbraco-package.json
Verify folder structure
```

### Step 6: Check Configuration

```
Read: appsettings.json
Analyze key structure
Check for nesting
```

## Output Format

```markdown
## Conventions Analysis

### Summary
- **Document Types**: 15
- **Templates**: 18
- **Composers**: 5
- **Naming Score**: 82%

### Warnings

#### [CONV-001] Document Type Not PascalCase
**Document Types**:
- `blog_post` → should be `BlogPost`
- `product page` → should be `ProductPage`
**Impact**: Inconsistent API responses, confusing code
**Fix**: Update document type aliases in backoffice

#### [CONV-002] Property Alias Not camelCase
**Properties**:
- `PageTitle` → should be `pageTitle`
- `hero_image` → should be `heroImage`
**Locations**: HomePage, BlogPost document types
**Fix**: Update property aliases in backoffice

#### [CONV-004] Generic Composer Name
**File**: `src/Web/Composers/MyComposer.cs`
**Issue**: Name doesn't describe purpose
**Fix**: Rename to describe responsibility:
```csharp
public class EmailServicesComposer : IComposer { }
```

### Info

#### [CONV-005] Missing Partial Underscore
**Files**:
- `Views/Partials/Header.cshtml` → `_Header.cshtml`
- `Views/Partials/Footer.cshtml` → `_Footer.cshtml`
**Fix**: Add underscore prefix to partial views

### Convention Summary
| Category | Compliant | Non-Compliant | % |
|----------|-----------|---------------|---|
| Document Types | 13 | 2 | 87% |
| Property Aliases | 45 | 8 | 85% |
| Templates | 16 | 2 | 89% |
| Composers | 4 | 1 | 80% |
| Services | 8 | 2 | 80% |

### Recommendations
1. Update 2 document type aliases to PascalCase
2. Update 8 property aliases to camelCase
3. Rename MyComposer to describe its purpose
4. Add underscore prefix to 2 partial views
5. Group flat configuration keys
```
