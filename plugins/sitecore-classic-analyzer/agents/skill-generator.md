# Skill Generator Agent - Sitecore Classic

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
description: Patterns specific to this {ProjectName} Sitecore project
globs:
  - "**/*.cs"
  - "**/App_Config/**/*.config"
---

# {ProjectName} - Project Patterns

## Service Layer Pattern

This project uses the following service pattern:

### Base Class
{ServiceBaseClass or "No common base class detected"}

### Interface Convention
{InterfaceConvention}

### Registration
Services are registered as {ServiceLifetime} in {RegistrationFile}

### Example
```csharp
{SanitizedServiceExample}
```

## Repository Pattern

{RepositoryPatternDescription}

### Caching Strategy
{CachingStrategy}

### Example
```csharp
{SanitizedRepositoryExample}
```

## Controller Pattern

{ControllerPatternDescription}

### Base Class
{ControllerBaseClass}

### Action Conventions
{ActionConventions}

## Pipeline Processors

{PipelinePatternDescription}

## Dependency Injection

### Configurator Pattern
```csharp
{DIConfiguratorExample}
```

### Lifetime Conventions
| Type | Lifetime |
|------|----------|
{LifetimeTable}
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
  - "**/layers.config"
---

# {ProjectName} Architecture Guide

## Helix Structure

This project follows {HelixCompliance} Helix architecture.

### Foundation Layer
{FoundationModulesList}

### Feature Layer
{FeatureModulesList}

### Project Layer
{ProjectModulesList}

## Dependency Rules

```
Project → Feature → Foundation
```

### Detected Dependencies
{DependencyGraph}

## Adding New Features

### 1. Create Feature Module

```bash
# Create folder structure
mkdir -p src/Feature/{ModuleName}/code
mkdir -p src/Feature/{ModuleName}/serialization
```

### 2. Create Project File

Based on detected pattern, create `Feature.{ModuleName}.csproj`:
```xml
{ProjectFileTemplate}
```

### 3. Register Services

Create `RegisterDependencies.cs` following project pattern:
```csharp
{DIRegistrationTemplate}
```

### 4. Add Serialization Module

Create `{ModuleName}.module.json`:
```json
{SerializationModuleTemplate}
```

## Serialization

- **Format**: {SerializationFormat}
- **Tool**: {SerializationTool}
- **Modules Location**: {ModulesLocation}

## Configuration

### Patch File Naming
{PatchNamingConvention}

### Organization
{ConfigOrganization}
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

## Acronyms

| Acronym | Full Form | Context |
|---------|-----------|---------|
{AcronymsTable}

## Custom Types

| Type | Purpose | Location |
|------|---------|----------|
{CustomTypesTable}

## Naming Conventions

### Classes
{ClassNamingConventions}

### Interfaces
{InterfaceNamingConventions}

### Files
{FileNamingConventions}
```

### 4. Custom Commands

**Output**: `.claude/project-skills/commands/`

#### /project:build

```markdown
# /project:build

Build the solution using detected configuration.

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

#### /project:serialize

```markdown
# /project:serialize

Run serialization based on detected tool.

## Command
```bash
{SerializationCommand}
```

## Modules
{ModulesList}
```

#### /project:new-feature

```markdown
# /project:new-feature [name]

Scaffold a new Helix Feature module.

## Steps
1. Create folder structure at `src/Feature/{name}/`
2. Generate `Feature.{name}.csproj` from template
3. Create `RegisterDependencies.cs`
4. Create serialization module
5. Add to solution

## Generated Files
{GeneratedFilesList}
```

## Generation Logic

```python
def generate_skills(patterns, project_info):
    # 1. Generate project-patterns SKILL
    project_patterns = build_project_patterns_skill(
        services=patterns.services,
        repositories=patterns.repositories,
        controllers=patterns.controllers,
        pipelines=patterns.pipelines,
        di=patterns.dependencyInjection
    )

    # 2. Generate architecture guide
    architecture_guide = build_architecture_skill(
        helix_structure=project_info.helix,
        modules=project_info.modules,
        dependencies=project_info.dependencies,
        serialization=project_info.serialization
    )

    # 3. Generate vocabulary
    vocabulary = build_vocabulary(
        class_names=patterns.classNames,
        method_names=patterns.methodNames,
        domain_terms=extract_domain_terms(patterns)
    )

    # 4. Generate custom commands
    commands = build_custom_commands(
        build_config=project_info.buildConfig,
        serialization=project_info.serialization,
        deploy_targets=project_info.deployTargets
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
- [ ] No sensitive data in output
- [ ] Code examples are sanitized
- [ ] Paths are relative (not absolute)
- [ ] Templates compile correctly
- [ ] No duplicate content

## Privacy Safeguards

- Replace actual credentials with `{CREDENTIAL}`
- Replace connection strings with `{CONNECTION_STRING}`
- Replace API keys with `{API_KEY}`
- Remove internal URLs
- Anonymize user-specific paths
