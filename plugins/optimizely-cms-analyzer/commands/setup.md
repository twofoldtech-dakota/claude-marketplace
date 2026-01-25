---
name: setup
description: Initial configuration for Optimizely CMS analyzer
argument_hint: "[--generate-ignore]"
---

# Optimizely Setup Command

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"optimizely-cms-analyzer\",\"command\":\"setup\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

---

Configure the Optimizely CMS analyzer for your project.

## Usage

```bash
/optimizely:setup                    # Interactive setup
/optimizely:setup --generate-ignore  # Generate .claudeignore file
```

## What It Does

The setup command:

1. **Detects Project** - Identifies Optimizely version and structure
2. **Validates Environment** - Checks for required tools
3. **Generates Configuration** - Creates .claudeignore if needed
4. **Provides Guidance** - Shows recommended next steps

## Setup Flow

### Step 1: Project Detection

```
Detecting Optimizely project...

✓ Platform: Optimizely CMS 13.5
✓ .NET Version: 8.0
✓ Deployment: Self-Hosted
✓ Features: Content Delivery API, Forms
```

### Step 2: Environment Check

```
Checking environment...

✓ .NET SDK: 8.0.100
✓ NuGet: Available
⚠️  No .claudeignore file (recommended)
```

### Step 3: Generate .claudeignore

When using `--generate-ignore`:

```
Creating .claudeignore...

Generated: .claudeignore

Contents:
# Optimizely CMS Analyzer - Exclusion Patterns
# Generated: 2026-01-25

# Secrets and credentials
appsettings.Development.json
appsettings.Production.json
appsettings.*.json
!appsettings.json
connectionStrings.config
*.pfx
*.p12
*.key
*.pem
.env*
secrets/

# Build output
bin/
obj/
publish/

# IDE and tools
.vs/
.idea/
*.user
*.suo

# Package caches
packages/
node_modules/

# Test results
TestResults/
coverage/

# Logs
logs/
*.log

# Temporary files
*.tmp
*.temp
```

### Step 4: Next Steps

```
Setup Complete!

Next steps:

1. Review .claudeignore exclusions
2. Run security scan:
   /optimizely:security-scan

3. Run analysis:
   /optimizely:analyze

4. Generate AI skills:
   /optimizely:enhance

For help:
  /optimizely:analyze --help
```

## .claudeignore Template

The generated `.claudeignore` file excludes:

### Secrets & Credentials
- Environment-specific appsettings
- Connection string files
- Certificates and keys
- Environment files

### Build Output
- bin/ and obj/ directories
- Publish output
- Package caches

### IDE Files
- Visual Studio files
- JetBrains files
- User-specific settings

### Logs & Temp
- Log files
- Test results
- Temporary files

## Customization

After setup, customize `.claudeignore` for your project:

```
# Add project-specific exclusions
src/Legacy/                    # Legacy code to ignore
**/GeneratedCode/              # Auto-generated files
docs/internal/                 # Internal documentation
```

## Verification

After setup, verify configuration:

```bash
# Check what will be analyzed
/optimizely:security-scan --preview

# Run safe analysis first
/optimizely:analyze --safe-mode
```

## Notes

- Setup is non-destructive (won't overwrite existing .claudeignore)
- Use `--generate-ignore` to force regeneration
- Review all exclusions before committing
- Setup does not modify any source code
