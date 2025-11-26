# Phase 9F1: AppContext API Integration

**Part of Phase 9F: Connect Frontend to Backend APIs**

---

## Objective

Update `AppContext.tsx` to fetch data from backend APIs instead of using mock constants, establishing the foundation for all feature components to access real data.

---

## What You'll Build

Transform AppContext from using hardcoded mock data to fetching real data from backend APIs with:
- Loading states for each data type
- Error handling for failed requests
- Data refresh functions
- Optimistic updates support
- User-specific data filtering

---

## Current vs Target State

### Current AppContext (Mock Data)

```typescript
// src/app/_components/AppContext.tsx
import { INITIAL_POSTS, INITIAL_ACCOUNTS } from "@/utils/constants";

export function AppContextProvider({ children }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  
  // Mock data, no loading states, no errors
  
  return <AppContext.Provider value={{ posts, accounts, ... }}>
    {children}
  </AppContext.Provider>;
}
```

### Target AppContext (Real APIs)

```typescript
// src/app/_components/AppContext.tsx
export function AppContextProvider({ children }) {
  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  
  // Loading states
  const [postsLoading, setPostsLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  
  // Error states
  const [postsError, setPostsError] = useState<string | null>(null);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  
  // Fetch data on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
  }, []);
  
  // Fetch functions with error handling
  const fetchPosts = async () => { /* ... */ };
  const fetchAccounts = async () => { /* ... */ };
  
  return <AppContext.Provider value={{
    posts, postsLoading, postsError, refetchPosts: fetchPosts,
    accounts, accountsLoading, accountsError, refetchAccounts: fetchAccounts,
    ...
  }}>
    {children}
  </AppContext.Provider>;
}
```

---

## Implementation Steps

### Step 1: Read Current AppContext

First, locate and examine the current AppContext implementation:

```bash
# File location
src/app/_components/AppContext.tsx
```

**What to look for**:
- Current state initialization with INITIAL_* constants
- Props passed to AppContextProvider
- Context value object structure
- Functions provided to consumers (onPostCreated, etc.)

### Step 2: Add API Fetch Pattern

Add a reusable fetch pattern for all API calls:

```typescript
// Helper function for API calls with error handling
const fetchAPI = async <T,>(
  url: string,
  setData: (data: T) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  dataKey: string
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(url, {
      credentials: 'include', // Include cookies for auth
    });
    
    // Handle authentication errors
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    setData(result[dataKey]);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    setError(error instanceof Error ? error.message : 'Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

### Step 3: Update Posts State

Replace mock posts with API-fetched posts:

```typescript
// Replace this:
const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

// With this:
const [posts, setPosts] = useState<Post[]>([]);
const [postsLoading, setPostsLoading] = useState(true);
const [postsError, setPostsError] = useState<string | null>(null);

// Add fetch function
const fetchPosts = useCallback(async () => {
  await fetchAPI<Post[]>(
    '/api/posts?limit=100',
    setPosts,
    setPostsLoading,
    setPostsError,
    'posts'
  );
}, []);

// Fetch on mount
useEffect(() => {
  fetchPosts();
}, [fetchPosts]);
```

### Step 4: Update Accounts State

Replace mock accounts with API-fetched accounts:

```typescript
// Replace this:
const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);

// With this:
const [accounts, setAccounts] = useState<SocialAccount[]>([]);
const [accountsLoading, setAccountsLoading] = useState(true);
const [accountsError, setAccountsError] = useState<string | null>(null);

// Add fetch function
const fetchAccounts = useCallback(async () => {
  await fetchAPI<SocialAccount[]>(
    '/api/accounts',
    setAccounts,
    setAccountsLoading,
    setAccountsError,
    'accounts'
  );
}, []);

// Fetch on mount
useEffect(() => {
  fetchAccounts();
}, [fetchAccounts]);
```

### Step 5: Update Context Value

Add new loading/error states and refetch functions to context value:

```typescript
const value = {
  // Posts
  posts,
  postsLoading,
  postsError,
  setPosts,
  refetchPosts: fetchPosts,
  
  // Accounts
  accounts,
  accountsLoading,
  accountsError,
  setAccounts,
  refetchAccounts: fetchAccounts,
  
  // Existing callbacks (keep these)
  showToast,
  onPostCreated,
  onUpdatePost,
  onDeletePost,
  onCompose,
  onToggleAccount,
  onOpenUpgrade,
  
  // User plan (keep existing)
  userPlan,
  
  // Branding (keep existing)
  branding,
};
```

### Step 6: Update Type Definition

Update the AppContextType interface:

```typescript
interface AppContextType {
  // Posts
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  setPosts: (posts: Post[]) => void;
  refetchPosts: () => Promise<void>;
  
  // Accounts
  accounts: SocialAccount[];
  accountsLoading: boolean;
  accountsError: string | null;
  setAccounts: (accounts: SocialAccount[]) => void;
  refetchAccounts: () => Promise<void>;
  
  // Callbacks (existing)
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onPostCreated: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onCompose: (draft?: Draft) => void;
  onToggleAccount: (accountId: string) => void;
  onOpenUpgrade: () => void;
  
  // User (existing)
  userPlan: PlanTier;
  
  // Branding (existing)
  branding: BrandingConfig;
}
```

---

## Complete Updated AppContext

Here's the full updated AppContext.tsx:

```typescript
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Post, SocialAccount, Draft, PlanTier, BrandingConfig } from '@/types';

interface AppContextType {
  // Posts
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  setPosts: (posts: Post[]) => void;
  refetchPosts: () => Promise<void>;
  
  // Accounts
  accounts: SocialAccount[];
  accountsLoading: boolean;
  accountsError: string | null;
  setAccounts: (accounts: SocialAccount[]) => void;
  refetchAccounts: () => Promise<void>;
  
  // Callbacks
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onPostCreated: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onCompose: (draft?: Draft) => void;
  onToggleAccount: (accountId: string) => void;
  onOpenUpgrade: () => void;
  
  // User
  userPlan: PlanTier;
  
  // Branding
  branding: BrandingConfig;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}

interface AppContextProviderProps {
  children: ReactNode;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onOpenUpgrade: () => void;
}

// Helper function for API calls
const fetchAPI = async <T,>(
  url: string,
  setData: (data: T) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  dataKey: string
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(url, {
      credentials: 'include',
    });
    
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    setData(result[dataKey]);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    setError(error instanceof Error ? error.message : 'Failed to load data');
  } finally {
    setLoading(false);
  }
};

export function AppContextProvider({ 
  children, 
  showToast, 
  onOpenUpgrade 
}: AppContextProviderProps) {
  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  
  // Accounts state
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  
  // User plan (can be fetched from API later)
  const [userPlan] = useState<PlanTier>('free');
  
  // Branding (can be fetched from API later)
  const [branding] = useState<BrandingConfig>({
    primaryColor: '#3b82f6',
    logo: '',
    companyName: 'SocialFlow',
  });
  
  // Fetch functions
  const fetchPosts = useCallback(async () => {
    await fetchAPI<Post[]>(
      '/api/posts?limit=100',
      setPosts,
      setPostsLoading,
      setPostsError,
      'posts'
    );
  }, []);
  
  const fetchAccounts = useCallback(async () => {
    await fetchAPI<SocialAccount[]>(
      '/api/accounts',
      setAccounts,
      setAccountsLoading,
      setAccountsError,
      'accounts'
    );
  }, []);
  
  // Fetch data on mount
  useEffect(() => {
    fetchPosts();
    fetchAccounts();
  }, [fetchPosts, fetchAccounts]);
  
  // Post mutation callbacks
  const handlePostCreated = useCallback((newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    showToast('Post created successfully', 'success');
  }, [showToast]);
  
  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    showToast('Post updated successfully', 'success');
  }, [showToast]);
  
  const handleDeletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Post deleted successfully', 'success');
  }, [showToast]);
  
  // Account mutation callback
  const handleToggleAccount = useCallback((accountId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId 
        ? { ...acc, connected: !acc.connected }
        : acc
    ));
  }, []);
  
  // Composer callback (handled by parent)
  const handleCompose = useCallback((draft?: Draft) => {
    // This will be handled by the parent component (AppShell)
    console.log('Compose requested:', draft);
  }, []);
  
  const value: AppContextType = {
    // Posts
    posts,
    postsLoading,
    postsError,
    setPosts,
    refetchPosts: fetchPosts,
    
    // Accounts
    accounts,
    accountsLoading,
    accountsError,
    setAccounts,
    refetchAccounts: fetchAccounts,
    
    // Callbacks
    showToast,
    onPostCreated: handlePostCreated,
    onUpdatePost: handleUpdatePost,
    onDeletePost: handleDeletePost,
    onCompose: handleCompose,
    onToggleAccount: handleToggleAccount,
    onOpenUpgrade,
    
    // User
    userPlan,
    
    // Branding
    branding,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

---

## Testing

### Test 1: Verify API Calls

Open browser DevTools Network tab and check:

```
✓ GET /api/posts called on page load
✓ GET /api/accounts called on page load
✓ Both return 200 OK status
✓ Response contains expected data structure
```

### Test 2: Check Loading States

```typescript
// In Dashboard or any feature component
const { postsLoading, accountsLoading } = useAppContext();

console.log('Posts loading:', postsLoading);
console.log('Accounts loading:', accountsLoading);

// Should log:
// Posts loading: true (initially)
// Posts loading: false (after data loads)
```

### Test 3: Verify Error Handling

Temporarily break API endpoint to test error handling:

```typescript
// Change URL to non-existent endpoint
'/api/posts-broken'

// Should see:
// - postsError is set with error message
// - Error logged to console
// - No crash, app continues running
```

### Test 4: Test Data Refresh

```typescript
// Add a refresh button in Dashboard
<button onClick={refetchPosts}>
  Refresh Posts
</button>

// Click button, verify:
// - postsLoading becomes true
// - API called again
// - New data loaded
// - postsLoading becomes false
```

---

## Verification Checklist

After implementation, verify:

- [ ] No imports of INITIAL_POSTS or INITIAL_ACCOUNTS in AppContext
- [ ] Posts load from /api/posts on component mount
- [ ] Accounts load from /api/accounts on component mount
- [ ] Loading states work correctly (true → false)
- [ ] Error messages display for failed requests
- [ ] refetchPosts() and refetchAccounts() functions work
- [ ] No TypeScript errors in AppContext.tsx
- [ ] No console errors on page load (except expected 401 if not logged in)
- [ ] Browser Network tab shows successful API calls
- [ ] Data persists on page refresh

---

## Troubleshooting

### Issue: "Cannot read property 'posts' of undefined"

**Cause**: Component using useAppContext() outside of AppContextProvider

**Solution**: Ensure AppContextProvider wraps the component tree in layout.tsx

### Issue: Infinite API calls / loop

**Cause**: Missing dependency array or incorrect useEffect dependencies

**Solution**: 
```typescript
// Bad - infinite loop
useEffect(() => {
  fetchPosts();
});

// Good - runs once
useEffect(() => {
  fetchPosts();
}, [fetchPosts]);
```

### Issue: Data not updating after mutation

**Cause**: setPosts not called after API mutation

**Solution**: Call setPosts or refetchPosts after create/update/delete operations

### Issue: 401 Unauthorized errors

**Cause**: User not logged in or session expired

**Solution**: Verify user is logged in, check cookies in DevTools

---

## Next Steps

1. ✅ AppContext updated to use APIs
2. → Continue to `phase9f2_posts_migration.md` - Test posts thoroughly
3. → Continue to `phase9f3_accounts_migration.md` - Test accounts thoroughly

---

**Implementation Time**: ~45 minutes

**Status**: Foundation complete, ready for feature-specific testing
