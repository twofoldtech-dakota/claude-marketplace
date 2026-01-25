---
name: optimizely-detector
description: Detect Optimizely CMS projects and identify version, .NET version, and deployment model
tools: [Read, Glob, Grep]
---

# Optimizely CMS Detector Agent

Detect and classify Optimizely CMS (formerly Episerver) projects.

## Detection Strategy

### Step 1: Identify Optimizely Indicators

Search for primary indicators (high confidence):

```
Glob: **/*.csproj (with Optimizely.CMS.Core or EPiServer.CMS.Core)
Glob: **/Startup.cs or **/Program.cs (with .AddCms() or .AddEpiserverCms())
Glob: **/appsettings.json (with "EPiServer" or "Optimizely" section)
Glob: **/web.config (legacy Episerver detection)
```

### Step 2: Detect Platform and Version

Parse package version from `.csproj` files:

**Modern Optimizely (12+)**:
```xml
<PackageReference Include="Optimizely.CMS.Core" Version="13.5.0" />
<PackageReference Include="Optimizely.CMS.UI" Version="13.5.0" />
```

**Legacy Episerver (10-11)**:
```xml
<PackageReference Include="EPiServer.CMS.Core" Version="11.20.0" />
<PackageReference Include="EPiServer.CMS.UI" Version="11.20.0" />
```

Version mapping:

| Package | Version | Platform | .NET |
|---------|---------|----------|------|
| Optimizely.CMS.Core | 13.x | Optimizely CMS 13 | .NET 8+ |
| Optimizely.CMS.Core | 12.x | Optimizely CMS 12 | .NET 6+ |
| EPiServer.CMS.Core | 11.x | Episerver CMS 11 | .NET Framework 4.7.2+ |
| EPiServer.CMS.Core | 10.x | Episerver CMS 10 | .NET Framework 4.6.1+ |

### Step 3: Detect .NET Version

Parse from `.csproj`:

```xml
<TargetFramework>net8.0</TargetFramework>
```

Or from `global.json`:

```json
{
  "sdk": {
    "version": "8.0.100"
  }
}
```

### Step 4: Detect Deployment Model

**Content Cloud (DXP/SaaS)**:
- `Optimizely.ContentDeliveryApi.Core` package
- Azure App Service configuration
- DXP-specific environment variables

**Self-Hosted**:
- SQL Server connection strings
- IIS/Kestrel configuration
- Local blob storage

### Step 5: Detect Enabled Features

| Feature | Detection Pattern |
|---------|-------------------|
| Content Delivery API | `Optimizely.ContentDeliveryApi.Core` package |
| Commerce | `Optimizely.Commerce.Core` or `EPiServer.Commerce.Core` |
| Search & Navigation | `Optimizely.Search.Core` or `EPiServer.Find` |
| Forms | `Optimizely.Forms` or `EPiServer.Forms` |
| Experimentation | `Optimizely.Experimentation` or `Optimizely.Web.Experimentation` |
| Data Platform | `Optimizely.DataPlatform` package |
| Content Recommendations | `Optimizely.ContentRecommendations` |

### Step 6: Detect Project Structure

**Multi-project solution**:
```
src/
├── Web/               # Main Optimizely project
├── Core/              # Business logic, content types
├── Infrastructure/    # Data access
└── Features/          # Feature modules
```

**Single project**:
```
MySite/
├── Controllers/
├── Models/
│   ├── Pages/
│   ├── Blocks/
│   └── Media/
├── Views/
├── Business/
└── Features/
```

**Alloy (reference) structure**:
```
Alloy/
├── Controllers/
├── Models/
│   ├── Pages/
│   └── Blocks/
├── Views/
├── Business/
│   ├── Initialization/
│   ├── Rendering/
│   └── SelectionFactories/
└── Features/
```

### Step 7: Detect Content Architecture

**Content type patterns**:
```csharp
// Page types
[ContentType(GUID = "...", DisplayName = "Article Page")]
public class ArticlePage : PageData { }

// Block types
[ContentType(GUID = "...", DisplayName = "Hero Block")]
public class HeroBlock : BlockData { }

// Media types
[ContentType(GUID = "...", DisplayName = "Image File")]
public class ImageFile : ImageData { }
```

**Initialization modules**:
```csharp
[InitializableModule]
[ModuleDependency(typeof(ServiceContainerInitialization))]
public class DependencyResolverInitialization : IConfigurableModule { }
```

## Output Format

Provide detection results in this format:

```yaml
detection:
  platform: "Optimizely CMS" | "Episerver CMS"
  version: "13.5"
  dotnet: "8.0"
  deploymentModel: "Content Cloud" | "Self-Hosted"
  features:
    - Content Delivery API
    - Commerce
    - Forms
    - Experimentation
  projectStructure: "Multi-project" | "Single project" | "Alloy reference"
  paths:
    web: "src/Web"
    models: "src/Core/Models"
    controllers: "src/Web/Controllers"
  contentTypes:
    pages: 15
    blocks: 8
    media: 3
  initializationModules: 5
```

## Confidence Levels

- **High**: `.csproj` with Optimizely/EPiServer packages + `appsettings.json` with platform section
- **Medium**: Only Optimizely/EPiServer packages in `.csproj`
- **Low**: Only configuration files or folder structure

If confidence is Low, warn user to verify this is an Optimizely project.

## Version-Specific Checks

After detection, enable version-specific analysis:

| Version | Enabled Checks |
|---------|----------------|
| 13.x | .NET 8 patterns, latest Content Delivery API |
| 12.x | .NET 6/7 patterns, Content Delivery API v2 |
| 11.x | .NET Framework patterns, legacy configuration |
| 10.x | Legacy patterns, web.config-based configuration |

## Legacy vs Modern Patterns

### Modern (12+)
- `appsettings.json` configuration
- Dependency injection via `IServiceCollection`
- `IContentLoader` and `IContentRepository`
- Async/await patterns

### Legacy (10-11)
- `web.config` and `connectionStrings.config`
- `ServiceLocator.Current` pattern
- Synchronous content loading
- `EPiServerProfile` configuration

## Next Steps

After detection, the main analyze command will:
1. Adjust analysis for detected version
2. Skip legacy checks for modern versions
3. Enable version-specific recommendations
4. Configure appropriate issue severity based on platform
