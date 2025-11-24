# Technical Context: SocialFlow AI

## Overview

This document describes the technical stack, development environment, and tooling for SocialFlow AI's frontend application. The architecture is production-ready and now running on Next.js 16.

---

## Technology Stack

### Frontend Framework

**React 19.2.0** - Latest React with concurrent features, Server Components support (not used yet), improved hydration

**Why**: Modern, large ecosystem, excellent TypeScript support, performance improvements, team familiarity

### Build Tool

**Next.js 16.0.3** - React framework with Turbopack, automatic optimizations, built-in routing

**Why**: Industry standard, excellent DX, automatic code splitting, built-in optimizations, Vercel deployment

### Language

**TypeScript 5.8.2** - Strict type checking FULLY enabled, full IDE support, 100% type safety

**Why**: Prevents bugs, better refactoring, excellent tooling, industry standard, team collaboration

**Config**: `strict: true` enabled in tsconfig.json - all strict options active
- `jsx: "preserve"` for Next.js (proper JSX handling)
- `.next/types/**/*.ts` included for typed routes
- Next.js TypeScript plugin configured

**Type System Organization**: 4 modules for clean type organization
- `src/types/domain.ts` - Core domain types (Post, Draft, User, Platform, etc.)
- `src/types/ui.ts` - UI-specific types (ViewState, ToastType, etc.)
- `src/types/features.ts` - Feature-specific types (Workflow, Integration, etc.)
- `src/types/ai.ts` - AI service response types (WorkflowSuggestion, TrendingTopic, DraftAnalysis, Comment)
- `src/global.d.ts` - Global type declarations (Window/NodeJS interface extensions)

**Type Safety Achievement** (Phase 7b):
- Zero `any` types in codebase (18 eliminated across 10 files)
- Comprehensive AI service type definitions
- Proper Window and NodeJS.ProcessEnv extensions
- 100% type coverage with zero ESLint errors

### UI & Styling

**Tailwind CSS v4.1.17** - Utility-first CSS framework via npm + PostCSS

**Features**: Responsive design utilities, dark mode via `.dark` class, custom design tokens

**Config**: `tailwind.config.cjs` with `@import "tailwindcss"` in globals.css (v4 syntax)

**Design Tokens**:
- Primary: Indigo (600/500)
- Success: Emerald (500)
- Warning: Amber (500)
- Error: Rose (500)
- Neutral: Slate (50-950)

**Icons**: Lucide React (v0.554.0) - 1000+ icons, tree-shakeable, Tailwind-compatible

### Charts

**Recharts 3.4.1** - Declarative React chart library, responsive, clean design

**Usage**: Bar charts for engagement analytics (Dashboard), line charts planned

### AI Integration

**Google Gemini 1.30.0** (`@google/genai`)

**Why**: Free tier with generous limits, fast responses, multimodal support, cost-effective

**Config**: API key in `.env.local` (gitignored), accessed via `process.env.NEXT_PUBLIC_GEMINI_API_KEY`

## Development Environment

### Package Manager

**npm** - Lock file: `package-lock.json` (committed)

### Runtime

**Node.js 18+** - LTS version recommended

### Workflow

```bash
npm install          # First time setup
npm run dev          # Dev server (localhost:3000, or 3001 if 3000 in use)
npm run build        # Production build
npm start            # Preview production build
```

### Environment Variables

**Required**: `.env.local` file in project root

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Important**: Prefix with `NEXT_PUBLIC_` for client-side access, restart server after changes

**Get API Key**: https://ai.google.dev/ → Sign in → Create key

## Dependencies

### Production (Minimal by Design)

```json
{
  "next": "^16.0.3",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@google/genai": "^1.30.0",
  "lucide-react": "^0.554.0",
  "recharts": "^3.4.1"
}
```

**Bundle Size**: ~200KB gzipped (estimated)

### Development

```json
{
  "typescript": "~5.8.2",
  "@types/node": "^22.14.0",
  "tailwindcss": "^4.1.17",
  "@tailwindcss/postcss": "latest",
  "postcss": "^8.5.6",
  "autoprefixer": "^10.4.22",
  "eslint": "^9.39.1",
  "prettier": "^3.6.2",
  "vitest": "^4.0.13"
}
```

### Deliberately Avoided

- ❌ React Router (using ViewState enum with Next.js catch-all route)
- ❌ Redux/MobX (using local state)
- ❌ Axios (using fetch)
- ❌ Moment.js (using native Date)
- ❌ Lodash (using native JS)

**Why**: Smaller bundle, fewer vulnerabilities, less maintenance, faster install

## Browser Support

**Target**: Chrome/Edge 100+, Firefox 100+, Safari 15+

**Required**: ES2020, CSS Grid/Flexbox, CSS Variables, localStorage, Fetch API, matchMedia

**Graceful Degradation**: Fallback messages if AI fails, in-memory state if localStorage unavailable, default to light theme

## Code Quality Tools ✅

### ESLint

**Status**: Configured with Next.js 16 best practices

**Config**: `eslint.config.mjs` (ESM format, Next.js configuration)

**Rules**: 
- Next.js core-web-vitals (recommended + performance rules)
- TypeScript-eslint (type-aware linting)
- Prettier integration (no conflicts)
- Custom rules: no-unused-vars, no-explicit-any

**Package**: `eslint-config-next` (includes @next/eslint-plugin-next)

**Scripts**:
- `npm run lint` - Check for errors
- `npm run lint:fix` - Auto-fix where possible
- `npm run typegen` - Generate route types

**Current Status**: 
- ✅ 0 errors
- ⚠️ 20 warnings (img tags - Next.js suggestions, acceptable)

### Prettier

**Status**: Configured for consistent formatting

**Config**: `.prettierrc` (semi: true, singleQuote: false, tabWidth: 2, printWidth: 80)

**Scripts**:
- `npm run format` - Format all files
- `npm run format:check` - Check formatting (CI)

**Status**: All files formatted ✅

### Vitest

**Status**: Testing infrastructure configured (tests deferred to Phase 10)

**Config**: `vitest.config.ts` (jsdom environment, @testing-library/react, jest-dom matchers)

**Scripts**:
- `npm run test` - Watch mode (TDD)
- `npm run test:ui` - Interactive UI
- `npm run test:run` - Run once (CI)
- `npm run test:coverage` - Coverage report

**Setup**: `src/test/setup.ts` configures testing-library

### TypeScript

**Strict Mode**: ✅ Fully enabled (`strict: true` in tsconfig.json)

**Compile Status**: ✅ Zero errors with strict mode

**Additional Settings**:
- Typed routes enabled (via `typedRoutes: true` in next.config.ts)
- Typed environment variables (via `experimental.typedEnv: true`)
- Next.js TypeScript plugin active

**Verification**: `npm run type-check` passes with 0 errors

## Development Constraints

### No Backend (Yet)

**Current**: Pure frontend - no auth, no API, no database, state in memory (lost on refresh)

**Future**: Frontend (Next.js) → Backend (Node.js/Express or Next.js API routes) → Database (PostgreSQL) + AI/Social APIs

### API Rate Limits

**Gemini Free Tier**: 60 requests/min, 1,500/day

**Handling**: Try/catch with fallback messages, will add queuing/retry/caching later

### Local Storage

**Browser Limit**: ~5-10MB per domain

**Current Usage**: Theme preference (~10 bytes), Settings (~1KB)

**Future**: Posts, drafts, media, auth, analytics (requires backend)

### Performance Budgets

**Targets**: FCP < 1.5s, TTI < 3s, Lighthouse > 90, Bundle < 300KB gzipped

**Current**: ✅ Instant transitions (SPA), ✅ Fast HMR with Turbopack (~280ms startup), ⚠️ No code splitting/lazy loading yet

## Recommended Tools

### VS Code Extensions

1. **ESLint** - Linting
2. **Prettier** - Formatting
3. **TypeScript and JavaScript Language Features** - Built-in
4. **Tailwind CSS IntelliSense** - Class autocomplete
5. **Error Lens** - Inline errors

### Browser Extensions

**React DevTools** - Component tree, props/state inspection, performance profiling

## Git Workflow

**Remote**: git@github.com:noobskies/socialflow.git  
**Branch**: nextjs-migrate (migration branch), main (stable Vite version backup)

**Gitignore**: node_modules/, .next/, dist/, .env.local, .DS_Store, *.log, next-env.d.ts

**Commit Conventions** (recommended):
```
feat: Add trending topics widget
fix: Resolve calendar date parsing bug
docs: Update README
style: Format code with Prettier
refactor: Extract toast logic to custom hook
test: Add unit tests for geminiService
```

## Deployment

**Current**: Local development only (localhost:3001)

**Recommended Platform**: Vercel
- Zero-config Next.js deployment
- Automatic HTTPS
- Preview deployments for PRs
- Free tier sufficient for MVP

**Process**: 
1. Push to GitHub: `git push origin nextjs-migrate`
2. Connect repository to Vercel
3. Add `NEXT_PUBLIC_GEMINI_API_KEY` environment variable
4. Deploy automatically

## Security Considerations

### Current

**Good**:
- ✅ API key in environment variable (not in code)
- ✅ TypeScript prevents type bugs
- ✅ No user-generated content execution

**Risks**:
- ⚠️ API key exposed in client bundle (Next.js limitation for NEXT_PUBLIC_ vars)
- ⚠️ No input sanitization
- ⚠️ No rate limiting
- ⚠️ No authentication

### Future (With Backend)

1. Backend API proxy (hide API key - use Next.js API routes)
2. Input validation and sanitization
3. Authentication (NextAuth.js recommended)
4. Rate limiting and DDoS protection

## Known Technical Limitations

1. **Client-Side Only** - No SSR currently (using dynamic import with ssr: false)
2. **No Offline Support** - Requires internet
3. **Memory Constraints** - Large datasets may cause issues
4. **ViewState Routing** - Using catch-all route, not Next.js App Router yet
5. **Modern Browsers Only** - No IE11 support
6. **API Dependencies** - Relies on external services
7. **No Real-Time** - No WebSockets
8. **No File Storage** - Client-side only

## Path to Production

### Phase 1: Backend Setup (Next)
- Next.js API routes or Node.js/Express server
- PostgreSQL database
- NextAuth.js authentication
- Redis caching

### Phase 2: API Integration
- Social platform OAuth
- Real posting capabilities
- Analytics aggregation
- Webhook handling

### Phase 3: Scale & Optimize
- CDN for static assets
- Database indexing
- Caching strategies
- Load balancing

---

## Current Development Status

**Architecture**: ✅ Production-ready with feature-based organization  
**Tooling**: ✅ ESLint, Prettier, Vitest configured  
**Components**: ✅ 135+ focused components across 9 features  
**Custom Hooks**: ✅ 5 reusable + 9 feature-specific hooks  
**UI Library**: ✅ 4 reusable primitives (Button, Input, Modal, Card)  
**TypeScript**: ✅ Zero compilation errors (strict mode enabled)  
**Dev Server**: ✅ Working on port 3001 (Next.js 16.0.3 with Turbopack)  
**Bundle**: ~200KB gzipped (optimized for performance)  
**Test Infrastructure**: ✅ Vitest configured, ready for Phase 10  
**Migration Status**: ✅ Next.js migration COMPLETE

**Current Phase**: Phase 8 COMPLETE → Phase 9 Next (Backend Planning)

## Completed Migration: Vite to Next.js 16

### Migration Status: COMPLETE ✅ (November 24, 2025)

**Successfully migrated from Vite to Next.js:**
- All 10 phases executed (8a-8j, with 8h skipped)
- Zero breaking changes to all 135+ components
- Application running successfully
- Actual time: ~6-8 hours

### Technical Changes Completed

**Build System**:
- ✅ Migrated: Vite 6.2.0 → Next.js 16.0.3
- ✅ Benefit: Automatic code splitting, Turbopack HMR

**Styling**:
- ✅ Migrated: Tailwind CDN → Tailwind CSS v4.1.17 via npm
- ✅ New syntax: `@import "tailwindcss"` (v4 requirement)
- ✅ Benefit: Better build performance, proper versioning

**Dependencies**:
- ✅ Migrated: All dependencies now from npm (no import maps)
- ✅ Added: `@tailwindcss/postcss` for v4 compatibility
- ✅ Benefit: Better reliability, offline development

**Environment Variables**:
- ✅ Migrated: `VITE_GEMINI_API_KEY` → `NEXT_PUBLIC_GEMINI_API_KEY`
- ✅ Updated: `import.meta.env` → `process.env`
- ✅ Benefit: Consistent with Next.js conventions

**Routing**:
- ✅ Implemented: Proper Next.js App Router with route groups
- ✅ Architecture: Server/Client Component pattern with React Context
- ✅ Route groups: (content), (insights), (tools) for organization
- ✅ URLs: /, /composer, /calendar, /analytics, /inbox, /library, /links, /automations, /settings
- ✅ Benefits: Bookmarkable URLs, browser navigation, automatic code splitting

### Key Files Created

**Initial Migration (6 files):**
1. `next.config.ts` - Next.js configuration (TypeScript)
2. `src/app/layout.tsx` - Root layout with metadata
3. `src/app/globals.css` - Tailwind v4 + custom styles
4. `postcss.config.cjs` - PostCSS with Tailwind plugin
5. `tailwind.config.cjs` - Tailwind configuration

**Phase 8h App Router (11 files):**
6. `src/app/AppShell.tsx` - Client Component wrapper with state management
7. `src/app/AppContext.tsx` - React Context provider for global state
8-16. Nine `page.tsx` files with route groups:
   - `src/app/page.tsx` (Dashboard at /)
   - `src/app/(content)/composer/page.tsx`
   - `src/app/(content)/calendar/page.tsx`
   - `src/app/(content)/library/page.tsx`
   - `src/app/(insights)/analytics/page.tsx`
   - `src/app/(insights)/inbox/page.tsx`
   - `src/app/(tools)/links/page.tsx`
   - `src/app/(tools)/automations/page.tsx`
   - `src/app/settings/page.tsx`

### Key Files Modified

1. `package.json` - Updated scripts and dependencies (removed deprecated --ext flag)
2. `tsconfig.json` - Next.js TypeScript configuration with strict mode
3. `.gitignore` - Added `.next/` and `next-env.d.ts`
4. `.env.local` - Renamed environment variable
5. `src/services/geminiService.ts` - Updated env access
6. `src/global.d.ts` - Next.js type declarations
7. `eslint.config.mjs` - Complete rewrite for Next.js
8. `vitest.config.ts` - Removed Vite-specific plugin

### Key Files Deleted

**Vite Cleanup (3 files):**
1. `index.html` - Converted to layout.tsx
2. `index.tsx` - Logic moved to AppShell.tsx
3. `vite.config.ts` - Replaced by next.config.ts

**App Router Migration (2 files):**
4. `App.tsx` (root) - Logic moved to src/app/AppShell.tsx
5. `src/app/[[...slug]]/` folder - Replaced with proper route pages

**Configuration Cleanup (2 files):**
6. `eslint.config.js` - Replaced by eslint.config.mjs
7. `next.config.mjs` - Replaced by next.config.ts

### Critical Fixes During Migration

**Initial Migration:**
1. **Tailwind v4 Syntax**: Changed from `@tailwind` directives to `@import "tailwindcss"`
2. **Static Export**: Removed `output: 'export'` (incompatible with development server)
3. **Config Format**: Renamed `.js` to `.cjs` for CommonJS compatibility
4. **PostCSS Plugin**: Installed `@tailwindcss/postcss` for v4 compatibility
5. **Webpack Config**: Removed (unnecessary with Next.js)

**Phase 8h App Router:**
6. **Server/Client Components**: Added `"use client"` to AppShell.tsx and all page files
7. **React Context**: Created AppContext.tsx for global state management
8. **Route Groups**: Used (content), (insights), (tools) for logical organization
9. **Import Paths**: Used relative paths in route group pages (../../AppContext)
10. **Catch-all Removal**: Deleted [[...slug]] to prevent route conflicts

### Performance

**Dev Server**:
- Startup time: ~280ms (Turbopack)
- Hot reload: Near instant
- First compile: ~2s (normal)

## Deployment (Ready)

**Platform**: Vercel (recommended)

**Steps**:
1. Push code: `git push origin nextjs-migrate`
2. Import project to Vercel
3. Add environment variable: `NEXT_PUBLIC_GEMINI_API_KEY`
4. Deploy automatically

**Alternative**: Can deploy to Netlify, Cloudflare Pages, or any Node.js host

## Path Forward

### Next Phase: Backend Integration (Phase 9)

With Next.js in place, backend options include:

**Option 1: Next.js API Routes** (Recommended)
- Built-in API routes in `src/app/api/`
- Serverless functions on Vercel
- Easy integration with frontend

**Option 2: Separate Backend**
- Node.js/Express server
- Deploy separately (Railway, Render, etc.)
- More control but more complexity

**Recommendation**: Use Next.js API routes for simpler architecture
