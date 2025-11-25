# Active Context: SocialFlow AI

## Current Status

**Phase**: Phase 9D Documentation (OAuth Integrations) - COMPLETE ✅
**Last Updated**: November 25, 2025 (Afternoon)

**What This Project Is**: A professional AI-first social media management platform with production-ready React/TypeScript frontend on Next.js 16, working PostgreSQL database with Prisma 7, complete authentication system with route protection, 5 core CRUD APIs (19 endpoints), and comprehensive OAuth documentation for 7 social platforms ready for implementation.

---

## Current Work Focus

### Phase 9C: Core API Routes (Posts API Template) - COMPLETE ✅

**Status**: Posts API completed as template for all future CRUD endpoints (November 24, 2025)

**Latest Achievement**: Production-ready Posts API serving as template pattern for all remaining endpoints

**What's Working**:
- ✅ GET /api/posts - List posts with filters (status, platform, limit)
- ✅ POST /api/posts - Create post with validation
- ✅ GET /api/posts/[id] - Get single post with relationships
- ✅ PATCH /api/posts/[id] - Update post
- ✅ DELETE /api/posts/[id] - Delete post
- ✅ Authentication on all endpoints (401 for unauthenticated)
- ✅ Input validation with Zod schemas
- ✅ User ownership verification (can't access other users' data)
- ✅ Prisma relationships loaded (platforms, accounts, media, comments)
- ✅ Proper error handling with HTTP status codes
- ✅ Zero TypeScript errors, zero ESLint errors

**Files Created (3 files)**:
```
src/app/api/posts/
├── route.ts              # GET, POST (164 lines)
└── [id]/
    └── route.ts          # GET, PATCH, DELETE (145 lines)

docs/
└── api-testing-guide.md  # Complete documentation
```

**Patterns Established (Template for All Endpoints)**:
1. **Authentication Pattern** - `requireAuth()` at start of every function
2. **Validation Pattern** - Zod schemas with proper error messages
3. **Ownership Pattern** - Always filter by `userId` for security
4. **Error Handling** - Try/catch with user-friendly messages
5. **Query Parameters** - URL searchParams for filtering
6. **Prisma Includes** - Load relationships efficiently
7. **JSON Fields** - Proper handling with eslint-disable comments

**Testing Results**:
- Dev server running on http://localhost:3000
- Database connected (8 users)
- Authentication working (returns 401 without session)
- All CRUD operations implemented and type-safe

**Timeline**: ~2 hours

### Phase 9C Complete: All Core API Routes - COMPLETE ✅

**Status**: All 4 remaining APIs completed (November 24, 2025, Late Evening)

**Latest Achievement**: Production-ready CRUD APIs for Profile, Media, Accounts, and Analytics

**What Was Built (4 APIs, 14 new endpoints)**:

1. **Profile API** (143 lines) - User profile management
   - GET /api/profile - Get current user with stats (accounts, posts, media counts)
   - PATCH /api/profile - Update name, email, image with email uniqueness validation

2. **Media API** (297 lines) - Media library management
   - GET /api/media - List assets with filters (type, folder, limit)
   - POST /api/media - Create media asset (IMAGE/VIDEO/TEMPLATE)
   - GET /api/media/[id] - Get single asset with post usage
   - PATCH /api/media/[id] - Update metadata (name, folder, tags)
   - DELETE /api/media/[id] - Delete asset (protected if used in posts)

3. **Accounts API** (334 lines) - Social account connections
   - GET /api/accounts - List accounts with filters (platform, status)
   - POST /api/accounts - Connect social account with OAuth tokens
   - GET /api/accounts/[id] - Get account with connected posts
   - PATCH /api/accounts/[id] - Update/refresh tokens, status
   - DELETE /api/accounts/[id] - Disconnect (protected if scheduled posts)

4. **Analytics API** (275 lines) - Analytics data storage
   - GET /api/analytics - Get snapshots with date/platform filters
   - POST /api/analytics - Create/update snapshot (upsert by date+platform)
   - GET /api/analytics/summary - Aggregated data with engagement rates

**Files Created (7 new files)**:
```
src/app/api/
├── profile/
│   └── route.ts                 # GET, PATCH (143 lines)
├── media/
│   ├── route.ts                # GET, POST (120 lines)
│   └── [id]/route.ts           # GET, PATCH, DELETE (177 lines)
├── accounts/
│   ├── route.ts                # GET, POST (133 lines)
│   └── [id]/route.ts           # GET, PATCH, DELETE (201 lines)
└── analytics/
    ├── route.ts                # GET, POST (146 lines)
    └── summary/route.ts        # GET aggregation (129 lines)

docs/
└── api-testing-guide.md        # Updated with all endpoints
```

**Total New Code**: 1,049 lines
**Combined with Posts API**: 1,358 lines total across 10 files

**Key Features Implemented**:
- ✅ All endpoints authenticated with `requireAuth()`
- ✅ Zod validation schemas for all POST/PATCH operations
- ✅ User ownership verification on all operations
- ✅ Prisma relationship loading (folders, posts, accounts)
- ✅ Security protections (can't delete media/accounts in use)
- ✅ Token sanitization (no access tokens in responses)
- ✅ Aggregation queries (analytics summary with groupBy)
- ✅ Query parameters for filtering
- ✅ Zero TypeScript errors, zero ESLint errors

**Testing Verified**:
- Dev server running successfully
- All endpoints type-safe
- Authentication working correctly
- Ownership verification preventing cross-user access

**Timeline**: ~2.5 hours actual (vs 5-6 hours estimated)
- Profile API: 20 minutes
- Media API: 45 minutes
- Accounts API: 50 minutes  
- Analytics API: 45 minutes
- Documentation + fixes: 20 minutes

**Combined Phase 9C Total**: 7.5 hours (Posts 2h + Remaining 2.5h + overhead 3h)

### Phase 9B: Authentication System with Better Auth - COMPLETE ✅

**Status**: Successfully completed, tested, and route restructuring finished (November 24, 2025)

**Latest Achievement**: Complete authentication system with professional route structure following Next.js 16.0.4 best practices

**What's Working**:
- ✅ Better Auth installed and configured
- ✅ Prisma adapter integrated with custom output path
- ✅ Login/register UI pages created
- ✅ Auth API routes created (`/api/auth/[...all]`)
- ✅ Client-side auth hooks (useAuth)
- ✅ Server-side auth helpers (requireAuth, getSession, requirePlan)
- ✅ Protected API examples (/api/posts, /api/me)
- ✅ Database schema updated (Session token field, Account model)
- ✅ Migrations applied successfully (6 total migrations)
- ✅ Prisma Client generated and loaded correctly
- ✅ User registration and login tested and working

**Solution to Caching Issue**:
The "Unknown argument 'token'" error was caused by Next.js dev server caching an outdated Prisma Client. After adding the `token` field to the Session model and regenerating the client with `npx prisma generate`, the dev server continued using the old cached version. **Solution**: Restart the dev server to load the fresh Prisma Client.

**Phase 9B Complete Implementation**:

**Authentication Core (11 files)**:
```
src/lib/
├── auth.ts                    # Better Auth instance with Prisma adapter
├── auth-client.ts             # Client-side auth with React hooks
└── auth-helpers.ts            # Server helpers (getSession, requireAuth, requirePlan)

src/hooks/
└── useAuth.ts                 # Client hook wrapper

src/app/api/
├── auth/[...all]/route.ts     # Auth endpoints
├── posts/route.ts             # Protected API example
└── me/route.ts                # Session test endpoint
```

**Route Restructuring (13 files)**:
```
src/app/
├── layout.tsx                 # Minimal root layout (no AppShell)
├── (auth)/                    # Public route group
│   ├── layout.tsx            # Clean layout (no sidebar)
│   ├── page.tsx              # Landing/welcome page at /
│   ├── login/page.tsx        # Login with redirect parameter
│   └── register/page.tsx     # Registration page
└── (app)/                     # Protected route group
    ├── layout.tsx            # Auth check + AppShell
    ├── dashboard/page.tsx    # /dashboard
    ├── composer/page.tsx     # /composer
    ├── calendar/page.tsx     # /calendar
    ├── library/page.tsx      # /library
    ├── analytics/page.tsx    # /analytics
    ├── inbox/page.tsx        # /inbox
    ├── links/page.tsx        # /links
    ├── automations/page.tsx  # /automations
    └── settings/page.tsx     # /settings
```

**Removed Files**:
- `src/app/(content)`, `(insights)`, `(tools)` - Old route groups
- `src/app/auth` - Old auth location
- `src/app/settings` - Moved to (app)
- `src/app/page.tsx` - Moved to (app)/dashboard

.env                          # Added BETTER_AUTH_SECRET, BETTER_AUTH_URL

**Schema Changes**:
```prisma
model User {
  password      String        # For credential authentication
  emailVerified Boolean       # Email verification status
  sessions      Session[]     # User sessions
  authAccounts  Account[]     # OAuth accounts
  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique    # Session token (added in migration)
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("sessions")
}

model Account {              # OAuth provider accounts
  id                String   @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String
  password          String?  # For credential provider
  accessToken       String?
  refreshToken      String?
  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

**Migrations Applied** (6 total):
1. `20251124231807_init` - Initial database setup
2. `20251124234621_add_better_auth_tables` - Added Session/Account tables
3. `20251124235456_fix_better_auth_field_names` - Renamed passwordHash→password
4. `20251125001614_move_password_to_account_table` - Moved password field
5. `20251125002057_add_account_timestamps` - Added Account timestamps
6. `20251125002431_add_session_token_and_timestamps` - Added Session token field

**Key Learnings**:
1. **Next.js Dev Server Caching**: After regenerating Prisma Client, restart dev server to clear cache
2. **Custom Prisma Output Path**: Works fine with Better Auth when client is properly regenerated
3. **Schema Evolution**: Multiple migrations can be applied incrementally without issues
4. **Better Auth + Prisma 7**: Fully compatible when client is fresh
5. **Route Groups**: Perfect for separating public/protected routes without URL pollution
6. **Authentication Flow**: Redirect parameters work seamlessly with Next.js router
7. **Next.js 16.0.4 Best Practices**: Our structure follows all documented patterns perfectly

### Frontend Status

Production-ready on Next.js 16.0.3:
- 135+ components refactored using SOLID/DRY principles
- Zero TypeScript errors, zero ESLint errors
- App Router with route groups: (auth), (app) for clean URL structure
- React Context for state management
- Complete authentication UI with landing page
- Running on http://localhost:3000

### Backend Status

Database + Authentication + Core APIs complete (~50% of backend):
- PostgreSQL + Prisma 7 + Prisma Accelerate configured
- 18 database tables with full relationships
- Type-safe database client generated
- Health check endpoint verified
- Authentication system 100% complete ✅
- Route protection working with redirect
- Landing page redirects authenticated users
- **5 Core APIs complete** - 19 CRUD endpoints operational (Posts, Profile, Media, Accounts, Analytics)

### Phase 9D: OAuth Integration Documentation - COMPLETE ✅

**Status**: All platform OAuth documentation completed (November 25, 2025, Afternoon)

**Latest Achievement**: Comprehensive OAuth implementation guides for all 7 social platforms

**What Was Created (8 documentation files)**:

**Infrastructure Documentation** (1 file):
- `phase9d0_oauth_infrastructure.md` - Shared OAuth patterns and infrastructure
  - BaseOAuthService abstract class (reusable across all platforms)
  - Token encryption with AES-256-GCM
  - PKCE implementation (code verifier/challenge)
  - State management for CSRF protection
  - Common route patterns (authorize, callback, refresh, disconnect)
  - Error handling standards
  - Security best practices
  - Testing infrastructure with mock services

**Platform-Specific Guides** (7 files):
1. `phase9d1_twitter_oauth.md` - Twitter/X OAuth 2.0 (435 lines)
   - PKCE required, 2-hour access tokens with refresh tokens
   - Complete TwitterOAuthService implementation
   - Developer portal setup guide
   - 5 API routes with full TypeScript code examples

2. `phase9d2_linkedin_oauth.md` - LinkedIn OAuth 2.0 (340 lines)
   - OpenID Connect integration
   - 60-day access tokens (no refresh tokens available)
   - App review requirements for posting scopes
   - Re-authentication strategy

3. `phase9d3_instagram_oauth.md` - Instagram via Facebook Graph API (410 lines)
   - Business/Creator account requirements
   - Long-lived token exchange (60 days)
   - Facebook Page connection required
   - Two-step token exchange (short-lived → long-lived)

4. `phase9d4_facebook_oauth.md` - Facebook Pages OAuth (385 lines)
   - Page-level access tokens
   - Long-lived token exchange pattern
   - Multi-page support patterns
   - Page admin/editor requirements

5. `phase9d5_tiktok_oauth.md` - TikTok OAuth 2.0 (425 lines)
   - PKCE required, 24-hour access tokens with 1-year refresh tokens
   - Content Posting API approval process
   - Video requirements and limitations
   - Community Guidelines compliance

6. `phase9d6_youtube_oauth.md` - YouTube via Google OAuth (400 lines)
   - Google Cloud Project setup
   - 1-hour access tokens with persistent refresh tokens
   - YouTube Data API v3 integration
   - Upload quota management (6/day default)

7. `phase9d7_pinterest_oauth.md` - Pinterest OAuth 2.0 (330 lines)
   - 30-day access tokens with 365-day refresh tokens
   - API access approval process
   - Pin requirements and specifications
   - Brand Guidelines compliance

**Total Documentation**: ~3,500 lines across 8 comprehensive guides

**Documentation Quality**:
Each platform guide includes:
- ✅ Prerequisites with step-by-step developer portal setup
- ✅ Environment variables configuration
- ✅ Required OAuth scopes with detailed explanations
- ✅ Complete OAuth service implementation extending BaseOAuthService
- ✅ All 5 API routes (authorize, callback, refresh, disconnect + service file)
- ✅ Platform-specific implementation details and quirks
- ✅ Token lifecycle management patterns
- ✅ Security considerations (CSRF, PKCE, encryption)
- ✅ Known limitations and platform constraints
- ✅ Comprehensive troubleshooting guides
- ✅ API reference documentation with endpoints
- ✅ Success criteria checklists
- ✅ Estimated implementation times (60-120 min per platform)

**Key Patterns Established**:
1. **BaseOAuthService Pattern** - Abstract class all platforms extend
2. **Token Encryption** - AES-256-GCM encryption for all tokens at rest
3. **PKCE Security** - Code verifier/challenge for platforms that support it
4. **State Management** - 10-minute expiration, database-stored, one-time use
5. **Route Structure** - Consistent across all platforms (4 routes per platform)
6. **Error Handling** - Standardized error codes and user-friendly messages

**Timeline**: ~3 hours documentation writing

### Phase 9D Implementation: OAuth Integrations - IN PROGRESS ⏳

**Status**: 2 of 7 platforms complete (November 25, 2025, Afternoon)

**Completed Platforms**:

1. **Twitter/X OAuth - COMPLETE ✅**
   - ✅ OAuth infrastructure built (BaseOAuthService, token encryption, PKCE)
   - ✅ TwitterOAuthService implemented (135 lines)
   - ✅ 4 API routes created (authorize, callback, refresh, disconnect)
   - ✅ Database migration applied (OAuthState table)
   - ✅ Environment variables configured
   - **Timeline**: ~3-4 hours (includes infrastructure setup)

2. **LinkedIn OAuth - COMPLETE ✅**
   - ✅ LinkedInOAuthService implemented
   - ✅ 4 API routes created (authorize, callback, refresh, disconnect)
   - ✅ OpenID Connect integration
   - ✅ 60-day token handling (no refresh tokens)
   - **Timeline**: ~60-90 minutes

**Infrastructure Complete**: All shared OAuth components ready for remaining platforms

**Remaining Platforms** (5 platforms, ~4-5 hours):
- Phase 9D-3: Instagram OAuth (60-90 min)
- Phase 9D-4: Facebook OAuth (60-90 min)
- Phase 9D-5: TikTok OAuth (60-90 min)
- Phase 9D-6: YouTube OAuth (60-90 min)
- Phase 9D-7: Pinterest OAuth (60-90 min)

**Next Steps**: Continue with Instagram OAuth implementation

## Next Steps

### Immediate Next Steps

**Phase 9D Implementation**: Social Platform OAuth Integrations (6-8 hours) - NEXT
- Execute documentation for all 7 platforms sequentially
- Start with Twitter (includes infrastructure setup)
- Then LinkedIn, Instagram, Facebook, TikTok, YouTube, Pinterest

**Phase 9E**: File Storage with Vercel Blob (2-3 hours)
**Phase 9F**: Mock Data Migration to Real APIs (3-4 hours)
**Phase 9G**: Real-time Features with WebSockets (4-5 hours)

**Total Remaining Backend Work**: 15-23 hours (documentation complete, implementation remaining)

## Core Development Principles

### SOLID & DRY First

**These principles guided the successful refactoring (6,897 → 1,300 lines) and must continue to guide all future development:**

- **Single Responsibility**: Each component/function has ONE clear purpose. If a component does multiple things, split it.
- **Open/Closed**: Extend functionality through composition and new components, not by modifying existing ones.
- **Dependency Inversion**: Components depend on interfaces (props), not concrete implementations. Makes testing and reuse trivial.
- **Don't Repeat Yourself (DRY)**: Extract shared logic into hooks, utilities, and shared components immediately. We saw this win with FeatureGateOverlay (reused 3x), PostCard (reused 3x), platform icons (shared between features).

### No Backwards Compatibility Constraints

**Critical Freedom**: We have NO legacy API contracts, NO deprecated features to maintain, NO backwards compatibility requirements.

**What This Means**:
- Make breaking changes to improve architecture without hesitation
- Refactor components when they become unwieldy (>200 lines = split it)
- Change component APIs to be cleaner and more intuitive
- Rename files/functions for clarity without worrying about migration
- Delete bad patterns immediately, don't preserve them

**This freedom enabled**: The orchestrator pattern refactoring that reduced code by 81% would have been impossible with backwards compatibility constraints.

**Future Development**: Continue this approach. When you see a better pattern, implement it. Don't preserve technical debt for compatibility.

## Active Design Decisions

### Backend Architecture
**Decision**: Next.js API routes + Vercel serverless
**Why**: Unified codebase, automatic deployment, cost-effective
**Stack**: PostgreSQL + Prisma 7 + Better Auth (currently blocked) + Vercel Blob

### Authentication
**Decision**: Better Auth (attempted, currently blocked)
**Alternatives**: NextAuth.js v5 (proven working solution)
**Issue**: Better Auth not detecting Prisma models with custom output path

### State Management
**Decision**: React Context API (AppContext.tsx)
**Why**: Clean separation from layout, sufficient for MVP, easy to debug
**Implementation**: ✅ Complete and working

### Routing
**Decision**: Next.js App Router with route groups
**Why**: Industry standard, bookmarkable URLs, automatic code splitting, clean separation of public/protected routes
**Implementation**: ✅ Complete with (auth), (app) groups following Next.js 16.0.4 best practices

### Route Structure
**Decision**: Two-layout system with route groups
**Public Routes** ((auth) group):
- `/` - Landing page (redirects authenticated users to /dashboard)
- `/login` - Login page with redirect parameter support
- `/register` - Registration page

**Protected Routes** ((app) group):
- All app pages require authentication
- Automatic redirect to `/login?redirect=<intended-url>`
- AppShell with sidebar only on protected routes
- Clean URLs: `/dashboard`, `/composer`, `/calendar`, etc.

**Why This Pattern**: Follows Next.js documented best practice for "organizing routes by site section" - route groups omit from URL but allow different layouts

## Important Patterns & Preferences

### Orchestrator Pattern (Established)

All major features use this proven pattern:

```typescript
// 1. Custom Hook for State Management
export function useFeature() {
  const [state, setState] = useState();
  // ... all state logic
  return { state, actions };
}

// 2. Orchestrator Component (100-200 lines)
export const Feature: React.FC<Props> = (props) => {
  const feature = useFeature();
  return (
    <div>
      <SubComponent1 {...feature} />
      <SubComponent2 {...feature} />
    </div>
  );
};

// 3. Focused Sub-Components (20-50 lines each)
// Single responsibility, highly testable
```

### Component Structure Pattern

```typescript
// 1. Imports
import React, { useState } from "react";
import { SomeIcon } from "lucide-react";
import { SomeType } from "@/types";

// 2. Interface (if props exist)
interface ComponentProps {
  data: SomeType;
  onAction: (value: string) => void;
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // State, effects, handlers, render
  return <div>{/* JSX */}</div>;
};

// 4. Export
export default Component;
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase
- **Functions**: camelCase
- **Props**: camelCase
- **Types**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

### Code Reuse Wins

- **FeatureGateOverlay**: Created in Analytics, reused in Settings (3 tabs)
- **PostCard**: Created in Calendar, reused across 3 views
- **Platform Icons**: Created in Calendar, reused in Inbox
- **UI Library**: Button, Input, Modal, Card used across all features

## Known Technical Challenges

### Other Limitations
- **Mock Data Persistence**: Changes lost on refresh (will be fixed with backend)
- **API Response Consistency**: Gemini occasionally returns malformed JSON
- **Timezone Handling**: Currently uses browser local time
- **File Uploads**: No storage available yet (Phase 9E)

### Will Require Backend
- Data persistence and real-time sync
- Social platform API integrations
- File storage (S3/CDN)
- Email notifications
- Analytics data aggregation

## Key Learnings

### Refactoring Insights
1. **Orchestrator Pattern**: Scales incredibly well - works for 100-line and 1,850-line components
2. **Custom Hooks**: Extracting state to hooks makes testing and reuse trivial
3. **Component Reuse**: Planning for reuse from the start pays dividends
4. **Path Aliases**: `@/` imports make refactoring painless
5. **TypeScript Strict Mode**: Catches 90% of bugs before runtime

### Development Workflow
1. **Tailwind Dark Mode**: `dark:` variants work perfectly - establish color variables early
2. **Mock Data**: Accelerates UI development significantly - make it realistic
3. **AI Prompts**: Require iteration - start clear, test extensively, add error handling
4. **Prop Drilling**: Fine until 3 levels deep, then consider Context API
5. **Component Size**: Sweet spot is 20-50 lines per component, 100-200 for orchestrators

### Authentication Learnings (Phase 9B)
1. **Better Auth**: Modern, clean API, works perfectly with Prisma 7 when client is fresh
2. **Custom Prisma Paths**: Works fine with Better Auth - just restart dev server after regenerating
3. **Field Naming**: Better Auth expects specific field names (password, emailVerified as Boolean)
4. **Table Naming**: Better Auth expects singular names by default (use usePlural for plural tables)
5. **Debugging**: Context7 documentation is essential for Better Auth configuration
6. **Route Groups**: Perfect pattern for public vs protected route separation
7. **Authentication Flow**: Redirect parameters enable seamless return-to-intended-page UX
8. **Next.js Best Practices**: Following documented patterns prevents issues and improves maintainability

### API Development Learnings (Phase 9C)
1. **Template Pattern**: Create one perfect endpoint, replicate for others - saves massive time
2. **Zod First**: Define validation schemas before implementation - catches issues early
3. **Ownership Security**: ALWAYS filter by userId in where clauses - critical for multi-tenant security
4. **Prisma Include**: Use includes liberally for relationships - prevents N+1 queries
5. **Error Messages**: User-friendly messages in responses, detailed logging in console
6. **JSON Fields**: Prisma Json types require `as any` cast - use eslint-disable comments
7. **HTTP Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
8. **Query Parameters**: Use URL searchParams for filtering - keeps API RESTful

## For New Contributors

**Quick Start**:
1. Read `projectbrief.md` for vision
2. Read `techContext.md` for setup
3. Read `systemPatterns.md` for architecture
4. Read this file for current focus

**Setup** (5 minutes):
```bash
git clone git@github.com:noobskies/socialflow.git
cd socialflow
npm install
# Add NEXT_PUBLIC_GEMINI_API_KEY to .env
npm run dev
# Opens at http://localhost:3000
```

**Code Review Priorities**:
- TypeScript errors resolved
- Console errors cleared
- Dark mode appearance tested
- Mobile responsiveness verified
- Error handling present
- Follows established patterns
