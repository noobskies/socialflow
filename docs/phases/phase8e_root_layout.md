# Phase 8e: Root Layout Creation

**Estimated Time:** 45-60 minutes

## Overview

Create Next.js root layout by converting index.html structure to layout.tsx component with Next.js Metadata API.

## Prerequisites

✅ Phase 8d complete: Tailwind CSS configured
✅ src/app/globals.css exists
✅ Clean git working directory

## Goals

1. Create src/app/layout.tsx root layout component
2. Migrate HTML structure from index.html
3. Implement Next.js Metadata API for SEO
4. Import globals.css for Tailwind styles
5. Remove CDN scripts and import maps

## Phase Steps

### Step 1: Backup index.html

Save current index.html for reference:

```bash
# Create backup
cp index.html index.html.backup

# View current structure
cat index.html
```

### Step 2: Create Root Layout

Create `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SocialFlow AI',
  description: 'AI-first social media management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Key components:**
- `Metadata` export: Defines page title and description (replaces `<title>` and `<meta>` tags)
- `import './globals.css'`: Loads Tailwind and custom styles
- `RootLayout`: Root component that wraps all pages
- `{children}`: Where page content renders

### Step 3: Understanding What Was Migrated

**From index.html:**
```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SocialFlow AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = {...}</script>
  <style>...</style>
  <script type="importmap">...</script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
```

**To layout.tsx:**
- ✅ `<meta charset>` - Automatically added by Next.js
- ✅ `<meta viewport>` - Automatically added by Next.js  
- ✅ `<title>` - Moved to metadata.title
- ✅ Tailwind CDN - REMOVED (using npm package)
- ✅ Tailwind config - REMOVED (using tailwind.config.js)
- ✅ Inline styles - MOVED to globals.css
- ✅ Import maps - REMOVED (using npm packages)
- ✅ `<body>` structure - Preserved with {children}
- ✅ Entry point - Will move to page.tsx (Phase 8f)

### Step 4: Verification Checklist

Verify root layout is created correctly:

- [ ] src/app/layout.tsx exists
- [ ] Layout imports globals.css
- [ ] metadata export includes title and description
- [ ] RootLayout function accepts children prop
- [ ] Returns html and body elements
- [ ] lang="en" attribute on html element

## Testing

### Verification Tests

1. **Layout File Exists:**
   ```bash
   ls -la src/app/layout.tsx
   # Expected: File exists
   ```

2. **Layout Syntax Valid:**
   ```bash
   npx tsc --noEmit src/app/layout.tsx
   # Expected: No errors
   ```

3. **Imports globals.css:**
   ```bash
   grep "import './globals.css'" src/app/layout.tsx
   # Expected: Found
   ```

4. **Has Metadata Export:**
   ```bash
   grep "export const metadata" src/app/layout.tsx
   # Expected: Found
   ```

5. **Structure Correct:**
   ```bash
   grep -A 5 "return" src/app/layout.tsx | grep "<html"
   # Expected: Shows html tag with lang attribute
   ```

### Success Criteria

✅ src/app/layout.tsx created
✅ Imports globals.css for styling
✅ Exports metadata object
✅ Returns html and body structure
✅ Accepts children prop
✅ TypeScript compilation successful

## Common Issues

### Issue: TypeScript errors in layout.tsx

**Symptom:** Type errors about Metadata or children

**Solutions:**
- Ensure `import type { Metadata } from 'next'` is present
- Verify children prop typed as `React.ReactNode`
- Check Next.js is installed: `npm list next`
- Restart TypeScript server in IDE

### Issue: globals.css not found

**Symptom:** Import error for './globals.css'

**Solutions:**
- Verify file exists: `ls src/app/globals.css`
- Check file path is correct (relative to layout.tsx)
- Use `'./globals.css'` not `'../globals.css'`

### Issue: Module not found 'next'

**Symptom:** Can't import from 'next'

**Solutions:**
- Install Next.js: `npm install next@latest`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check package.json has next in dependencies

## Comparison: index.html vs layout.tsx

### Before (index.html)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SocialFlow AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: { extend: { fontFamily: { sans: ["Inter", "sans-serif"] } } }
      };
    </script>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter...");
      body { font-family: "Inter", sans-serif; background-color: #f8fafc; }
      html.dark body { background-color: #020617; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      /* ... more styles ... */
    </style>
    <script type="importmap">
      { "imports": { "react": "https://aistudiocdn.com/react@^19.2.0", ... } }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

### After (layout.tsx + globals.css + tailwind.config.js)
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css' // Contains all styles

export const metadata: Metadata = {
  title: 'SocialFlow AI',
  description: 'AI-first social media management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Benefits:**
- ✅ SEO-optimized metadata
- ✅ TypeScript type safety
- ✅ No external CDN dependencies
- ✅ Proper separation of concerns
- ✅ Better performance (no runtime CSS compilation)
- ✅ Server-side rendering ready

## Layout.tsx Complete Code

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SocialFlow AI',
  description: 'AI-first social media management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Git Commit

Once all verification tests pass, commit your changes:

```bash
# Stage changes
git add src/app/layout.tsx

# Commit with clear message
git commit -m "Phase 8e: Create root layout from index.html

- Create src/app/layout.tsx with Next.js conventions
- Import globals.css for Tailwind and custom styles
- Implement Metadata API for title and description
- Use TypeScript for type safety
- Return html and body structure with children
- Remove dependency on CDN scripts
- Remove import maps (using npm packages)
- Prepare for SPA entry point in Phase 8f

Migrated from index.html:
- Page title and description to metadata object
- HTML structure to RootLayout component
- Styles to globals.css (Phase 8d)
- Tailwind config to tailwind.config.js (Phase 8d)

Next: Phase 8f - Create entry point with catch-all routing"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If you need to undo this phase:

```bash
# Remove layout file
rm src/app/layout.tsx

# Revert commit
git reset --hard HEAD~1
```

## Next Steps

After completing Phase 8e:

1. **Review:** Verify layout.tsx created correctly
2. **Proceed:** Move to Phase 8f (Entry Point Setup)
3. **Note:** App won't run yet - needs page.tsx from Phase 8f

**Phase 8f Preview:** Create app/[[...slug]]/page.tsx and client.tsx for SPA mode.

## Key Takeaways

### What We Accomplished

- ✅ Root layout created using Next.js conventions
- ✅ Metadata API implemented for SEO
- ✅ Styles properly imported via globals.css
- ✅ Type-safe component structure
- ✅ CDN dependencies eliminated

### Why This Approach

- **Metadata API**: Better SEO, crawlability, social sharing
- **TypeScript**: Type safety prevents runtime errors
- **Import globals.css**: Ensures styles load before render
- **Minimal structure**: Easy to understand and maintain

### Important Notes

- Next.js automatically adds charset and viewport meta tags
- Don't add `<head>` tag - Next.js manages it
- Don't add `#root` div - Next.js handles mounting
- Children prop is where page content renders
- Metadata can be dynamic (we'll use static for now)

## Phase Completion Checklist

Before proceeding to Phase 8f, verify:

- [ ] src/app/layout.tsx exists
- [ ] Layout imports './globals.css'
- [ ] metadata object exported with title and description
- [ ] RootLayout accepts children prop
- [ ] Returns html and body elements
- [ ] TypeScript compiles without errors
- [ ] Git commit created

## References

- [Next.js Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js File Conventions](https://nextjs.org/docs/app/getting-started/project-structure)

---

**Status:** Phase 8e Complete ✅
**Next Phase:** Phase 8f - Entry Point Setup
**Estimated Time for Next Phase:** 30-45 minutes
