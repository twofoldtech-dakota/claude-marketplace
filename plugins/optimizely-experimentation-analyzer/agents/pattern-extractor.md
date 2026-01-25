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
Grep: mock.*optimizely
```

Extract:
- Mocking approaches
- Test organization
- Coverage patterns

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
