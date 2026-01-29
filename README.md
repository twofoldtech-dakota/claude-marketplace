# CMS Analyzers Marketplace

**Claude Code plugins that analyze your CMS codebase and make you a better developer.**

Stop guessing about best practices. Get automated analysis with specific issues, exact locations, and actionable fixes for Sitecore, Umbraco, and Optimizely projects.

---

## The Problem

Working with enterprise CMS platforms is hard:

- **Best practices are scattered** across documentation, blog posts, and tribal knowledge
- **Security vulnerabilities hide** in configuration files and custom code
- **Performance issues** only surface in production when it's too late
- **Onboarding is slow** — new developers take weeks to understand project patterns
- **Code reviews miss things** that automated analysis would catch instantly

## The Solution

This marketplace provides **platform-specific analyzers** that understand your CMS deeply:

```
/sitecore-classic:analyze
```
```
✓ Scanned 847 files across 12 projects
✓ Detected Sitecore 10.4 with Helix architecture

Issues Found: 14 (2 Critical, 6 Warning, 6 Info)

CRITICAL: [SEC-003] Hardcoded connection string detected
  Location: src/Foundation/Database/code/ConnectionFactory.cs:24
  Fix: Move to environment variable or Azure Key Vault

CRITICAL: [ARCH-001] Cross-Feature dependency violates Helix
  Location: src/Feature/Navigation/code/Feature.Navigation.csproj:31
  Fix: Extract SharedModels to Foundation layer
```

Every issue includes **severity**, **exact location**, and **how to fix it**.

---

## Quick Start

### 1. Add the Marketplace

```
/plugin marketplace add https://github.com/twofoldtech-dakota/claude-marketplace.git
```

### 2. Install Your CMS Analyzer

| Your CMS | Install Command |
|----------|-----------------|
| Sitecore 10.x | `/plugin install sitecore-classic@cms-analyzers-marketplace` |
| Sitecore XM Cloud | `/plugin install xm-cloud@cms-analyzers-marketplace` |
| Umbraco 14-16 | `/plugin install umbraco@cms-analyzers-marketplace` |
| Optimizely CMS | `/plugin install optimizely@cms-analyzers-marketplace` |
| Optimizely Experimentation | `/plugin install optimizely-exp@cms-analyzers-marketplace` |

### 3. Run Analysis

```
/sitecore-classic:analyze   # Full analysis with report
/xm-cloud:analyze           # XM Cloud analysis
/umbraco:analyze            # Umbraco analysis
/optimizely:analyze         # Optimizely CMS analysis
/optimizely-exp:analyze     # Experimentation analysis
```

That's it. You'll get a detailed markdown report with all issues, scores, and recommendations.

---

## What Each Analyzer Checks

### Sitecore 10.x (Classic)

For on-premise and managed cloud Sitecore implementations:

| Category | What's Analyzed |
|----------|-----------------|
| **Architecture** | Helix compliance, layer dependencies, solution structure |
| **Serialization** | SCS/Unicorn conflicts, overlapping includes, field value queries |
| **Security** | Config credentials, CORS settings, admin paths, XSS patterns |
| **Performance** | HTML cache settings, Solr optimization, Sitecore.Query usage |
| **Code Quality** | Glass Mapper patterns, DI implementation, controller complexity |
| **Dependencies** | NuGet compatibility with Sitecore version |

### Sitecore XM Cloud

For headless Sitecore with Next.js and JSS:

| Category | What's Analyzed |
|----------|-----------------|
| **Architecture** | Component organization, layout patterns, app structure |
| **GraphQL** | Query efficiency, N+1 detection, fragment usage |
| **Security** | API key exposure, environment variables, introspection risks |
| **Performance** | SSR vs SSG decisions, bundle size, image optimization |
| **TypeScript** | Type safety, JSS patterns, React best practices |
| **Dependencies** | npm package compatibility, JSS version alignment |

### Umbraco 14-16

For modern Umbraco with Lit backoffice and Content Delivery API:

| Category | What's Analyzed |
|----------|-----------------|
| **Architecture** | Composer patterns, service registration, project structure |
| **Backoffice** | Lit components, property editors, TypeScript quality |
| **API** | Content Delivery API setup, Management API, custom endpoints |
| **Security** | API authentication, credentials, backoffice access |
| **Performance** | HybridCache (v15+), content access patterns, Examine indexes |
| **Code Quality** | Controllers, notification handlers, service patterns |

### Optimizely CMS (Content Cloud)

For Optimizely CMS 12.x and 13.x implementations:

| Category | What's Analyzed |
|----------|-----------------|
| **Content Modeling** | Content types, GUID requirements, block/page inheritance |
| **Architecture** | Content area restrictions, initialization modules |
| **Security** | Content Delivery API exposure, configuration secrets |
| **Performance** | Caching strategies, CDN configuration, N+1 queries |
| **Code Quality** | Service Locator anti-patterns, DI best practices |
| **A/B Testing** | Experimentation module integration |

### Optimizely Experimentation

For feature flags and A/B testing:

| Category | What's Analyzed |
|----------|-----------------|
| **SDK Setup** | Initialization patterns, datafile management |
| **Feature Flags** | Lifecycle management, flag patterns |
| **A/B Testing** | Variation handling, test implementation |
| **Security** | SDK key exposure, CSP configuration |
| **Performance** | Loading strategy, bundle impact, flicker prevention |
| **Event Tracking** | Conversion events, tracking implementation |

---

## Why Platform-Specific Analyzers?

Each CMS has fundamentally different patterns. A generic analyzer would miss the nuances:

| Aspect | Sitecore 10.x | XM Cloud | Umbraco | Optimizely |
|--------|---------------|----------|---------|------------|
| **Language** | C# | TypeScript | C# | C# / TypeScript |
| **Data Access** | Glass Mapper, Content Search | GraphQL | IPublishedContent | IContentLoader |
| **Rendering** | Controller Renderings | Next.js Components | Razor Views | Razor / API |
| **Caching** | HTML Cache | Edge CDN, ISR | HybridCache | Output Cache |

A Helix violation means nothing in Umbraco. A Composer anti-pattern doesn't apply to Sitecore. **You need analyzers that speak your CMS's language.**

---

## All Commands

Every analyzer includes these four commands:

| Command | Purpose |
|---------|---------|
| `/{plugin}:analyze` | Run full analysis with severity-rated issues |
| `/{plugin}:enhance` | Generate project-specific skills for Claude |
| `/{plugin}:security-scan` | Preview what files will be analyzed |
| `/{plugin}:setup` | Create `.claudeignore` for your project |

### Output Options

```bash
# Default: saves to docs/{plugin}-analysis-{date}.md
/sitecore-classic:analyze

# Custom output path
/sitecore-classic:analyze --output ./reports/latest.md

# Display only, no file
/sitecore-classic:analyze --no-file

# Filter by severity
/sitecore-classic:analyze --severity critical
```

---

## Generate Project-Specific Skills

The `enhance` command analyzes your codebase and generates skills that teach Claude your patterns:

```
/sitecore-classic:enhance
```

### What Gets Generated

| Output | What Claude Learns |
|--------|-------------------|
| **Project Patterns** | Your service patterns, repository patterns, controller conventions |
| **Architecture Guide** | Your project structure and how to add new features |
| **Vocabulary** | Domain terms and acronyms specific to your project |
| **Custom Commands** | Project-specific workflows like `/project:build` |
| **Testing Patterns** | Your test framework setup and mocking strategies |

After running enhance, Claude gives better suggestions that match your codebase conventions.

---

## Bundled Development Skills

Each analyzer includes pre-built skills for your technology stack:

| Skill | Description | Included In |
|-------|-------------|-------------|
| `backend-csharp` | C#/.NET, DI, async patterns | Sitecore Classic, Umbraco, Optimizely CMS |
| `frontend-classic` | CSS/SASS, JavaScript, jQuery | Sitecore Classic, Umbraco |
| `frontend-modern` | React, Next.js, TypeScript | XM Cloud, Umbraco, Optimizely |
| `frontend-razor` | Razor views, tag helpers | Sitecore Classic, Umbraco, Optimizely CMS |
| `fullstack-modern` | GraphQL, SSR/SSG, API routes | XM Cloud |

These skills are automatically active when you install an analyzer.

---

## Security & Privacy

### Safe Installation Workflow

```bash
# 1. Install the plugin (no analysis yet)
/plugin install sitecore-classic-analyzer@cms-analyzers-marketplace

# 2. Generate exclusion patterns for your project
/sitecore-classic:setup --generate-ignore

# 3. Preview what will be analyzed
/sitecore-classic:security-scan

# 4. Run analysis with exclusions in place
/sitecore-classic:analyze
```

### Exclude Sensitive Files

Create a `.claudeignore` file:

```gitignore
# Credentials and secrets
**/appsettings.Production.json
**/connectionstrings.config
**/.env
**/.env.*
**/secrets/
**/*.pfx
**/*.key

# Serialized content with sensitive data
**/serialization/**/*.yml
```

### Safe Mode

Analyze structure without reading file contents:

```bash
/sitecore-classic:analyze --safe-mode
```

---

## CI/CD Integration

Add automated analysis to your pull request pipeline:

```yaml
- name: CMS Analysis
  run: |
    claude /sitecore-classic:analyze --output report.md
    grep -q "Critical" report.md && exit 1 || exit 0

- name: Upload Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: analysis-report
    path: report.md
```

The analyzer returns exit codes based on severity, so you can fail builds on critical issues.

---

## Sample Report

```markdown
# Sitecore Classic Analysis Report

## Summary
- **Platform**: Sitecore 10.4 (Helix Architecture)
- **Serialization**: Sitecore Content Serialization (SCS)
- **Issues Found**: 14 (2 Critical, 6 Warning, 6 Info)

## Scores
| Category | Score | Issues |
|----------|-------|--------|
| Helix Compliance | 87% | 3 |
| Security | B+ | 4 |
| Performance | A- | 2 |
| Code Quality | A | 5 |

## Critical Issues

### [SEC-003] Hardcoded Connection String
**Severity**: Critical
**Location**: `src/Foundation/Database/code/ConnectionFactory.cs:24`
**Impact**: Credentials exposed in source control
**Fix**: Move connection string to environment variable or Azure Key Vault

### [ARCH-001] Cross-Feature Dependency
**Severity**: Critical
**Location**: `src/Feature/Navigation/code/Feature.Navigation.csproj:31`
**Impact**: Violates Helix dependency rules, complicates deployments
**Fix**: Extract SharedModels class to Foundation.Common

## Warnings

### [PERF-002] Missing HTML Cache Configuration
**Location**: `src/Feature/Navigation/code/Layouts/MainNavigation.cshtml`
**Fix**: Add VaryByData and VaryByLogin cache settings
```

---

## Troubleshooting

### "Invalid schema" error on first attempt

This is an intermittent issue in Claude Code. Simply retry the command — it typically works on the second attempt.

### Analysis seems slow

For large codebases (1000+ files), initial analysis may take longer. Subsequent runs use cached detection results.

### Want to analyze multiple CMS projects?

Install multiple analyzers — they don't conflict:

```
/plugin install sitecore-classic-analyzer@cms-analyzers-marketplace
/plugin install umbraco-analyzer@cms-analyzers-marketplace
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your rule or agent
4. Submit a pull request

See individual plugin READMEs for contribution guidelines specific to each CMS.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.
