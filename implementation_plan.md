# Implementation Plan: Vite to Next.js Migration

[Overview]
Migrate the SocialFlow AI application from Vite to Next.js 16 App Router while maintaining all existing functionality across 135+ components organized in 9 major features.

This migration addresses several critical architectural improvements: enabling automatic code splitting, eliminating network waterfalls through server-side rendering capabilities, providing built-in optimizations for images and fonts, and preparing the application for future backend integration. The current Vite-based SPA will be transformed into a Next.js application initially configured as a static export (SPA mode) to minimize risk, then incrementally adopt Next.js App Router features for improved performance and SEO. The migration follows a phased approach broken into 10 distinct stages, each focusing on a specific aspect of the migration to ensure safe, testable progress.

The application currently uses Tailwind CSS via CDN, dependencies via import maps from aistudiocdn.com, and a custom ViewState enum for routing. The migration will install Tailwind as a PostCSS plugin, convert all dependencies to npm packages, and replace the ViewState routing system with Next.js's file-system based App Router. All 135+ components organized using the orchestrator pattern will be preserved, with minimal modifications required only for routing and environment variable access patterns.

[Types]
Update TypeScript type definitions to support Next.js specific patterns and remove Vite-specific type declarations.

**Modified Types:**
- `src/global.d.ts`: Remove Vite's `ImportMetaEnv` interface, add Next.js specific Window interface extensions if needed
- `tsconfig.json`: Update compiler options to match Next.js requirements (jsx: "react-jsx", incremental: true, plugins: [{ "name": "next" }])

**No New Types Required:**
All existing domain types (Post, Draft, SocialAccount, etc.) remain unchanged. The ViewState enum will be replaced by Next.js routing, but this is handled through file structure rather than TypeScript types.

[Files]
Modify configuration files, create Next.js directory structure, and update imports across the codebase.

**New Files to Create:**
- `next.config.mjs`: Next.js configuration with output: 'export', distDir: './dist', basePath handling, Tailwind configuration
- `app/layout.tsx`: Root layout component converted from index.html, includes metadata API
- `app/[[...slug]]/page.tsx`: Catch-all route for SPA mode, exports generateStaticParams
- `app/[[...slug]]/client.tsx`: Client component wrapper that dynamically imports App.tsx with ssr: false
- `postcss.config.js`: PostCSS configuration for Tailwind CSS
- `tailwind.config.js`: Tailwind configuration migrated from inline script in index.html
- `.env`: Environment variable template file (NEXT_PUBLIC_GEMINI_API_KEY)
- `next-env.d.ts`: Auto-generated Next.js TypeScript declarations (via next dev)
- `docs/phases/phase8a_nextjs_foundation.md`: Foundation setup phase documentation
- `docs/phases/phase8b_typescript_config.md`: TypeScript configuration phase documentation
- `docs/phases/phase8c_dependencies.md`: Dependencies migration phase documentation
- `docs/phases/phase8d_tailwind_setup.md`: Tailwind CSS setup phase documentation
- `docs/phases/phase8e_root_layout.md`: Root layout creation phase documentation
- `docs/phases/phase8f_entry_point.md`: Entry point setup phase documentation
- `docs/phases/phase8g_env_variables.md`: Environment variables migration phase documentation
- `docs/phases/phase8h_router_migration.md`: Router migration phase documentation
- `docs/phases/phase8i_build_test.md`: Build and test phase documentation
- `docs/phases/phase8j_deployment.md`: Deployment preparation phase documentation

**Files to Modify:**
- `package.json`: Update scripts (dev: "next dev", build: "next build", start: "next start"), add Next.js dependencies, update existing dependencies
- `tsconfig.json`: Add Next.js specific compiler options, update include/exclude arrays, add plugins array
- `.gitignore`: Add `.next`, `next-env.d.ts`, update `dist` references
- `App.tsx`: Minimal changes - only environment variable access pattern (import.meta.env → process.env)
- `src/services/geminiService.ts`: Update environment variable access from VITE_GEMINI_API_KEY to NEXT_PUBLIC_GEMINI_API_KEY
- `src/global.d.ts`: Remove Vite-specific type declarations

**Files to Delete:**
- `index.html`: Content migrated to app/layout.tsx
- `index.tsx`: Logic moved to app/[[...slug]]/client.tsx
- `vite.config.ts`: Replaced by next.config.mjs
- `vite-env.d.ts`: Replaced by next-env.d.ts (if exists)

**Configuration File Updates:**
- Remove all CDN script tags and import maps from migrated HTML
- Move Tailwind config from inline JavaScript to proper config file
- Update all path aliases to work with Next.js (should work without changes)
- Migrate environment variable prefixes throughout codebase

[Functions]
No new functions required; existing functions remain unchanged except for environment variable access patterns.

**Modified Functions:**
- `geminiService.ts` - All 15 AI functions: Update API key access from `import.meta.env.VITE_GEMINI_API_KEY` to `process.env.NEXT_PUBLIC_GEMINI_API_KEY`

**New Functions:**
- `app/[[...slug]]/page.tsx` → `generateStaticParams()`: Returns `[{ slug: [''] }]` to generate only the index route statically
- `app/layout.tsx` → Root layout component: Returns JSX with html, body, and children structure
- `app/[[...slug]]/client.tsx` → `ClientOnly()`: Wraps dynamically imported App component with 'use client' directive

**No Functions Removed:**
All existing business logic, hooks, utilities, and component functions remain unchanged. The ViewState enum and related switch logic in App.tsx remains functional during initial migration (SPA mode), to be refactored in Phase 8h.

[Classes]
No classes exist in the current codebase; all components are functional components with hooks.

**No New Classes:**
Next.js migration uses functional components and hooks exclusively, maintaining consistency with existing architecture.

**No Modified Classes:**
Not applicable - codebase uses functional programming paradigm.

**No Removed Classes:**
Not applicable - no classes exist in current codebase.

[Dependencies]
Install Next.js and related packages while removing Vite dependencies and converting import maps to npm packages.

**New Dependencies (Production):**
- `next@latest` (^16.0.3): Next.js framework
- `tailwindcss@latest` (^3.4.0): Tailwind CSS as proper dependency
- `postcss@latest` (^8.4.0): PostCSS for Tailwind processing
- `autoprefixer@latest` (^10.4.0): CSS vendor prefixing

**Updated Dependencies (Production):**
- `react@^19.2.0`: Already installed, verify compatibility
- `react-dom@^19.2.0`: Already installed, verify compatibility
- `@google/genai@^1.30.0`: Already installed via npm, remove from import maps
- `lucide-react@^0.554.0`: Already installed via npm, remove from import maps
- `recharts@^3.4.1`: Already installed via npm, remove from import maps

**Removed Dependencies (Development):**
- `vite@^6.2.0`: Replaced by Next.js
- `@vitejs/plugin-react@^5.0.0`: Replaced by Next.js
- All Vite-specific plugins and configurations

**Development Dependencies to Add:**
- `@types/node@^22.14.0`: Already installed, ensure latest version
- Potentially `eslint-config-next` if setting up ESLint for Next.js

**Import Maps Removal:**
Remove all import map references from HTML pointing to `aistudiocdn.com` - all dependencies now loaded via npm packages and Next.js bundling.

[Testing]
Manual testing approach focusing on functional equivalence before and after migration, with automated testing deferred to Phase 10.

**Testing Strategy:**
Since comprehensive testing is deferred to Phase 10 (per project decision), this migration focuses on manual verification at each phase checkpoint. Each phase includes specific testing criteria to ensure functionality is preserved.

**Phase Testing Checkpoints:**
1. After Phase 8a-8f (Initial Setup): Verify `npm run dev` starts successfully, page loads at localhost:3000, no console errors
2. After Phase 8g (Environment Variables): Verify AI features work (trending topics, content generation)
3. After Phase 8h (Router Migration): Verify all 9 views accessible, navigation works, browser back/forward functions
4. After Phase 8i (Build & Test): Verify `npm run build` succeeds, `npm start` serves production build, all features work in production mode

**Manual Test Cases:**
- Theme switching (light/dark/system)
- Toast notifications display correctly
- Modal system functions (Command Palette, notifications, help, shortcuts)
- All 9 feature views render correctly
- Keyboard shortcuts work (Cmd+K, ?, c, ESC)
- Mobile responsive layout functions
- AI features generate content successfully
- Data persistence in localStorage works
- No regressions in component behavior

**Success Criteria:**
- Zero console errors in development and production
- All existing features function identically to Vite version
- Performance metrics match or exceed Vite (page load, HMR speed)
- Build succeeds without warnings
- Production bundle size acceptable (<300KB gzipped)

[Implementation Order]
Execute migration in 10 sequential phases, each building on the previous phase with clear validation checkpoints.

**Phase 8a: Foundation Setup** (30-45 minutes)
1. Install Next.js dependency: `npm install next@latest`
2. Create `next.config.mjs` with output: 'export', distDir: './dist'
3. Update `.gitignore` to include `.next` and `next-env.d.ts`
4. Create phase documentation file: `docs/phases/phase8a_nextjs_foundation.md`
5. Test: Verify Next.js is installed (`npx next --version`)
6. Commit: "Phase 8a: Install Next.js and create foundation config"

**Phase 8b: TypeScript Configuration** (20-30 minutes)
1. Update `tsconfig.json` with Next.js required compiler options
2. Add `next` plugin to compilerOptions.plugins array
3. Update include array to add `./dist/types/**/*.ts` and `./next-env.d.ts`
4. Add `./node_modules` to exclude array
5. Set jsx to "react-jsx", allowJs to true, incremental to true
6. Create phase documentation file: `docs/phases/phase8b_typescript_config.md`
7. Test: Verify TypeScript compiles (`npm run type-check`)
8. Commit: "Phase 8b: Update TypeScript configuration for Next.js"

**Phase 8c: Dependencies Migration** (45-60 minutes)
1. Install Tailwind dependencies: `npm install -D tailwindcss postcss autoprefixer`
2. Remove Vite dependencies: `npm uninstall vite @vitejs/plugin-react`
3. Verify all other dependencies already installed via npm (no import maps needed)
4. Create phase documentation file: `docs/phases/phase8c_dependencies.md`
5. Test: Verify `npm install` completes without errors
6. Commit: "Phase 8c: Migrate dependencies from Vite to Next.js"

**Phase 8d: Tailwind Setup** (30-45 minutes)
1. Initialize Tailwind: `npx tailwindcss init -p` (creates postcss.config.js and tailwind.config.js)
2. Update `tailwind.config.js` with content paths, darkMode: 'class', theme extensions from index.html
3. Create `src/app/globals.css` with Tailwind directives and custom styles from index.html
4. Remove Google Fonts import from HTML, add to layout later
5. Create phase documentation file: `docs/phases/phase8d_tailwind_setup.md`
6. Test: Verify Tailwind config is valid
7. Commit: "Phase 8d: Set up Tailwind CSS as PostCSS plugin"

**Phase 8e: Root Layout Creation** (45-60 minutes)
1. Create `src/app` directory
2. Create `src/app/layout.tsx` from `index.html` structure
3. Add metadata export with title and description
4. Import `globals.css` in layout
5. Add font optimization using next/font for Inter
6. Remove all script tags, import maps, CDN links
7. Keep only `<html>`, `<body>`, and `{children}` structure
8. Create phase documentation file: `docs/phases/phase8e_root_layout.md`
9. Test: Verify layout file syntax is correct
10. Commit: "Phase 8e: Create root layout from index.html"

**Phase 8f: Entry Point Setup** (30-45 minutes)
1. Create `src/app/[[...slug]]` directory (catch-all route)
2. Create `src/app/[[...slug]]/page.tsx` with generateStaticParams function
3. Create `src/app/[[...slug]]/client.tsx` with 'use client' and dynamic import of App
4. Import globals.css in page.tsx
5. Update page.tsx to render ClientOnly component
6. Create phase documentation file: `docs/phases/phase8f_entry_point.md`
7. Test: `npm run dev` should start Next.js dev server
8. Commit: "Phase 8f: Create entry point with catch-all routing"

**Phase 8g: Environment Variables** (20-30 minutes)
1. Copy `.env.local` to `.env` (if doesn't exist)
2. Rename `VITE_GEMINI_API_KEY` to `NEXT_PUBLIC_GEMINI_API_KEY` in .env files
3. Update `src/services/geminiService.ts` to use `process.env.NEXT_PUBLIC_GEMINI_API_KEY`
4. Update `src/global.d.ts` to remove Vite ImportMetaEnv interface
5. Add environment variable TypeScript declarations for Next.js if needed
6. Create phase documentation file: `docs/phases/phase8g_env_variables.md`
7. Test: Verify AI features work (trending topics load)
8. Commit: "Phase 8g: Migrate environment variables from Vite to Next.js"

**Phase 8h: Router Migration** (2-3 hours) - OPTIONAL for initial migration
1. This phase converts ViewState enum to Next.js App Router (can be deferred)
2. Create route structure: `app/dashboard/page.tsx`, `app/composer/page.tsx`, etc.
3. Update navigation to use Next.js Link components
4. Remove ViewState enum and switch statement from App.tsx
5. Move feature components to their respective route pages
6. Create phase documentation file: `docs/phases/phase8h_router_migration.md`
7. Test: Verify all routes work, browser back/forward functions
8. Commit: "Phase 8h: Migrate from ViewState to Next.js App Router"

**Phase 8i: Build & Test** (1-2 hours)
1. Update `package.json` scripts: dev, build, start, preview
2. Delete Vite-specific files: `index.html`, `index.tsx`, `vite.config.ts`
3. Run production build: `npm run build`
4. Test production build: `npm start` or `npm run preview`
5. Verify all features work in production mode
6. Check bundle size and performance
7. Run comprehensive manual testing checklist
8. Create phase documentation file: `docs/phases/phase8i_build_test.md`
9. Test: Complete manual testing checklist from phase doc
10. Commit: "Phase 8i: Complete build testing and cleanup"

**Phase 8j: Deployment Preparation** (30-45 minutes)
1. Create `vercel.json` if custom config needed
2. Update README.md with Next.js specific instructions
3. Document environment variables needed for deployment
4. Update Memory Bank files (activeContext.md, progress.md, systemPatterns.md)
5. Create deployment guide in phase documentation
6. Create phase documentation file: `docs/phases/phase8j_deployment.md`
7. Test: Verify deployment instructions are complete
8. Commit: "Phase 8j: Prepare for Vercel deployment"

**Validation Between Phases:**
- After each phase, run `npm run dev` to verify no breaking changes
- Check console for errors before proceeding to next phase
- Ensure TypeScript compilation succeeds
- Test one feature to verify basic functionality maintained

**Rollback Strategy:**
Each phase is committed separately, allowing easy rollback via `git reset --hard <commit-hash>` if issues arise. Phases 8a-8f must complete successfully before attempting 8g-8j. Phase 8h (Router Migration) can be deferred if time constraints exist.
