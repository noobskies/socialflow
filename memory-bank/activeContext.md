# Active Context: SocialFlow AI

## Current Status

**Phase**: Phase 9B - Authentication System (95% Complete - BLOCKING ISSUE)
**Last Updated**: November 24, 2025

**What This Project Is**: A professional AI-first social media management platform with production-ready React/TypeScript frontend on Next.js 16 and working PostgreSQL database with Prisma 7.

---

## Current Work Focus

### Phase 9B: Authentication System with Better Auth - COMPLETE ✅

**Status**: Successfully completed and tested (November 24, 2025)

**Latest Achievement**: Resolved Prisma Client caching issue and achieved working authentication with user registration, login, and session management

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

**Files Created (11 files)**:
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

src/app/auth/
├── login/page.tsx            # Login page with email/password form
└── register/page.tsx         # Registration page with validation

.env                          # Added BETTER_AUTH_SECRET, BETTER_AUTH_URL
```

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

### Frontend Status

Production-ready on Next.js 16.0.3:
- 135+ components refactored using SOLID/DRY principles
- Zero TypeScript errors, zero ESLint errors
- App Router with route groups: (content), (insights), (tools)
- React Context for state management
- Running on http://localhost:3000

### Backend Status

Database foundation complete (20% of backend):
- PostgreSQL + Prisma 7 + Prisma Accelerate configured
- 18 database tables with full relationships
- Type-safe database client generated
- Health check endpoint verified
- Authentication system 95% complete (blocked)

## Next Steps

### Immediate Priority

**RESOLVE BLOCKING ISSUE**: Fix Better Auth Prisma Client detection

**Options**:
1. Continue debugging Better Auth configuration
2. Switch to NextAuth.js (working solution)
3. Report issue to Better Auth and implement workaround

### Immediate Next Steps

**Phase 9C**: Core API Routes (4-5 hours) - NEXT
- Posts CRUD endpoints
- Accounts management
- Media assets API
- Analytics endpoints

**Phase 9D**: Social Platform OAuth (6-8 hours)
**Phase 9E**: File Storage (2-3 hours)
**Phase 9F**: Mock Data Migration (3-4 hours)
**Phase 9G**: Real-time Features (4-5 hours)

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
**Why**: Industry standard, bookmarkable URLs, automatic code splitting
**Implementation**: ✅ Complete with (content), (insights), (tools) groups

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

### Current Blocking Issue
- **Better Auth + Prisma 7**: Model detection failure with custom output path
- **Impact**: Cannot complete authentication system
- **Workarounds Tried**: modelName mapping, usePlural, field renaming, cache clearing
- **Next Steps**: Consider NextAuth.js or report to Better Auth maintainers

### Other Limitations
- **Mock Data Persistence**: Changes lost on refresh (will be fixed with backend)
- **API Response Consistency**: Gemini occasionally returns malformed JSON
- **Timezone Handling**: Currently uses browser local time
- **File Uploads**: No storage available yet (Phase 9E)

### Will Require Backend
- Data persistence and real-time sync
- User authentication and authorization (blocked)
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
1. **Better Auth**: Modern, clean API but may have Prisma 7 compatibility issues
2. **Custom Prisma Paths**: Can cause issues with third-party integrations
3. **Field Naming**: Better Auth expects specific field names (password, emailVerified as Boolean)
4. **Table Naming**: Better Auth expects singular names by default (use usePlural for plural tables)
5. **Debugging**: Context7 documentation is essential for Better Auth configuration

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
