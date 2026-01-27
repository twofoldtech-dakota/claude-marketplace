---
name: enhance
description: Generate project-specific AI skills from Optimizely CMS codebase patterns
argument_hint: "[--output <path>]"
---

# Optimizely Enhance Command

Generate project-specific AI skills by extracting patterns from your Optimizely CMS codebase.

## Usage

```bash
/optimizely:enhance                    # Generate skills to .claude/skills/
/optimizely:enhance --output ./skills  # Custom output path
/optimizely:enhance --update           # Update existing skills
/optimizely:enhance --force            # Force regeneration
```

## Options

| Option | Description |
|--------|-------------|
| `--output <path>` | Output directory (default: `.claude/skills/`) |
| `--dry-run` | Preview what would be generated without writing files |
| `--include-examples` | Extract sanitized code examples from codebase |
| `--update` | Update existing skills instead of regenerating (compares with `.meta.json`) |
| `--force` | Overwrite existing skills without confirmation |

## What It Does

The enhance command analyzes your codebase to:

1. **Extract Patterns** - Identify conventions and patterns used in your project
2. **Learn Structure** - Understand content types, services, and architecture
3. **Generate Skills** - Create SKILL.md files that teach Claude your patterns

## Generated Skills

### Content Types Skill
Teaches Claude your content type patterns:
- Base class hierarchy
- Property conventions
- GUID and attribute patterns
- Content area restrictions

### Services Skill
Teaches Claude your service layer:
- Interface patterns
- Dependency injection
- Async conventions
- Error handling

### Controllers Skill
Teaches Claude your controller patterns:
- Page/Block controller patterns
- ViewModel construction
- Action conventions

### Project Conventions Skill
Consolidates project-wide conventions:
- Naming standards
- File organization
- Configuration patterns

### Testing Patterns Skill
Teaches Claude your testing patterns:
- Test framework and mocking library
- Content mocking strategies
- Service and controller test patterns
- Integration test fixtures

### Error Handling Skill
Teaches Claude your error handling:
- Logging framework and patterns
- Custom exception hierarchy
- API error responses (ProblemDetails)
- Resilience patterns (Polly)

### Skill Metadata
Tracks skill versioning in `.meta.json`:
- Generation timestamp
- Project hash for change detection
- Pattern counts per skill

## Execution Flow

### Step 1: Detection

Run detector to identify:
- Optimizely version
- Project structure
- Key directories

### Step 2: Pattern Extraction

Run pattern-extractor agent to learn:
- Content type patterns from `Models/`
- Service patterns from `Services/`
- Controller patterns from `Controllers/`
- View patterns from `Views/`
- Configuration patterns from `appsettings.json`

### Step 3: Skill Generation

Run skill-generator agent to create:
- `.claude/skills/optimizely-content-types/SKILL.md`
- `.claude/skills/optimizely-services/SKILL.md`
- `.claude/skills/optimizely-controllers/SKILL.md`
- `.claude/skills/project-conventions/SKILL.md`

## Output

```
Optimizely CMS Enhancement Complete

Skills Generated:
  - .claude/skills/optimizely-content-types/SKILL.md (5 patterns, 8 examples)
  - .claude/skills/optimizely-services/SKILL.md (3 patterns, 4 examples)
  - .claude/skills/optimizely-controllers/SKILL.md (2 patterns, 3 examples)
  - .claude/skills/project-conventions/SKILL.md (10 patterns, 15 examples)

Total: 20 patterns extracted, 30 code examples

Claude will now use these skills when working with your codebase.
```

## Benefits

After running enhance:

1. **Consistent Code** - Claude writes code matching your conventions
2. **Faster Development** - No need to explain patterns repeatedly
3. **Quality Improvements** - Claude avoids your project's anti-patterns
4. **Team Alignment** - Patterns documented and shared

## When to Re-run

Re-run enhance when:
- Major architectural changes
- New patterns introduced
- Conventions updated
- After significant refactoring

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

## Notes

- Skills are project-specific and should be committed to version control
- With `--update`, existing skills are incrementally updated
- With `--force`, existing skills will be overwritten
- Analysis is read-only (except for skill file output)
- No code or patterns are transmitted externally
