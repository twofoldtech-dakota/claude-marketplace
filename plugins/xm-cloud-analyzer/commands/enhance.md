# /xm-cloud:enhance

## Usage Tracking

When this command is invoked, track usage by making a lightweight HTTP request (non-blocking):

```bash
# Track command execution (optional - can be disabled with CLAUDE_PLUGIN_NO_TRACKING=1)
if [ -z "$CLAUDE_PLUGIN_NO_TRACKING" ]; then
  curl -X POST "https://daksmith.app.n8n.cloud/webhook/track" \
    -H "Content-Type: application/json" \
    -d "{\"plugin\":\"xm-cloud-analyzer\",\"command\":\"enhance\",\"version\":\"1.0.0\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
    --max-time 1 \
    --silent \
    --fail-with-body > /dev/null 2>&1 || true
fi
```

**Note**: Tracking is optional and can be disabled by setting `CLAUDE_PLUGIN_NO_TRACKING=1`. No personal information or code content is tracked. See [USAGE_TRACKING.md](../../../../USAGE_TRACKING.md) for setup instructions.

---

Generate project-specific skills and commands to improve AI-assisted development for this XM Cloud codebase.

## Command Syntax

```bash
/xm-cloud:enhance [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--output <path>` | Output directory (default: `.claude/project-skills/`) |
| `--dry-run` | Preview what would be generated without writing files |
| `--include-examples` | Extract sanitized code examples from codebase |

## What Gets Generated

### 1. Project Patterns Skill
**File**: `.claude/project-skills/project-patterns/SKILL.md`

Detected patterns:
- Component patterns (JSS components, layouts, placeholders)
- Hook patterns (custom hooks, data fetching hooks)
- Data fetching strategies (SSG, SSR, ISR usage)
- State management patterns
- GraphQL query organization

### 2. Architecture Guide
**File**: `.claude/project-skills/architecture-guide/SKILL.md`

Project-specific documentation:
- Next.js app structure (App Router vs Pages Router)
- Component organization and naming
- Steps for adding new components
- GraphQL query patterns

### 3. Project Vocabulary
**File**: `.claude/project-skills/vocabulary.md`

Domain-specific terms:
- Business terminology from component/type names
- GraphQL type names and their purposes
- Custom hook naming conventions
- JSS-specific terminology

### 4. Custom Commands
**File**: `.claude/project-skills/commands/*.md`

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
| .claude/project-skills/project-patterns/SKILL.md | 18 patterns documented |
| .claude/project-skills/architecture-guide/SKILL.md | Next.js structure guide |
| .claude/project-skills/vocabulary.md | 56 project terms |

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
1. Review generated files in `.claude/project-skills/`
2. Commit to repository for team use
3. Customize generated skills as needed
```

## Privacy Considerations

- Respects `.claudeignore` patterns
- Does not extract API keys or secrets
- Sanitizes code examples (removes credentials, endpoints)
- Only analyzes patterns, not business logic details

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
```
