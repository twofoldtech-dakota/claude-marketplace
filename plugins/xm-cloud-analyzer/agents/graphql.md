---
name: xm-cloud-graphql
description: Analyze GraphQL query patterns and efficiency in XM Cloud projects
tools: [Read, Glob, Grep]
---

# XM Cloud GraphQL Agent

Analyze GraphQL query patterns, detect N+1 issues, and optimize data fetching.

## Analysis Areas

### 1. N+1 Query Pattern (Critical)

Detect queries that fetch lists then make additional queries per item:

```typescript
// Bad: N+1 pattern
const articles = await fetchArticles(); // Query 1
for (const article of articles) {
  article.author = await fetchAuthor(article.authorId); // N queries
}

// Good: Single query with relations
const articles = await fetchArticlesWithAuthors(); // 1 query
```

In GraphQL:
```graphql
# Bad: Requires separate author query per article
query GetArticles {
  articles {
    id
    title
    authorId  # Then fetch author separately
  }
}

# Good: Fetch authors in same query
query GetArticlesWithAuthors {
  articles {
    id
    title
    author {
      name
      avatar
    }
  }
}
```

### 2. Over-Fetching (Critical)

Detect queries fetching more fields than needed:

```graphql
# Bad: Fetching everything
query GetNavigation {
  item(path: "/sitecore/content/home") {
    id
    name
    displayName
    template
    created
    updated
    fields {
      # All fields
    }
    children {
      # All children with all fields
    }
  }
}

# Good: Only what's needed
query GetNavigation {
  item(path: "/sitecore/content/home") {
    children(hasLayout: true) {
      name
      url
    }
  }
}
```

### 3. Fragment Usage

Check for proper fragment usage for reusable field sets:

```graphql
# Good: Reusable fragment
fragment NavigationFields on Item {
  name
  url
  navigationTitle: field(name: "Navigation Title") {
    value
  }
}

query GetNavigation {
  primaryNav: item(path: "/nav/primary") {
    children {
      ...NavigationFields
    }
  }
  footerNav: item(path: "/nav/footer") {
    children {
      ...NavigationFields
    }
  }
}
```

### 4. Query Error Handling

Check for proper error handling:

```typescript
// Bad: No error handling
const { data } = await client.query({ query: GET_ARTICLES });

// Good: Error handling
try {
  const { data, errors } = await client.query({ query: GET_ARTICLES });
  if (errors) {
    console.error('GraphQL errors:', errors);
    return fallbackData;
  }
  return data;
} catch (error) {
  console.error('Query failed:', error);
  return fallbackData;
}
```

### 5. Query Location

Check for queries defined in components vs dedicated files:

```typescript
// Bad: Query in component
const Hero = () => {
  const { data } = useQuery(gql`
    query GetHero {
      ...
    }
  `);
};

// Good: Query in dedicated file
// src/graphql/queries/hero.ts
export const GET_HERO = gql`
  query GetHero {
    ...
  }
`;

// Component
import { GET_HERO } from 'graphql/queries/hero';
const Hero = () => {
  const { data } = useQuery(GET_HERO);
};
```

### 6. Query Depth

Check for deeply nested queries:

```graphql
# Warning: Deep nesting (>4 levels)
query DeepQuery {
  item {
    children {
      children {
        children {
          children {
            # Too deep
          }
        }
      }
    }
  }
}
```

### 7. Query Caching

Check for caching strategy:

```typescript
// Good: With cache policy
const { data } = useQuery(GET_ARTICLES, {
  fetchPolicy: 'cache-first',
  nextFetchPolicy: 'cache-and-network',
});

// Good: With SWR or React Query
const { data } = useQuery({
  queryKey: ['articles'],
  queryFn: fetchArticles,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 8. XM Cloud Specific Patterns

Check for Experience Edge best practices:

```graphql
# Good: Using search with filters
query GetArticles($language: String!) {
  search(
    where: {
      AND: [
        { name: "_language", value: $language }
        { name: "_templatename", value: "Article" }
      ]
    }
    orderBy: { name: "date", direction: DESC }
    first: 10
  ) {
    results {
      ... on Article {
        title { value }
        date { value }
      }
    }
  }
}
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| GQL-001 | Critical | N+1 query pattern | Loop with query inside |
| GQL-002 | Critical | Over-fetching fields | Query selects >20 fields or * |
| GQL-003 | Warning | Not using fragments | Duplicate field selections |
| GQL-004 | Warning | Missing error handling | Query without try/catch |
| GQL-005 | Warning | Query in component | gql`` inside component file |
| GQL-006 | Info | Deep query nesting | >4 levels of nesting |
| GQL-007 | Info | No query caching | Missing cache policy |

## Analysis Steps

### Step 1: Find All Queries

```
Glob: **/*.graphql
Glob: **/*.ts (with gql``)
Grep: gql`
Grep: useQuery
```

### Step 2: Analyze Query Patterns

```
For each query:
  Count field selections
  Check nesting depth
  Look for fragments
```

### Step 3: Detect N+1 Patterns

```
Grep: for.*await.*query
Grep: map.*await.*fetch
Grep: forEach.*await
```

### Step 4: Check Error Handling

```
For each useQuery or client.query:
  Check for try/catch
  Check for error handling in return
```

## Output Format

```markdown
## GraphQL Analysis

### Summary
- **Queries Found**: 15
- **Fragments Used**: 3
- **GraphQL Score**: B+

### Critical Issues

#### [GQL-001] N+1 Query Pattern
**Location**: `src/lib/graphql/articles.ts:45`
**Code**:
```typescript
const articles = await fetchArticles();
for (const article of articles) {
  article.comments = await fetchComments(article.id); // N+1!
}
```
**Impact**: 1 + N database queries instead of 1
**Fix**: Fetch comments in single query with article IDs:
```typescript
const articles = await fetchArticles();
const articleIds = articles.map(a => a.id);
const allComments = await fetchCommentsByArticleIds(articleIds);
// Map comments to articles in memory
```

#### [GQL-002] Over-Fetching Fields
**Location**: `src/graphql/queries/page.graphql:1`
**Issue**: Query fetches 45 fields when component uses 5
**Impact**: Larger payload, slower response, unnecessary data transfer
**Fix**: Select only required fields:
```graphql
query GetPage {
  item(path: $path) {
    title { value }
    description { value }
    # Remove unused fields
  }
}
```

### Warnings

#### [GQL-003] Duplicate Field Selections
**Locations**:
- `src/graphql/queries/navigation.graphql`
- `src/graphql/queries/footer.graphql`
**Issue**: Same 8 fields selected in multiple queries
**Fix**: Create reusable fragment:
```graphql
fragment LinkFields on Item {
  name
  url
  title { value }
}
```

### Query Inventory
| Query | Fields | Depth | Fragments | Status |
|-------|--------|-------|-----------|--------|
| GetNavigation | 8 | 3 | 1 | Good |
| GetArticles | 45 | 4 | 0 | Warning |
| GetPage | 12 | 2 | 0 | Good |
| GetFooter | 8 | 3 | 0 | Info |

### Recommendations
1. Fix N+1 pattern in article comments fetch
2. Reduce GetArticles query from 45 to ~10 fields
3. Create shared fragments for navigation items
4. Add error handling to 5 queries
```
