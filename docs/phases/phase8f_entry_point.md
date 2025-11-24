# Phase 8f: Entry Point Setup

**Estimated Time:** 30-45 minutes

## Overview

Create Next.js entry point using catch-all routing to maintain SPA behavior while preparing for full Next.js App Router migration.

## Prerequisites

✅ Phase 8e complete: Root layout created
✅ src/app/layout.tsx exists
✅ Clean git working directory

## Goals

1. Create catch-all route directory structure
2. Create page.tsx for server component
3. Create client.tsx for client-side App component
4. Configure dynamic import with SSR disabled
5. Test Next.js dev server starts successfully

## Phase Steps

### Step 1: Create Catch-All Route Directory

Create the [[...slug]] directory for catch-all routing:

```bash
# Create catch-all route directory
mkdir -p src/app/\[\[...slug\]\]

# Verify directory created
ls -la src/app/
```

**Why catch-all route:**
- Matches all URLs (/, /dashboard, /composer, etc.)
- Maintains SPA behavior initially
- Allows incremental migration to App Router later

### Step 2: Create page.tsx (Server Component)

Create `src/app/[[...slug]]/page.tsx`:

```typescript
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

**File explained:**
- `generateStaticParams()`: Tells Next.js to pre-render only the index route
- `Page` component: Server component that renders ClientOnly
- Imports ClientOnly from same directory

### Step 3: Create client.tsx (Client Component)

Create `src/app/[[...slug]]/client.tsx`:

```typescript
'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

**File explained:**
- `'use client'`: Marks this as a Client Component
- `dynamic()`: Dynamically imports App component
- `ssr: false`: Disables server-side rendering for App
- Returns the dynamically imported App component

**Why this structure:**
- Keeps App.tsx unchanged (all 135+ components preserved)
- Disables SSR for smooth migration (SPA mode)
- Allows incremental adoption of Next.js features later

### Step 4: Verification Checklist

Verify entry point structure is correct:

- [ ] src/app/[[...slug]] directory exists
- [ ] src/app/[[...slug]]/page.tsx exists
- [ ] src/app/[[...slug]]/client.tsx exists
- [ ] page.tsx exports generateStaticParams
- [ ] page.tsx default exports Page component
- [ ] client.tsx has 'use client' directive
- [ ] client.tsx uses dynamic import with ssr: false

## Testing

### Verification Tests

1. **Directory Structure:**
   ```bash
   ls -la src/app/\[\[...slug\]\]/
   # Expected: Shows page.tsx and client.tsx
   ```

2. **page.tsx Syntax:**
   ```bash
   npx tsc --noEmit src/app/\[\[...slug\]\]/page.tsx
   # Expected: No errors
   ```

3. **client.tsx Syntax:**
   ```bash
   npx tsc --noEmit src/app/\[\[...slug\]\]/client.tsx
   # Expected: No errors
   ```

4. **Start Next.js Dev Server:**
   ```bash
   npm run dev
   # Expected: Server starts on port 3000
   # Open http://localhost:3000
   # App should load and function normally
   ```

5. **Check Console:**
   - Browser console should be mostly error-free
   - Check for React hydration warnings (may appear, expected)
   - Verify app renders and is interactive

### Success Criteria

✅ Catch-all route directory created
✅ page.tsx created with correct exports
✅ client.tsx created with dynamic import
✅ TypeScript compilation successful
✅ Next.js dev server starts without errors
✅ App loads in browser at localhost:3000
✅ App is functional (navigation, interactions work)

## Common Issues

### Issue: Directory name incorrect

**Symptom:** Next.js doesn't recognize catch-all route

**Solution:**
- Directory must be named `[[...slug]]` with double brackets
- Use exact casing (lowercase)
- Create with: `mkdir -p src/app/\[\[...slug\]\]`

### Issue: 'use client' missing

**Symptom:** Hooks error or client-side features don't work

**Solution:**
- Ensure `'use client'` is the FIRST line in client.tsx
- Must be before all imports
- Use exact syntax: `'use client'` (single quotes, no semicolon)

### Issue: Dynamic import error

**Symptom:** Cannot find module '../../App'

**Solutions:**
- Verify App.tsx exists at project root
- Check import path is correct from src/app/[[...slug]]/
- Try absolute import: `import('~/App')` if path alias configured

### Issue: Hydration warnings

**Symptom:** React hydration mismatch warnings in console

**Solution:**
- These are expected with ssr: false
- Safe to ignore for now
- Will be addressed in Phase 8h (full router migration)

### Issue: Port 3000 in use

**Symptom:** Next.js can't start on port 3000

**Solutions:**
- Kill existing process: `lsof -ti:3000 | xargs kill -9`
- Use different port: `npm run dev -- -p 3001`
- Set PORT env variable: `PORT=3001 npm run dev`

## File Structure

After this phase, directory structure:

```
/socialflow
├── src/
│   ├── app/
│   │   ├── [[...slug]]/
│   │   │   ├── page.tsx       # Server component (NEW)
│   │   │   └── client.tsx     # Client component (NEW)
│   │   ├── layout.tsx         # Root layout (Phase 8e)
│   │   └── globals.css        # Styles (Phase 8d)
│   ├── features/              # All feature components (unchanged)
│   ├── components/            # All shared components (unchanged)
│   └── ...                    # All other src/ files (unchanged)
├── App.tsx                    # Main app component (unchanged)
├── next.config.mjs            # Next.js config (Phase 8a)
├── tailwind.config.js         # Tailwind config (Phase 8d)
└── ...
```

## Complete Code

### src/app/[[...slug]]/page.tsx
```typescript
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

### src/app/[[...slug]]/client.tsx
```typescript
'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

## Git Commit

Once all verification tests pass and dev server works, commit:

```bash
# Stage changes
git add src/app/\[\[...slug\]\]/

# Commit with clear message
git commit -m "Phase 8f: Create Next.js entry point with catch-all routing

- Create src/app/[[...slug]]/ directory for catch-all route
- Create page.tsx as Server Component entry point
- Create client.tsx as Client Component wrapper
- Use dynamic import with ssr: false for SPA mode
- Export generateStaticParams for static generation
- Preserve all existing App.tsx functionality
- Next.js dev server now functional

Entry point structure:
- page.tsx: Server component (prerendered)
- client.tsx: Client component (hydrates App.tsx)
- App.tsx: Main application (unchanged, 135+ components)

Testing:
- npm run dev starts Next.js server
- App loads at localhost:3000
- All features functional

Next: Phase 8g - Environment variables migration"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If you need to undo this phase:

```bash
# Remove entry point directory
rm -rf src/app/\[\[...slug\]\]

# Revert commit
git reset --hard HEAD~1
```

## Next Steps

After completing Phase 8f:

1. **Test:** Thoroughly test app in browser
2. **Verify:** Check all 9 features work correctly
3. **Proceed:** Move to Phase 8g (Environment Variables)
4. **Note:** Keep dev server running for testing

**Phase 8g Preview:** Migrate environment variables from VITE_ to NEXT_PUBLIC_ prefix.

## Key Takeaways

### What We Accomplished

- ✅ Next.js entry point created with catch-all routing
- ✅ SPA behavior preserved with ssr: false
- ✅ All existing components work unchanged
- ✅ Dev server functional
- ✅ Ready for incremental migration

### Why This Approach

- **Catch-all route**: Matches all URLs, maintains SPA routing
- **Dynamic import**: Allows disabling SSR for gradual migration
- **ssr: false**: Keeps client-only behavior initially
- **Separate client.tsx**: Clean separation of server/client code

### Important Notes

- App.tsx remains completely unchanged
- All 135+ components continue to work
- ViewState routing still functional
- Can incrementally migrate to App Router later
- Hydration warnings are expected and safe

## Testing Checklist

Test these features in browser after `npm run dev`:

- [ ] App loads at localhost:3000
- [ ] Dashboard renders correctly
- [ ] Navigation between views works
- [ ] Theme switching functions
- [ ] Modals open and close
- [ ] Keyboard shortcuts work (Cmd+K)
- [ ] AI features generate content
- [ ] Mobile responsive layout works
- [ ] Dark mode toggles correctly
- [ ] No blocking console errors

## Phase Completion Checklist

Before proceeding to Phase 8g, verify:

- [ ] src/app/[[...slug]]/ directory exists
- [ ] page.tsx created correctly
- [ ] client.tsx created correctly
- [ ] TypeScript compiles without errors
- [ ] npm run dev starts successfully
- [ ] App loads in browser
- [ ] All features work normally
- [ ] Git commit created

## References

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js dynamic()](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

---

**Status:** Phase 8f Complete ✅
**Next Phase:** Phase 8g - Environment Variables Migration
**Estimated Time for Next Phase:** 20-30 minutes
