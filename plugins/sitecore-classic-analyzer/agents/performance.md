---
name: sitecore-classic-performance
description: Analyze performance patterns and caching in Sitecore 10.x projects
tools: [Read, Glob, Grep]
---

# Sitecore Classic Performance Agent

Identify performance anti-patterns, caching issues, and optimization opportunities.

## Analysis Areas

### 1. Sitecore.Query Usage (Critical)

Detect slow Sitecore.Query usage that should be Content Search:

```csharp
// Anti-pattern (slow tree traversal)
item.Axes.SelectItems(".//*[@@templateid='{...}']")
item.Axes.SelectSingleItem("ancestor::*[@@templatename='Home']")
Database.SelectItems("fast:/sitecore/content//*")

// Better (Content Search)
using (var context = index.CreateSearchContext())
{
    var results = context.GetQueryable<SearchResultItem>()
        .Where(x => x.TemplateId == templateId)
        .ToList();
}
```

### 2. GetDescendants/GetChildren Without Limits

Detect unbounded tree traversal:

```csharp
// Anti-pattern (loads entire subtree into memory)
var allItems = rootItem.GetDescendants();
var children = parentItem.GetChildren();

// Better (use Content Search with pagination)
context.GetQueryable<SearchResultItem>()
    .Where(x => x.Paths.Contains(rootId))
    .Take(100)
    .ToList();
```

### 3. HTML Cache Configuration

Check rendering cache settings in items and configs:

```xml
<!-- Rendering item fields to verify -->
<Caching>
  <Cacheable>true</Cacheable>
  <VaryByData>true</VaryByData>
  <VaryByDevice>false</VaryByDevice>
  <VaryByLogin>false</VaryByLogin>
  <VaryByParm>false</VaryByParm>
  <VaryByQueryString>false</VaryByQueryString>
  <VaryByUser>false</VaryByUser>
</Caching>
```

### 4. Content Search Pagination

Verify Content Search queries use pagination:

```csharp
// Anti-pattern (loads all results)
var results = context.GetQueryable<SearchResultItem>()
    .Where(x => x.TemplateId == templateId)
    .ToList();

// Better (paginated)
var results = context.GetQueryable<SearchResultItem>()
    .Where(x => x.TemplateId == templateId)
    .Skip(pageIndex * pageSize)
    .Take(pageSize)
    .ToList();
```

### 5. Solr Index Configuration

Check for optimization opportunities:

```xml
<index id="sitecore_web_index">
  <configuration>
    <documentOptions>
      <!-- Check for computed fields -->
      <fields hint="raw:AddComputedIndexField">
        <field fieldName="navigation_title">...</field>
      </fields>

      <!-- Check for excluded fields to reduce index size -->
      <exclude hint="list:AddExcludedField">
        <field>__Revision</field>
      </exclude>
    </documentOptions>
  </configuration>
</index>
```

### 6. Custom Cache Implementation

Check for proper custom cache usage:

```csharp
// Good pattern
public class NavigationCache : CustomCache
{
    public NavigationCache(string name, long maxSize)
        : base(name, maxSize) { }
}
```

### 7. Media Library Access

Check for optimized media handling:

```csharp
// Check for CDN usage
Sitecore.Resources.Media.MediaManager.GetMediaUrl(item)

// Check for responsive images
<img src="@MediaManager.GetMediaUrl(item, new MediaUrlOptions { Width = 800 })" />
```

### 8. Pipeline Processor Efficiency

Analyze custom pipeline processors:

```csharp
public class MyProcessor : HttpRequestProcessor
{
    public override void Process(HttpRequestArgs args)
    {
        // Check for early exit conditions
        if (Context.Item == null) return;
        if (Context.PageMode.IsExperienceEditor) return;

        // Processor logic
    }
}
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| PERF-001 | Critical | Sitecore.Query in loop | `Axes.SelectItems` or `Axes.SelectSingleItem` inside foreach/for |
| PERF-002 | Critical | Unbounded GetDescendants | `GetDescendants()` without Take/limit |
| PERF-003 | Warning | Rendering without cache | Rendering definitions missing Cacheable=true |
| PERF-004 | Warning | Missing VaryBy params | Cached rendering without appropriate VaryBy |
| PERF-005 | Warning | Content Search no pagination | `.ToList()` without `.Take()` |
| PERF-006 | Warning | No Solr computed fields | Index config without computed fields |
| PERF-007 | Info | No custom cache | High-traffic component without caching |
| PERF-008 | Info | Media without CDN | Direct media URLs without CDN prefix |

## Analysis Steps

### Step 1: Scan for Sitecore.Query

```
Grep: \.Axes\.Select
Grep: Database\.SelectItems
Grep: fast:/
```

### Step 2: Find Tree Traversal

```
Grep: \.GetDescendants\(
Grep: \.GetChildren\(
Grep: \.Children
```

### Step 3: Check Content Search

```
Grep: CreateSearchContext
Grep: GetQueryable
Check for .Take() usage
```

### Step 4: Analyze Serialization for Cache Settings

```
Glob: **/*.yml (SCS files)
Grep: Cacheable
```

### Step 5: Review Index Configuration

```
Glob: **/App_Config/**/*index*.config
Check for computed fields and excluded fields
```

## Output Format

```markdown
## Performance Analysis

### Performance Score: B

### Critical Issues

#### [PERF-001] Sitecore.Query in Loop
**Location**: `src/Feature/Navigation/code/Services/NavigationService.cs:67`
**Code**:
```csharp
foreach (var section in sections)
{
    var children = section.Axes.SelectItems("./*[@@templateid='{...}']");
}
```
**Impact**: O(n) database queries, severe performance degradation
**Fix**: Use Content Search with single query and filter in memory

#### [PERF-002] Unbounded GetDescendants
**Location**: `src/Feature/Search/code/Indexing/ContentCrawler.cs:34`
**Code**:
```csharp
var allContent = rootItem.GetDescendants().ToList();
```
**Impact**: Memory pressure, potential OutOfMemoryException
**Fix**: Use Content Search with pagination

### Warnings

#### [PERF-003] Rendering Without Cache
**Location**: `src/Feature/Navigation/serialization/Renderings/Main Navigation.yml`
**Issue**: Main Navigation rendering has Cacheable=false
**Impact**: Renders on every page request
**Fix**: Enable caching with VaryByData=true

### Optimization Opportunities
1. Add 3 computed fields to Solr index for frequently filtered fields
2. Enable HTML caching on 5 high-traffic renderings
3. Implement custom cache for navigation data (estimated 40% reduction in DB queries)
```
