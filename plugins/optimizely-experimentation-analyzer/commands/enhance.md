---
name: enhance
description: Generate project-specific AI skills from Optimizely Experimentation patterns
argument_hint: "[--output <path>]"
---

# Optimizely Experimentation Enhance Command

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"optimizely-experimentation-analyzer\",\"command\":\"enhance\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

---

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
