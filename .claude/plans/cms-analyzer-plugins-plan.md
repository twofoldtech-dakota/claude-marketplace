# Implementation Plan: Sitecore and Umbraco Claude Code Marketplace Plugins

## Overview

Build two separate Claude Code marketplace plugins for enterprise CMS analysis and skill generation:
- **sitecore-analyzer**: For Sitecore 10.4 and XM Cloud
- **umbraco-analyzer**: For Umbraco 14-16 (.NET 8/9/10)

Both plugins will provide full-suite analysis (architecture, code quality, security, performance, dependencies) and generate comprehensive development guide skills.

---

## Directory Structure

```
D:/github/claude/marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── sitecore-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── analyze.md
│   │   ├── agents/
│   │   │   ├── architecture.md
│   │   │   ├── code-quality.md
│   │   │   ├── security.md
│   │   │   ├── performance.md
│   │   │   ├── dependencies.md
│   │   │   └── serialization.md
│   │   └── skills/
│   │       ├── sitecore-development/
│   │       │   └── SKILL.md
│   │       └── xm-cloud-guide/
│   │           └── SKILL.md
│   └── umbraco-analyzer/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   └── analyze.md
│       ├── agents/
│       │   ├── architecture.md
│       │   ├── code-quality.md
│       │   ├── security.md
│       │   ├── performance.md
│       │   ├── dependencies.md
│       │   └── backoffice.md
│       └── skills/
│           ├── umbraco-development/
│           │   └── SKILL.md
│           └── umbraco-modern-guide/
│               └── SKILL.md
```

---

## Phase 1: Marketplace Foundation

### Step 1.1: Create marketplace.json
**File**: `D:/github/claude/marketplace/.claude-plugin/marketplace.json`

```json
{
  "name": "cms-analyzers-marketplace",
  "version": "1.0.0",
  "description": "Claude Code plugins for analyzing enterprise CMS platforms",
  "plugins": [
    {
      "name": "sitecore-analyzer",
      "source": "./plugins/sitecore-analyzer",
      "description": "Sitecore CMS analyzer for 10.4 and XM Cloud",
      "category": "cms",
      "tags": ["sitecore", "helix", "dotnet", "xm-cloud"]
    },
    {
      "name": "umbraco-analyzer",
      "source": "./plugins/umbraco-analyzer",
      "description": "Umbraco CMS analyzer for v14-16",
      "category": "cms",
      "tags": ["umbraco", "dotnet", "aspnet-core"]
    }
  ]
}
```

---

## Phase 2: Sitecore Analyzer Plugin

### Step 2.1: Plugin Configuration
**File**: `plugins/sitecore-analyzer/.claude-plugin/plugin.json`

Define plugin metadata with:
- Name: "sitecore-analyzer"
- Version: "1.0.0"
- Keywords: sitecore, cms, helix, xm-cloud, dotnet
- Components: commands/, agents/, skills/

### Step 2.2: Detection Logic (in analyze command)

**Primary Indicators** (High Confidence):
- `sitecore.json` - Sitecore CLI configuration
- `*.module.json` - Sitecore module definitions
- `/App_Config/Include/*.config` - Config patches
- `layers.config` - Helix layer config

**XM Cloud Indicators**:
- `xmcloud.build.json`
- `package.json` with `@sitecore-jss/*` dependencies

### Step 2.3: Main Command
**File**: `plugins/sitecore-analyzer/commands/analyze.md`

Command flow:
1. Detect Sitecore project type and version
2. Based on argument (or "all"), invoke agents:
   - `architecture` - Helix compliance
   - `quality` - C# patterns
   - `security` - Security configs
   - `performance` - Caching, indexing
   - `dependencies` - NuGet analysis
   - `serialization` - SCS/Unicorn/TDS
3. Generate consolidated report with severity ratings

### Step 2.4: Agents

| Agent | File | Focus Areas |
|-------|------|-------------|
| Architecture | `agents/architecture.md` | Helix layers, dependency direction, module organization |
| Code Quality | `agents/code-quality.md` | Controller patterns, DI usage, pipeline processors |
| Security | `agents/security.md` | Auth config, API security, XSS/CSRF, credentials |
| Performance | `agents/performance.md` | Caching, Solr indexing, rendering optimization |
| Dependencies | `agents/dependencies.md` | NuGet versions, Sitecore package compatibility |
| Serialization | `agents/serialization.md` | SCS/Unicorn/TDS config, item organization |

### Step 2.5: Skills

**sitecore-development** (`skills/sitecore-development/SKILL.md`):
- Helix architecture patterns
- Dependency injection patterns
- Pipeline processor implementation
- Configuration patching
- Template design best practices

**xm-cloud-guide** (`skills/xm-cloud-guide/SKILL.md`):
- JSS/Next.js component patterns
- GraphQL query patterns
- Edge delivery configuration
- Placeholder patterns
- Personalization with CDP

---

## Phase 3: Umbraco Analyzer Plugin

### Step 3.1: Plugin Configuration
**File**: `plugins/umbraco-analyzer/.claude-plugin/plugin.json`

Define plugin metadata with:
- Name: "umbraco-analyzer"
- Version: "1.0.0"
- Keywords: umbraco, cms, dotnet, aspnet-core
- Components: commands/, agents/, skills/

### Step 3.2: Detection Logic (in analyze command)

**Primary Indicators** (High Confidence):
- `appsettings.json` with `"Umbraco"` section
- `*.csproj` with `Umbraco.Cms` package
- `/App_Plugins/` directory
- `Program.cs` with `AddUmbraco()`

**Version Detection**:
- Umbraco 14.x = .NET 8
- Umbraco 15.x = .NET 9
- Umbraco 16.x = .NET 9/10

### Step 3.3: Main Command
**File**: `plugins/umbraco-analyzer/commands/analyze.md`

Command flow:
1. Detect Umbraco version and project structure
2. Based on argument (or "all"), invoke agents:
   - `architecture` - Project structure, DI patterns
   - `quality` - C# patterns, Umbraco conventions
   - `security` - API security, auth config
   - `performance` - Caching, content access
   - `dependencies` - NuGet analysis
   - `backoffice` - TypeScript/Lit components (v14+)
3. Generate consolidated report with version-specific guidance

### Step 3.4: Agents

| Agent | File | Focus Areas |
|-------|------|-------------|
| Architecture | `agents/architecture.md` | Project layers, Composers, DI registration |
| Code Quality | `agents/code-quality.md` | Controllers, Property Converters, Services |
| Security | `agents/security.md` | Delivery API security, backoffice protection |
| Performance | `agents/performance.md` | HybridCache, content access patterns |
| Dependencies | `agents/dependencies.md` | Package compatibility, upgrade paths |
| Backoffice | `agents/backoffice.md` | Lit/TypeScript components, property editors |

### Step 3.5: Skills

**umbraco-development** (`skills/umbraco-development/SKILL.md`):
- Composer patterns
- Notification handler implementation
- Service layer patterns
- IUmbracoContextFactory usage
- Content access best practices

**umbraco-modern-guide** (`skills/umbraco-modern-guide/SKILL.md`):
- Lit component patterns (v14+)
- Property editor development
- Content Delivery API usage
- Version-specific differences (14/15/16)
- Block Grid patterns

---

## Phase 4: Implementation Details

### Agent Template Structure

Each agent markdown file follows this pattern:

```yaml
---
name: [plugin]-[focus]-analyzer
description: [What this agent analyzes and when to use it]
tools: Read, Glob, Grep[, Bash]
model: inherit
---
```

Body includes:
- Analysis scope sections
- Specific patterns/issues to detect
- Output format specification

### Skill Template Structure

```yaml
---
name: [skill-name]
description: [When Claude should apply this skill]
---
```

Body includes:
- Code patterns with examples
- Best practices
- Common pitfalls to avoid

### Tool Access by Agent

| Agent Type | Tools |
|------------|-------|
| Architecture, Quality, Security | `Read, Glob, Grep` |
| Performance | `Read, Glob, Grep` |
| Dependencies | `Read, Glob, Grep, Bash` (for `dotnet list package`) |
| Serialization/Backoffice | `Read, Glob, Grep` |

---

## Phase 5: Testing & Verification

### Test Scenarios

**Sitecore Plugin**:
1. Test against Helix-compliant solution
2. Test against non-Helix legacy solution
3. Test against XM Cloud/JSS project
4. Verify Helix violation detection
5. Verify serialization format detection

**Umbraco Plugin**:
1. Test against Umbraco 14 project
2. Test against Umbraco 15 project
3. Test against project with custom backoffice
4. Verify Content Delivery API analysis
5. Verify Composer pattern detection

### Verification Steps

1. Install plugin from marketplace: `claude plugin install sitecore-analyzer`
2. Run analysis: `/sitecore-analyzer:analyze`
3. Verify detection identifies correct CMS version
4. Verify all agents produce relevant findings
5. Verify skills are triggered appropriately during development questions

---

## File Creation Order

1. `D:/github/claude/marketplace/.claude-plugin/marketplace.json`
2. `D:/github/claude/marketplace/plugins/sitecore-analyzer/.claude-plugin/plugin.json`
3. `D:/github/claude/marketplace/plugins/sitecore-analyzer/commands/analyze.md`
4. `D:/github/claude/marketplace/plugins/sitecore-analyzer/agents/architecture.md`
5. `D:/github/claude/marketplace/plugins/sitecore-analyzer/agents/code-quality.md`
6. `D:/github/claude/marketplace/plugins/sitecore-analyzer/agents/security.md`
7. `D:/github/claude/marketplace/plugins/sitecore-analyzer/agents/performance.md`
8. `D:/github/claude/marketplace/plugins/sitecore-analyzer/agents/dependencies.md`
9. `D:/github/claude/marketplace/plugins/sitecore-analyzer/agents/serialization.md`
10. `D:/github/claude/marketplace/plugins/sitecore-analyzer/skills/sitecore-development/SKILL.md`
11. `D:/github/claude/marketplace/plugins/sitecore-analyzer/skills/xm-cloud-guide/SKILL.md`
12. `D:/github/claude/marketplace/plugins/umbraco-analyzer/.claude-plugin/plugin.json`
13. `D:/github/claude/marketplace/plugins/umbraco-analyzer/commands/analyze.md`
14. `D:/github/claude/marketplace/plugins/umbraco-analyzer/agents/architecture.md`
15. `D:/github/claude/marketplace/plugins/umbraco-analyzer/agents/code-quality.md`
16. `D:/github/claude/marketplace/plugins/umbraco-analyzer/agents/security.md`
17. `D:/github/claude/marketplace/plugins/umbraco-analyzer/agents/performance.md`
18. `D:/github/claude/marketplace/plugins/umbraco-analyzer/agents/dependencies.md`
19. `D:/github/claude/marketplace/plugins/umbraco-analyzer/agents/backoffice.md`
20. `D:/github/claude/marketplace/plugins/umbraco-analyzer/skills/umbraco-development/SKILL.md`
21. `D:/github/claude/marketplace/plugins/umbraco-analyzer/skills/umbraco-modern-guide/SKILL.md`

---

## Key Technical Decisions

1. **Separate Plugins**: Each CMS has its own plugin for independent installation and maintenance
2. **Agent-based Analysis**: Modular agents allow focused analysis and parallel execution
3. **Version-aware Detection**: Both plugins detect CMS version and adjust analysis accordingly
4. **Skill Triggering**: Skills use descriptive names so Claude applies them during relevant queries
5. **Tool Restrictions**: Agents only get tools they need (Bash only for dependency agents)

---

## Detailed Agent Specifications

### Sitecore Architecture Agent

**Purpose**: Analyzes Helix architecture compliance

**Analysis Areas**:
- Verify three-layer structure: Foundation, Feature, Project
- Check layer naming conventions
- Validate dependency direction (Project -> Feature -> Foundation only)
- Scan `.csproj` files for `<ProjectReference>` elements
- Analyze `/App_Config/Include/` organization

**Helix Violations to Detect**:
1. Cross-Feature Dependencies: Feature A referencing Feature B
2. Upward Dependencies: Foundation referencing Feature/Project
3. God Modules: Modules with excessive responsibilities
4. Misplaced Items: Items serialized in wrong layer
5. Naming Violations: Inconsistent naming patterns

### Sitecore Security Agent

**Purpose**: Analyzes security configurations and vulnerabilities

**Analysis Areas**:
- Authentication: Forms auth, identity providers, password policies
- Authorization: Security rights, role definitions
- API Security: GraphQL endpoints, API keys, CORS
- Configuration: Hardcoded credentials, connection strings
- XSS/CSRF: Field renderer usage, anti-forgery tokens

**Vulnerabilities to Detect**:
1. Exposed Admin Paths
2. Weak Passwords/Default credentials
3. Missing HTTPS
4. SQL Injection patterns
5. Information Disclosure

### Sitecore Serialization Agent

**Purpose**: Analyzes SCS, Unicorn, and TDS configurations

**Analysis Areas**:
- Detect primary format (SCS YAML, Unicorn, TDS)
- Analyze `*.module.json` files
- Verify include/exclude patterns
- Check template organization by layer
- Identify environment-specific items

**Issues to Detect**:
1. Overlapping Includes
2. Missing Items
3. Sensitive Data in serialized content
4. Language Gaps
5. Orphaned Renderings

### Umbraco Architecture Agent

**Purpose**: Analyzes project structure and composition patterns

**Analysis Areas**:
- Verify project layering (Web, Core, Common)
- Analyze Composer implementations
- Check service registration patterns
- Verify notification handler registration
- Check ModelsBuilder configuration

**Issues to Detect**:
1. Service Locator Pattern usage
2. Composer Overload
3. Circular Dependencies
4. Fat Controllers
5. Missing Interfaces

### Umbraco Backoffice Agent (v14+)

**Purpose**: Analyzes modern TypeScript/Lit backoffice extensions

**Analysis Areas**:
- `umbraco-package.json` configuration
- LitElement component implementations
- Custom property editor registration
- Dashboard configurations
- Management API consumption

**Issues to Detect**:
1. Angular JS Legacy code not migrated
2. Missing Manifest registrations
3. Shadow DOM style leaks
4. Untyped TypeScript
5. Incorrect Management API patterns

---

## Skill Content Specifications

### sitecore-development Skill Content

```markdown
# Helix Architecture
- Layer Definitions (Foundation, Feature, Project)
- Dependency Rules
- Naming Convention: {Layer}.{Module}

# API Patterns
- Content Access via DI
- Pipeline Processors
- Configuration Patches

# Best Practices
- Template Design
- Rendering Parameters
- Caching
- Queries
- Async patterns

# Deployment
- CI/CD Integration
- Cache clearing
- Index rebuilding
```

### xm-cloud-guide Skill Content

```markdown
# Architecture Overview
- XM Cloud components
- Key Services (XM Cloud, Edge, Rendering Host)

# JSS Component Development
- React Component Pattern
- Placeholder Pattern

# GraphQL Queries
- Content Query patterns

# Best Practices
- Component Library
- Layout Service
- Edge Caching
- Preview
- Personalization
```

### umbraco-development Skill Content

```markdown
# Project Structure
- Recommended Layout
- Layer separation

# Composition Pattern
- Composer Example
- Notification Handler

# Service Patterns
- IUmbracoContextFactory usage

# Best Practices
- Use Composers
- Avoid Service Locator
- Respect Lifetimes
- Use IPublishedContent
- Async Handlers
```

### umbraco-modern-guide Skill Content

```markdown
# Backoffice Development (v14+)
- Lit Component Pattern
- Property Editor development

# Content Delivery API
- Configuration
- Query patterns

# Version-Specific Notes
- Umbraco 14: Lit backoffice, .NET 8
- Umbraco 15: HybridCache, IPublishedContentCache
- Umbraco 16: TipTap only, Document Type Inheritance
```
