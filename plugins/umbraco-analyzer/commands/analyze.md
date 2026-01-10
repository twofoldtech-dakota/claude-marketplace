---
name: analyze
description: Analyze Umbraco 14-16 projects for architecture, security, and backoffice patterns
argument_hint: "[agent|all]"
---

# Umbraco Analyzer

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"umbraco-analyzer\",\"command\":\"analyze\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---

Analyze Umbraco 14-16 projects with comprehensive checks for architecture, security, backoffice extensions, and performance.

## Usage

```bash
/umbraco:analyze                 # Run all agents
/umbraco:analyze all             # Run all agents (explicit)
/umbraco:analyze architecture    # Project structure only
/umbraco:analyze security        # Security checks only
/umbraco:analyze performance     # Performance analysis only
/umbraco:analyze backoffice      # Backoffice extensions only
/umbraco:analyze api             # API patterns only
/umbraco:analyze quality         # Code quality only
/umbraco:analyze dependencies    # NuGet analysis only
/umbraco:analyze conventions     # Naming/structure only
```

## Execution Flow

### Step 1: Detection

First, run the **detector** agent to identify:
- Umbraco version (14.x, 15.x, 16.x)
- .NET version (8.0, 9.0, 10.0)
- Backoffice type (Lit, AngularJS legacy)
- Features (Content Delivery API, Block Grid, Custom Property Editors)

### Step 2: Run Requested Agents

Based on the argument:

| Argument | Agents to Run |
|----------|---------------|
| `all` (default) | All 9 agents |
| `architecture` | architecture |
| `security` | security |
| `performance` | performance |
| `backoffice` | backoffice |
| `api` | api |
| `quality` | code-quality |
| `dependencies` | dependencies |
| `conventions` | conventions |

### Step 3: Aggregate Results

Collect findings from all agents and generate consolidated report.

## Report Format

```markdown
# Umbraco Analysis Report

**Generated**: [timestamp]
**Project Path**: [path]

## Summary

- **Platform**: Umbraco [version] on .NET [version]
- **Backoffice**: [Lit | AngularJS (legacy)]
- **Features**: [list]
- **Issues Found**: X (Y Critical, Z Warning, W Info)

## Scores

| Category | Score | Issues |
|----------|-------|--------|
| Architecture | [A-F] | N |
| Security | [A-F] | N |
| Performance | [A-F] | N |
| Backoffice | [A-F] | N |
| Code Quality | [A-F] | N |

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
A: 0 Critical, proper Composer patterns
B: 0 Critical, minor organizational issues
C: 1 Critical or several warnings
D: 2+ Critical
F: Major architectural problems
```

### Security Score
```
A: 0 Critical, Content Delivery API secured
B: 0 Critical, minor config issues
C: 1 Critical
D: 2 Critical
F: 3+ Critical or public API without auth
```

### Performance Score
```
A: Using HybridCache (v15+), no traversal issues
B: Minor caching issues
C: Unbounded traversal or wrong context usage
D: Multiple performance anti-patterns
F: Critical performance issues
```

### Backoffice Score
```
A: Modern Lit components, typed TypeScript
B: Minor TypeScript issues
C: AngularJS in v14+ or missing registrations
D: Multiple backoffice issues
F: Legacy code blocking functionality
```

## Issue Codes Reference

### Architecture (ARCH)
- ARCH-001: Service Locator (Critical)
- ARCH-002: Composer too large (Warning)
- ARCH-003: Circular dependency (Warning)
- ARCH-004: Fat controller (Warning)
- ARCH-005: Missing interface (Info)
- ARCH-006: Incorrect lifetime (Info)

### Security (SEC)
- SEC-001: Content Delivery API public (Critical)
- SEC-002: Hardcoded credentials (Critical)
- SEC-003: Backoffice exposed (Warning)
- SEC-004: Missing rate limiting (Warning)
- SEC-005: Permissive CORS (Warning)
- SEC-006: Default admin path (Info)
- SEC-007: Insecure cookies (Info)

### Performance (PERF)
- PERF-001: Unbounded traversal (Critical)
- PERF-002: Not using HybridCache (Warning)
- PERF-003: IUmbracoContext in singleton (Warning)
- PERF-004: Missing image cache (Warning)
- PERF-005: No custom index (Info)
- PERF-006: Slow handler (Info)

### Backoffice (BO)
- BO-001: AngularJS in v14+ (Critical)
- BO-002: Missing manifest (Warning)
- BO-003: Untyped TypeScript (Warning)
- BO-004: Style leaking (Warning)
- BO-005: Not using UUI (Info)
- BO-006: Missing types (Info)

### API (API)
- API-001: Sensitive data exposed (Critical)
- API-002: No versioning (Warning)
- API-003: Inconsistent errors (Warning)
- API-004: No caching (Warning)
- API-005: No documentation (Info)
- API-006: No rate limiting (Info)

### Code Quality (CQ)
- CQ-001: Sync over async (Critical)
- CQ-002: Logic in controller (Warning)
- CQ-003: Missing cancellation token (Warning)
- CQ-004: Empty catch (Warning)
- CQ-005: Missing docs (Info)
- CQ-006: Unused parameter (Info)

### Dependencies (DEP)
- DEP-001: Security vulnerability (Critical)
- DEP-002: Incompatible package (Critical)
- DEP-003: Deprecated package (Warning)
- DEP-004: .NET mismatch (Warning)
- DEP-005: Version conflict (Warning)
- DEP-006: Update available (Info)
- DEP-007: Upgrade blocker (Info)

### Conventions (CONV)
- CONV-001: Doc type naming (Warning)
- CONV-002: Property alias (Warning)
- CONV-003: Template mismatch (Warning)
- CONV-004: Generic Composer (Warning)
- CONV-005: Partial prefix (Info)
- CONV-006: Flat config (Info)
- CONV-007: Ambiguous model (Info)

## Version-Specific Checks

### Umbraco 14 (.NET 8)
- Check for Lit components
- Verify AngularJS is not used
- Block Grid support

### Umbraco 15 (.NET 9)
- Check HybridCache usage
- Content Delivery API v2
- Performance improvements

### Umbraco 16 (.NET 9/10)
- TipTap editor
- Management API v2
- Document type inheritance

## Notes

- Analysis is read-only and does not modify any files
- Results based on static analysis; runtime may differ
- `dotnet list package --vulnerable` requires .NET CLI
- Some checks are version-specific
