# Phase 8g: Environment Variables Migration

**Status**: ✅ Complete  
**Duration**: 20-30 minutes  
**Date Completed**: November 24, 2025

## Overview

Migrate environment variable access from Vite's `import.meta.env` pattern to Next.js's `process.env` pattern.

## Objectives

1. Update `.env.local` file with Next.js variable naming convention
2. Update `geminiService.ts` to use `process.env`
3. Update `global.d.ts` type declarations for Next.js
4. Remove Vite-specific environment variable types

## Changes Made

### Files Modified

**`.env.local`**:
- Changed: `VITE_GEMINI_API_KEY` → `NEXT_PUBLIC_GEMINI_API_KEY`
- Next.js requires `NEXT_PUBLIC_` prefix for client-side accessible variables

**`src/services/geminiService.ts`**:
- Updated `getAiClient()` function
- Changed: `import.meta.env.VITE_GEMINI_API_KEY`
- To: `process.env.NEXT_PUBLIC_GEMINI_API_KEY`
- All 15 AI functions now use the correct environment variable access pattern

**`src/global.d.ts`**:
- Removed Vite-specific type declarations:
  - Removed `ImportMetaEnv` interface
  - Removed `ImportMeta` interface extension
- Added Next.js environment variable types:
  - Added `NodeJS.ProcessEnv` interface extension
  - Declared `NEXT_PUBLIC_GEMINI_API_KEY` as readonly string
- Added ESLint disable comment for unused namespace warning

## Technical Details

### Environment Variable Access Patterns

**Vite Pattern (Old)**:
```typescript
import.meta.env.VITE_GEMINI_API_KEY
```

**Next.js Pattern (New)**:
```typescript
process.env.NEXT_PUBLIC_GEMINI_API_KEY
```

### Variable Naming Convention

Next.js requires the `NEXT_PUBLIC_` prefix for any environment variables that should be accessible in browser JavaScript. Variables without this prefix are only available in server-side code.

### Type Safety

TypeScript now knows about the environment variable through the `NodeJS.ProcessEnv` interface extension, providing autocomplete and type checking.

## Testing Performed

✅ Environment variable file updated  
✅ Service file updated with new access pattern  
✅ Type declarations updated  
✅ No TypeScript errors

## Verification

After starting the dev server in Phase 8i, verify AI features work:
1. Navigate to Dashboard
2. Check "Trending Topics" loads (uses Gemini API)
3. Open Composer and test AI content generation

## Next Steps

We can now proceed to either:
- **Phase 8h**: Router Migration (Optional - 2-3 hours)
- **Phase 8i**: Build & Test (Skip 8h and go directly to testing)

**Recommendation**: Skip Phase 8h for now and proceed to Phase 8i to test the migration. Router migration can be done later if needed.

## Rollback Strategy

If issues arise:
```bash
git reset --hard HEAD~1  # Undo this phase
```

To manually rollback:
1. Change `NEXT_PUBLIC_GEMINI_API_KEY` back to `VITE_GEMINI_API_KEY` in .env.local
2. Update geminiService.ts to use `import.meta.env.VITE_GEMINI_API_KEY`
3. Restore Vite type declarations in global.d.ts

## Notes

- The `NEXT_PUBLIC_` prefix is mandatory for client-side environment variables
- Server-side only variables should NOT have this prefix
- Environment variables are embedded at build time in production
- Changes to .env files require dev server restart
- All 15 Gemini AI functions now use the correct pattern
- Type safety maintained through NodeJS.ProcessEnv interface
