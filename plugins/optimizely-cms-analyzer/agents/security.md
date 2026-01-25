---
name: optimizely-security
description: Analyze Optimizely CMS security configuration, API exposure, and authentication patterns
tools: [Read, Glob, Grep]
---

# Optimizely Security Agent

Analyze security configuration, Content Delivery API exposure, and authentication patterns.

## Analysis Areas

### 1. Content Delivery API Exposure

**SEC-001: Content Delivery API Publicly Accessible (Critical)**

Check if Content Delivery API is exposed without authentication:

```
Glob: **/appsettings*.json
Grep: ContentDeliveryApi
Grep: RequiredRole
Grep: Anonymous
```

**Bad Configuration**:
```json
{
  "EPiServer": {
    "ContentDeliveryApi": {
      "RequiredRole": ""  // Empty = public access!
    }
  }
}
```

**Good Configuration**:
```json
{
  "EPiServer": {
    "ContentDeliveryApi": {
      "RequiredRole": "ContentApiRead",
      "SiteDefinitionApiEnabled": false
    }
  }
}
```

**SEC-004: Content Delivery API Without Authentication (Warning)**

```csharp
// Check for missing [Authorize] on custom API controllers
[ApiController]
[Route("api/content")]
public class ContentApiController : ControllerBase
{
    // Missing [Authorize] attribute!
    [HttpGet]
    public IActionResult GetContent(ContentReference id) { }
}
```

### 2. Credential Management

**SEC-002: Hardcoded Credentials (Critical)**

Search for hardcoded secrets:

```
Grep: password\s*=\s*["']
Grep: connectionstring.*password
Grep: apikey\s*=\s*["']
Grep: secret\s*=\s*["']
Grep: -----BEGIN.*PRIVATE KEY-----
```

**Bad Patterns**:
```csharp
// Hardcoded credentials
var connectionString = "Server=.;Database=Cms;User Id=sa;Password=P@ssw0rd;";
var apiKey = "sk-abc123def456";
```

**Good Patterns**:
```csharp
// From configuration
var connectionString = _configuration.GetConnectionString("EPiServerDB");

// From secure secrets (Azure Key Vault, etc.)
var apiKey = _configuration["ExternalApi:Key"];
```

### 3. CSRF Protection

**SEC-003: Missing CSRF Protection (Critical)**

Check for anti-forgery token usage:

```
Grep: \[ValidateAntiForgeryToken\]
Grep: \[IgnoreAntiforgeryToken\]
Grep: @Html\.AntiForgeryToken
```

**Bad Pattern** (POST without CSRF):
```csharp
[HttpPost]
public IActionResult SubmitForm(FormModel model)
{
    // No [ValidateAntiForgeryToken]!
}
```

**Good Pattern**:
```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult SubmitForm(FormModel model)
{
    // Protected
}
```

### 4. Admin Area Security

**SEC-005: Admin Accessible From Public (Warning)**

Check admin/CMS UI access restrictions:

```
Glob: **/Startup.cs
Glob: **/Program.cs
Grep: UseAdminAuthentication
Grep: AdminPath
Grep: episerver
```

Verify:
- Admin path changed from default `/episerver`
- IP restrictions on admin area
- Separate admin authentication

### 5. CORS Configuration

**SEC-006: Permissive CORS Configuration (Warning)**

```
Glob: **/Startup.cs
Glob: **/Program.cs
Grep: AddCors
Grep: AllowAnyOrigin
Grep: AllowAnyHeader
Grep: AllowCredentials
```

**Bad Pattern**:
```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()  // Dangerous!
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

**Good Pattern**:
```csharp
services.AddCors(options =>
{
    options.AddPolicy("FrontendOnly", builder =>
    {
        builder.WithOrigins("https://www.example.com", "https://app.example.com")
               .WithMethods("GET", "POST")
               .WithHeaders("Content-Type", "Authorization");
    });
});
```

### 6. Virtual Roles

**SEC-007: Default Virtual Roles Unchanged (Info)**

```
Glob: **/appsettings*.json
Grep: VirtualRoles
Grep: WebAdmins
Grep: WebEditors
```

Check if default virtual role mappings are appropriate for environment.

### 7. Additional Security Checks

**Authentication Configuration**:
```csharp
// Check for proper authentication setup
services.AddAuthentication()
    .AddCookie()
    .AddOpenIdConnect();  // If using OIDC
```

**Authorization Policies**:
```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("ContentEditors", policy =>
        policy.RequireRole("WebEditors", "Administrators"));
});
```

**HTTPS Enforcement**:
```csharp
app.UseHttpsRedirection();
app.UseHsts();
```

### 8. Sensitive Data in URLs

Check for sensitive data in query strings:

```
Grep: \?.*password
Grep: \?.*token
Grep: \?.*apikey
```

### 9. Security Headers

Check for security headers configuration:

```csharp
// Good: Security headers middleware
app.UseSecurityHeaders(policies =>
{
    policies.AddContentSecurityPolicy(builder => { })
            .AddXContentTypeOptions()
            .AddXFrameOptions();
});
```

## Issue Detection Rules

| Code | Severity | Pattern | Description |
|------|----------|---------|-------------|
| SEC-001 | Critical | API public access | Require authentication |
| SEC-002 | Critical | Hardcoded secrets | Use configuration/vault |
| SEC-003 | Critical | Missing CSRF | Add ValidateAntiForgeryToken |
| SEC-004 | Warning | API no auth | Add [Authorize] |
| SEC-005 | Warning | Public admin | Restrict admin access |
| SEC-006 | Warning | Permissive CORS | Restrict origins |
| SEC-007 | Info | Default roles | Review role mappings |

## Files to Check

```
appsettings.json
appsettings.*.json
web.config (legacy)
connectionStrings.config
Startup.cs / Program.cs
**/Controllers/**/*.cs
```

## Scoring

```
A: 0 Critical, API secured, no exposed credentials
B: 0 Critical, minor config issues
C: 1 Critical
D: 2 Critical
F: 3+ Critical or publicly accessible API without auth
```

## Output Format

```yaml
security:
  score: "C"
  issues:
    - code: "SEC-001"
      severity: "Critical"
      location: "appsettings.json:45"
      description: "Content Delivery API RequiredRole is empty (public access)"
      recommendation: "Set RequiredRole to a specific role like 'ContentApiRead'"
    - code: "SEC-002"
      severity: "Critical"
      location: "src/Web/Startup.cs:78"
      description: "Connection string contains hardcoded password"
      recommendation: "Move to User Secrets or Azure Key Vault"
  metrics:
    publicApis: 2
    hardcodedCredentials: 1
    missingCsrf: 3
    permissiveCors: 1
```

## Content Cloud Specific

For Content Cloud (DXP) deployments:

- Check Azure AD integration
- Verify managed identity usage
- Review Application Insights configuration (no PII)
- Check CDN security headers
