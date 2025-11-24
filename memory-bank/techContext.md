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

**Current** (`.env.local`):

```bash
# AI Service
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Phase 9 Will Add**:

```bash
# Database (Phase 9A)
DATABASE_URL=postgresql://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Authentication (Phase 9B)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand

# OAuth Platforms (Phase 9D)
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
# ... (7 platforms total)

# File Storage (Phase 9E)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Real-time (Phase 9G)
CRON_SECRET=for-vercel-cron-jobs
```

**Security**: Never commit `.env.local` - use Vercel environment variables for production

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

- ❌ Redux/MobX (using React Context)
- ❌ Axios (using native fetch with api-client wrapper)
- ❌ Moment.js (using native Date)
- ❌ Lodash (using native JS)
- ❌ Separate backend server (using Next.js API routes)

**Why**: Smaller bundle, fewer vulnerabilities, less maintenance, unified deployment

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
- Prisma Client auto-generates types (will be added in Phase 9A)

**Verification**: `npm run type-check` passes with 0 errors

## Backend Stack (Phase 9 - Documented, Ready for Implementation)

**Architecture**: Next.js API routes (serverless functions on Vercel)

**Database**: 
- **PostgreSQL** - Relational database (Vercel Postgres recommended)
- **Prisma ORM** v6.x - Type-safe database client with migrations
- 15+ models: User, Session, SocialAccount, Post, MediaAsset, Analytics, etc.

**Authentication**:
- **NextAuth.js v5** - JWT sessions, credentials provider
- **bcryptjs** - Password hashing
- Protected API routes with `requireAuth()` middleware

**File Storage**:
- **Vercel Blob Storage** - 5GB free tier
- Image/video uploads with progress tracking
- Automatic URL generation and CDN

**OAuth Integrations**:
- Twitter/X, LinkedIn, Instagram, Facebook, TikTok, YouTube, Pinterest
- PKCE security flow with token refresh
- Encrypted token storage

**Real-time**:
- **Socket.io** - WebSocket server for notifications
- Alternative: **Pusher** (managed service)
- Live post status updates, instant notifications

**Validation & Security**:
- **Zod** - Runtime schema validation
- Input sanitization and error handling
- Rate limiting and CORS protection

**Documentation**: See `docs/phases/phase9a-9g_*.md` for implementation details

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

**Current (Frontend-Only)**:
1. **No Data Persistence** - Changes lost on refresh (will be fixed in Phase 9F)
2. **No Authentication** - No user accounts yet (Phase 9B)
3. **Mock Data** - Using INITIAL_* constants (Phase 9F migration)
4. **Client-Side AI Key** - Exposed in bundle (Phase 9B will move to backend)

**After Backend (Phase 9)**:
5. **Modern Browsers Only** - No IE11 support (by design)
6. **Internet Required** - No offline mode (acceptable)
7. **Gemini Dependency** - Rate limits apply (60 req/min, 1,500/day)

## Path to Production

### Phase 9: Backend Implementation (Current)

**Week 1 - Foundation**:
1. Phase 9A: Prisma + PostgreSQL setup
2. Phase 9B: NextAuth.js authentication
3. Phase 9C: Core CRUD API routes

**Week 2 - Integration**:
4. Phase 9D: OAuth for 7 platforms
5. Phase 9E: Vercel Blob file storage
6. Phase 9F: Replace mock data with APIs
7. Phase 9G: WebSocket real-time features

### Phase 10: Testing & Deployment

1. Write comprehensive test suite
2. Production deployment to Vercel
3. Performance optimization
4. Security audit

---

## Current Development Status

**Frontend**: ✅ Production-ready
- 135+ components across 9 features
- Zero TypeScript/ESLint errors
- Next.js 16.0.3 with Turbopack
- Bundle: ~200KB gzipped

**Backend**: ✅ Documented, ready for implementation
- 7 implementation phases (24-32 hours)
- Complete API architecture
- Database schema designed
- OAuth flows documented

**Current Phase**: Phase 9A execution next (Database setup)

## Deployment

**Platform**: Vercel (all-in-one solution)

**Frontend Deployment** (Working Now):
1. Push code: `git push origin main`
2. Vercel auto-deploys from GitHub
3. Add `NEXT_PUBLIC_GEMINI_API_KEY` in Vercel dashboard
4. Preview at `*.vercel.app`

**Backend Deployment** (Phase 9):
1. Create Vercel Postgres database
2. Add all environment variables (DATABASE_URL, NEXTAUTH_SECRET, OAuth keys, etc.)
3. Run `npx prisma migrate deploy`
4. API routes deploy automatically with frontend
5. One unified deployment

**Benefits**:
- Zero-config deployment
- Automatic HTTPS and CDN
- Environment variables per environment
- Preview deployments for PRs
- Serverless auto-scaling
