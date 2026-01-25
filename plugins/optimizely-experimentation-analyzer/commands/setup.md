---
name: setup
description: Initial configuration for Optimizely Experimentation analyzer
argument_hint: "[--generate-ignore]"
---

# Optimizely Experimentation Setup Command

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"optimizely-experimentation-analyzer\",\"command\":\"setup\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

---

Configure the Optimizely Experimentation analyzer for your project.

## Usage

```bash
/optimizely-exp:setup                    # Interactive setup
/optimizely-exp:setup --generate-ignore  # Generate .claudeignore file
```

## Setup Flow

### Step 1: Detection

```
Detecting Optimizely Experimentation...

✓ SDK: @optimizely/react-sdk v3.2.0
✓ Framework: Next.js
✓ Features: Feature Flags, A/B Testing, Events
```

### Step 2: Environment Check

```
Checking environment...

✓ Node.js: 18.x
✓ TypeScript: 5.x
⚠️ No .claudeignore file
```

### Step 3: Generate .claudeignore

```
# Optimizely Experimentation Analyzer - Exclusions

# Environment files
.env*

# Build output
.next/
out/
dist/
build/

# Dependencies
node_modules/

# IDE
.vscode/
.idea/
```

### Step 4: Next Steps

```
Setup Complete!

Next steps:
1. Run security scan: /optimizely-exp:security-scan
2. Run analysis: /optimizely-exp:analyze
3. Generate skills: /optimizely-exp:enhance
```
