# Phase 8a: Next.js Foundation Setup

**Estimated Time:** 30-45 minutes

## Overview

Install Next.js as the foundation framework and create initial configuration files. This phase establishes the groundwork for the migration without disrupting the existing Vite setup.

## Prerequisites

✅ Phase 7 complete: Frontend architecture production-ready
✅ Clean git working directory (commit all changes)
✅ Node.js 18+ installed
✅ npm working correctly

## Goals

1. Install Next.js 16 as a dependency
2. Create Next.js configuration file
3. Update .gitignore for Next.js artifacts
4. Verify installation successful
5. Document baseline for migration

## Phase Steps

### Step 1: Verify Clean State

Before beginning, ensure your working directory is clean:

```bash
# Check git status
git status

# Should show: "nothing to commit, working tree clean"
# If not, commit or stash changes first

# Verify current dev server works
npm run dev
# Open http://localhost:3000 and test one feature
# Stop server (Ctrl+C)
```

### Step 2: Install Next.js

Install Next.js as a production dependency:

```bash
# Install Next.js latest (should be 16.0.3+)
npm install next@latest

# Verify installation
npx next --version
# Should output: Next.js 16.x.x
```

**Expected output:** Next.js version 16.0.3 or higher installed in node_modules

**What's happening:**
- Next.js is added to package.json dependencies
- All Next.js packages downloaded to node_modules
- next CLI becomes available via npx

### Step 3: Create Next.js Configuration

Create `next.config.mjs` at the project root:

```bash
# Create the config file
touch next.config.mjs
```

Add the following content:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA)
  distDir: './dist', // Changes the build output directory to `./dist/`
}

export default nextConfig
```

**Configuration explained:**
- `output: 'export'`: Tells Next.js to generate a static SPA (same as Vite)
- `distDir: './dist'`: Keeps build output in same location as Vite
- `.mjs` extension: Uses ES modules (matches current project setup)

**Why these settings:**
- Minimizes migration risk by keeping SPA architecture initially
- Maintains same deployment structure as Vite
- Allows incremental adoption of Next.js features later

### Step 4: Update .gitignore

Add Next.js specific files to `.gitignore`:

```bash
# Open .gitignore and add these lines at the end:
```

Add to `.gitignore`:

```
# Next.js
.next
next-env.d.ts
```

**What to ignore:**
- `.next/`: Next.js build cache and dev artifacts
- `next-env.d.ts`: Auto-generated TypeScript declarations

**Note:** The `dist` directory is already ignored from Vite setup.

### Step 5: Verification Checklist

Verify the foundation is set up correctly:

- [ ] `next` appears in `package.json` dependencies section
- [ ] `next.config.mjs` exists at project root
- [ ] `next.config.mjs` has correct configuration
- [ ] `.gitignore` includes `.next` and `next-env.d.ts`
- [ ] `npx next --version` shows version 16.x.x
- [ ] Existing Vite dev server still works: `npm run dev`

**Critical:** The Vite dev server should still function normally. We haven't changed package.json scripts yet.

### Step 6: Document Baseline

Create a snapshot of current state for reference:

```bash
# Check package.json dependencies
npm list --depth=0 > docs/phases/baseline-dependencies.txt

# Note current bundle size (optional)
npm run build
du -sh dist/
```

**Save this information** for comparison after migration completes.

## Testing

### Verification Tests

1. **Next.js Installation:**
   ```bash
   npx next --version
   # Expected: 16.0.3 or higher
   ```

2. **Configuration File:**
   ```bash
   cat next.config.mjs
   # Expected: Shows export config with output and distDir
   ```

3. **Vite Still Works:**
   ```bash
   npm run dev
   # Expected: Vite dev server starts on port 3000
   # Open http://localhost:3000 and verify app loads
   # Stop server (Ctrl+C)
   ```

4. **Git Status:**
   ```bash
   git status
   # Expected: Shows new files (next.config.mjs, modified package.json, .gitignore)
   ```

### Success Criteria

✅ Next.js 16.x.x installed successfully
✅ next.config.mjs created with correct configuration
✅ .gitignore updated appropriately
✅ Vite dev server still works normally
✅ No console errors or warnings
✅ Git shows expected changes only

## Common Issues

### Issue: npm install fails

**Symptom:** Error during `npm install next@latest`

**Solutions:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Try again: `npm install next@latest`

### Issue: Version conflict

**Symptom:** npm reports peer dependency issues

**Solution:** This is expected. Next.js has specific React version requirements, but React 19 is supported. Warnings are safe to ignore if installation completes.

### Issue: npx next command not found

**Symptom:** `npx next --version` fails

**Solutions:**
- Verify installation: `ls node_modules/.bin/next`
- Try absolute path: `./node_modules/.bin/next --version`
- Reinstall Next.js: `npm install next@latest`

## Git Commit

Once all verification tests pass, commit your changes:

```bash
# Stage changes
git add package.json package-lock.json next.config.mjs .gitignore

# Commit with clear message
git commit -m "Phase 8a: Install Next.js and create foundation config

- Install next@16.x.x as production dependency
- Create next.config.mjs with SPA output mode
- Update .gitignore for Next.js artifacts
- Verify Vite still functional (no breaking changes)

Next: Phase 8b - TypeScript configuration updates"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If you need to undo this phase:

```bash
# Undo commit (keeps changes)
git reset --soft HEAD~1

# OR: Undo commit and changes
git reset --hard HEAD~1

# OR: Revert commit (creates new commit)
git revert HEAD

# Manually remove Next.js if needed
npm uninstall next
```

## Next Steps

After completing Phase 8a:

1. **Review:** Ensure all verification tests passed
2. **Proceed:** Move to Phase 8b (TypeScript Configuration)
3. **Document:** Note any issues encountered in Memory Bank

**Phase 8b Preview:** Update tsconfig.json with Next.js specific compiler options and type declarations.

## Key Takeaways

### What We Accomplished

- ✅ Next.js installed without breaking existing setup
- ✅ Configuration created for SPA mode (safe migration path)
- ✅ Git history clean with atomic commit
- ✅ Foundation ready for TypeScript updates

### Why This Approach

- **Minimal Risk:** Next.js installed but not yet used
- **Atomic Progress:** Can roll back easily if needed
- **Validation:** Existing Vite setup still works
- **Clear Path:** Ready for next phase

### Time Spent

**Actual time:** 30-45 minutes (as estimated)

**Breakdown:**
- Installation: 5-10 minutes
- Configuration: 10-15 minutes
- Verification: 10-15 minutes
- Documentation: 5 minutes

## Phase Completion Checklist

Before proceeding to Phase 8b, verify:

- [ ] Next.js 16.x.x installed in node_modules
- [ ] next.config.mjs exists with correct settings
- [ ] .gitignore updated with Next.js entries
- [ ] Vite dev server still works (`npm run dev`)
- [ ] No console errors when starting Vite
- [ ] Git commit created with clear message
- [ ] All files staged and committed
- [ ] npx next --version works correctly

## References

- [Next.js Installation Docs](https://nextjs.org/docs/getting-started/installation)
- [Next.js Configuration Options](https://nextjs.org/docs/app/api-reference/next-config-js)
- [Vite to Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

---

**Status:** Phase 8a Complete ✅
**Next Phase:** Phase 8b - TypeScript Configuration
**Estimated Time for Next Phase:** 20-30 minutes
