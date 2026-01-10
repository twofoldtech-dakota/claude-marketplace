# Enhanced CMS Analyzer Marketplace Plan

## Overview

Build two Claude Code marketplace plugins for enterprise CMS analysis that your team will actually use:
- **sitecore-analyzer**: For Sitecore 10.4 and XM Cloud
- **umbraco-analyzer**: For Umbraco 14-16 (.NET 8/9/10)

Both plugins provide comprehensive analysis with **actionable reports**, **severity ratings**, and **shareable metrics** designed for PR reviews, onboarding, and CI/CD integration.

---

## Value Proposition

### Why Your Coworkers Will Use This

| Pain Point | How This Solves It |
|------------|-------------------|
| "Is this PR Helix compliant?" | Run `/sitecore:analyze architecture` before merge |
| "Why does deployment keep failing?" | Serialization agent catches SCS/Unicorn conflicts |
| "How do I build a v14 property editor?" | Skills + Backoffice agent show patterns |
| "Is our API secure?" | Security agent checks auth, CORS, exposed endpoints |
| "What patterns does this codebase use?" | Skills files document conventions automatically |
| "Why is this page slow?" | Performance agent analyzes caching, queries, indexing |

### Why This Gets You Promoted

1. **Quantifiable**: "Found 12 Critical issues, improved Helix compliance from 67% to 94%"
2. **Visible**: Reports can be shared with leadership and shown in team meetings
3. **Scalable**: CI/CD integration means it keeps working without you
4. **Extensible**: Team can add custom rules, you become the platform owner

---

## Directory Structure

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── README.md                              # Marketplace overview, installation
├── plugins/
│   ├── sitecore-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── README.md                      # Value prop, usage, example output
│   │   ├── commands/
│   │   │   └── analyze.md                 # Main orchestrator command
│   │   ├── agents/
│   │   │   ├── detector.md                # Version/module detection
│   │   │   ├── architecture.md            # Helix compliance
│   │   │   ├── code-quality.md            # C# patterns, DI, processors
│   │   │   ├── security.md                # Auth, XSS, credentials
│   │   │   ├── performance.md             # Caching, indexing, queries
│   │   │   ├── dependencies.md            # NuGet analysis
│   │   │   ├── serialization.md           # SCS/Unicorn/TDS
│   │   │   ├── api.md                     # GraphQL/REST/Content API
│   │   │   └── conventions.md             # Naming, folder structure
│   │   └── skills/
│   │       ├── sitecore-development/
│   │       │   └── SKILL.md
│   │       └── xm-cloud-guide/
│   │           └── SKILL.md
│   └── umbraco-analyzer/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── README.md
│       ├── commands/
│       │   └── analyze.md
│       ├── agents/
│       │   ├── detector.md
│       │   ├── architecture.md            # Project structure, Composers
│       │   ├── code-quality.md            # Controllers, converters, services
│       │   ├── security.md                # API auth, backoffice protection
│       │   ├── performance.md             # HybridCache, content access
│       │   ├── dependencies.md            # Package compatibility
│       │   ├── backoffice.md              # Lit/TypeScript components (v14+)
│       │   ├── api.md                     # Content Delivery/Management API
│       │   └── conventions.md             # Document types, aliases, templates
│       └── skills/
│           ├── umbraco-development/
│           │   └── SKILL.md
│           └── umbraco-modern-guide/
│               └── SKILL.md
```

**Total: 9 agents per CMS** (balanced thoroughness vs speed)

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
      "name": "sitecore-analyzer",
      "source": "./plugins/sitecore-analyzer",
      "description": "Sitecore 10.4 and XM Cloud analyzer with Helix compliance, serialization, and security checks",
      "category": "cms",
      "tags": ["sitecore", "helix", "dotnet", "xm-cloud", "jss"]
    },
    {
      "name": "umbraco-analyzer",
      "source": "./plugins/umbraco-analyzer",
      "description": "Umbraco 14-16 analyzer with backoffice, Content Delivery API, and architecture checks",
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
- Quick start (install in <2 minutes)
- Links to each plugin README
- CI/CD integration guide
- Contributing guidelines

---

## Phase 2: Sitecore Analyzer Plugin

### Step 2.1: Plugin Configuration

**File**: `plugins/sitecore-analyzer/.claude-plugin/plugin.json`

```json
{
  "name": "sitecore-analyzer",
  "version": "1.0.0",
  "description": "Analyze Sitecore 10.4 and XM Cloud projects for architecture, security, and performance issues",
  "commands": ["commands/analyze.md"],
  "agents": [
    "agents/detector.md",
    "agents/architecture.md",
    "agents/code-quality.md",
    "agents/security.md",
    "agents/performance.md",
    "agents/dependencies.md",
    "agents/serialization.md",
    "agents/api.md",
    "agents/conventions.md"
  ],
  "skills": [
    "skills/sitecore-development",
    "skills/xm-cloud-guide"
  ]
}
```

### Step 2.2: Plugin README.md

**File**: `plugins/sitecore-analyzer/README.md`

Contents:
- What problems this solves
- Installation: `claude mcp add /path/to/marketplace`
- Usage: `/sitecore:analyze [agent]` or `/sitecore:analyze all`
- Example output with severity ratings
- Agent descriptions
- Skills file explanations
- Troubleshooting

### Step 2.3: Detection Logic (Detector Agent)

**File**: `plugins/sitecore-analyzer/agents/detector.md`

**Primary Indicators** (High Confidence):
- `sitecore.json` - Sitecore CLI configuration
- `*.module.json` - Sitecore module definitions
- `/App_Config/Include/*.config` - Config patches
- `layers.config` - Helix layer configuration
- `.csproj` with `Sitecore.*` package references

**XM Cloud Indicators**:
- `xmcloud.build.json`
- `package.json` with `@sitecore-jss/*` dependencies
- `/src/rendering/` or `/src/nextjs/` directories
- GraphQL schema files

**Output Format**:
```yaml
detection:
  cms: Sitecore
  version: "10.4" | "XM Cloud"
  architecture: "Helix" | "Traditional" | "Headless"
  modules:
    - SXA
    - JSS
    - Commerce
  serialization: "SCS" | "Unicorn" | "TDS" | "Mixed"
```

### Step 2.4: Main Command

**File**: `plugins/sitecore-analyzer/commands/analyze.md`

**Command Flow**:
1. Run detector agent to identify Sitecore type and version
2. Based on argument (or "all"), invoke relevant agents
3. Each agent returns findings with severity ratings
4. Aggregate into consolidated report with metrics

**Arguments**:
- `all` - Run all agents (default)
- `architecture` - Helix compliance only
- `security` - Security checks only
- `performance` - Performance analysis only
- `serialization` - Serialization config only
- `api` - API patterns only
- `quality` - Code quality only
- `dependencies` - NuGet analysis only
- `conventions` - Naming/structure only

**Report Output Format**:
```markdown
# Sitecore Analysis Report

## Summary
- **Project**: Helix-compliant Sitecore 10.4
- **Issues Found**: 12 (3 Critical, 5 Warning, 4 Info)
- **Helix Compliance**: 87%
- **Security Score**: B+

## Critical Issues
### [ARCH-001] Cross-Feature Dependency Detected
**Severity**: Critical
**Location**: `src/Feature/Navigation/code/Feature.Navigation.csproj:24`
**Issue**: Feature.Navigation references Feature.Search directly
**Fix**: Extract shared logic to Foundation layer

## Warnings
...

## Info
...
```

### Step 2.5: Agent Specifications

#### Architecture Agent
**File**: `plugins/sitecore-analyzer/agents/architecture.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Helix three-layer structure (Foundation, Feature, Project)
- Layer naming conventions: `{Layer}.{Module}`
- Dependency direction validation via `.csproj` ProjectReferences
- `/App_Config/Include/` organization by layer
- Solution folder structure

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| ARCH-001 | Critical | Cross-Feature dependency (Feature A → Feature B) |
| ARCH-002 | Critical | Upward dependency (Foundation → Feature/Project) |
| ARCH-003 | Warning | God module (>15 classes in single module) |
| ARCH-004 | Warning | Misplaced serialization items |
| ARCH-005 | Info | Non-standard naming pattern |

#### Security Agent
**File**: `plugins/sitecore-analyzer/agents/security.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Authentication configuration (Forms, Identity, Federated)
- API key exposure in config/code
- CORS configuration
- GraphQL introspection settings
- Hardcoded credentials
- XSS vectors in renderings
- CSRF token usage

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SEC-001 | Critical | Hardcoded credentials in config |
| SEC-002 | Critical | GraphQL introspection enabled in production |
| SEC-003 | Critical | API key in source code |
| SEC-004 | Warning | Overly permissive CORS |
| SEC-005 | Warning | Missing anti-forgery tokens |
| SEC-006 | Info | Admin paths not restricted |

#### Serialization Agent
**File**: `plugins/sitecore-analyzer/agents/serialization.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Detect primary format (SCS YAML, Unicorn, TDS)
- Analyze `*.module.json` include/exclude patterns
- Check for overlapping includes across modules
- Verify template organization matches Helix layers
- Identify environment-specific items in serialization
- Check for sensitive data (API keys, connection strings)

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SER-001 | Critical | Mixed serialization formats (SCS + Unicorn) |
| SER-002 | Critical | Sensitive data in serialized items |
| SER-003 | Warning | Overlapping include paths |
| SER-004 | Warning | Items serialized in wrong layer |
| SER-005 | Info | Missing language versions |

#### Performance Agent
**File**: `plugins/sitecore-analyzer/agents/performance.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- HTML cache configuration per rendering
- Data cache usage patterns
- Sitecore query vs Content Search usage
- Solr index configuration
- Media library optimization
- Pipeline processor efficiency

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| PERF-001 | Critical | Sitecore.Query in loop |
| PERF-002 | Warning | Rendering without cache settings |
| PERF-003 | Warning | Missing Solr computed fields |
| PERF-004 | Warning | Unbounded GetDescendants() call |
| PERF-005 | Info | Custom cache not implemented |

#### API Agent
**File**: `plugins/sitecore-analyzer/agents/api.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- GraphQL schema and resolver patterns
- REST API controller implementations
- Layout Service configuration
- Edge delivery patterns (XM Cloud)
- API versioning
- Error handling patterns

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| API-001 | Critical | N+1 query in GraphQL resolver |
| API-002 | Warning | Missing API versioning |
| API-003 | Warning | Inconsistent error response format |
| API-004 | Info | GraphQL query not using fragments |

#### Code Quality Agent
**File**: `plugins/sitecore-analyzer/agents/code-quality.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Controller rendering patterns
- Dependency injection usage
- Pipeline processor implementation
- Glass Mapper / Synthesis usage
- Repository pattern implementation

#### Dependencies Agent
**File**: `plugins/sitecore-analyzer/agents/dependencies.md`
**Tools**: `Read, Glob, Grep, Bash`

**Analysis Areas**:
- NuGet package versions vs Sitecore version compatibility
- Deprecated packages
- Security vulnerabilities (via `dotnet list package --vulnerable`)
- Version conflicts across projects

#### Conventions Agent
**File**: `plugins/sitecore-analyzer/agents/conventions.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Naming patterns: templates, fields, renderings
- Folder structure conventions
- Template inheritance patterns
- Rendering parameter conventions
- Branch template usage

### Step 2.6: Skills Files

#### sitecore-development SKILL.md
**File**: `plugins/sitecore-analyzer/skills/sitecore-development/SKILL.md`

```markdown
---
name: sitecore-development
description: Apply when working with Sitecore 10.x projects, Helix architecture, or Sitecore APIs
globs:
  - "**/*.cshtml"
  - "**/App_Config/**/*.config"
  - "**/*.module.json"
---

# Sitecore Development Patterns

## Helix Architecture
- **Foundation**: Shared functionality (logging, serialization, DI)
- **Feature**: Business features (Navigation, Search, Forms)
- **Project**: Site-specific (branding, layout, content)

Dependency rule: Project → Feature → Foundation (never reverse)

## Dependency Injection Pattern
```csharp
public class RegisterDependencies : IServicesConfigurator
{
    public void Configure(IServiceCollection services)
    {
        services.AddTransient<IMyService, MyService>();
    }
}
```

## Configuration Patching
```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <settings>
      <setting name="MySetting" value="MyValue" />
    </settings>
  </sitecore>
</configuration>
```

## Content Access (Avoid Sitecore.Query)
```csharp
// Good: Use Content Search
using (var context = index.CreateSearchContext())
{
    var results = context.GetQueryable<SearchResultItem>()
        .Where(x => x.TemplateId == templateId)
        .ToList();
}

// Bad: Sitecore Query (slow)
var items = rootItem.Axes.SelectItems(".//*[@@templateid='{...}']");
```

## Caching Pattern
```csharp
[Cacheable]
public class MyRendering : Controller
{
    [OutputCache(Duration = 3600, VaryByParam = "*")]
    public ActionResult Index()
    {
        // Rendering logic
    }
}
```
```

#### xm-cloud-guide SKILL.md
**File**: `plugins/sitecore-analyzer/skills/xm-cloud-guide/SKILL.md`

```markdown
---
name: xm-cloud-guide
description: Apply when working with Sitecore XM Cloud, JSS, Next.js rendering host, or Edge delivery
globs:
  - "**/src/rendering/**/*"
  - "**/xmcloud.build.json"
  - "**/@sitecore-jss/**"
---

# XM Cloud Development Patterns

## Architecture Overview
- **XM Cloud**: Content management (headless)
- **Edge**: Content delivery CDN
- **Rendering Host**: Next.js application

## JSS Component Pattern
```tsx
import { Text, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

type MyComponentProps = {
  fields: {
    heading: Field<string>;
    body: Field<string>;
  };
};

const MyComponent = ({ fields }: MyComponentProps): JSX.Element => (
  <div>
    <Text field={fields.heading} tag="h2" />
    <Text field={fields.body} tag="p" />
  </div>
);

export default withDatasourceCheck()<MyComponentProps>(MyComponent);
```

## GraphQL Query Pattern
```graphql
query GetNavigation($language: String!, $rootPath: String!) {
  search(
    where: {
      AND: [
        { name: "_path", value: $rootPath, operator: CONTAINS }
        { name: "_language", value: $language }
        { name: "_templatename", value: "Navigation Item" }
      ]
    }
  ) {
    results {
      ... on NavigationItem {
        title { value }
        url { path }
      }
    }
  }
}
```

## Placeholder Pattern
```tsx
import { Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';

const Layout = ({ rendering }) => (
  <main>
    <Placeholder name="main-content" rendering={rendering} />
  </main>
);
```

## Environment Configuration
```javascript
// next.config.js
const jssConfig = {
  sitecoreApiKey: process.env.SITECORE_API_KEY,
  sitecoreApiHost: process.env.SITECORE_API_HOST,
  graphQLEndpoint: process.env.GRAPH_QL_ENDPOINT,
};
```
```

---

## Phase 3: Umbraco Analyzer Plugin

### Step 3.1: Plugin Configuration

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
    "agents/dependencies.md",
    "agents/backoffice.md",
    "agents/api.md",
    "agents/conventions.md"
  ],
  "skills": [
    "skills/umbraco-development",
    "skills/umbraco-modern-guide"
  ]
}
```

### Step 3.2: Plugin README.md

**File**: `plugins/umbraco-analyzer/README.md`

Contents:
- What problems this solves
- Installation instructions
- Usage examples
- Example output
- Version-specific notes (v14 vs v15 vs v16)
- Agent descriptions
- Troubleshooting

### Step 3.3: Detection Logic (Detector Agent)

**File**: `plugins/umbraco-analyzer/agents/detector.md`

**Primary Indicators** (High Confidence):
- `appsettings.json` with `"Umbraco"` section
- `.csproj` with `Umbraco.Cms` package reference
- `/App_Plugins/` directory
- `Program.cs` with `.AddUmbraco()` call

**Version Detection**:
- Umbraco 14.x → .NET 8, Lit backoffice
- Umbraco 15.x → .NET 9, HybridCache
- Umbraco 16.x → .NET 9/10, TipTap only

**Output Format**:
```yaml
detection:
  cms: Umbraco
  version: "14.3" | "15.1" | "16.0"
  dotnet: "8.0" | "9.0" | "10.0"
  backoffice: "Lit" | "AngularJS (legacy)"
  features:
    - Content Delivery API
    - Block Grid
    - Custom Property Editors
```

### Step 3.4: Main Command

**File**: `plugins/umbraco-analyzer/commands/analyze.md`

Same flow as Sitecore with Umbraco-specific agents.

**Report Output Format**:
```markdown
# Umbraco Analysis Report

## Summary
- **Project**: Umbraco 15.1 on .NET 9
- **Issues Found**: 8 (1 Critical, 4 Warning, 3 Info)
- **Architecture Score**: A-
- **Security Score**: B

## Critical Issues
### [SEC-001] Content Delivery API Publicly Accessible
**Severity**: Critical
**Location**: `appsettings.json:42`
**Issue**: Content Delivery API has no API key requirement
**Fix**: Add `PublicAccess` restriction or require API key

## Warnings
...
```

### Step 3.5: Agent Specifications

#### Detector Agent
**File**: `plugins/umbraco-analyzer/agents/detector.md`
**Tools**: `Read, Glob, Grep`

(See detection logic above)

#### Architecture Agent
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

#### Security Agent
**File**: `plugins/umbraco-analyzer/agents/security.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Content Delivery API authentication
- Management API protection
- Backoffice access restrictions
- CORS configuration
- Member authentication setup

**Issues to Detect**:
| Code | Severity | Issue |
|------|----------|-------|
| SEC-001 | Critical | Content Delivery API publicly accessible |
| SEC-002 | Critical | Hardcoded credentials |
| SEC-003 | Warning | Backoffice accessible from public IP |
| SEC-004 | Warning | Missing rate limiting |
| SEC-005 | Info | Default admin path not changed |

#### Backoffice Agent (v14+)
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
| BO-004 | Warning | Untyped TypeScript (any) |
| BO-005 | Info | Not using Umbraco UI Library components |

#### Performance Agent
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
| PERF-002 | Warning | Not using HybridCache (v15+) |
| PERF-003 | Warning | IUmbracoContext in singleton |
| PERF-004 | Warning | Missing image processor cache |
| PERF-005 | Info | Examine index not optimized |

#### API Agent
**File**: `plugins/umbraco-analyzer/agents/api.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Content Delivery API configuration
- Management API usage
- Custom API controllers (Surface, API)
- Error handling patterns
- Response caching

#### Code Quality Agent
**File**: `plugins/umbraco-analyzer/agents/code-quality.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Surface controller patterns
- Property value converters
- Notification handlers
- Service layer patterns

#### Dependencies Agent
**File**: `plugins/umbraco-analyzer/agents/dependencies.md`
**Tools**: `Read, Glob, Grep, Bash`

**Analysis Areas**:
- Package compatibility with Umbraco version
- Deprecated packages
- Upgrade path blockers

#### Conventions Agent
**File**: `plugins/umbraco-analyzer/agents/conventions.md`
**Tools**: `Read, Glob, Grep`

**Analysis Areas**:
- Document type naming (PascalCase)
- Property alias conventions (camelCase)
- Template naming
- Partial view organization
- App_Plugins structure

### Step 3.6: Skills Files

#### umbraco-development SKILL.md
**File**: `plugins/umbraco-analyzer/skills/umbraco-development/SKILL.md`

```markdown
---
name: umbraco-development
description: Apply when working with Umbraco CMS, Composers, services, or content APIs
globs:
  - "**/Composers/**/*.cs"
  - "**/Controllers/**/*.cs"
  - "**/App_Plugins/**/*"
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

    public IPublishedContent GetContent(Guid key)
    {
        return _contentQuery.Content(key);
    }
}
```

## Surface Controller Pattern
```csharp
public class MyFormController : SurfaceController
{
    public MyFormController(
        IUmbracoContextAccessor umbracoContextAccessor,
        IUmbracoDatabaseFactory databaseFactory,
        ServiceContext services,
        AppCaches appCaches,
        IProfilingLogger profilingLogger,
        IPublishedUrlProvider publishedUrlProvider)
        : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
    {
    }

    [HttpPost]
    public IActionResult HandleSubmit(MyFormModel model)
    {
        if (!ModelState.IsValid)
            return CurrentUmbracoPage();

        // Process form
        return RedirectToCurrentUmbracoPage();
    }
}
```
```

#### umbraco-modern-guide SKILL.md
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

## Content Delivery API Query
```bash
GET /umbraco/delivery/api/v2/content?filter=contentType:blogPost&sort=createDate:desc
Authorization: Api-Key your-secure-api-key
```

## Version-Specific Notes

### Umbraco 14 (.NET 8)
- New Lit-based backoffice
- AngularJS deprecated
- Block Grid replaces Block List for complex layouts

### Umbraco 15 (.NET 9)
- HybridCache for improved caching
- IPublishedContentCache changes
- Performance improvements

### Umbraco 16 (.NET 9/10)
- TipTap replaces TinyMCE completely
- Document Type Inheritance improvements
- Management API v2
```

---

## Phase 4: Documentation

### Root README.md

**File**: `README.md`

```markdown
# CMS Analyzers Marketplace

Claude Code plugins for analyzing enterprise CMS platforms.

## Quick Start

1. Install the marketplace:
   ```bash
   claude mcp add /path/to/marketplace
   ```

2. Run analysis:
   ```bash
   # For Sitecore projects
   /sitecore:analyze

   # For Umbraco projects
   /umbraco:analyze
   ```

## Available Plugins

| Plugin | CMS Versions | Key Features |
|--------|--------------|--------------|
| [sitecore-analyzer](./plugins/sitecore-analyzer/) | 10.4, XM Cloud | Helix compliance, serialization, JSS patterns |
| [umbraco-analyzer](./plugins/umbraco-analyzer/) | 14, 15, 16 | Backoffice (Lit), Content Delivery API, Composers |

## CI/CD Integration

Add to your PR pipeline:
```yaml
- name: CMS Analysis
  run: |
    claude /sitecore:analyze all --output report.md
    # Fail if critical issues found
    grep -q "Critical" report.md && exit 1 || exit 0
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding new agents or rules.
```

---

## Phase 5: Implementation Order

### File Creation Sequence

1. `.claude-plugin/marketplace.json`
2. `README.md` (root)
3. `plugins/sitecore-analyzer/.claude-plugin/plugin.json`
4. `plugins/sitecore-analyzer/README.md`
5. `plugins/sitecore-analyzer/agents/detector.md`
6. `plugins/sitecore-analyzer/agents/architecture.md`
7. `plugins/sitecore-analyzer/agents/security.md`
8. `plugins/sitecore-analyzer/agents/serialization.md`
9. `plugins/sitecore-analyzer/agents/performance.md`
10. `plugins/sitecore-analyzer/agents/api.md`
11. `plugins/sitecore-analyzer/agents/code-quality.md`
12. `plugins/sitecore-analyzer/agents/dependencies.md`
13. `plugins/sitecore-analyzer/agents/conventions.md`
14. `plugins/sitecore-analyzer/commands/analyze.md`
15. `plugins/sitecore-analyzer/skills/sitecore-development/SKILL.md`
16. `plugins/sitecore-analyzer/skills/xm-cloud-guide/SKILL.md`
17. `plugins/umbraco-analyzer/.claude-plugin/plugin.json`
18. `plugins/umbraco-analyzer/README.md`
19. `plugins/umbraco-analyzer/agents/detector.md`
20. `plugins/umbraco-analyzer/agents/architecture.md`
21. `plugins/umbraco-analyzer/agents/security.md`
22. `plugins/umbraco-analyzer/agents/backoffice.md`
23. `plugins/umbraco-analyzer/agents/performance.md`
24. `plugins/umbraco-analyzer/agents/api.md`
25. `plugins/umbraco-analyzer/agents/code-quality.md`
26. `plugins/umbraco-analyzer/agents/dependencies.md`
27. `plugins/umbraco-analyzer/agents/conventions.md`
28. `plugins/umbraco-analyzer/commands/analyze.md`
29. `plugins/umbraco-analyzer/skills/umbraco-development/SKILL.md`
30. `plugins/umbraco-analyzer/skills/umbraco-modern-guide/SKILL.md`

**Total: 30 files**

---

## Phase 6: Testing & Validation

### Test Scenarios

**Sitecore Plugin**:
1. Run against Helix-compliant solution → expect high compliance score
2. Run against legacy non-Helix solution → expect ARCH violations
3. Run against XM Cloud/JSS project → expect correct detection
4. Introduce known Helix violation → verify detection
5. Add hardcoded credential → verify SEC-001 triggered

**Umbraco Plugin**:
1. Run against Umbraco 14 project → verify Lit detection
2. Run against Umbraco 15 project → verify HybridCache checks
3. Test with AngularJS backoffice code → verify BO-001 triggered
4. Test with public Content Delivery API → verify SEC-001 triggered

### Metrics to Track (For Your Promotion)

- Issues found per analysis run
- Adoption rate (how many team members use it)
- Issues caught before PR merge
- Time saved in code reviews
- Helix/architecture compliance improvement over time

---

## Success Criteria

1. Both plugins correctly detect their respective CMS platforms
2. Analysis completes in <60 seconds for typical projects
3. Reports are clear, actionable, and shareable
4. Skills improve Claude's code generation for CMS-specific tasks
5. Team adoption reaches >50% within first month
6. At least 3 critical issues caught before production in first quarter
