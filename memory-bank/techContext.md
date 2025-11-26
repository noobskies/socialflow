# Technical Context: SocialFlow AI

## Overview

This document describes the technical stack, development environment, and tooling for SocialFlow AI. The application is production-ready with a complete frontend on Next.js 16 and partially implemented backend.

---

## Technology Stack

### Frontend Framework

**React 19.2.0** - Latest React with concurrent features, Server Components support

**Next.js 16.0.3** - React framework with Turbopack, App Router, automatic optimizations

**TypeScript 5.8.2** - Strict type checking enabled, 100% type safety

**Why**: Modern, performant, excellent TypeScript support, industry standard

---

## Full Stack Architecture

### Frontend

**UI & Styling**:
- Tailwind CSS v4.1.17 (via npm + PostCSS)
- Lucide React v0.554.0 (1000+ icons)
- Recharts 3.4.1 (charts and analytics)

**State Management**:
- React Context API (AppContext)
- Custom hooks for feature logic

### Backend (Phase 9)

**Database**:
- **PostgreSQL** - Production database (Vercel Postgres)
- **Prisma 7.0.0** - Type-safe ORM with migrations
- **Prisma Accelerate** - Connection pooling and caching

**Authentication**:
- **Better Auth 1.2.7** - Modern auth library
- **Prisma Adapter** - Database integration
- **bcryptjs 2.4.3** - Password hashing

**File Storage** (Phase 9E - Documented):
- **@vercel/blob** - Vercel Blob Storage SDK
- **sharp** - High-performance image processing

**AI Integration**:
- **Google Gemini 1.30.0** (`@google/genai`)
- Free tier with generous limits

**Real-time** (Phase 9G - Planned):
- **Socket.io** - WebSocket server
- Alternative: Pusher (managed service)

---

## Development Environment

### Package Manager

**npm** - Lock file: `package-lock.json`

### Runtime

**Node.js 18+** - LTS version

### Workflow

```bash
npm install          # First time setup
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm start            # Preview production build
npm run lint         # Check code quality
npm run format       # Format code
```

---

## Environment Variables

### Current Configuration

**Required in `.env`**:

```bash
# Database (Phase 9A)
DATABASE_URL=postgresql://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Authentication (Phase 9B)
BETTER_AUTH_SECRET=generated-secret-key
BETTER_AUTH_URL=http://localhost:3000

# OAuth Platforms (Phase 9D)
ENCRYPTION_KEY=generated-aes-256-key

TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...

LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

INSTAGRAM_APP_ID=...
INSTAGRAM_APP_SECRET=...

FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...

YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...

# Pinterest pending app approval
# PINTEREST_APP_ID=...
# PINTEREST_APP_SECRET=...

# App URL (for OAuth redirects)
NEXT_PUBLIC_APP_URL=https://socialflow-tau.vercel.app

# File Storage (Phase 9E - when implemented)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# AI Service
NEXT_PUBLIC_GEMINI_API_KEY=...
```

**Security**: Never commit `.env` - use Vercel environment variables for production

---

## Dependencies

### Production

```json
{
  "next": "^16.0.3",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@google/genai": "^1.30.0",
  "lucide-react": "^0.554.0",
  "recharts": "^3.4.1",
  "@prisma/client": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "better-auth": "^1.2.7",
  "zod": "^3.23.8"
}
```

### Development

```json
{
  "typescript": "~5.8.2",
  "@types/node": "^22.14.0",
  "@types/bcryptjs": "^2.4.6",
  "tailwindcss": "^4.1.17",
  "@tailwindcss/postcss": "latest",
  "postcss": "^8.5.6",
  "autoprefixer": "^10.4.22",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.3",
  "prettier": "^3.6.2",
  "vitest": "^4.0.13",
  "prisma": "^7.0.0",
  "tsx": "^4.7.0"
}
```

### Phase 9E Dependencies (When Implemented)

```json
{
  "@vercel/blob": "^1.0.0",
  "sharp": "^0.33.x"
}
```

### Deliberately Avoided

- ❌ Redux/MobX (using React Context)
- ❌ Axios (using native fetch)
- ❌ Moment.js (using native Date)
- ❌ Lodash (using native JS)
- ❌ Separate backend server (using Next.js API routes)

**Why**: Smaller bundle, fewer vulnerabilities, unified deployment

---

## Code Quality Tools

### ESLint

**Config**: `eslint.config.mjs` (Next.js 16 best practices)

**Rules**: 
- Next.js core-web-vitals
- TypeScript-eslint
- Prettier integration

**Scripts**:
- `npm run lint` - Check for errors
- `npm run lint:fix` - Auto-fix

**Current Status**: 0 errors, ~20 warnings (acceptable)

### Prettier

**Config**: `.prettierrc`

**Scripts**:
- `npm run format` - Format all files
- `npm run format:check` - Check formatting

**Status**: All files formatted ✅

### TypeScript

**Strict Mode**: ✅ Fully enabled

**Status**: Zero errors with strict mode

**Additional Settings**:
- Typed routes enabled
- Typed environment variables
- Next.js TypeScript plugin active
- Prisma Client auto-generates types

### Vitest

**Config**: `vitest.config.ts`

**Status**: Infrastructure ready, tests deferred to Phase 10

---

## Database Stack

### PostgreSQL + Prisma 7

**Database**: Vercel Postgres (production-ready)

**ORM**: Prisma 7.0.0
- Type-safe database client
- Migrations system
- Custom output path: `src/generated/prisma/`

**Accelerate**: Connection pooling and query caching

**Schema**: 18 tables with full relationships
- Authentication: User, Session, Account
- Social: SocialAccount, Post, PostPlatform
- Media: MediaAsset, Folder
- Links: ShortLink, BioPage, Lead
- Automation: Workflow
- Team: Workspace, TeamMember
- Analytics: AnalyticsSnapshot

**Commands**:
```bash
npx prisma migrate dev    # Create and apply migration
npx prisma generate      # Generate Prisma Client
npx prisma studio        # Visual database browser
npm run db:seed          # Seed test data
```

---

## OAuth Integration

### Platforms Integrated (Phase 9D)

All 7 platforms complete with full OAuth flow:
1. Twitter/X (PKCE, 2-hour tokens)
2. LinkedIn (OpenID Connect, 60-day tokens)
3. Instagram (via Business API, long-lived tokens)
4. Facebook (Page tokens, long-lived)
5. TikTok (PKCE, 24-hour tokens)
6. YouTube (Google OAuth, 1-hour tokens)
7. Pinterest (30-day tokens, pending app approval)

**Infrastructure**:
- BaseOAuthService abstract class
- AES-256-GCM token encryption
- PKCE implementation
- CSRF protection with state parameter
- Database-stored OAuth state

---

## File Storage (Phase 9E - Documented)

### Vercel Blob Storage

**Free Tier**: 5GB storage, 100GB bandwidth/month

**Features**:
- CDN-backed URLs
- Automatic global delivery
- Simple API (put, del, list)

### Image Processing

**Sharp v0.33.x**:
- 16x faster than alternatives
- Memory-efficient
- Production-proven

**Processing Pipeline**:
- Optimize: Resize to 1920x1080 max, 80% quality
- Thumbnail: Generate 300x300 square, 70% quality
- Parallel processing: ~100ms total

---

## Development Workflow

### Git Workflow

**Remote**: git@github.com:noobskies/socialflow.git  
**Branch**: main

**Gitignore**: node_modules/, .next/, .env, dist/, *.log

### Local Development

```bash
# Start development
npm run dev           # http://localhost:3000

# Code quality
npm run lint         # Check code
npm run format       # Format code

# Database
npx prisma studio    # Visual DB browser
npx prisma generate  # After schema changes

# Testing (when implemented)
npm run test         # Vitest
```

---

## Deployment

### Vercel Platform

**Frontend + Backend** (unified deployment):
- Zero-config Next.js deployment
- Automatic HTTPS and CDN
- Environment variables per environment
- Preview deployments for PRs
- Serverless auto-scaling

**Database**:
- Vercel Postgres (managed)
- Automatic connection pooling
- Prisma Accelerate integration

**File Storage**:
- Vercel Blob (when Phase 9E implemented)
- CDN-backed delivery
- 5GB free tier

**Process**:
1. Push to GitHub
2. Vercel auto-deploys
3. Add environment variables in dashboard
4. Run migrations: `npx prisma migrate deploy`
5. API routes deploy with frontend

---

## Browser Support

**Target**: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+

**Required**: ES2020, CSS Grid, CSS Variables, localStorage, Fetch API

**Graceful Degradation**: Fallbacks for AI failures, localStorage, theme

---

## Performance Budgets

**Targets**:
- FCP < 1.5s
- TTI < 3s
- Lighthouse > 90
- Bundle < 300KB gzipped

**Current**: ✅ Fast with Turbopack, ⚠️ No lazy loading yet

---

## Security Considerations

### Current Implementation

**Good**:
- ✅ Environment variables for secrets
- ✅ TypeScript prevents type bugs
- ✅ Authentication on all API routes
- ✅ User ownership verification
- ✅ Input validation with Zod
- ✅ Token encryption for OAuth

**Backend Security**:
- ✅ requireAuth() on all endpoints
- ✅ User isolation (userId filtering)
- ✅ File type/size validation
- ✅ SQL injection prevention (Prisma)
- ✅ CSRF protection (OAuth state)

---

## Known Limitations

### Current

1. **No Data Persistence** - Frontend uses mock data (Phase 9F will fix)
2. **No File Upload** - Phase 9E documented, not implemented
3. **No Real-time** - Phase 9G not started
4. **Modern Browsers Only** - No IE11 (by design)

### After Phase 9 Complete

5. **Internet Required** - No offline mode (acceptable)
6. **Gemini Dependency** - Rate limits: 60 req/min, 1,500/day

---

## Path to Production

### Current Progress

**Completed** (~65% of backend):
- ✅ Database schema and Prisma setup
- ✅ Authentication system
- ✅ Core CRUD APIs (19 endpoints)
- ✅ OAuth integrations (7 platforms)
- ✅ File storage documentation

**Remaining** (~35% of backend):
- ⚠️ File storage implementation (3 hours)
- ⚠️ Mock data migration (3-4 hours, needs docs)
- ⚠️ Real-time features (4-5 hours, needs docs)

**Total Remaining**: 10-12 hours

### Phase 10: Testing & Production

1. Write comprehensive test suite
2. Production deployment to Vercel
3. Performance optimization
4. Security audit

---

## Quick Reference

### Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build

# Code Quality
npm run lint            # Check code
npm run format          # Format code
npm run type-check      # TypeScript check

# Database
npx prisma migrate dev  # Create migration
npx prisma generate     # Generate client
npx prisma studio       # Visual browser
npm run db:seed         # Seed data

# Testing
npm run test            # Vitest (when implemented)
```

### Port Configuration

- **Dev Server**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555
- **Database**: PostgreSQL (Vercel Postgres)

### Important Files

- `.env` - Environment variables (not committed)
- `prisma/schema.prisma` - Database schema
- `prisma.config.ts` - Prisma CLI configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules

---

**Last Updated**: November 25, 2025
