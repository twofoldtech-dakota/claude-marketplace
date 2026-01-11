# Sitecore Classic Analyzer

Analyze Sitecore 10.x projects for Helix compliance, security vulnerabilities, and performance issues.

## Why Use This

| Challenge | How This Helps |
|-----------|----------------|
| "Is this code Helix compliant?" | Automated architecture validation with specific violation locations |
| "Are there security issues?" | Scans for hardcoded credentials, XSS risks, and misconfigurations |
| "Why is this page slow?" | Identifies Sitecore.Query in loops, unbounded GetDescendants, missing cache settings |
| "Are our serialization files correct?" | Detects SCS/Unicorn conflicts, overlapping paths, slow queries in field values |
| "Does our code follow best practices?" | Checks DI patterns, controller complexity, and naming conventions |

## Benefits

- **Actionable Reports**: Every issue includes location, impact, and fix recommendation
- **Severity Ratings**: Critical, Warning, Info levels help prioritize fixes
- **CI/CD Ready**: Integrate into PR pipelines to catch issues before merge
- **Safe Mode**: Analyze structure without reading sensitive file contents
- **Project Learning**: Generate custom skills so Claude understands your patterns

## Installation

```
/plugin marketplace add https://github.com/twofoldtech-dakota/claude-marketplace.git
/plugin install sitecore-classic-analyzer@cms-analyzers-marketplace
```

## Commands

### Analyze

```bash
# Run all agents (saves to docs/sitecore-classic-analysis-{date}.md)
/sitecore-classic:analyze

# Run specific agent
/sitecore-classic:analyze architecture
/sitecore-classic:analyze security
/sitecore-classic:analyze performance
/sitecore-classic:analyze serialization

# Custom output path
/sitecore-classic:analyze --output ./reports/latest.md

# Display only, no file output
/sitecore-classic:analyze --no-file

# Safe mode (structure only, no file content)
/sitecore-classic:analyze --safe-mode
```

**Report Output**: By default, reports are saved to `docs/sitecore-classic-analysis-{date}.md`. Use `--output` for custom paths or `--no-file` to skip file output.

### Enhance

Generate project-specific skills and commands for improved AI assistance:

```bash
# Generate project-specific enhancements
/sitecore-classic:enhance

# Preview without writing files
/sitecore-classic:enhance --dry-run

# Include code examples from codebase
/sitecore-classic:enhance --include-examples
```

**Generated Output** (in `.claude/skills/`):
- `project-patterns/SKILL.md` - Detected service, repository, controller patterns
- `architecture-guide/SKILL.md` - Helix structure and adding new modules
- `vocabulary.md` - Domain terms and Sitecore-specific naming
- `commands/*.md` - Custom commands for build, deploy, etc.

### Security Scan

Preview what files will be analyzed before running:

```bash
/sitecore-classic:security-scan
```

### Setup

Initial configuration with `.claudeignore` generation:

```bash
/sitecore-classic:setup --generate-ignore
```

## What It Analyzes

| Agent | Focus Areas |
|-------|-------------|
| **detector** | Sitecore version, modules (SXA, Commerce), serialization format |
| **architecture** | Helix compliance, layer dependencies, solution structure |
| **code-quality** | Controllers, DI patterns, Glass Mapper usage |
| **security** | Config credentials, CORS, admin paths, XSS |
| **performance** | HTML cache, Solr indexes, Sitecore.Query avoidance |
| **serialization** | SCS/Unicorn conflicts, overlapping includes, **slow queries in field values** |
| **dependencies** | NuGet compatibility with Sitecore version |
| **conventions** | Template naming, field naming, config organization |
| **pattern-extractor** | Service patterns, repository patterns, controller conventions |
| **skill-generator** | Project-specific skill and command generation |

## Example Output

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
**Fix**: Extract shared logic to Foundation layer
```

## Issue Codes

### Architecture (ARCH)
| Code | Severity | Description |
|------|----------|-------------|
| ARCH-001 | Critical | Cross-Feature dependency |
| ARCH-002 | Critical | Upward dependency (Foundation → Feature/Project) |
| ARCH-003 | Warning | God module (>15 classes) |
| ARCH-004 | Warning | Config patch in wrong layer |

### Security (SEC)
| Code | Severity | Description |
|------|----------|-------------|
| SEC-001 | Critical | Hardcoded credentials |
| SEC-002 | Critical | Connection string password in plain text |
| SEC-003 | Critical | API key in source |
| SEC-004 | Warning | Overly permissive CORS |

### Performance (PERF)
| Code | Severity | Description |
|------|----------|-------------|
| PERF-001 | Critical | Sitecore.Query in loop |
| PERF-002 | Critical | Unbounded GetDescendants() |
| PERF-003 | Warning | Rendering without cache settings |
| PERF-004 | Warning | Content Search without pagination |

### Serialization (SER)
| Code | Severity | Description |
|------|----------|-------------|
| SER-001 | Critical | Mixed serialization formats |
| SER-002 | Critical | Sensitive data in serialized items |
| SER-003 | Critical | User/role items with passwords serialized |
| SER-004 | Warning | Overlapping include paths |
| SER-005 | Warning | Items serialized in wrong Helix layer |
| SER-009 | Critical | **Sitecore query in serialized field value (unbounded)** |
| SER-010 | Warning | **Fast query in field without index hint** |
| SER-011 | Warning | **Deep axis traversal in field query** |
| SER-012 | Info | **Query-based datasource in standard values** |

### Slow Query Detection in Serialization

The serialization agent scans `.yml` and `.yaml` files for performance-problematic patterns in field values:

| Pattern | Risk | Example |
|---------|------|---------|
| `query:` prefix | High | `query:/sitecore/content//*[@@templateid='{...}']` |
| `fast:` prefix | Medium | `fast:/sitecore/content/Home//*` |
| Axes selectors | High | `.//*`, `ancestor::*`, `descendant::*` |
| Unbounded wildcards | High | `//*` without filters |

**Detected in**: Datasource fields, Multilist sources, Treelist sources, Rendering parameters

## Skills

The `sitecore-classic` skill provides Claude with knowledge of:
- Helix architecture patterns
- Dependency injection setup
- Content Search vs Sitecore.Query
- Caching configuration
- Pipeline processor patterns
- Configuration patching

### Shared Skills

This plugin is enhanced by shared skills that provide additional context for frontend, backend, and fullstack development:

| Skill | Description |
|-------|-------------|
| `frontend-classic` | CSS/SASS organization, JavaScript/jQuery patterns, BEM naming |
| `frontend-razor` | Razor view syntax, layouts, partials, tag helpers |
| `backend-csharp` | C#/.NET DI patterns, service architecture, async/await |
| `fullstack-classic` | jQuery AJAX integration, form handling, anti-forgery tokens |

These skills are automatically applied based on the file types you're working with, providing comprehensive development context alongside the Sitecore-specific patterns.

## Security & Privacy

### Safe Installation

```bash
# 1. Setup with .claudeignore
/sitecore-classic:setup --generate-ignore

# 2. Preview what will be analyzed
/sitecore-classic:security-scan

# 3. Run analysis (respects .claudeignore)
/sitecore-classic:analyze
```

### Safe Mode

Analyze structure without reading sensitive file contents:

```bash
/sitecore-classic:analyze --safe-mode
```

### Default .claudeignore for Sitecore

```gitignore
# Sitecore-specific exclusions
**/App_Config/ConnectionStrings.config
**/App_Config/Include/*.secret.config
**/App_Config/Security/*

# Serialization (may contain sensitive data)
**/serialization/**/*.yml
!**/serialization/**/*.module.json

# Environment
**/.env
**/web.config.transform

# Credentials
**/license.xml
**/*.pfx
```

### Content Redaction

Reports automatically redact:
- Connection string passwords
- API keys and tokens
- License information
- User credentials in serialized items
