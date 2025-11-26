# Phase 9F0: Mock Data Migration Overview

**Part of Phase 9F: Connect Frontend to Backend APIs**

---

## Objective

Migrate SocialFlow AI frontend from mock data to real backend APIs, establishing the complete data flow from database → API → Context → Components.

---

## Why This Matters

**Current State**: Frontend uses 13 mock data constants (`INITIAL_POSTS`, `INITIAL_ACCOUNTS`, etc.) from `src/utils/constants.ts`

**Target State**: Frontend fetches real data from backend APIs with:
- Loading states during data fetch
- Error handling for failed requests
- Data refresh capabilities
- User-specific data isolation
- Real-time data consistency

**Benefits**:
- Users see their actual data (posts, accounts, media)
- Changes persist across sessions
- Multi-device synchronization
- Proper authentication and authorization
- Foundation for real-time features (Phase 9G)

---

## Architecture Overview

### Current Architecture (Mock Data)

```
Component → INITIAL_POSTS constant → Render
             (Hardcoded in constants.ts)
```

### Target Architecture (Real APIs)

```
Component Mount
    ↓
AppContext useEffect
    ↓
GET /api/posts (with auth)
    ↓
Prisma query (filtered by userId)
    ↓
Response with user's posts
    ↓
Context setState
    ↓
Components re-render with real data
```

---

## Scope: 13 Mock Constants to Migrate

From `src/utils/constants.ts`:

### High Priority (Core Features)
1. **INITIAL_POSTS** → `/api/posts` - Posts API (Phase 9C) ✅
2. **INITIAL_ACCOUNTS** → `/api/accounts` - Accounts API (Phase 9C) ✅
3. **MOCK_ASSETS_INIT** → `/api/media` - Media API (Phase 9C) ✅
4. **MOCK_FOLDERS** → `/api/media/folders` - Folders (needs endpoint)
5. **MOCK_LINKS** → `/api/links` - Short links (needs API)
6. **INITIAL_BIO_CONFIG** → `/api/links/bio` - Bio page (needs API)

### Medium Priority (Secondary Features)
7. **MOCK_MESSAGES** → `/api/inbox/messages` - Inbox messages (needs API)
8. **MOCK_LISTENING** → `/api/inbox/listening` - Social listening (needs API)
9. **MOCK_TEAM** → `/api/team` - Team members (needs API)
10. **MOCK_LEADS** → `/api/links/leads` - Lead capture (needs API)

### Low Priority (Can Mock Initially)
11. **MOCK_PRODUCTS** → `/api/products` or keep mock (external integration)
12. **MOCK_WORKFLOWS** → `/api/automations/workflows` - Automation workflows
13. **MOCK_INTEGRATIONS** → `/api/automations/integrations` - External integrations

---

## Implementation Strategy

### Phase 1: Core APIs (Already Complete ✅)
- Posts API (5 endpoints)
- Accounts API (5 endpoints)  
- Media API (5 endpoints)

### Phase 2: Context Integration (This Phase)
- Update AppContext to fetch from APIs
- Add loading/error states
- Implement data refresh functions

### Phase 3: Missing APIs (If Needed)
Create lightweight endpoints for:
- Folders (GET, POST, DELETE)
- Links (CRUD)
- Bio pages (GET, PUT)
- Messages/Listening (basic CRUD)
- Team management (basic CRUD)
- Leads (GET, POST)

### Phase 4: Testing & Validation
- Verify data loads correctly
- Test error scenarios
- Check loading states
- Validate user isolation

---

## File Structure

### Updated Files (2 primary files)

```
src/
├── app/
│   └── _components/
│       └── AppContext.tsx              # Replace mock data with API calls
└── utils/
    └── constants.ts                     # Remove migrated constants
```

### New API Files (Optional - If Needed)

```
src/app/api/
├── media/
│   └── folders/
│       └── route.ts                     # Folders CRUD
├── links/
│   ├── route.ts                        # Links CRUD
│   ├── bio/route.ts                    # Bio page
│   └── leads/route.ts                  # Lead capture
├── inbox/
│   ├── messages/route.ts               # Messages
│   └── listening/route.ts              # Social listening
└── team/
    └── route.ts                         # Team management
```

---

## Implementation Timeline

**Total Estimated Time: 3-4 hours**

| Step | Document | Time | What You'll Do |
|------|----------|------|----------------|
| 0 | Overview | - | (This document) |
| 1 | Context Integration | 45 min | Update AppContext with API calls |
| 2 | Posts Migration | 30 min | Replace INITIAL_POSTS, test thoroughly |
| 3 | Accounts Migration | 30 min | Replace INITIAL_ACCOUNTS, test |
| 4 | Bulk Migration | 60 min | Migrate remaining constants |
| 5 | Testing | 30 min | End-to-end testing, error scenarios |

**Note**: Times assume core APIs exist. Add 15-20 min per missing API endpoint.

---

## Prerequisites

Before starting Phase 9F, ensure:

✅ **Phase 9A Complete** - Database schema operational
✅ **Phase 9B Complete** - Authentication working (login/register)
✅ **Phase 9C Complete** - Core APIs implemented (Posts, Accounts, Media)
✅ **Frontend Running** - App loads at http://localhost:3000
✅ **Test User** - Registered user account for testing

---

## Success Criteria

Phase 9F is complete when:

- [ ] AppContext fetches data from APIs, not constants
- [ ] Loading states display during data fetch
- [ ] Error messages shown for failed API calls
- [ ] Data refresh functions work correctly
- [ ] User sees their own data (not shared mock data)
- [ ] Changes persist across browser refresh
- [ ] All 9 features display real data
- [ ] No console errors during normal operation
- [ ] Migration documented in progress.md
- [ ] Constants.ts cleaned up (removed migrated data)

---

## API Call Pattern (Established)

### Standard GET Request

```typescript
// In AppContext.tsx
const [posts, setPosts] = useState<Post[]>([]);
const [postsLoading, setPostsLoading] = useState(true);
const [postsError, setPostsError] = useState<string | null>(null);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts);
      setPostsError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPostsError('Failed to load posts. Please refresh.');
    } finally {
      setPostsLoading(false);
    }
  };

  fetchPosts();
}, []);
```

### Context Value Pattern

```typescript
const value = {
  // Data
  posts,
  postsLoading,
  postsError,
  
  // Actions
  refetchPosts: () => fetchPosts(),
  setPosts, // For optimistic updates
};
```

---

## Data Flow Patterns

### 1. Initial Data Load (On Mount)

```
User logs in
    ↓
Protected route (/dashboard)
    ↓
AppContext mounts
    ↓
useEffect triggers API calls
    ↓
Loading states shown
    ↓
Data fetched from APIs
    ↓
Context state updated
    ↓
Components render with real data
```

### 2. Data Refresh (Manual)

```
User clicks "Refresh" button
    ↓
Component calls refetchPosts()
    ↓
API call repeats
    ↓
New data fetched
    ↓
UI updates
```

### 3. Data Mutation (Create/Update/Delete)

```
User creates post in Composer
    ↓
POST /api/posts
    ↓
Database updated
    ↓
Response with new post
    ↓
Optimistic update: setPosts([...posts, newPost])
    ↓
UI updates immediately
    ↓
Optional: Trigger refetch for consistency
```

---

## Error Handling Strategy

### Network Errors
```typescript
try {
  const response = await fetch('/api/posts');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  setError('Failed to load posts. Check your connection.');
}
```

### Authentication Errors (401)
```typescript
if (response.status === 401) {
  router.push('/login?redirect=' + pathname);
  return;
}
```

### Server Errors (500)
```typescript
if (response.status >= 500) {
  setError('Server error. Please try again later.');
}
```

---

## Loading State Patterns

### Skeleton Loaders (Preferred)
```tsx
{postsLoading ? (
  <div className="space-y-4">
    <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
    <div className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
  </div>
) : (
  <PostList posts={posts} />
)}
```

### Spinner (Simple)
```tsx
{postsLoading ? (
  <div className="flex justify-center p-8">
    <LoadingSpinner />
  </div>
) : (
  <PostList posts={posts} />
)}
```

---

## Migration Checklist

### Before Starting
- [ ] All Phase 9A-9C complete
- [ ] Test user registered and logged in
- [ ] Database has seed data
- [ ] APIs responding correctly (test in API testing guide)

### During Migration
- [ ] Update one constant at a time
- [ ] Test after each migration
- [ ] Add loading states
- [ ] Add error handling
- [ ] Verify user isolation (different users see different data)

### After Completion
- [ ] All features load real data
- [ ] No hardcoded mock data in use
- [ ] Loading states smooth
- [ ] Error messages helpful
- [ ] Browser refresh works
- [ ] Update Memory Bank (activeContext.md, progress.md)

---

## Performance Considerations

### Initial Load Optimization
- Fetch only essential data on mount (posts, accounts)
- Lazy load secondary data (media, links) on feature access
- Use React.lazy() for feature components

### Caching Strategy
- Store fetched data in Context
- Only refetch when explicitly requested
- Consider implementing SWR pattern (stale-while-revalidate)

### Pagination (Future Enhancement)
```typescript
// Example for large datasets
GET /api/posts?limit=50&offset=0
```

---

## Security Reminders

All API routes **must**:
1. Call `requireAuth()` first
2. Filter by `userId` in database queries
3. Validate input with Zod schemas
4. Return user-friendly error messages
5. Never expose other users' data

---

## Debugging Tips

### Data Not Loading?
1. Check Network tab (API called?)
2. Check Response (200 OK?)
3. Check Console (errors?)
4. Verify authentication (logged in?)
5. Check database (data exists?)

### Infinite Loading?
1. Check for infinite useEffect loops
2. Verify API endpoint exists
3. Check for JavaScript errors
4. Verify fetch URL is correct

### Wrong Data Showing?
1. Verify userId filter in API
2. Check if correct user logged in
3. Clear localStorage/cookies
4. Check database directly (Prisma Studio)

---

## Next Steps

1. **Read** `phase9f1_context_api_integration.md` - Update AppContext
2. **Read** `phase9f2_posts_migration.md` - Migrate posts first
3. **Read** `phase9f3_accounts_migration.md` - Migrate accounts second
4. **Read** `phase9f4_bulk_migration.md` - Migrate remaining constants
5. **Read** `phase9f5_testing.md` - Comprehensive testing

---

**Ready to begin?** → Continue to `phase9f1_context_api_integration.md`
