# /xm-cloud:enhance

Generate project-specific skills and commands to improve AI-assisted development for this XM Cloud codebase.

## Command Syntax

```bash
/xm-cloud:enhance [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--output <path>` | Output directory (default: `.claude/skills/`) |
| `--dry-run` | Preview what would be generated without writing files |
| `--include-examples` | Extract sanitized code examples from codebase |
| `--update` | Update existing skills instead of regenerating (compares with `.meta.json`) |
| `--force` | Overwrite existing skills without confirmation |

## What Gets Generated

### 1. Project Patterns Skill
**File**: `.claude/skills/project-patterns/SKILL.md`

Detected patterns:
- Component patterns (JSS components, layouts, placeholders)
- Hook patterns (custom hooks, data fetching hooks)
- Data fetching strategies (SSG, SSR, ISR usage)
- State management patterns
- GraphQL query organization

### 2. Architecture Guide
**File**: `.claude/skills/architecture-guide/SKILL.md`

Project-specific documentation:
- Next.js app structure (App Router vs Pages Router)
- Component organization and naming
- Steps for adding new components
- GraphQL query patterns

### 3. Project Vocabulary
**File**: `.claude/skills/vocabulary.md`

Domain-specific terms:
- Business terminology from component/type names
- GraphQL type names and their purposes
- Custom hook naming conventions
- JSS-specific terminology

### 4. Testing Patterns Skill
**File**: `.claude/skills/testing-patterns/SKILL.md`

Detected patterns:
- Test framework configuration (Jest, Vitest, Playwright)
- Component testing patterns (RTL, userEvent)
- Mocking strategies (modules, APIs, GraphQL)
- Test file organization and naming

### 5. Error Handling Skill
**File**: `.claude/skills/error-handling/SKILL.md`

Detected patterns:
- Error boundary implementations
- API error handling (GraphQL, REST)
- Logging service integration
- Custom error types

### 6. Skill Metadata
**File**: `.claude/skills/.meta.json`

Tracks skill versioning:
- Generation timestamp
- Project hash for change detection
- Pattern counts per skill
- Statistics summary

### 7. Custom Commands
**File**: `.claude/skills/commands/*.md`

Generated based on project configuration:
- `/project:build` - Build with detected Next.js configuration
- `/project:dev` - Start development server
- `/project:deploy` - Deploy to Vercel/Netlify
- `/project:new-component` - Scaffold new JSS component

## Execution Flow

```
1. Run detector agent
   └── Confirm XM Cloud platform
   └── Detect JSS version, Next.js version, deployment target

2. Run pattern-extractor agent
   └── Scan component files for patterns
   └── Analyze hook implementations
   └── Extract GraphQL query patterns
   └── Identify data fetching strategies

3. Run skill-generator agent
   └── Generate project-patterns SKILL.md
   └── Generate architecture-guide SKILL.md
   └── Generate vocabulary.md
   └── Generate custom commands

4. Output enhancement report
```

## Example Output

```markdown
# Enhancement Complete

## Generated Skills
| File | Purpose |
|------|---------|
| .claude/skills/project-patterns/SKILL.md | 18 patterns documented |
| .claude/skills/architecture-guide/SKILL.md | Next.js structure guide |
| .claude/skills/vocabulary.md | 56 project terms |

## Generated Commands
| Command | Description |
|---------|-------------|
| /project:build | Build with Next.js production config |
| /project:dev | Start development with JSS |
| /project:new-component | Create new JSS component |

## Detected Patterns
- withDatasourceCheck HOC pattern (24 components)
- useQuery hook pattern (12 data hooks)
- getStaticProps with revalidation (8 pages)
- Fragment-based GraphQL organization (15 queries)

## AI Enhancement Impact
- Pattern recognition: +90% (18 patterns learned)
- Code generation accuracy: +45% (architecture understood)
- Command efficiency: +55% (4 custom commands)

## Next Steps
1. Review generated files in `.claude/skills/`
2. Commit to repository for team use
3. Customize generated skills as needed
```

## Privacy Considerations

- Respects `.claudeignore` patterns
- Does not extract API keys or secrets
- Sanitizes code examples (removes credentials, endpoints)
- Only analyzes patterns, not business logic details

## Skill Versioning

When using `--update`, the command compares the current codebase against `.meta.json`:

```
1. Read existing .claude/skills/.meta.json
2. Compute current project hash
3. Compare patterns:
   - New patterns → Add to skill
   - Removed patterns → Mark as deprecated
   - Changed patterns → Update in place
4. Preserve custom modifications (marked with <!-- custom -->)
5. Update .meta.json with new timestamp
```

### Update Behavior

| Scenario | Action |
|----------|--------|
| No existing skills | Full generation |
| Skills exist, no changes | Skip (report "up to date") |
| Skills exist, changes detected | Incremental update |
| `--force` flag | Regenerate all |

## Usage Examples

```bash
# Basic enhancement
/xm-cloud:enhance

# Preview what would be generated
/xm-cloud:enhance --dry-run

# Include code examples in skills
/xm-cloud:enhance --include-examples

# Custom output location
/xm-cloud:enhance --output ./docs/ai-skills/

# Update existing skills (incremental)
/xm-cloud:enhance --update

# Force regeneration
/xm-cloud:enhance --force
```
