# Optimizely Experimentation Analyzer

Analyze Optimizely Experimentation (Full Stack SDK) and Optimizely Web implementations for A/B testing, feature flags, and JavaScript SDK patterns.

## Supported Products

| Product | SDK | Use Case |
|---------|-----|----------|
| Optimizely Full Stack | JavaScript/TypeScript SDK | Server-side & client-side experiments |
| Optimizely Full Stack | React SDK | React applications |
| Optimizely Web | Snippet-based | Client-side visual experiments |

## Commands

### Analyze

Run comprehensive analysis on your Optimizely Experimentation implementation:

```bash
/optimizely-exp:analyze                    # Run all agents
/optimizely-exp:analyze all                # Run all agents (explicit)
/optimizely-exp:analyze implementation     # SDK implementation only
/optimizely-exp:analyze experiments        # A/B test patterns only
/optimizely-exp:analyze feature-flags      # Feature flag patterns only
/optimizely-exp:analyze events             # Event tracking only
/optimizely-exp:analyze security           # Security checks only
/optimizely-exp:analyze performance        # Performance analysis only
/optimizely-exp:analyze quality            # Code quality only
```

### Output Options

```bash
/optimizely-exp:analyze                      # Write to docs/optimizely-exp-analysis-{date}.md
/optimizely-exp:analyze --output ./report.md # Custom output path
/optimizely-exp:analyze --no-file            # Display only, no file output
```

### Other Commands

```bash
/optimizely-exp:enhance              # Generate project-specific AI skills
/optimizely-exp:security-scan        # Preview analysis scope
/optimizely-exp:setup                # Initial configuration
```

## Analysis Categories

### Implementation (IMPL)
- SDK initialization patterns
- Datafile management
- Client configuration
- Error handling

### Experiments (EXP)
- A/B test implementation
- Variation handling
- Flicker prevention
- Decision tracking

### Feature Flags (FF)
- Flag implementation patterns
- Typed accessors
- Default handling
- Flag lifecycle

### Events (EVT)
- Event tracking implementation
- Conversion events
- Custom events
- Event properties

### Security (SEC)
- SDK key exposure
- CSP configuration
- Data leakage prevention

### Performance (PERF)
- SDK loading strategy
- Bundle size impact
- Flicker prevention
- Caching

### Code Quality (CQ)
- TypeScript patterns
- React hooks usage
- Error handling
- Testing patterns

## Detection

The analyzer identifies Optimizely Experimentation via:

**Full Stack SDK:**
- NPM packages: `@optimizely/optimizely-sdk`, `@optimizely/react-sdk`
- Import statements and SDK initialization

**Optimizely Web:**
- Snippet: `cdn.optimizely.com/js/PROJECT_ID.js`
- Global `window.optimizely` usage

## Report Format

Analysis generates a markdown report with:
- SDK detection summary
- Category scores (A-F)
- Critical issues requiring immediate attention
- Warnings and recommendations
- Prioritized action items

## Privacy

- Analysis is read-only
- No code is transmitted externally
- Optional usage tracking can be disabled with `CLAUDE_PLUGIN_NO_TRACKING=1`
