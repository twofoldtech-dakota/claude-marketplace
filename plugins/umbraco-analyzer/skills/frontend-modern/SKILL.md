---
name: frontend-modern
description: Apply when working with modern frontend frameworks including React, Vue, Next.js, and TypeScript
globs:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.vue"
  - "**/tailwind.config.*"
  - "**/next.config.*"
  - "**/vite.config.*"
  - "!**/node_modules/**"
---

# Modern Frontend Development Patterns

## React Component Patterns

### Functional Components

```tsx
import { useState, useEffect } from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const Card = ({ title, description, imageUrl, onClick }: CardProps) => {
  return (
    <article className="card" onClick={onClick}>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="card__image" />
      )}
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
      </div>
    </article>
  );
};
```

### Component with Children

```tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Container = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: ContainerProps) => {
  return (
    <Component className={`container ${className}`}>
      {children}
    </Component>
  );
};
```

### Compound Components

```tsx
interface AccordionContextType {
  openItems: string[];
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export const Accordion = ({ children }: { children: React.ReactNode }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = ({ id, title, children }: { 
  id: string; 
  title: string; 
  children: React.ReactNode;
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion.Item must be used within Accordion');
  
  const isOpen = context.openItems.includes(id);

  return (
    <div className="accordion__item">
      <button 
        className="accordion__trigger"
        onClick={() => context.toggle(id)}
        aria-expanded={isOpen}
      >
        {title}
      </button>
      {isOpen && (
        <div className="accordion__content">{children}</div>
      )}
    </div>
  );
};
```

## React Hooks

### useState

```tsx
// Simple state
const [count, setCount] = useState(0);

// Object state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

// Update object state immutably
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

// Functional update (when new state depends on previous)
setCount(prev => prev + 1);
```

### useEffect

```tsx
// Run on mount only
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);

// Run when dependency changes
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Cleanup pattern
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData);
    
  return () => controller.abort();
}, []);
```

### useMemo and useCallback

```tsx
// Memoize expensive computation
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Memoize callback for child components
const handleClick = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// Pass to optimized child
<List items={items} onItemClick={handleClick} />
```

### Custom Hooks

```tsx
// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// useFetch
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

## Next.js Patterns

### Page Components (App Router)

```tsx
// app/products/page.tsx
import { getProducts } from '@/lib/api';

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <main>
      <h1>Products</h1>
      <ProductList products={products} />
    </main>
  );
}

// Metadata
export const metadata = {
  title: 'Products',
  description: 'Browse our product catalog',
};
```

### Dynamic Routes

```tsx
// app/products/[slug]/page.tsx
import { getProduct, getProducts } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetail product={product} />;
}

// Generate static params at build time
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({ slug: product.slug }));
}

// Dynamic metadata
export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.slug);
  
  return {
    title: product?.name ?? 'Product Not Found',
    description: product?.description,
  };
}
```

### Server vs Client Components

```tsx
// Server Component (default) - can fetch data directly
// app/components/ProductList.tsx
import { getProducts } from '@/lib/api';

export async function ProductList() {
  const products = await getProducts(); // Direct data fetch
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Client Component - for interactivity
// app/components/AddToCartButton.tsx
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    await addToCart(productId);
    setIsLoading(false);
  };
  
  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### API Routes

```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  
  const products = await db.products.findMany({
    where: category ? { category } : undefined,
  });
  
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const product = await db.products.create({
    data: body,
  });
  
  return NextResponse.json(product, { status: 201 });
}
```

## Vue.js Patterns

### Composition API

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Product {
  id: string;
  name: string;
  price: number;
}

const props = defineProps<{
  initialProducts: Product[];
}>();

const emit = defineEmits<{
  (e: 'select', product: Product): void;
}>();

const products = ref<Product[]>(props.initialProducts);
const searchQuery = ref('');

const filteredProducts = computed(() => {
  return products.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleSelect = (product: Product) => {
  emit('select', product);
};

onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div class="product-list">
    <input v-model="searchQuery" placeholder="Search products..." />
    <ul>
      <li 
        v-for="product in filteredProducts" 
        :key="product.id"
        @click="handleSelect(product)"
      >
        {{ product.name }} - ${{ product.price }}
      </li>
    </ul>
  </div>
</template>
```

### Composables

```ts
// composables/useProducts.ts
import { ref, onMounted } from 'vue';

export function useProducts() {
  const products = ref<Product[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchProducts = async () => {
    loading.value = true;
    try {
      const response = await fetch('/api/products');
      products.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchProducts);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}
```

## TypeScript Patterns

### Interface vs Type

```typescript
// Interfaces - extensible, good for objects
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Types - for unions, intersections, primitives
type Status = 'pending' | 'active' | 'completed';
type ID = string | number;
type UserWithStatus = User & { status: Status };
```

### Generics

```typescript
// Generic function
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic component props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

### Utility Types

```typescript
// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude properties
type UserWithoutEmail = Omit<User, 'email'>;

// Partial - make all properties optional
type UserUpdate = Partial<User>;

// Required - make all properties required
type RequiredUser = Required<User>;

// Record - object with specific key/value types
type UserMap = Record<string, User>;

// Readonly - make all properties readonly
type ImmutableUser = Readonly<User>;
```

## Modern CSS

### CSS Modules

```tsx
// styles/Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.primary {
  background: var(--color-primary);
  color: white;
}

.secondary {
  background: transparent;
  border: 1px solid var(--color-primary);
}

// Button.tsx
import styles from './Button.module.css';

export const Button = ({ variant = 'primary', children }) => (
  <button className={`${styles.button} ${styles[variant]}`}>
    {children}
  </button>
);
```

### Tailwind CSS

```tsx
// Utility classes
export const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="text-gray-600">{children}</div>
  </div>
);

// With @apply in CSS
/* styles.css */
.btn {
  @apply px-4 py-2 rounded font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

### CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #0066cc;
  --color-primary-dark: #004999;
  --color-secondary: #6c757d;
  
  /* Typography */
  --font-family-base: 'Inter', sans-serif;
  --font-size-base: 1rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #4da6ff;
    --color-background: #1a1a1a;
    --color-text: #ffffff;
  }
}
```

## State Management

### React Context

```tsx
// context/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### Zustand (Lightweight State)

```typescript
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  clearCart: () => set({ items: [] }),
  
  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
}));
```

## Data Fetching

### React Query / TanStack Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch query
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation with cache invalidation
function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newProduct: CreateProductInput) =>
      fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

### SWR

```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useProducts() {
  const { data, error, isLoading, mutate } = useSWR('/api/products', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 30000,
  });
  
  return {
    products: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
```

## Error Handling

### Error Boundaries

```tsx
'use client';

import { Component, ReactNode } from 'react';

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Async Error Handling

```tsx
// With try-catch
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fetch failed:', error.message);
    }
    throw error;
  }
}

// Result pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, error: new Error(`HTTP ${response.status}`) };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```
