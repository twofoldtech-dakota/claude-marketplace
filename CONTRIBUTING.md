# Contributing to CMS Analyzers Marketplace

Thank you for your interest in contributing! This document provides guidelines for contributing to the CMS Analyzers Marketplace.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`

## Project Structure

```
claude-marketplace/
├── .claude-plugin/
│   └── marketplace.json       # Marketplace configuration
├── plugins/
│   └── {plugin-name}/
│       ├── .claude-plugin/
│       │   └── plugin.json    # Plugin metadata
│       ├── commands/          # Command definitions
│       ├── agents/            # Agent specifications
│       ├── skills/            # Bundled skills
│       └── templates/         # Template files
├── LICENSE
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

## Adding a New Analysis Rule

1. Identify the appropriate agent in `plugins/{plugin}/agents/`
2. Add the issue code to the agent's issue table
3. Add detection logic to the agent's analysis areas
4. Update the command's issue codes reference
5. Test against a project with the known issue

### Issue Code Format

Use this format: `{CATEGORY}-{NUMBER}`

| Category | Prefix | Description |
|----------|--------|-------------|
| Architecture | ARCH | Structure and dependency issues |
| Security | SEC | Security vulnerabilities |
| Performance | PERF | Performance problems |
| Code Quality | CQ | Code quality issues |
| Dependencies | DEP | Package/dependency issues |
| Conventions | CONV | Naming and structure conventions |

### Severity Levels

- **Critical**: Must be fixed before production
- **Warning**: Should be addressed
- **Info**: Recommendations for improvement

## Adding a New Agent

1. Create a new `.md` file in `plugins/{plugin}/agents/`
2. Use this template:

```markdown
---
name: {agent-name}
description: {what it analyzes}
tools: [Read, Glob, Grep]
---

# {Agent Title}

{Description of what this agent analyzes}

## Analysis Areas

### 1. {Area Name}

{Detection logic and patterns}

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| {CODE} | {Level} | {Description} | {How to detect} |

## Output Format

{Expected output structure}
```

3. Add the agent to the analyze command's agent list

## Adding a New Plugin

1. Create the plugin directory structure:

```bash
mkdir -p plugins/{plugin-name}/{.claude-plugin,commands,agents,skills,templates}
```

2. Create `plugin.json` with required fields:

```json
{
  "name": "{plugin-name}",
  "version": "1.0.0",
  "description": "{description}",
  "author": {
    "name": "{your name}",
    "url": "{your url}"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/twofoldtech-dakota/claude-marketplace.git",
    "directory": "plugins/{plugin-name}"
  },
  "keywords": ["{keywords}"]
}
```

3. Create the four standard commands: `analyze`, `enhance`, `security-scan`, `setup`
4. Create the detector agent
5. Add the plugin to `marketplace.json`

## Code Style

### Markdown Files

- Use ATX-style headers (`#`, `##`, etc.)
- Use fenced code blocks with language identifiers
- Include tables for structured data
- Keep lines under 120 characters where practical

### Agent Specifications

- Use YAML frontmatter for metadata
- Include clear detection patterns
- Provide code examples for issues
- Include fix recommendations

## Testing

Before submitting:

1. Verify the plugin loads correctly
2. Test against a real project of that CMS type
3. Ensure all commands execute without errors
4. Check that detected issues are accurate

## Pull Request Process

1. Update CHANGELOG.md with your changes
2. Ensure all files follow the project structure
3. Provide a clear PR description
4. Reference any related issues

## Questions?

Open an issue for questions or discussion about potential contributions.
