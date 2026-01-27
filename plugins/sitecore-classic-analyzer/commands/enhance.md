# /sitecore-classic:enhance

Generate project-specific skills and commands to improve AI-assisted development for this Sitecore 10.x codebase.

## Command Syntax

```bash
/sitecore-classic:enhance [options]
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
- Service layer conventions (base classes, interfaces, lifetimes)
- Repository patterns (data access, caching strategies)
- Controller rendering patterns (action signatures, model binding)
- Pipeline processor patterns (custom processors, events)
- Configuration patterns (patch file organization, environment configs)

### 2. Architecture Guide
**File**: `.claude/skills/architecture-guide/SKILL.md`

Project-specific documentation:
- Helix layer structure with actual module names
- Dependency rules detected from `.csproj` references
- Steps for adding new Feature/Foundation modules
- Serialization configuration and patterns

### 3. Project Vocabulary
**File**: `.claude/skills/vocabulary.md`

Domain-specific terms:
- Business terminology from class/method names
- Acronyms used in the project
- Custom type names and their purposes
- Sitecore-specific naming conventions

### 4. Testing Patterns Skill
**File**: `.claude/skills/testing-patterns/SKILL.md`

Detected patterns:
- Test framework configuration (xUnit, NUnit, MSTest)
- Mocking strategies (Moq, NSubstitute, FakeItEasy)
- Sitecore-specific testing (FakeDb, item mocking)
- Test file organization and naming

### 5. Error Handling Skill
**File**: `.claude/skills/error-handling/SKILL.md`

Detected patterns:
- Logging framework usage (Sitecore.Diagnostics, Serilog)
- Pipeline error handling patterns
- Custom exception types
- Error page configuration

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
- `/project:build` - Build with detected MSBuild configuration
- `/project:serialize` - Run SCS/Unicorn serialization
- `/project:deploy` - Deploy to detected environments
- `/project:new-feature` - Scaffold new Helix feature module

## Execution Flow

```
1. Run detector agent
   └── Confirm Sitecore Classic platform
   └── Detect version, modules, serialization format

2. Run pattern-extractor agent
   └── Scan service classes for patterns
   └── Analyze controller implementations
   └── Extract interface conventions
   └── Identify naming patterns
   └── Find pipeline processors

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
| .claude/skills/project-patterns/SKILL.md | 15 patterns documented |
| .claude/skills/architecture-guide/SKILL.md | Helix structure guide |
| .claude/skills/vocabulary.md | 42 project terms |

## Generated Commands
| Command | Description |
|---------|-------------|
| /project:build | Build solution with Release configuration |
| /project:serialize | Push items using SCS |
| /project:new-feature | Create new Feature module |

## Detected Patterns
- ServiceBase<T> inheritance pattern (12 services)
- IRepository<T> with caching decorator (8 repositories)
- RenderingController base class (15 controllers)
- ConfiguratorBase for DI registration (6 modules)

## AI Enhancement Impact
- Pattern recognition: +85% (15 patterns learned)
- Code generation accuracy: +40% (architecture understood)
- Command efficiency: +60% (4 custom commands)

## Next Steps
1. Review generated files in `.claude/skills/`
2. Commit to repository for team use
3. Customize generated skills as needed
```

## Privacy Considerations

- Respects `.claudeignore` patterns
- Does not extract sensitive configuration values
- Sanitizes code examples (removes credentials, connection strings)
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
/sitecore-classic:enhance

# Preview what would be generated
/sitecore-classic:enhance --dry-run

# Include code examples in skills
/sitecore-classic:enhance --include-examples

# Custom output location
/sitecore-classic:enhance --output ./docs/ai-skills/

# Update existing skills (incremental)
/sitecore-classic:enhance --update

# Force regeneration
/sitecore-classic:enhance --force
```
