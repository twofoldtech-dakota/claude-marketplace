---
name: xm-cloud-architecture
description: Analyze Next.js application structure and component organization in XM Cloud projects
tools: [Read, Glob, Grep]
---

# XM Cloud Architecture Agent

Analyze Next.js application structure, component organization, and architectural patterns.

## Analysis Areas

### 1. Router Consistency

Check for mixed router patterns:

**App Router** (`/src/app/`):
```
src/app/
├── layout.tsx
├── page.tsx
├── [[...path]]/
│   └── page.tsx
```

**Pages Router** (`/src/pages/`):
```
src/pages/
├── _app.tsx
├── _document.tsx
├── [[...path]].tsx
```

Flag if both patterns are actively used (ARCH-001).

### 2. Component Organization

Check for proper component structure:

```
src/components/
├── Navigation/
│   ├── Navigation.tsx
│   ├── Navigation.module.css
│   └── index.ts
├── Hero/
│   ├── Hero.tsx
│   └── Hero.module.css
└── shared/
    └── Button/
        └── Button.tsx
```

Flag if components are scattered or in page files (ARCH-002).

### 3. Layout Structure

Verify proper layout hierarchy:

```tsx
// Good: Layout component with placeholders
const Layout = ({ rendering }: LayoutProps) => (
  <div className="layout">
    <Header />
    <main>
      <Placeholder name="main" rendering={rendering} />
    </main>
    <Footer />
  </div>
);
```

### 4. Business Logic Placement

Check for business logic in page components:

```tsx
// Bad: Logic in page component
export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Complex data transformation here
    const processed = rawData.map(item => {
      // 50+ lines of business logic
    });
    setData(processed);
  }, []);
}

// Good: Logic in custom hook or service
export default function Page() {
  const { data } = useProcessedData();
  return <DataDisplay data={data} />;
}
```

### 5. Shared Utilities Organization

Check for utilities folder structure:

```
src/
├── lib/
│   ├── graphql/          # GraphQL utilities
│   ├── helpers/          # Pure utility functions
│   └── hooks/            # Custom React hooks
├── services/             # External API integrations
└── types/                # TypeScript type definitions
```

### 6. JSS Component Registration

Verify component factory setup:

```tsx
// src/temp/componentFactory.ts
import { ComponentFactory } from '@sitecore-jss/sitecore-jss-nextjs';

const componentFactory: ComponentFactory = new Map();
componentFactory.set('Hero', dynamic(() => import('components/Hero')));
componentFactory.set('Navigation', dynamic(() => import('components/Navigation')));
```

### 7. Middleware Organization

Check middleware structure for personalization/multisite:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import { PersonalizeMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';

export async function middleware(request: NextRequest) {
  // Proper middleware chain
}
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| ARCH-001 | Critical | Mixed App Router and Pages Router | Both `/app/` and `/pages/` with active routes |
| ARCH-002 | Warning | Components not in dedicated folder | Components in `/pages/` or scattered locations |
| ARCH-003 | Warning | Business logic in page components | Complex logic (>20 lines) in page files |
| ARCH-004 | Warning | Missing layout component structure | No layout wrappers for placeholders |
| ARCH-005 | Info | Inconsistent folder naming | Mixed naming conventions in folders |
| ARCH-006 | Info | No shared utilities folder | Missing `/lib/` or `/utils/` |

## Analysis Steps

### Step 1: Detect Router Usage

```
Glob: **/src/app/**/page.tsx
Glob: **/src/pages/**/*.tsx

Count active routes in each
Flag if both have >0 routes
```

### Step 2: Analyze Component Structure

```
Glob: **/src/components/**/*.tsx
Glob: **/src/pages/**/*.tsx (check for component definitions)

Identify component locations
Check for co-located styles/tests
```

### Step 3: Check Page Complexity

```
For each page file:
  Count lines in default export
  Check for useState, useEffect with complex logic
  Flag if >50 lines or >3 hooks with logic
```

### Step 4: Verify Layout Patterns

```
Grep: <Placeholder.*name=
Check for layout components wrapping placeholders
```

## Output Format

```markdown
## Architecture Analysis

### Summary
- **Router**: App Router (Next.js 14)
- **Components**: 24 JSS components
- **Layouts**: 3 layout templates
- **Architecture Score**: A-

### Structure Overview
```
src/
├── app/              ✓ App Router
├── components/       ✓ 24 components
├── lib/              ✓ Utilities present
├── graphql/          ✓ Query organization
└── types/            ✓ TypeScript types
```

### Warnings

#### [ARCH-002] Components Not in Dedicated Folder
**Location**: `src/pages/index.tsx`
**Issue**: Hero component defined inline in page file
**Impact**: Reduced reusability, harder to test
**Fix**: Move to `src/components/Hero/Hero.tsx`

#### [ARCH-003] Business Logic in Page Component
**Location**: `src/app/products/page.tsx:45-120`
**Issue**: 75 lines of data processing in page component
**Fix**: Extract to `useProductData` hook or `ProductService`

### Component Organization
| Category | Count | Location |
|----------|-------|----------|
| JSS Components | 24 | src/components/ |
| Layout Components | 3 | src/components/Layout/ |
| Shared UI | 8 | src/components/shared/ |
| Page Components | 2 | src/app/ (inline) |

### Recommendations
1. Move inline page components to src/components/
2. Extract data processing logic to custom hooks
3. Create shared utilities folder for common helpers
```
