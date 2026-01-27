# Changelog

All notable changes to the CMS Analyzers Marketplace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-27

### Added

- **Sitecore Classic Analyzer** (v1.0.0)
  - Helix architecture compliance checks
  - Security vulnerability scanning
  - Performance analysis for Solr queries and caching
  - SCS/Unicorn serialization validation
  - Code quality analysis for C# patterns

- **XM Cloud Analyzer** (v1.0.0)
  - JSS component pattern analysis
  - GraphQL N+1 and over-fetching detection
  - Next.js performance optimization checks
  - TypeScript quality analysis

- **Umbraco Analyzer** (v1.0.0)
  - Composer and DI pattern analysis
  - Backoffice (Lit) component validation
  - Content Delivery API security checks
  - HybridCache usage analysis for v15+

- **Optimizely CMS Analyzer** (v1.0.0)
  - Content type modeling analysis
  - Initialization module patterns
  - Content Delivery API configuration
  - .NET architecture validation

- **Optimizely Experimentation Analyzer** (v1.0.0)
  - Feature flag implementation analysis
  - A/B testing pattern validation
  - SDK initialization best practices
  - Event tracking analysis

### Bundled Skills

All plugins include relevant bundled skills:
- `backend-csharp` - C#/.NET patterns
- `frontend-classic` - CSS/SASS, jQuery patterns
- `frontend-modern` - React, Vue, TypeScript patterns
- `frontend-razor` - Razor view patterns
- `fullstack-classic` - jQuery + C# integration
- `fullstack-modern` - React/GraphQL + API integration
- Platform-specific skills for each CMS

### Commands

Each plugin provides four standard commands:
- `analyze` - Run comprehensive analysis
- `enhance` - Generate project-specific AI skills
- `security-scan` - Preview analysis scope and sensitive files
- `setup` - Generate `.claudeignore` and configuration
