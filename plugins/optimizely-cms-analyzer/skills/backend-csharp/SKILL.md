---
name: backend-csharp
description: C# backend patterns for Optimizely CMS projects
---

# Backend C# Patterns

## Overview

This skill covers C# backend patterns commonly used in Optimizely CMS projects including dependency injection, async patterns, and service layer architecture.

## Dependency Injection

### Service Registration

```csharp
// Program.cs or Startup.cs
services.AddScoped<IArticleService, ArticleService>();
services.AddScoped<ISearchService, SearchService>();
services.AddSingleton<ICacheService, MemoryCacheService>();
services.AddTransient<IEmailService, EmailService>();

// Options pattern
services.Configure<EmailOptions>(Configuration.GetSection("Email"));
services.Configure<SearchOptions>(Configuration.GetSection("Search"));
```

### Constructor Injection

```csharp
public class ArticleService : IArticleService
{
    private readonly IContentLoader _contentLoader;
    private readonly IUrlResolver _urlResolver;
    private readonly ILogger<ArticleService> _logger;
    private readonly IOptions<ArticleOptions> _options;

    public ArticleService(
        IContentLoader contentLoader,
        IUrlResolver urlResolver,
        ILogger<ArticleService> logger,
        IOptions<ArticleOptions> options)
    {
        _contentLoader = contentLoader;
        _urlResolver = urlResolver;
        _logger = logger;
        _options = options;
    }
}
```

## Async Patterns

### Async Service Methods

```csharp
public interface IArticleService
{
    Task<ArticleViewModel> GetArticleAsync(
        ContentReference contentLink,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<ArticleViewModel>> GetRelatedArticlesAsync(
        ContentReference contentLink,
        int count = 5,
        CancellationToken cancellationToken = default);
}

public class ArticleService : IArticleService
{
    public async Task<ArticleViewModel> GetArticleAsync(
        ContentReference contentLink,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var article = _contentLoader.Get<ArticlePage>(contentLink);

        return await MapToViewModelAsync(article, cancellationToken);
    }
}
```

### Parallel Operations

```csharp
public async Task<PageViewModel> BuildPageModelAsync(
    PageData page,
    CancellationToken cancellationToken = default)
{
    // Run independent operations in parallel
    var relatedTask = GetRelatedContentAsync(page.ContentLink, cancellationToken);
    var metaTask = GetMetaDataAsync(page, cancellationToken);
    var breadcrumbTask = GetBreadcrumbsAsync(page.ContentLink, cancellationToken);

    await Task.WhenAll(relatedTask, metaTask, breadcrumbTask);

    return new PageViewModel
    {
        RelatedContent = await relatedTask,
        MetaData = await metaTask,
        Breadcrumbs = await breadcrumbTask
    };
}
```

## Service Layer

### Interface Definition

```csharp
public interface IArticleService
{
    ArticleViewModel GetArticle(ContentReference contentLink);
    IEnumerable<ArticleViewModel> GetRelatedArticles(ContentReference contentLink, int count = 5);
    IEnumerable<ArticleViewModel> SearchArticles(string query, int page = 1, int pageSize = 10);
}
```

### Implementation

```csharp
public class ArticleService : IArticleService
{
    private readonly IContentLoader _contentLoader;
    private readonly IUrlResolver _urlResolver;
    private readonly ILogger<ArticleService> _logger;

    public ArticleService(
        IContentLoader contentLoader,
        IUrlResolver urlResolver,
        ILogger<ArticleService> logger)
    {
        _contentLoader = contentLoader;
        _urlResolver = urlResolver;
        _logger = logger;
    }

    public ArticleViewModel GetArticle(ContentReference contentLink)
    {
        try
        {
            var article = _contentLoader.Get<ArticlePage>(contentLink);
            return MapToViewModel(article);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get article {ContentLink}", contentLink);
            throw;
        }
    }

    public IEnumerable<ArticleViewModel> GetRelatedArticles(
        ContentReference contentLink,
        int count = 5)
    {
        var article = _contentLoader.Get<ArticlePage>(contentLink);

        return _contentLoader.GetChildren<ArticlePage>(article.ParentLink)
            .Where(a => a.ContentLink != contentLink)
            .OrderByDescending(a => a.StartPublish)
            .Take(count)
            .Select(MapToViewModel);
    }

    private ArticleViewModel MapToViewModel(ArticlePage article)
    {
        return new ArticleViewModel
        {
            Id = article.ContentLink.ID,
            Heading = article.Heading,
            Body = article.MainBody?.ToHtmlString(),
            Url = _urlResolver.GetUrl(article.ContentLink),
            PublishedDate = article.StartPublish
        };
    }
}
```

## Error Handling

### Structured Logging

```csharp
public class ArticleService : IArticleService
{
    public ArticleViewModel GetArticle(ContentReference contentLink)
    {
        using var scope = _logger.BeginScope(new Dictionary<string, object>
        {
            ["ContentLink"] = contentLink,
            ["Operation"] = "GetArticle"
        });

        try
        {
            _logger.LogDebug("Retrieving article {ContentLink}", contentLink);

            var article = _contentLoader.Get<ArticlePage>(contentLink);

            _logger.LogInformation(
                "Successfully retrieved article {ContentLink} - {Title}",
                contentLink,
                article.Heading);

            return MapToViewModel(article);
        }
        catch (ContentNotFoundException ex)
        {
            _logger.LogWarning(ex,
                "Article not found: {ContentLink}",
                contentLink);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Unexpected error retrieving article {ContentLink}",
                contentLink);
            throw;
        }
    }
}
```

### Custom Exceptions

```csharp
public class ArticleNotFoundException : Exception
{
    public ContentReference ContentLink { get; }

    public ArticleNotFoundException(ContentReference contentLink)
        : base($"Article not found: {contentLink}")
    {
        ContentLink = contentLink;
    }
}

public class ArticleValidationException : Exception
{
    public IEnumerable<string> Errors { get; }

    public ArticleValidationException(IEnumerable<string> errors)
        : base("Article validation failed")
    {
        Errors = errors;
    }
}
```

## Caching

### Memory Cache

```csharp
public class CachedArticleService : IArticleService
{
    private readonly IArticleService _innerService;
    private readonly IMemoryCache _cache;
    private readonly IContentEvents _contentEvents;

    public CachedArticleService(
        IArticleService innerService,
        IMemoryCache cache,
        IContentEvents contentEvents)
    {
        _innerService = innerService;
        _cache = cache;
        _contentEvents = contentEvents;

        _contentEvents.PublishedContent += OnContentPublished;
    }

    public ArticleViewModel GetArticle(ContentReference contentLink)
    {
        var cacheKey = $"article:{contentLink}";

        return _cache.GetOrCreate(cacheKey, entry =>
        {
            entry.SlidingExpiration = TimeSpan.FromMinutes(10);
            entry.Priority = CacheItemPriority.Normal;
            return _innerService.GetArticle(contentLink);
        });
    }

    private void OnContentPublished(object sender, ContentEventArgs e)
    {
        _cache.Remove($"article:{e.ContentLink}");
    }
}
```

## Best Practices

1. **Use constructor injection** for all dependencies
2. **Make methods async** when doing I/O operations
3. **Include CancellationToken** in async method signatures
4. **Use structured logging** with meaningful context
5. **Implement caching** with proper invalidation
6. **Keep controllers thin** - delegate to services
7. **Use the Options pattern** for configuration
