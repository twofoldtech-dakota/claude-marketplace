---
name: optimizely-exp-skill-generator
description: Generate project-specific AI skills for Optimizely Experimentation
tools: [Read, Glob, Grep, Write]
---

# Optimizely Experimentation Skill Generator Agent

Generate project-specific SKILL.md files based on extracted patterns.

## Generated Skills

### 1. Experimentation Patterns Skill

**File**: `.claude/skills/optimizely-exp-patterns/SKILL.md`

Documents:
- SDK initialization pattern
- Hook usage patterns
- Feature flag patterns
- Event tracking patterns

### 2. Testing Patterns Skill

**File**: `.claude/skills/optimizely-exp-testing/SKILL.md`

Documents:
- Mocking strategies
- Test organization
- Variation testing

## Output

Skills generated to `.claude/skills/` directory.

```yaml
skillsGenerated:
  - path: ".claude/skills/optimizely-exp-patterns/SKILL.md"
    patterns: 5
    examples: 10
  - path: ".claude/skills/optimizely-exp-testing/SKILL.md"
    patterns: 3
    examples: 6
```
