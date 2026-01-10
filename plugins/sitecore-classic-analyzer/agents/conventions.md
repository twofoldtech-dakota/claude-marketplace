---
name: sitecore-classic-conventions
description: Analyze naming conventions and structural patterns in Sitecore 10.x projects
tools: [Read, Glob, Grep]
---

# Sitecore Classic Conventions Agent

Analyze naming conventions, folder structure, and Sitecore-specific patterns.

## Analysis Areas

### 1. Template Naming

Check template names follow conventions:

```
Good:
- "Navigation Item" (Title Case with spaces)
- "Hero Banner"
- "Article Page"

Bad:
- "navigation_item" (snake_case)
- "heroBanner" (camelCase)
- "ARTICLE PAGE" (ALL CAPS)
```

### 2. Field Naming

Check field names follow conventions:

```
Good (Title Case):
- "Page Title"
- "Navigation Title"
- "Hero Image"

Bad:
- "pageTitle" (camelCase in display name)
- "hero_image" (snake_case)
```

### 3. Template Field Names (Technical)

Check field names (technical name) follow conventions:

```
Good (PascalCase or Title):
- PageTitle
- NavigationTitle
- HeroImage

Bad:
- page_title
- hero-image
```

### 4. Rendering Naming

Check rendering names:

```
Good:
- "Main Navigation"
- "Hero Banner"
- "Article List"

Pattern: [Feature] [Type/Purpose]
```

### 5. Config Patch Naming

Check config patch file naming:

```
Good:
- Feature.Navigation.config
- Foundation.DI.Serialization.config
- Project.Website.Sites.config

Pattern: [Layer].[Module].[Purpose].config

Bad:
- nav-config.config
- mySettings.config
```

### 6. Config Patch Prefix

Check config patches have layer prefix for load order:

```
Good:
- z.Feature.Navigation.config (loads after Foundation)
- zz.Project.Website.config (loads last)

Or numbered:
- 01.Foundation.DI.config
- 02.Feature.Navigation.config
- 03.Project.Website.config
```

### 7. Folder Structure Conventions

Check for consistent folder organization:

```
src/Feature/Navigation/
├── code/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   └── Feature.Navigation.csproj
└── serialization/
    ├── Templates/
    ├── Renderings/
    └── Content/
```

### 8. Template Icons

Check templates have icons assigned:

```yaml
# In serialization
SharedFields:
- ID: "__Icon"
  Value: "Office/32x32/navigate_right.png"
```

### 9. Standard Values

Check templates have standard values configured:

```
/sitecore/templates/Feature/Navigation/Navigation Item/__Standard Values
```

### 10. Branch Templates

Check for proper use of branch templates for complex content structures.

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| CONV-001 | Warning | Inconsistent template naming | Mixed naming conventions |
| CONV-002 | Warning | Field naming violation | camelCase or snake_case in fields |
| CONV-003 | Warning | Config patch missing layer prefix | Config file without layer in name |
| CONV-004 | Warning | Inconsistent folder structure | Non-standard code organization |
| CONV-005 | Info | Missing template icon | Template without __Icon value |
| CONV-006 | Info | Missing standard values | Template without __Standard Values |
| CONV-007 | Info | Rendering naming inconsistent | Mixed rendering name patterns |

## Analysis Steps

### Step 1: Analyze Template Names

```
Glob: **/serialization/**/Templates/**/*.yml
Extract template names
Check for naming pattern consistency
```

### Step 2: Analyze Field Names

```
From template YAML:
Extract all field definitions
Check SharedFields and Versions for naming
```

### Step 3: Check Config Files

```
Glob: **/App_Config/Include/**/*.config
Check file names against pattern
Verify layer prefix exists
```

### Step 4: Analyze Folder Structure

```
For each module:
  Check for standard folders (Controllers, Services, Models)
  Flag non-standard organization
```

### Step 5: Check Template Metadata

```
For each template YAML:
  Check for __Icon field
  Check for __Standard Values item
```

## Output Format

```markdown
## Conventions Analysis

### Summary
- **Templates Analyzed**: 45
- **Renderings Analyzed**: 23
- **Config Files Analyzed**: 18
- **Naming Score**: 78%

### Warnings

#### [CONV-001] Inconsistent Template Naming
**Issue**: Mixed naming conventions in templates
**Examples**:
```
Good: "Navigation Item", "Hero Banner"
Bad:  "articlePage", "footer_links"
```
**Affected Templates**:
- articlePage → "Article Page"
- footer_links → "Footer Links"
**Fix**: Rename to Title Case with spaces

#### [CONV-003] Config Patch Missing Layer Prefix
**Files**:
- `App_Config/Include/Navigation.config`
- `App_Config/Include/SearchSettings.config`
**Fix**: Rename to:
- `Feature.Navigation.config`
- `Feature.Search.Settings.config`

### Info

#### [CONV-005] Missing Template Icons
**Templates without icons**: 12
- Feature/Navigation/Navigation Item
- Feature/Search/Search Results Page
- ...

### Naming Convention Summary

| Category | Compliant | Non-Compliant | % |
|----------|-----------|---------------|---|
| Templates | 38 | 7 | 84% |
| Fields | 156 | 23 | 87% |
| Renderings | 20 | 3 | 87% |
| Config Files | 12 | 6 | 67% |

### Recommendations
1. Standardize on Title Case for all template and field display names
2. Add layer prefix to all config patch files
3. Add icons to frequently used templates for better content editor UX
```
