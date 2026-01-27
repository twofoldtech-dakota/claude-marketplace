---
name: optimizely-exp-pattern-extractor
description: Extract project-specific patterns from Optimizely Experimentation implementations
tools: [Read, Glob, Grep]
---

# Optimizely Experimentation Pattern Extractor Agent

Extract project-specific patterns for AI skill generation.

## Extraction Areas

### 1. SDK Initialization Patterns

```
Glob: **/lib/optimizely.*
Glob: **/utils/optimizely.*
Glob: **/providers/*Optimizely*
```

Extract:
- Initialization configuration
- Provider setup
- Environment handling

### 2. Hook Patterns

```
Glob: **/hooks/use*Flag*
Glob: **/hooks/use*Experiment*
Glob: **/hooks/use*Decision*
```

Extract:
- Custom hook wrappers
- Return value shapes
- Error handling patterns

### 3. Feature Flag Organization

```
Glob: **/features/**
Glob: **/experiments/**
Glob: **/flags/**
```

Extract:
- Flag naming conventions
- Organization structure
- Documentation patterns

### 4. Event Tracking Patterns

```
Grep: track\(
Grep: trackEvent
```

Extract:
- Event naming conventions
- Property patterns
- Timing patterns

### 5. Testing Patterns

```
Glob: **/*.test.*
Glob: **/*.spec.*
Glob: **/jest.config.*
Glob: **/vitest.config.*
Grep: mock.*optimizely
Grep: jest\.mock|vi\.mock
```

**Detection Strategy**:
```
1. Identify test framework (Jest, Vitest, Mocha)
2. Find Optimizely SDK mocking patterns
3. Detect experiment/flag test utilities
4. Analyze variation testing approaches
5. Check for flicker testing patterns
```

Extract:
- Mocking approaches for Optimizely SDK
- Test organization (co-located vs separate)
- Coverage patterns for variations
- Experiment lifecycle testing
- Feature flag toggle testing

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| SDK mocking | `jest.mock('@optimizely/optimizely-sdk')` | Full SDK mock |
| Decision mocking | `mockDecide`, `mockGetVariation` | Decision stubbing |
| User context | Mock user attributes | Test user setup |
| Variation testing | Tests per variation | Coverage per variant |
| Event testing | `track` call verification | Conversion tracking |
| Loading states | Test loading/ready states | Async handling |

**Output Format**:
```yaml
testingPatterns:
  framework: "Jest"
  organization: "co-located"
  sdkMocking:
    approach: "jest.mock with factory"
    file: "src/__mocks__/@optimizely/optimizely-sdk.ts"
  utilities:
    - name: "mockOptimizelyDecision"
      purpose: "Stub decide() responses"
    - name: "renderWithOptimizely"
      purpose: "Wrap components with provider"
  coverage:
    variations: "Each variation tested"
    loading: "Loading and ready states"
    errors: "Error boundary integration"
  examples:
    - name: FeatureFlag.test.tsx
      pattern: "Mock SDK, test all variations"
```

### 6. Error Handling Patterns

```
Glob: **/lib/**/*.ts
Glob: **/utils/**/*.ts
Glob: **/hooks/**/*.ts
Grep: catch\s*\(
Grep: \.onError|onError:
Grep: console\.(error|warn)
```

**Detection Strategy**:
```
1. Find SDK initialization error handling
2. Detect decision error fallbacks
3. Identify logging patterns
4. Analyze graceful degradation approaches
5. Check error boundary usage
```

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| SDK errors | `onError` callback | Initialization failures |
| Decision fallbacks | Default values on error | Graceful degradation |
| Logging | Logger setup and usage | Error reporting |
| Error boundaries | React error boundaries | UI error handling |
| Retry logic | Retry on datafile fetch | Resilience patterns |
| Monitoring | Error tracking integration | Sentry, DataDog |

**Output Format**:
```yaml
errorHandlingPatterns:
  sdkInitialization:
    onError: "Log and use defaults"
    fallback: "Control variation"
  decisions:
    errorHandling: "Return control with logging"
    defaultValues: "Defined per feature"
  logging:
    service: "DataDog" | "Sentry" | "console"
    pattern: "Structured with context"
  gracefulDegradation:
    strategy: "Feature flags default to off"
    userExperience: "No visible errors"
  monitoring:
    integration: "Sentry.captureException"
    customTags: ["experiment_key", "variation"]
```

## Output Format

```yaml
patterns:
  initialization:
    file: "src/lib/optimizely.ts"
    pattern: "Singleton with environment config"
    code: |
      const optimizely = createInstance({
        sdkKey: process.env.NEXT_PUBLIC_OPTIMIZELY_SDK_KEY,
        datafileOptions: { autoUpdate: true },
      });

  hooks:
    - name: "useFeatureFlag"
      file: "src/hooks/useFeatureFlag.ts"
      pattern: "Wrapper with loading state"
    - name: "useExperiment"
      file: "src/hooks/useExperiment.ts"
      pattern: "Decision with tracking"

  events:
    naming: "snake_case verb_noun"
    examples:
      - "purchase_completed"
      - "signup_started"

  testing:
    mockPattern: "jest.mock with factory"
    coverage: "variations and loading states"
```
