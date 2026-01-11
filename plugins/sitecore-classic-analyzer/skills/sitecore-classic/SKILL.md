---
name: sitecore-classic
description: Apply when working with Sitecore 10.x projects, Helix architecture, MVC renderings, or Sitecore APIs
globs:
  - "**/*.cshtml"
  - "**/App_Config/**/*.config"
  - "**/*.module.json"
  - "**/code/**/*.cs"
  - "**/sitecore.json"
  - "**/*.scss"
  - "**/*.css"
  - "**/scripts/**/*.js"
  - "**/js/**/*.js"
---

## Bundled Skills

This plugin includes the following additional skills for comprehensive development context:

| Skill | Purpose |
|-------|---------|
| `frontend-classic` | CSS/SASS organization, JavaScript/jQuery patterns, BEM naming |
| `frontend-razor` | Razor view syntax, layouts, partials, tag helpers |
| `backend-csharp` | C#/.NET DI patterns, service architecture, async/await |
| `fullstack-classic` | jQuery AJAX integration, form handling, anti-forgery tokens |

These skills are automatically included when you install the Sitecore Classic Analyzer plugin.

# Sitecore 10.x Development Patterns

## Helix Architecture

### Layer Responsibilities

**Foundation Layer**
- Cross-cutting concerns shared across features
- Examples: Logging, Serialization, DI registration, Indexing, ORM
- No business logic, only technical infrastructure
- Can reference other Foundation modules

**Feature Layer**
- Business capabilities and features
- Examples: Navigation, Search, Forms, Checkout, Articles
- Each feature is independent and self-contained
- Can reference Foundation modules only
- NEVER reference other Feature modules

**Project Layer**
- Tenant/site-specific implementations
- Examples: Website, Corporate, MobileApp
- Assembles features for specific sites
- Can reference Feature and Foundation modules

### Dependency Rule

```
Project → Feature → Foundation
```

Features must NEVER reference other Features. If shared logic is needed, extract to Foundation.

### Folder Structure

```
src/
├── Foundation/
│   └── {Module}/
│       ├── code/
│       │   ├── DependencyInjection/
│       │   ├── Services/
│       │   └── Foundation.{Module}.csproj
│       └── serialization/
│           └── {Module}.module.json
├── Feature/
│   └── {Module}/
│       ├── code/
│       │   ├── Controllers/
│       │   ├── Models/
│       │   ├── Services/
│       │   ├── Repositories/
│       │   └── Feature.{Module}.csproj
│       └── serialization/
│           ├── Templates/
│           ├── Renderings/
│           └── {Module}.module.json
└── Project/
    └── {Site}/
        ├── code/
        │   ├── Layouts/
        │   └── Project.{Site}.csproj
        └── serialization/
            ├── Content/
            └── {Site}.module.json
```

## Dependency Injection

### Service Registration

```csharp
using Microsoft.Extensions.DependencyInjection;
using Sitecore.DependencyInjection;

public class RegisterDependencies : IServicesConfigurator
{
    public void Configure(IServiceCollection services)
    {
        // Transient: New instance each time
        services.AddTransient<ISearchService, SearchService>();

        // Scoped: One instance per HTTP request
        services.AddScoped<INavigationService, NavigationService>();

        // Singleton: One instance for application lifetime
        services.AddSingleton<ICacheService, CacheService>();
    }
}
```

### Config Registration

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <services>
      <configurator type="Foundation.DI.RegisterDependencies, Foundation.DI" />
    </services>
  </sitecore>
</configuration>
```

### Constructor Injection

```csharp
public class NavigationController : Controller
{
    private readonly INavigationService _navigationService;
    private readonly ILogger<NavigationController> _logger;

    public NavigationController(
        INavigationService navigationService,
        ILogger<NavigationController> logger)
    {
        _navigationService = navigationService;
        _logger = logger;
    }

    public ActionResult Index()
    {
        var datasource = RenderingContext.Current.Rendering.Item;
        if (datasource == null)
        {
            _logger.LogWarning("Navigation datasource is null");
            return new EmptyResult();
        }

        var model = _navigationService.GetNavigation(datasource);
        return View(model);
    }
}
```

## Content Access Patterns

### Use Content Search (Recommended)

```csharp
public class SearchRepository : ISearchRepository
{
    private readonly ISearchIndex _index;

    public SearchRepository(ISearchIndexResolver indexResolver)
    {
        _index = indexResolver.GetIndex("sitecore_web_index");
    }

    public IEnumerable<ArticleSearchResult> GetArticles(
        ID templateId,
        string language,
        int maxResults = 100)
    {
        using (var context = _index.CreateSearchContext())
        {
            return context.GetQueryable<ArticleSearchResult>()
                .Where(x => x.TemplateId == templateId)
                .Where(x => x.Language == language)
                .OrderByDescending(x => x.Created)
                .Take(maxResults)
                .ToList();
        }
    }
}
```

### Avoid Sitecore.Query (Slow)

```csharp
// BAD - Tree traversal, O(n) where n = tree size
var items = item.Axes.SelectItems(".//*[@@templateid='{GUID}']");

// BAD - Even "fast:" queries traverse the tree
var items = Database.SelectItems("fast:/sitecore/content//*");

// GOOD - Use Content Search instead
var items = searchContext.GetQueryable<SearchResultItem>()
    .Where(x => x.TemplateId == templateId)
    .ToList();
```

### Avoid GetDescendants (Memory Heavy)

```csharp
// BAD - Loads entire subtree into memory
var allItems = rootItem.GetDescendants().ToList();

// GOOD - Use Content Search with path filter
var items = searchContext.GetQueryable<SearchResultItem>()
    .Where(x => x.Paths.Contains(rootItem.ID))
    .Take(1000)
    .ToList();
```

## Caching

### HTML Cache (Rendering Level)

Configure in rendering item or config:

```xml
<r>
  <d id="{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3}">
    <r uid="{RENDERING-UID}"
       s:caching="1"
       s:varybydata="1"
       s:varybydevice="0"
       s:varybylogin="0"
       s:varybyuser="0"
       s:varybyquerystirng="0"
       s:timeout="01:00:00" />
  </d>
</r>
```

### Custom Cache

```csharp
public class NavigationCache : CustomCache
{
    public NavigationCache(string name, long maxSize)
        : base(name, maxSize)
    {
    }

    public NavigationModel Get(string cacheKey)
    {
        return GetObject<NavigationModel>(cacheKey);
    }

    public void Set(string cacheKey, NavigationModel model, TimeSpan duration)
    {
        SetObject(cacheKey, model, duration);
    }
}
```

Register cache:

```csharp
public class RegisterCaches : IServicesConfigurator
{
    public void Configure(IServiceCollection services)
    {
        services.AddSingleton<NavigationCache>(provider =>
            new NavigationCache("NavigationCache", StringUtil.ParseSizeString("50MB")));
    }
}
```

## Configuration Patching

### Basic Patch

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <settings>
      <setting name="MySetting" value="MyValue" />
    </settings>
  </sitecore>
</configuration>
```

### Environment-Specific Settings

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/"
               xmlns:env="http://www.sitecore.net/xmlconfig/env/">
  <sitecore>
    <settings>
      <!-- Only in Production -->
      <setting name="Analytics.Enabled" env:require="Production">
        <patch:attribute name="value">true</patch:attribute>
      </setting>

      <!-- Only in Development -->
      <setting name="Analytics.Enabled" env:require="Development">
        <patch:attribute name="value">false</patch:attribute>
      </setting>
    </settings>
  </sitecore>
</configuration>
```

### Role-Specific Settings

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/"
               xmlns:role="http://www.sitecore.net/xmlconfig/role/">
  <sitecore>
    <settings>
      <!-- Only on Content Management servers -->
      <setting name="Preview.Enabled" role:require="ContentManagement">
        <patch:attribute name="value">true</patch:attribute>
      </setting>

      <!-- Only on Content Delivery servers -->
      <setting name="Preview.Enabled" role:require="ContentDelivery">
        <patch:attribute name="value">false</patch:attribute>
      </setting>
    </settings>
  </sitecore>
</configuration>
```

## Pipeline Processors

### Custom Processor

```csharp
public class EnrichContextProcessor : HttpRequestProcessor
{
    public override void Process(HttpRequestArgs args)
    {
        // Early exit for efficiency
        if (Context.Item == null) return;
        if (Context.Site == null) return;
        if (Context.PageMode.IsExperienceEditor) return;

        // Processor logic here
        EnrichContext();
    }

    private void EnrichContext()
    {
        // Custom enrichment logic
    }
}
```

### Config Registration

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <pipelines>
      <httpRequestBegin>
        <processor type="Feature.Context.EnrichContextProcessor, Feature.Context"
                   patch:after="processor[@type='Sitecore.Pipelines.HttpRequest.ItemResolver, Sitecore.Kernel']" />
      </httpRequestBegin>
    </pipelines>
  </sitecore>
</configuration>
```

## Solr Index Configuration

### Custom Index

```xml
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <contentSearch>
      <configuration>
        <indexes>
          <index id="custom_articles_index">
            <configuration ref="contentSearch/indexConfigurations/defaultSolrIndexConfiguration">
              <documentOptions>
                <fields hint="raw:AddComputedIndexField">
                  <field fieldName="article_author" returnType="string">
                    Feature.Articles.ComputedFields.ArticleAuthor, Feature.Articles
                  </field>
                  <field fieldName="article_category" returnType="stringCollection">
                    Feature.Articles.ComputedFields.ArticleCategories, Feature.Articles
                  </field>
                </fields>
              </documentOptions>
            </configuration>
          </index>
        </indexes>
      </configuration>
    </contentSearch>
  </sitecore>
</configuration>
```

### Computed Field

```csharp
public class ArticleAuthor : IComputedIndexField
{
    public string FieldName { get; set; }
    public string ReturnType { get; set; }

    public object ComputeFieldValue(IIndexable indexable)
    {
        var item = (indexable as SitecoreIndexableItem)?.Item;
        if (item == null) return null;

        var authorItem = item.GetReferenceField("Author")?.TargetItem;
        return authorItem?["Name"];
    }
}
```

## Sitecore Content Serialization (SCS)

### module.json Structure

```json
{
  "namespace": "Feature.Navigation",
  "items": {
    "includes": [
      {
        "name": "templates",
        "path": "/sitecore/templates/Feature/Navigation",
        "allowedPushOperations": "CreateUpdateAndDelete"
      },
      {
        "name": "renderings",
        "path": "/sitecore/layout/Renderings/Feature/Navigation",
        "allowedPushOperations": "CreateUpdateAndDelete"
      },
      {
        "name": "settings",
        "path": "/sitecore/system/Settings/Feature/Navigation",
        "allowedPushOperations": "CreateUpdateAndDelete"
      }
    ]
  }
}
```

### CLI Commands

```bash
# Pull items from Sitecore to disk
dotnet sitecore ser pull

# Push items from disk to Sitecore
dotnet sitecore ser push

# Validate serialization
dotnet sitecore ser validate
```

## Glass Mapper Patterns

### Model Definition

```csharp
[SitecoreType(TemplateId = "{GUID}", AutoMap = true)]
public class ArticlePage
{
    [SitecoreId]
    public virtual Guid Id { get; set; }

    [SitecoreField("Title")]
    public virtual string Title { get; set; }

    [SitecoreField("Content")]
    public virtual string Content { get; set; }

    [SitecoreField("Author")]
    public virtual Author Author { get; set; }

    [SitecoreChildren]
    public virtual IEnumerable<RelatedArticle> RelatedArticles { get; set; }
}
```

### Service Usage

```csharp
public class ArticleService : IArticleService
{
    private readonly ISitecoreService _sitecoreService;

    public ArticleService(ISitecoreService sitecoreService)
    {
        _sitecoreService = sitecoreService;
    }

    public ArticlePage GetArticle(Guid id)
    {
        return _sitecoreService.GetItem<ArticlePage>(id);
    }
}
```

### Avoid N+1 Queries

```csharp
// BAD - N+1 queries with lazy loading
foreach (var article in articles)
{
    var author = article.Author; // Lazy load for each article
}

// GOOD - Eager load or use Content Search
var articleIds = articles.Select(a => a.Id).ToList();
var authors = searchContext.GetQueryable<AuthorSearchResult>()
    .Where(x => articleIds.Contains(x.ArticleId))
    .ToList();
```
