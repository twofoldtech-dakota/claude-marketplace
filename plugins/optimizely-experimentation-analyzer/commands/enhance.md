---
name: enhance
description: Generate project-specific AI skills from Optimizely Experimentation patterns
argument_hint: "[--output <path>]"
---

# Optimizely Experimentation Enhance Command

Generate project-specific AI skills by extracting patterns from your Optimizely Experimentation implementation.

## Usage

```bash
/optimizely-exp:enhance                    # Generate skills to .claude/skills/
/optimizely-exp:enhance --output ./skills  # Custom output path
/optimizely-exp:enhance --update           # Update existing skills
/optimizely-exp:enhance --force            # Force regeneration
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

1. **Extract Patterns** - Identify SDK patterns and conventions
2. **Learn Structure** - Understand hooks, flags, and experiments
3. **Generate Skills** - Create SKILL.md files for Claude

## Generated Skills

- **Experimentation Patterns** - SDK initialization, hooks, flags
- **Testing Patterns** - SDK mocking, decision testing, variation coverage
- **Error Handling** - SDK errors, graceful degradation, monitoring
- **Skill Metadata** - Version tracking in `.meta.json`

## Execution Flow

1. Run detector to identify SDK type and patterns
2. Run pattern-extractor to learn codebase conventions
3. Run skill-generator to create SKILL.md files

## Output

Skills generated to `.claude/skills/` directory.

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
