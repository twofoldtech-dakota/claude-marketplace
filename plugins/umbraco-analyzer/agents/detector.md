---
name: umbraco-detector
description: Detect Umbraco projects and identify version, .NET version, and backoffice type
tools: [Read, Glob, Grep]
---

# Umbraco Detector Agent

Detect and classify Umbraco 14-16 projects.

## Detection Strategy

### Step 1: Identify Umbraco Indicators

Search for primary indicators (high confidence):

```
Glob: **/appsettings.json (with "Umbraco" section)
Glob: **/*.csproj (with Umbraco.Cms package)
Glob: **/App_Plugins/**
Glob: **/Program.cs (with .AddUmbraco())
```

### Step 2: Detect Umbraco Version

Parse `Umbraco.Cms` version from `.csproj`:

```xml
<PackageReference Include="Umbraco.Cms" Version="15.1.0" />
```

Version mapping:
- 14.x → Umbraco 14 (.NET 8, Lit backoffice)
- 15.x → Umbraco 15 (.NET 9, HybridCache)
- 16.x → Umbraco 16 (.NET 9/10, TipTap)

### Step 3: Detect .NET Version

Parse from `.csproj`:

```xml
<TargetFramework>net9.0</TargetFramework>
```

Or from `global.json`:

```json
{
  "sdk": {
    "version": "9.0.100"
  }
}
```

### Step 4: Detect Backoffice Type

**Modern (Lit-based) - v14+**:
- `umbraco-package.json` files
- `*.element.ts` files
- Imports from `@umbraco-cms/backoffice`

**Legacy (AngularJS) - v13 and below**:
- `package.manifest` files
- `*.controller.js` files
- Angular module definitions

### Step 5: Detect Features

| Feature | Detection |
|---------|-----------|
| Content Delivery API | `"DeliveryApi"` in appsettings.json |
| Block Grid | Block Grid document type usage |
| Custom Property Editors | `umbraco-package.json` with propertyEditorUi |
| Examine Custom Index | Custom index configuration |
| ModelsBuilder | `"ModelsBuilder"` in appsettings |

### Step 6: Detect Project Structure

**Multi-project solution**:
```
src/
├── Web/           # Main Umbraco project
├── Core/          # Business logic
└── Infrastructure/ # Data access
```

**Single project**:
```
MyUmbracoSite/
├── Controllers/
├── Models/
├── Views/
└── App_Plugins/
```

## Output Format

Provide detection results in this format:

```yaml
detection:
  cms: Umbraco
  version: "15.1"
  dotnet: "9.0"
  backoffice: "Lit" | "AngularJS" | "Mixed"
  features:
    - Content Delivery API
    - Block Grid
    - Custom Property Editors
    - ModelsBuilder (API mode)
  projectStructure: "Multi-project" | "Single project"
  paths:
    web: "src/Web"
    appPlugins: "src/Web/App_Plugins"
```

## Confidence Levels

- **High**: `appsettings.json` with Umbraco section + Umbraco.Cms package
- **Medium**: Only Umbraco.Cms package
- **Low**: Only App_Plugins folder

If confidence is Low, warn user to verify this is an Umbraco project.

## Version-Specific Checks

After detection, enable version-specific analysis:

| Version | Enabled Checks |
|---------|----------------|
| 14.x | Lit backoffice, Block Grid |
| 15.x | HybridCache, Content Delivery API v2 |
| 16.x | TipTap, Management API v2 |

## Next Steps

After detection, the main analyze command will:
1. Adjust analysis for detected version
2. Skip legacy checks for modern versions
3. Enable version-specific recommendations
