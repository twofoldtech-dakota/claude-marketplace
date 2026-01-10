---
name: analyze
description: Analyze XM Cloud projects for JSS patterns, GraphQL efficiency, and Next.js best practices
argument_hint: "[agent|all]"
---

# XM Cloud Analyzer

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"xm-cloud-analyzer\",\"command\":\"analyze\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---

Analyze Sitecore XM Cloud projects with comprehensive checks for JSS patterns, GraphQL efficiency, and Next.js best practices.

## Usage

```bash
/xm-cloud:analyze                # Run all agents
/xm-cloud:analyze all            # Run all agents (explicit)
/xm-cloud:analyze architecture   # App structure only
/xm-cloud:analyze security       # Security checks only
/xm-cloud:analyze performance    # Performance analysis only
/xm-cloud:analyze graphql        # GraphQL patterns only
/xm-cloud:analyze quality        # Code quality only
/xm-cloud:analyze dependencies   # npm analysis only
/xm-cloud:analyze conventions    # Naming/structure only
```

## Execution Flow

### Step 1: Detection

First, run the **detector** agent to identify:
- JSS version (21.x, 22.x)
- Next.js version (13.x, 14.x)
- Router type (App Router, Pages Router, Mixed)
- Deployment target (Vercel, Netlify, Docker)
- Features (Personalization, Multisite, i18n)

If detection identifies this as a Classic Sitecore project (App_Config, no xmcloud.build.json), recommend using `/sitecore-classic:analyze` instead and exit.

### Step 2: Run Requested Agents

Based on the argument:

| Argument | Agents to Run |
|----------|---------------|
| `all` (default) | All 8 agents |
| `architecture` | architecture |
| `security` | security |
| `performance` | performance |
| `graphql` | graphql |
| `quality` | code-quality |
| `dependencies` | dependencies |
| `conventions` | conventions |

### Step 3: Aggregate Results

Collect findings from all agents and generate consolidated report.

## Report Format

Generate a markdown report with this structure:

```markdown
# XM Cloud Analysis Report

**Generated**: [timestamp]
**Project Path**: [path]

## Summary

- **Platform**: XM Cloud (JSS [version], Next.js [version])
- **Router**: [App Router | Pages Router | Mixed]
- **Deployment**: [target]
- **Issues Found**: X (Y Critical, Z Warning, W Info)

## Scores

| Category | Score | Issues |
|----------|-------|--------|
| Architecture | [A-F] | N |
| TypeScript Quality | [A-F] | N |
| Security | [A-F] | N |
| Performance | [A-F] | N |
| GraphQL | [A-F] | N |

## Critical Issues

[List all Critical severity issues]

### [CODE] Issue Title
**Severity**: Critical
**Location**: `file:line`
**Issue**: Description
**Impact**: Why this matters
**Fix**: How to resolve (with code example if helpful)

## Warnings

[List all Warning severity issues]

## Info

[List all Info severity issues]

## Recommendations

[Prioritized list of recommended actions]
```

## Scoring

### Architecture Score
```
A: 0-1 issues, proper structure
B: 2-3 issues, minor inconsistencies
C: 4-5 issues, needs reorganization
D: 6+ issues, significant problems
F: Critical architectural issues
```

### Security Score
```
A: 0 Critical, 0-1 Warning
B: 0 Critical, 2-3 Warning
C: 1 Critical or 4-5 Warning
D: 2 Critical or 6+ Warning
F: 3+ Critical
```

### Performance Score
```
A: 0 Critical, 0-2 Warning, good SSG usage
B: 0 Critical, 3-4 Warning
C: 1 Critical or 5-6 Warning
D: 2 Critical or heavy SSR usage
F: 3+ Critical, major performance issues
```

### GraphQL Score
```
A: 0 Critical, uses fragments, good patterns
B: 0 Critical, minor inefficiencies
C: 1 Critical or no fragments
D: 2 Critical, N+1 patterns
F: 3+ Critical, severe over-fetching
```

### Code Quality Score
```
A: TypeScript strict, JSS patterns correct
B: Minor type issues, good JSS usage
C: Several type issues or missing patterns
D: Extensive any usage, missing wrappers
F: Critical code quality issues
```

## Issue Codes Reference

### Architecture (ARCH)
- ARCH-001: Mixed routers (Critical)
- ARCH-002: Scattered components (Warning)
- ARCH-003: Logic in pages (Warning)
- ARCH-004: Missing layouts (Warning)
- ARCH-005: Inconsistent folders (Info)
- ARCH-006: No utilities folder (Info)

### Security (SEC)
- SEC-001: Hardcoded API key (Critical)
- SEC-002: NEXT_PUBLIC_ exposure (Critical)
- SEC-003: Sensitive data in props (Critical)
- SEC-004: GraphQL introspection (Warning)
- SEC-005: Missing API auth (Warning)
- SEC-006: Permissive CORS (Warning)
- SEC-007: No env validation (Info)
- SEC-008: .env not gitignored (Info)

### Performance (PERF)
- PERF-001: SSR for static (Critical)
- PERF-002: Large imports (Warning)
- PERF-003: Unoptimized images (Warning)
- PERF-004: Missing revalidate (Warning)
- PERF-005: No code splitting (Warning)
- PERF-006: No font optimization (Info)
- PERF-007: No API caching (Info)
- PERF-008: Blocking scripts (Info)

### GraphQL (GQL)
- GQL-001: N+1 pattern (Critical)
- GQL-002: Over-fetching (Critical)
- GQL-003: No fragments (Warning)
- GQL-004: No error handling (Warning)
- GQL-005: Query in component (Warning)
- GQL-006: Deep nesting (Info)
- GQL-007: No caching (Info)

### Code Quality (CQ)
- CQ-001: Extensive `any` (Critical)
- CQ-002: Missing withDatasourceCheck (Critical)
- CQ-003: Direct field access (Warning)
- CQ-004: No error boundaries (Warning)
- CQ-005: Inline styles (Warning)
- CQ-006: Missing React.memo (Info)
- CQ-007: Console statements (Info)
- CQ-008: No strict mode (Info)

### Dependencies (DEP)
- DEP-001: Security vulnerability (Critical)
- DEP-002: JSS version mismatch (Critical)
- DEP-003: Outdated Next.js (Warning)
- DEP-004: Deprecated package (Warning)
- DEP-005: Large dependency (Warning)
- DEP-006: Updates available (Info)
- DEP-007: Peer dependency (Info)

### Conventions (CONV)
- CONV-001: Non-PascalCase component (Warning)
- CONV-002: Hook without use (Warning)
- CONV-003: Generic query name (Warning)
- CONV-004: Inconsistent CSS (Info)
- CONV-005: Non-colocated tests (Info)
- CONV-006: Deep relative imports (Info)
- CONV-007: Interface naming (Info)

## Notes

- Analysis is read-only and does not modify any files
- Results based on static analysis; runtime may differ
- npm audit requires npm to be available
- Some checks are version-specific (JSS 21 vs 22)
