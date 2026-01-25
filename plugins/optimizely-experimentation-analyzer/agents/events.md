---
name: optimizely-exp-events
description: Analyze event tracking implementation and conversion patterns
tools: [Read, Glob, Grep]
---

# Optimizely Events Agent

Analyze event tracking implementation, conversion events, and event properties.

## Analysis Areas

### 1. Sensitive Data in Events

**EVT-001: Sensitive Data in Event Properties (Critical)**

Events should not contain PII or sensitive data:

```
Grep: track\(.*email
Grep: track\(.*password
Grep: track\(.*ssn
Grep: track\(.*creditCard
Grep: track\(.*phone
```

**Bad Pattern**:
```javascript
// PII in event properties!
optimizely.track('signup_completed', userId, {
  email: user.email,           // PII!
  phone: user.phone,           // PII!
  address: user.address,       // PII!
});
```

**Good Pattern**:
```javascript
// Anonymized/aggregated data only
optimizely.track('signup_completed', userId, {
  signupMethod: 'email',       // Category, not actual email
  country: user.country,       // Aggregatable
  userType: 'free',            // Segment
});
```

### 2. User Context in Events

**EVT-002: Events Without User Context (Warning)**

Events need user context for proper attribution:

```
Grep: track\(\s*["'][^"']+["']\s*\)
Grep: track\(\s*["'][^"']+["']\s*,\s*null
```

**Bad Pattern**:
```javascript
// No user context!
optimizely.track('purchase');

// Or null user ID
optimizely.track('purchase', null, { revenue: 99 });
```

**Good Pattern**:
```javascript
// With user context
const userContext = optimizely.createUserContext(userId, {
  membershipTier: user.tier,
  country: user.country,
});

userContext.trackEvent('purchase', {
  revenue: 9900, // In cents
  currency: 'USD',
});
```

### 3. Event Batching

**EVT-003: No Event Batching Configured (Warning)**

Events should be batched for efficiency:

```
Grep: eventBatchSize
Grep: eventFlushInterval
Grep: eventDispatcher
```

**Good Pattern**:
```javascript
const optimizely = createInstance({
  sdkKey: SDK_KEY,
  eventBatchSize: 10,           // Batch 10 events
  eventFlushInterval: 1000,     // Flush every 1s
});
```

### 4. Event Documentation

**EVT-004: Custom Events Not Documented (Info)**

Events should be documented:

```javascript
// Good: Documented events
/**
 * Event: purchase_completed
 * Trigger: User completes checkout
 * Properties:
 *   - revenue: number (in cents)
 *   - currency: string (ISO code)
 *   - itemCount: number
 * Experiments using this:
 *   - checkout_flow_v2
 *   - pricing_experiment
 */
userContext.trackEvent('purchase_completed', {
  revenue: order.total * 100,
  currency: 'USD',
  itemCount: order.items.length,
});
```

### 5. Revenue Tracking

Check for proper revenue event format:

```javascript
// Good: Revenue tracking
userContext.trackEvent('purchase', {
  revenue: 9900,        // Integer cents, not dollars
  value: 99.00,         // Optional: decimal for display
  currency: 'USD',
});

// Optimizely expects revenue in lowest currency unit (cents)
```

### 6. Event Naming Conventions

Check for consistent event naming:

```javascript
// Good: Consistent naming
const EventNames = {
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  PURCHASE_STARTED: 'purchase_started',
  PURCHASE_COMPLETED: 'purchase_completed',
} as const;

// snake_case, verb_noun pattern
```

### 7. Event Timing

Check that events fire at correct times:

```javascript
// Good: Event fires on actual action
async function handlePurchase() {
  try {
    const result = await processPayment();

    // Only track AFTER successful action
    if (result.success) {
      userContext.trackEvent('purchase_completed', {
        revenue: result.amount,
      });
    }
  } catch (error) {
    userContext.trackEvent('purchase_failed', {
      errorType: error.code,
    });
  }
}

// Bad: Tracking before action completes
function handlePurchase() {
  userContext.trackEvent('purchase_completed'); // Too early!
  processPayment(); // Might fail
}
```

### 8. Custom Event Dispatcher

Check for custom event handling:

```javascript
// Custom dispatcher for additional processing
const customDispatcher = {
  dispatchEvent: (event) => {
    // Add custom metadata
    const enrichedEvent = {
      ...event,
      metadata: {
        environment: process.env.NODE_ENV,
        appVersion: APP_VERSION,
      },
    };

    // Send to Optimizely
    return defaultDispatcher.dispatchEvent(enrichedEvent);
  },
};

const optimizely = createInstance({
  sdkKey: SDK_KEY,
  eventDispatcher: customDispatcher,
});
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| EVT-001 | Critical | PII in events | Remove sensitive data |
| EVT-002 | Warning | No user context | Add user ID |
| EVT-003 | Warning | No batching | Configure batching |
| EVT-004 | Info | Undocumented | Document events |

## Scoring

```
A: No PII, proper context, batched, documented
B: Minor documentation gaps
C: Missing user context or batching
D: Multiple issues
F: PII in events
```

## Output Format

```yaml
events:
  score: "B"
  issues:
    - code: "EVT-001"
      severity: "Critical"
      location: "src/tracking/events.ts:45"
      description: "User email included in event properties"
      recommendation: "Remove PII, use 'signupMethod: email' instead"
    - code: "EVT-003"
      severity: "Warning"
      location: "src/lib/optimizely.ts:12"
      description: "No event batching configured"
      recommendation: "Add eventBatchSize and eventFlushInterval"
  metrics:
    eventsFound: 15
    withUserContext: 12
    withPII: 1
    batchingConfigured: false
```

## Event Best Practices

1. **Never include PII** in event properties
2. **Always include user context** for attribution
3. **Configure batching** for performance
4. **Document events** with properties and usage
5. **Use consistent naming** (snake_case, verb_noun)
6. **Track after success** not before
7. **Revenue in cents** not dollars
