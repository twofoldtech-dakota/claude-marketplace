# /umbraco:security-scan

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"umbraco-analyzer\",\"command\":\"security-scan\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
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
/umbraco:security-scan
```

## Purpose

Run this command before `/umbraco:analyze` to:
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
| .cs | 125 | Controllers, Services, Composers |
| .cshtml | 45 | Views, Partials |
| .json | 8 | appsettings, package configs |
| .ts | 12 | Backoffice extensions |
| .csproj | 3 | Project files |

**Total**: 193 files
```

### Potentially Sensitive Files Detected

```markdown
## Potentially Sensitive Files Detected

| File | Risk Level | Reason | Recommendation |
|------|------------|--------|----------------|
| appsettings.Production.json | Critical | Production connection strings | Add to .claudeignore |
| appsettings.Development.json | High | Dev credentials | Add to .claudeignore |
| umbraco/Data/ | High | Umbraco database | Add to .claudeignore |
| wwwroot/media/ | Medium | User uploads | Consider excluding |
| Properties/launchSettings.json | Medium | Local URLs/ports | Review |

**Critical files found**: 1
**High-risk files found**: 3
```

### Recommended .claudeignore Additions

```markdown
## Recommended .claudeignore Additions

Add these patterns to your `.claudeignore` file:

```gitignore
# Auto-detected sensitive files
appsettings.*.json
!appsettings.json
umbraco/Data/
umbraco/Logs/
wwwroot/media/
**/*.pfx
**/*.key
```

### Command to apply:
```bash
/umbraco:setup --generate-ignore
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
| `appsettings.Production` | .json | Production credentials |
| `ConnectionStrings` | .json | Database credentials |
| `Umbraco:CMS:DeliveryApi:ApiKey` | .json | API credentials |
| `password` | .json, .config | Plaintext passwords |

### High Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `appsettings.Development` | .json | Dev credentials |
| `umbraco/Data/` | directory | SQLite database |
| `umbraco/Logs/` | directory | May contain PII |
| `.pfx`, `.key` | certificates | Private keys |

### Medium Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `launchSettings.json` | .json | Local configuration |
| `wwwroot/media/` | directory | User uploads |
| `App_Data/` | directory | Application data |

## Execution Flow

```
1. Scan project structure
   └── Count files by type
   └── Identify Umbraco-specific paths

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
/umbraco:setup --generate-ignore

# Option 2: Run analysis in safe mode (structure only)
/umbraco:analyze --safe-mode

# Option 3: Run full analysis (after configuring exclusions)
/umbraco:analyze
```

## Integration with CI/CD

```yaml
# Run security scan in pipeline before analysis
- name: Security Scan
  run: |
    claude /umbraco:security-scan > security-report.md
    # Fail if critical files detected without exclusions
    grep -q "Critical files found: 0" security-report.md || exit 1
```
