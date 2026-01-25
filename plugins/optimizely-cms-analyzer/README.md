# Optimizely CMS Analyzer

Analyze Optimizely CMS (formerly Episerver) projects for architecture, security, content modeling, and performance patterns.

## Supported Versions

| Platform | Version | .NET |
|----------|---------|------|
| Optimizely CMS | 12.x | .NET 6+ |
| Optimizely CMS | 13.x | .NET 8+ |
| Episerver CMS | 11.x | .NET Framework 4.7.2+ |
| Episerver CMS | 10.x | .NET Framework 4.6.1+ |

## Commands

### Analyze

Run comprehensive analysis on your Optimizely CMS project:

```bash
/optimizely:analyze                    # Run all agents
/optimizely:analyze all                # Run all agents (explicit)
/optimizely:analyze architecture       # Project structure only
/optimizely:analyze content-modeling   # Content types only
/optimizely:analyze security           # Security checks only
/optimizely:analyze performance        # Performance analysis only
/optimizely:analyze quality            # Code quality only
/optimizely:analyze dependencies       # NuGet analysis only
/optimizely:analyze conventions        # Naming/structure only
/optimizely:analyze experimentation    # A/B testing integration only
```

### Output Options

```bash
/optimizely:analyze                      # Write to docs/optimizely-analysis-{date}.md
/optimizely:analyze --output ./report.md # Custom output path
/optimizely:analyze --no-file            # Display only, no file output
/optimizely:analyze --safe-mode          # Structure only, no file contents
```

### Other Commands

```bash
/optimizely:enhance              # Generate project-specific AI skills
/optimizely:security-scan        # Preview analysis scope
/optimizely:setup                # Initial configuration
```

## Analysis Categories

### Architecture (ARCH)
- Service Locator anti-patterns
- Initialization module issues
- Controller complexity
- Dependency injection patterns

### Content Modeling (CM)
- Content type GUID requirements
- Block and page inheritance
- Property validation
- Content area restrictions

### Security (SEC)
- Content Delivery API exposure
- Credential management
- CORS configuration
- Authentication patterns

### Performance (PERF)
- Content loading patterns
- Caching strategies
- CDN configuration
- N+1 query detection

### Code Quality (CQ)
- Async/await patterns
- Service abstractions
- Error handling
- Cancellation tokens

### Dependencies (DEP)
- NuGet compatibility
- Security vulnerabilities
- Version conflicts
- Upgrade blockers

### Conventions (CONV)
- Naming standards
- Project structure
- Template organization

### Experimentation (EXP)
- Optimizely Experimentation SDK integration
- Feature flag patterns
- A/B testing configuration

## Report Format

Analysis generates a markdown report with:
- Platform detection summary
- Category scores (A-F)
- Critical issues requiring immediate attention
- Warnings and recommendations
- Prioritized action items

## Detection

The analyzer identifies Optimizely projects via:
- NuGet packages: `Optimizely.CMS.Core`, `EPiServer.CMS.Core`
- Configuration: `appsettings.json` with Optimizely/EPiServer sections
- Startup patterns: `.AddCms()`, `.AddEpiserverCms()`

## Privacy

- Analysis is read-only
- No code is transmitted externally
- Optional usage tracking can be disabled with `CLAUDE_PLUGIN_NO_TRACKING=1`
