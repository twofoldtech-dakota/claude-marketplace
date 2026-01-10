---
name: umbraco-modern-guide
description: Apply when working with Umbraco 14+, Lit components, Content Delivery API, or backoffice extensions
globs:
  - "**/App_Plugins/**/*.ts"
  - "**/umbraco-package.json"
  - "**/*.element.ts"
  - "**/appsettings.json"
---

# Umbraco Modern Development (v14+)

## Architecture Overview

Umbraco 14+ uses a modern architecture:
- **Backoffice**: Lit-based web components
- **API**: Content Delivery API and Management API
- **Caching**: HybridCache (v15+)
- **.NET**: 8.0+ (9.0 for v15, 9.0/10.0 for v16)

## Lit Property Editor

### Basic Property Editor

```typescript
// App_Plugins/MyPackage/property-editors/color-picker.element.ts
import { LitElement, html, css, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';

@customElement('my-color-picker')
export class MyColorPicker extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    value: string = '#000000';

    @state()
    private _colors: string[] = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

    static styles = css`
        :host {
            display: block;
        }
        .color-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }
        .color-swatch {
            width: 40px;
            height: 40px;
            border: 2px solid transparent;
            border-radius: 4px;
            cursor: pointer;
        }
        .color-swatch.selected {
            border-color: var(--uui-color-selected);
        }
    `;

    render() {
        return html`
            <div class="color-grid">
                ${this._colors.map(color => html`
                    <button
                        class="color-swatch ${this.value === color ? 'selected' : ''}"
                        style="background-color: ${color}"
                        @click=${() => this.#selectColor(color)}
                    ></button>
                `)}
            </div>
            <uui-input
                type="text"
                .value=${this.value}
                @change=${this.#onInputChange}
                placeholder="#RRGGBB"
            ></uui-input>
        `;
    }

    #selectColor(color: string) {
        this.value = color;
        this.#dispatchChange();
    }

    #onInputChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.value = input.value;
        this.#dispatchChange();
    }

    #dispatchChange() {
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'my-color-picker': MyColorPicker;
    }
}
```

### Property Editor with Configuration

```typescript
import { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';

@customElement('my-configurable-editor')
export class MyConfigurableEditor extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    value: string = '';

    @property({ attribute: false })
    config?: UmbPropertyEditorConfigCollection;

    private get _maxLength(): number {
        return this.config?.getValueByAlias('maxLength') ?? 100;
    }

    private get _placeholder(): string {
        return this.config?.getValueByAlias('placeholder') ?? '';
    }

    render() {
        return html`
            <uui-input
                .value=${this.value}
                .maxlength=${this._maxLength}
                .placeholder=${this._placeholder}
                @change=${this.#onChange}
            ></uui-input>
            <small>${this.value.length}/${this._maxLength}</small>
        `;
    }

    #onChange(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }
}
```

## umbraco-package.json

### Complete Package Manifest

```json
{
    "name": "My.Package",
    "version": "1.0.0",
    "extensions": [
        {
            "type": "propertyEditorUi",
            "alias": "My.ColorPicker",
            "name": "My Color Picker",
            "element": "/App_Plugins/MyPackage/dist/color-picker.js",
            "meta": {
                "label": "Color Picker",
                "icon": "icon-colorpicker",
                "group": "common",
                "propertyEditorSchemaAlias": "Umbraco.Plain.String",
                "settings": {
                    "properties": [
                        {
                            "alias": "colors",
                            "label": "Available Colors",
                            "propertyEditorUiAlias": "Umb.PropertyEditorUi.TextBox"
                        }
                    ]
                }
            }
        },
        {
            "type": "dashboard",
            "alias": "My.Dashboard",
            "name": "My Dashboard",
            "element": "/App_Plugins/MyPackage/dist/dashboard.js",
            "weight": 10,
            "meta": {
                "label": "My Dashboard",
                "pathname": "my-dashboard"
            },
            "conditions": [
                {
                    "alias": "Umb.Condition.SectionAlias",
                    "match": "Umb.Section.Content"
                }
            ]
        },
        {
            "type": "localization",
            "alias": "My.Localization.En",
            "name": "English",
            "meta": {
                "culture": "en"
            },
            "js": "/App_Plugins/MyPackage/lang/en.js"
        }
    ]
}
```

## Content Delivery API

### Configuration

```json
{
  "Umbraco": {
    "CMS": {
      "DeliveryApi": {
        "Enabled": true,
        "PublicAccess": false,
        "ApiKey": "your-secure-api-key-here",
        "OutputCache": {
          "Enabled": true,
          "Duration": "00:05:00"
        },
        "RichTextOutputAsJson": true,
        "Media": {
          "Enabled": true
        },
        "MemberAuthorization": {
          "MemberTypeAliases": ["member"]
        }
      }
    }
  }
}
```

### API Endpoints

```bash
# Get content by route
GET /umbraco/delivery/api/v2/content/item/{path}
Authorization: Api-Key your-api-key

# Get content by ID
GET /umbraco/delivery/api/v2/content/item/{id}
Authorization: Api-Key your-api-key

# Query content
GET /umbraco/delivery/api/v2/content?filter=contentType:blogPost&sort=createDate:desc&take=10
Authorization: Api-Key your-api-key

# Get media
GET /umbraco/delivery/api/v2/media/{id}
Authorization: Api-Key your-api-key
```

### Consuming the API (JavaScript)

```typescript
const API_BASE = 'https://your-site.com/umbraco/delivery/api/v2';
const API_KEY = 'your-api-key';

async function getContent(path: string) {
    const response = await fetch(`${API_BASE}/content/item/${encodeURIComponent(path)}`, {
        headers: {
            'Api-Key': API_KEY,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
    }

    return response.json();
}

async function queryContent(contentType: string, take: number = 10) {
    const params = new URLSearchParams({
        'filter': `contentType:${contentType}`,
        'sort': 'createDate:desc',
        'take': take.toString()
    });

    const response = await fetch(`${API_BASE}/content?${params}`, {
        headers: {
            'Api-Key': API_KEY,
            'Accept': 'application/json'
        }
    });

    return response.json();
}
```

### Custom Delivery API Extension

```csharp
// Extend the Delivery API response
public class CustomContentResponseHandler : IContentResponseHandler
{
    public Task<IApiContentResponse?> HandleAsync(
        IPublishedContent content,
        CancellationToken cancellationToken)
    {
        // Add custom data to response
        return Task.FromResult<IApiContentResponse?>(
            new ApiContentResponse(content)
            {
                CustomData = new { CustomField = "value" }
            });
    }
}

// Register in Composer
builder.Services.AddTransient<IContentResponseHandler, CustomContentResponseHandler>();
```

## HybridCache (v15+)

### Basic Usage

```csharp
public class CachedProductService
{
    private readonly HybridCache _cache;
    private readonly IProductRepository _repository;

    public CachedProductService(HybridCache cache, IProductRepository repository)
    {
        _cache = cache;
        _repository = repository;
    }

    public async Task<ProductDto?> GetProductAsync(Guid id, CancellationToken ct)
    {
        return await _cache.GetOrCreateAsync(
            $"product_{id}",
            async token => await _repository.GetByIdAsync(id, token),
            new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromMinutes(10),
                LocalCacheExpiration = TimeSpan.FromMinutes(5)
            },
            cancellationToken: ct
        );
    }

    public async Task InvalidateProductAsync(Guid id, CancellationToken ct)
    {
        await _cache.RemoveAsync($"product_{id}", ct);
    }
}
```

### Configuration

```csharp
// In Composer
builder.Services.AddHybridCache(options =>
{
    options.MaximumPayloadBytes = 1024 * 1024; // 1MB
    options.MaximumKeyLength = 256;
    options.DefaultEntryOptions = new HybridCacheEntryOptions
    {
        Expiration = TimeSpan.FromMinutes(30),
        LocalCacheExpiration = TimeSpan.FromMinutes(5)
    };
});
```

## Dashboard Component

```typescript
// App_Plugins/MyPackage/dashboards/analytics.element.ts
import { LitElement, html, css, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbDashboardElement } from '@umbraco-cms/backoffice/dashboard';

interface AnalyticsData {
    pageViews: number;
    visitors: number;
    topPages: { path: string; views: number }[];
}

@customElement('my-analytics-dashboard')
export class MyAnalyticsDashboard extends LitElement implements UmbDashboardElement {
    @state()
    private _loading = true;

    @state()
    private _data: AnalyticsData | null = null;

    @state()
    private _error: string | null = null;

    static styles = css`
        :host {
            display: block;
            padding: var(--uui-size-layout-1);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--uui-size-space-4);
            margin-bottom: var(--uui-size-space-6);
        }
        .stat-card {
            padding: var(--uui-size-space-4);
            background: var(--uui-color-surface);
            border-radius: var(--uui-border-radius);
        }
        .stat-value {
            font-size: var(--uui-type-h2-size);
            font-weight: bold;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.#loadData();
    }

    async #loadData() {
        try {
            this._loading = true;
            const response = await fetch('/api/analytics');
            if (!response.ok) throw new Error('Failed to load analytics');
            this._data = await response.json();
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Unknown error';
        } finally {
            this._loading = false;
        }
    }

    render() {
        if (this._loading) {
            return html`<uui-loader></uui-loader>`;
        }

        if (this._error) {
            return html`
                <uui-box headline="Error">
                    <p>${this._error}</p>
                    <uui-button @click=${this.#loadData}>Retry</uui-button>
                </uui-box>
            `;
        }

        return html`
            <uui-box headline="Analytics Overview">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Page Views</div>
                        <div class="stat-value">${this._data?.pageViews.toLocaleString()}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Visitors</div>
                        <div class="stat-value">${this._data?.visitors.toLocaleString()}</div>
                    </div>
                </div>

                <h3>Top Pages</h3>
                <uui-table>
                    <uui-table-head>
                        <uui-table-head-cell>Page</uui-table-head-cell>
                        <uui-table-head-cell>Views</uui-table-head-cell>
                    </uui-table-head>
                    ${this._data?.topPages.map(page => html`
                        <uui-table-row>
                            <uui-table-cell>${page.path}</uui-table-cell>
                            <uui-table-cell>${page.views}</uui-table-cell>
                        </uui-table-row>
                    `)}
                </uui-table>
            </uui-box>
        `;
    }
}
```

## Management API

### Configuration

```json
{
  "Umbraco": {
    "CMS": {
      "ManagementApi": {
        "Enabled": true,
        "Authentication": {
          "AllowedClients": [
            {
              "ClientId": "my-client",
              "ClientSecret": "my-secret"
            }
          ]
        }
      }
    }
  }
}
```

### Using Management API Client

```csharp
public class ContentImportService
{
    private readonly HttpClient _httpClient;

    public ContentImportService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("UmbracoManagementApi");
    }

    public async Task<Guid> CreateContentAsync(CreateContentDto dto, CancellationToken ct)
    {
        var response = await _httpClient.PostAsJsonAsync(
            "/umbraco/management/api/v1/document",
            dto,
            ct
        );

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ContentCreatedResponse>(ct);
        return result!.Id;
    }
}
```

## Version-Specific Features

### Umbraco 14 (.NET 8)
- Lit-based backoffice (AngularJS removed)
- Block Grid editor
- New extension system

### Umbraco 15 (.NET 9)
- HybridCache for improved caching
- Content Delivery API v2
- Performance improvements
- IPublishedContentCache improvements

### Umbraco 16 (.NET 9/10)
- TipTap replaces TinyMCE completely
- Management API v2
- Enhanced document type inheritance
- Improved webhook support

## TypeScript Configuration

```json
// tsconfig.json for App_Plugins
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "useDefineForClassFields": false,
    "experimentalDecorators": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: {
                'color-picker': 'src/property-editors/color-picker.element.ts',
                'dashboard': 'src/dashboards/analytics.element.ts'
            },
            formats: ['es']
        },
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco-cms/]
        }
    }
});
```
