# Phase 8i: Build & Test

**Estimated Time:** 1-2 hours

## Overview

Build the production version of the application, clean up Vite artifacts, and perform comprehensive testing to verify the migration is successful.

## Prerequisites

✅ Phase 8g complete: Environment variables migrated
✅ Phase 8h complete OR skipped (Router migration optional)
✅ App functional in development mode
✅ Clean git working directory

## Goals

1. Update package.json scripts for production
2. Delete Vite-specific files (index.html, index.tsx, vite.config.ts)
3. Run production build successfully
4. Test production build locally
5. Verify all features work in production
6. Document any issues found

## Phase Steps

### Step 1: Final Script Updates

Verify package.json scripts are correct for Next.js:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,css,md,json}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,css,md,json}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

### Step 2: Delete Vite Files

Remove Vite-specific files that are no longer needed:

```bash
# List files to delete
ls -la index.html index.tsx vite.config.ts

# Delete Vite files
rm index.html
rm index.tsx
rm vite.config.ts

# Remove backup files if they exist
rm -f index.html.backup
rm -f tsconfig.json.backup
rm -f .env.local.backup

# Verify deletion
git status
```

### Step 3: Run Production Build

Build the application for production:

```bash
# Clean previous build
rm -rf .next dist

# Run production build
npm run build

# Watch for:
# - Build completion message
# - No errors
# - Bundle size information
# - Route generation info
```

**Expected output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB         XXX kB
└ ○ /[[...slug]]                         XXX kB         XXX kB

○  (Static)  prerendered as static HTML
```

### Step 4: Test Production Build

Start production server and test:

```bash
# Start production server
npm start

# Server should start on port 3000
# Open http://localhost:3000
```

### Step 5: Comprehensive Testing

Test all features in production mode:

#### View Testing
- [ ] Dashboard loads and displays correctly
- [ ] Composer renders with all features
- [ ] Calendar displays posts correctly
- [ ] Analytics shows charts
- [ ] Inbox displays messages
- [ ] Library shows assets
- [ ] Links manager works
- [ ] Automations displays workflows
- [ ] Settings loads all tabs

#### Functionality Testing
- [ ] Navigation between views works
- [ ] Theme switching (light/dark/system)
- [ ] Modal system (Command Palette, notifications, help)
- [ ] Keyboard shortcuts (Cmd+K, ?, c, ESC)
- [ ] Toast notifications display
- [ ] AI features (trending topics, content generation)
- [ ] Mobile responsive layout
- [ ] Form inputs work correctly

#### Performance Testing
- [ ] Initial page load < 3 seconds
- [ ] Navigation feels instant
- [ ] No console errors
- [ ] No console warnings (except expected ones)
- [ ] Bundle size acceptable (< 500KB)

### Step 6: Verification Checklist

Verify migration completeness:

- [ ] Vite files deleted (index.html, index.tsx, vite.config.ts)
- [ ] Production build succeeds
- [ ] No build errors or warnings
- [ ] Production server starts successfully
- [ ] App loads in production mode
- [ ] All features functional
- [ ] Performance acceptable
- [ ] Bundle size reasonable

## Testing

### Verification Tests

1. **Build Succeeds:**
   ```bash
   npm run build
   # Expected: Builds successfully with no errors
   ```

2. **Vite Files Gone:**
   ```bash
   ls index.html index.tsx vite.config.ts 2>&1 | grep "No such file"
   # Expected: All files not found
   ```

3. **Production Server:**
   ```bash
   npm start
   # Expected: Server starts, app accessible
   ```

4. **Bundle Size:**
   ```bash
   du -sh dist/
   # Expected: Reasonable size (< 50MB)
   ```

5. **Type Check:**
   ```bash
   npm run type-check
   # Expected: No TypeScript errors
   ```

6. **Lint Check:**
   ```bash
   npm run lint
   # Expected: No linting errors
   ```

### Success Criteria

✅ Vite files removed successfully
✅ Production build completes without errors
✅ Production server starts correctly
✅ All 9 views load and function
✅ Navigation works in production
✅ AI features work in production
✅ Performance is acceptable
✅ No critical console errors

## Common Issues

### Issue: Build fails with module not found

**Symptom:** Error during `npm run build` about missing modules

**Solutions:**
- Clean install: `rm -rf node_modules package-lock.json && npm install`
- Check imports use correct path aliases
- Verify all dependencies installed: `npm list --depth=0`
- Check for circular dependencies

### Issue: Environment variables undefined in production

**Symptom:** AI features don't work in production build

**Solutions:**
- Verify .env.local has NEXT_PUBLIC_GEMINI_API_KEY
- Check variable name spelling exactly
- Rebuild after env changes: `npm run build`
- Test with: `NEXT_PUBLIC_GEMINI_API_KEY=test npm run build`

### Issue: Static export fails

**Symptom:** Error during static page generation

**Solutions:**
- Check all pages are properly configured
- Verify no dynamic routes without generateStaticParams
- Review next.config.mjs settings
- Check for server-only features in client components

### Issue: Hydration errors in production

**Symptom:** Hydration mismatch warnings

**Solutions:**
- These are expected with ssr: false (if using catch-all route)
- Will resolve after Phase 8h (full router migration)
- Safe to ignore if app functions correctly

### Issue: Large bundle size

**Symptom:** Bundle > 1MB

**Solutions:**
- Analyze bundle: `npm run build` shows sizes
- Consider code splitting for large dependencies
- Verify tree shaking is working
- Check for duplicate dependencies

## Build Output Analysis

### Understanding Build Output

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB           85 kB
└ ○ /[[...slug]]                       120 kB          200 kB

○  (Static)  prerendered as static HTML

First Load JS shared by all              65 kB
  ├ chunks/framework-[hash].js           45 kB
  ├ chunks/main-[hash].js                15 kB
  └ other shared chunks                   5 kB
```

**What to look for:**
- First Load JS < 300KB is good
- Shared chunks are normal
- Static routes marked with ○
- No errors or warnings

### Comparing to Vite

**Vite Build (Before):**
- Build output in dist/
- Typically 200-300KB
- Fast HMR

**Next.js Build (After):**
- Build output in .next/ and dist/
- Similar size 200-400KB
- Fast HMR + Better optimization

## Git Commit

Once all tests pass, commit your changes:

```bash
# Stage deletions and changes
git add -A

# Commit with clear message
git commit -m "Phase 8i: Complete Next.js migration build and test

- Remove Vite files (index.html, index.tsx, vite.config.ts)
- Remove backup files from migration
- Run successful production build
- Test production server
- Verify all 9 features functional in production
- Test AI features in production mode
- Confirm performance acceptable
- Validate bundle size reasonable

Build results:
- Next.js build completes successfully
- Static export working (output: 'export')
- All routes generated correctly
- Bundle size acceptable (< 500KB)

Testing:
- All views load correctly
- Navigation works
- Theme switching functions
- AI features operational
- Mobile responsive
- No critical console errors

Migration complete! Ready for deployment.

Next: Phase 8j - Deployment preparation"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If critical issues found:

```bash
# Revert to before file deletion
git reset --hard HEAD~1

# Or revert to before migration started
git log --oneline | grep "Phase 8a"
git reset --hard <commit-hash-before-8a>
```

## Next Steps

After completing Phase 8i:

1. **Review:** Confirm migration is complete and working
2. **Proceed:** Move to Phase 8j (Deployment Preparation)
3. **Document:** Note any issues or optimizations needed
4. **Celebrate:** Major migration milestone achieved! 🎉

**Phase 8j Preview:** Prepare for Vercel deployment and update documentation.

## Key Takeaways

### What We Accomplished

- ✅ Vite completely removed from project
- ✅ Next.js production build working
- ✅ All features tested and functional
- ✅ Performance validated
- ✅ Migration technically complete

### Migration Benefits

- **Better Performance**: Automatic code splitting, optimizations
- **Better DX**: Fast refresh, better error messages
- **Better Architecture**: File-system routing, API routes ready
- **Better Future**: Easy to add SSR, ISR, server components

### Important Notes

- Keep .env.local file (not in git)
- dist/ and .next/ in .gitignore
- Production build must complete before deployment
- Test thoroughly before deploying

## Testing Checklist

Complete this checklist before proceeding to Phase 8j:

### Build & Server
- [ ] npm run build completes successfully
- [ ] No build errors or critical warnings
- [ ] npm start launches production server
- [ ] App loads at localhost:3000

### Features
- [ ] All 9 views accessible and functional
- [ ] Navigation works between views
- [ ] Theme switching works
- [ ] Modals open and close correctly
- [ ] Keyboard shortcuts functional

### AI Features
- [ ] Dashboard trending topics load
- [ ] Composer AI Writer generates content
- [ ] AI features respond correctly
- [ ] No API key errors

### Performance
- [ ] Initial load time reasonable
- [ ] Navigation feels responsive
- [ ] No blocking console errors
- [ ] Bundle size acceptable

### Code Quality
- [ ] TypeScript compiles (npm run type-check)
- [ ] Linting passes (npm run lint)
- [ ] All Vite files removed
- [ ] Clean git status

## Phase Completion Checklist

Before proceeding to Phase 8j, verify:

- [ ] Vite files deleted (index.html, index.tsx, vite.config.ts)
- [ ] Production build successful
- [ ] Production server tested
- [ ] All features work in production
- [ ] Performance acceptable
- [ ] No critical errors
- [ ] Git commit created
- [ ] Testing checklist complete

## References

- [Next.js Building for Production](https://nextjs.org/docs/app/building-your-application/deploying)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Next.js Production Checklist](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist)

---

**Status:** Phase 8i Complete ✅
**Next Phase:** Phase 8j - Deployment Preparation
**Estimated Time for Next Phase:** 30-45 minutes
