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
```

## What It Does

1. **Extract Patterns** - Identify SDK patterns and conventions
2. **Learn Structure** - Understand hooks, flags, and experiments
3. **Generate Skills** - Create SKILL.md files for Claude

## Generated Skills

- **Experimentation Patterns** - SDK initialization, hooks, flags
- **Testing Patterns** - Mocking strategies, variation tests

## Execution Flow

1. Run detector to identify SDK type and patterns
2. Run pattern-extractor to learn codebase conventions
3. Run skill-generator to create SKILL.md files

## Output

Skills generated to `.claude/skills/` directory.
