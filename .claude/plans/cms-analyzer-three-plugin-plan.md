# CMS Analyzer Marketplace - Three Plugin Architecture

## Overview

Build three Claude Code marketplace plugins for enterprise CMS analysis:
- **sitecore-classic-analyzer**: For Sitecore 10.x (on-premise/IaaS)
- **xm-cloud-analyzer**: For Sitecore XM Cloud (headless SaaS)
- **umbraco-analyzer**: For Umbraco 14-16 (.NET 8/9/10)

Each plugin provides **focused, platform-specific analysis** with actionable reports, severity ratings, and shareable metrics.

---

## Why Three Plugins Instead of Two

| Factor | Combined Sitecore Plugin | Split Plugins |
|--------|-------------------------|---------------|
| Tech stack alignment | Mixed C# + TypeScript | Focused per platform |
| Agent accuracy | Compromised by branching | Optimized for each |
| Report clarity | Potentially confusing | Clear, targeted |
| Maintenance | Complex conditionals | Simple, focused files |
| Team adoption | "Which parts apply to me?" | Obvious from name |

**Decision**: The 80%+ difference in analysis logic between Sitecore 10.x and XM Cloud justifies separate plugins.

---

## Directory Structure

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── README.md
├── plugins/
│   ├── sitecore-classic-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── README.md
│   │   ├── commands/
│   │   │   └── analyze.md
│   │   ├── agents/
│   │   │   ├── detector.md
│   │   │   ├── architecture.md
│   │   │   ├── code-quality.md
│   │   │   ├── security.md
│   │   │   ├── performance.md
│   │   │   ├── serialization.md
│   │   │   ├── dependencies.md
│   │   │   └── conventions.md
│   │   └── skills/
│   │       └── sitecore-classic/
│   │           └── SKILL.md
│   ├── xm-cloud-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── README.md
│   │   ├── commands/
│   │   │   └── analyze.md
│   │   ├── agents/
│   │   │   ├── detector.md
│   │   │   ├── architecture.md
│   │   │   ├── code-quality.md
│   │   │   ├── security.md
│   │   │   ├── performance.md
│   │   │   ├── graphql.md
│   │   │   ├── dependencies.md
│   │   │   └── conventions.md
│   │   └── skills/
│   │       └── xm-cloud/
│   │           └── SKILL.md
│   └── umbraco-analyzer/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── README.md
│       ├── commands/
│       │   └── analyze.md
│       ├── agents/
│       │   ├── detector.md
│       │   ├── architecture.md
│       │   ├── code-quality.md
│       │   ├── security.md
│       │   ├── performance.md
│       │   ├── backoffice.md
│       │   ├── api.md
│       │   ├── dependencies.md
│       │   └── conventions.md
│       └── skills/
│           ├── umbraco-development/
│           │   └── SKILL.md
│           └── umbraco-modern-guide/
│               └── SKILL.md
```

**Total: 8 agents per plugin, 41 files total**

---

## Phase 1: Marketplace Foundation

### Step 1.1: Create marketplace.json

**File**: `.claude-plugin/marketplace.json`

```json
{
  "name": "cms-analyzers-marketplace",
  "version": "1.0.0",
  "description": "Claude Code plugins for analyzing enterprise CMS platforms with actionable reports",
  "plugins": [
    {
      "name": "sitecore-classic-analyzer",
      "source": "./plugins/sitecore-classic-analyzer",
      "description": "Sitecore 10.x analyzer for Helix compliance, serialization, and C# patterns",
      "category": "cms",
      "tags": ["sitecore", "helix", "dotnet", "mvc", "solr"]
    },
    {
      "name": "xm-cloud-analyzer",
      "source": "./plugins/xm-cloud-analyzer",
      "description": "XM Cloud analyzer for JSS, Next.js, GraphQL, and headless patterns",
      "category": "cms",
      "tags": ["sitecore", "xm-cloud", "jss", "nextjs", "graphql", "typescript"]
    },
    {
      "name": "umbraco-analyzer",
      "source": "./plugins/umbraco-analyzer",
      "description": "Umbraco 14-16 analyzer for backoffice, Content Delivery API, and architecture",
      "category": "cms",
      "tags": ["umbraco", "dotnet", "aspnet-core", "lit", "typescript"]
    }
  ]
}
```

### Step 1.2: Create Root README.md

**File**: `README.md`

Contents:
- Marketplace overview
- Quick start installation
- Plugin comparison table
- Links to each plugin README
- CI/CD integration examples

---

## Phase 2: Sitecore Classic Analyzer Plugin

### Step 2.1: Plugin Configuration

**File**: `plugins/sitecore-classic-analyzer/.claude-plugin/plugin.json`

```json
{
  "name": "sitecore-classic-analyzer",
  "version": "1.0.0",
  "description": "Analyze Sitecore 10.x projects for Helix compliance, security, and performance",
  "commands": ["commands/analyze.md"],
  "agents": [
    "agents/detector.md",
    "agents/architecture.md",
    "agents/code-quality.md",
    "agents/security.md",
    "agents/performance.md",
    "agents/serialization.md",
    "agents/dependencies.md",
    "agents/conventions.md"
  ],
  "skills": ["skills/sitecore-classic"]
}
```

### Step 2.2: Detection Logic

**File**: `plugins/sitecore-classic-analyzer/agents/detector.md`

**Primary Indicators**:
- `sitecore.json` - Sitecore CLI configuration
- `*.module.json` - Sitecore module definitions
- `/App_Config/Include/*.config` - Config patches
- `layers.config` - Helix layer configuration
- `.csproj` with `Sitecore.*` package references (NOT `Sitecore.JSS` only)

**Exclusion Indicators** (means XM Cloud, not Classic):
- `xmcloud.build.json` present
- `package.json` with `@sitecore-jss/*` as primary dependencies
- `/src/rendering/` Next.js structure
- No `/App_Config/` directory

**Version Detection**:
- Parse `Sitecore.Kernel` version from `.csproj`
- Check `sitecore.json` for CLI version hints
- Detect 10.0, 10.1, 10.2, 10.3, 10.4

**Output Format**:
```yaml
detection:
  cms: Sitecore Classic
  version: "10.4"
  architecture: "Helix" | "Traditional"
  modules:
    - SXA
    - Commerce
    - Forms
  serialization: "SCS" | "Unicorn" | "TDS" | "Mixed"
  renderingType: "MVC" | "Controller" | "View"
```

### Step 2.3: Architecture Agent

**File**: `plugins/sitecore-classic-analyzer/agents/architecture.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Helix three-layer structure (Foundation, Feature, Project)
- Layer naming conventions: `{Layer}.{Module}`
- Dependency direction validation via `.csproj` ProjectReferences
- `/App_Config/Include/` organization by layer
- Solution folder structure alignment
- Module boundaries

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| ARCH-001 | Critical | Cross-Feature dependency (Feature A → Feature B) |
| ARCH-002 | Critical | Upward dependency (Foundation → Feature/Project) |
| ARCH-003 | Warning | God module (>15 classes in single module) |
| ARCH-004 | Warning | Config patch in wrong layer folder |
| ARCH-005 | Warning | Missing Helix layer (e.g., no Foundation) |
| ARCH-006 | Info | Non-standard naming pattern |
| ARCH-007 | Info | Empty module (no functionality) |

### Step 2.4: Code Quality Agent

**File**: `plugins/sitecore-classic-analyzer/agents/code-quality.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Controller rendering patterns
- Dependency injection via `IServicesConfigurator`
- Pipeline processor implementation
- Glass Mapper / Synthesis ORM usage
- Repository pattern implementation
- Service layer patterns
- View rendering best practices

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| CQ-001 | Critical | Service Locator pattern (`ServiceLocator.GetService`) |
| CQ-002 | Critical | Static Sitecore.Context in async code |
| CQ-003 | Warning | Missing null checks on item access |
| CQ-004 | Warning | Business logic in controller |
| CQ-005 | Warning | Raw database queries instead of Content Search |
| CQ-006 | Info | Missing interface for service class |
| CQ-007 | Info | Glass Mapper lazy loading in loop |

### Step 2.5: Security Agent

**File**: `plugins/sitecore-classic-analyzer/agents/security.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Hardcoded credentials in config/code
- Connection strings with passwords
- API keys in source control
- CORS configuration in web.config
- Admin path exposure
- XSS vectors in renderings
- CSRF token usage
- Forms authentication settings

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SEC-001 | Critical | Hardcoded credentials in config |
| SEC-002 | Critical | Connection string password in plain text |
| SEC-003 | Critical | API key committed to source |
| SEC-004 | Warning | Overly permissive CORS (`*` origin) |
| SEC-005 | Warning | Missing anti-forgery tokens on forms |
| SEC-006 | Warning | CustomErrorMode="Off" in production config |
| SEC-007 | Info | Default admin path not customized |
| SEC-008 | Info | Debug compilation enabled |

### Step 2.6: Performance Agent

**File**: `plugins/sitecore-classic-analyzer/agents/performance.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- HTML cache configuration per rendering
- `Cacheable` attribute usage
- Data cache implementation
- Sitecore.Query vs Content Search usage
- Solr index configuration
- Computed field definitions
- Media library access patterns
- Pipeline processor efficiency
- GetDescendants/GetChildren usage

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| PERF-001 | Critical | Sitecore.Query in loop |
| PERF-002 | Critical | Unbounded GetDescendants() call |
| PERF-003 | Warning | Rendering without cache settings |
| PERF-004 | Warning | Missing VaryBy parameters on cached rendering |
| PERF-005 | Warning | Content Search without pagination |
| PERF-006 | Warning | Solr index missing computed fields |
| PERF-007 | Info | Custom cache not implemented |
| PERF-008 | Info | Media items accessed without CDN |

### Step 2.7: Serialization Agent

**File**: `plugins/sitecore-classic-analyzer/agents/serialization.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Detect primary format (SCS YAML, Unicorn, TDS)
- Analyze `*.module.json` include/exclude patterns
- Check for overlapping includes across modules
- Verify template organization matches Helix layers
- Identify environment-specific items in serialization
- Check for sensitive data in serialized items
- Role/user serialization concerns
- **Slow query detection in serialized field values**

**Slow Query Detection in Field Values**:

Scan serialized items (`.yml`, `.yaml`, `.item`) for field values containing performance-problematic patterns:

| Pattern | Risk | Example |
|---------|------|---------|
| `query:` prefix | High | `query:/sitecore/content//*[@@templateid='{...}']` |
| `fast:` prefix | Medium | `fast:/sitecore/content/Home//*` |
| Axes selectors | High | `.//*`, `ancestor::*`, `descendant::*` |
| Deep path traversal | Medium | `../../../../` in queries |
| Unbounded wildcards | High | `//*` without filters |
| Complex predicates | Medium | Multiple `and`/`or` conditions |

**Detection Locations**:
- Datasource fields (`Datasource`, `Data Source`)
- Internal link fields with queries
- Multilist fields with query sources
- Treelist fields with query sources
- Rendering parameters with query values
- Template standard values with query datasources

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SER-001 | Critical | Mixed serialization formats (SCS + Unicorn active) |
| SER-002 | Critical | Sensitive data in serialized items (API keys, passwords) |
| SER-003 | Critical | User/role items with passwords serialized |
| SER-004 | Warning | Overlapping include paths between modules |
| SER-005 | Warning | Items serialized in wrong Helix layer |
| SER-006 | Warning | Missing predicate for shared templates |
| SER-007 | Info | Missing language versions for content |
| SER-008 | Info | Orphaned serialization files |
| SER-009 | Critical | Sitecore query in serialized field value (unbounded) |
| SER-010 | Warning | Fast query in serialized field without index hint |
| SER-011 | Warning | Deep axis traversal in field query |
| SER-012 | Info | Query-based datasource in standard values |

**Example Detection**:
```yaml
# In serialized .yml file - DETECTED as SER-009
- ID: "datasource-field-id"
  Hint: Datasource
  Value: "query:/sitecore/content/Home//*[@@templatename='Article']"

# In rendering parameters - DETECTED as SER-011
- ID: "rendering-params-id"
  Value: "datasource=query:./ancestor::*[@@templatename='Site Root']/Settings"
```

**Report Output**:
```markdown
### [SER-009] Slow Sitecore Query in Serialized Item
**Severity**: Critical
**Location**: `serialization/Feature/Navigation/Items/Header.yml:45`
**Item Path**: `/sitecore/content/Home/Header`
**Field**: `Navigation Items` (Multilist)
**Query**: `query:/sitecore/content//*[@@templatename='Navigation Link']`
**Issue**: Unbounded query will traverse entire content tree on every page render
**Fix**:
1. Limit query scope: `query:/sitecore/content/Home/Navigation/*[@@templatename='Navigation Link']`
2. Or use Content Search with index
3. Or convert to explicit item references
```

### Step 2.8: Dependencies Agent

**File**: `plugins/sitecore-classic-analyzer/agents/dependencies.md`
**Tools**: `Read, Glob, Grep, Bash`

**Analysis Areas**:
- NuGet package versions vs Sitecore version compatibility
- Deprecated Sitecore packages
- Security vulnerabilities (via `dotnet list package --vulnerable`)
- Version conflicts across projects
- Glass Mapper version alignment
- Third-party package compatibility

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| DEP-001 | Critical | Package with known security vulnerability |
| DEP-002 | Critical | Sitecore package version mismatch |
| DEP-003 | Warning | Deprecated package still in use |
| DEP-004 | Warning | Version conflict between projects |
| DEP-005 | Warning | Outdated Glass Mapper version |
| DEP-006 | Info | Package update available |

### Step 2.9: Conventions Agent

**File**: `plugins/sitecore-classic-analyzer/agents/conventions.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Template naming patterns (PascalCase, prefixes)
- Field naming conventions
- Rendering naming standards
- Config patch file naming
- Branch template usage
- Standard values configuration
- Placeholder settings

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| CONV-001 | Warning | Inconsistent template naming |
| CONV-002 | Warning | Field names not following convention |
| CONV-003 | Warning | Config patch missing layer prefix |
| CONV-004 | Info | Missing template icon |
| CONV-005 | Info | Standard values not configured |

### Step 2.10: Main Command

**File**: `plugins/sitecore-classic-analyzer/commands/analyze.md`

**Command**: `/sitecore-classic:analyze [agent|all]`

**Flow**:
1. Run detector agent to confirm Sitecore Classic (exit if XM Cloud detected)
2. Based on argument, invoke relevant agents
3. Each agent returns findings with severity ratings
4. Aggregate into consolidated report with metrics

**Arguments**:
- `all` - Run all agents (default)
- `architecture` - Helix compliance only
- `security` - Security checks only
- `performance` - Performance analysis only
- `serialization` - Serialization config only
- `quality` - Code quality only
- `dependencies` - NuGet analysis only
- `conventions` - Naming/structure only

**Report Format**:
```markdown
# Sitecore Classic Analysis Report

## Summary
- **Platform**: Sitecore 10.4 (Helix Architecture)
- **Modules Detected**: SXA, Forms
- **Serialization**: Sitecore Content Serialization
- **Issues Found**: 14 (2 Critical, 6 Warning, 6 Info)

## Scores
| Category | Score | Issues |
|----------|-------|--------|
| Helix Compliance | 87% | 3 |
| Security | B+ | 4 |
| Performance | A- | 2 |
| Code Quality | B | 5 |

## Critical Issues

### [ARCH-001] Cross-Feature Dependency Detected
**Severity**: Critical
**Location**: `src/Feature/Navigation/code/Feature.Navigation.csproj:24`
**Issue**: Feature.Navigation references Feature.Search directly
**Fix**: Extract shared navigation/search logic to Foundation.Search or create Foundation.Navigation

### [SEC-002] Connection String Contains Password
**Severity**: Critical
**Location**: `App_Config/ConnectionStrings.config:8`
**Issue**: SQL password visible in plain text
**Fix**: Use Windows Authentication or move to environment variables/Azure Key Vault

## Warnings
...

## Info
...

## Recommendations
1. Address Critical issues before next deployment
2. Consider implementing custom cache for high-traffic renderings
3. Review serialization overlaps between Feature.Navigation and Feature.Header
```

### Step 2.11: Skills File

**File**: `plugins/sitecore-classic-analyzer/skills/sitecore-classic/SKILL.md`

```markdown
---
name: sitecore-classic
description: Apply when working with Sitecore 10.x projects, Helix architecture, MVC renderings, or Sitecore APIs
globs:
  - "**/*.cshtml"
  - "**/App_Config/**/*.config"
  - "**/*.module.json"
  - "**/code/**/*.cs"
---

# Sitecore 10.x Development Patterns

## Helix Architecture

### Layer Responsibilities
- **Foundation**: Cross-cutting concerns (logging, serialization, DI registration, indexing)
- **Feature**: Business capabilities (Navigation, Search, Forms, Checkout)
- **Project**: Tenant/site-specific (branding, layout, content structure)

### Dependency Rule
```
Project → Feature → Foundation
```
Never reverse. Features must not reference other Features.

### Folder Structure
```
src/
├── Foundation/
│   └── {Module}/
│       ├── code/
│       │   └── Foundation.{Module}.csproj
│       └── serialization/
├── Feature/
│   └── {Module}/
│       ├── code/
│       │   └── Feature.{Module}.csproj
│       └── serialization/
└── Project/
    └── {Site}/
        ├── code/
        │   └── Project.{Site}.csproj
        └── serialization/
```

## Dependency Injection

```csharp
public class RegisterDependencies : IServicesConfigurator
{
    public void Configure(IServiceCollection services)
    {
        services.AddTransient<IMyService, MyService>();
        services.AddScoped<IContextService, ContextService>();
    }
}
```

Register in config:
```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <services>
      <configurator type="Foundation.DI.RegisterDependencies, Foundation.DI" />
    </services>
  </sitecore>
</configuration>
```

## Content Access Patterns

### Good: Content Search
```csharp
using (var context = ContentSearchManager.GetIndex("sitecore_web_index").CreateSearchContext())
{
    var results = context.GetQueryable<SearchResultItem>()
        .Where(x => x.TemplateId == templateId)
        .Where(x => x.Language == Context.Language.Name)
        .Take(100)  // Always paginate
        .ToList();
}
```

### Bad: Sitecore Query (Slow)
```csharp
// Avoid - performs tree traversal
var items = rootItem.Axes.SelectItems(".//*[@@templateid='{...}']");
```

### Bad: GetDescendants (Memory Heavy)
```csharp
// Avoid - loads entire subtree
var allItems = rootItem.GetDescendants();
```

## Controller Rendering Pattern

```csharp
public class NavigationController : Controller
{
    private readonly INavigationService _navigationService;
    private readonly ILogger<NavigationController> _logger;

    public NavigationController(
        INavigationService navigationService,
        ILogger<NavigationController> logger)
    {
        _navigationService = navigationService;
        _logger = logger;
    }

    public ActionResult MainNavigation()
    {
        var dataSource = RenderingContext.Current.Rendering.Item;
        if (dataSource == null)
        {
            _logger.LogWarning("Navigation rendering missing datasource");
            return new EmptyResult();
        }

        var model = _navigationService.GetNavigation(dataSource);
        return View(model);
    }
}
```

## Caching Configuration

### Rendering Cache Settings
```xml
<r>
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="{...}" caching="1"
       varybydata="1"
       varybyuser="0"
       varybyquery="0"
       timeout="01:00:00" />
  </d>
</r>
```

### Custom Cache
```csharp
public class NavigationCache : CustomCache
{
    public NavigationCache(string name, long maxSize)
        : base(name, maxSize) { }

    public NavigationModel Get(string key)
    {
        return GetObject<NavigationModel>(key);
    }

    public void Set(string key, NavigationModel value)
    {
        SetObject(key, value, TimeSpan.FromHours(1));
    }
}
```

## Pipeline Processor Pattern

```csharp
public class EnrichItemProcessor : HttpRequestProcessor
{
    public override void Process(HttpRequestArgs args)
    {
        if (Context.Item == null) return;
        if (Context.PageMode.IsExperienceEditor) return;

        // Processor logic - keep lightweight
        EnrichItem(Context.Item);
    }
}
```

Config:
```xml
<httpRequestBegin>
  <processor type="Feature.Enrichment.EnrichItemProcessor, Feature.Enrichment"
             patch:after="processor[@type='Sitecore.Pipelines.HttpRequest.ItemResolver, Sitecore.Kernel']" />
</httpRequestBegin>
```

## Configuration Patching

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/"
               xmlns:role="http://www.sitecore.net/xmlconfig/role/"
               xmlns:env="http://www.sitecore.net/xmlconfig/env/">
  <sitecore>
    <settings>
      <!-- Environment-specific -->
      <setting name="Analytics.Enabled" env:require="Production">
        <patch:attribute name="value">true</patch:attribute>
      </setting>

      <!-- Role-specific -->
      <setting name="ContentSearch.ParallelIndexing.Enabled" role:require="Standalone or ContentManagement">
        <patch:attribute name="value">true</patch:attribute>
      </setting>
    </settings>
  </sitecore>
</configuration>
```

## Solr Index Configuration

```xml
<index id="custom_index">
  <configuration>
    <documentOptions>
      <fields hint="raw:AddComputedIndexField">
        <field fieldName="navigation_title"
               returnType="string">Feature.Navigation.ComputedFields.NavigationTitle, Feature.Navigation</field>
      </fields>
    </documentOptions>
  </configuration>
</index>
```

Computed field:
```csharp
public class NavigationTitle : IComputedIndexField
{
    public string FieldName { get; set; }
    public string ReturnType { get; set; }

    public object ComputeFieldValue(IIndexable indexable)
    {
        var item = (indexable as SitecoreIndexableItem)?.Item;
        return item?["Navigation Title"] ?? item?.DisplayName;
    }
}
```
```

---

## Phase 3: XM Cloud Analyzer Plugin

### Step 3.1: Plugin Configuration

**File**: `plugins/xm-cloud-analyzer/.claude-plugin/plugin.json`

```json
{
  "name": "xm-cloud-analyzer",
  "version": "1.0.0",
  "description": "Analyze XM Cloud projects for JSS patterns, GraphQL efficiency, and Next.js best practices",
  "commands": ["commands/analyze.md"],
  "agents": [
    "agents/detector.md",
    "agents/architecture.md",
    "agents/code-quality.md",
    "agents/security.md",
    "agents/performance.md",
    "agents/graphql.md",
    "agents/dependencies.md",
    "agents/conventions.md"
  ],
  "skills": ["skills/xm-cloud"]
}
```

### Step 3.2: Detection Logic

**File**: `plugins/xm-cloud-analyzer/agents/detector.md`

**Primary Indicators**:
- `xmcloud.build.json` - XM Cloud build configuration
- `package.json` with `@sitecore-jss/*` dependencies
- `/src/rendering/` or `/src/nextjs/` directories
- `.env` or `.env.local` with `SITECORE_API_KEY`
- GraphQL schema files (`.graphql`)
- `next.config.js` with Sitecore configuration

**Version Detection**:
- Parse `@sitecore-jss/sitecore-jss-nextjs` version from package.json
- Check JSS version: 21.x, 22.x
- Check Next.js version: 13.x, 14.x

**Output Format**:
```yaml
detection:
  cms: XM Cloud
  jssVersion: "22.0"
  nextVersion: "14.2"
  features:
    - Experience Edge
    - Personalization
    - Multisite
  renderingHost: "Next.js"
  deployment: "Vercel" | "Netlify" | "Custom"
```

### Step 3.3: Architecture Agent

**File**: `plugins/xm-cloud-analyzer/agents/architecture.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Next.js app structure (App Router vs Pages Router)
- Component organization (`/src/components/`)
- Layout structure
- Middleware usage
- API routes organization
- Shared utilities structure

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| ARCH-001 | Critical | Mixed App Router and Pages Router patterns |
| ARCH-002 | Warning | Components not in dedicated folder |
| ARCH-003 | Warning | Business logic in page components |
| ARCH-004 | Warning | Missing layout component structure |
| ARCH-005 | Info | Inconsistent folder naming |
| ARCH-006 | Info | No shared utilities folder |

### Step 3.4: Code Quality Agent

**File**: `plugins/xm-cloud-analyzer/agents/code-quality.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- TypeScript strict mode compliance
- JSS component patterns (withDatasourceCheck)
- Field component usage (Text, RichText, Image)
- React best practices (hooks, memoization)
- Error boundary implementation
- Props typing

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| CQ-001 | Critical | Using `any` type extensively |
| CQ-002 | Critical | Missing withDatasourceCheck on data components |
| CQ-003 | Warning | Direct field access instead of Field components |
| CQ-004 | Warning | Missing error boundaries |
| CQ-005 | Warning | Inline styles instead of CSS modules |
| CQ-006 | Info | Missing React.memo on pure components |
| CQ-007 | Info | Console.log statements in production code |

### Step 3.5: Security Agent

**File**: `plugins/xm-cloud-analyzer/agents/security.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- API keys in source code (should be env vars)
- Environment variable exposure to client
- GraphQL introspection settings
- CORS configuration
- Authentication patterns
- Sensitive data in getStaticProps/getServerSideProps

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SEC-001 | Critical | API key hardcoded in source |
| SEC-002 | Critical | SITECORE_API_KEY exposed to client (NEXT_PUBLIC_) |
| SEC-003 | Critical | Sensitive data in getStaticProps (sent to client) |
| SEC-004 | Warning | GraphQL introspection enabled in production |
| SEC-005 | Warning | Missing authentication on API routes |
| SEC-006 | Info | Environment variables not validated at startup |

### Step 3.6: Performance Agent

**File**: `plugins/xm-cloud-analyzer/agents/performance.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- SSR vs SSG vs ISR decisions
- Image optimization (next/image)
- Bundle size concerns
- Dynamic imports usage
- Edge caching headers
- Revalidation strategy
- Font optimization

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| PERF-001 | Critical | getServerSideProps on static content |
| PERF-002 | Warning | Large bundle imports (no tree shaking) |
| PERF-003 | Warning | Images without next/image optimization |
| PERF-004 | Warning | Missing revalidate on getStaticProps |
| PERF-005 | Warning | No dynamic imports for heavy components |
| PERF-006 | Info | Missing font optimization |
| PERF-007 | Info | No caching headers on API routes |

### Step 3.7: GraphQL Agent

**File**: `plugins/xm-cloud-analyzer/agents/graphql.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Query efficiency (over-fetching, under-fetching)
- N+1 query patterns
- Fragment usage
- Query complexity
- Caching strategy
- Error handling in queries

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| GQL-001 | Critical | N+1 query pattern in component |
| GQL-002 | Critical | Fetching all fields when few needed |
| GQL-003 | Warning | Not using fragments for shared fields |
| GQL-004 | Warning | Missing error handling on query |
| GQL-005 | Warning | Query in component (should be in hook/service) |
| GQL-006 | Info | Deeply nested query (>4 levels) |
| GQL-007 | Info | No query caching implemented |

### Step 3.8: Dependencies Agent

**File**: `plugins/xm-cloud-analyzer/agents/dependencies.md`
**Tools**: `Read, Glob, Grep, Bash`

**Analysis Areas**:
- JSS package version alignment
- Next.js version compatibility
- React version compatibility
- Security vulnerabilities (npm audit)
- Deprecated packages
- Bundle size impact

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| DEP-001 | Critical | Package with known security vulnerability |
| DEP-002 | Critical | JSS version mismatch between packages |
| DEP-003 | Warning | Outdated Next.js version |
| DEP-004 | Warning | Deprecated package in use |
| DEP-005 | Warning | Large dependency adding to bundle |
| DEP-006 | Info | Package update available |

### Step 3.9: Conventions Agent

**File**: `plugins/xm-cloud-analyzer/agents/conventions.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Component naming (PascalCase)
- File naming conventions
- GraphQL query naming
- Hook naming (use* prefix)
- CSS module naming
- Test file organization

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| CONV-001 | Warning | Component file not PascalCase |
| CONV-002 | Warning | Hook missing use* prefix |
| CONV-003 | Warning | GraphQL query not descriptive |
| CONV-004 | Info | Inconsistent CSS module naming |
| CONV-005 | Info | Test files not co-located |

### Step 3.10: Main Command

**File**: `plugins/xm-cloud-analyzer/commands/analyze.md`

**Command**: `/xm-cloud:analyze [agent|all]`

**Flow**:
1. Run detector agent to confirm XM Cloud project
2. Based on argument, invoke relevant agents
3. Each agent returns findings with severity ratings
4. Aggregate into consolidated report

**Report Format**:
```markdown
# XM Cloud Analysis Report

## Summary
- **Platform**: XM Cloud (JSS 22.0, Next.js 14.2)
- **Rendering Host**: Next.js (App Router)
- **Deployment**: Vercel
- **Issues Found**: 11 (1 Critical, 5 Warning, 5 Info)

## Scores
| Category | Score | Issues |
|----------|-------|--------|
| Architecture | A | 2 |
| TypeScript Quality | B+ | 3 |
| Security | A- | 1 |
| Performance | B | 3 |
| GraphQL | B+ | 2 |

## Critical Issues

### [SEC-002] API Key Exposed to Client
**Severity**: Critical
**Location**: `.env.local:3`
**Issue**: NEXT_PUBLIC_SITECORE_API_KEY exposes API key to browser
**Fix**: Rename to SITECORE_API_KEY (without NEXT_PUBLIC_) and access only in server components

## Warnings
...
```

### Step 3.11: Skills File

**File**: `plugins/xm-cloud-analyzer/skills/xm-cloud/SKILL.md`

```markdown
---
name: xm-cloud
description: Apply when working with Sitecore XM Cloud, JSS, Next.js rendering host, or Experience Edge
globs:
  - "**/src/rendering/**/*"
  - "**/xmcloud.build.json"
  - "**/*.graphql"
  - "**/src/components/**/*.tsx"
---

# XM Cloud Development Patterns

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        XM Cloud                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Content   │───▶│  Experience │───▶│    Edge     │     │
│  │ Management  │    │    Edge     │    │    CDN      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ GraphQL
┌─────────────────────────────────────────────────────────────┐
│                    Rendering Host                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Next.js   │───▶│    SSG/     │───▶│   Vercel/   │     │
│  │    App      │    │   ISR/SSR   │    │   Netlify   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## JSS Component Pattern

```tsx
import {
  Text,
  Field,
  RichText,
  ImageField,
  Image,
  withDatasourceCheck
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

interface HeroProps extends ComponentProps {
  fields: {
    heading: Field<string>;
    subheading: Field<string>;
    body: Field<string>;
    image: ImageField;
  };
}

const Hero = ({ fields }: HeroProps): JSX.Element => (
  <section className="hero">
    <div className="hero-content">
      <Text field={fields.heading} tag="h1" />
      <Text field={fields.subheading} tag="h2" />
      <RichText field={fields.body} />
    </div>
    <div className="hero-image">
      <Image field={fields.image} />
    </div>
  </section>
);

// Always wrap data-driven components
export default withDatasourceCheck()<HeroProps>(Hero);
```

## Placeholder Pattern

```tsx
import {
  Placeholder,
  ComponentRendering
} from '@sitecore-jss/sitecore-jss-nextjs';

interface LayoutProps {
  rendering: ComponentRendering;
}

const TwoColumnLayout = ({ rendering }: LayoutProps): JSX.Element => (
  <div className="two-column">
    <aside className="sidebar">
      <Placeholder name="sidebar" rendering={rendering} />
    </aside>
    <main className="main-content">
      <Placeholder name="main" rendering={rendering} />
    </main>
  </div>
);

export default TwoColumnLayout;
```

## GraphQL Query Pattern

```graphql
# queries/NavigationQuery.graphql
query NavigationQuery($language: String!, $rootPath: String!) {
  search(
    where: {
      AND: [
        { name: "_path", value: $rootPath, operator: CONTAINS }
        { name: "_language", value: $language }
        { name: "_templatename", value: "Navigation Item" }
      ]
    }
    orderBy: { name: "sortOrder", direction: ASC }
  ) {
    results {
      ...NavigationItemFields
    }
  }
}

fragment NavigationItemFields on NavigationItem {
  id
  title {
    value
  }
  url {
    path
  }
  children {
    results {
      ...NavigationItemFields
    }
  }
}
```

## Data Fetching Patterns

### Static Generation (SSG) - Preferred
```tsx
// For content that rarely changes
export async function getStaticProps(context: GetStaticPropsContext) {
  const props = await sitecorePagePropsFactory.create(context);

  return {
    props,
    revalidate: 60, // ISR: regenerate every 60 seconds
  };
}
```

### Server-Side Rendering (SSR) - When Needed
```tsx
// For personalized or real-time content
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props = await sitecorePagePropsFactory.create(context);

  // Set cache headers for Edge
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  return { props };
}
```

## Environment Configuration

```bash
# .env.local (never commit)
SITECORE_API_KEY=your-api-key
SITECORE_API_HOST=https://cm.your-xmcloud.sitecorecloud.io
GRAPH_QL_ENDPOINT=https://edge.sitecorecloud.io/api/graphql/v1

# Public (safe to expose)
NEXT_PUBLIC_SITE_NAME=your-site
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

```typescript
// lib/config.ts
export const config = {
  sitecoreApiKey: process.env.SITECORE_API_KEY!,
  sitecoreApiHost: process.env.SITECORE_API_HOST!,
  graphQLEndpoint: process.env.GRAPH_QL_ENDPOINT!,
  siteName: process.env.NEXT_PUBLIC_SITE_NAME!,
};

// Validate at startup
if (!config.sitecoreApiKey) {
  throw new Error('SITECORE_API_KEY is required');
}
```

## Image Optimization

```tsx
import { Image as JssImage } from '@sitecore-jss/sitecore-jss-nextjs';
import NextImage from 'next/image';

// For Sitecore-managed images
<JssImage
  field={fields.image}
  width={800}
  height={600}
/>

// For static images with Next.js optimization
<NextImage
  src="/images/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

## Error Handling

```tsx
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

## Custom Hook Pattern

```tsx
// hooks/useNavigation.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNavigation } from 'lib/graphql';

export function useNavigation(rootPath: string, language: string) {
  return useQuery({
    queryKey: ['navigation', rootPath, language],
    queryFn: () => fetchNavigation(rootPath, language),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Middleware for Personalization

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PersonalizeMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';

export async function middleware(request: NextRequest) {
  const personalizeMiddleware = new PersonalizeMiddleware({
    // Configuration
  });

  return personalizeMiddleware.getHandler()(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```
```

---

## Phase 4: Umbraco Analyzer Plugin

### Step 4.1: Plugin Configuration

**File**: `plugins/umbraco-analyzer/.claude-plugin/plugin.json`

```json
{
  "name": "umbraco-analyzer",
  "version": "1.0.0",
  "description": "Analyze Umbraco 14-16 projects for architecture, security, and backoffice patterns",
  "commands": ["commands/analyze.md"],
  "agents": [
    "agents/detector.md",
    "agents/architecture.md",
    "agents/code-quality.md",
    "agents/security.md",
    "agents/performance.md",
    "agents/backoffice.md",
    "agents/api.md",
    "agents/dependencies.md",
    "agents/conventions.md"
  ],
  "skills": [
    "skills/umbraco-development",
    "skills/umbraco-modern-guide"
  ]
}
```

### Step 4.2: Detection Logic

**File**: `plugins/umbraco-analyzer/agents/detector.md`

**Primary Indicators**:
- `appsettings.json` with `"Umbraco"` section
- `.csproj` with `Umbraco.Cms` package reference
- `/App_Plugins/` directory
- `Program.cs` with `.AddUmbraco()` call
- `/umbraco/` folder in wwwroot

**Version Detection**:
- Parse `Umbraco.Cms` version from `.csproj`
- Umbraco 14.x → .NET 8, Lit backoffice
- Umbraco 15.x → .NET 9, HybridCache available
- Umbraco 16.x → .NET 9/10, TipTap only

**Output Format**:
```yaml
detection:
  cms: Umbraco
  version: "15.1"
  dotnet: "9.0"
  backoffice: "Lit"
  features:
    - Content Delivery API
    - Block Grid
    - Custom Property Editors
```

### Step 4.3: Architecture Agent

**File**: `plugins/umbraco-analyzer/agents/architecture.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Project layering (Web, Core, Infrastructure)
- Composer implementation patterns
- Service registration and lifetimes
- Notification handler organization
- ModelsBuilder configuration

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| ARCH-001 | Critical | Service Locator pattern usage |
| ARCH-002 | Warning | Composer doing too much (>10 registrations) |
| ARCH-003 | Warning | Circular dependency detected |
| ARCH-004 | Warning | Fat controller (>5 actions) |
| ARCH-005 | Info | Missing interface for service |

### Step 4.4: Code Quality Agent

**File**: `plugins/umbraco-analyzer/agents/code-quality.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Surface controller patterns
- API controller implementation
- Property value converters
- Notification handlers
- Service layer patterns
- ModelsBuilder usage

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| CQ-001 | Critical | Sync over async pattern |
| CQ-002 | Warning | Business logic in controller |
| CQ-003 | Warning | Missing cancellation token propagation |
| CQ-004 | Warning | Property converter without caching |
| CQ-005 | Info | Missing XML documentation |

### Step 4.5: Security Agent

**File**: `plugins/umbraco-analyzer/agents/security.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Content Delivery API authentication
- Management API protection
- Backoffice access restrictions
- CORS configuration
- Member authentication setup
- Hardcoded credentials

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SEC-001 | Critical | Content Delivery API publicly accessible without auth |
| SEC-002 | Critical | Hardcoded credentials in appsettings |
| SEC-003 | Warning | Backoffice accessible from public IP |
| SEC-004 | Warning | Missing rate limiting on API |
| SEC-005 | Info | Default admin path not changed |

### Step 4.6: Performance Agent

**File**: `plugins/umbraco-analyzer/agents/performance.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- HybridCache usage (v15+)
- IPublishedContentCache vs IUmbracoContextFactory
- Examine/Lucene query patterns
- Image processing configuration
- Content access patterns

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| PERF-001 | Critical | Recursive content traversal without limit |
| PERF-002 | Warning | Not using HybridCache (v15+ available) |
| PERF-003 | Warning | IUmbracoContext in singleton service |
| PERF-004 | Warning | Missing image processor cache |
| PERF-005 | Info | Examine index not optimized |

### Step 4.7: Backoffice Agent

**File**: `plugins/umbraco-analyzer/agents/backoffice.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- `umbraco-package.json` configuration
- LitElement component implementations
- Property editor registration
- Dashboard configurations
- Management API consumption patterns
- TypeScript quality

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| BO-001 | Critical | AngularJS code in v14+ project |
| BO-002 | Warning | Missing manifest registration |
| BO-003 | Warning | Shadow DOM style leaking |
| BO-004 | Warning | Untyped TypeScript (`any`) |
| BO-005 | Info | Not using Umbraco UI Library components |

### Step 4.8: API Agent

**File**: `plugins/umbraco-analyzer/agents/api.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Content Delivery API configuration
- Management API usage
- Custom API controllers (Surface, API)
- Error handling patterns
- Response caching

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| API-001 | Critical | Sensitive data exposed via Delivery API |
| API-002 | Warning | Missing API versioning |
| API-003 | Warning | Inconsistent error response format |
| API-004 | Info | No response caching configured |

### Step 4.9: Dependencies Agent

**File**: `plugins/umbraco-analyzer/agents/dependencies.md`
**Tools**: `Read, Glob, Grep, Bash`

**Analysis Areas**:
- Package compatibility with Umbraco version
- Deprecated packages
- Upgrade path blockers
- Security vulnerabilities

### Step 4.10: Conventions Agent

**File**: `plugins/umbraco-analyzer/agents/conventions.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Document type naming (PascalCase)
- Property alias conventions (camelCase)
- Template naming
- Partial view organization
- App_Plugins structure

### Step 4.11: Main Command

**File**: `plugins/umbraco-analyzer/commands/analyze.md`

**Command**: `/umbraco:analyze [agent|all]`

**Report Format**:
```markdown
# Umbraco Analysis Report

## Summary
- **Platform**: Umbraco 15.1 on .NET 9
- **Backoffice**: Lit-based (modern)
- **Issues Found**: 9 (1 Critical, 4 Warning, 4 Info)

## Scores
| Category | Score | Issues |
|----------|-------|--------|
| Architecture | A- | 2 |
| Security | B | 2 |
| Performance | B+ | 3 |
| Backoffice | A | 2 |

## Critical Issues

### [SEC-001] Content Delivery API Publicly Accessible
**Severity**: Critical
**Location**: `appsettings.json:42`
**Issue**: Content Delivery API has no API key requirement
**Fix**: Add `PublicAccess` restriction or require API key

## Warnings
...
```

### Step 4.12: Skills Files

**File**: `plugins/umbraco-analyzer/skills/umbraco-development/SKILL.md`

```markdown
---
name: umbraco-development
description: Apply when working with Umbraco CMS, Composers, services, or content APIs
globs:
  - "**/Composers/**/*.cs"
  - "**/Controllers/**/*.cs"
  - "**/App_Plugins/**/*"
  - "**/Views/**/*.cshtml"
---

# Umbraco Development Patterns

## Composer Pattern

```csharp
public class MyComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddScoped<IMyService, MyService>();
        builder.AddNotificationHandler<ContentPublishedNotification, MyHandler>();
    }
}
```

## Notification Handler Pattern

```csharp
public class MyHandler : INotificationHandler<ContentPublishedNotification>
{
    public Task HandleAsync(ContentPublishedNotification notification, CancellationToken ct)
    {
        foreach (var content in notification.PublishedEntities)
        {
            // Handle published content
        }
        return Task.CompletedTask;
    }
}
```

## Content Access Pattern

```csharp
public class MyService
{
    private readonly IPublishedContentQuery _contentQuery;

    public MyService(IPublishedContentQuery contentQuery)
    {
        _contentQuery = contentQuery;
    }

    public IPublishedContent? GetContent(Guid key)
    {
        return _contentQuery.Content(key);
    }
}
```

## Surface Controller Pattern

```csharp
public class MyFormController : SurfaceController
{
    private readonly IMyService _myService;

    public MyFormController(
        IUmbracoContextAccessor umbracoContextAccessor,
        IUmbracoDatabaseFactory databaseFactory,
        ServiceContext services,
        AppCaches appCaches,
        IProfilingLogger profilingLogger,
        IPublishedUrlProvider publishedUrlProvider,
        IMyService myService)
        : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
    {
        _myService = myService;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult HandleSubmit(MyFormModel model)
    {
        if (!ModelState.IsValid)
            return CurrentUmbracoPage();

        _myService.ProcessForm(model);

        TempData["Success"] = "Form submitted successfully";
        return RedirectToCurrentUmbracoPage();
    }
}
```

## Examine Search Pattern

```csharp
public class SearchService
{
    private readonly IExamineManager _examineManager;

    public SearchService(IExamineManager examineManager)
    {
        _examineManager = examineManager;
    }

    public IEnumerable<ISearchResult> Search(string term)
    {
        if (!_examineManager.TryGetIndex("ExternalIndex", out var index))
            return Enumerable.Empty<ISearchResult>();

        var searcher = index.Searcher;
        var query = searcher.CreateQuery("content")
            .NativeQuery($"+__NodeTypeAlias:blogPost +bodyText:{term}*");

        return query.Execute();
    }
}
```
```

**File**: `plugins/umbraco-analyzer/skills/umbraco-modern-guide/SKILL.md`

```markdown
---
name: umbraco-modern-guide
description: Apply when working with Umbraco 14+, Lit components, Content Delivery API, or backoffice extensions
globs:
  - "**/App_Plugins/**/*.ts"
  - "**/umbraco-package.json"
  - "**/*.element.ts"
---

# Umbraco Modern Development (v14+)

## Lit Property Editor Pattern

```typescript
import { LitElement, html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';

@customElement('my-property-editor')
export class MyPropertyEditor extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    value = '';

    render() {
        return html`
            <uui-input
                .value=${this.value}
                @change=${this.#onChange}
            ></uui-input>
        `;
    }

    #onChange(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
        this.dispatchEvent(new CustomEvent('property-value-change'));
    }
}
```

## umbraco-package.json Structure

```json
{
    "name": "My.Package",
    "version": "1.0.0",
    "extensions": [
        {
            "type": "propertyEditorUi",
            "alias": "My.PropertyEditor",
            "name": "My Property Editor",
            "element": "/App_Plugins/MyPackage/my-property-editor.js",
            "meta": {
                "label": "My Property Editor",
                "icon": "icon-edit",
                "group": "common"
            }
        }
    ]
}
```

## Content Delivery API Configuration

```json
{
  "Umbraco": {
    "CMS": {
      "DeliveryApi": {
        "Enabled": true,
        "PublicAccess": false,
        "ApiKey": "your-secure-api-key"
      }
    }
  }
}
```

## HybridCache Pattern (v15+)

```csharp
public class CachedContentService
{
    private readonly HybridCache _cache;
    private readonly IPublishedContentQuery _contentQuery;

    public CachedContentService(HybridCache cache, IPublishedContentQuery contentQuery)
    {
        _cache = cache;
        _contentQuery = contentQuery;
    }

    public async Task<ContentModel?> GetContentAsync(Guid key, CancellationToken ct)
    {
        return await _cache.GetOrCreateAsync(
            $"content_{key}",
            async token =>
            {
                var content = _contentQuery.Content(key);
                return content != null ? MapToModel(content) : null;
            },
            cancellationToken: ct
        );
    }
}
```

## Version-Specific Notes

### Umbraco 14 (.NET 8)
- New Lit-based backoffice
- AngularJS fully deprecated
- Block Grid available

### Umbraco 15 (.NET 9)
- HybridCache for improved caching
- Performance improvements
- IPublishedContentCache changes

### Umbraco 16 (.NET 9/10)
- TipTap replaces TinyMCE completely
- Document Type Inheritance improvements
- Management API v2
```

---

## Phase 5: Implementation Order

### File Creation Sequence

**Marketplace Foundation (2 files)**:
1. `.claude-plugin/marketplace.json`
2. `README.md`

**Sitecore Classic Analyzer (12 files)**:
3. `plugins/sitecore-classic-analyzer/.claude-plugin/plugin.json`
4. `plugins/sitecore-classic-analyzer/README.md`
5. `plugins/sitecore-classic-analyzer/agents/detector.md`
6. `plugins/sitecore-classic-analyzer/agents/architecture.md`
7. `plugins/sitecore-classic-analyzer/agents/code-quality.md`
8. `plugins/sitecore-classic-analyzer/agents/security.md`
9. `plugins/sitecore-classic-analyzer/agents/performance.md`
10. `plugins/sitecore-classic-analyzer/agents/serialization.md`
11. `plugins/sitecore-classic-analyzer/agents/dependencies.md`
12. `plugins/sitecore-classic-analyzer/agents/conventions.md`
13. `plugins/sitecore-classic-analyzer/commands/analyze.md`
14. `plugins/sitecore-classic-analyzer/skills/sitecore-classic/SKILL.md`

**XM Cloud Analyzer (12 files)**:
15. `plugins/xm-cloud-analyzer/.claude-plugin/plugin.json`
16. `plugins/xm-cloud-analyzer/README.md`
17. `plugins/xm-cloud-analyzer/agents/detector.md`
18. `plugins/xm-cloud-analyzer/agents/architecture.md`
19. `plugins/xm-cloud-analyzer/agents/code-quality.md`
20. `plugins/xm-cloud-analyzer/agents/security.md`
21. `plugins/xm-cloud-analyzer/agents/performance.md`
22. `plugins/xm-cloud-analyzer/agents/graphql.md`
23. `plugins/xm-cloud-analyzer/agents/dependencies.md`
24. `plugins/xm-cloud-analyzer/agents/conventions.md`
25. `plugins/xm-cloud-analyzer/commands/analyze.md`
26. `plugins/xm-cloud-analyzer/skills/xm-cloud/SKILL.md`

**Umbraco Analyzer (15 files)**:
27. `plugins/umbraco-analyzer/.claude-plugin/plugin.json`
28. `plugins/umbraco-analyzer/README.md`
29. `plugins/umbraco-analyzer/agents/detector.md`
30. `plugins/umbraco-analyzer/agents/architecture.md`
31. `plugins/umbraco-analyzer/agents/code-quality.md`
32. `plugins/umbraco-analyzer/agents/security.md`
33. `plugins/umbraco-analyzer/agents/performance.md`
34. `plugins/umbraco-analyzer/agents/backoffice.md`
35. `plugins/umbraco-analyzer/agents/api.md`
36. `plugins/umbraco-analyzer/agents/dependencies.md`
37. `plugins/umbraco-analyzer/agents/conventions.md`
38. `plugins/umbraco-analyzer/commands/analyze.md`
39. `plugins/umbraco-analyzer/skills/umbraco-development/SKILL.md`
40. `plugins/umbraco-analyzer/skills/umbraco-modern-guide/SKILL.md`

**Total: 40 files**

---

## Phase 6: Testing & Validation

### Test Scenarios

**Sitecore Classic Analyzer**:
1. Run against Helix-compliant 10.4 solution → expect high compliance score
2. Run against non-Helix solution → expect ARCH violations
3. Introduce cross-Feature dependency → verify ARCH-001 triggered
4. Add hardcoded credential → verify SEC-001 triggered
5. Add Sitecore.Query in loop → verify PERF-001 triggered

**XM Cloud Analyzer**:
1. Run against JSS 22 Next.js project → expect correct detection
2. Test with NEXT_PUBLIC_ API key → verify SEC-002 triggered
3. Add N+1 GraphQL pattern → verify GQL-001 triggered
4. Test with any types → verify CQ-001 triggered
5. Use getServerSideProps on static content → verify PERF-001 triggered

**Umbraco Analyzer**:
1. Run against Umbraco 15 project → verify v15 detection and HybridCache checks
2. Run against Umbraco 14 project → verify Lit detection
3. Test with AngularJS backoffice code → verify BO-001 triggered
4. Test with public Content Delivery API → verify SEC-001 triggered
5. Add recursive content traversal → verify PERF-001 triggered

---

## Success Criteria

1. All three plugins correctly detect their respective platforms
2. Analysis completes in <60 seconds for typical projects
3. Reports are clear, actionable, and shareable
4. Skills improve Claude's code generation for CMS-specific tasks
5. No false positives on standard project templates
6. Critical issues never missed on intentionally flawed test projects

---

## Phase 7: Enhance Command - Dynamic Project-Specific Generation

### Overview

The **enhance** command dynamically generates project-specific skills, commands, and best practices based on analysis of the codebase. This improves AI-assisted development by teaching the model about the specific patterns, conventions, and architecture used in each project.

### Command Specification

**Command**: `/{plugin}:enhance [--output <path>] [--dry-run]`

- `/sitecore-classic:enhance`
- `/xm-cloud:enhance`
- `/umbraco:enhance`

**Arguments**:
- `--output <path>` - Custom output directory (default: `.claude/project-skills/`)
- `--dry-run` - Preview what would be generated without writing files
- `--include-examples` - Extract code examples from the codebase

### Generated Artifacts

#### 7.1: Project-Specific Patterns Skill

**Output File**: `.claude/project-skills/project-patterns/SKILL.md`

**Detection & Documentation**:
| Pattern Type | What to Detect | Output |
|--------------|----------------|--------|
| Service patterns | Common service base classes, interfaces | Document inheritance patterns |
| Repository patterns | Data access patterns used | Document query patterns |
| Controller patterns | Action signatures, return types | Document conventions |
| Model patterns | DTO structures, validation | Document model shapes |
| Error handling | Try/catch patterns, custom exceptions | Document error handling approach |
| Logging | Logger usage, log levels | Document logging conventions |
| Configuration | Settings patterns, options classes | Document config structure |

**Example Output Structure**:
```markdown
---
name: project-patterns
description: Patterns specific to this project's codebase
globs:
  - "**/*.cs"
  - "**/*.tsx"
---

# Project-Specific Patterns

## Service Layer Pattern
This project uses {detected pattern}:
- Base class: `BaseService<T>`
- All services implement `I{Name}Service`
- Services are registered as Scoped

## Example
{Extracted from codebase - sanitized}
```

#### 7.2: Custom Commands Generation

**Output File**: `.claude/project-skills/commands/`

**Detection Logic**:
| Project Characteristic | Generated Command |
|----------------------|-------------------|
| Build scripts in package.json/csproj | `/project:build` with correct flags |
| Test configuration | `/project:test` with framework-specific options |
| Multiple environments detected | `/project:deploy [env]` |
| Database migrations present | `/project:migrate` |
| Common refactoring needs | `/project:refactor [type]` |

**Command Template**:
```markdown
# /project:{command}

## Description
{Auto-generated description based on project context}

## When to Use
{Detected scenarios from codebase}

## Implementation
{Steps based on project structure}
```

#### 7.3: Architecture Best Practices

**Output File**: `.claude/project-skills/architecture-guide/SKILL.md`

**Generated Content**:

**For Sitecore Classic**:
```markdown
# {Project Name} Architecture Guide

## Helix Structure
This project follows {Helix | Custom} architecture:
- Foundation modules: {list detected}
- Feature modules: {list detected}
- Project modules: {list detected}

## Dependency Rules (Detected)
{Actual dependency graph from analysis}

## Adding New Features
1. Create module in {detected location}
2. Follow naming pattern: {detected pattern}
3. Register services via {detected DI approach}

## Code Examples from This Project
{Sanitized examples extracted from actual codebase}
```

**For XM Cloud**:
```markdown
# {Project Name} Architecture Guide

## Component Structure
Components organized as: {detected structure}

## Data Fetching Strategy
This project uses: {SSG | SSR | ISR | Mixed}
- Static pages: {list}
- Dynamic pages: {list}

## GraphQL Patterns
Query organization: {detected approach}
Fragment usage: {yes/no with examples}

## Adding New Components
1. Create in {detected location}
2. Follow naming: {detected pattern}
3. Register in componentFactory: {location}
```

**For Umbraco**:
```markdown
# {Project Name} Architecture Guide

## Composer Organization
Composers located in: {detected path}
Registration pattern: {detected approach}

## Content Type Patterns
Document types follow: {detected conventions}
Property naming: {detected pattern}

## API Structure
- Surface controllers: {detected location}
- API controllers: {detected location}
- Delivery API: {enabled/disabled}

## Adding New Features
1. Create composer in {path}
2. Add notification handlers in {path}
3. Follow pattern: {detected from codebase}
```

#### 7.4: Project-Specific Vocabulary

**Output File**: `.claude/project-skills/vocabulary.md`

**Detected Terms**:
- Domain-specific terminology from class/method names
- Business logic concepts from comments and naming
- Acronyms used in the project
- Custom type names and their purposes

### Enhance Command Implementation

**File**: `plugins/{plugin}/commands/enhance.md`

**Flow**:
1. Run detector to confirm platform
2. Run architecture analysis (from analyze command)
3. Pattern extraction phase:
   - Scan service classes for common patterns
   - Extract interface conventions
   - Identify naming patterns
   - Find code examples (respecting `.claudeignore`)
4. Generate skills files with extracted patterns
5. Generate custom commands based on project scripts/config
6. Create architecture guide from analysis results
7. Build vocabulary from naming patterns

**Output Report**:
```markdown
# Enhancement Complete

## Generated Skills
| File | Purpose |
|------|---------|
| .claude/project-skills/project-patterns/SKILL.md | 12 patterns documented |
| .claude/project-skills/architecture-guide/SKILL.md | Architecture overview |
| .claude/project-skills/vocabulary.md | 45 project terms |

## Generated Commands
| Command | Description |
|---------|-------------|
| /project:build | Build with detected configuration |
| /project:test | Run tests with coverage |
| /project:new-feature | Scaffold new feature module |

## AI Enhancement Impact
- Pattern recognition: +85% (12 patterns learned)
- Code generation accuracy: +40% (architecture understood)
- Command efficiency: +60% (5 custom commands)

## Next Steps
1. Review generated files in `.claude/project-skills/`
2. Commit to repository for team use
3. Customize generated skills as needed
```

### File Additions per Plugin

Each plugin adds:
- `commands/enhance.md` - The enhance command
- `agents/pattern-extractor.md` - Pattern detection agent
- `agents/skill-generator.md` - Skill file generation agent

**Updated File Count**: 40 + 9 = **49 files total**

---

## Phase 8: Security & Privacy - Safe Installation

### Overview

Clients can install and use these analyzers without exposing sensitive code to AI analysis. This section defines the security model and configuration options.

### 8.1: .claudeignore Configuration

**File**: `.claudeignore` (created in project root during setup)

The analyzer respects `.claudeignore` patterns, similar to `.gitignore`:

```gitignore
# Sensitive Configuration
**/appsettings.*.json
**/appsettings.Production.json
**/web.config
**/connectionstrings.config
**/*.secrets.json

# Environment Files
**/.env
**/.env.*
!**/.env.example

# Credentials & Keys
**/credentials/
**/secrets/
**/*.pfx
**/*.p12
**/*.key
**/*.pem

# Database
**/migrations/
**/seeds/
**/*.sql

# User Data & Logs
**/logs/
**/data/
**/uploads/
**/userdata/

# Third-Party Code (reduce noise)
**/node_modules/
**/packages/
**/bin/
**/obj/
**/vendor/

# Serialized Content (may contain sensitive data)
**/serialization/**/*.yml
**/serialization/**/*.yaml
!**/serialization/**/*.module.json  # Module config is safe

# Build Artifacts
**/dist/
**/build/
**/.next/
```

### 8.2: Safe Analysis Mode

**Command Flag**: `--safe-mode`

```bash
/sitecore-classic:analyze --safe-mode
/xm-cloud:analyze --safe-mode
/umbraco:analyze --safe-mode
```

**Safe Mode Behavior**:
| Analysis Type | Full Mode | Safe Mode |
|---------------|-----------|-----------|
| Architecture structure | ✓ | ✓ |
| Dependency graph | ✓ | ✓ |
| File patterns | ✓ | ✓ |
| Code content scanning | ✓ | ✗ |
| Config file analysis | ✓ | ✗ |
| Connection string checks | ✓ | ✗ |
| API key detection | ✓ | ✗ |

Safe mode analyzes **structure** without reading **content** of potentially sensitive files.

### 8.3: Pre-Installation Security Scan

**Command**: `/{plugin}:security-scan`

Run before full analysis to identify what files would be scanned:

```markdown
# Security Scan Report

## Files That Will Be Analyzed
- 145 .cs files
- 67 .cshtml files
- 12 .config files
- 8 .json files

## Potentially Sensitive Files Detected
| File | Risk | Recommendation |
|------|------|----------------|
| appsettings.Production.json | High | Add to .claudeignore |
| ConnectionStrings.config | Critical | Add to .claudeignore |
| src/secrets/api-keys.cs | Critical | Add to .claudeignore |

## Recommended .claudeignore Additions
```
appsettings.Production.json
ConnectionStrings.config
src/secrets/
```

## Run Analysis?
After reviewing, run: `/sitecore-classic:analyze --safe-mode`
Or configure .claudeignore and run: `/sitecore-classic:analyze`
```

### 8.4: Content Redaction in Reports

Reports automatically redact sensitive patterns:

**Before Redaction**:
```
Connection string: Server=prod-db.internal;Password=SecretPass123
```

**After Redaction**:
```
Connection string: Server=****;Password=****
```

**Redaction Patterns**:
- Passwords, secrets, keys
- Connection strings (values only)
- API keys and tokens
- URLs with credentials
- Email addresses (optional)
- IP addresses (optional)

### 8.5: Installation Workflow for Security-Conscious Teams

**Step 1: Initial Setup (No Code Scanning)**
```bash
# Install plugin - no analysis yet
claude install cms-analyzers/sitecore-classic-analyzer
```

**Step 2: Configure Exclusions**
```bash
# Generate recommended .claudeignore
/sitecore-classic:setup --generate-ignore
```

**Step 3: Security Scan (Preview)**
```bash
# See what would be analyzed
/sitecore-classic:security-scan
```

**Step 4: Safe Analysis**
```bash
# Run with structure-only analysis
/sitecore-classic:analyze --safe-mode
```

**Step 5: Full Analysis (After Review)**
```bash
# Run full analysis with .claudeignore in place
/sitecore-classic:analyze
```

### 8.6: Enterprise Configuration

**File**: `.claude/analyzer-config.json`

```json
{
  "security": {
    "mode": "safe",
    "redactPatterns": true,
    "excludePaths": [
      "**/secrets/**",
      "**/credentials/**"
    ],
    "excludeFileTypes": [
      ".env",
      ".pfx",
      ".key"
    ],
    "maxFileSizeKb": 100,
    "scanDepth": 5
  },
  "analysis": {
    "skipSecurityAgent": false,
    "skipPerformanceAgent": false,
    "customIgnoreFile": ".claudeignore.enterprise"
  },
  "enhance": {
    "extractExamples": false,
    "includeInternalNames": false,
    "sanitizeOutput": true
  }
}
```

### 8.7: Audit Logging

**File**: `.claude/analyzer-audit.log`

Track what was analyzed for compliance:

```
[2024-01-15T10:30:00Z] SCAN_START sitecore-classic-analyzer v1.0.0
[2024-01-15T10:30:01Z] CONFIG_LOADED .claudeignore (45 patterns)
[2024-01-15T10:30:01Z] EXCLUDED 23 files matching .claudeignore
[2024-01-15T10:30:02Z] ANALYZED 145 files (structure only - safe mode)
[2024-01-15T10:30:15Z] SCAN_COMPLETE 0 sensitive patterns exposed
[2024-01-15T10:30:15Z] REPORT_GENERATED (redaction applied)
```

### 8.8: Files Added for Security

Each plugin adds:
- `commands/security-scan.md` - Pre-analysis security scan
- `commands/setup.md` - Initial setup with ignore generation
- `templates/.claudeignore.template` - Default exclusion patterns

**Updated File Count**: 49 + 9 = **58 files total**

---

## Phase 9: Updated Directory Structure

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── README.md
├── plugins/
│   ├── sitecore-classic-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── README.md
│   │   ├── commands/
│   │   │   ├── analyze.md
│   │   │   ├── enhance.md          # NEW
│   │   │   ├── security-scan.md    # NEW
│   │   │   └── setup.md            # NEW
│   │   ├── agents/
│   │   │   ├── detector.md
│   │   │   ├── architecture.md
│   │   │   ├── code-quality.md
│   │   │   ├── security.md
│   │   │   ├── performance.md
│   │   │   ├── serialization.md
│   │   │   ├── dependencies.md
│   │   │   ├── conventions.md
│   │   │   ├── pattern-extractor.md  # NEW
│   │   │   └── skill-generator.md    # NEW
│   │   ├── skills/
│   │   │   └── sitecore-classic/
│   │   │       └── SKILL.md
│   │   └── templates/                # NEW
│   │       └── .claudeignore.template
│   ├── xm-cloud-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── README.md
│   │   ├── commands/
│   │   │   ├── analyze.md
│   │   │   ├── enhance.md          # NEW
│   │   │   ├── security-scan.md    # NEW
│   │   │   └── setup.md            # NEW
│   │   ├── agents/
│   │   │   ├── detector.md
│   │   │   ├── architecture.md
│   │   │   ├── code-quality.md
│   │   │   ├── security.md
│   │   │   ├── performance.md
│   │   │   ├── graphql.md
│   │   │   ├── dependencies.md
│   │   │   ├── conventions.md
│   │   │   ├── pattern-extractor.md  # NEW
│   │   │   └── skill-generator.md    # NEW
│   │   ├── skills/
│   │   │   └── xm-cloud/
│   │   │       └── SKILL.md
│   │   └── templates/                # NEW
│   │       └── .claudeignore.template
│   └── umbraco-analyzer/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── README.md
│       ├── commands/
│       │   ├── analyze.md
│       │   ├── enhance.md          # NEW
│       │   ├── security-scan.md    # NEW
│       │   └── setup.md            # NEW
│       ├── agents/
│       │   ├── detector.md
│       │   ├── architecture.md
│       │   ├── code-quality.md
│       │   ├── security.md
│       │   ├── performance.md
│       │   ├── backoffice.md
│       │   ├── api.md
│       │   ├── dependencies.md
│       │   ├── conventions.md
│       │   ├── pattern-extractor.md  # NEW
│       │   └── skill-generator.md    # NEW
│       ├── skills/
│       │   ├── umbraco-development/
│       │   │   └── SKILL.md
│       │   └── umbraco-modern-guide/
│       │       └── SKILL.md
│       └── templates/                # NEW
│           └── .claudeignore.template
```

**Final Total: 58 files**

---

## Phase 10: Updated Implementation Order

### New Files to Create

**Phase 7 - Enhance Command (9 files)**:
41. `plugins/sitecore-classic-analyzer/commands/enhance.md`
42. `plugins/sitecore-classic-analyzer/agents/pattern-extractor.md`
43. `plugins/sitecore-classic-analyzer/agents/skill-generator.md`
44. `plugins/xm-cloud-analyzer/commands/enhance.md`
45. `plugins/xm-cloud-analyzer/agents/pattern-extractor.md`
46. `plugins/xm-cloud-analyzer/agents/skill-generator.md`
47. `plugins/umbraco-analyzer/commands/enhance.md`
48. `plugins/umbraco-analyzer/agents/pattern-extractor.md`
49. `plugins/umbraco-analyzer/agents/skill-generator.md`

**Phase 8 - Security (9 files)**:
50. `plugins/sitecore-classic-analyzer/commands/security-scan.md`
51. `plugins/sitecore-classic-analyzer/commands/setup.md`
52. `plugins/sitecore-classic-analyzer/templates/.claudeignore.template`
53. `plugins/xm-cloud-analyzer/commands/security-scan.md`
54. `plugins/xm-cloud-analyzer/commands/setup.md`
55. `plugins/xm-cloud-analyzer/templates/.claudeignore.template`
56. `plugins/umbraco-analyzer/commands/security-scan.md`
57. `plugins/umbraco-analyzer/commands/setup.md`
58. `plugins/umbraco-analyzer/templates/.claudeignore.template`

---

## Updated Success Criteria

7. Enhance command generates accurate project-specific skills
8. Generated skills improve AI code generation by measurable margin
9. Safe mode allows structural analysis without content exposure
10. .claudeignore patterns prevent sensitive file scanning
11. Security scan identifies all potentially sensitive files before analysis
12. Audit logging provides compliance trail for enterprise deployments
