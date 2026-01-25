---
name: optimizely-content-cloud
description: Optimizely Content Cloud (DXP) and headless API patterns
---

# Optimizely Content Cloud

## Overview

This skill covers Optimizely Content Cloud (DXP) patterns including the Content Delivery API, headless architecture, and cloud-specific configurations.

## Content Delivery API

### Configuration

```csharp
// Program.cs
builder.Services.AddContentDeliveryApi(options =>
{
    options.SiteDefinitionApiEnabled = false; // Disable in production
});

builder.Services.AddContentDeliveryApi()
    .WithFriendlyUrl()
    .WithSiteBasedCors();
```

### appsettings.json

```json
{
  "EPiServer": {
    "ContentDeliveryApi": {
      "RequiredRole": "ContentApiRead",
      "MinimumRoles": "Anonymous",
      "SiteDefinitionApiEnabled": false,
      "Search": {
        "MaxResults": 100
      }
    }
  }
}
```

### Custom API Extensions

```csharp
[ApiController]
[Route("api/content")]
[Authorize(Policy = "ContentApi")]
public class CustomContentApiController : ControllerBase
{
    private readonly IContentLoader _contentLoader;
    private readonly IContentModelMapper _modelMapper;

    public CustomContentApiController(
        IContentLoader contentLoader,
        IContentModelMapper modelMapper)
    {
        _contentLoader = contentLoader;
        _modelMapper = modelMapper;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetContent(int id)
    {
        var contentLink = new ContentReference(id);
        var content = _contentLoader.Get<IContent>(contentLink);

        if (content == null)
            return NotFound();

        var model = _modelMapper.TransformContent(content);
        return Ok(model);
    }
}
```

## Content Model Mapping

### Custom Content Model

```csharp
public class ArticleContentModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Heading { get; set; }
    public string Body { get; set; }
    public DateTime? PublishedDate { get; set; }
    public string Url { get; set; }
    public ImageModel HeroImage { get; set; }
}
```

### Content Model Mapper

```csharp
public interface IContentModelMapper
{
    ArticleContentModel Map(ArticlePage page);
}

public class ContentModelMapper : IContentModelMapper
{
    private readonly IUrlResolver _urlResolver;

    public ContentModelMapper(IUrlResolver urlResolver)
    {
        _urlResolver = urlResolver;
    }

    public ArticleContentModel Map(ArticlePage page)
    {
        return new ArticleContentModel
        {
            Id = page.ContentLink.ID,
            Name = page.Name,
            Heading = page.Heading,
            Body = page.MainBody?.ToHtmlString(),
            PublishedDate = page.PublishedDate,
            Url = _urlResolver.GetUrl(page.ContentLink)
        };
    }
}
```

## GraphQL Integration

### Query Examples

```graphql
query GetArticle($id: Int!) {
  ArticlePage(id: $id) {
    name
    heading
    mainBody {
      html
    }
    publishedDate
    heroImage {
      url
      alt
    }
  }
}

query GetArticleList($parentId: Int!, $first: Int!) {
  ArticlePage(
    where: { parentLink: { id: { eq: $parentId } } }
    first: $first
    orderBy: { publishedDate: DESC }
  ) {
    items {
      name
      heading
      url
    }
    totalCount
  }
}
```

### GraphQL Service

```csharp
public class GraphQLService
{
    private readonly HttpClient _httpClient;

    public GraphQLService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<T> QueryAsync<T>(string query, object variables)
    {
        var request = new
        {
            query,
            variables
        };

        var response = await _httpClient.PostAsJsonAsync("/graphql", request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<GraphQLResponse<T>>();
        return result.Data;
    }
}
```

## CDN Configuration

### Azure CDN Setup

```csharp
services.AddAzureCdnMediaProvider(options =>
{
    options.CdnBaseUrl = Configuration["Cdn:BaseUrl"];
    options.ContainerName = Configuration["Cdn:Container"];
});
```

### Cache Headers

```csharp
[OutputCache(Duration = 3600, VaryByQueryKeys = new[] { "id", "lang" })]
public async Task<IActionResult> GetContent(int id, string lang)
{
    Response.Headers.Add("Cache-Control", "public, max-age=3600");
    Response.Headers.Add("CDN-Cache-Control", "max-age=86400");

    // Content retrieval
}
```

## Authentication

### OAuth/OIDC Configuration

```csharp
services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie()
.AddOpenIdConnect(options =>
{
    options.Authority = Configuration["Auth:Authority"];
    options.ClientId = Configuration["Auth:ClientId"];
    options.ResponseType = "code";
    options.SaveTokens = true;
});
```

### API Key Authentication

```csharp
public class ApiKeyAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Api-Key", out var apiKey))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        if (!ValidateApiKey(apiKey))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key"));
        }

        var claims = new[] { new Claim(ClaimTypes.Name, "ApiClient") };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
```

## Cloud-Specific Patterns

### Environment Configuration

```csharp
if (builder.Environment.IsProduction())
{
    // Production-specific configuration
    builder.Services.AddApplicationInsightsTelemetry();
    builder.Services.AddAzureBlobProvider();
}
else
{
    // Development configuration
    builder.Services.AddLocalBlobProvider();
}
```

### Health Checks

```csharp
services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddUrlGroup(new Uri(Configuration["ExternalApi:Url"]), "external-api")
    .AddAzureBlobStorage(Configuration["BlobStorage:ConnectionString"]);

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

## Best Practices

1. **Secure the Content Delivery API** with proper role requirements
2. **Use CDN** for static assets and cacheable content
3. **Implement proper caching** at API and CDN levels
4. **Use managed identity** for Azure service authentication
5. **Configure CORS** properly for frontend applications
6. **Monitor with Application Insights** for cloud deployments
