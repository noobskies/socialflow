# Phase 8c: Dependencies Migration

**Estimated Time:** 45-60 minutes

## Overview

Migrate from Vite dependencies to Next.js dependencies, install Tailwind CSS properly, and remove import maps. This phase transforms the dependency management from CDN-based to npm-based packages.

## Prerequisites

✅ Phase 8a complete: Next.js installed
✅ Phase 8b complete: TypeScript configured
✅ Clean git working directory

## Goals

1. Install Tailwind CSS, PostCSS, and Autoprefixer as dependencies
2. Remove Vite and Vite-specific packages
3. Verify all production dependencies are npm-installed (no import maps)
4. Update package.json scripts to use Next.js commands
5. Test that dependencies are correctly installed

## Phase Steps

### Step 1: Document Current Dependencies

Before making changes, document the current state:

```bash
# List current dependencies
npm list --depth=0 > docs/phases/dependencies-before-8c.txt

# View production dependencies
npm list --prod --depth=0
```

### Step 2: Install Tailwind CSS Dependencies

Install Tailwind CSS and related PostCSS tools:

```bash
# Install Tailwind CSS as dev dependencies
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Verify installation
npx tailwindcss --help
```

**Expected output:** Tailwind CSS 3.4.x or higher installed

**What's installed:**
- `tailwindcss`: Tailwind CSS framework
- `postcss`: CSS transformation tool (required by Tailwind)
- `autoprefixer`: Adds vendor prefixes automatically

### Step 3: Remove Vite Dependencies

Remove Vite and all Vite-specific packages:

```bash
# Remove Vite and plugin
npm uninstall vite @vitejs/plugin-react

# Verify removal
npm list vite
# Expected: "npm error code ELSPROBLEMS" (package not found)
```

**Packages being removed:**
- `vite`: Vite build tool (replaced by Next.js)
- `@vitejs/plugin-react`: Vite React plugin (not needed)

**Note:** Keep all other development dependencies (TypeScript, ESLint, Prettier, Vitest)

### Step 4: Verify Production Dependencies

Confirm all production dependencies are npm-installed (not using import maps):

```bash
# Check production dependencies
npm list --prod --depth=0

# Expected to see:
# - @google/genai
# - lucide-react
# - next
# - react
# - react-dom
# - recharts
```

**All dependencies should be present** - no import maps needed since all are already installed via npm.

### Step 5: Update package.json Scripts

Update the `scripts` section in `package.json`:

**Before (Vite):**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    // ... other scripts unchanged
  }
}
```

**After (Next.js):**
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

**Script changes:**
- `dev`: Changed from `vite` to `next dev`
- `build`: Changed from `tsc && vite build` to `next build`
- `start`: NEW - Runs Next.js production server
- Removed `preview` (replaced by `start`)
- All other scripts remain unchanged

### Step 6: Verification Checklist

Verify dependencies are correctly migrated:

- [ ] tailwindcss installed in devDependencies
- [ ] postcss installed in devDependencies
- [ ] autoprefixer installed in devDependencies
- [ ] vite removed from package.json
- [ ] @vitejs/plugin-react removed from package.json
- [ ] All production dependencies present (@google/genai, lucide-react, recharts, react, react-dom)
- [ ] package.json scripts updated (dev, build, start)
- [ ] npm install completes without errors

## Testing

### Verification Tests

1. **Dependencies Installed:**
   ```bash
   npm list --depth=0 | grep -E "tailwindcss|postcss|autoprefixer"
   # Expected: Shows all three packages with versions
   ```

2. **Vite Removed:**
   ```bash
   npm list vite 2>&1 | grep -i "not found"
   # Expected: Error message confirming vite not found
   ```

3. **Production Dependencies:**
   ```bash
   npm list --prod --depth=0
   # Expected: Shows all required dependencies
   ```

4. **Scripts Updated:**
   ```bash
   grep '"dev":' package.json
   # Expected: "dev": "next dev"
   
   grep '"build":' package.json
   # Expected: "build": "next build"
   ```

5. **Clean Install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   # Expected: Completes successfully
   ```

6. **Tailwind CLI Works:**
   ```bash
   npx tailwindcss --help
   # Expected: Shows Tailwind CSS help
   ```

### Success Criteria

✅ Tailwind CSS 3.4.x+ installed
✅ PostCSS and Autoprefixer installed
✅ Vite completely removed
✅ All production dependencies present
✅ package.json scripts updated correctly
✅ npm install completes without errors
✅ No peer dependency warnings (or expected ones only)

## Common Issues

### Issue: Peer dependency warnings

**Symptom:** npm shows peer dependency warnings during install

**Solution:** This is normal. Next.js, React 19, and Tailwind have complex peer dependencies. Warnings are safe to ignore if installation completes successfully.

### Issue: Tailwind CSS version conflict

**Symptom:** npm reports version conflicts with Tailwind

**Solutions:**
- Force install: `npm install -D tailwindcss@latest --force`
- Clear cache: `npm cache clean --force`
- Delete and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Issue: Cannot find module 'next'

**Symptom:** Error when trying to run next commands

**Solution:**
- Ensure Next.js installed: `npm list next`
- Reinstall if needed: `npm install next@latest`
- Clear cache: `npm cache clean --force && npm install`

### Issue: Scripts don't work

**Symptom:** `npm run dev` fails with command not found

**Solutions:**
- Verify package.json scripts section is valid JSON
- Check for typos in script names
- Ensure quotes are correct (use double quotes)
- Run `npm install` to regenerate binaries

## Dependency Comparison

### Before Migration

**Production:**
- react@19.2.0
- react-dom@19.2.0
- @google/genai@1.30.0
- lucide-react@0.554.0
- recharts@3.4.1

**Development:**
- vite@6.2.0
- @vitejs/plugin-react@5.0.0
- typescript@5.8.2
- (+ testing and linting tools)

**Import Maps:**
- Using aistudiocdn.com for React/Recharts/etc.

### After Migration

**Production:**
- next@16.0.3+ (NEW)
- react@19.2.0
- react-dom@19.2.0
- @google/genai@1.30.0
- lucide-react@0.554.0
- recharts@3.4.1

**Development:**
- tailwindcss@3.4.x (NEW)
- postcss@8.4.x (NEW)
- autoprefixer@10.4.x (NEW)
- typescript@5.8.2
- (vite REMOVED)
- (+ testing and linting tools)

**Import Maps:**
- None - all dependencies from npm

## Package.json Scripts Explanation

**Development Scripts:**
- `dev`: Starts Next.js development server with Hot Module Replacement
- `build`: Builds production-optimized Next.js application
- `start`: Runs production Next.js server (for testing builds locally)

**Quality Scripts (unchanged):**
- `lint` / `lint:fix`: ESLint code quality checks
- `format` / `format:check`: Prettier code formatting
- `test` / `test:ui` / `test:run` / `test:coverage`: Vitest testing
- `type-check`: TypeScript type checking

## Git Commit

Once all verification tests pass, commit your changes:

```bash
# Stage changes
git add package.json package-lock.json

# Commit with clear message
git commit -m "Phase 8c: Migrate dependencies from Vite to Next.js

- Install Tailwind CSS, PostCSS, and Autoprefixer as dev dependencies
- Remove Vite and @vitejs/plugin-react
- Update package.json scripts (dev, build, start)
- Remove preview script (replaced by start)
- Verify all production dependencies npm-installed
- All dependencies now from npm (no import maps)

Dependencies summary:
- Added: tailwindcss@3.4.x, postcss@8.4.x, autoprefixer@10.4.x
- Removed: vite@6.2.0, @vitejs/plugin-react@5.0.0
- Updated scripts for Next.js commands

Next: Phase 8d - Tailwind CSS configuration"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If you need to undo this phase:

```bash
# Revert commit
git reset --hard HEAD~1

# Reinstall dependencies
npm install

# Or restore from backup
git checkout HEAD~1 -- package.json package-lock.json
npm install
```

## Next Steps

After completing Phase 8c:

1. **Review:** Verify all dependencies installed correctly
2. **Proceed:** Move to Phase 8d (Tailwind CSS Setup)
3. **Test:** Run `npm install` one more time to ensure clean state

**Phase 8d Preview:** Initialize Tailwind CSS configuration and create globals.css file.

## Key Takeaways

### What We Accomplished

- ✅ Tailwind CSS installed as proper npm dependency
- ✅ Vite completely removed from project
- ✅ Import maps eliminated (all dependencies from npm)
- ✅ Scripts updated for Next.js commands
- ✅ Clean dependency tree

### Why These Changes

- **Tailwind as dependency**: Better control, faster builds, proper versioning
- **Remove Vite**: No longer needed with Next.js
- **Remove import maps**: Unreliable, slow, npm is better
- **Update scripts**: Use Next.js build system instead of Vite

### Important Notes

- Don't run `npm run dev` yet - Next.js not fully configured
- Scripts won't work until Phase 8f (entry point creation)
- Keep all testing and linting dependencies unchanged
- Peer dependency warnings are normal and safe

## Phase Completion Checklist

Before proceeding to Phase 8d, verify:

- [ ] Tailwind CSS 3.4.x+ installed
- [ ] PostCSS and Autoprefixer installed
- [ ] Vite removed from package.json
- [ ] All production dependencies present
- [ ] Scripts updated (dev, build, start)
- [ ] npm install completes successfully
- [ ] No blocking errors (warnings OK)
- [ ] Git commit created

## References

- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation)
- [Next.js Installation](https://nextjs.org/docs/getting-started/installation)
- [PostCSS Documentation](https://postcss.org/)
- [npm Scripts Documentation](https://docs.npmjs.com/cli/v9/using-npm/scripts)

---

**Status:** Phase 8c Complete ✅
**Next Phase:** Phase 8d - Tailwind CSS Setup
**Estimated Time for Next Phase:** 30-45 minutes
