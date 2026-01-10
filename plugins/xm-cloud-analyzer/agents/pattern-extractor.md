# Pattern Extractor Agent - XM Cloud

Extract project-specific patterns from XM Cloud/JSS codebases to generate AI-enhancing skills.

## Agent Configuration

**Name**: `pattern-extractor`
**Tools**: `Read, Glob, Grep`
**Purpose**: Detect and document coding patterns specific to this project

## Pattern Categories

### 1. Component Patterns

**Detection Strategy**:
```
1. Find all JSS component files
2. Identify withDatasourceCheck usage
3. Detect field component patterns
4. Analyze props typing
5. Check for error boundaries
```

**Files to Scan**:
- `**/src/components/**/*.tsx`
- `**/src/components/**/*.jsx`
- `**/components/**/*.tsx`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Datasource check | `withDatasourceCheck` HOC | Wrapped components |
| Field components | `<Text>`, `<RichText>`, `<Image>` | Sitecore field rendering |
| Props interface | `interface.*Props` | Component typing |
| Placeholder usage | `<Placeholder` | Dynamic areas |

**Output Format**:
```yaml
componentPatterns:
  hocUsage: "withDatasourceCheck"
  propsConvention: "{ComponentName}Props"
  fieldComponents:
    - Text
    - RichText
    - Image
    - Link
  errorHandling: "ErrorBoundary wrapper"
  examples:
    - name: Hero
      file: src/components/Hero.tsx
```

### 2. Hook Patterns

**Detection Strategy**:
```
1. Find custom hooks (use* prefix)
2. Identify data fetching hooks
3. Detect state management patterns
4. Analyze hook dependencies
```

**Files to Scan**:
- `**/hooks/**/*.ts`
- `**/hooks/**/*.tsx`
- `**/**/use*.ts`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Custom hooks | `function use` or `const use` | `useNavigation` |
| Data hooks | Hooks returning query data | `useContentQuery` |
| State hooks | useState/useReducer patterns | State management |
| Effect patterns | useEffect with dependencies | Side effect handling |

### 3. Data Fetching Patterns

**Detection Strategy**:
```
1. Analyze getStaticProps usage
2. Check getServerSideProps patterns
3. Identify ISR configuration
4. Detect client-side fetching
```

**Files to Scan**:
- `**/pages/**/*.tsx`
- `**/app/**/page.tsx`
- `**/lib/**/*.ts`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Static generation | `getStaticProps` | SSG pages |
| Server rendering | `getServerSideProps` | SSR pages |
| ISR | `revalidate` property | Incremental regeneration |
| Client fetching | `useQuery`, `useSWR` | Client-side data |

**Output Format**:
```yaml
dataFetchingPatterns:
  primary: "SSG with ISR"
  revalidateDefault: 60
  staticPages:
    - /
    - /about
  dynamicPages:
    - /products/[slug]
  clientFetching: "react-query"
```

### 4. GraphQL Patterns

**Detection Strategy**:
```
1. Find .graphql files
2. Analyze query structure
3. Detect fragment usage
4. Identify query naming conventions
```

**Files to Scan**:
- `**/*.graphql`
- `**/graphql/**/*`
- `**/queries/**/*`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Query naming | Query name conventions | `GetNavigationQuery` |
| Fragment usage | `fragment` definitions | Reusable fields |
| Variable patterns | `$variable` usage | Query parameters |
| Nesting depth | Query depth analysis | Complexity check |

### 5. Styling Patterns

**Detection Strategy**:
```
1. Identify CSS approach (modules, styled-components, Tailwind)
2. Detect theme usage
3. Analyze responsive patterns
```

**Files to Scan**:
- `**/*.module.css`
- `**/*.module.scss`
- `**/styles/**/*`
- `tailwind.config.*`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| CSS Modules | `*.module.css` imports | Scoped styles |
| Tailwind | `tailwind.config.js` | Utility classes |
| Styled Components | `styled.*` usage | CSS-in-JS |
| Theme | Theme provider usage | Design tokens |

### 6. TypeScript Patterns

**Detection Strategy**:
```
1. Analyze type definitions
2. Check strict mode usage
3. Identify common type patterns
```

**Files to Scan**:
- `**/types/**/*.ts`
- `**/*.d.ts`
- `tsconfig.json`

**Patterns to Extract**:
| Pattern | Detection | Example |
|---------|-----------|---------|
| Strict mode | `tsconfig.json` strict | Type safety level |
| Type location | Type file organization | Central vs co-located |
| Generic usage | Generic type patterns | Reusable types |
| Utility types | Pick, Omit, Partial usage | Type manipulation |

## Execution

```bash
# The agent executes these steps:

1. Glob for pattern-specific files
2. Read and analyze file contents
3. Extract pattern metadata
4. Build pattern documentation
5. Return structured pattern data
```

## Output Schema

```json
{
  "patterns": {
    "components": [...],
    "hooks": [...],
    "dataFetching": [...],
    "graphql": [...],
    "styling": [...],
    "typescript": [...]
  },
  "statistics": {
    "totalPatternsFound": 52,
    "componentsAnalyzed": 24,
    "hooksAnalyzed": 12,
    "queriesAnalyzed": 15
  },
  "examples": [
    {
      "pattern": "withDatasourceCheck",
      "file": "src/components/Hero.tsx",
      "snippet": "..." // Sanitized
    }
  ]
}
```

## Privacy

- Skip files matching `.claudeignore`
- Do not extract API keys or endpoints
- Sanitize code snippets
- Focus on structure, not implementation details
