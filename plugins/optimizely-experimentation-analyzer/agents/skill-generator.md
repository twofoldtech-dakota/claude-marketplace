---
name: optimizely-exp-skill-generator
description: Generate project-specific AI skills for Optimizely Experimentation
tools: [Read, Glob, Grep, Write]
---

# Optimizely Experimentation Skill Generator Agent

Generate project-specific SKILL.md files based on extracted patterns.

## Generated Skills

### 1. Experimentation Patterns Skill

**File**: `.claude/skills/optimizely-exp-patterns/SKILL.md`

Documents:
- SDK initialization pattern
- Hook usage patterns
- Feature flag patterns
- Event tracking patterns

### 2. Testing Patterns Skill

**File**: `.claude/skills/testing-patterns/SKILL.md`

**Template**:
```markdown
---
name: testing-patterns
description: Testing patterns for Optimizely Experimentation
version: 1.0.0
---

# Optimizely Experimentation Testing Patterns

## Overview
Testing patterns for feature flags and experiments.

## SDK Mocking

### Jest Mock Setup
```typescript
{JestMockExample}
```

### Mock Factory
```typescript
{MockFactoryExample}
```

## Decision Testing

### Testing Variations
```typescript
{VariationTestExample}
```

### Testing Feature Flags
```typescript
{FeatureFlagTestExample}
```

## Event Tracking Tests

### Verify Track Calls
```typescript
{TrackVerifyExample}
```

## Loading States

### Test Loading Behavior
```typescript
{LoadingStateTestExample}
```

## Test Utilities

### renderWithOptimizely
```typescript
{RenderUtilityExample}
```

## Conventions
- Test all variations
- Test loading and error states
- Mock at SDK level
```

### 3. Error Handling Skill

**File**: `.claude/skills/error-handling/SKILL.md`

**Template**:
```markdown
---
name: error-handling
description: Error handling patterns for Optimizely Experimentation
version: 1.0.0
---

# Error Handling Patterns

## SDK Initialization Errors

### onError Callback
```typescript
{OnErrorExample}
```

### Fallback Behavior
```typescript
{FallbackExample}
```

## Decision Errors

### Graceful Degradation
```typescript
{GracefulDegradationExample}
```

## Logging

### Service Integration
{LoggingService}

### Pattern
```typescript
{LoggingPatternExample}
```

## Error Boundaries

### React Integration
```typescript
{ErrorBoundaryExample}
```

## Monitoring

### Error Tracking
```typescript
{MonitoringExample}
```
```

### 4. Skill Metadata

**Output**: `.claude/skills/.meta.json`

**Template**:
```json
{
  "version": "1.0.0",
  "generatedAt": "{ISO_TIMESTAMP}",
  "generatedBy": "optimizely-experimentation-analyzer",
  "projectHash": "{PROJECT_HASH}",
  "skills": [
    {
      "name": "optimizely-exp-patterns",
      "file": "optimizely-exp-patterns/SKILL.md",
      "patternsFound": {ExpPatternCount}
    },
    {
      "name": "testing-patterns",
      "file": "testing-patterns/SKILL.md",
      "patternsFound": {TestPatternCount}
    },
    {
      "name": "error-handling",
      "file": "error-handling/SKILL.md",
      "patternsFound": {ErrorPatternCount}
    }
  ],
  "statistics": {
    "filesAnalyzed": {FilesAnalyzed},
    "patternsExtracted": {TotalPatterns},
    "codeExamples": {ExampleCount}
  }
}
```

## Output

Skills generated to `.claude/skills/` directory.

```yaml
skillsGenerated:
  - path: ".claude/skills/optimizely-exp-patterns/SKILL.md"
    patterns: 5
    examples: 10
  - path: ".claude/skills/optimizely-exp-testing/SKILL.md"
    patterns: 3
    examples: 6
```
