# CMS Analyzers Marketplace

Claude Code plugins for analyzing enterprise CMS platforms with actionable reports, severity ratings, and shareable metrics.

## Why Use This

| Challenge | How This Helps |
|-----------|----------------|
| "Is this code following best practices?" | Automated analysis with specific issue locations and fix recommendations |
| "Are there security vulnerabilities?" | Scans for hardcoded credentials, API key exposure, and misconfigurations |
| "What's causing performance issues?" | Identifies slow queries, missing cache settings, and inefficient patterns |
| "How do I onboard to this codebase?" | Generate project-specific skills that teach Claude your patterns |
| "Can we catch issues before PR merge?" | CI/CD ready with exit codes for critical issues |

## Benefits

- **Platform-Specific**: Separate analyzers optimized for each CMS (not one-size-fits-all)
- **Actionable Reports**: Every issue includes severity, location, and how to fix it
- **Safe by Default**: Preview what will be analyzed, exclude sensitive files with `.claudeignore`
- **AI Enhancement**: Generate skills that improve Claude's understanding of your codebase
- **Team Scalable**: Consistent analysis across developers, integrates with CI/CD pipelines

## Quick Start

### Step 1: Add the Marketplace

```
/plugin marketplace add https://github.com/twofoldtech-dakota/claude-marketplace.git
```

### Step 2: Install a Plugin

Choose the plugin for your CMS platform:

**For Sitecore 10.x:**
```
/plugin install sitecore-classic-analyzer@cms-analyzers-marketplace
```

**For XM Cloud:**
```
/plugin install xm-cloud-analyzer@cms-analyzers-marketplace
```

**For Umbraco 14-16:**
```
/plugin install umbraco-analyzer@cms-analyzers-marketplace
```

### Step 3: Run Analysis

**Sitecore 10.x:**
```
/sitecore-classic:analyze
```

**XM Cloud:**
```
/xm-cloud:analyze
```

**Umbraco:**
```
/umbraco:analyze
```

### Optional: Generate Project-Specific Enhancements

```
/sitecore-classic:enhance
/xm-cloud:enhance
/umbraco:enhance
```

### Troubleshooting

**"Invalid schema" error on first attempt?**

This is a known intermittent issue in Claude Code v2.1.2. Simply retry the command - it typically works on the second or third attempt.

| Attempt | Result |
|---------|--------|
| 1st | ❌ Error: Invalid schema |
| 2nd/3rd | ✅ Successfully added |

This appears to be a race condition in the CLI where the marketplace schema parser isn't fully initialized on the first invocation.

## Available Plugins

| Plugin | CMS Versions | Key Features |
|--------|--------------|--------------|
| [sitecore-classic-analyzer](./plugins/sitecore-classic-analyzer/) | Sitecore 10.x | Helix compliance, SCS/Unicorn, Solr, C# patterns |
| [xm-cloud-analyzer](./plugins/xm-cloud-analyzer/) | XM Cloud | JSS, Next.js, GraphQL, TypeScript quality |
| [umbraco-analyzer](./plugins/umbraco-analyzer/) | Umbraco 14-16 | Backoffice (Lit), Content Delivery API, Composers |

## Bundled Skills

Each CMS analyzer plugin includes **bundled skills** that provide frontend, backend, and fullstack context relevant to that platform:

| Skill | Description | Included In |
|-------|-------------|-------------|
| `frontend-classic` | CSS/SASS, JavaScript, jQuery patterns | Sitecore Classic, Umbraco |
| `frontend-modern` | React, Vue, Next.js, TypeScript | XM Cloud, Umbraco |
| `frontend-razor` | Razor views, layouts, tag helpers | Sitecore Classic, Umbraco |
| `backend-csharp` | C#/.NET, DI, services, async patterns | Sitecore Classic, Umbraco |
| `fullstack-classic` | jQuery AJAX + C# integration | Sitecore Classic, Umbraco |
| `fullstack-modern` | React/GraphQL, SSR/SSG, API routes | XM Cloud, Umbraco |

When you install a CMS analyzer, all relevant skills are included automatically. No additional installation required.

## Commands Overview

Each plugin provides these main commands:

| Command | Purpose |
|---------|---------|
| `/{plugin}:analyze` | Run full codebase analysis with severity-rated issues |
| `/{plugin}:enhance` | Generate project-specific skills and custom commands |
| `/{plugin}:security-scan` | Preview what will be analyzed before running |
| `/{plugin}:setup` | Initial setup with `.claudeignore` generation |

### Report Output Options

By default, analysis reports are saved to `docs/{plugin}-analysis-{date}.md`.

| Option | Description |
|--------|-------------|
| (default) | Write report to `docs/` directory |
| `--output <path>` | Custom output path |
| `--no-file` | Display report only, don't save to file |

```bash
# Default: saves to docs/sitecore-classic-analysis-2026-01-11.md
/sitecore-classic:analyze

# Custom output path
/sitecore-classic:analyze --output ./reports/latest.md

# Display only
/sitecore-classic:analyze --no-file
```

## Why Three Separate Analyzers?

**Sitecore Classic** (10.x) and **XM Cloud** are fundamentally different platforms:

| Aspect | Sitecore 10.x | XM Cloud |
|--------|---------------|----------|
| Primary Language | C# | TypeScript/React |
| Rendering | MVC Controllers | Next.js Components |
| Data Access | Content Search, Glass Mapper | GraphQL, Edge |
| Caching | HTML Cache, Custom Cache | Edge CDN, ISR/SSG |
| Deployment | IaaS/On-prem | Vercel/Netlify |

Separate analyzers provide focused, accurate analysis for each platform.

## Report Example

```markdown
# Sitecore Classic Analysis Report

## Summary
- **Platform**: Sitecore 10.4 (Helix Architecture)
- **Issues Found**: 14 (2 Critical, 6 Warning, 6 Info)

## Scores
| Category | Score | Issues |
|----------|-------|--------|
| Helix Compliance | 87% | 3 |
| Security | B+ | 4 |
| Performance | A- | 2 |

## Critical Issues
### [ARCH-001] Cross-Feature Dependency Detected
**Location**: `src/Feature/Navigation/code/Feature.Navigation.csproj:24`
**Fix**: Extract shared logic to Foundation layer
```

## Security & Privacy

Analyzers can be installed safely without exposing sensitive code:

### Safe Installation Workflow

**Step 1:** Add the marketplace (no analysis yet)
```
/plugin marketplace add https://github.com/twofoldtech-dakota/claude-marketplace.git
```

**Step 2:** Install the plugin
```
/plugin install sitecore-classic-analyzer@cms-analyzers-marketplace
```

**Step 3:** Generate `.claudeignore` for your project
```
/sitecore-classic:setup --generate-ignore
```

**Step 4:** Preview what will be analyzed
```
/sitecore-classic:security-scan
```

**Step 5:** Run analysis with exclusions in place
```
/sitecore-classic:analyze
```

### Safe Mode

Run structural analysis without reading file contents:

```bash
/sitecore-classic:analyze --safe-mode
```

### .claudeignore

Create a `.claudeignore` file to exclude sensitive paths:

```gitignore
# Sensitive Configuration
**/appsettings.Production.json
**/connectionstrings.config
**/.env
**/.env.*

# Credentials
**/secrets/
**/*.pfx
**/*.key

# Serialized content (may contain sensitive data)
**/serialization/**/*.yml
```

### Enterprise Configuration

Configure organization-wide settings in `.claude/analyzer-config.json`:

```json
{
  "security": {
    "mode": "safe",
    "redactPatterns": true,
    "excludePaths": ["**/secrets/**"]
  }
}
```

## Enhance Command

Generate project-specific AI enhancements to improve Claude's understanding of your codebase:

```bash
/sitecore-classic:enhance --output .claude/skills/
```

### What Gets Generated

| Output | Description |
|--------|-------------|
| `project-patterns/SKILL.md` | Detected service, repository, controller patterns |
| `architecture-guide/SKILL.md` | Project structure and adding new features |
| `vocabulary.md` | Domain terms and acronyms from your codebase |
| `commands/*.md` | Custom commands like `/project:build`, `/project:test` |

### Benefits

- **Pattern Recognition**: AI learns your project's specific patterns
- **Code Generation**: More accurate code matching your conventions
- **Custom Commands**: Project-specific workflows automated

## CI/CD Integration

Add to your PR pipeline:

```yaml
- name: CMS Analysis
  run: |
    claude /sitecore-classic:analyze --output report.md
    grep -q "Critical" report.md && exit 1 || exit 0

- name: Upload Analysis Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: analysis-report
    path: report.md
```

### Pipeline Options

```yaml
# Fail on critical issues
claude /sitecore-classic:analyze --output report.md
grep -q "Critical" report.md && exit 1

# Save reports by date (for tracking over time)
claude /sitecore-classic:analyze --output reports/analysis-$(date +%Y-%m-%d).md

# Multiple analyzers in one pipeline
claude /sitecore-classic:analyze --output reports/sitecore.md
claude /umbraco:analyze --output reports/umbraco.md
```

## Plugin Structure

Each analyzer follows a consistent structure:

```
plugins/{cms}-analyzer/
├── .claude-plugin/
│   └── plugin.json          # Plugin configuration
├── README.md                # Usage and examples
├── commands/
│   ├── analyze.md           # Main analysis command
│   ├── enhance.md           # Project enhancement generation
│   ├── security-scan.md     # Pre-analysis security preview
│   └── setup.md             # Initial configuration
├── agents/
│   ├── detector.md          # Platform detection
│   ├── architecture.md      # Structure analysis
│   ├── security.md          # Security checks
│   ├── performance.md       # Performance analysis
│   ├── pattern-extractor.md # Pattern detection for enhance
│   ├── skill-generator.md   # Skill file generation
│   └── ...                  # Additional agents
├── skills/
│   └── {skill-name}/
│       └── SKILL.md         # Development patterns
└── templates/
    └── .claudeignore.template  # Default exclusion patterns
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your agent or rule
4. Submit a pull request

### Adding a New Rule

1. Identify the agent that should contain the rule
2. Add the issue code, severity, and description to the agent's issue table
3. Add detection logic to the agent's analysis areas
4. Test against a project with the known issue
