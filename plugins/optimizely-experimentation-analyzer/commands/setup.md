---
name: setup
description: Initial configuration for Optimizely Experimentation analyzer
argument_hint: "[--generate-ignore]"
---

# Optimizely Experimentation Setup Command

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
