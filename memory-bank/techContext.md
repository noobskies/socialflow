# Technical Context: SocialFlow AI

## Overview

This document describes the technical stack, development environment, and tooling for SocialFlow AI's frontend application. The architecture is production-ready and prepared for backend integration.

---

## Technology Stack

### Frontend Framework

**React 19.2.0** - Latest React with concurrent features, Server Components support (not used yet), improved hydration

**Why**: Modern, large ecosystem, excellent TypeScript support, performance improvements, team familiarity

### Build Tool

**Vite 6.2.0** - Lightning-fast HMR, ESM-first, optimized production builds

**Why**: 10x faster than CRA, simple config, instant updates, modern tooling (esbuild, Rollup)

### Language

**TypeScript 5.8.2** - Strict type checking enabled, full IDE support, 100% type safety

**Why**: Prevents bugs, better refactoring, excellent tooling, industry standard, team collaboration

**Config**: Strict mode enabled - `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`

**Type System Organization**: 4 modules for clean type organization
- `src/types/domain.ts` - Core domain types (Post, Draft, User, Platform, etc.)
- `src/types/ui.ts` - UI-specific types (ViewState, ToastType, etc.)
- `src/types/features.ts` - Feature-specific types (Workflow, Integration, etc.)
- `src/types/ai.ts` - AI service response types (WorkflowSuggestion, TrendingTopic, DraftAnalysis, Comment)
- `src/global.d.ts` - Global type declarations (Window interface extensions for external APIs)

**Type Safety Achievement** (Phase 7b):
- Zero `any` types in codebase (18 eliminated across 10 files)
- Comprehensive AI service type definitions
- Proper Window API extensions for external libraries
- 100% type coverage with zero ESLint errors

### UI & Styling

**Tailwind CSS** - Utility-first CSS framework via CDN/classes

**Features**: Responsive design utilities, dark mode via `.dark` class, custom design tokens

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

**Config**: API key in `.env.local` (gitignored), accessed via `import.meta.env.VITE_GEMINI_API_KEY`

## Development Environment

### Package Manager

**npm** - Lock file: `package-lock.json` (committed)

### Runtime

**Node.js 18+** - LTS version recommended

### Workflow

```bash
npm install          # First time setup
npm run dev          # Dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Environment Variables

**Required**: `.env.local` file in project root

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important**: Prefix with `VITE_` for client-side access, restart server after changes

**Get API Key**: https://ai.google.dev/ → Sign in → Create key

## Dependencies

### Production (Minimal by Design)

```json
{
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
  "@vitejs/plugin-react": "^5.0.0",
  "vite": "^6.2.0"
}
```

### Deliberately Avoided

- ❌ React Router (using ViewState enum)
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

### ESLint (Phase 0a Complete)

**Status**: Configured with React/TypeScript recommended rules

**Config**: `eslint.config.js` (ESM format)

**Rules**: React Hooks enforcement, TypeScript type safety, no explicit `any`, unused variables

**Scripts**:
- `npm run lint` - Check for errors
- `npm run lint:fix` - Auto-fix where possible

**Current**: 77 errors, 2 warnings (will fix during refactoring)

### Prettier (Phase 0a Complete)

**Status**: Configured for consistent formatting

**Config**: `.prettierrc` (semi: true, singleQuote: false, tabWidth: 2, printWidth: 80)

**Scripts**:
- `npm run format` - Format all files
- `npm run format:check` - Check formatting (CI)

**Result**: 25 files formatted across entire codebase

### Vitest (Phase 0a Complete)

**Status**: Testing infrastructure configured (no tests written yet)

**Config**: `vitest.config.ts` (jsdom environment, @testing-library/react, jest-dom matchers)

**Scripts**:
- `npm run test` - Watch mode (TDD)
- `npm run test:ui` - Interactive UI
- `npm run test:run` - Run once (CI)
- `npm run test:coverage` - Coverage report

**Setup**: `src/test/setup.ts` configures testing-library

**Note**: Tests will be written in Phase 7

### TypeScript

**Strict Mode**: Enabled completely

**Compile Status**: ✅ Zero errors

## Development Constraints

### No Backend (Yet)

**Current**: Pure frontend - no auth, no API, no database, state in memory (lost on refresh)

**Future**: Frontend (Vite) → Backend (Node.js/Express) → Database (PostgreSQL) + AI/Social APIs

### API Rate Limits

**Gemini Free Tier**: 60 requests/min, 1,500/day

**Handling**: Try/catch with fallback messages, will add queuing/retry/caching later

### Local Storage

**Browser Limit**: ~5-10MB per domain

**Current Usage**: Theme preference (~10 bytes), Settings (~1KB)

**Future**: Posts, drafts, media, auth, analytics (requires backend)

### Performance Budgets

**Targets**: FCP < 1.5s, TTI < 3s, Lighthouse > 90, Bundle < 300KB gzipped

**Current**: ✅ Instant transitions (SPA), ✅ Fast HMR, ⚠️ No code splitting/lazy loading yet

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
**Branch**: main (single branch for MVP)

**Gitignore**: node_modules/, dist/, .env.local, .DS_Store, *.log

**Commit Conventions** (recommended):
```
feat: Add trending topics widget
fix: Resolve calendar date parsing bug
docs: Update README
style: Format code with Prettier
refactor: Extract toast logic to custom hook
test: Add unit tests for geminiService
```

## Deployment (Planned)

**Current**: Not deployed - local development only (localhost:5173)

**Recommended Platform**: Vercel
- Zero-config React deployment
- Automatic HTTPS
- Preview deployments for PRs
- Free tier sufficient for MVP

**Process**: `npm run build` → Deploy to Vercel → Add `VITE_GEMINI_API_KEY` in dashboard

## Security Considerations

### Current

**Good**:
- ✅ API key in environment variable (not in code)
- ✅ TypeScript prevents type bugs
- ✅ No user-generated content execution

**Risks**:
- ⚠️ API key exposed in client bundle (Vite limitation)
- ⚠️ No input sanitization
- ⚠️ No rate limiting
- ⚠️ No authentication

### Future (With Backend)

1. Backend API proxy (hide API key)
2. Input validation and sanitization
3. Authentication (JWT/OAuth)
4. Rate limiting and DDoS protection

## Known Technical Limitations

1. **Client-Side Only** - No SSR or data persistence
2. **No Offline Support** - Requires internet
3. **Memory Constraints** - Large datasets may cause issues
4. **No Code Splitting** - All code loaded upfront
5. **Modern Browsers Only** - No IE11 support
6. **API Dependencies** - Relies on external services
7. **No Real-Time** - No WebSockets
8. **No File Storage** - Client-side only

## Path to Production

### Phase 1: Backend Setup (Future)
- Node.js/Express server
- PostgreSQL database
- JWT authentication
- Redis caching

### Phase 2: API Integration (Future)
- Social platform OAuth
- Real posting capabilities
- Analytics aggregation
- Webhook handling

### Phase 3: Scale & Optimize (Future)
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
**Dev Server**: ✅ Working on port 3000 (Vite)  
**Bundle**: ~200KB gzipped (optimized for performance)  
**Test Infrastructure**: ✅ Vitest configured, ready for Phase 10  
**Migration Planning**: ✅ Next.js migration plan complete

**Current Phase**: Phase 8 (Planning) - Complete  
**Next Options**: Execute Next.js Migration OR Backend Planning

## Planned Migration: Vite to Next.js 16

### Migration Status: Planning Complete ✅

**Comprehensive migration plan created** (November 23, 2025):
- 10 detailed phases documented (8a-8j)
- Implementation plan with all technical specifications
- Zero breaking changes expected
- All 135+ components preserved
- Estimated execution time: 8-12 hours

### Technical Changes Planned

**Build System**:
- Current: Vite 6.2.0
- Future: Next.js 16.0.3+ (App Router)
- Benefit: Automatic code splitting, better optimizations

**Styling**:
- Current: Tailwind CSS via CDN + inline config
- Future: Tailwind CSS via npm + PostCSS
- Benefit: Better build performance, proper versioning

**Dependencies**:
- Current: Import maps from aistudiocdn.com
- Future: All dependencies from npm packages
- Benefit: Better reliability, offline development

**Environment Variables**:
- Current: `VITE_GEMINI_API_KEY` via import.meta.env
- Future: `NEXT_PUBLIC_GEMINI_API_KEY` via process.env
- Benefit: Consistent with Next.js conventions

**Routing**:
- Current: ViewState enum with switch statement
- Phase 1: Catch-all route (SPA mode) - preserves current behavior
- Phase 2: Next.js App Router (optional upgrade)
- Benefit: URL-based routing, better SEO

### Migration Phases Overview

1. **Phase 8a**: Install Next.js, create config (30-45 min)
2. **Phase 8b**: Update TypeScript configuration (20-30 min)
3. **Phase 8c**: Migrate dependencies (45-60 min)
4. **Phase 8d**: Setup Tailwind CSS properly (30-45 min)
5. **Phase 8e**: Create root layout from index.html (45-60 min)
6. **Phase 8f**: Setup entry point with catch-all route (30-45 min)
7. **Phase 8g**: Migrate environment variables (20-30 min)
8. **Phase 8h**: Router migration - OPTIONAL (2-3 hours)
9. **Phase 8i**: Build and test production (1-2 hours)
10. **Phase 8j**: Deployment preparation (30-45 min)

### Why Next.js?

**Performance Benefits**:
- Automatic code splitting (better than manual)
- Optimized production builds
- Built-in image/font optimization
- Better caching strategies

**Developer Experience**:
- Fast Refresh (similar to Vite HMR)
- Better error messages
- TypeScript plugin for IDE
- Extensive documentation

**Future-Ready**:
- Server-side rendering available when needed
- API routes for backend integration
- Incremental Static Regeneration
- Edge runtime support

**Deployment**:
- First-class Vercel support
- Works on any static hosting
- Better CI/CD integration

### Migration Strategy

**Approach**: Incremental, safe, testable
- Start with SPA mode (catch-all route)
- Preserve all existing functionality
- Test at each phase checkpoint
- Rollback strategy at each step
- Optionally migrate to App Router later

**Risk Mitigation**:
- Zero breaking changes to components
- Each phase is atomic and reversible
- Comprehensive testing checklist
- Detailed troubleshooting guides
- All 135+ components work unchanged

### Current vs. Future Stack

**Current (Vite)**:
```
Vite 6.2 + React 19 + TypeScript 5.8
Tailwind CDN + inline config
Import maps for dependencies
VITE_ environment variables
ViewState enum routing
```

**Future (Next.js)**:
```
Next.js 16 + React 19 + TypeScript 5.8
Tailwind npm + PostCSS pipeline
npm packages for all dependencies
NEXT_PUBLIC_ environment variables
Next.js App Router (or SPA mode initially)
```

### When to Execute Migration

**Execute Before**:
- Backend integration (provides better API routes)
- Production deployment (better optimization)
- Team collaboration (better DX)

**Can Defer If**:
- Vite is working well for current needs
- Want to focus on backend first
- Time constraints exist

**Recommendation**: Execute migration before backend integration for optimal architecture.
