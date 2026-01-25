---
name: optimizely-content-modeling
description: Analyze Optimizely content types, blocks, pages, and property definitions
tools: [Read, Glob, Grep]
---

# Optimizely Content Modeling Agent

Analyze content type definitions, inheritance patterns, and property configurations.

## Analysis Areas

### 1. Content Type GUID Requirements

**CM-001: Content Type Without GUID (Critical)**

All content types MUST have a GUID for serialization and synchronization:

```
Glob: **/Models/Pages/**/*.cs
Glob: **/Models/Blocks/**/*.cs
Glob: **/Models/Media/**/*.cs
Grep: \[ContentType\(
```

**Bad Pattern** (Missing GUID):
```csharp
[ContentType(DisplayName = "Article Page")]
public class ArticlePage : PageData { }
```

**Good Pattern** (With GUID):
```csharp
[ContentType(
    GUID = "f8d47a38-5b23-4c8e-9f12-3a7e8b9c2d1f",
    DisplayName = "Article Page",
    Description = "Standard article content",
    GroupName = "Content")]
public class ArticlePage : PageData { }
```

### 2. Block Inheritance Patterns

**CM-002: Block Without Interface Inheritance (Warning)**

Blocks should implement interfaces for flexibility:

```csharp
// Bad: No interface
public class HeroBlock : BlockData
{
    public virtual string Heading { get; set; }
}

// Good: With interface
public interface IHeroBlock
{
    string Heading { get; }
    ContentReference Image { get; }
}

[ContentType(GUID = "...")]
public class HeroBlock : BlockData, IHeroBlock
{
    public virtual string Heading { get; set; }
    public virtual ContentReference Image { get; set; }
}
```

### 3. Content Area Configuration

**CM-003: Unbounded Content Area (Warning)**

Content areas should have restrictions to guide editors:

```csharp
// Bad: Unrestricted
[Display(Name = "Main content")]
public virtual ContentArea MainContent { get; set; }

// Good: With restrictions
[Display(Name = "Main content")]
[AllowedTypes(typeof(TextBlock), typeof(ImageBlock), typeof(VideoBlock))]
public virtual ContentArea MainContent { get; set; }

// Good: With item count limits
[Display(Name = "Featured items")]
[AllowedTypes(typeof(ProductBlock))]
[MaxItems(6)]
public virtual ContentArea FeaturedItems { get; set; }
```

### 4. Validation Attributes

**CM-004: Missing Validation Attributes (Warning)**

Content properties should have appropriate validation:

```csharp
// Bad: No validation
public virtual string Email { get; set; }
public virtual string Phone { get; set; }
public virtual Url ExternalLink { get; set; }

// Good: With validation
[Required]
[RegularExpression(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")]
public virtual string Email { get; set; }

[StringLength(20)]
public virtual string Phone { get; set; }

[Required]
public virtual Url ExternalLink { get; set; }
```

### 5. Property Naming Conventions

**CM-005: Property Naming Convention (Info)**

Properties should follow C# and Optimizely conventions:

```csharp
// Bad: Poor naming
public virtual string txt { get; set; }
public virtual ContentReference img { get; set; }
public virtual bool flag1 { get; set; }

// Good: Clear naming
public virtual string Heading { get; set; }
public virtual ContentReference HeroImage { get; set; }
public virtual bool ShowSidebar { get; set; }
```

### 6. Display Attributes

**CM-006: Missing Display Attribute (Info)**

Properties should have Display attributes for editor usability:

```csharp
// Bad: No display info
public virtual string MetaDescription { get; set; }

// Good: With display info
[Display(
    Name = "Meta Description",
    Description = "SEO description for search results",
    GroupName = SystemTabNames.PageHeader,
    Order = 100)]
[StringLength(160)]
public virtual string MetaDescription { get; set; }
```

### 7. Content Type Organization

Check for proper content type grouping:

```csharp
[ContentType(
    GUID = "...",
    DisplayName = "Article Page",
    GroupName = "Content")]  // GroupName for organization
public class ArticlePage : SitePageData { }
```

### 8. Base Class Usage

Verify proper base class hierarchy:

```csharp
// Good: Common base class for shared properties
public abstract class SitePageData : PageData
{
    [Display(GroupName = SystemTabNames.PageHeader)]
    public virtual string MetaTitle { get; set; }

    [Display(GroupName = SystemTabNames.PageHeader)]
    public virtual string MetaDescription { get; set; }
}

[ContentType(GUID = "...")]
public class ArticlePage : SitePageData
{
    // Article-specific properties
}
```

### 9. Selection Factory Patterns

Check for proper selection factory usage:

```csharp
// Good: Typed selection factory
[SelectOne(SelectionFactoryType = typeof(CategorySelectionFactory))]
public virtual string Category { get; set; }

// Good: Enum-based selection
public virtual MyEnum Status { get; set; }
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| CM-001 | Critical | No GUID in ContentType | Add GUID for serialization |
| CM-002 | Warning | Block without interface | Add interface for flexibility |
| CM-003 | Warning | ContentArea without AllowedTypes | Add type restrictions |
| CM-004 | Warning | Missing validation | Add Required, StringLength, etc. |
| CM-005 | Info | Poor property naming | Use descriptive names |
| CM-006 | Info | Missing Display attribute | Add for editor experience |

## Search Patterns

```bash
# Find content types
Glob: **/Models/**/*.cs
Grep: : PageData|: BlockData|: MediaData|: ImageData

# Find missing GUIDs
Grep: \[ContentType\((?!.*GUID)

# Find content areas
Grep: ContentArea\s+\w+\s*\{

# Find AllowedTypes
Grep: \[AllowedTypes\(
```

## Scoring

```
A: All types have GUIDs, proper inheritance, good validation
B: Minor issues (missing Display attributes)
C: 1 Critical (missing GUID) or 4+ Warnings
D: 2+ Critical
F: Widespread missing GUIDs, no validation
```

## Output Format

```yaml
contentModeling:
  score: "B"
  issues:
    - code: "CM-001"
      severity: "Critical"
      location: "src/Core/Models/Pages/ArticlePage.cs:8"
      description: "Content type missing GUID attribute"
      recommendation: "Add GUID = \"<generate-guid>\" to ContentType attribute"
    - code: "CM-003"
      severity: "Warning"
      location: "src/Core/Models/Pages/HomePage.cs:25"
      description: "ContentArea 'MainContent' has no type restrictions"
      recommendation: "Add [AllowedTypes(typeof(...))] attribute"
  metrics:
    pageTypes: 12
    blockTypes: 8
    mediaTypes: 3
    missingGuids: 1
    unboundedContentAreas: 3
```

## Content Type Checklist

For each content type, verify:

- [ ] GUID attribute present
- [ ] DisplayName set
- [ ] GroupName for organization
- [ ] Base class appropriate
- [ ] Properties have Display attributes
- [ ] Validation where needed
- [ ] ContentAreas have restrictions
- [ ] Interface defined (for blocks)
