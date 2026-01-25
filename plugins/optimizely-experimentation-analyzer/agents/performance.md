---
name: optimizely-exp-performance
description: Analyze performance patterns for Optimizely Experimentation implementations
tools: [Read, Glob, Grep]
---

# Optimizely Experimentation Performance Agent

Analyze SDK loading, bundle impact, and flicker prevention.

## Analysis Areas

### 1. Synchronous SDK Loading

**PERF-001: Synchronous SDK Load Blocking Render (Critical)**

SDK should not block page render:

```
Grep: <script.*cdn\.optimizely\.com(?!.*async)
Grep: await.*createInstance
Grep: \.then\(.*render
```

**Bad Pattern** (Blocking):
```html
<!-- Blocks page rendering! -->
<script src="https://cdn.optimizely.com/js/PROJECT_ID.js"></script>
```

```javascript
// Also blocking
const optimizely = await createInstance({ sdkKey });
// Nothing renders until SDK loads
```

**Good Pattern** (Non-blocking):
```html
<!-- Async loading -->
<script async src="https://cdn.optimizely.com/js/PROJECT_ID.js"></script>
```

```javascript
// Non-blocking with callback
const optimizely = createInstance({ sdkKey });

optimizely.onReady().then(() => {
  // SDK ready, but page already interactive
});
```

### 2. Anti-Flicker Handling

**PERF-002: No Anti-Flicker Handling (Critical)**

Experiments can cause visual flicker:

```
Grep: useDecision.*timeout
Grep: OptimizelyProvider.*timeout
Grep: anti-flicker
Grep: visibility.*hidden
```

**Bad Pattern** (Flicker):
```jsx
function Page() {
  const [decision] = useDecision('layout_experiment');
  // Shows default then switches - FLICKER!
  return <Layout variation={decision.variationKey} />;
}
```

**Good Pattern** (Anti-flicker):
```jsx
// With timeout fallback
<OptimizelyProvider
  optimizely={optimizelyClient}
  timeout={500}  // Max 500ms wait
>
  <App />
</OptimizelyProvider>

// Component with loading state
function Page() {
  const [decision, clientReady] = useDecision('layout_experiment');

  if (!clientReady) {
    return <LayoutSkeleton />; // Placeholder
  }

  return <Layout variation={decision.variationKey} />;
}
```

**Alternative - CSS Anti-Flicker**:
```html
<style>
  /* Hide until Optimizely decides */
  .optimizely-pending { opacity: 0; }
</style>
<script>
  document.documentElement.classList.add('optimizely-pending');
  window.optimizely.push({
    type: 'addListener',
    filter: { type: 'lifecycle', name: 'activated' },
    handler: function() {
      document.documentElement.classList.remove('optimizely-pending');
    }
  });
</script>
```

### 3. Datafile Caching

**PERF-003: Datafile Not Cached (Warning)**

Datafile should be cached for performance:

```
Grep: datafileOptions
Grep: autoUpdate
Grep: cache.*datafile
```

**Good Pattern**:
```javascript
const optimizely = createInstance({
  sdkKey: SDK_KEY,
  datafileOptions: {
    autoUpdate: true,
    updateInterval: 60000, // Cache for 1 minute
  },
});
```

**For Server-Side** (Cache across requests):
```javascript
// Cache datafile in memory
let cachedDatafile = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000;

async function getOptimizelyClient() {
  const now = Date.now();
  if (!cachedDatafile || now - cacheTimestamp > CACHE_TTL) {
    cachedDatafile = await fetchDatafile();
    cacheTimestamp = now;
  }

  return createInstance({ datafile: cachedDatafile });
}
```

### 4. Too Many Decisions

**PERF-004: Too Many Experiment Decisions (Warning)**

Excessive decisions impact performance:

```
Grep: decide\(
Grep: useDecision
Grep: isFeatureEnabled
```

Count occurrences - flag if >10 unique decisions per page.

**Bad Pattern**:
```jsx
function Page() {
  // Too many decisions!
  const [header] = useDecision('header_exp');
  const [nav] = useDecision('nav_exp');
  const [sidebar] = useDecision('sidebar_exp');
  const [footer] = useDecision('footer_exp');
  const [cta1] = useDecision('cta1_exp');
  const [cta2] = useDecision('cta2_exp');
  const [cta3] = useDecision('cta3_exp');
  // ... more
}
```

**Good Pattern**:
```jsx
// Consolidate related experiments
function Page() {
  // Single "page layout" experiment with multiple variables
  const [layoutDecision] = useDecision('page_layout');
  const { headerVariant, navVariant, ctaVariant } = layoutDecision.variables;
}
```

### 5. Bundle Size Impact

**PERF-005: SDK Bundle Not Tree-Shaken (Info)**

Check for proper imports:

```
Grep: import.*from.*@optimizely/optimizely-sdk
Grep: require\(.*@optimizely
```

**Bad Pattern** (Full import):
```javascript
import * as optimizely from '@optimizely/optimizely-sdk';
```

**Good Pattern** (Tree-shakeable):
```javascript
import { createInstance } from '@optimizely/optimizely-sdk';
```

### 6. Lazy Loading SDK

For non-critical experiments:

```javascript
// Lazy load SDK for below-fold experiments
const loadOptimizely = async () => {
  const { createInstance } = await import('@optimizely/optimizely-sdk');
  return createInstance({ sdkKey: SDK_KEY });
};

// Load when needed
useEffect(() => {
  if (isInViewport) {
    loadOptimizely().then(setClient);
  }
}, [isInViewport]);
```

### 7. Server-Side Rendering Performance

For SSR implementations:

```javascript
// Good: Reuse client across requests
const optimizelyClient = createInstance({
  sdkKey: SDK_KEY,
  datafile: cachedDatafile,
});

// Use in request handler
export async function getServerSideProps({ req }) {
  const userId = getUserId(req);
  const decision = optimizelyClient.decide('experiment', userId);
  return { props: { decision } };
}
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| PERF-001 | Critical | Sync SDK load | Use async loading |
| PERF-002 | Critical | No anti-flicker | Add timeout/skeleton |
| PERF-003 | Warning | No datafile cache | Configure caching |
| PERF-004 | Warning | >10 decisions | Consolidate experiments |
| PERF-005 | Info | Full SDK import | Use named imports |

## Scoring

```
A: Async loading, anti-flicker, cached, optimized
B: Minor caching issues
C: Missing anti-flicker or too many decisions
D: Blocking SDK load
F: Critical performance issues
```

## Output Format

```yaml
performance:
  score: "C"
  issues:
    - code: "PERF-001"
      severity: "Critical"
      location: "pages/_document.tsx:15"
      description: "Optimizely Web snippet loads synchronously"
      recommendation: "Add async attribute to script tag"
    - code: "PERF-002"
      severity: "Critical"
      location: "components/Layout.tsx:23"
      description: "No loading state while SDK initializes"
      recommendation: "Add clientReady check and skeleton"
  metrics:
    loadingStrategy: "synchronous"
    hasAntiFlicker: false
    datafileCached: true
    uniqueDecisions: 8
```

## Performance Optimization Checklist

- [ ] SDK loads asynchronously
- [ ] Anti-flicker mechanism in place
- [ ] Datafile cached appropriately
- [ ] Decisions consolidated
- [ ] Tree-shakeable imports
- [ ] SSR client reused
- [ ] Timeout configured
