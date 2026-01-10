---
name: sitecore-classic-serialization
description: Analyze serialization configuration in Sitecore 10.x projects
tools: [Read, Glob, Grep]
---

# Sitecore Classic Serialization Agent

Analyze SCS, Unicorn, and TDS serialization configurations for conflicts and issues.

## Analysis Areas

### 1. Detect Serialization Format

**Sitecore Content Serialization (SCS)**:
```
Glob: **/sitecore.json
Glob: **/*.module.json
```

**Unicorn**:
```
Glob: **/App_Config/**/Unicorn*.config
Grep: <configuration.*Unicorn
```

**TDS**:
```
Glob: **/*.scproj
```

### 2. Mixed Serialization Formats (Critical)

If multiple formats are actively configured, flag as critical issue:

```
SCS modules/*.module.json + Unicorn.config active = SER-001
```

### 3. Module.json Include Analysis (SCS)

Parse `*.module.json` files for include patterns:

```json
{
  "namespace": "Feature.Navigation",
  "items": {
    "includes": [
      {
        "name": "templates",
        "path": "/sitecore/templates/Feature/Navigation"
      },
      {
        "name": "renderings",
        "path": "/sitecore/layout/Renderings/Feature/Navigation"
      }
    ]
  }
}
```

### 4. Overlapping Includes

Check for multiple modules including the same paths:

```
Feature.Navigation: /sitecore/templates/Feature/Navigation
Feature.Header: /sitecore/templates/Feature/Navigation  <-- Overlap!
```

### 5. Helix Layer Alignment

Verify serialized items are in correct layers:

```
Foundation modules should serialize:
  /sitecore/templates/Foundation/*
  /sitecore/system/Settings/Foundation/*

Feature modules should serialize:
  /sitecore/templates/Feature/*
  /sitecore/layout/Renderings/Feature/*

Project modules should serialize:
  /sitecore/templates/Project/*
  /sitecore/content/[Site]/*
```

### 6. Sensitive Data in Serialization

Scan serialized YAML/JSON for sensitive data:

```yaml
# Dangerous - API keys in items
SharedFields:
- ID: "api-key-field-id"
  Value: "sk-1234567890abcdef"  # SEC issue!
```

### 7. User/Role Serialization

Check for user or role items with credentials:

```
Path patterns to flag:
/sitecore/security/Users/*
/sitecore/security/Roles/*
```

### 8. Language Versions

Check for missing language versions in content items:

```yaml
Languages:
- Language: en
  # Missing other configured languages
```

### 9. Slow Query Detection in Field Values

Scan serialized items for performance-problematic Sitecore queries in field values:

**Target Field Types**:
- Datasource fields
- Multilist/Treelist source fields
- Rendering parameters with datasource
- Template standard values

**Dangerous Patterns**:

| Pattern | Risk | Example |
|---------|------|---------|
| `query:` prefix | High | `query:/sitecore/content//*[@@templateid='{...}']` |
| `fast:` prefix | Medium | `fast:/sitecore/content/Home//*` |
| Unbounded `//*` | High | `/sitecore/content//*` (no scope limit) |
| Axis selectors | High | `.//*`, `ancestor::*`, `descendant::*` |
| Deep path traversal | Medium | `../../../../` in queries |
| Complex predicates | Medium | Multiple `and`/`or` conditions |

**Detection Logic**:

```
Glob: **/*.yml (in serialization folders)
Grep: (query:|fast:|/\*\[@@|ancestor::|descendant::|\.\./\.\.)

For each match:
  Check field hint (Datasource, Source, etc.)
  Analyze query scope
  Flag unbounded or expensive patterns
```

**Example Problematic YAML**:

```yaml
# SER-009: Unbounded query in datasource
SharedFields:
- ID: "datasource-field-id"
  Hint: Datasource
  Value: "query:/sitecore/content//*[@@templatename='Article']"

# SER-011: Deep axis traversal
- ID: "navigation-source"
  Hint: Source
  Value: "query:./ancestor::*[@@templatename='Site Root']/Navigation//*"
```

**Performance Impact**:
- Queries execute on every page render
- Unbounded queries traverse entire content tree
- Axis selectors can cause N+1 database hits
- Standard values with queries affect all items using template

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| SER-001 | Critical | Mixed serialization formats active | Both SCS modules and Unicorn config exist |
| SER-002 | Critical | Sensitive data in serialized items | API keys, passwords in YAML values |
| SER-003 | Critical | User/role credentials serialized | User items with passwords |
| SER-004 | Warning | Overlapping include paths | Same path in multiple modules |
| SER-005 | Warning | Items in wrong Helix layer | Feature templates in Foundation module |
| SER-006 | Warning | Missing predicate for templates | Templates exist but not serialized |
| SER-007 | Info | Missing language versions | Content items missing configured languages |
| SER-008 | Info | Orphaned serialization files | YAML files with no corresponding item path |
| SER-009 | Critical | Unbounded Sitecore query in field value | `query://*` without scope limits |
| SER-010 | Warning | Fast query without index hint | `fast:` query that could use index |
| SER-011 | Warning | Deep axis traversal in query | `ancestor::`, `descendant::`, `../..` patterns |
| SER-012 | Info | Query-based datasource in standard values | Template __Standard Values with query datasource |

## Analysis Steps

### Step 1: Detect Formats

```
Count:
- *.module.json files
- Unicorn*.config files
- *.scproj files
```

### Step 2: Parse Module Includes

```
For each *.module.json:
  Extract namespace
  Extract all include paths
  Build path -> module map
```

### Step 3: Find Overlaps

```
For each path in map:
  If path has multiple modules -> SER-004
```

### Step 4: Validate Layer Alignment

```
For each module:
  Extract layer from namespace (Foundation/Feature/Project)
  For each include path:
    Verify path starts with /sitecore/*/[Layer]/
```

### Step 5: Scan for Sensitive Data

```
Glob: **/*.yml (in serialization folders)
Grep: (password|apikey|secret|token|connectionstring)
```

### Step 6: Check Language Coverage

```
For content items (under /sitecore/content/):
  Check Languages array
  Compare against configured site languages
```

### Step 7: Detect Slow Queries in Field Values

```
Glob: **/serialization/**/*.yml

For each file:
  Parse YAML structure
  For each field in SharedFields/Languages/Versions:
    If field Hint matches (Datasource|Source|Data Source):
      Check Value for query patterns
      If contains "query:" or "fast:":
        Analyze query scope
        Check for unbounded patterns (//* without scope)
        Check for axis selectors
        Flag appropriate issue (SER-009, SER-010, SER-011)

    If file path contains "__Standard Values":
      If field has query datasource:
        Flag SER-012 (affects all items using template)
```

**Query Scope Analysis**:
```
Good: query:/sitecore/content/Home/Articles/*[@@templatename='Article']
  - Scoped to specific path
  - Single level wildcard

Bad: query:/sitecore/content//*[@@templatename='Article']
  - Double wildcard (//*) traverses entire tree
  - No path scope

Bad: query:./ancestor::*[@@templatename='Site']/Settings
  - Axis selector traverses upward
  - Expensive for deep content
```

## Output Format

```markdown
## Serialization Analysis

### Configuration
- **Primary Format**: Sitecore Content Serialization (SCS)
- **Modules Found**: 12
- **Total Items Serialized**: ~2,400

### Critical Issues

#### [SER-001] Mixed Serialization Formats
**Issue**: Both SCS and Unicorn are configured
**Locations**:
- `sitecore.json` (SCS)
- `App_Config/Include/Unicorn/Unicorn.config` (Unicorn)
**Impact**: Deployment conflicts, item overwrites
**Fix**: Migrate fully to SCS or remove Unicorn configuration

#### [SER-002] Sensitive Data in Serialized Items
**Location**: `src/Feature/Integration/serialization/Content/Settings/API Configuration.yml`
**Field**: `API Key`
**Value**: `sk-12345...` (truncated)
**Fix**: Remove from serialization, use environment variables

### Warnings

#### [SER-004] Overlapping Include Paths
**Path**: `/sitecore/templates/Feature/Navigation`
**Modules**:
- Feature.Navigation
- Feature.Header
**Fix**: Remove duplicate include from Feature.Header

#### [SER-011] Deep Axis Traversal in Query
**Location**: `src/Feature/Navigation/serialization/Renderings/Header.yml:34`
**Item**: `/sitecore/layout/Renderings/Feature/Navigation/Header`
**Field**: `Datasource Location`
**Query**: `query:./ancestor::*[@@templatename='Site Root']/Settings/Navigation`
**Impact**: Traverses up entire content tree on each render
**Fix Options**:
1. Use absolute path: `query:/sitecore/content/[Site]/Settings/Navigation`
2. Use Content Search instead
3. Cache navigation data in custom cache

### Slow Queries Detected

| File | Field | Query Type | Impact |
|------|-------|------------|--------|
| Header.yml | Datasource | ancestor:: | High |
| ArticleList.yml | Source | //* unbounded | Critical |
| Footer.yml | Navigation Items | query: | Medium |

### Module Summary
| Module | Items | Templates | Renderings | Content |
|--------|-------|-----------|------------|---------|
| Foundation.DI | 5 | 0 | 0 | 5 |
| Feature.Navigation | 45 | 8 | 5 | 32 |
| Feature.Search | 38 | 6 | 4 | 28 |
| Project.Website | 120 | 12 | 0 | 108 |

### Recommendations
1. Remove Unicorn configuration to resolve format conflict
2. Move API key to environment variable
3. Consolidate Navigation templates to single module
```
