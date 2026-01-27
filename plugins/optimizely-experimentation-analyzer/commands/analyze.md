---
name: analyze
description: Analyze Optimizely Experimentation implementations for A/B testing, feature flags, and SDK patterns
argument_hint: "[agent|all]"
---

# Optimizely Experimentation Analyzer

Analyze Optimizely Experimentation (Full Stack SDK, React SDK, Web) implementations for A/B testing, feature flags, and performance patterns.

## Usage

```bash
/optimizely-exp:analyze                    # Run all agents
/optimizely-exp:analyze all                # Run all agents (explicit)
/optimizely-exp:analyze implementation     # SDK implementation only
/optimizely-exp:analyze experiments        # A/B test patterns only
/optimizely-exp:analyze feature-flags      # Feature flag patterns only
/optimizely-exp:analyze events             # Event tracking only
/optimizely-exp:analyze security           # Security checks only
/optimizely-exp:analyze performance        # Performance analysis only
/optimizely-exp:analyze quality            # Code quality only
```

## Report Output

By default, the analysis report is written to a markdown file in the `docs/` directory.

### Output Options

| Option | Description |
|--------|-------------|
| (default) | Write to `docs/optimizely-exp-analysis-{date}.md` |
| `--output <path>` | Custom output path |
| `--no-file` | Display report only, don't write to file |

### Examples

```bash
# Default: writes to docs/optimizely-exp-analysis-2026-01-25.md
/optimizely-exp:analyze

# Custom output path
/optimizely-exp:analyze --output ./reports/latest.md

# Display only, no file output
/optimizely-exp:analyze --no-file
```

## Execution Flow

### Step 1: Detection

First, run the **detector** agent to identify:
- SDK type (Full Stack, React SDK, Web snippet)
- SDK version
- Framework (React, Next.js, Vue, etc.)
- Configuration pattern

### Step 2: Run Requested Agents

Based on the argument:

| Argument | Agents to Run |
|----------|---------------|
| `all` (default) | All 8 agents |
| `implementation` | implementation |
| `experiments` | experiments |
| `feature-flags` | feature-flags |
| `events` | events |
| `security` | security |
| `performance` | performance |
| `quality` | code-quality |

### Step 3: Aggregate Results

Collect findings from all agents and generate consolidated report.

## Report Format

```markdown
# Optimizely Experimentation Analysis Report

**Generated**: [timestamp]
**Project Path**: [path]

## Summary

- **SDK**: Optimizely [Full Stack | React SDK | Web] v[version]
- **Framework**: [React | Next.js | Vue | etc.]
- **Features**: [Feature Flags, A/B Testing, Events]
- **Issues Found**: X (Y Critical, Z Warning, W Info)

## Scores

| Category | Score | Issues |
|----------|-------|--------|
| Implementation | [A-F] | N |
| Experiments | [A-F] | N |
| Feature Flags | [A-F] | N |
| Events | [A-F] | N |
| Security | [A-F] | N |
| Performance | [A-F] | N |
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

## Issue Codes Reference

### Implementation (IMPL)
- IMPL-001: SDK without datafile (Critical)
- IMPL-002: Blocking initialization (Critical)
- IMPL-003: No error handling (Warning)
- IMPL-004: Inconsistent user ID (Warning)
- IMPL-005: Bad hooks usage (Warning)
- IMPL-006: Hardcoded SDK key (Info)

### Experiments (EXP)
- EXP-001: Variation after render/flicker (Critical)
- EXP-002: No tracking event (Warning)
- EXP-003: Unmemoized decision (Warning)
- EXP-004: SSR without hydration (Warning)
- EXP-005: Missing documentation (Info)

### Feature Flags (FF)
- FF-001: No default value (Warning)
- FF-002: Untyped variables (Warning)
- FF-003: Render loop evaluation (Warning)
- FF-004: Stale flag (Info)
- FF-005: Missing documentation (Info)

### Events (EVT)
- EVT-001: PII in events (Critical)
- EVT-002: No user context (Warning)
- EVT-003: No batching (Warning)
- EVT-004: Undocumented events (Info)

### Security (SEC)
- SEC-001: Private key exposed (Critical)
- SEC-002: Datafile URL exposed (Warning)
- SEC-003: Missing CSP (Warning)
- SEC-004: Third-party events (Info)

### Performance (PERF)
- PERF-001: Sync SDK load (Critical)
- PERF-002: No anti-flicker (Critical)
- PERF-003: No datafile cache (Warning)
- PERF-004: Too many decisions (Warning)
- PERF-005: Full SDK import (Info)

### Code Quality (CQ)
- CQ-001: Missing types (Warning)
- CQ-002: Hooks rules violation (Warning)
- CQ-003: No error boundary (Warning)
- CQ-004: No tests (Warning)
- CQ-005: Scattered code (Info)

## Notes

- Analysis is read-only and does not modify any files
- Results based on static analysis; runtime may differ
- Some checks are SDK-specific
