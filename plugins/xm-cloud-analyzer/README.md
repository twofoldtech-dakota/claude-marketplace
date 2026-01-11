# XM Cloud Analyzer

Analyze Sitecore XM Cloud projects for JSS patterns, GraphQL efficiency, and Next.js best practices.

## Why Use This

| Challenge | How This Helps |
|-----------|----------------|
| "Is my GraphQL efficient?" | Detects N+1 patterns, over-fetching, and missing fragments |
| "Are API keys exposed?" | Finds NEXT_PUBLIC_ misuse and hardcoded credentials |
| "Is SSR/SSG optimal?" | Identifies static content using getServerSideProps unnecessarily |
| "Does my TypeScript follow best practices?" | Catches `any` overuse, missing type guards, and JSS pattern violations |
| "Is my bundle size reasonable?" | Flags large imports and missing code splitting |

## Benefits

- **Headless-Focused**: Built specifically for JSS, Next.js, and GraphQL patterns
- **TypeScript Quality**: Analyzes type safety and React best practices
- **Performance Insights**: SSR vs SSG recommendations, bundle optimization
- **Security Scanning**: API key exposure, environment variable leaks
- **Project Learning**: Generate custom skills so Claude understands your component patterns

## Installation

```
/plugin marketplace add https://github.com/twofoldtech-dakota/claude-marketplace.git
/plugin install xm-cloud-analyzer@cms-analyzers-marketplace
```

## Commands

### Analyze

```bash
# Run all agents (saves to docs/xm-cloud-analysis-{date}.md)
/xm-cloud:analyze

# Run specific agent
/xm-cloud:analyze architecture
/xm-cloud:analyze security
/xm-cloud:analyze performance
/xm-cloud:analyze graphql

# Custom output path
/xm-cloud:analyze --output ./reports/latest.md

# Display only, no file output
/xm-cloud:analyze --no-file

# Safe mode (structure only, no file content)
/xm-cloud:analyze --safe-mode
```

**Report Output**: By default, reports are saved to `docs/xm-cloud-analysis-{date}.md`. Use `--output` for custom paths or `--no-file` to skip file output.

### Enhance

Generate project-specific skills and commands for improved AI assistance:

```bash
# Generate project-specific enhancements
/xm-cloud:enhance

# Preview without writing files
/xm-cloud:enhance --dry-run

# Include code examples from codebase
/xm-cloud:enhance --include-examples
```

**Generated Output** (in `.claude/project-skills/`):
- `project-patterns/SKILL.md` - Detected component, hook, and data fetching patterns
- `architecture-guide/SKILL.md` - Next.js structure and adding new components
- `vocabulary.md` - Domain terms and GraphQL naming conventions
- `commands/*.md` - Custom commands for build, deploy, etc.

### Security Scan

Preview what files will be analyzed before running:

```bash
/xm-cloud:security-scan
```

### Setup

Initial configuration with `.claudeignore` generation:

```bash
/xm-cloud:setup --generate-ignore
```

## What It Analyzes

| Agent | Focus Areas |
|-------|-------------|
| **detector** | JSS version, Next.js version, deployment target |
| **architecture** | App structure, component organization, layouts |
| **code-quality** | TypeScript quality, JSS patterns, React best practices |
| **security** | API key exposure, env vars, GraphQL introspection |
| **performance** | SSR vs SSG, bundle size, image optimization |
| **graphql** | Query efficiency, N+1 detection, fragment usage |
| **dependencies** | npm package compatibility, JSS version alignment |
| **conventions** | Component naming, file organization, hook patterns |
| **pattern-extractor** | Component patterns, hook patterns, data fetching conventions |
| **skill-generator** | Project-specific skill and command generation |

## Example Output

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
**Fix**: Rename to SITECORE_API_KEY (without NEXT_PUBLIC_)
```

## Issue Codes

### Architecture (ARCH)
| Code | Severity | Description |
|------|----------|-------------|
| ARCH-001 | Critical | Mixed App Router and Pages Router |
| ARCH-002 | Warning | Components not in dedicated folder |
| ARCH-003 | Warning | Business logic in page components |

### Security (SEC)
| Code | Severity | Description |
|------|----------|-------------|
| SEC-001 | Critical | API key hardcoded in source |
| SEC-002 | Critical | API key exposed via NEXT_PUBLIC_ |
| SEC-003 | Critical | Sensitive data in getStaticProps |
| SEC-004 | Warning | GraphQL introspection enabled |

### Performance (PERF)
| Code | Severity | Description |
|------|----------|-------------|
| PERF-001 | Critical | getServerSideProps on static content |
| PERF-002 | Warning | Large bundle imports |
| PERF-003 | Warning | Images without next/image |

### GraphQL (GQL)
| Code | Severity | Description |
|------|----------|-------------|
| GQL-001 | Critical | N+1 query pattern |
| GQL-002 | Critical | Over-fetching fields |
| GQL-003 | Warning | Not using fragments |

### Code Quality (CQ)
| Code | Severity | Description |
|------|----------|-------------|
| CQ-001 | Critical | Extensive `any` type usage |
| CQ-002 | Critical | Missing withDatasourceCheck |
| CQ-003 | Warning | Direct field access |

## Skills

The `xm-cloud` skill provides Claude with knowledge of:
- JSS component patterns
- GraphQL query optimization
- Next.js data fetching strategies
- Experience Edge delivery
- Personalization middleware

## Security & Privacy

### Safe Installation

```bash
# 1. Setup with .claudeignore
/xm-cloud:setup --generate-ignore

# 2. Preview what will be analyzed
/xm-cloud:security-scan

# 3. Run analysis (respects .claudeignore)
/xm-cloud:analyze
```

### Safe Mode

Analyze structure without reading sensitive file contents:

```bash
/xm-cloud:analyze --safe-mode
```

### Default .claudeignore for XM Cloud

```gitignore
# XM Cloud-specific exclusions
**/.env
**/.env.local
**/.env.production
!**/.env.example

# API keys and secrets
**/secrets/
**/*.key
**/*.pem

# Build output
**/.next/
**/node_modules/
**/out/

# Deployment configs with secrets
**/vercel.json
**/netlify.toml
```

### Content Redaction

Reports automatically redact:
- SITECORE_API_KEY values
- GraphQL endpoint credentials
- Deployment secrets
- Environment variable values
