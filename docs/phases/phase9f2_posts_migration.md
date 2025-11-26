# Phase 9F2: Posts Migration & Testing

**Part of Phase 9F: Connect Frontend to Backend APIs**

---

## Objective

Verify that posts data flows correctly from database → API → Context → Components throughout all features that display or manipulate posts.

---

## Features Using Posts Data

1. **Dashboard** - Recent posts, upcoming posts, quick stats
2. **Composer** - Draft editing (loads existing post)
3. **Calendar** - All views (grid, list, kanban)
4. **Analytics** - Post performance metrics
5. **Library** - Saved post templates

---

## Implementation Steps

### Step 1: Verify API is Working

```bash
# Test Posts API directly
curl http://localhost:3000/api/posts \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN"

# Expected response:
{
  "posts": [
    {
      "id": "cm...",
      "content": "...",
      "scheduledDate": "2024-...",
      "platforms": [...],
      "status": "scheduled",
      ...
    }
  ],
  "count": 10
}
```

### Step 2: Check Dashboard Widget

**Dashboard.tsx** should show real posts:

```typescript
// src/features/dashboard/Dashboard.tsx
import { useAppContext } from '@/app/_components/AppContext';

export const Dashboard: React.FC = () => {
  const { posts, postsLoading, postsError } = useAppContext();
  
  if (postsLoading) {
    return <div>Loading posts...</div>;
  }
  
  if (postsError) {
    return <div>Error: {postsError}</div>;
  }
  
  // Calculate stats from real posts
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;
  
  return (
    <div>
      <DashboardStats 
        scheduled={scheduledCount}
        drafts={draftCount}
        published={posts.filter(p => p.status === 'published').length}
      />
      <UpcomingPosts posts={posts.slice(0, 5)} />
    </div>
  );
};
```

### Step 3: Update Calendar View

**Calendar.tsx** should display real posts:

```typescript
// src/features/calendar/Calendar.tsx
export const Calendar: React.FC = () => {
  const { posts, postsLoading, postsError, refetchPosts } = useAppContext();
  
  // Add refresh button
  const handleRefresh = () => {
    refetchPosts();
  };
  
  if (postsLoading) {
    return <CalendarSkeleton />;
  }
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <CalendarGrid posts={posts} />
    </div>
  );
};
```

### Step 4: Update Composer

**Composer.tsx** should integrate with post creation:

```typescript
// src/features/composer/Composer.tsx
export const Composer: React.FC = () => {
  const { onPostCreated, showToast } = useAppContext();
  const composer = useComposer();
  
  const handlePublish = async () => {
    try {
      // Call API to create post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: composer.content,
          platforms: composer.selectedPlatforms,
          scheduledDate: composer.scheduledDate,
          scheduledTime: composer.scheduledTime,
          status: 'scheduled',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      const { post } = await response.json();
      
      // Update context (optimistic update)
      onPostCreated(post);
      
      // Reset form
      composer.reset();
      
    } catch (error) {
      showToast('Failed to create post', 'error');
    }
  };
  
  return <div>{/* Composer UI */}</div>;
};
```

---

## Testing Checklist

### Dashboard Tests

- [ ] Dashboard loads without errors
- [ ] DashboardStats shows correct counts (scheduled, drafts, published)
- [ ] UpcomingPosts widget displays next 5 scheduled posts
- [ ] RecentGenerations shows actual AI-generated posts (if any)
- [ ] Loading state displays before data loads
- [ ] Error message displays if API fails

### Calendar Tests

- [ ] Calendar displays all posts in correct date cells
- [ ] Grid view shows posts grouped by date
- [ ] List view shows posts in chronological order
- [ ] Kanban view shows posts grouped by status
- [ ] Clicking post opens edit modal (if implemented)
- [ ] Drag-and-drop updates post date (if implemented)
- [ ] Refresh button reloads posts

### Composer Tests

- [ ] Creating new post calls POST /api/posts
- [ ] New post appears immediately in Calendar
- [ ] Toast notification shows "Post created successfully"
- [ ] Form resets after successful creation
- [ ] Error message shows if creation fails
- [ ] Validation prevents invalid posts

### Analytics Tests

- [ ] Analytics loads post data for metrics
- [ ] Charts render with real engagement data
- [ ] Top posts table shows actual posts
- [ ] Date range filters work correctly

---

## Common Issues & Solutions

### Issue: Posts not appearing in Calendar

**Debug Steps**:
1. Check Network tab - Is GET /api/posts successful?
2. Check Console - Any JavaScript errors?
3. Check Response - Does it contain posts array?
4. Check Context - Are posts in AppContext state?

**Solution**:
```typescript
// Add debug logging
useEffect(() => {
  console.log('Posts loaded:', posts);
  console.log('Posts count:', posts.length);
}, [posts]);
```

### Issue: Creating post doesn't update UI

**Cause**: onPostCreated not called or not working

**Solution**:
```typescript
// Ensure onPostCreated is called after API success
const { post } = await response.json();
onPostCreated(post); // This updates context

// OR trigger full refetch
await refetchPosts();
```

### Issue: Duplicate posts appearing

**Cause**: Multiple useEffect calls or multiple context providers

**Solution**:
```typescript
// Ensure useEffect has proper dependencies
useEffect(() => {
  fetchPosts();
}, [fetchPosts]); // Only fetchPosts in dependency array

// Check only ONE AppContextProvider in app
```

### Issue: Loading state stuck

**Cause**: API call never resolves or error not handled

**Solution**:
```typescript
// Always use finally to clear loading
try {
  // API call
} catch (error) {
  setError(error);
} finally {
  setLoading(false); // Always clear loading
}
```

---

## Verification Commands

```bash
# 1. Check database has posts
npx prisma studio
# Navigate to Post table, verify records exist

# 2. Test API directly
curl http://localhost:3000/api/posts \
  -H "Cookie: $(cat cookies.txt)"

# 3. Check browser console
# Should see successful API calls in Network tab

# 4. Check Context state
# Add this to any component:
console.log('useAppContext:', useAppContext());
```

---

## Performance Optimization

### Lazy Load Posts on Demand

Instead of loading all posts on mount, load only when needed:

```typescript
// In Calendar component
useEffect(() => {
  if (posts.length === 0 && !postsLoading) {
    refetchPosts(); // Only fetch if empty
  }
}, [posts, postsLoading, refetchPosts]);
```

### Pagination for Large Datasets

```typescript
// Modify API call to support pagination
const fetchPosts = async (page = 1, limit = 50) => {
  await fetchAPI<Post[]>(
    `/api/posts?page=${page}&limit=${limit}`,
    setPosts,
    setPostsLoading,
    setPostsError,
    'posts'
  );
};
```

### Debounce Refresh Calls

```typescript
import { debounce } from 'lodash'; // or implement your own

const debouncedRefetch = debounce(() => {
  refetchPosts();
}, 300);
```

---

## Success Criteria

Phase 9F2 is complete when:

- [ ] All 5 features display real posts from API
- [ ] Creating posts updates UI immediately
- [ ] Editing posts updates UI (if implemented)
- [ ] Deleting posts removes from UI (if implemented)
- [ ] Loading states work smoothly
- [ ] Error handling prevents crashes
- [ ] No console errors
- [ ] Data persists across page refresh
- [ ] Multiple users see their own posts only

---

## Next Steps

1. ✅ Posts migration complete
2. → Continue to `phase9f3_accounts_migration.md` - Test accounts integration
3. → Continue to `phase9f4_bulk_migration.md` - Migrate remaining constants

---

**Implementation Time**: ~30 minutes

**Status**: Core data flow verified, ready for accounts migration
