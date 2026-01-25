---
name: frontend-modern
description: Modern frontend patterns for headless Optimizely CMS (React, Next.js)
---

# Modern Frontend Patterns

## Overview

This skill covers modern frontend patterns for headless Optimizely CMS implementations using React, Next.js, and the Content Delivery API.

## React Components

### Content Component

```tsx
import { useState, useEffect } from 'react';
import { ContentReference, IContent } from '@/types/optimizely';
import { contentApi } from '@/lib/content-api';

interface ArticleProps {
  contentLink: ContentReference;
}

export function Article({ contentLink }: ArticleProps) {
  const [article, setArticle] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await contentApi.get<ArticleContent>(contentLink);
        setArticle(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [contentLink]);

  if (loading) return <ArticleSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!article) return null;

  return (
    <article className="article">
      <h1>{article.heading}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.mainBody }} />
    </article>
  );
}
```

### Block Renderer

```tsx
import dynamic from 'next/dynamic';
import { BlockContent } from '@/types/optimizely';

const blockComponents: Record<string, React.ComponentType<any>> = {
  HeroBlock: dynamic(() => import('./blocks/HeroBlock')),
  TeaserBlock: dynamic(() => import('./blocks/TeaserBlock')),
  TextBlock: dynamic(() => import('./blocks/TextBlock')),
  ImageBlock: dynamic(() => import('./blocks/ImageBlock')),
};

interface BlockRendererProps {
  block: BlockContent;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const Component = blockComponents[block.contentType];

  if (!Component) {
    console.warn(`Unknown block type: ${block.contentType}`);
    return null;
  }

  return <Component {...block} />;
}
```

### Content Area Component

```tsx
import { ContentArea as ContentAreaType } from '@/types/optimizely';
import { BlockRenderer } from './BlockRenderer';

interface ContentAreaProps {
  area: ContentAreaType | null;
  className?: string;
}

export function ContentArea({ area, className }: ContentAreaProps) {
  if (!area?.items?.length) return null;

  return (
    <div className={className}>
      {area.items.map((item, index) => (
        <BlockRenderer key={item.contentLink.id || index} block={item} />
      ))}
    </div>
  );
}
```

## Next.js Integration

### Page Component (App Router)

```tsx
// app/[...slug]/page.tsx
import { notFound } from 'next/navigation';
import { contentApi } from '@/lib/content-api';
import { PageRenderer } from '@/components/PageRenderer';

interface PageProps {
  params: { slug: string[] };
}

export async function generateMetadata({ params }: PageProps) {
  const path = '/' + (params.slug?.join('/') || '');
  const page = await contentApi.getByUrl(path);

  if (!page) return {};

  return {
    title: page.metaTitle || page.name,
    description: page.metaDescription,
  };
}

export default async function Page({ params }: PageProps) {
  const path = '/' + (params.slug?.join('/') || '');
  const page = await contentApi.getByUrl(path);

  if (!page) {
    notFound();
  }

  return <PageRenderer page={page} />;
}
```

### Content API Client

```typescript
// lib/content-api.ts
const API_BASE = process.env.OPTIMIZELY_API_URL;
const API_KEY = process.env.OPTIMIZELY_API_KEY;

class ContentApiClient {
  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(contentLink: ContentReference): Promise<T> {
    return this.fetch<T>(`/content/${contentLink.id}`);
  }

  async getByUrl<T>(url: string): Promise<T | null> {
    try {
      return await this.fetch<T>(`/content?url=${encodeURIComponent(url)}`);
    } catch {
      return null;
    }
  }

  async getChildren<T>(parentLink: ContentReference): Promise<T[]> {
    return this.fetch<T[]>(`/content/${parentLink.id}/children`);
  }
}

export const contentApi = new ContentApiClient();
```

## GraphQL Integration

### Apollo Client Setup

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.OPTIMIZELY_GRAPHQL_URL,
  headers: {
    'Authorization': `Bearer ${process.env.OPTIMIZELY_API_KEY}`,
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### GraphQL Query Hook

```tsx
import { gql, useQuery } from '@apollo/client';

const GET_ARTICLE = gql`
  query GetArticle($id: Int!) {
    ArticlePage(id: $id) {
      name
      heading
      mainBody {
        html
      }
      heroImage {
        url
      }
      publishedDate
    }
  }
`;

export function useArticle(id: number) {
  return useQuery(GET_ARTICLE, {
    variables: { id },
  });
}
```

## TypeScript Types

### Content Types

```typescript
// types/optimizely.ts
export interface ContentReference {
  id: number;
  workId?: number;
  guidValue?: string;
}

export interface IContent {
  contentLink: ContentReference;
  name: string;
  contentType: string[];
}

export interface PageData extends IContent {
  url: string;
  parentLink: ContentReference;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ArticleContent extends PageData {
  heading: string;
  mainBody: string;
  publishedDate?: string;
  heroImage?: ImageReference;
  mainContentArea?: ContentAreaItem[];
}

export interface BlockData extends IContent {
  // Block-specific properties
}

export interface ContentAreaItem {
  contentLink: ContentReference;
  displayOption?: string;
}

export interface ImageReference {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}
```

## State Management

### Content Store (Zustand)

```typescript
import { create } from 'zustand';
import { contentApi } from '@/lib/content-api';

interface ContentStore {
  pages: Map<number, PageData>;
  loading: boolean;
  error: Error | null;
  fetchPage: (id: number) => Promise<void>;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  pages: new Map(),
  loading: false,
  error: null,

  fetchPage: async (id: number) => {
    if (get().pages.has(id)) return;

    set({ loading: true, error: null });

    try {
      const page = await contentApi.get<PageData>({ id });
      set((state) => ({
        pages: new Map(state.pages).set(id, page),
        loading: false,
      }));
    } catch (error) {
      set({ error: error as Error, loading: false });
    }
  },
}));
```

## Best Practices

1. **Use TypeScript** for type safety with CMS content
2. **Implement ISR** for optimal performance
3. **Handle loading and error states** gracefully
4. **Use dynamic imports** for block components
5. **Cache API responses** appropriately
6. **Validate content** before rendering
