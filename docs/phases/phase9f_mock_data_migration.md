# Phase 9F: Mock Data Migration

**Objective**: Replace all mock data (INITIAL_* constants) with real API calls, connecting the frontend to the backend.

**Estimated Time**: 3-4 hours

**Prerequisites**:
- Phases 9A-9E complete (Backend APIs functional)
- All API endpoints tested and working
- Database seeded with test data

---

## Overview

This phase removes all hardcoded mock data from the frontend and connects components to real backend APIs. This is the critical integration phase that transforms the prototype into a fully functional application.

**What Gets Migrated**:
- `INITIAL_POSTS` → `/api/posts`
- `INITIAL_ACCOUNTS` → `/api/accounts`
- `MOCK_*` constants → Real API endpoints
- Client-side state → Server-synchronized state

**Migration Strategy**:
1. Create API client utilities
2. Add loading and error states
3. Replace useState with API calls
4. Update AppContext to fetch from APIs
5. Remove all mock data constants
6. Test each feature integration

---

## Step 1: Create API Client Utility

Create `src/lib/api-client.ts`:

```typescript
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Include cookies for auth
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0);
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'POST', body }),
  
  patch: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body }),
  
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
```

---

## Step 2: Create Data Fetching Hooks

Create `src/hooks/useApi.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '@/lib/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (error) {
      const message = error instanceof ApiError
        ? error.message
        : 'An error occurred';
      setState({ data: null, loading: false, error: message });
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
  }, deps);

  return { ...state, refetch };
}

export function useMutation<T, Args = any>(
  mutator: (args: Args) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (args: Args) => {
      setState({ data: null, loading: true, error: null });
      
      try {
        const data = await mutator(args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const message = error instanceof ApiError
          ? error.message
          : 'An error occurred';
        setState({ data: null, loading: false, error: message });
        throw error;
      }
    },
    [mutator]
  );

  return { ...state, mutate };
}
```

---

## Step 3: Update AppContext with API Calls

Update `src/app/_components/AppContext.tsx`:

```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, SocialAccount, Draft, ToastType, PlanTier, BrandingConfig } from "@/types";
import { api } from "@/lib/api-client";

interface AppContextType {
  // State
  posts: Post[];
  accounts: SocialAccount[];
  userPlan: PlanTier;
  branding: BrandingConfig;
  initialDraft?: Draft;
  
  // Loading states
  postsLoading: boolean;
  accountsLoading: boolean;

  // Setters
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setAccounts: React.Dispatch<React.SetStateAction<SocialAccount[]>>;
  
  // Actions
  showToast: (message: string, type: ToastType) => void;
  onPostCreated: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onCompose: (draft?: Draft) => void;
  onToggleAccount: (id: string) => void;
  onOpenUpgrade: () => void;
  
  // Refetch functions
  refetchPosts: () => Promise<void>;
  refetchAccounts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: React.ReactNode;
  showToast: (message: string, type: ToastType) => void;
  onOpenUpgrade: () => void;
}

export function AppContextProvider({
  children,
  showToast,
  onOpenUpgrade,
}: AppProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<PlanTier>("free");
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>();
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "SocialFlow Agency",
    primaryColor: "#4f46e5",
    logoUrl: "",
    removeWatermark: false,
    customDomain: "social.myagency.com",
  });

  // Fetch posts on mount
  const refetchPosts = async () => {
    setPostsLoading(true);
    try {
      const data = await api.get<{ posts: Post[] }>('/api/posts');
      setPosts(data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      showToast('Failed to load posts', 'error');
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch accounts on mount
  const refetchAccounts = async () => {
    setAccountsLoading(true);
    try {
      const data = await api.get<{ accounts: SocialAccount[] }>('/api/accounts');
      setAccounts(data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      showToast('Failed to load accounts', 'error');
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    refetchPosts();
    refetchAccounts();
  }, []);

  // Handlers
  const handlePostCreated = async (newPost: Post) => {
    try {
      const data = await api.post<{ post: Post }>('/api/posts', newPost);
      setPosts((prev) => [...prev, data.post]);
      showToast('Post created successfully', 'success');
    } catch (error) {
      console.error('Failed to create post:', error);
      showToast('Failed to create post', 'error');
    }
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      const data = await api.patch<{ post: Post }>(
        `/api/posts/${updatedPost.id}`,
        updatedPost
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === data.post.id ? data.post : p))
      );
      showToast('Post updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update post:', error);
      showToast('Failed to update post', 'error');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast('Post deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete post:', error);
      showToast('Failed to delete post', 'error');
    }
  };

  const handleCompose = (draft?: Draft) => {
    setInitialDraft(draft);
  };

  const handleToggleAccount = async (id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    if (!account) return;

    try {
      await api.patch(`/api/accounts/${id}`, {
        connected: !account.connected,
      });
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id ? { ...acc, connected: !acc.connected } : acc
        )
      );
    } catch (error) {
      console.error('Failed to toggle account:', error);
      showToast('Failed to update account', 'error');
    }
  };

  const value: AppContextType = {
    posts,
    accounts,
    userPlan,
    branding,
    initialDraft,
    postsLoading,
    accountsLoading,
    setPosts,
    setAccounts,
    showToast,
    onPostCreated: handlePostCreated,
    onUpdatePost: handleUpdatePost,
    onDeletePost: handleDeletePost,
    onCompose: handleCompose,
    onToggleAccount: handleToggleAccount,
    onOpenUpgrade,
    refetchPosts,
    refetchAccounts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

## Step 4: Add Loading States to Pages

Update `src/app/page.tsx` (Dashboard):

```typescript
'use client';

import { useAppContext } from './_components/AppContext';
import { Dashboard } from '@/features/dashboard/Dashboard';

export default function DashboardPage() {
  const {
    posts,
    accounts,
    postsLoading,
    accountsLoading,
    showToast,
    onPostCreated,
    onCompose,
  } = useAppContext();

  if (postsLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      posts={posts}
      accounts={accounts}
      showToast={showToast}
      onPostCreated={onPostCreated}
      onCompose={onCompose}
    />
  );
}
```

---

## Step 5: Remove Mock Data Constants

Delete or comment out `src/utils/constants.ts`:

```typescript
// This file is deprecated - all data now comes from API endpoints
// Keep only type definitions if needed, remove all INITIAL_*, MOCK_* exports

export const AI_TEMPLATES = [
  { id: "pas", name: "Problem-Agitate-Solve", label: "PAS Framework" },
  { id: "aida", name: "Attention-Interest-Desire-Action", label: "AIDA Framework" },
  { id: "story", name: "Storytelling", label: "Hero's Journey" },
  { id: "viral", name: "Viral Hook", label: "Controversial/Viral" },
];

export const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
];

// All other constants removed - fetch from API instead
```

---

## Step 6: Update Feature Hooks to Use APIs

Example for `src/features/dashboard/useDashboard.ts`:

```typescript
import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import type { Trend } from '@/types';

export function useDashboard(niche: string) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const loadTrends = async () => {
    setLoadingTrends(true);
    try {
      // This calls the Gemini AI service via your backend
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche }),
      });
      const data = await response.json();
      setTrends(data.trends);
    } catch (error) {
      console.error('Failed to load trends:', error);
    } finally {
      setLoadingTrends(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, [niche]);

  return {
    trends,
    loadingTrends,
    loadTrends,
  };
}
```

---

## Step 7: Error Boundary Component

Create `src/components/ErrorBoundary.tsx`:

```typescript
'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4 p-8 max-w-md">
              <h2 className="text-2xl font-bold text-red-600">
                Something went wrong
              </h2>
              <p className="text-gray-600">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Add to layout**:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## Step 8: Migration Checklist

### Posts Migration
- [ ] Replace `INITIAL_POSTS` with API call
- [ ] Update post creation to use POST `/api/posts`
- [ ] Update post editing to use PATCH `/api/posts/:id`
- [ ] Update post deletion to use DELETE `/api/posts/:id`
- [ ] Add loading states to Calendar
- [ ] Add error handling

### Accounts Migration
- [ ] Replace `INITIAL_ACCOUNTS` with API call
- [ ] Connect OAuth flows to API
- [ ] Update account toggle logic
- [ ] Add loading states to Settings
- [ ] Handle disconnection errors

### Media Migration
- [ ] Remove `MOCK_ASSETS_INIT`
- [ ] Connect FileUpload component to API
- [ ] Update Library to fetch from `/api/media`
- [ ] Handle upload progress
- [ ] Add error states

### Analytics Migration
- [ ] Remove mock analytics data
- [ ] Fetch from `/api/analytics`
- [ ] Update charts with real data
- [ ] Add date range filtering
- [ ] Handle empty states

---

## Step 9: Testing Integration

### 1. Test Full User Flow

```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 2. Login
# (Open browser and login)

# 3. Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello!","platforms":["TWITTER"],"accountIds":["..."]}'

# 4. Fetch posts
curl http://localhost:3000/api/posts \
  -H "Cookie: next-auth.session-token=..."
```

### 2. Test Error Handling

- Disconnect from internet → Should show error message
- Invalid auth token → Should redirect to login
- Server error → Should show error boundary

### 3. Test Loading States

- Slow network → Should show loading spinner
- Empty data → Should show empty state
- Large dataset → Should handle pagination

---

## Common Migration Issues

### Issue 1: CORS Errors

**Solution**: Ensure `credentials: 'include'` in fetch requests

### Issue 2: State Not Updating

**Solution**: Use refetch functions after mutations

### Issue 3: Infinite Loading

**Solution**: Check API endpoints return correct status codes

### Issue 4: Type Mismatches

**Solution**: Ensure Prisma types match frontend types

---

## Performance Optimization

### 1. Implement Request Caching

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

export async function cachedApi<T>(
  endpoint: string,
  ttl: number = 60000 // 1 minute
): Promise<T> {
  const cached = cache.get(endpoint);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await api.get<T>(endpoint);
  cache.set(endpoint, { data, timestamp: now });
  return data;
}
```

### 2. Add Request Debouncing

```typescript
import { useCallback, useRef } from 'react';

export function useDebouncedApi<T>(
  fetcher: () => Promise<T>,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return new Promise<T>((resolve, reject) => {
      timeoutRef.current = setTimeout(async () => {
        try {
          const data = await fetcher();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }, [fetcher, delay]);
}
```

---

## Next Steps

**Phase 9G**: Real-time Features
- WebSocket setup for notifications
- Live post updates
- Real-time collaboration

---

## Verification Checklist

- [ ] All INITIAL_* constants removed
- [ ] All MOCK_* constants removed
- [ ] AppContext fetches from APIs
- [ ] Loading states added to all pages
- [ ] Error handling implemented
- [ ] Error boundary in place
- [ ] API client utility created
- [ ] Custom hooks using real APIs
- [ ] Full user flow tested
- [ ] No console errors

**Time Spent**: ___ hours

**Notes**:
