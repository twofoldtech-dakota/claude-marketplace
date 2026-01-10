# /sitecore-classic:security-scan

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"sitecore-classic-analyzer\",\"command\":\"security-scan\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---

Preview what files will be analyzed before running the full analysis. Identifies potentially sensitive files and recommends exclusions.

## Command Syntax

```bash
/sitecore-classic:security-scan
```

## Purpose

Run this command before `/sitecore-classic:analyze` to:
1. See exactly what files will be scanned
2. Identify potentially sensitive files
3. Get recommended `.claudeignore` additions
4. Ensure compliance with security policies

## Output

### Files That Will Be Analyzed

```markdown
## Files That Will Be Analyzed

| File Type | Count | Examples |
|-----------|-------|----------|
| .cs | 145 | Controllers, Services, Models |
| .cshtml | 67 | Views, Layouts |
| .config | 28 | Sitecore patches, web.config |
| .csproj | 12 | Project files |
| .json | 8 | Serialization modules |
| .yml | 234 | Serialized items |

**Total**: 494 files
```

### Potentially Sensitive Files Detected

```markdown
## Potentially Sensitive Files Detected

| File | Risk Level | Reason | Recommendation |
|------|------------|--------|----------------|
| App_Config/ConnectionStrings.config | Critical | Contains database credentials | Add to .claudeignore |
| App_Config/Include/Security/*.config | High | Security configurations | Add to .claudeignore |
| web.config | High | May contain credentials | Review before analysis |
| App_Config/Include/*.secret.config | Critical | Secret configurations | Add to .claudeignore |
| serialization/Core/Security/Users/*.yml | Critical | User accounts | Add to .claudeignore |
| license.xml | Medium | License information | Add to .claudeignore |

**Critical files found**: 4
**High-risk files found**: 8
```

### Recommended .claudeignore Additions

```markdown
## Recommended .claudeignore Additions

Add these patterns to your `.claudeignore` file:

```gitignore
# Auto-detected sensitive files
App_Config/ConnectionStrings.config
App_Config/Include/Security/*
App_Config/Include/*.secret.config
serialization/**/Security/Users/**
license.xml
*.pfx
*.key
```

### Command to apply:
```bash
/sitecore-classic:setup --generate-ignore
```
```

### Current .claudeignore Status

```markdown
## Current .claudeignore Status

{.claudeignore found | .claudeignore not found}

### Current Exclusions
{List of current patterns or "No exclusions configured"}

### Coverage Analysis
- Files excluded by current rules: {count}
- Sensitive files NOT excluded: {count}
- Recommended additional exclusions: {count}
```

## Detection Patterns

### Critical Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `ConnectionStrings` | .config | Database credentials |
| `password=` | .config, .cs | Hardcoded passwords |
| `apikey` | .config, .cs, .json | API credentials |
| `secret` | .config | Secret values |
| `/Users/*.yml` | .yml | User serialization |

### High Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `web.config` | .config | Application settings |
| `/Security/` | .config, .yml | Security configurations |
| `license` | .xml | License information |
| `.pfx`, `.key` | certificates | Private keys |

### Medium Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `appsettings` | .json | Application settings |
| `/Roles/*.yml` | .yml | Role definitions |
| `transform` | .config | Environment configs |

## Execution Flow

```
1. Scan project structure
   └── Count files by type
   └── Identify Sitecore-specific paths

2. Check for sensitive patterns
   └── Scan file names for risk patterns
   └── Quick content scan for credentials

3. Analyze current .claudeignore
   └── Load existing exclusions
   └── Calculate coverage

4. Generate recommendations
   └── List unprotected sensitive files
   └── Suggest .claudeignore additions

5. Output security report
```

## Next Steps

After reviewing the security scan:

```bash
# Option 1: Generate .claudeignore with recommendations
/sitecore-classic:setup --generate-ignore

# Option 2: Run analysis in safe mode (structure only)
/sitecore-classic:analyze --safe-mode

# Option 3: Run full analysis (after configuring exclusions)
/sitecore-classic:analyze
```

## Integration with CI/CD

```yaml
# Run security scan in pipeline before analysis
- name: Security Scan
  run: |
    claude /sitecore-classic:security-scan > security-report.md
    # Fail if critical files detected without exclusions
    grep -q "Critical files found: 0" security-report.md || exit 1
```
