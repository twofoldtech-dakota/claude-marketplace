---
name: analyze
description: Analyze Umbraco 14-16 projects for architecture, security, and backoffice patterns
argument_hint: "[agent|all]"
---

# Umbraco Analyzer

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

## Report Output

By default, the analysis report is written to a markdown file in the `docs/` directory.

### Output Options

| Option | Description |
|--------|-------------|
| (default) | Write to `docs/umbraco-analysis-{date}.md` |
| `--output <path>` | Custom output path |
| `--no-file` | Display report only, don't write to file |
| `--severity <level>` | Filter issues by minimum severity: `critical`, `warning`, or `info` |
| `--baseline <path>` | Suppress known issues listed in baseline file |
| `--changes-only` | Only analyze files changed since last commit (git diff)

### Examples

```bash
# Default: writes to docs/umbraco-analysis-2026-01-11.md
/umbraco:analyze

# Custom output path
/umbraco:analyze --output ./reports/latest.md

# Display only, no file output
/umbraco:analyze --no-file
```

### File Output Behavior

When generating the report:

1. Create the output directory if it doesn't exist:
   ```bash
   mkdir -p docs
   ```

2. Generate filename with timestamp:
   - Format: `umbraco-analysis-YYYY-MM-DD.md`
   - If file exists, append time: `umbraco-analysis-YYYY-MM-DD-HHmmss.md`

3. Write the full markdown report to the file

4. Display confirmation:
   ```
   Report saved to: docs/umbraco-analysis-2026-01-11.md
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

## Filtering & Baseline

### Severity Filtering

Use `--severity` to focus on specific issue levels:

```bash
# Show only critical issues
/umbraco:analyze --severity critical

# Show critical and warnings (skip info)
/umbraco:analyze --severity warning
```

### Issue Baseline

Use `--baseline` to suppress known/accepted issues:

```bash
# Use baseline file
/umbraco:analyze --baseline .claude/analyzer-baseline.json

# Generate baseline from current issues
/umbraco:analyze --output .claude/analyzer-baseline.json --baseline-generate
```

**Baseline file format** (`.claude/analyzer-baseline.json`):
```json
{
  "version": "1.0",
  "created": "2026-01-27T10:00:00Z",
  "issues": [
    {
      "code": "BO-001",
      "location": "App_Plugins/legacy-editor/editor.controller.js",
      "reason": "Third-party plugin, awaiting update",
      "expires": "2026-06-01"
    }
  ]
}
```

### Incremental Analysis

Use `--changes-only` for faster CI/CD feedback:

```bash
# Analyze only changed files
/umbraco:analyze --changes-only

# Combine with severity filter
/umbraco:analyze --changes-only --severity warning
```

This uses `git diff` to identify changed files and only runs analysis on those files.

## Notes

- Analysis is read-only and does not modify any files
- Results based on static analysis; runtime may differ
- `dotnet list package --vulnerable` requires .NET CLI
- Some checks are version-specific
- `--changes-only` requires git to be available
