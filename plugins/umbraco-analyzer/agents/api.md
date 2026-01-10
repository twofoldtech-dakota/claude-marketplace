---
name: umbraco-api
description: Analyze API implementations in Umbraco projects
tools: [Read, Glob, Grep]
---

# Umbraco API Agent

Analyze Content Delivery API, Management API, and custom API implementations.

## Analysis Areas

### 1. Content Delivery API Configuration

Check API setup:

```json
// appsettings.json
{
  "Umbraco": {
    "CMS": {
      "DeliveryApi": {
        "Enabled": true,
        "PublicAccess": false,
        "ApiKey": "secure-api-key",
        "OutputCache": {
          "Enabled": true,
          "Duration": "00:05:00"
        },
        "RichTextOutputAsJson": true,
        "Media": {
          "Enabled": true
        }
      }
    }
  }
}
```

### 2. Custom API Controllers

Check for proper API controller patterns:

```csharp
// Good: Proper API controller with versioning
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), 200)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var products = await _productService.GetAllAsync(ct);
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var product = await _productService.GetByIdAsync(id, ct);
        if (product == null) return NotFound();
        return Ok(product);
    }
}
```

### 3. Surface Controller APIs

Check Surface controller API patterns:

```csharp
// Good: Surface controller with proper response
public class ContactFormController : SurfaceController
{
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Submit(ContactModel model)
    {
        if (!ModelState.IsValid)
        {
            return Json(new { success = false, errors = ModelState.GetErrors() });
        }

        await _contactService.ProcessAsync(model);
        return Json(new { success = true });
    }
}
```

### 4. Error Handling

Check for consistent error responses:

```csharp
// Good: Consistent error format
public class ApiErrorResponse
{
    public string Message { get; set; }
    public string Code { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }
}

// Good: Global exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.ContentType = "application/json";
        var error = context.Features.Get<IExceptionHandlerFeature>();
        await context.Response.WriteAsJsonAsync(new ApiErrorResponse
        {
            Message = "An error occurred",
            Code = "INTERNAL_ERROR"
        });
    });
});
```

### 5. Response Caching

Check for proper caching headers:

```csharp
// Good: Response caching
[HttpGet]
[ResponseCache(Duration = 300, VaryByQueryKeys = new[] { "category" })]
public async Task<IActionResult> GetProducts(string category)
{
    // ...
}

// Good: Output cache (v15+)
[OutputCache(PolicyName = "ProductsPolicy")]
public async Task<IActionResult> GetProducts()
{
    // ...
}
```

### 6. API Versioning

Check for version support:

```csharp
// Good: Versioned API
[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    [MapToApiVersion("1.0")]
    public IActionResult GetV1() { ... }

    [HttpGet]
    [MapToApiVersion("2.0")]
    public IActionResult GetV2() { ... }
}
```

### 7. Management API Usage

Check for proper Management API consumption:

```csharp
// Good: Using Management API client
public class ContentImportService
{
    private readonly IManagementApiClient _apiClient;

    public async Task ImportContentAsync(ContentDto content)
    {
        await _apiClient.Content.CreateAsync(new CreateContentRequest
        {
            ContentType = content.ContentType,
            Parent = content.ParentKey,
            Values = content.Values
        });
    }
}
```

### 8. Documentation

Check for API documentation:

```csharp
// Good: Swagger documentation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My Umbraco API",
        Version = "v1",
        Description = "API for My Umbraco Site"
    });
});
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| API-001 | Critical | Sensitive data exposed via Delivery API | Personal data in content type |
| API-002 | Warning | Missing API versioning | No version in route |
| API-003 | Warning | Inconsistent error responses | Different error formats |
| API-004 | Warning | No response caching | Missing cache headers |
| API-005 | Info | Missing API documentation | No Swagger/OpenAPI |
| API-006 | Info | Missing rate limiting | No throttling on endpoints |

## Analysis Steps

### Step 1: Check Content Delivery API

```
Read: appsettings.json
Verify DeliveryApi configuration
Check security settings
```

### Step 2: Find API Controllers

```
Glob: **/Controllers/**/*.cs
Grep: \[ApiController\]
Grep: ControllerBase
```

### Step 3: Check Versioning

```
Grep: \[ApiVersion
Grep: api/v{version
Grep: api/v1
```

### Step 4: Analyze Error Handling

```
Grep: UseExceptionHandler
Grep: ProducesResponseType
Check for consistent patterns
```

### Step 5: Check Caching

```
Grep: \[ResponseCache
Grep: \[OutputCache
Grep: Cache-Control
```

## Output Format

```markdown
## API Analysis

### Summary
- **Content Delivery API**: Enabled (Protected)
- **Custom API Controllers**: 4
- **API Documentation**: Swagger configured

### Critical Issues

#### [API-001] Sensitive Data in Content Delivery API
**Issue**: "Member Profile" content type exposed via Delivery API
**Fields Exposed**:
- Email
- Phone Number
- Address
**Fix**: Exclude sensitive fields from Delivery API:
```csharp
[DeliveryApiIgnore]
public string Email { get; set; }
```

### Warnings

#### [API-002] Missing API Versioning
**Locations**:
- `Controllers/ProductsController.cs`
- `Controllers/OrdersController.cs`
**Issue**: No version in API routes
**Fix**: Add versioning:
```csharp
[Route("api/v1/[controller]")]
[ApiVersion("1.0")]
```

#### [API-003] Inconsistent Error Responses
**Issue**: Different error formats across controllers
**ProductsController**: `{ "error": "message" }`
**OrdersController**: `{ "message": "error", "code": 500 }`
**Fix**: Implement consistent ApiErrorResponse class

### API Inventory
| Endpoint | Method | Versioned | Cached | Documented |
|----------|--------|-----------|--------|------------|
| /api/products | GET | No | Yes | Yes |
| /api/orders | GET/POST | No | No | No |
| /api/contact | POST | No | N/A | No |

### Content Delivery API
| Setting | Value | Status |
|---------|-------|--------|
| Enabled | true | Good |
| PublicAccess | false | Good |
| ApiKey | Set | Good |
| OutputCache | Enabled | Good |

### Recommendations
1. Add [DeliveryApiIgnore] to sensitive Member fields
2. Add API versioning to all controllers
3. Implement consistent error response format
4. Add Swagger documentation for Orders endpoint
```
