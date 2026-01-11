# Umbraco Analyzer

Analyze Umbraco 14-16 projects for architecture, security, backoffice patterns, and Content Delivery API configuration.

## Why Use This

| Challenge | How This Helps |
|-----------|----------------|
| "Is my Content Delivery API secure?" | Checks authentication, public access, and API key requirements |
| "Are my Composers well-structured?" | Detects oversized Composers, circular dependencies, Service Locator anti-pattern |
| "Am I using v14+ patterns correctly?" | Validates Lit components, checks for deprecated AngularJS code |
| "Is my caching optimal?" | Recommends HybridCache (v15+), identifies IUmbracoContext misuse |
| "Are my property editors correct?" | Checks manifest registration, TypeScript quality, UUI component usage |

## Benefits

- **Version-Aware**: Different checks for Umbraco 14, 15, and 16 features
- **Modern Backoffice**: Validates Lit components and TypeScript patterns
- **API Security**: Content Delivery API and Management API configuration checks
- **Performance Tuning**: Caching, Examine indexes, content traversal optimization
- **Project Learning**: Generate custom skills so Claude understands your Composer patterns

## Installation

```
/plugin marketplace add https://github.com/twofoldtech-dakota/claude-marketplace.git
/plugin install umbraco-analyzer@cms-analyzers-marketplace
```

## Commands

### Analyze

```bash
# Run all agents (saves to docs/umbraco-analysis-{date}.md)
/umbraco:analyze

# Run specific agent
/umbraco:analyze architecture
/umbraco:analyze security
/umbraco:analyze backoffice
/umbraco:analyze performance

# Custom output path
/umbraco:analyze --output ./reports/latest.md

# Display only, no file output
/umbraco:analyze --no-file

# Safe mode (structure only, no file content)
/umbraco:analyze --safe-mode
```

**Report Output**: By default, reports are saved to `docs/umbraco-analysis-{date}.md`. Use `--output` for custom paths or `--no-file` to skip file output.

### Enhance

Generate project-specific skills and commands for improved AI assistance:

```bash
# Generate project-specific enhancements
/umbraco:enhance

# Preview without writing files
/umbraco:enhance --dry-run

# Include code examples from codebase
/umbraco:enhance --include-examples
```

**Generated Output** (in `.claude/skills/`):
- `project-patterns/SKILL.md` - Detected Composer, service, and controller patterns
- `architecture-guide/SKILL.md` - Project structure and adding new features
- `vocabulary.md` - Domain terms and Umbraco-specific naming
- `commands/*.md` - Custom commands for build, deploy, etc.

### Security Scan

Preview what files will be analyzed before running:

```bash
/umbraco:security-scan
```

### Setup

Initial configuration with `.claudeignore` generation:

```bash
/umbraco:setup --generate-ignore
```

## What It Analyzes

| Agent | Focus Areas |
|-------|-------------|
| **detector** | Umbraco version, .NET version, backoffice type |
| **architecture** | Composers, service registration, project structure |
| **code-quality** | Controllers, notification handlers, service patterns |
| **security** | Content Delivery API auth, credentials, backoffice access |
| **performance** | HybridCache (v15+), content access, Examine indexes |
| **backoffice** | Lit components (v14+), property editors, TypeScript |
| **api** | Content Delivery API, Management API, custom endpoints |
| **dependencies** | NuGet compatibility, deprecated packages |
| **conventions** | Document type naming, alias conventions, templates |
| **pattern-extractor** | Composer patterns, service patterns, controller conventions |
| **skill-generator** | Project-specific skill and command generation |

## Example Output

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
```

## Issue Codes

### Architecture (ARCH)
| Code | Severity | Description |
|------|----------|-------------|
| ARCH-001 | Critical | Service Locator pattern |
| ARCH-002 | Warning | Composer too large (>10 registrations) |
| ARCH-003 | Warning | Circular dependency |
| ARCH-004 | Warning | Fat controller (>5 actions) |

### Security (SEC)
| Code | Severity | Description |
|------|----------|-------------|
| SEC-001 | Critical | Content Delivery API publicly accessible |
| SEC-002 | Critical | Hardcoded credentials |
| SEC-003 | Warning | Backoffice accessible from public IP |
| SEC-004 | Warning | Missing rate limiting |

### Performance (PERF)
| Code | Severity | Description |
|------|----------|-------------|
| PERF-001 | Critical | Unbounded content traversal |
| PERF-002 | Warning | Not using HybridCache (v15+) |
| PERF-003 | Warning | IUmbracoContext in singleton |

### Backoffice (BO)
| Code | Severity | Description |
|------|----------|-------------|
| BO-001 | Critical | AngularJS in v14+ project |
| BO-002 | Warning | Missing manifest registration |
| BO-003 | Warning | Untyped TypeScript (`any`) |

## Version-Specific Features

### Umbraco 14 (.NET 8)
- New Lit-based backoffice
- AngularJS deprecated
- Block Grid editor

### Umbraco 15 (.NET 9)
- HybridCache available
- Performance improvements
- Content Delivery API v2

### Umbraco 16 (.NET 9/10)
- TipTap replaces TinyMCE
- Management API v2
- Enhanced document type inheritance

## Skills

The plugin includes two skills:
- `umbraco-development`: Core patterns for Composers, services, controllers
- `umbraco-modern-guide`: v14+ patterns for Lit components, Content Delivery API

### Shared Skills

This plugin is enhanced by shared skills that provide additional context for frontend, backend, and fullstack development:

| Skill | Description |
|-------|-------------|
| `frontend-razor` | Razor view syntax, layouts, partials, tag helpers |
| `frontend-classic` | CSS/SASS organization, JavaScript/jQuery patterns (traditional sites) |
| `frontend-modern` | React, Vue, TypeScript patterns (headless/decoupled sites) |
| `backend-csharp` | C#/.NET DI patterns, service architecture, async/await |
| `fullstack-classic` | jQuery AJAX integration, form handling (traditional) |
| `fullstack-modern` | REST/GraphQL APIs, Content Delivery API integration (headless) |

These skills are automatically applied based on the file types you're working with. Umbraco supports both traditional Razor-based sites and modern headless architectures, so both classic and modern frontend skills are available.

## Security & Privacy

### Safe Installation

```bash
# 1. Setup with .claudeignore
/umbraco:setup --generate-ignore

# 2. Preview what will be analyzed
/umbraco:security-scan

# 3. Run analysis (respects .claudeignore)
/umbraco:analyze
```

### Safe Mode

Analyze structure without reading sensitive file contents:

```bash
/umbraco:analyze --safe-mode
```

### Default .claudeignore for Umbraco

```gitignore
# Umbraco-specific exclusions
**/appsettings.*.json
!**/appsettings.json
**/appsettings.Production.json
**/appsettings.Development.json

# Umbraco data
**/umbraco/Data/
**/umbraco/Logs/
**/App_Data/

# Media and uploads
**/wwwroot/media/
**/uploads/

# Credentials
**/*.pfx
**/*.key
**/license.lic

# Build output
**/bin/
**/obj/
```

### Content Redaction

Reports automatically redact:
- Connection string passwords
- API keys in appsettings
- Content Delivery API keys
- Member/user credentials
