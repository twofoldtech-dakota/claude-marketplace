---
name: xm-cloud
description: Apply when working with Sitecore XM Cloud, JSS, Next.js rendering host, or Experience Edge
globs:
  - "**/src/rendering/**/*"
  - "**/xmcloud.build.json"
  - "**/*.graphql"
  - "**/src/components/**/*.tsx"
  - "**/package.json"
---

# XM Cloud Development Patterns

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        XM Cloud                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Content   │───▶│  Experience │───▶│    Edge     │     │
│  │ Management  │    │    Edge     │    │    CDN      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ GraphQL
┌─────────────────────────────────────────────────────────────┐
│                    Rendering Host                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Next.js   │───▶│    SSG/     │───▶│   Vercel/   │     │
│  │    App      │    │   ISR/SSR   │    │   Netlify   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── rendering/
│   ├── src/
│   │   ├── components/         # JSS components
│   │   │   ├── Hero/
│   │   │   │   ├── Hero.tsx
│   │   │   │   └── Hero.module.css
│   │   │   └── Navigation/
│   │   ├── lib/                # Utilities
│   │   │   ├── graphql/
│   │   │   ├── helpers/
│   │   │   └── component-props.ts
│   │   ├── graphql/            # GraphQL queries
│   │   │   ├── queries/
│   │   │   └── fragments/
│   │   ├── hooks/              # Custom React hooks
│   │   └── types/              # TypeScript definitions
│   ├── package.json
│   └── next.config.js
└── xmcloud.build.json
```

## JSS Component Patterns

### Basic Component with Fields

```tsx
import {
  Text,
  Field,
  RichText,
  ImageField,
  Image,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

interface HeroProps extends ComponentProps {
  fields: {
    heading: Field<string>;
    subheading: Field<string>;
    body: Field<string>;
    image: ImageField;
    ctaText: Field<string>;
    ctaLink: LinkField;
  };
}

const Hero = ({ fields }: HeroProps): JSX.Element => (
  <section className="hero">
    <div className="hero-content">
      <Text field={fields.heading} tag="h1" />
      <Text field={fields.subheading} tag="h2" />
      <RichText field={fields.body} />
      <Link field={fields.ctaLink}>
        <Text field={fields.ctaText} />
      </Link>
    </div>
    <div className="hero-image">
      <Image field={fields.image} />
    </div>
  </section>
);

// Always wrap components that access datasource fields
export default withDatasourceCheck()<HeroProps>(Hero);
```

### Component with Placeholder

```tsx
import {
  Placeholder,
  ComponentRendering,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface LayoutProps {
  rendering: ComponentRendering;
}

const TwoColumnLayout = ({ rendering }: LayoutProps): JSX.Element => (
  <div className="two-column">
    <aside className="sidebar">
      <Placeholder name="sidebar" rendering={rendering} />
    </aside>
    <main className="main-content">
      <Placeholder name="main" rendering={rendering} />
    </main>
  </div>
);

export default TwoColumnLayout;
```

### Component with Data Fetching

```tsx
import { GetStaticComponentProps } from '@sitecore-jss/sitecore-jss-nextjs';
import { fetchNavigationData } from 'lib/graphql/navigation';

interface NavigationProps {
  fields: { ... };
  navigationItems: NavigationItem[];
}

const Navigation = ({ fields, navigationItems }: NavigationProps) => (
  <nav>
    {navigationItems.map(item => (
      <a key={item.id} href={item.url}>{item.title}</a>
    ))}
  </nav>
);

// Fetch additional data at build time
export const getStaticProps: GetStaticComponentProps = async (rendering, layoutData) => {
  const navigationItems = await fetchNavigationData(layoutData.sitecore.context.language);
  return { navigationItems };
};

export default Navigation;
```

## GraphQL Patterns

### Query with Fragments

```graphql
# fragments/NavigationFields.graphql
fragment NavigationFields on Item {
  id
  name
  url {
    path
  }
  navigationTitle: field(name: "Navigation Title") {
    value
  }
}

# queries/GetNavigation.graphql
query GetNavigation($rootPath: String!, $language: String!) {
  item(path: $rootPath, language: $language) {
    children(hasLayout: true) {
      ...NavigationFields
      children {
        ...NavigationFields
      }
    }
  }
}
```

### Search Query

```graphql
query SearchArticles(
  $language: String!
  $category: String
  $first: Int = 10
  $after: String
) {
  search(
    where: {
      AND: [
        { name: "_language", value: $language }
        { name: "_templatename", value: "Article" }
        { name: "category", value: $category }
      ]
    }
    orderBy: { name: "date", direction: DESC }
    first: $first
    after: $after
  ) {
    pageInfo {
      hasNext
      endCursor
    }
    results {
      ... on Article {
        id
        title { value }
        summary { value }
        date { value }
        image {
          src
          alt
        }
      }
    }
  }
}
```

### GraphQL Client Setup

```typescript
// lib/graphql/client.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.GRAPH_QL_ENDPOINT!;
const apiKey = process.env.SITECORE_API_KEY!;

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'sc_apikey': apiKey,
  },
});

// lib/graphql/navigation.ts
import { graphqlClient } from './client';
import { GetNavigationDocument } from 'graphql/generated';

export async function fetchNavigationData(language: string) {
  try {
    const data = await graphqlClient.request(GetNavigationDocument, {
      rootPath: '/sitecore/content/site/home',
      language,
    });
    return data.item?.children ?? [];
  } catch (error) {
    console.error('Failed to fetch navigation:', error);
    return [];
  }
}
```

## Data Fetching Strategies

### Static Generation (SSG) - Default

```typescript
// Best for: Blog posts, marketing pages, documentation
export async function getStaticProps(context: GetStaticPropsContext) {
  const props = await sitecorePagePropsFactory.create(context);

  return {
    props,
    revalidate: 300, // ISR: regenerate every 5 minutes
  };
}

export async function getStaticPaths() {
  return {
    paths: [], // Generate on-demand
    fallback: 'blocking',
  };
}
```

### Server-Side Rendering (SSR)

```typescript
// Use for: Personalized content, real-time data
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props = await sitecorePagePropsFactory.create(context);

  // Set cache headers for Edge
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  return { props };
}
```

### Client-Side Data

```typescript
// Use for: User-specific data, frequently changing content
import useSWR from 'swr';

function UserDashboard() {
  const { data, error, isLoading } = useSWR('/api/user/dashboard', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage />;
  return <Dashboard data={data} />;
}
```

## Environment Configuration

```bash
# .env.local (never commit)
SITECORE_API_KEY=your-api-key-here
SITECORE_API_HOST=https://cm.your-instance.sitecorecloud.io
GRAPH_QL_ENDPOINT=https://edge.sitecorecloud.io/api/graphql/v1
JSS_EDITING_SECRET=your-editing-secret

# Public variables (safe to expose)
NEXT_PUBLIC_SITE_NAME=your-site
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_PUBLIC_URL=https://your-site.com
```

### Environment Validation

```typescript
// lib/config.ts
const requiredServerEnvs = [
  'SITECORE_API_KEY',
  'GRAPH_QL_ENDPOINT',
  'JSS_EDITING_SECRET',
] as const;

const requiredPublicEnvs = [
  'NEXT_PUBLIC_SITE_NAME',
] as const;

// Validate at startup
function validateEnv() {
  const missing: string[] = [];

  requiredServerEnvs.forEach(key => {
    if (!process.env[key]) missing.push(key);
  });

  requiredPublicEnvs.forEach(key => {
    if (!process.env[key]) missing.push(key);
  });

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

validateEnv();

export const config = {
  sitecoreApiKey: process.env.SITECORE_API_KEY!,
  graphqlEndpoint: process.env.GRAPH_QL_ENDPOINT!,
  siteName: process.env.NEXT_PUBLIC_SITE_NAME!,
};
```

## Personalization Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  PersonalizeMiddleware,
  RedirectsMiddleware,
  MultisiteMiddleware,
} from '@sitecore-jss/sitecore-jss-nextjs/middleware';

const personalizeMiddleware = new PersonalizeMiddleware({
  // Personalization configuration
  edgeConfig: {
    endpoint: process.env.GRAPH_QL_ENDPOINT!,
    apiKey: process.env.SITECORE_API_KEY!,
  },
  // CDP configuration if using
  cdpConfig: {
    endpoint: process.env.NEXT_PUBLIC_CDP_TARGET_URL,
    clientKey: process.env.NEXT_PUBLIC_CDP_CLIENT_KEY,
  },
});

const redirectsMiddleware = new RedirectsMiddleware({
  // Redirects configuration
});

export async function middleware(request: NextRequest) {
  // Run middleware chain
  let response = await personalizeMiddleware.getHandler()(request);
  if (response) return response;

  response = await redirectsMiddleware.getHandler()(request);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Image Optimization

```tsx
// For Sitecore-managed images (supports Experience Editor)
import { Image as JssImage } from '@sitecore-jss/sitecore-jss-nextjs';

<JssImage
  field={fields.image}
  width={800}
  height={600}
/>

// For static images with Next.js optimization
import NextImage from 'next/image';

<NextImage
  src="/images/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // For above-the-fold
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>

// Responsive Sitecore image
<JssImage
  field={fields.image}
  srcSet={[{ mw: 300 }, { mw: 600 }, { mw: 1200 }]}
  sizes="(max-width: 600px) 100vw, 50vw"
/>
```

## Error Handling

### Error Boundary

```tsx
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### GraphQL Error Handling

```typescript
export async function fetchWithErrorHandling<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T | null> {
  try {
    const response = await graphqlClient.request<T>(query, variables);
    return response;
  } catch (error) {
    if (error instanceof ClientError) {
      console.error('GraphQL errors:', error.response.errors);
      // Handle specific error types
      if (error.response.status === 401) {
        // Handle auth error
      }
    }
    console.error('Query failed:', error);
    return null;
  }
}
```

## Custom Hooks

### useNavigationData

```typescript
// hooks/useNavigation.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNavigationData } from 'lib/graphql/navigation';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

export function useNavigation() {
  const { sitecoreContext } = useSitecoreContext();
  const language = sitecoreContext.language || 'en';

  return useQuery({
    queryKey: ['navigation', language],
    queryFn: () => fetchNavigationData(language),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
```

### usePageContext

```typescript
// hooks/usePageContext.ts
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

export function usePageContext() {
  const { sitecoreContext } = useSitecoreContext();

  return {
    language: sitecoreContext.language || 'en',
    isEditing: sitecoreContext.pageEditing,
    route: sitecoreContext.route,
    site: sitecoreContext.site,
  };
}
```

## TypeScript Types

```typescript
// types/sitecore.ts
import { Field, ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ArticleFields {
  title: Field<string>;
  summary: Field<string>;
  body: Field<string>;
  image: ImageField;
  author: Field<string>;
  date: Field<string>;
  category: Field<string>;
}

export interface NavigationItem {
  id: string;
  name: string;
  url: string;
  title: string;
  children?: NavigationItem[];
}

export interface SearchResult<T> {
  results: T[];
  pageInfo: {
    hasNext: boolean;
    endCursor: string;
  };
  total: number;
}
```
