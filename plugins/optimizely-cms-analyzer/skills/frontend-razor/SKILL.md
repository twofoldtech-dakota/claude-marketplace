---
name: frontend-razor
description: Razor view patterns for Optimizely CMS projects
---

# Frontend Razor Patterns

## Overview

This skill covers Razor view patterns for Optimizely CMS including page templates, block rendering, and content area handling.

## Page Templates

### Basic Page View

```cshtml
@model ArticlePage

@{
    Layout = "~/Views/Shared/_Layout.cshtml";
    ViewData["Title"] = Model.MetaTitle ?? Model.Heading;
}

<article class="article">
    <header class="article-header">
        <h1>@Model.Heading</h1>
        @if (Model.PublishedDate.HasValue)
        {
            <time datetime="@Model.PublishedDate.Value.ToString("yyyy-MM-dd")">
                @Model.PublishedDate.Value.ToString("MMMM d, yyyy")
            </time>
        }
    </header>

    @if (Model.HeroImage != null)
    {
        <figure class="article-hero">
            <img src="@Url.ContentUrl(Model.HeroImage)" alt="@Model.Heading" />
        </figure>
    }

    <div class="article-content">
        @Html.PropertyFor(m => m.MainBody)
    </div>

    @Html.PropertyFor(m => m.RelatedContentArea)
</article>
```

### View with ViewModel

```cshtml
@model ArticleViewModel

@{
    Layout = "~/Views/Shared/_Layout.cshtml";
}

<article class="article">
    <h1>@Model.Heading</h1>

    @Html.Raw(Model.Body)

    <section class="related-articles">
        <h2>Related Articles</h2>
        <ul>
            @foreach (var related in Model.RelatedArticles)
            {
                <li>
                    <a href="@related.Url">@related.Heading</a>
                </li>
            }
        </ul>
    </section>
</article>
```

## Block Templates

### Block View

```cshtml
@model HeroBlock

<section class="hero" style="background-image: url('@Url.ContentUrl(Model.BackgroundImage)')">
    <div class="hero-content">
        <h1>@Model.Heading</h1>
        @if (!string.IsNullOrEmpty(Model.Subheading))
        {
            <p class="hero-subheading">@Model.Subheading</p>
        }
        @if (Model.CallToActionUrl != null)
        {
            <a href="@Model.CallToActionUrl" class="btn btn-primary">
                @(Model.CallToActionText ?? "Learn More")
            </a>
        }
    </div>
</section>
```

### Block with Edit Mode Support

```cshtml
@using EPiServer.Web.Mvc.Html
@model TeaserBlock

<div class="teaser">
    @Html.PropertyFor(m => m.Heading, new { Tag = "h3", CssClass = "teaser-heading" })

    @Html.PropertyFor(m => m.Text, new { CssClass = "teaser-text" })

    @if (Model.Link != null)
    {
        <a href="@Url.ContentUrl(Model.Link)" class="teaser-link">
            @Html.PropertyFor(m => m.LinkText)
        </a>
    }
</div>
```

## Content Areas

### Rendering Content Areas

```cshtml
@using EPiServer.Web.Mvc.Html
@model PageData

<main class="page-content">
    @* Default rendering *@
    @Html.PropertyFor(m => m.MainContentArea)

    @* With custom tag and CSS class *@
    @Html.PropertyFor(m => m.SidebarArea, new {
        Tag = "aside",
        CssClass = "sidebar",
        ChildrenTag = "div",
        ChildrenCssClass = "sidebar-block"
    })

    @* With custom item wrapper *@
    @Html.PropertyFor(m => m.FooterArea, new {
        CustomTag = "section",
        CssClass = "footer-blocks"
    })
</main>
```

### Content Area with Custom Rendering

```cshtml
@using EPiServer.Core
@model ContentArea

@if (Model != null && Model.FilteredItems.Any())
{
    <div class="content-blocks">
        @foreach (var item in Model.FilteredItems)
        {
            var content = item.GetContent();
            <div class="content-block @GetBlockClass(content)">
                @Html.DisplayFor(m => content)
            </div>
        }
    </div>
}

@functions {
    private string GetBlockClass(IContent content)
    {
        return content.GetOriginalType().Name.ToLowerInvariant().Replace("block", "-block");
    }
}
```

## Tag Helpers

### Optimizely Tag Helpers

```cshtml
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper *, EPiServer.Web.Mvc

@* Content link tag helper *@
<a epi-link="@Model.LinkToPage">@Model.LinkText</a>

@* Property editing *@
<div epi-edit="MainBody">
    @Html.Raw(Model.MainBody?.ToHtmlString())
</div>

@* Content URL *@
<img src="@Url.ContentUrl(Model.Image)" alt="@Model.ImageAlt" />
```

### Custom Tag Helper

```csharp
[HtmlTargetElement("optimizely-breadcrumb")]
public class BreadcrumbTagHelper : TagHelper
{
    private readonly IContentLoader _contentLoader;
    private readonly IUrlResolver _urlResolver;

    public ContentReference CurrentPage { get; set; }

    public BreadcrumbTagHelper(
        IContentLoader contentLoader,
        IUrlResolver urlResolver)
    {
        _contentLoader = contentLoader;
        _urlResolver = urlResolver;
    }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "nav";
        output.Attributes.Add("aria-label", "Breadcrumb");

        var breadcrumbs = GetBreadcrumbs(CurrentPage);
        var list = new StringBuilder("<ol class=\"breadcrumb\">");

        foreach (var crumb in breadcrumbs)
        {
            list.Append($"<li><a href=\"{crumb.Url}\">{crumb.Name}</a></li>");
        }

        list.Append("</ol>");
        output.Content.SetHtmlContent(list.ToString());
    }
}
```

## Partial Views

### Shared Partial

```cshtml
@* Views/Shared/_ArticleCard.cshtml *@
@model ArticleViewModel

<article class="article-card">
    @if (!string.IsNullOrEmpty(Model.ThumbnailUrl))
    {
        <img src="@Model.ThumbnailUrl" alt="" class="article-card-image" />
    }
    <div class="article-card-content">
        <h3 class="article-card-title">
            <a href="@Model.Url">@Model.Heading</a>
        </h3>
        <p class="article-card-excerpt">@Model.Excerpt</p>
        <time datetime="@Model.PublishedDate?.ToString("yyyy-MM-dd")">
            @Model.PublishedDate?.ToString("MMM d, yyyy")
        </time>
    </div>
</article>
```

### Using Partial

```cshtml
@model ArticleListPage

<div class="article-list">
    @foreach (var article in Model.Articles)
    {
        @await Html.PartialAsync("_ArticleCard", article)
    }
</div>
```

## Edit Mode Support

### Edit Mode Detection

```cshtml
@using EPiServer.Web
@model PageData

@if (PageEditing.PageIsInEditMode)
{
    <div class="edit-mode-notice">
        You are in edit mode
    </div>
}

<div class="content" data-epi-edit="@Html.EditAttributes(m => m.MainBody)">
    @Html.PropertyFor(m => m.MainBody)
</div>
```

## Best Practices

1. **Use PropertyFor** for editable properties
2. **Support edit mode** with proper attributes
3. **Use partials** for reusable components
4. **Separate views and viewmodels** for complex pages
5. **Use tag helpers** for clean markup
6. **Handle null content** gracefully
