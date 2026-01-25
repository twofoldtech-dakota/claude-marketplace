---
name: optimizely-exp-experiments
description: Analyze A/B test implementation patterns and variation handling
tools: [Read, Glob, Grep]
---

# Optimizely Experiments Agent

Analyze A/B test implementation, variation handling, and flicker prevention.

## Analysis Areas

### 1. Flicker Prevention

**EXP-001: Variation Applied After Render (Critical)**

Variations must be applied before initial render to prevent flicker:

```
Grep: useEffect.*decide
Grep: componentDidMount.*getVariation
Grep: useState.*null.*setVariation
```

**Bad Pattern** (Causes flicker):
```jsx
function ExperimentComponent() {
  const [variation, setVariation] = useState(null);

  useEffect(() => {
    // Decides AFTER initial render - causes flicker!
    const decision = optimizely.decide('experiment_key');
    setVariation(decision.variationKey);
  }, []);

  return <div className={variation}>{/* Content changes! */}</div>;
}
```

**Good Pattern** (No flicker):
```jsx
function ExperimentComponent() {
  // Decision made during render, before paint
  const [decision, clientReady] = useDecision('experiment_key');

  if (!clientReady) {
    return <Skeleton />; // Placeholder while loading
  }

  return <div className={decision.variationKey}>{/* Stable */}</div>;
}
```

**Alternative - Server-Side Rendering**:
```jsx
// pages/index.tsx (Next.js)
export async function getServerSideProps({ req }) {
  const userId = getUserId(req);
  const decision = optimizelyClient.decide('experiment_key', userId);

  return {
    props: {
      variation: decision.variationKey,
    },
  };
}
```

### 2. Missing Tracking

**EXP-002: A/B Test Without Tracking Event (Warning)**

Experiments should track conversion events:

```
Grep: decide\((?!.*track)
Grep: activate\((?!.*track)
Grep: getVariation\((?!.*track)
```

**Bad Pattern**:
```javascript
// No conversion tracking!
const variation = optimizely.decide('checkout_experiment');
if (variation.variationKey === 'new_checkout') {
  showNewCheckout();
}
// User converts but we don't know which variation caused it
```

**Good Pattern**:
```javascript
const variation = optimizely.decide('checkout_experiment');
if (variation.variationKey === 'new_checkout') {
  showNewCheckout();
}

// Track conversion
function onPurchase(revenue) {
  optimizely.track('purchase', {
    revenue,
    variation: variation.variationKey,
  });
}
```

### 3. Decision Memoization

**EXP-003: Experiment Decision Not Memoized (Warning)**

Decisions should be memoized to prevent re-evaluation:

```
Grep: useMemo.*decide
Grep: useCallback.*decide
```

**Bad Pattern**:
```jsx
function Component() {
  // Re-decides on every render!
  const decision = optimizely.decide('experiment');

  return <div>{decision.variationKey}</div>;
}
```

**Good Pattern**:
```jsx
function Component() {
  // Memoized decision
  const decision = useMemo(
    () => optimizely.decide('experiment'),
    [/* dependencies */]
  );

  // Or use the React SDK hook (auto-memoized)
  const [decision] = useDecision('experiment');

  return <div>{decision.variationKey}</div>;
}
```

### 4. Server-Side Hydration

**EXP-004: Server-Side Decision Without Hydration (Warning)**

SSR decisions must be hydrated on client:

```
Grep: getServerSideProps.*decide
Grep: getStaticProps.*decide
```

**Bad Pattern**:
```jsx
// Server decides one thing...
export async function getServerSideProps() {
  const decision = serverOptimizely.decide('experiment', userId);
  return { props: { variation: decision.variationKey } };
}

function Page({ variation }) {
  // Client re-decides differently!
  const [clientDecision] = useDecision('experiment');
  // Hydration mismatch!
}
```

**Good Pattern**:
```jsx
export async function getServerSideProps({ req }) {
  const userId = getUserId(req);
  const decision = serverOptimizely.decide('experiment', userId);

  return {
    props: {
      variation: decision.variationKey,
      userId, // Pass for hydration
    },
  };
}

function Page({ variation, userId }) {
  // Use same user ID for consistent decision
  const [decision] = useDecision('experiment', {
    overrideUserId: userId,
  });

  // Or skip client decision entirely
  return <VariationComponent variation={variation} />;
}
```

### 5. Missing Description Comments

**EXP-005: Missing Experiment Description (Info)**

Experiments should have documentation:

```javascript
// Good: Documented experiment
/**
 * Experiment: checkout_flow_v2
 * Hypothesis: Simplified checkout increases conversion
 * Variations:
 *   - control: Original 3-step checkout
 *   - treatment: New 1-page checkout
 * Success metric: purchase_completed
 */
const [decision] = useDecision('checkout_flow_v2');
```

### 6. Variation Handling

Check for proper variation handling:

```javascript
// Good: Handle all variations explicitly
switch (decision.variationKey) {
  case 'control':
    return <ControlComponent />;
  case 'variation_a':
    return <VariationAComponent />;
  case 'variation_b':
    return <VariationBComponent />;
  default:
    // Fallback for bucketing errors
    return <ControlComponent />;
}
```

### 7. Experiment Cleanup

Check for stale experiments:

```
Grep: decide\(["']old_
Grep: activate\(["']deprecated_
Grep: TODO.*remove.*experiment
```

Flag experiments that may be ready for cleanup.

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| EXP-001 | Critical | useEffect decide | Apply before render |
| EXP-002 | Warning | No track() call | Add conversion tracking |
| EXP-003 | Warning | Unmemoized decision | Use useMemo or hook |
| EXP-004 | Warning | SSR without hydration | Sync server/client |
| EXP-005 | Info | No documentation | Add experiment docs |

## Scoring

```
A: No flicker, proper tracking, memoized decisions
B: Minor documentation issues
C: Missing tracking or unmemoized
D: Flicker issues
F: Widespread flicker, no tracking
```

## Output Format

```yaml
experiments:
  score: "C"
  issues:
    - code: "EXP-001"
      severity: "Critical"
      location: "src/components/Checkout.tsx:45"
      description: "Variation applied in useEffect causes flicker"
      recommendation: "Use useDecision hook or apply before render"
    - code: "EXP-002"
      severity: "Warning"
      location: "src/components/Checkout.tsx:67"
      description: "Experiment 'checkout_v2' has no conversion tracking"
      recommendation: "Add track('purchase_completed') on conversion"
  metrics:
    experimentsFound: 5
    withTracking: 3
    withFlicker: 2
    staleExperiments: 1
```

## Flicker Prevention Strategies

1. **React SDK useDecision** - Built-in flicker prevention
2. **Server-Side Rendering** - Decide on server
3. **Loading States** - Show skeleton while deciding
4. **Anti-Flicker Snippet** - Hide content until decided
5. **Timeout** - Set max wait time for SDK
