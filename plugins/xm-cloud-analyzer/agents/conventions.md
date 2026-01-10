---
name: xm-cloud-conventions
description: Analyze naming conventions and code organization in XM Cloud projects
tools: [Read, Glob, Grep]
---

# XM Cloud Conventions Agent

Analyze naming conventions, file organization, and code style consistency.

## Analysis Areas

### 1. Component Naming

Check component file and export naming:

```typescript
// Good: PascalCase file and export
// components/Hero/Hero.tsx
export const Hero = () => { ... };
export default Hero;

// Bad: Inconsistent naming
// components/hero-banner.tsx
export const heroBanner = () => { ... };
```

### 2. File Naming Conventions

Check for consistent file naming:

```
Good:
components/
├── Hero/
│   ├── Hero.tsx           # PascalCase component
│   ├── Hero.module.css    # Matching CSS module
│   └── Hero.test.tsx      # Matching test file
├── hooks/
│   └── useNavigation.ts   # camelCase with use prefix
└── lib/
    └── graphql-client.ts  # kebab-case for utilities
```

### 3. Hook Naming

Check custom hooks follow React conventions:

```typescript
// Good: use prefix
export const useNavigation = () => { ... };
export const useArticles = () => { ... };

// Bad: Missing use prefix
export const getNavigation = () => { ... };  // Not a hook name
export const navigationHook = () => { ... }; // Wrong pattern
```

### 4. GraphQL Query Naming

Check query names are descriptive:

```graphql
# Good: Descriptive query names
query GetNavigationByPath($path: String!) { ... }
query SearchArticlesByCategory($category: String!) { ... }

# Bad: Generic names
query Query1 { ... }
query GetData { ... }
```

### 5. CSS Module Naming

Check CSS module class naming:

```css
/* Good: camelCase class names */
.heroContainer { }
.heroTitle { }
.heroImage { }

/* Bad: BEM or kebab-case (causes issues with JS) */
.hero-container { }
.hero__title { }
```

### 6. TypeScript Interface Naming

Check interface/type naming conventions:

```typescript
// Good: Descriptive with Props/Data suffix
interface HeroProps { ... }
interface ArticleData { ... }
type NavigationItem = { ... };

// Bad: Generic or no suffix
interface IHero { ... }  // I prefix is outdated
interface Hero { ... }   // Conflicts with component name
```

### 7. Test File Organization

Check test files are co-located:

```
Good: Co-located tests
components/
├── Hero/
│   ├── Hero.tsx
│   └── Hero.test.tsx

Bad: Separate test directory
components/
├── Hero/
│   └── Hero.tsx
__tests__/
└── components/
    └── Hero.test.tsx
```

### 8. Import Aliases

Check for consistent import aliases:

```typescript
// Good: Using @ alias
import { Hero } from '@/components/Hero';
import { useNavigation } from '@/hooks/useNavigation';

// Bad: Relative path chaos
import { Hero } from '../../../components/Hero';
import { useNavigation } from '../../hooks/useNavigation';
```

### 9. Environment Variable Naming

Check env var naming:

```bash
# Good: SCREAMING_SNAKE_CASE
SITECORE_API_KEY=xxx
GRAPH_QL_ENDPOINT=xxx
NEXT_PUBLIC_SITE_NAME=xxx

# Bad: Mixed case
sitecoreApiKey=xxx
graphql_endpoint=xxx
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| CONV-001 | Warning | Component file not PascalCase | Component in non-PascalCase file |
| CONV-002 | Warning | Hook missing use prefix | Custom hook without `use` |
| CONV-003 | Warning | Non-descriptive query name | Query named `Query1` etc. |
| CONV-004 | Info | Inconsistent CSS naming | Mixed kebab/camel in modules |
| CONV-005 | Info | Tests not co-located | Test files in separate directory |
| CONV-006 | Info | No import aliases | Relative imports with >2 levels |
| CONV-007 | Info | Interface naming | I prefix or conflicts |

## Analysis Steps

### Step 1: Analyze Component Files

```
Glob: **/components/**/*.tsx

For each file:
  Check filename is PascalCase
  Check export matches filename
```

### Step 2: Check Hook Naming

```
Glob: **/hooks/**/*.ts
Grep: export (const|function) use

Verify all hooks start with 'use'
```

### Step 3: Analyze GraphQL Queries

```
Glob: **/*.graphql
Grep: query [A-Za-z]+

Check query names are descriptive
```

### Step 4: Check Test Organization

```
Glob: **/*.test.tsx
Glob: **/*.spec.tsx
Glob: **/__tests__/**

Compare locations to source files
```

### Step 5: Analyze Imports

```
Grep: from '\.\./\.\./

Count deep relative imports
Check for @ alias usage
```

## Output Format

```markdown
## Conventions Analysis

### Summary
- **Components Analyzed**: 24
- **Hooks Analyzed**: 8
- **Naming Score**: 85%

### Warnings

#### [CONV-001] Component File Not PascalCase
**Files**:
- `src/components/hero-banner.tsx` → `HeroBanner.tsx`
- `src/components/nav_item.tsx` → `NavItem.tsx`
**Fix**: Rename files to PascalCase

#### [CONV-002] Hook Missing use Prefix
**Location**: `src/hooks/navigationData.ts`
**Current**: `export const navigationData = () => { ... }`
**Fix**: Rename to `useNavigationData`

### Info

#### [CONV-005] Tests Not Co-located
**Pattern**: Tests in `__tests__/` directory
**Affected**: 12 test files
**Recommendation**: Move tests next to source files:
```
components/Hero/
├── Hero.tsx
└── Hero.test.tsx  # Co-located
```

#### [CONV-006] Deep Relative Imports
**Files with >2 level imports**: 15
**Example**: `import { utils } from '../../../lib/utils'`
**Fix**: Configure path aliases in tsconfig.json:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Naming Convention Summary
| Category | Pattern | Compliant | Total |
|----------|---------|-----------|-------|
| Components | PascalCase | 22 | 24 |
| Hooks | useXxx | 7 | 8 |
| Utilities | kebab-case | 10 | 12 |
| GraphQL | DescriptiveName | 12 | 15 |
| CSS Modules | camelCase | 20 | 24 |

### Recommendations
1. Rename 2 component files to PascalCase
2. Add `use` prefix to 1 hook
3. Configure import aliases to reduce relative paths
4. Move tests to co-located pattern
```
