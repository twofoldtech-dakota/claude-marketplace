# /xm-cloud:security-scan

Preview what files will be analyzed before running the full analysis. Identifies potentially sensitive files and recommends exclusions.

## Command Syntax

```bash
/xm-cloud:security-scan
```

## Purpose

Run this command before `/xm-cloud:analyze` to:
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
| .tsx | 89 | Components, Pages |
| .ts | 45 | Hooks, Utils, Types |
| .graphql | 15 | Queries, Mutations |
| .json | 12 | Config, Package |
| .js | 8 | Config files |

**Total**: 169 files
```

### Potentially Sensitive Files Detected

```markdown
## Potentially Sensitive Files Detected

| File | Risk Level | Reason | Recommendation |
|------|------------|--------|----------------|
| .env.local | Critical | Contains API keys | Add to .claudeignore |
| .env.production | Critical | Production secrets | Add to .claudeignore |
| vercel.json | High | May contain secrets | Review before analysis |
| netlify.toml | High | May contain secrets | Review before analysis |
| src/lib/config.ts | Medium | May expose endpoints | Review for hardcoded values |

**Critical files found**: 2
**High-risk files found**: 3
```

### Recommended .claudeignore Additions

```markdown
## Recommended .claudeignore Additions

Add these patterns to your `.claudeignore` file:

```gitignore
# Auto-detected sensitive files
.env
.env.*
!.env.example
vercel.json
netlify.toml
.vercel/
.netlify/
```

### Command to apply:
```bash
/xm-cloud:setup --generate-ignore
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
| `.env*` | env files | API keys, secrets |
| `SITECORE_API_KEY` | any | Sitecore credentials |
| `NEXT_PUBLIC_*` with secrets | .ts, .tsx | Exposed to client |
| `apiKey` | .json, .ts | API credentials |

### High Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `vercel.json` | .json | Deployment secrets |
| `netlify.toml` | .toml | Deployment secrets |
| `secret` | any | Secret values |
| `.pem`, `.key` | certificates | Private keys |

### Medium Risk Patterns
| Pattern | File Types | Reason |
|---------|------------|--------|
| `config.ts` | .ts | May contain endpoints |
| `constants.ts` | .ts | May contain sensitive URLs |
| `next.config.js` | .js | Environment exposure |

## Execution Flow

```
1. Scan project structure
   └── Count files by type
   └── Identify Next.js/JSS-specific paths

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
/xm-cloud:setup --generate-ignore

# Option 2: Run analysis in safe mode (structure only)
/xm-cloud:analyze --safe-mode

# Option 3: Run full analysis (after configuring exclusions)
/xm-cloud:analyze
```

## Integration with CI/CD

```yaml
# Run security scan in pipeline before analysis
- name: Security Scan
  run: |
    claude /xm-cloud:security-scan > security-report.md
    # Fail if critical files detected without exclusions
    grep -q "Critical files found: 0" security-report.md || exit 1
```
