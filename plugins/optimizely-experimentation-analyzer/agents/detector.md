---
name: optimizely-exp-detector
description: Detect Optimizely Experimentation SDK and Web implementations
tools: [Read, Glob, Grep]
---

# Optimizely Experimentation Detector Agent

Detect and classify Optimizely Experimentation implementations.

## Detection Strategy

### Step 1: Identify SDK Type

Search for Optimizely Experimentation indicators:

**Full Stack SDK (NPM)**:
```
Glob: **/package.json
Grep: @optimizely/optimizely-sdk
Grep: @optimizely/react-sdk
```

**Optimizely Web (Snippet)**:
```
Glob: **/*.html
Glob: **/*.tsx
Glob: **/*.jsx
Grep: cdn\.optimizely\.com
Grep: window\[["']optimizely["']\]
Grep: optimizely\.push
```

### Step 2: Detect SDK Version

**Full Stack SDK**:
```json
// package.json
{
  "dependencies": {
    "@optimizely/optimizely-sdk": "^5.1.0",
    "@optimizely/react-sdk": "^3.2.0"
  }
}
```

Version mapping:
| Package | Version | Features |
|---------|---------|----------|
| @optimizely/optimizely-sdk | 5.x | Latest decide API, typed variables |
| @optimizely/optimizely-sdk | 4.x | Feature flags, rollouts |
| @optimizely/react-sdk | 3.x | Hooks API, context provider |
| @optimizely/react-sdk | 2.x | HOC pattern, legacy hooks |

### Step 3: Detect Framework Integration

**React**:
```
Grep: import.*@optimizely/react-sdk
Grep: OptimizelyProvider
Grep: useDecision
Grep: useFeature
Grep: withOptimizely
```

**Vue**:
```
Grep: optimizely.*vue
Grep: \$optimizely
```

**Angular**:
```
Grep: OptimizelyService
Grep: @Injectable.*Optimizely
```

**Node.js/Server-side**:
```
Grep: createInstance.*optimizely
Grep: optimizely\.createInstance
```

### Step 4: Detect Configuration Pattern

**Environment-based**:
```
Grep: process\.env.*SDK_KEY
Grep: OPTIMIZELY_SDK_KEY
Grep: NEXT_PUBLIC_OPTIMIZELY
```

**Hardcoded (flag for warning)**:
```
Grep: sdkKey:\s*["'][A-Za-z0-9]{20,}["']
```

### Step 5: Detect Usage Patterns

**Feature Flags**:
```
Grep: isFeatureEnabled
Grep: getFeatureVariable
Grep: useFeature
Grep: decide\(
```

**A/B Experiments**:
```
Grep: activate\(
Grep: getVariation
Grep: useExperiment
```

**Event Tracking**:
```
Grep: track\(
Grep: trackEvent
Grep: onTrack
```

### Step 6: Detect Optimizely Web Patterns

**Snippet Detection**:
```html
<script src="https://cdn.optimizely.com/js/PROJECT_ID.js"></script>
```

**API Usage**:
```javascript
window.optimizely.push(['activate', 'experiment_id']);
window.optimizely.push(['trackEvent', 'conversion']);
```

**Custom JS Extensions**:
```
Grep: optimizely\.get\(
Grep: optimizely\.push\(\[
Grep: window\.optimizelyEdge
```

### Step 7: Detect Project Structure

**Typical structure**:
```
src/
├── lib/
│   └── optimizely.ts          # SDK initialization
├── hooks/
│   └── useFeatureFlag.ts      # Custom hooks
├── providers/
│   └── OptimizelyProvider.tsx # Context provider
└── utils/
    └── experiments.ts         # Experiment helpers
```

## Output Format

Provide detection results in this format:

```yaml
detection:
  product: "Optimizely Full Stack" | "Optimizely Web" | "Both"
  sdkType: "JavaScript" | "React" | "Node.js" | "Snippet"
  sdkVersion: "5.1.0"
  reactSdkVersion: "3.2.0"  # if applicable
  framework: "React" | "Next.js" | "Vue" | "Angular" | "Node.js" | "Vanilla JS"
  configuration:
    method: "environment" | "hardcoded" | "config-file"
    hasDatafile: true
  features:
    - Feature Flags
    - A/B Testing
    - Event Tracking
    - Rollouts
  patterns:
    initialization: "provider" | "singleton" | "per-request"
    decisions: "hooks" | "hoc" | "direct"
  files:
    sdkInit: "src/lib/optimizely.ts"
    provider: "src/providers/OptimizelyProvider.tsx"
    hooks: "src/hooks/useFeatureFlag.ts"
```

## Confidence Levels

- **High**: NPM package + imports + initialization code
- **Medium**: Only NPM package or only usage patterns
- **Low**: Only snippet reference or generic patterns

If confidence is Low, warn user to verify this is an Optimizely implementation.

## SDK-Specific Checks

After detection, enable SDK-specific analysis:

| SDK | Enabled Checks |
|-----|----------------|
| Full Stack 5.x | Decide API, typed flags |
| Full Stack 4.x | Legacy activate/isFeatureEnabled |
| React SDK 3.x | Hooks patterns, provider setup |
| React SDK 2.x | HOC patterns, legacy hooks |
| Web Snippet | Custom JS, project config |

## Next Steps

After detection, the main analyze command will:
1. Adjust analysis for detected SDK type
2. Skip irrelevant checks based on patterns
3. Enable SDK-specific recommendations
4. Configure appropriate issue severity
