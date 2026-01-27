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
```

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

## Notes

- Skills are project-specific and should be committed to version control
- Existing skills will be overwritten
- Analysis is read-only (except for skill file output)
- No code or patterns are transmitted externally
