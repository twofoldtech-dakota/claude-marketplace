# Skill Generator Agent - XM Cloud

Generate project-specific skill files and custom commands based on extracted patterns.

## Agent Configuration

**Name**: `skill-generator`
**Tools**: `Read, Write, Glob`
**Input**: Pattern data from `pattern-extractor` agent
**Output**: Skill files in `.claude/skills/`

## Generated Files

### 1. Project Patterns Skill

**Output**: `.claude/skills/project-patterns/SKILL.md`

**Template**:
```markdown
---
name: project-patterns
description: Patterns specific to this {ProjectName} XM Cloud project
globs:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.graphql"
---

# {ProjectName} - Project Patterns

## Component Pattern

This project uses the following JSS component pattern:

### HOC Usage
{HOCPattern or "Direct component export"}

### Props Convention
{PropsConvention}

### Field Components
{FieldComponentsList}

### Example
```tsx
{SanitizedComponentExample}
```

## Hook Patterns

{HookPatternDescription}

### Custom Hooks
{CustomHooksList}

### Data Fetching Hooks
{DataHooksList}

### Example
```tsx
{SanitizedHookExample}
```

## Data Fetching Strategy

{DataFetchingDescription}

### Primary Approach
{PrimaryApproach}

### Revalidation
{RevalidationStrategy}

## GraphQL Patterns

{GraphQLPatternDescription}

### Query Naming
{QueryNamingConvention}

### Fragment Usage
{FragmentStrategy}

### Example
```graphql
{SanitizedQueryExample}
```

## Styling Approach

{StylingApproach}
```

### 2. Architecture Guide Skill

**Output**: `.claude/skills/architecture-guide/SKILL.md`

**Template**:
```markdown
---
name: architecture-guide
description: Architecture and structure guide for {ProjectName}
globs:
  - "**/src/**/*"
  - "**/pages/**/*"
  - "**/app/**/*"
---

# {ProjectName} Architecture Guide

## Next.js Structure

This project uses {AppRouter | PagesRouter | Hybrid}.

### Directory Layout
```
{DirectoryStructure}
```

## Component Organization

### Location
{ComponentLocation}

### Naming Convention
{ComponentNaming}

### File Structure
{ComponentFileStructure}

## Adding New Components

### 1. Create Component File

```bash
# Create component in {ComponentPath}
touch src/components/{ComponentName}/{ComponentName}.tsx
```

### 2. Component Template

Based on detected pattern:
```tsx
{ComponentTemplate}
```

### 3. Register Component

Add to component factory at {FactoryLocation}:
```tsx
{FactoryRegistration}
```

### 4. Create Sitecore Rendering

{RenderingInstructions}

## Adding GraphQL Queries

### 1. Create Query File

```bash
touch src/graphql/queries/{QueryName}.graphql
```

### 2. Query Template

```graphql
{QueryTemplate}
```

### 3. Generate Types

```bash
{TypeGenerationCommand}
```

## Data Fetching

### Static Pages
{StaticPagePattern}

### Dynamic Pages
{DynamicPagePattern}

### Client-Side
{ClientSidePattern}

## Environment Configuration

### Required Variables
{RequiredEnvVars}

### Local Development
{LocalDevSetup}
```

### 3. Project Vocabulary

**Output**: `.claude/skills/vocabulary.md`

**Template**:
```markdown
# {ProjectName} Vocabulary

## Domain Terms

| Term | Meaning | Usage |
|------|---------|-------|
{DomainTermsTable}

## JSS/XM Cloud Terms

| Term | Meaning | Context |
|------|---------|---------|
{JSSTermsTable}

## GraphQL Types

| Type | Purpose | Fields |
|------|---------|--------|
{GraphQLTypesTable}

## Component Names

| Component | Purpose | Location |
|-----------|---------|----------|
{ComponentsTable}

## Naming Conventions

### Components
{ComponentNamingConventions}

### Hooks
{HookNamingConventions}

### GraphQL
{GraphQLNamingConventions}

### Files
{FileNamingConventions}
```

### 4. Custom Commands

**Output**: `.claude/skills/commands/`

#### /project:build

```markdown
# /project:build

Build the Next.js application.

## Command
```bash
{DetectedBuildCommand}
```

## Options
{BuildOptions}

## What It Does
1. Runs Next.js build
2. Generates static pages
3. Outputs to {OutputPath}
```

#### /project:dev

```markdown
# /project:dev

Start development server.

## Command
```bash
{DevCommand}
```

## Connected Mode
{ConnectedModeInstructions}

## Disconnected Mode
{DisconnectedModeInstructions}
```

#### /project:new-component

```markdown
# /project:new-component [name]

Scaffold a new JSS component.

## Steps
1. Create component file at `src/components/{name}/{name}.tsx`
2. Create props interface
3. Add withDatasourceCheck wrapper
4. Register in component factory
5. Create Sitecore rendering item

## Generated Files
{GeneratedFilesList}

## Template Used
{ComponentTemplate}
```

## Generation Logic

```python
def generate_skills(patterns, project_info):
    # 1. Generate project-patterns SKILL
    project_patterns = build_project_patterns_skill(
        components=patterns.components,
        hooks=patterns.hooks,
        dataFetching=patterns.dataFetching,
        graphql=patterns.graphql,
        styling=patterns.styling
    )

    # 2. Generate architecture guide
    architecture_guide = build_architecture_skill(
        nextjs_version=project_info.nextVersion,
        router_type=project_info.routerType,
        component_structure=project_info.componentStructure,
        graphql_setup=project_info.graphqlSetup
    )

    # 3. Generate vocabulary
    vocabulary = build_vocabulary(
        component_names=patterns.componentNames,
        graphql_types=patterns.graphqlTypes,
        domain_terms=extract_domain_terms(patterns)
    )

    # 4. Generate custom commands
    commands = build_custom_commands(
        package_json=project_info.packageJson,
        deployment=project_info.deployment
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
- [ ] No API keys or secrets in output
- [ ] No internal URLs exposed
- [ ] Code examples are sanitized
- [ ] Paths are relative
- [ ] Templates are syntactically correct

## Privacy Safeguards

- Replace API keys with `{API_KEY}`
- Replace endpoints with `{ENDPOINT}`
- Remove SITECORE_API_KEY values
- Anonymize GraphQL endpoints
- Remove internal hostnames
