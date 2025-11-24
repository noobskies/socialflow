# Phase 8g: Environment Variables Migration

**Estimated Time:** 20-30 minutes

## Overview

Migrate environment variables from Vite's VITE_ prefix to Next.js's NEXT_PUBLIC_ prefix and update all code references.

## Prerequisites

✅ Phase 8f complete: Next.js dev server working
✅ App loading successfully at localhost:3000
✅ Clean git working directory

## Goals

1. Update .env.local file with NEXT_PUBLIC_ prefix
2. Update geminiService.ts to use process.env instead of import.meta.env
3. Remove Vite-specific type declarations
4. Verify AI features work with new environment variables
5. Test environment variable access in production build

## Phase Steps

### Step 1: Backup Environment File

Save current environment configuration:

```bash
# Backup .env.local
cp .env.local .env.local.backup

# View current variables
cat .env.local
```

### Step 2: Update .env.local

Update environment variable prefix:

**Before:**
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**After:**
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Important:** Replace `your_api_key_here` with your actual Gemini API key.

### Step 3: Update geminiService.ts

Update `src/services/geminiService.ts` to use Next.js environment variable:

**Find this line:**
```typescript
new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
```

**Replace with:**
```typescript
new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
```

**Complete updated section:**
```typescript
const genAI =
  new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
```

### Step 4: Update src/global.d.ts (if exists)

Remove Vite-specific type declarations if present:

**Check if file has Vite types:**
```bash
grep -i "vite\|import.*meta" src/global.d.ts
```

**If found, remove these lines:**
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**Optionally add Next.js env types:**
```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GEMINI_API_KEY: string
  }
}
```

### Step 5: Restart Dev Server

Environment variables require server restart:

```bash
# Stop current dev server (Ctrl+C)

# Start dev server with new env variables
npm run dev

# Wait for server to start
# Open http://localhost:3000
```

### Step 6: Verification Checklist

Verify environment variables work:

- [ ] .env.local updated with NEXT_PUBLIC_ prefix
- [ ] geminiService.ts uses process.env.NEXT_PUBLIC_GEMINI_API_KEY
- [ ] global.d.ts cleaned of Vite references (if applicable)
- [ ] Dev server restarted
- [ ] No console errors about missing API key

## Testing

### Verification Tests

1. **Environment Variable Set:**
   ```bash
   grep "NEXT_PUBLIC_GEMINI_API_KEY" .env.local
   # Expected: Shows the environment variable
   ```

2. **Code Updated:**
   ```bash
   grep "process.env.NEXT_PUBLIC_GEMINI_API_KEY" src/services/geminiService.ts
   # Expected: Shows updated code
   ```

3. **No Vite References:**
   ```bash
   grep -r "import.meta.env" --include="*.ts" --include="*.tsx" src/
   # Expected: No results (or only in comments)
   ```

4. **Test AI Features:**
   - Open http://localhost:3000
   - Navigate to Dashboard
   - Click "Refresh" on Trending Topics widget
   - Should load AI-generated trends
   - Navigate to Composer
   - Click AI Writer tab
   - Generate content
   - Should work without errors

### Success Criteria

✅ .env.local uses NEXT_PUBLIC_ prefix
✅ geminiService.ts updated to process.env
✅ No Vite environment variable references remain
✅ Dev server starts successfully
✅ AI features work (trending topics load, content generates)
✅ No console errors about missing API key

## Common Issues

### Issue: API key not found

**Symptom:** Console error: "API key is undefined" or AI features don't work

**Solutions:**
- Verify .env.local has NEXT_PUBLIC_GEMINI_API_KEY
- Check for typos in variable name
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
- Verify API key value is correct (no quotes, no spaces)
- Check .env.local is in project root (not in src/)

### Issue: import.meta.env still referenced

**Symptom:** TypeScript error or runtime error

**Solutions:**
- Search all files: `grep -r "import.meta.env" src/`
- Update all occurrences to `process.env`
- Check App.tsx doesn't use Vite env variables
- Restart TypeScript server in IDE

### Issue: Environment variable empty in browser

**Symptom:** process.env.NEXT_PUBLIC_GEMINI_API_KEY is undefined at runtime

**Solutions:**
- Ensure prefix is NEXT_PUBLIC_ (required for client-side access)
- Restart dev server after .env.local changes
- Check .env.local is not in .gitignore (should be)
- Verify no trailing spaces in .env.local

### Issue: TypeScript errors about process.env

**Symptom:** TS error: Property 'NEXT_PUBLIC_GEMINI_API_KEY' does not exist

**Solution:**
- Add type declaration in src/global.d.ts (Step 4)
- Restart TypeScript server in IDE
- Run `npm run type-check` to verify

## Environment Variables Comparison

### Before (Vite)

**.env.local:**
```bash
VITE_GEMINI_API_KEY=abc123...
```

**Code:**
```typescript
import.meta.env.VITE_GEMINI_API_KEY
```

**Access:** Client-side only via import.meta.env

### After (Next.js)

**.env.local:**
```bash
NEXT_PUBLIC_GEMINI_API_KEY=abc123...
```

**Code:**
```typescript
process.env.NEXT_PUBLIC_GEMINI_API_KEY
```

**Access:** Client-side and server-side via process.env

**Key Differences:**
- Prefix changed: VITE_ → NEXT_PUBLIC_
- Access method: import.meta.env → process.env
- Availability: Client-only → Client and server

## Git Commit

Once all verification tests pass, commit your changes:

```bash
# Stage changes
git add .env.local src/services/geminiService.ts src/global.d.ts

# Commit with clear message
git commit -m "Phase 8g: Migrate environment variables to Next.js

- Rename VITE_GEMINI_API_KEY to NEXT_PUBLIC_GEMINI_API_KEY in .env.local
- Update geminiService.ts to use process.env instead of import.meta.env
- Remove Vite-specific type declarations from global.d.ts
- Add Next.js environment variable types
- Restart dev server to load new variables
- Verify AI features work with new configuration

Environment variable changes:
- Before: import.meta.env.VITE_GEMINI_API_KEY
- After: process.env.NEXT_PUBLIC_GEMINI_API_KEY

Testing:
- AI trending topics load successfully
- AI content generation works
- No console errors about missing API key

Next: Phase 8h - Router migration (optional)"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If you need to undo this phase:

```bash
# Restore environment file
cp .env.local.backup .env.local

# Revert code changes
git reset --hard HEAD~1

# Restart dev server
npm run dev
```

## Next Steps

After completing Phase 8g:

1. **Test:** Verify all AI features work
2. **Proceed:** Move to Phase 8h (Router Migration - Optional)
3. **OR:** Skip to Phase 8i (Build & Test) if keeping SPA mode

**Phase 8h Preview:** Migrate from ViewState enum to Next.js App Router (2-3 hours, optional).

## Key Takeaways

### What We Accomplished

- ✅ Environment variables migrated to Next.js convention
- ✅ All code updated to use process.env
- ✅ Vite references removed
- ✅ AI features verified working
- ✅ Type safety maintained

### Why NEXT_PUBLIC_ Prefix

- **Client-side access**: NEXT_PUBLIC_ variables exposed to browser
- **Security**: Variables without prefix are server-only
- **Convention**: Next.js standard for public environment variables
- **Build-time injection**: Values embedded during build

### Important Notes

- Only NEXT_PUBLIC_ prefixed variables are accessible in browser
- Server-only secrets should NOT have NEXT_PUBLIC_ prefix
- Environment variables are read at build time
- Changes require dev server restart
- .env.local should be in .gitignore

## Testing Checklist

Test these AI features in browser:

- [ ] Dashboard: Refresh Trending Topics works
- [ ] Composer: AI Writer generates content
- [ ] Composer: AI Writer generates variations
- [ ] Composer: AI Designer (if implemented)
- [ ] No console errors about API key
- [ ] AI responses are relevant and formatted correctly

## Phase Completion Checklist

Before proceeding to Phase 8h, verify:

- [ ] .env.local has NEXT_PUBLIC_GEMINI_API_KEY
- [ ] geminiService.ts uses process.env
- [ ] No import.meta.env references remain
- [ ] global.d.ts cleaned of Vite types
- [ ] Dev server restarted successfully
- [ ] AI features tested and working
- [ ] Git commit created

## References

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Next.js Runtime Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#runtime-environment-variables)
- [Vite to Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

---

**Status:** Phase 8g Complete ✅
**Next Phase:** Phase 8h - Router Migration (Optional) OR Phase 8i - Build & Test
**Estimated Time for Phase 8h:** 2-3 hours (optional)
**Estimated Time for Phase 8i:** 1-2 hours (if skipping 8h)
