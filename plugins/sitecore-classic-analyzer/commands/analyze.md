---
name: analyze
description: Analyze Sitecore 10.x projects for architecture, security, and performance issues
argument_hint: "[agent|all]"
---

# Sitecore Classic Analyzer

Analyze Sitecore 10.x projects with comprehensive checks for Helix compliance, security, and performance.

## Usage

```bash
/sitecore-classic:analyze              # Run all agents
/sitecore-classic:analyze all          # Run all agents (explicit)
/sitecore-classic:analyze architecture # Helix compliance only
/sitecore-classic:analyze security     # Security checks only
/sitecore-classic:analyze performance  # Performance analysis only
/sitecore-classic:analyze serialization # Serialization config only
/sitecore-classic:analyze quality      # Code quality only
/sitecore-classic:analyze dependencies # NuGet analysis only
/sitecore-classic:analyze conventions  # Naming/structure only
```

## Report Output

By default, the analysis report is written to a markdown file in the `docs/` directory.

### Output Options

| Option | Description |
|--------|-------------|
| (default) | Write to `docs/sitecore-classic-analysis-{date}.md` |
| `--output <path>` | Custom output path |
| `--no-file` | Display report only, don't write to file |
| `--severity <level>` | Filter issues by minimum severity: `critical`, `warning`, or `info` |
| `--baseline <path>` | Suppress known issues listed in baseline file |
| `--changes-only` | Only analyze files changed since last commit (git diff)

### Examples

```bash
# Default: writes to docs/sitecore-classic-analysis-2026-01-11.md
/sitecore-classic:analyze

# Custom output path
/sitecore-classic:analyze --output ./reports/latest.md

# Display only, no file output
/sitecore-classic:analyze --no-file
```

### File Output Behavior

When generating the report:

1. Create the output directory if it doesn't exist:
   ```bash
   mkdir -p docs
   ```

2. Generate filename with timestamp:
   - Format: `sitecore-classic-analysis-YYYY-MM-DD.md`
   - If file exists, append time: `sitecore-classic-analysis-YYYY-MM-DD-HHmmss.md`

3. Write the full markdown report to the file

4. Display confirmation:
   ```
   Report saved to: docs/sitecore-classic-analysis-2026-01-11.md
   ```

## Execution Flow

### Step 1: Detection

First, run the **detector** agent to identify:
- Sitecore version (10.0, 10.1, 10.2, 10.3, 10.4)
- Architecture type (Helix or Traditional)
- Installed modules (SXA, Commerce, Forms, JSS)
- Serialization format (SCS, Unicorn, TDS)

If detection identifies this as an XM Cloud project (xmcloud.build.json present), recommend using `/xm-cloud:analyze` instead and exit.

### Step 2: Run Requested Agents

Based on the argument:

| Argument | Agents to Run |
|----------|---------------|
| `all` (default) | All 8 agents |
| `architecture` | architecture |
| `security` | security |
| `performance` | performance |
| `serialization` | serialization |
| `quality` | code-quality |
| `dependencies` | dependencies |
| `conventions` | conventions |

### Step 3: Aggregate Results

Collect findings from all agents and generate consolidated report.

## Report Format

Generate a markdown report with this structure:

```markdown
# Sitecore Classic Analysis Report

**Generated**: [timestamp]
**Project Path**: [path]

## Summary

- **Platform**: Sitecore [version] ([architecture])
- **Modules**: [list of detected modules]
- **Serialization**: [format]
- **Issues Found**: X (Y Critical, Z Warning, W Info)

## Scores

| Category | Score | Issues |
|----------|-------|--------|
| Helix Compliance | XX% | N |
| Security | [A-F] | N |
| Performance | [A-F] | N |
| Code Quality | [A-F] | N |

## Critical Issues

[List all Critical severity issues with full details]

### [CODE] Issue Title
**Severity**: Critical
**Location**: `file:line`
**Issue**: Description of what's wrong
**Impact**: Why this matters
**Fix**: How to resolve

## Warnings

[List all Warning severity issues]

## Info

[List all Info severity issues]

## Recommendations

[Prioritized list of recommended actions]

1. [Most important action]
2. [Second priority]
3. ...
```

## Scoring

### Helix Compliance Score
```
Score = (Valid Dependencies / Total Dependencies) × 100
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
A: 0 Critical, 0-2 Warning
B: 0 Critical, 3-4 Warning
C: 1 Critical or 5-6 Warning
D: 2 Critical or 7+ Warning
F: 3+ Critical
```

### Code Quality Score
```
A: 0 Critical, 0-3 Warning
B: 0 Critical, 4-6 Warning
C: 1 Critical or 7-9 Warning
D: 2 Critical or 10+ Warning
F: 3+ Critical
```

## Issue Codes Reference

### Architecture (ARCH)
- ARCH-001: Cross-Feature dependency (Critical)
- ARCH-002: Upward dependency (Critical)
- ARCH-003: God module (Warning)
- ARCH-004: Config in wrong layer (Warning)
- ARCH-005: Missing Helix layer (Warning)
- ARCH-006: Non-standard naming (Info)
- ARCH-007: Empty module (Info)

### Security (SEC)
- SEC-001: Hardcoded credentials (Critical)
- SEC-002: Connection string password (Critical)
- SEC-003: API key in source (Critical)
- SEC-004: Permissive CORS (Warning)
- SEC-005: Missing anti-forgery (Warning)
- SEC-006: Debug mode enabled (Warning)
- SEC-007: CustomErrors Off (Warning)
- SEC-008: Default admin path (Info)
- SEC-009: Potential XSS (Info)

### Performance (PERF)
- PERF-001: Sitecore.Query in loop (Critical)
- PERF-002: Unbounded GetDescendants (Critical)
- PERF-003: No rendering cache (Warning)
- PERF-004: Missing VaryBy (Warning)
- PERF-005: No pagination (Warning)
- PERF-006: No computed fields (Warning)
- PERF-007: No custom cache (Info)
- PERF-008: No CDN for media (Info)

### Serialization (SER)
- SER-001: Mixed formats (Critical)
- SER-002: Sensitive data (Critical)
- SER-003: User credentials (Critical)
- SER-004: Overlapping paths (Warning)
- SER-005: Wrong layer (Warning)
- SER-006: Missing predicate (Warning)
- SER-007: Missing languages (Info)
- SER-008: Orphaned files (Info)

### Code Quality (CQ)
- CQ-001: Service Locator (Critical)
- CQ-002: Static Context in async (Critical)
- CQ-003: Missing null checks (Warning)
- CQ-004: Logic in controller (Warning)
- CQ-005: Raw database queries (Warning)
- CQ-006: Missing interface (Info)
- CQ-007: Lazy loading in loop (Info)

### Dependencies (DEP)
- DEP-001: Security vulnerability (Critical)
- DEP-002: Version mismatch (Critical)
- DEP-003: Deprecated package (Warning)
- DEP-004: Version conflict (Warning)
- DEP-005: Incompatible Glass (Warning)
- DEP-006: Outdated package (Info)
- DEP-007: Missing binding redirect (Info)

### Conventions (CONV)
- CONV-001: Template naming (Warning)
- CONV-002: Field naming (Warning)
- CONV-003: Config naming (Warning)
- CONV-004: Folder structure (Warning)
- CONV-005: Missing icon (Info)
- CONV-006: Missing standard values (Info)
- CONV-007: Rendering naming (Info)

## Filtering & Baseline

### Severity Filtering

Use `--severity` to focus on specific issue levels:

```bash
# Show only critical issues
/sitecore-classic:analyze --severity critical

# Show critical and warnings (skip info)
/sitecore-classic:analyze --severity warning
```

### Issue Baseline

Use `--baseline` to suppress known/accepted issues:

```bash
# Use baseline file
/sitecore-classic:analyze --baseline .claude/analyzer-baseline.json

# Generate baseline from current issues
/sitecore-classic:analyze --output .claude/analyzer-baseline.json --baseline-generate
```

**Baseline file format** (`.claude/analyzer-baseline.json`):
```json
{
  "version": "1.0",
  "created": "2026-01-27T10:00:00Z",
  "issues": [
    {
      "code": "ARCH-001",
      "location": "src/Feature/Navigation/code/Services/NavigationService.cs",
      "reason": "Legacy code, scheduled for refactoring in Q2",
      "expires": "2026-06-01"
    }
  ]
}
```

### Incremental Analysis

Use `--changes-only` for faster CI/CD feedback:

```bash
# Analyze only changed files
/sitecore-classic:analyze --changes-only

# Combine with severity filter
/sitecore-classic:analyze --changes-only --severity warning
```

This uses `git diff` to identify changed files and only runs analysis on those files.

## Notes

- Analysis is read-only and does not modify any files
- Results are based on static analysis; runtime behavior may differ
- Some checks require access to serialization files to analyze templates
- Dependency vulnerability check requires `dotnet` CLI to be available
- `--changes-only` requires git to be available
