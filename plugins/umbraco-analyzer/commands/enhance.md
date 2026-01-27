# /umbraco:enhance

Generate project-specific skills and commands to improve AI-assisted development for this Umbraco codebase.

## Command Syntax

```bash
/umbraco:enhance [options]
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
- Composer patterns (registration, ordering)
- Service layer patterns (interfaces, lifetimes)
- Controller patterns (Surface, API, Render)
- Notification handler patterns
- Property value converter patterns

### 2. Architecture Guide
**File**: `.claude/skills/architecture-guide/SKILL.md`

Project-specific documentation:
- Project structure and layering
- Composer organization
- Steps for adding new features
- Content Delivery API configuration

### 3. Project Vocabulary
**File**: `.claude/skills/vocabulary.md`

Domain-specific terms:
- Business terminology from class names
- Document type naming conventions
- Property alias patterns
- Umbraco-specific terminology

### 4. Testing Patterns Skill
**File**: `.claude/skills/testing-patterns/SKILL.md`

Detected patterns:
- Backend test framework (xUnit, NUnit)
- Frontend test framework (Jest for Lit components)
- Umbraco mocking patterns (PublishedContent, services)
- Test file organization

### 5. Error Handling Skill
**File**: `.claude/skills/error-handling/SKILL.md`

Detected patterns:
- Logging framework (Microsoft.Extensions.Logging, Serilog)
- Notification error handling
- API error responses (ProblemDetails)
- Validation patterns

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
- `/project:build` - Build with detected .NET configuration
- `/project:run` - Start Umbraco locally
- `/project:migrate` - Run content migrations
- `/project:new-composer` - Scaffold new Composer

## Execution Flow

```
1. Run detector agent
   └── Confirm Umbraco platform
   └── Detect version, .NET version, backoffice type

2. Run pattern-extractor agent
   └── Scan Composer implementations
   └── Analyze service registrations
   └── Extract controller patterns
   └── Identify notification handlers

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
| .claude/skills/project-patterns/SKILL.md | 14 patterns documented |
| .claude/skills/architecture-guide/SKILL.md | Architecture guide |
| .claude/skills/vocabulary.md | 38 project terms |

## Generated Commands
| Command | Description |
|---------|-------------|
| /project:build | Build with Release configuration |
| /project:run | Start Umbraco with hot reload |
| /project:new-composer | Create new Composer class |

## Detected Patterns
- IComposer registration pattern (8 composers)
- Scoped service lifetime default (15 services)
- SurfaceController with DI (6 controllers)
- INotificationHandler<T> pattern (12 handlers)

## AI Enhancement Impact
- Pattern recognition: +80% (14 patterns learned)
- Code generation accuracy: +42% (architecture understood)
- Command efficiency: +50% (4 custom commands)

## Next Steps
1. Review generated files in `.claude/skills/`
2. Commit to repository for team use
3. Customize generated skills as needed
```

## Privacy Considerations

- Respects `.claudeignore` patterns
- Does not extract connection strings or API keys
- Sanitizes code examples (removes credentials)
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
/umbraco:enhance

# Preview what would be generated
/umbraco:enhance --dry-run

# Include code examples in skills
/umbraco:enhance --include-examples

# Custom output location
/umbraco:enhance --output ./docs/ai-skills/

# Update existing skills (incremental)
/umbraco:enhance --update

# Force regeneration
/umbraco:enhance --force
```
