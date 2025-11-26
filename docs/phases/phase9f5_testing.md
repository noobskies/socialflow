# Phase 9F5: Comprehensive Testing Guide

**Part of Phase 9F: Connect Frontend to Backend APIs**

---

## Objective

Perform end-to-end testing to verify all features work correctly with real backend APIs, loading states, error handling, and data persistence.

---

## Testing Overview

**Total Testing Time**: ~30 minutes

**What to Test**:
1. Initial data load (all features)
2. Create/update/delete operations
3. Loading states and error handling
4. Data persistence across refresh
5. User isolation (different users see different data)
6. Performance and user experience

---

## Test Environment Setup

### Prerequisites

```bash
# 1. Start development server
npm run dev

# 2. Open Prisma Studio (separate terminal)
npx prisma studio

# 3. Have test user ready
# Email: test@example.com
# Password: TestPassword123!
```

### Browser Setup

1. Open Chrome/Firefox DevTools
2. Network tab → Preserve log ✓
3. Console tab → Open for errors
4. Application tab → Check cookies/localStorage

---

## Feature-by-Feature Testing

### 1. Dashboard (5 minutes)

**Test Initial Load**:
- [ ] Navigate to `/dashboard`
- [ ] DashboardStats widget loads with real counts
- [ ] UpcomingPosts shows next 5 scheduled posts
- [ ] AccountHealth shows connected accounts count
- [ ] TrendingWidget loads (may use mock data)
- [ ] No console errors

**Verify Data**:
```typescript
// Check Context state in console
const { posts, accounts } = useAppContext();
console.log('Posts:', posts.length);
console.log('Accounts:', accounts.length);
```

**Expected Behavior**:
- Loading skeleton displays briefly
- Data populates smoothly
- Stats match database counts
- All widgets render without errors

---

### 2. Composer (5 minutes)

**Test Post Creation**:
- [ ] Navigate to `/composer`
- [ ] Platform selector shows connected accounts only
- [ ] Write post content: "Test post from API"
- [ ] Select platform(s)
- [ ] Schedule for tomorrow
- [ ] Click "Schedule Post"
- [ ] Toast notification: "Post created successfully"
- [ ] Verify post appears in Calendar

**Verify API Call**:
```bash
# Network tab should show:
POST /api/posts
Status: 201 Created
Response: { "post": { "id": "...", ... } }
```

**Check Database**:
```sql
-- In Prisma Studio, Post table
-- Should see new post with status "scheduled"
```

---

### 3. Calendar (5 minutes)

**Test Post Display**:
- [ ] Navigate to `/calendar`
- [ ] All posts display in correct date cells
- [ ] Grid view works
- [ ] List view works
- [ ] Kanban view works (grouped by status)
- [ ] Click post opens details (if implemented)

**Test Refresh**:
- [ ] Click refresh button (if exists)
- [ ] Loading state displays briefly
- [ ] Posts reload successfully

**Test Drag-and-Drop** (if implemented):
- [ ] Drag post to different date
- [ ] PUT /api/posts/[id] called
- [ ] Date updates successfully
- [ ] Toast confirms update

---

### 4. Settings - Accounts (5 minutes)

**Test Account Management**:
- [ ] Navigate to `/settings/accounts`
- [ ] All 7 platforms listed
- [ ] Connected accounts show username
- [ ] Disconnect button works
- [ ] Connect button redirects to OAuth

**Test OAuth Flow**:
- [ ] Click "Connect" for Twitter
- [ ] Redirect to twitter.com/oauth
- [ ] Authorize application
- [ ] Redirect back to app
- [ ] Account appears as connected
- [ ] Toast: "Account connected"
- [ ] Token encrypted in database

---

### 5. Library (3 minutes)

**Test Media Display**:
- [ ] Navigate to `/library`
- [ ] Media tab shows uploaded assets
- [ ] Templates tab shows saved templates
- [ ] Folders display correctly
- [ ] Assets load from /api/media
- [ ] Click asset opens preview

**Test Upload** (if Phase 9E implemented):
- [ ] Click "Upload" button
- [ ] Select image file
- [ ] Progress bar displays (0-100%)
- [ ] Image appears in grid
- [ ] Thumbnail generated

---

### 6. Links Manager (3 minutes)

**Test Short Links**:
- [ ] Navigate to `/links`
- [ ] Short Links tab shows user's links
- [ ] Create new link works
- [ ] Stats display (clicks)
- [ ] Delete link works

**Test Bio Page**:
- [ ] Bio Page tab loads config
- [ ] Edit bio/username works
- [ ] Add/remove links works
- [ ] Theme preview works
- [ ] Save updates database

---

### 7. Analytics (2 minutes)

**Test Data Loading**:
- [ ] Navigate to `/analytics`
- [ ] Charts render with real data
- [ ] Top posts table displays
- [ ] Date range filter works
- [ ] Platform filter works
- [ ] Export data works (if implemented)

---

## Error Handling Tests

### Test API Failures

**Simulate Server Error**:
```typescript
// Temporarily modify API route to return 500
return NextResponse.json({ error: 'Server error' }, { status: 500 });
```

**Expected Behavior**:
- [ ] Error state displays
- [ ] User-friendly message shown
- [ ] App doesn't crash
- [ ] Retry option available
- [ ] Console logs error details

### Test Network Failures

**Simulate Offline**:
- Chrome DevTools → Network → Offline ✓
- Refresh page

**Expected Behavior**:
- [ ] Error message: "Network error"
- [ ] Retry button available
- [ ] Previously loaded data still visible (if cached)

### Test Authentication Errors

**Simulate 401 Unauthorized**:
- Delete session cookie
- Try to load protected page

**Expected Behavior**:
- [ ] Redirect to `/login`
- [ ] Redirect parameter preserves destination
- [ ] After login, returns to intended page

---

## Loading States Test

**Check All Loading States**:
- [ ] Dashboard loading skeleton
- [ ] Calendar loading spinner
- [ ] Settings loading (accounts)
- [ ] Composer platform selector loading
- [ ] Library media grid loading
- [ ] Links list loading
- [ ] Analytics charts loading

**Performance**:
- [ ] Loading states display < 100ms
- [ ] Data loads < 2 seconds
- [ ] No flashing/jumping content
- [ ] Smooth transitions

---

## Data Persistence Tests

### Test Browser Refresh

**Scenario 1: Posts persist**:
1. Create new post
2. Refresh browser (F5)
3. Verify post still visible in Calendar

**Scenario 2: Settings persist**:
1. Update bio page settings
2. Refresh browser
3. Verify settings still applied

**Scenario 3: Accounts persist**:
1. Connect new account
2. Refresh browser
3. Verify account still connected

---

## User Isolation Tests

**Test with Two Users**:

**User A**:
1. Login as user A
2. Create post "User A's post"
3. Connect Twitter account

**User B**:
1. Logout, login as user B
2. Navigate to Dashboard
3. Verify does NOT see "User A's post"
4. Navigate to Settings/Accounts
5. Verify does NOT see User A's Twitter account

**Expected Behavior**:
- [ ] Each user sees only their own data
- [ ] API filters by userId correctly
- [ ] No data leakage between users

---

## Performance Tests

### Measure Key Metrics

**Use Chrome DevTools Performance tab**:

**Dashboard Load Time**:
- Target: < 2 seconds
- Measure: Time to interactive

**API Response Times**:
- GET /api/posts: < 300ms
- GET /api/accounts: < 200ms
- POST /api/posts: < 500ms

**Memory Usage**:
- Check for memory leaks
- Multiple navigations shouldn't accumulate memory

---

## Regression Testing Checklist

After Phase 9F is complete, verify:

### Frontend Functionality
- [ ] All 9 features render without errors
- [ ] Navigation works (sidebar links)
- [ ] Theme switching still works
- [ ] Keyboard shortcuts still work
- [ ] Mobile responsive still works
- [ ] Command palette still works
- [ ] Modals open/close correctly

### Backend Integration
- [ ] Authentication works
- [ ] Authorization enforced (userId filtering)
- [ ] Validation prevents invalid data
- [ ] Error messages user-friendly
- [ ] Logging sufficient for debugging

### Database
- [ ] All tables have data
- [ ] Foreign keys enforced
- [ ] Timestamps update correctly
- [ ] Encryption working (tokens)
- [ ] No N+1 query problems

---

## Bug Reporting Template

If you find issues, document them:

```markdown
## Bug: [Short Description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. Observe...

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[Attach if applicable]

**Console Errors**:
```
[Paste error messages]
```

**Network Requests**:
[Failed API calls, status codes]

**Environment**:
- Browser: Chrome 120
- OS: macOS
- Node: 18.17.0
```

---

## Success Criteria

Phase 9F is 100% complete when:

### Functionality
- [ ] All features load real data from APIs
- [ ] Create/update/delete operations work
- [ ] OAuth flows work for all 7 platforms
- [ ] Loading states smooth and fast
- [ ] Error handling prevents crashes

### Data Integrity
- [ ] Changes persist across refresh
- [ ] User isolation verified
- [ ] No data loss
- [ ] Timestamps accurate

### Performance
- [ ] Dashboard loads < 2 seconds
- [ ] API calls < 500ms
- [ ] No memory leaks
- [ ] Smooth transitions

### Quality
- [ ] Zero console errors
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] All tests passing
- [ ] Code reviewed

---

## Final Verification

**Complete Checklist**:

### Phase 9F1: AppContext ✓
- [ ] Context fetches from APIs
- [ ] Loading/error states added
- [ ] Refetch functions work

### Phase 9F2: Posts ✓
- [ ] Dashboard shows real posts
- [ ] Calendar displays real posts
- [ ] Composer creates real posts
- [ ] Analytics uses real post data

### Phase 9F3: Accounts ✓
- [ ] Dashboard shows accounts
- [ ] Composer filters by connected accounts
- [ ] Settings manages accounts
- [ ] OAuth flows work

### Phase 9F4: Bulk Migration ✓
- [ ] Folders API working
- [ ] Links API working
- [ ] Bio Page API working
- [ ] Leads API working
- [ ] Low-priority constants kept as mock

### Phase 9F5: Testing ✓
- [ ] All features tested
- [ ] Error scenarios tested
- [ ] Performance acceptable
- [ ] Documentation updated

---

## Next Steps

1. ✅ Phase 9F complete
2. → Optional: Implement Phase 9E (File Storage)
3. → Optional: Document Phase 9G (Real-time Features)
4. → Begin Phase 10 (Production Deployment)

---

**Congratulations!** 🎉

Your frontend is now fully connected to backend APIs with:
- ✅ Real user data
- ✅ Persistent storage
- ✅ Authentication & authorization
- ✅ OAuth integrations
- ✅ Error handling
- ✅ Loading states
- ✅ User isolation

**Total Implementation Time**: ~3-4 hours (as estimated)

**Status**: Phase 9F COMPLETE, ready for file storage (9E) or real-time features (9G)
