---
name: optimizely-exp-implementation
description: Analyze Optimizely SDK implementation patterns and initialization
tools: [Read, Glob, Grep]
---

# Optimizely Implementation Agent

Analyze SDK implementation patterns, initialization, and configuration.

## Analysis Areas

### 1. SDK Initialization

**IMPL-001: SDK Initialized Without Datafile (Critical)**

SDK must have datafile access:

```
Grep: createInstance\s*\(\s*\{(?!.*datafile)(?!.*sdkKey)
```

**Bad Pattern**:
```javascript
// Missing datafile configuration!
const optimizely = optimizelySdk.createInstance({
  // No sdkKey or datafile
});
```

**Good Pattern**:
```javascript
const optimizely = optimizelySdk.createInstance({
  sdkKey: process.env.OPTIMIZELY_SDK_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 60000,
  },
});
```

### 2. Blocking Initialization

**IMPL-002: Blocking SDK Initialization (Critical)**

SDK initialization should not block rendering:

```
Grep: await.*createInstance
Grep: \.then\(.*createInstance
Grep: optimizely.*=.*await
```

**Bad Pattern**:
```javascript
// Blocks page load!
const optimizely = await optimizelySdk.createInstance({
  sdkKey: SDK_KEY,
});
// Nothing renders until SDK is ready
```

**Good Pattern**:
```javascript
// Non-blocking with ready handler
const optimizely = optimizelySdk.createInstance({
  sdkKey: SDK_KEY,
});

optimizely.onReady().then(() => {
  // SDK is ready, but page already rendered
});
```

**Best Pattern (React)**:
```jsx
<OptimizelyProvider
  optimizely={optimizely}
  timeout={500}  // Max wait time
>
  <App />
</OptimizelyProvider>
```

### 3. Error Handling

**IMPL-003: No Error Handling for Decisions (Warning)**

Decisions should have error handling:

```
Grep: decide\(.*\)(?!.*catch)
Grep: isFeatureEnabled\(.*\)(?!.*\?\?)
```

**Bad Pattern**:
```javascript
// No error handling - will throw on SDK errors
const decision = optimizely.decide('feature_key');
const isEnabled = decision.enabled;
```

**Good Pattern**:
```javascript
try {
  const decision = optimizely.decide('feature_key');
  return decision.enabled;
} catch (error) {
  console.error('Optimizely decision error:', error);
  return false; // Safe default
}
```

### 4. User ID Consistency

**IMPL-004: Missing User ID Consistency (Warning)**

User IDs should be consistent across sessions:

```
Grep: createUserContext\(.*Math\.random
Grep: createUserContext\(.*uuid\(\)
Grep: userId.*=.*Date\.now
```

**Bad Pattern**:
```javascript
// Random ID = inconsistent experiments!
const userId = Math.random().toString(36);
const userContext = optimizely.createUserContext(userId);
```

**Good Pattern**:
```javascript
// Consistent ID from storage or auth
const userId = localStorage.getItem('userId') || generateAndStoreId();
const userContext = optimizely.createUserContext(userId);

// Or from authenticated user
const userId = user.id;
```

### 5. React Hooks Usage

**IMPL-005: Not Using React Hooks Properly (Warning)**

React SDK hooks should be used correctly:

```
Grep: useDecision.*\[\s*\]
Grep: useFeature\(.*\{.*\}
```

**Bad Pattern**:
```jsx
function Component() {
  // Missing dependency array in options
  const [decision] = useDecision('feature', {
    autoUpdate: true,
  }); // Re-evaluates on every render!

  return <div>{decision.enabled ? 'On' : 'Off'}</div>;
}
```

**Good Pattern**:
```jsx
function Component({ userId }) {
  const [decision, clientReady] = useDecision('feature', {
    autoUpdate: true,
  }, {
    overrideUserId: userId,
  });

  if (!clientReady) return <Loading />;

  return <div>{decision.enabled ? 'On' : 'Off'}</div>;
}
```

### 6. Hardcoded SDK Key

**IMPL-006: Hardcoded SDK Key (Info)**

SDK keys should be in environment variables:

```
Grep: sdkKey:\s*["'][A-Za-z0-9]{15,}["']
Grep: SDK_KEY\s*=\s*["'][A-Za-z0-9]{15,}["']
```

**Bad Pattern**:
```javascript
const optimizely = createInstance({
  sdkKey: 'GHi7JkLmNoPqRsTuVwXyZ123', // Hardcoded!
});
```

**Good Pattern**:
```javascript
const optimizely = createInstance({
  sdkKey: process.env.NEXT_PUBLIC_OPTIMIZELY_SDK_KEY,
});
```

### 7. Provider Configuration

Check for proper OptimizelyProvider setup:

```jsx
// Good: Complete provider setup
<OptimizelyProvider
  optimizely={optimizelyClient}
  user={{
    id: userId,
    attributes: userAttributes,
  }}
  timeout={500}
  isServerSide={typeof window === 'undefined'}
>
  <App />
</OptimizelyProvider>
```

### 8. Datafile Management

Check datafile handling:

```
Grep: datafileOptions
Grep: updateInterval
Grep: autoUpdate
Grep: urlTemplate
```

**Good Pattern**:
```javascript
const optimizely = createInstance({
  sdkKey: SDK_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 60000, // 1 minute
  },
  eventBatchSize: 10,
  eventFlushInterval: 1000,
});
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| IMPL-001 | Critical | No datafile config | Add sdkKey or datafile |
| IMPL-002 | Critical | Blocking init | Use async/non-blocking |
| IMPL-003 | Warning | No error handling | Add try/catch |
| IMPL-004 | Warning | Random user ID | Use consistent ID |
| IMPL-005 | Warning | Bad hooks usage | Fix dependencies |
| IMPL-006 | Info | Hardcoded SDK key | Use env variables |

## Scoring

```
A: Proper initialization, error handling, consistent users
B: Minor issues (hardcoded key)
C: Missing error handling or inconsistent users
D: Blocking initialization
F: SDK not properly initialized
```

## Output Format

```yaml
implementation:
  score: "B"
  issues:
    - code: "IMPL-002"
      severity: "Critical"
      location: "src/lib/optimizely.ts:15"
      description: "SDK initialization blocks page load with await"
      recommendation: "Use onReady() callback or provider timeout"
    - code: "IMPL-006"
      severity: "Info"
      location: "src/lib/optimizely.ts:8"
      description: "SDK key is hardcoded in source"
      recommendation: "Move to NEXT_PUBLIC_OPTIMIZELY_SDK_KEY"
  metrics:
    initializationPattern: "blocking"
    hasErrorHandling: false
    userIdStrategy: "localStorage"
    datafileAutoUpdate: true
```
