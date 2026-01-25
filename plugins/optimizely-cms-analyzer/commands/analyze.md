---
name: analyze
description: Analyze Optimizely CMS projects for architecture, security, content modeling, and performance patterns
argument_hint: "[agent|all]"
---

# Optimizely CMS Analyzer

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"optimizely-cms-analyzer\",\"command\":\"analyze\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---

Analyze Optimizely CMS (formerly Episerver) projects with comprehensive checks for architecture, security, content modeling, and performance.

## Usage

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

## Report Output

By default, the analysis report is written to a markdown file in the `docs/` directory.

### Output Options

| Option | Description |
|--------|-------------|
| (default) | Write to `docs/optimizely-analysis-{date}.md` |
| `--output <path>` | Custom output path |
| `--no-file` | Display report only, don't write to file |
| `--safe-mode` | Analyze structure only, don't read file contents |

### Examples

```bash
# Default: writes to docs/optimizely-analysis-2026-01-25.md
/optimizely:analyze

# Custom output path
/optimizely:analyze --output ./reports/latest.md

# Display only, no file output
/optimizely:analyze --no-file

# Safe mode: structure only
/optimizely:analyze --safe-mode
```

### File Output Behavior

When generating the report:

1. Create the output directory if it doesn't exist:
   ```bash
   mkdir -p docs
   ```

2. Generate filename with timestamp:
   - Format: `optimizely-analysis-YYYY-MM-DD.md`
   - If file exists, append time: `optimizely-analysis-YYYY-MM-DD-HHmmss.md`

3. Write the full markdown report to the file

4. Display confirmation:
   ```
   Report saved to: docs/optimizely-analysis-2026-01-25.md
   ```

## Execution Flow

### Step 1: Detection

First, run the **detector** agent to identify:
- Platform (Optimizely CMS vs legacy Episerver)
- Version (10.x, 11.x, 12.x, 13.x)
- .NET version (Framework 4.x, .NET 6, .NET 8)
- Deployment model (Content Cloud vs Self-Hosted)
- Enabled features (Commerce, Forms, Content Delivery API, etc.)

### Step 2: Run Requested Agents

Based on the argument:

| Argument | Agents to Run |
|----------|---------------|
| `all` (default) | All 9 agents |
| `architecture` | architecture |
| `content-modeling` | content-modeling |
| `security` | security |
| `performance` | performance |
| `quality` | code-quality |
| `dependencies` | dependencies |
| `conventions` | conventions |
| `experimentation` | experimentation |

### Step 3: Aggregate Results

Collect findings from all agents and generate consolidated report.

## Report Format

```markdown
# Optimizely CMS Analysis Report

**Generated**: [timestamp]
**Project Path**: [path]

## Summary

- **Platform**: Optimizely CMS [version] on .NET [version]
- **Deployment**: [Content Cloud | Self-Hosted]
- **Features**: [list of enabled features]
- **Issues Found**: X (Y Critical, Z Warning, W Info)

## Scores

| Category | Score | Issues |
|----------|-------|--------|
| Architecture | [A-F] | N |
| Content Modeling | [A-F] | N |
| Security | [A-F] | N |
| Performance | [A-F] | N |
| Code Quality | [A-F] | N |
| Dependencies | [A-F] | N |

## Critical Issues
[List all Critical issues]

## Warnings
[List all Warnings]

## Info
[List all Info items]

## Recommendations
[Prioritized actions]
```

## Scoring

### Architecture Score
```
A: 0 Critical, proper DI patterns, no ServiceLocator
B: 0 Critical, minor organizational issues
C: 1 Critical or several warnings
D: 2+ Critical
F: Major architectural problems (ServiceLocator abuse, circular dependencies)
```

### Content Modeling Score
```
A: All content types have GUIDs, proper inheritance
B: Minor issues (missing Display attributes)
C: 1 Critical (missing GUID) or several warnings
D: 2+ Critical
F: Widespread content modeling issues
```

### Security Score
```
A: 0 Critical, Content Delivery API secured, no exposed credentials
B: 0 Critical, minor config issues
C: 1 Critical
D: 2 Critical
F: 3+ Critical or public API without authentication
```

### Performance Score
```
A: Proper caching, no N+1 queries, bounded content loading
B: Minor caching issues
C: Unbounded GetChildren or N+1 patterns
D: Multiple performance anti-patterns
F: Critical performance issues (blocking calls, memory leaks)
```

### Code Quality Score
```
A: Proper async patterns, service abstractions, error handling
B: Minor issues (missing cancellation tokens)
C: Sync-over-async or logic in controllers
D: Multiple code quality issues
F: Widespread anti-patterns
```

### Dependencies Score
```
A: All packages compatible, no vulnerabilities
B: Minor version mismatches
C: Deprecated packages or 1 vulnerability
D: Multiple compatibility issues
F: Security vulnerabilities or major incompatibilities
```

## Issue Codes Reference

### Architecture (ARCH)
- ARCH-001: Service Locator usage (Critical)
- ARCH-002: Fat controller (Warning)
- ARCH-003: Circular initialization dependencies (Warning)
- ARCH-004: Missing IContentRepository abstraction (Warning)
- ARCH-005: Initialization module anti-pattern (Warning)
- ARCH-006: Direct DbContext bypass (Info)

### Content Modeling (CM)
- CM-001: Content type without GUID (Critical)
- CM-002: Block without interface inheritance (Warning)
- CM-003: Unbounded content area (Warning)
- CM-004: Missing validation attributes (Warning)
- CM-005: Property naming convention (Info)
- CM-006: Missing Display attribute (Info)

### Security (SEC)
- SEC-001: Content Delivery API publicly accessible (Critical)
- SEC-002: Hardcoded credentials (Critical)
- SEC-003: Missing CSRF protection (Critical)
- SEC-004: Content Delivery API without authentication (Warning)
- SEC-005: Admin accessible from public (Warning)
- SEC-006: Permissive CORS configuration (Warning)
- SEC-007: Default virtual roles unchanged (Info)

### Performance (PERF)
- PERF-001: GetChildren without Take() limit (Critical)
- PERF-002: N+1 content loading in loops (Critical)
- PERF-003: Not using IContentLoader (cached) (Warning)
- PERF-004: Missing output cache policy (Warning)
- PERF-005: CDN not configured (Content Cloud) (Warning)
- PERF-006: No content cache dependency (Info)

### Code Quality (CQ)
- CQ-001: Sync over async (Critical)
- CQ-002: Business logic in controller (Warning)
- CQ-003: Missing cancellation token (Warning)
- CQ-004: Empty catch block (Warning)
- CQ-005: Missing XML documentation (Info)
- CQ-006: Unused parameter (Info)

### Dependencies (DEP)
- DEP-001: Security vulnerability (Critical)
- DEP-002: Incompatible package version (Critical)
- DEP-003: Deprecated package (Warning)
- DEP-004: .NET version mismatch (Warning)
- DEP-005: Version conflict (Warning)
- DEP-006: Update available (Info)
- DEP-007: Upgrade blocker identified (Info)

### Conventions (CONV)
- CONV-001: Content type naming (Warning)
- CONV-002: Property alias convention (Warning)
- CONV-003: View/template mismatch (Warning)
- CONV-004: Non-specific initialization module (Warning)
- CONV-005: Partial view prefix (Info)
- CONV-006: Flat configuration structure (Info)

### Experimentation (EXP)
- EXP-001: Experimentation SDK without initialization (Warning)
- EXP-002: Feature flags not using typed accessors (Warning)
- EXP-003: Experimentation tracking not configured (Info)
- EXP-004: Missing user context for personalization (Info)

## Version-Specific Checks

### Optimizely CMS 13 (.NET 8)
- Check for latest Content Delivery API patterns
- Verify .NET 8 async patterns
- Check for minimal API usage

### Optimizely CMS 12 (.NET 6/7)
- Content Delivery API v2 patterns
- .NET 6+ configuration patterns
- Nullable reference types

### Episerver CMS 11 (.NET Framework)
- Legacy ServiceLocator detection
- web.config-based configuration
- Sync vs async patterns

### Episerver CMS 10 (.NET Framework)
- Legacy patterns
- EPiServerProfile configuration
- Classic MVC patterns

## Notes

- Analysis is read-only and does not modify any files
- Results based on static analysis; runtime may differ
- `dotnet list package --vulnerable` requires .NET CLI
- Some checks are version-specific
- Content Cloud projects may have additional cloud-specific recommendations
