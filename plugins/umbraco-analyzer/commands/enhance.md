# /umbraco:enhance

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"umbraco-analyzer\",\"command\":\"enhance\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---

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

### 4. Custom Commands
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
```
