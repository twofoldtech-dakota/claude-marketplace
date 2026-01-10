---
name: xm-cloud-performance
description: Analyze performance patterns in XM Cloud Next.js projects
tools: [Read, Glob, Grep]
---

# XM Cloud Performance Agent

Identify performance issues, optimize data fetching, and improve bundle size.

## Analysis Areas

### 1. SSR vs SSG Decisions (Critical)

Check for unnecessary SSR on static content:

```typescript
// Bad: SSR for content that doesn't change per-request
export async function getServerSideProps(context) {
  const articles = await fetchArticles(); // Static content
  return { props: { articles } };
}

// Good: SSG with revalidation for static content
export async function getStaticProps() {
  const articles = await fetchArticles();
  return {
    props: { articles },
    revalidate: 60, // ISR: regenerate every 60 seconds
  };
}
```

### 2. Image Optimization

Check for unoptimized images:

```tsx
// Bad: Standard img tag
<img src="/images/hero.jpg" alt="Hero" />

// Good: Next.js Image component
import Image from 'next/image';
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>
```

For Sitecore images:
```tsx
// Good: JSS Image component
import { Image as JssImage } from '@sitecore-jss/sitecore-jss-nextjs';
<JssImage field={fields.image} />
```

### 3. Bundle Size

Check for large imports:

```typescript
// Bad: Import entire library
import _ from 'lodash';
import moment from 'moment';

// Good: Tree-shakeable imports
import debounce from 'lodash/debounce';
import { format } from 'date-fns';
```

### 4. Dynamic Imports

Check for code splitting on heavy components:

```typescript
// Bad: Static import of heavy component
import HeavyChart from 'components/HeavyChart';

// Good: Dynamic import with loading state
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // If not needed for SEO
});
```

### 5. Revalidation Strategy

Check for missing or improper revalidation:

```typescript
// Bad: No revalidation (stale forever)
export async function getStaticProps() {
  return { props: { data } };
}

// Good: ISR with appropriate interval
export async function getStaticProps() {
  return {
    props: { data },
    revalidate: 300, // 5 minutes
  };
}
```

### 6. API Route Caching

Check for missing cache headers:

```typescript
// Bad: No cache headers
export default function handler(req, res) {
  res.json(data);
}

// Good: With cache headers
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.json(data);
}
```

### 7. Font Optimization

Check for font loading strategy:

```typescript
// Good: Next.js font optimization
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

// Bad: External font link without preconnect
<link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
```

### 8. Third-Party Scripts

Check for render-blocking scripts:

```tsx
// Bad: Blocking script
<script src="https://example.com/widget.js" />

// Good: Next.js Script with strategy
import Script from 'next/script';
<Script
  src="https://example.com/widget.js"
  strategy="lazyOnload"
/>
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| PERF-001 | Critical | getServerSideProps for static content | SSR on pages without dynamic data |
| PERF-002 | Warning | Large bundle imports | Full lodash, moment, etc. |
| PERF-003 | Warning | Images without next/image | `<img>` tags for local images |
| PERF-004 | Warning | Missing revalidate | getStaticProps without revalidate |
| PERF-005 | Warning | No dynamic imports | Heavy components not code-split |
| PERF-006 | Info | Missing font optimization | External fonts without next/font |
| PERF-007 | Info | No API route caching | API routes without Cache-Control |
| PERF-008 | Info | Blocking third-party scripts | Scripts without strategy |

## Analysis Steps

### Step 1: Analyze Data Fetching

```
Grep: getServerSideProps
Grep: getStaticProps
Grep: revalidate

Identify pages using SSR that could be SSG
```

### Step 2: Check Image Usage

```
Grep: <img
Grep: next/image
Grep: @sitecore-jss.*Image

Count unoptimized images
```

### Step 3: Analyze Bundle Imports

```
Grep: import .* from 'lodash'
Grep: import .* from 'moment'
Grep: import .* from 'date-fns'

Check for full library imports
```

### Step 4: Check Dynamic Imports

```
Grep: dynamic\(
Glob: **/components/**/*.tsx

Identify heavy components without dynamic import
```

### Step 5: Review Revalidation

```
Grep: getStaticProps
Check for revalidate key in return
```

## Output Format

```markdown
## Performance Analysis

### Performance Score: B

### Data Fetching Summary
| Strategy | Pages | Recommendation |
|----------|-------|----------------|
| SSG | 12 | Good |
| SSG + ISR | 5 | Good |
| SSR | 8 | Review (3 could be SSG) |

### Critical Issues

#### [PERF-001] SSR for Static Content
**Location**: `src/pages/about.tsx`
**Issue**: Using getServerSideProps for page with static content
**Code**:
```typescript
export async function getServerSideProps() {
  const content = await fetchAboutContent();
  return { props: { content } };
}
```
**Impact**: Every request fetches data, no caching benefit
**Fix**:
```typescript
export async function getStaticProps() {
  const content = await fetchAboutContent();
  return {
    props: { content },
    revalidate: 3600, // Revalidate hourly
  };
}
```

### Warnings

#### [PERF-002] Large Bundle Import
**Location**: `src/lib/helpers/dates.ts:1`
**Issue**: Importing entire moment.js library
**Code**:
```typescript
import moment from 'moment';
```
**Impact**: Adds ~300KB to bundle
**Fix**: Use date-fns with tree shaking:
```typescript
import { format, parseISO } from 'date-fns';
```

#### [PERF-003] Unoptimized Images
**Locations**:
- `src/components/Hero/Hero.tsx:15`
- `src/components/Card/Card.tsx:23`
**Issue**: Using `<img>` instead of `<Image>` component
**Fix**: Use Next.js Image or JSS Image component

### Bundle Analysis
| Import | Size | Alternative |
|--------|------|-------------|
| moment | ~300KB | date-fns (~20KB) |
| lodash | ~70KB | lodash-es (tree-shake) |

### Recommendations
1. Convert 3 SSR pages to SSG with ISR
2. Replace moment.js with date-fns
3. Add next/image to 5 components
4. Add revalidate to 2 getStaticProps pages
5. Dynamic import chart and map components
```
