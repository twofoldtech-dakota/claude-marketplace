---
name: optimizely-exp-feature-flags
description: Analyze feature flag implementation patterns and typed accessors
tools: [Read, Glob, Grep]
---

# Optimizely Feature Flags Agent

Analyze feature flag implementation, typed accessors, and flag lifecycle management.

## Analysis Areas

### 1. Missing Default Values

**FF-001: Feature Flag Without Default (Warning)**

Flags should have defaults for SDK failures:

```
Grep: isFeatureEnabled\(.*\)(?!\s*\?\?)
Grep: decide\(.*\)\.enabled(?!\s*\?\?)
```

**Bad Pattern**:
```javascript
// No fallback if SDK fails!
const isEnabled = optimizely.isFeatureEnabled('new_feature', userId);
if (isEnabled) {
  showNewFeature();
}
```

**Good Pattern**:
```javascript
// With default value
const isEnabled = optimizely.isFeatureEnabled('new_feature', userId) ?? false;

// Or with try/catch
let isEnabled = false;
try {
  isEnabled = optimizely.isFeatureEnabled('new_feature', userId);
} catch {
  console.warn('Feature flag check failed, using default');
}
```

### 2. Typed Feature Variables

**FF-002: No Typed Feature Variables (Warning)**

Feature variables should use typed accessors:

```
Grep: getFeatureVariable\(
Grep: getFeatureVariableString\(
Grep: getFeatureVariableInteger\(
Grep: getFeatureVariableDouble\(
Grep: getFeatureVariableBoolean\(
Grep: getFeatureVariableJSON\(
```

**Bad Pattern**:
```javascript
// Generic accessor - type unsafe
const discount = optimizely.getFeatureVariable('pricing', 'discount', userId);
// discount is string | number | boolean | object | null
```

**Good Pattern**:
```javascript
// Typed accessor
const discount = optimizely.getFeatureVariableDouble('pricing', 'discount', userId);
// discount is number | null

// Or with modern decide API
const decision = optimizely.decide('pricing', userId);
const discount = decision.variables.discount as number;
```

### 3. Render Loop Evaluation

**FF-003: Flag Evaluated in Render Loop (Warning)**

Flags should not be evaluated on every render:

```
Grep: function.*\{[\s\S]*?isFeatureEnabled
Grep: return.*isFeatureEnabled
```

**Bad Pattern**:
```jsx
function Component() {
  // Called on EVERY render!
  const showBanner = optimizely.isFeatureEnabled('banner', userId);

  return showBanner ? <Banner /> : null;
}
```

**Good Pattern**:
```jsx
function Component() {
  // Memoized or from hook
  const [decision] = useDecision('banner');
  // OR
  const showBanner = useMemo(
    () => optimizely.isFeatureEnabled('banner', userId),
    [userId]
  );

  return decision.enabled ? <Banner /> : null;
}
```

### 4. Stale Flag Cleanup

**FF-004: Stale Flag Not Cleaned Up (Info)**

Old flags should be removed after full rollout:

```
Grep: isFeatureEnabled\(["']legacy_
Grep: isFeatureEnabled\(["']old_
Grep: // TODO.*remove.*flag
Grep: // DEPRECATED.*flag
```

**Flag Lifecycle**:
1. **Development**: Flag created, 0% rollout
2. **Testing**: Gradual rollout (10%, 50%, 90%)
3. **Full Rollout**: 100% enabled
4. **Cleanup**: Remove flag, keep winner code

### 5. Flag Documentation

**FF-005: Missing Flag Documentation (Info)**

Flags should be documented:

```javascript
// Good: Well-documented flag
/**
 * Feature: dark_mode
 * Description: Enable dark mode UI
 * Owner: @ui-team
 * Created: 2024-01-15
 * Status: Testing (50% rollout)
 * Variables:
 *   - theme: string (dark | light | system)
 */
const [darkModeDecision] = useDecision('dark_mode');
```

### 6. Flag Key Constants

Check for typed flag keys:

**Bad Pattern**:
```javascript
// Magic strings everywhere
if (optimizely.isFeatureEnabled('new_checkout', userId)) {}
if (optimizely.isFeatureEnabled('dark_mode', userId)) {}
if (optimizely.isFeatureEnabled('beta_features', userId)) {}
```

**Good Pattern**:
```typescript
// Typed flag keys
export const FeatureFlags = {
  NEW_CHECKOUT: 'new_checkout',
  DARK_MODE: 'dark_mode',
  BETA_FEATURES: 'beta_features',
} as const;

type FeatureFlag = typeof FeatureFlags[keyof typeof FeatureFlags];

// Usage
if (optimizely.isFeatureEnabled(FeatureFlags.NEW_CHECKOUT, userId)) {}
```

### 7. Feature Flag Types

Define TypeScript types for flags:

```typescript
interface FeatureFlagConfig {
  key: string;
  description: string;
  defaultValue: boolean;
  variables?: Record<string, unknown>;
}

interface PricingVariables {
  discount: number;
  currency: string;
  showBadge: boolean;
}

// Type-safe flag access
function usePricingFlag(): { enabled: boolean; variables: PricingVariables } {
  const [decision] = useDecision('pricing');
  return {
    enabled: decision.enabled,
    variables: decision.variables as PricingVariables,
  };
}
```

### 8. Gradual Rollout Patterns

Check for proper rollout implementation:

```javascript
// Good: Percentage-based rollout
const isEnabled = optimizely.isFeatureEnabled('new_feature', userId, {
  // Attributes for targeting
  userType: user.type,
  country: user.country,
});
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| FF-001 | Warning | No default value | Add fallback |
| FF-002 | Warning | Untyped variables | Use typed accessors |
| FF-003 | Warning | Render loop eval | Memoize decision |
| FF-004 | Info | Stale flag | Clean up old flags |
| FF-005 | Info | No documentation | Document flags |

## Scoring

```
A: Typed flags, proper defaults, documented
B: Minor typing issues
C: Render loop evaluation or missing defaults
D: Multiple issues
F: Widespread untyped, undocumented flags
```

## Output Format

```yaml
featureFlags:
  score: "B"
  issues:
    - code: "FF-001"
      severity: "Warning"
      location: "src/hooks/useFeatures.ts:23"
      description: "Feature flag 'dark_mode' has no default value"
      recommendation: "Add ?? false for fallback"
    - code: "FF-004"
      severity: "Info"
      location: "src/components/Legacy.tsx:15"
      description: "Flag 'legacy_checkout' appears stale"
      recommendation: "If at 100% rollout, remove flag and keep code"
  metrics:
    flagsFound: 12
    withDefaults: 8
    typedAccessors: 10
    staleFlags: 2
```

## Feature Flag Best Practices

1. **Always provide defaults** for SDK failures
2. **Use typed accessors** for type safety
3. **Memoize decisions** to prevent re-evaluation
4. **Document flags** with owner and purpose
5. **Clean up** flags after full rollout
6. **Use constants** for flag keys
