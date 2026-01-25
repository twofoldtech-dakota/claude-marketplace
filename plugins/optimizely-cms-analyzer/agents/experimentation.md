---
name: optimizely-experimentation
description: Analyze Optimizely Experimentation SDK integration in CMS projects
tools: [Read, Glob, Grep]
---

# Optimizely Experimentation Agent

Analyze Optimizely Experimentation SDK integration within CMS projects.

## Analysis Areas

### 1. SDK Initialization

**EXP-001: Experimentation SDK Without Initialization (Warning)**

Check for proper SDK setup:

```
Grep: Optimizely\.Experimentation
Grep: AddOptimizelyExperimentation
Grep: OptimizelyClient
Grep: IOptimizely
```

**Bad Pattern** (SDK referenced but not initialized):
```csharp
// Package added but not configured
public class MyService
{
    private readonly IOptimizely _optimizely;
    // But no initialization in Startup...
}
```

**Good Pattern**:
```csharp
// In Startup.cs or Program.cs
services.AddOptimizelyExperimentation(options =>
{
    options.SdkKey = Configuration["Optimizely:SdkKey"];
});
```

### 2. Feature Flag Patterns

**EXP-002: Feature Flags Not Using Typed Accessors (Warning)**

Feature flags should use typed accessors:

```
Grep: IsFeatureEnabled\s*\(\s*["']
Grep: GetFeatureVariable\s*\(
```

**Bad Pattern** (String-based):
```csharp
// Magic strings - error prone
var isEnabled = _optimizely.IsFeatureEnabled("new_checkout", userId);
var discount = _optimizely.GetFeatureVariableDouble("pricing", "discount", userId);
```

**Good Pattern** (Typed accessors):
```csharp
// Typed feature keys
public static class FeatureKeys
{
    public const string NewCheckout = "new_checkout";
    public const string Pricing = "pricing";
}

public static class FeatureVariables
{
    public const string Discount = "discount";
}

var isEnabled = _optimizely.IsFeatureEnabled(FeatureKeys.NewCheckout, userId);
var discount = _optimizely.GetFeatureVariableDouble(
    FeatureKeys.Pricing,
    FeatureVariables.Discount,
    userId);
```

### 3. Event Tracking Configuration

**EXP-003: Experimentation Tracking Not Configured (Info)**

Check for event tracking setup:

```
Grep: Track\s*\(
Grep: IEventDispatcher
Grep: EventDispatcher
```

**Good Pattern**:
```csharp
// Track conversion events
_optimizely.Track("purchase_completed", userId, new UserAttributes
{
    { "device", "mobile" },
    { "customer_type", "returning" }
});
```

### 4. User Context

**EXP-004: Missing User Context for Personalization (Info)**

Check for proper user context usage:

```
Grep: UserAttributes
Grep: CreateUserContext
Grep: OptimizelyUserContext
```

**Bad Pattern** (No user context):
```csharp
// Missing user attributes for proper segmentation
var decision = _optimizely.Decide("experiment_key", userId);
```

**Good Pattern**:
```csharp
// Rich user context
var userContext = _optimizely.CreateUserContext(userId, new UserAttributes
{
    { "country", user.Country },
    { "subscription_tier", user.SubscriptionLevel },
    { "lifetime_value", user.TotalSpend }
});

var decision = userContext.Decide("experiment_key");
```

### 5. Integration with CMS Content

Check for proper integration between experimentation and CMS:

```
Grep: IContent.*Optimizely
Grep: ContentArea.*Experiment
Grep: PersonalizationGroup
```

**Pattern for Content-Based Experiments**:
```csharp
public class ArticlePageController : PageController<ArticlePage>
{
    private readonly IOptimizely _optimizely;

    public IActionResult Index(ArticlePage currentPage)
    {
        var userId = GetOrCreateUserId();
        var variation = _optimizely.Activate("article_layout", userId);

        return variation switch
        {
            "compact" => View("Compact", currentPage),
            "expanded" => View("Expanded", currentPage),
            _ => View(currentPage)
        };
    }
}
```

### 6. SDK Key Security

Check that SDK keys are not hardcoded:

```
Grep: SdkKey\s*=\s*["']
Grep: sdkKey.*[A-Za-z0-9]{20,}
```

**Bad Pattern**:
```csharp
services.AddOptimizelyExperimentation(options =>
{
    options.SdkKey = "abc123def456..."; // Hardcoded!
});
```

**Good Pattern**:
```csharp
services.AddOptimizelyExperimentation(options =>
{
    options.SdkKey = Configuration["Optimizely:SdkKey"];
});
```

### 7. Error Handling

Check for proper error handling with experimentation:

```
Grep: try.*Optimizely.*catch
Grep: IsFeatureEnabled.*\?\?
Grep: Decide.*\?\?
```

**Good Pattern**:
```csharp
public bool IsNewFeatureEnabled(string userId)
{
    try
    {
        return _optimizely.IsFeatureEnabled("new_feature", userId);
    }
    catch (Exception ex)
    {
        _logger.LogWarning(ex, "Experimentation SDK error, defaulting to false");
        return false; // Safe default
    }
}
```

### 8. Datafile Management

Check for datafile configuration:

```
Grep: DatafileHandler
Grep: PollingProjectConfigManager
Grep: HttpProjectConfigManager
```

**Good Pattern**:
```csharp
services.AddOptimizelyExperimentation(options =>
{
    options.SdkKey = sdkKey;
    options.DatafileAccessToken = accessToken;
    options.PollingInterval = TimeSpan.FromMinutes(5);
});
```

## Detection Summary

| Code | Severity | What to Check |
|------|----------|---------------|
| EXP-001 | Warning | SDK referenced but not initialized |
| EXP-002 | Warning | Magic strings for feature keys |
| EXP-003 | Info | No event tracking configured |
| EXP-004 | Info | Missing user attributes |

## Scoring

```
A: Properly configured SDK with typed accessors and tracking
B: SDK configured but missing some best practices
C: SDK referenced but initialization issues
D: Multiple integration problems
F: SDK present but non-functional
```

## Output Format

```yaml
experimentation:
  score: "B"
  detected: true
  sdkVersion: "4.0.0"
  issues:
    - code: "EXP-001"
      severity: "Warning"
      location: "src/Web/Services/FeatureFlagService.cs:12"
      description: "Optimizely SDK referenced but no initialization found"
      recommendation: "Add services.AddOptimizelyExperimentation() in Startup"
    - code: "EXP-002"
      severity: "Warning"
      location: "src/Web/Controllers/CheckoutController.cs:45"
      description: "Feature flag using magic string 'new_checkout'"
      recommendation: "Create typed FeatureKeys constants class"
  metrics:
    featureFlagsFound: 5
    trackingCalls: 3
    experimentsFound: 2
```

## Cross-Plugin Note

If significant Optimizely Experimentation usage is detected, recommend running the dedicated `/optimizely-exp:analyze` plugin for comprehensive JavaScript SDK and client-side analysis.
