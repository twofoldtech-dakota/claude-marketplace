# Skill Generator Agent - Umbraco

Generate project-specific skill files and custom commands based on extracted patterns.

## Agent Configuration

**Name**: `skill-generator`
**Tools**: `Read, Write, Glob`
**Input**: Pattern data from `pattern-extractor` agent
**Output**: Skill files in `.claude/project-skills/`

## Generated Files

### 1. Project Patterns Skill

**Output**: `.claude/project-skills/project-patterns/SKILL.md`

**Template**:
```markdown
---
name: project-patterns
description: Patterns specific to this {ProjectName} Umbraco project
globs:
  - "**/*.cs"
  - "**/App_Plugins/**/*"
---

# {ProjectName} - Project Patterns

## Composer Pattern

This project uses the following Composer pattern:

### Location
{ComposerLocation}

### Naming Convention
{ComposerNaming}

### Service Registration
{ServiceRegistrationPattern}

### Example
```csharp
{SanitizedComposerExample}
```

## Service Layer Pattern

{ServicePatternDescription}

### Interface Convention
{InterfaceConvention}

### Lifetime Default
{LifetimeDefault}

### Example
```csharp
{SanitizedServiceExample}
```

## Controller Patterns

{ControllerPatternDescription}

### Surface Controllers
{SurfaceControllerPattern}

### API Controllers
{ApiControllerPattern}

## Notification Handlers

{NotificationHandlerDescription}

### Common Notifications
{CommonNotifications}

### Example
```csharp
{SanitizedHandlerExample}
```

## Property Value Converters

{PropertyConverterDescription}

### Cache Strategy
{CacheStrategy}
```

### 2. Architecture Guide Skill

**Output**: `.claude/project-skills/architecture-guide/SKILL.md`

**Template**:
```markdown
---
name: architecture-guide
description: Architecture and structure guide for {ProjectName}
globs:
  - "**/*.csproj"
  - "**/appsettings.json"
---

# {ProjectName} Architecture Guide

## Project Structure

```
{DirectoryStructure}
```

## Umbraco Version

- **Version**: {UmbracoVersion}
- **.NET Version**: {DotNetVersion}
- **Backoffice**: {BackofficeType}

## Composer Organization

### Location
{ComposerLocation}

### Registration Order
{RegistrationOrder}

## Adding New Features

### 1. Create Composer

```bash
# Create new Composer
touch {ComposerPath}/{FeatureName}Composer.cs
```

### 2. Composer Template

Based on detected pattern:
```csharp
{ComposerTemplate}
```

### 3. Register Services

Following project convention:
```csharp
{ServiceRegistrationTemplate}
```

### 4. Add Notification Handler (if needed)

```csharp
{NotificationHandlerTemplate}
```

## Content Delivery API

{DeliveryApiStatus}

### Configuration
{DeliveryApiConfig}

## Backoffice Extensions

{BackofficeExtensionGuide}

### Creating Property Editor (v14+)
{PropertyEditorGuide}

## Content Types

### Document Types Location
{DocumentTypesLocation}

### Naming Convention
{DocumentTypeNaming}

### Property Alias Convention
{PropertyAliasConvention}
```

### 3. Project Vocabulary

**Output**: `.claude/project-skills/vocabulary.md`

**Template**:
```markdown
# {ProjectName} Vocabulary

## Domain Terms

| Term | Meaning | Usage |
|------|---------|-------|
{DomainTermsTable}

## Umbraco Terms

| Term | Meaning | Context |
|------|---------|---------|
{UmbracoTermsTable}

## Content Types

| Type | Purpose | Alias |
|------|---------|-------|
{ContentTypesTable}

## Service Names

| Service | Purpose | Lifetime |
|---------|---------|----------|
{ServicesTable}

## Naming Conventions

### Classes
{ClassNamingConventions}

### Interfaces
{InterfaceNamingConventions}

### Document Types
{DocumentTypeNamingConventions}

### Property Aliases
{PropertyAliasConventions}
```

### 4. Custom Commands

**Output**: `.claude/project-skills/commands/`

#### /project:build

```markdown
# /project:build

Build the Umbraco solution.

## Command
```bash
{DetectedBuildCommand}
```

## Options
{BuildOptions}

## What It Does
1. Restores NuGet packages
2. Builds solution in {Configuration} mode
3. Outputs to {OutputPath}
```

#### /project:run

```markdown
# /project:run

Start Umbraco locally.

## Command
```bash
{RunCommand}
```

## Options
- `--watch` - Enable hot reload
- `--no-launch` - Don't open browser

## Access
- Frontend: {FrontendUrl}
- Backoffice: {BackofficeUrl}
```

#### /project:new-composer

```markdown
# /project:new-composer [name]

Scaffold a new Umbraco Composer.

## Steps
1. Create Composer file at `{ComposerPath}/{name}Composer.cs`
2. Implement IComposer interface
3. Add service registrations
4. Add notification handler registrations (if needed)

## Generated Files
{GeneratedFilesList}

## Template Used
```csharp
{ComposerTemplate}
```
```

## Generation Logic

```python
def generate_skills(patterns, project_info):
    # 1. Generate project-patterns SKILL
    project_patterns = build_project_patterns_skill(
        composers=patterns.composers,
        services=patterns.services,
        controllers=patterns.controllers,
        handlers=patterns.notificationHandlers,
        converters=patterns.propertyConverters
    )

    # 2. Generate architecture guide
    architecture_guide = build_architecture_skill(
        umbraco_version=project_info.umbracoVersion,
        dotnet_version=project_info.dotnetVersion,
        project_structure=project_info.structure,
        delivery_api=project_info.deliveryApi
    )

    # 3. Generate vocabulary
    vocabulary = build_vocabulary(
        service_names=patterns.serviceNames,
        content_types=patterns.contentTypes,
        domain_terms=extract_domain_terms(patterns)
    )

    # 4. Generate custom commands
    commands = build_custom_commands(
        csproj=project_info.csproj,
        launch_settings=project_info.launchSettings
    )

    return {
        'project_patterns': project_patterns,
        'architecture_guide': architecture_guide,
        'vocabulary': vocabulary,
        'commands': commands
    }
```

## Output Validation

Before writing files, validate:
- [ ] No connection strings in output
- [ ] No API keys exposed
- [ ] Code examples are sanitized
- [ ] Paths are relative
- [ ] Templates compile correctly

## Privacy Safeguards

- Replace connection strings with `{CONNECTION_STRING}`
- Replace API keys with `{API_KEY}`
- Remove internal URLs
- Anonymize database names
- Remove user-specific paths
