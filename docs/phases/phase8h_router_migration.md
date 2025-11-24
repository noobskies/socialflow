# Phase 8h: Router Migration (OPTIONAL)

**Estimated Time:** 2-3 hours

## Overview

**IMPORTANT: This phase is OPTIONAL and can be deferred.** The application is fully functional with the catch-all route from Phase 8f. This phase migrates from ViewState enum routing to Next.js App Router for URL-based navigation.

## Decision Point

Before starting this phase, consider:

### Skip Phase 8h if:
- ✅ You want to move faster to deployment (go to Phase 8i)
- ✅ SPA routing is acceptable for your use case
- ✅ You want to defer router migration for later
- ✅ Time is constrained

### Complete Phase 8h if:
- ✅ You want proper URL routing now
- ✅ SEO is important (bookmarkable URLs)
- ✅ Browser back/forward should change views
- ✅ You want to fully adopt Next.js App Router

**Recommendation:** Skip to Phase 8i for MVP, return to Phase 8h later when needed.

## Prerequisites

✅ Phase 8g complete: Environment variables migrated
✅ App fully functional with SPA routing
✅ Clean git working directory
✅ Backup of current working state

## Goals

1. Create route directories for each view (dashboard, composer, etc.)
2. Create page.tsx for each route
3. Update Sidebar navigation to use Next.js Link
4. Remove ViewState enum and switch statement
5. Test all routes and navigation
6. Ensure back/forward buttons work

## Phase Steps

### Step 1: Create Route Structure

Create directories for each of the 9 main views:

```bash
# Create route directories
mkdir -p src/app/dashboard
mkdir -p src/app/composer
mkdir -p src/app/calendar
mkdir -p src/app/analytics
mkdir -p src/app/inbox
mkdir -p src/app/library
mkdir -p src/app/links
mkdir -p src/app/automations
mkdir -p src/app/settings

# Verify structure
ls -la src/app/
```

### Step 2: Create Page Components

For each route, create a page.tsx that renders the feature component.

**Example: src/app/dashboard/page.tsx**
```typescript
'use client'

import Dashboard from '@/features/dashboard/Dashboard'
import { useState } from 'react'
import { Post, SocialAccount } from '@/types'
import { INITIAL_POSTS, INITIAL_ACCOUNTS } from '@/utils/constants'

export default function DashboardPage() {
  const [posts] = useState<Post[]>(INITIAL_POSTS)
  const [accounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS)
  
  const handlePostCreated = (newPost: Post) => {
    // Handle post creation
  }
  
  const showToast = (message: string, type: string) => {
    // Handle toast
  }
  
  const handleCompose = () => {
    // Navigate to composer
  }
  
  return (
    <Dashboard
      posts={posts}
      accounts={accounts}
      onPostCreated={handlePostCreated}
      showToast={showToast}
      onCompose={handleCompose}
    />
  )
}
```

**Repeat for all routes:**
- src/app/composer/page.tsx
- src/app/calendar/page.tsx
- src/app/analytics/page.tsx
- src/app/inbox/page.tsx
- src/app/library/page.tsx
- src/app/links/page.tsx
- src/app/automations/page.tsx
- src/app/settings/page.tsx

### Step 3: Update Sidebar Navigation

Update `src/components/layout/Sidebar.tsx` to use Next.js Link:

**Before:**
```typescript
onClick={() => setView(ViewState.DASHBOARD)}
```

**After:**
```typescript
import Link from 'next/link'

<Link href="/dashboard">
  <button>Dashboard</button>
</Link>
```

### Step 4: Update App.tsx

Remove ViewState enum logic and simplify App.tsx to just provide layout:

**Before:**
```typescript
const renderView = () => {
  switch (currentView) {
    case ViewState.DASHBOARD:
      return <Dashboard ... />
    // ... more cases
  }
}
```

**After:**
```typescript
// Remove switch statement
// App.tsx becomes just layout wrapper
```

### Step 5: Remove Catch-All Route

Once proper routes are working, remove the catch-all route:

```bash
# Remove catch-all route
rm -rf src/app/\[\[...slug\]\]
```

### Step 6: Test All Routes

Test each route manually:

```bash
# Start dev server
npm run dev

# Test URLs:
# http://localhost:3000/
# http://localhost:3000/dashboard
# http://localhost:3000/composer
# http://localhost:3000/calendar
# http://localhost:3000/analytics
# http://localhost:3000/inbox
# http://localhost:3000/library
# http://localhost:3000/links
# http://localhost:3000/automations
# http://localhost:3000/settings
```

## Testing

### Verification Tests

1. **Routes Accessible:**
   - All 9 routes load without errors
   - Direct URL access works
   - Browser back/forward buttons work

2. **Navigation Works:**
   - Sidebar links navigate correctly
   - Mobile nav navigates correctly
   - Command Palette navigation works

3. **State Persists:**
   - Theme persists across routes
   - User data persists (if using Context)

## Common Issues

### Issue: Shared state lost between routes

**Symptom:** User data/theme resets when changing routes

**Solution:** Implement React Context or state management library (Zustand)

### Issue: Props drilling becomes complex

**Symptom:** Too many props passed through components

**Solution:** Use React Context API for global state

### Issue: Routes not found

**Symptom:** 404 errors on routes

**Solution:** Verify directory names match URL paths exactly

## Git Commit

```bash
git add src/app/
git commit -m "Phase 8h: Migrate to Next.js App Router

- Create route directories for all 9 views
- Create page.tsx for each route
- Update Sidebar to use Next.js Link components
- Remove ViewState enum routing
- Remove catch-all route
- Enable URL-based navigation

Routes created:
- /dashboard, /composer, /calendar
- /analytics, /inbox, /library
- /links, /automations, /settings

Benefits:
- Proper URL routing
- Bookmarkable URLs
- Browser back/forward works
- Better SEO

Next: Phase 8i - Build and test"
```

## Rollback Plan

```bash
# Revert commit
git reset --hard HEAD~1

# Restore catch-all route if needed
git checkout HEAD~1 -- src/app/\[\[...slug\]\]
```

## Key Takeaways

### What We Accomplished (if completed)

- ✅ Full Next.js App Router implementation
- ✅ URL-based routing
- ✅ Bookmarkable URLs
- ✅ Browser navigation works
- ✅ Better SEO potential

### Why This Can Be Skipped

- SPA routing with catch-all route works fine
- Can be done later without breaking changes
- Requires more code reorganization
- State management becomes more complex

## Phase Completion Checklist

Before proceeding to Phase 8i, verify (if completed):

- [ ] All 9 route directories created
- [ ] All page.tsx files created
- [ ] Sidebar uses Next.js Link
- [ ] ViewState enum removed
- [ ] Catch-all route removed
- [ ] All routes tested
- [ ] Navigation works correctly
- [ ] Git commit created

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)

---

**Status:** Phase 8h Optional (Can Skip to 8i)
**Next Phase:** Phase 8i - Build & Test
**Estimated Time for Next Phase:** 1-2 hours
