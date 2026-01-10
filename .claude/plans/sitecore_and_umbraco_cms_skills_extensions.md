---
name: Sitecore and Umbraco CMS Skills Extensions
overview: Create two separate Claude Code Marketplace extensions that analyze codebases and generate CMS-specific skills for Sitecore and Umbraco environments, following the agentic-jumpstart marketplace pattern with specialized agents for each CMS.
todos:
  - id: setup-marketplace
    content: Create root marketplace structure with .claude-plugin/marketplace.json and plugins directory
    status: pending
  - id: sitecore-plugin-structure
    content: Create Sitecore plugin directory structure with .claude-plugin/plugin.json, commands/, and agents/ folders
    status: pending
    dependencies:
      - setup-marketplace
  - id: umbraco-plugin-structure
    content: Create Umbraco plugin directory structure with .claude-plugin/plugin.json, commands/, and agents/ folders
    status: pending
    dependencies:
      - setup-marketplace
  - id: sitecore-detector
    content: Implement Sitecore detector agent that identifies Sitecore installations, versions, and modules
    status: pending
    dependencies:
      - sitecore-plugin-structure
  - id: sitecore-agents
    content: Implement all 6 Sitecore specialized agents (security, performance, architecture, patterns, API, conventions)
    status: pending
    dependencies:
      - sitecore-detector
  - id: sitecore-command
    content: Create Sitecore main command that orchestrates agent execution and generates skills files
    status: pending
    dependencies:
      - sitecore-agents
  - id: umbraco-detector
    content: Implement Umbraco detector agent that identifies Umbraco installations, versions, and packages
    status: pending
    dependencies:
      - umbraco-plugin-structure
  - id: umbraco-agents
    content: Implement all 6 Umbraco specialized agents (security, performance, architecture, patterns, API, conventions)
    status: pending
    dependencies:
      - umbraco-detector
  - id: umbraco-command
    content: Create Umbraco main command that orchestrates agent execution and generates skills files
    status: pending
    dependencies:
      - umbraco-agents
  - id: sitecore-readme
    content: Create detailed README.md for Sitecore plugin with installation, usage, examples, and troubleshooting
    status: pending
    dependencies:
      - sitecore-command
  - id: umbraco-readme
    content: Create detailed README.md for Umbraco plugin with installation, usage, examples, and troubleshooting
    status: pending
    dependencies:
      - umbraco-command
  - id: documentation
    content: Create comprehensive root README.md with marketplace overview and links to both plugins
    status: pending
    dependencies:
      - sitecore-readme
      - umbraco-readme
  - id: validation
    content: Validate marketplace structure and test both plugins with sample codebases
    status: pending
    dependencies:
      - documentation
---

# Sitecore and Umbraco CMS Skills Extensions Plan

## Overview

Build two separate Claude Code Marketplace extensions that automatically detect Sitecore and Umbraco CMS implementations and generate comprehensive, CMS-specific skills files. Each extension will follow the agentic-jumpstart marketplace pattern with specialized agents tailored to each CMS platform.

## Architecture

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── sitecore-analyzer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   ├── commands/
│   │   │   └── analyze-and-generate-skills.md
│   │   ├── agents/
│   │   │   ├── sitecore-detector.md
│   │   │   ├── sitecore-security-analyzer.md
│   │   │   ├── sitecore-performance-analyzer.md
│   │   │   ├── sitecore-architecture-analyzer.md
│   │   │   ├── sitecore-patterns-analyzer.md
│   │   │   ├── sitecore-api-analyzer.md
│   │   │   └── sitecore-conventions-analyzer.md
│   │   └── README.md
│   └── umbraco-analyzer/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       │   └── analyze-and-generate-skills.md
│       ├── agents/
│       │   ├── umbraco-detector.md
│       │   ├── umbraco-security-analyzer.md
│       │   ├── umbraco-performance-analyzer.md
│       │   ├── umbraco-architecture-analyzer.md
│       │   ├── umbraco-patterns-analyzer.md
│       │   ├── umbraco-api-analyzer.md
│       │   └── umbraco-conventions-analyzer.md
│       └── README.md
└── README.md
```

## Sitecore Extension Details

### Detection Strategy

- Identify Sitecore via: `Sitecore.*` NuGet packages, `web.config` Sitecore settings, `App_Config` directory structure, Sitecore DLLs, `sitecore` folder structure
- Detect Sitecore version (XP, XM, XM Cloud, Headless)
- Identify Sitecore modules (SXA, JSS, Commerce, etc.)

### Specialized Agents

1. **Sitecore Detector** (`sitecore-detector.md`)

   - Scans for Sitecore-specific files and configurations
   - Identifies Sitecore version and edition
   - Detects installed modules and extensions
   - Maps Sitecore architecture (Helix, traditional, headless)

2. **Sitecore Security Analyzer** (`sitecore-security-analyzer.md`)

   - Sitecore security best practices
   - Item security and access control patterns
   - API key management
   - XSS/CSRF protection in Sitecore context
   - Security hardening for Sitecore environments

3. **Sitecore Performance Analyzer** (`sitecore-performance-analyzer.md`)

   - Caching strategies (HTML cache, data cache, custom cache)
   - Sitecore query optimization
   - Publishing pipeline optimization
   - Media library optimization
   - CDN integration patterns

4. **Sitecore Architecture Analyzer** (`sitecore-architecture-analyzer.md`)

   - Helix architecture principles (Foundation, Feature, Project layers)
   - Solution structure and organization
   - Module and feature organization
   - Dependency management in Sitecore solutions

5. **Sitecore Patterns Analyzer** (`sitecore-patterns-analyzer.md`)

   - Controller rendering patterns
   - View rendering patterns
   - Component patterns (MVC, Web Forms, JSS)
   - Repository patterns for Sitecore items
   - Service layer patterns

6. **Sitecore API Analyzer** (`sitecore-api-analyzer.md`)

   - Sitecore Item API usage patterns
   - Sitecore Service API patterns
   - GraphQL endpoint patterns (if JSS/Headless)
   - REST API patterns
   - Custom API development

7. **Sitecore Conventions Analyzer** (`sitecore-conventions-analyzer.md`)

   - Naming conventions (items, templates, fields, components)
   - Folder structure conventions
   - Template inheritance patterns
   - Rendering parameter conventions
   - Sitecore item organization patterns

### Generated Skills Files

- `sitecore-security-best-practices.md`
- `sitecore-performance-optimization.md`
- `sitecore-architecture-patterns.md`
- `sitecore-component-patterns.md`
- `sitecore-api-patterns.md`
- `sitecore-conventions.md`
- `sitecore-helix-principles.md` (if Helix detected)
- `sitecore-headless-patterns.md` (if headless detected)

## Umbraco Extension Details

### Detection Strategy

- Identify Umbraco via: `Umbraco.*` NuGet packages, `web.config` Umbraco settings, `umbraco` folder structure, Umbraco DLLs, `App_Plugins` directory
- Detect Umbraco version (v8, v9+, v10+, v11+, v12+)
- Identify Umbraco packages and customizations

### Specialized Agents

1. **Umbraco Detector** (`umbraco-detector.md`)

   - Scans for Umbraco-specific files and configurations
   - Identifies Umbraco version (v8 vs v9+)
   - Detects installed packages and customizations
   - Maps Umbraco architecture (traditional, headless, hybrid)

2. **Umbraco Security Analyzer** (`umbraco-security-analyzer.md`)

   - Umbraco security best practices
   - User and member security patterns
   - API key and authentication patterns
   - XSS/CSRF protection in Umbraco context
   - Security hardening for Umbraco environments

3. **Umbraco Performance Analyzer** (`umbraco-performance-analyzer.md`)

   - Umbraco caching strategies (content cache, media cache, member cache)
   - Query optimization (Examine, NuCache)
   - Image processing optimization
   - CDN integration patterns
   - Database query optimization

4. **Umbraco Architecture Analyzer** (`umbraco-architecture-analyzer.md`)

   - Umbraco solution structure
   - Project organization patterns
   - Composer and component patterns
   - Dependency injection patterns (v9+)

5. **Umbraco Patterns Analyzer** (`umbraco-patterns-analyzer.md`)

   - Surface controller patterns
   - API controller patterns
   - Content model patterns
   - Property value converters
   - Custom property editors
   - Composer patterns (v9+)

6. **Umbraco API Analyzer** (`umbraco-api-analyzer.md`)

   - Umbraco Content Service API patterns
   - Umbraco Media Service API patterns
   - Umbraco Member Service API patterns
   - Content Delivery API patterns (v10+)
   - Management API patterns (v10+)
   - Custom API endpoints

7. **Umbraco Conventions Analyzer** (`umbraco-conventions-analyzer.md`)

   - Document type naming conventions
   - Property alias conventions
   - Template naming conventions
   - Partial view organization
   - App_Plugins structure conventions
   - Content tree organization patterns

### Generated Skills Files

- `umbraco-security-best-practices.md`
- `umbraco-performance-optimization.md`
- `umbraco-architecture-patterns.md`
- `umbraco-component-patterns.md`
- `umbraco-api-patterns.md`
- `umbraco-conventions.md`
- `umbraco-composer-patterns.md` (if v9+ detected)
- `umbraco-headless-patterns.md` (if headless detected)

## Implementation Approach

### Phase 1: Marketplace Structure Setup

1. Create root `.claude-plugin/marketplace.json` configuration
2. Set up plugins directory structure
3. Create plugin.json files for both extensions
4. Create root README.md with marketplace documentation
5. Create detailed README.md for Sitecore plugin
6. Create detailed README.md for Umbraco plugin

### Phase 2: Sitecore Extension

1. Implement Sitecore detector agent
2. Implement all 6 specialized Sitecore agents
3. Create main command that orchestrates agent execution
4. Implement skills file generation logic
5. Test with sample Sitecore codebase

### Phase 3: Umbraco Extension

1. Implement Umbraco detector agent
2. Implement all 6 specialized Umbraco agents
3. Create main command that orchestrates agent execution
4. Implement skills file generation logic
5. Test with sample Umbraco codebase

### Phase 4: Documentation

1. Create Sitecore plugin README.md with:

   - Plugin overview and purpose
   - Installation instructions
   - Command usage and examples
   - Description of each agent and what it analyzes
   - List of generated skills files with explanations
   - Sitecore-specific detection criteria
   - Troubleshooting common issues
   - Examples of detected patterns
   - Links to Sitecore documentation

2. Create Umbraco plugin README.md with:

   - Plugin overview and purpose
   - Installation instructions
   - Command usage and examples
   - Description of each agent and what it analyzes
   - List of generated skills files with explanations
   - Umbraco-specific detection criteria
   - Troubleshooting common issues
   - Examples of detected patterns
   - Links to Umbraco documentation

3. Create root marketplace README.md with:

   - Marketplace overview
   - Quick start guide
   - Links to both plugins
   - Installation instructions for marketplace
   - Contributing guidelines

### Phase 5: Integration & Testing

1. Validate marketplace structure
2. Test both plugins independently
3. Test skills generation accuracy
4. Verify skills files are properly formatted
5. Review and validate all documentation

## Key Technical Considerations

### Detection Logic

- Both extensions need robust CMS detection that works across different project structures
- Handle both traditional and headless implementations
- Support multiple CMS versions

### Skills Generation

- Skills should be actionable and specific to the detected CMS version
- Include code examples relevant to the codebase structure
- Reference actual patterns found in the codebase
- Generate conditional skills based on detected features

### Agent Coordination

- Main command orchestrates agent execution in sequence
- Each agent analyzes codebase from its perspective
- Agents share detection results to avoid redundant analysis
- Skills are aggregated and formatted consistently

### Output Format

- Skills files saved to `.claude/skills/` directory
- Markdown format with clear sections
- Include code examples and best practices
- Reference detected patterns from the codebase

## Ralph Wiggum Method Application

Following the Ralph Wiggum approach (iterative, conversational agent coordination):

- Each agent acts as a specialized "expert" that analyzes the codebase
- Agents communicate findings to the orchestrating command
- Skills are generated through collaborative analysis
- Multiple passes ensure comprehensive coverage

## Success Criteria

1. Both extensions successfully detect their respective CMS platforms
2. Generated skills are accurate and actionable
3. Skills reflect actual codebase patterns and conventions
4. Extensions work independently without conflicts
5. Skills improve Claude's code generation for CMS-specific tasks
6. Each plugin has a detailed README.md that includes:

   - Clear description of what the plugin does
   - Installation and setup instructions
   - Usage examples and command syntax
   - Explanation of generated skills files
   - Troubleshooting guide
   - Examples of detected patterns and conventions
   - Links to relevant CMS documentation

7. Root marketplace README provides overview and links to both plugins
