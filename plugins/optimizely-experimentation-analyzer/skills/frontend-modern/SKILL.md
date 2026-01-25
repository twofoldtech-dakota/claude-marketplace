---
name: frontend-modern
description: Modern frontend patterns for Optimizely Experimentation
---

# Modern Frontend Patterns for Experimentation

## Overview

This skill covers modern frontend patterns for implementing Optimizely Experimentation in React and Next.js applications.

## Custom Hooks

### useFeatureFlag Hook

```typescript
import { useDecision } from '@optimizely/react-sdk';

interface FeatureFlagResult<T = Record<string, unknown>> {
  isEnabled: boolean;
  isReady: boolean;
  variables: T;
}

function useFeatureFlag<T = Record<string, unknown>>(
  flagKey: string
): FeatureFlagResult<T> {
  const [decision, clientReady] = useDecision(flagKey);

  return {
    isReady: clientReady,
    isEnabled: decision.enabled,
    variables: decision.variables as T,
  };
}

// Usage
interface DarkModeVariables {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
}

function ThemeProvider({ children }) {
  const { isEnabled, isReady, variables } = useFeatureFlag<DarkModeVariables>('dark_mode');

  if (!isReady) return <Loading />;

  return (
    <ThemeContext.Provider value={isEnabled ? variables : defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### useExperiment Hook

```typescript
interface ExperimentResult {
  variation: string;
  isReady: boolean;
  isControl: boolean;
}

function useExperiment(experimentKey: string): ExperimentResult {
  const [decision, clientReady] = useDecision(experimentKey);

  return {
    isReady: clientReady,
    variation: decision.variationKey || 'control',
    isControl: decision.variationKey === 'control' || !decision.variationKey,
  };
}

// Usage
function CheckoutPage() {
  const { variation, isReady, isControl } = useExperiment('checkout_flow');

  if (!isReady) return <CheckoutSkeleton />;

  if (isControl) return <StandardCheckout />;

  return variation === 'express'
    ? <ExpressCheckout />
    : <SinglePageCheckout />;
}
```

## Next.js Integration

### App Router Provider

```tsx
// app/providers.tsx
'use client';

import { OptimizelyProvider, createInstance } from '@optimizely/react-sdk';
import { useEffect, useState } from 'react';

const optimizely = createInstance({
  sdkKey: process.env.NEXT_PUBLIC_OPTIMIZELY_SDK_KEY!,
});

export function ExperimentationProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    optimizely.onReady().then(() => setIsReady(true));
  }, []);

  return (
    <OptimizelyProvider
      optimizely={optimizely}
      user={{ id: userId }}
      timeout={500}
    >
      {children}
    </OptimizelyProvider>
  );
}
```

### Server Components with Experimentation

```tsx
// app/page.tsx
import { headers } from 'next/headers';
import { getOptimizelyDecision } from '@/lib/optimizely-server';

export default async function Page() {
  const headersList = headers();
  const userId = headersList.get('x-user-id') || 'anonymous';

  const decision = await getOptimizelyDecision('hero_experiment', userId);

  return (
    <main>
      {decision.variationKey === 'new_hero'
        ? <NewHero />
        : <StandardHero />}
    </main>
  );
}
```

## Testing Patterns

### Mock Setup

```typescript
// __mocks__/@optimizely/react-sdk.ts
export const useDecision = jest.fn();
export const OptimizelyProvider = ({ children }: { children: React.ReactNode }) => children;
export const createInstance = jest.fn();
```

### Test Variations

```typescript
import { render, screen } from '@testing-library/react';
import { useDecision } from '@optimizely/react-sdk';
import { CheckoutPage } from './CheckoutPage';

jest.mock('@optimizely/react-sdk');

describe('CheckoutPage', () => {
  it('renders control checkout', () => {
    (useDecision as jest.Mock).mockReturnValue([
      { variationKey: 'control', enabled: true, variables: {} },
      true,
    ]);

    render(<CheckoutPage />);
    expect(screen.getByText('Standard Checkout')).toBeInTheDocument();
  });

  it('renders express checkout variation', () => {
    (useDecision as jest.Mock).mockReturnValue([
      { variationKey: 'express', enabled: true, variables: {} },
      true,
    ]);

    render(<CheckoutPage />);
    expect(screen.getByText('Express Checkout')).toBeInTheDocument();
  });

  it('shows loading while SDK initializes', () => {
    (useDecision as jest.Mock).mockReturnValue([
      { variationKey: null, enabled: false, variables: {} },
      false,
    ]);

    render(<CheckoutPage />);
    expect(screen.getByTestId('checkout-skeleton')).toBeInTheDocument();
  });
});
```

## Error Boundaries

```tsx
class ExperimentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Experiment error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
<ExperimentErrorBoundary fallback={<ControlComponent />}>
  <ExperimentComponent />
</ExperimentErrorBoundary>
```

## Best Practices

1. **Create typed custom hooks** for consistency
2. **Handle loading states** with skeletons
3. **Use error boundaries** for resilience
4. **Test all variations** thoroughly
5. **Memoize decisions** when not using hooks
