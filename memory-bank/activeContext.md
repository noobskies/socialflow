# Active Context: SocialFlow AI

## Current Status

**Phase**: Phase 9 Documentation Complete → Phase 9A Execution Next  
**Last Updated**: November 24, 2025

**What This Project Is**: A professional AI-first social media management platform with production-ready React/TypeScript frontend on Next.js 16, with complete backend architecture documentation ready for implementation.

---

## Current Work Focus

### Phase 9: Backend Development Documentation COMPLETE ✅

**Latest Achievement**: Complete backend architecture documented (November 24, 2025)

All 7 backend implementation phases documented (24-32 hours estimated):
- ✅ Phase 9A: Database Schema & Prisma Setup
- ✅ Phase 9B: Authentication System (NextAuth.js)
- ✅ Phase 9C: Core API Routes (CRUD endpoints)
- ✅ Phase 9D: OAuth Integrations (7 platforms)
- ✅ Phase 9E: File Storage (Vercel Blob)
- ✅ Phase 9F: Mock Data Migration
- ✅ Phase 9G: Real-time Features (WebSockets)

**Frontend Status**: Production-ready on Next.js 16.0.3
- 135+ components refactored using SOLID/DRY principles
- Zero TypeScript errors, zero ESLint errors
- App Router with route groups: (content), (insights), (tools)
- React Context for state management
- Running on http://localhost:3001

## Next Steps

### Immediate Focus (This Session)

**Phase 9A: Database Schema & Prisma Setup** (2-3 hours)

Execute first backend phase:
1. Install Prisma and PostgreSQL dependencies
2. Create complete database schema (15+ models)
3. Set up database connection (Vercel Postgres recommended)
4. Generate and run initial migration
5. Create seed script with test data
6. Build Prisma Client singleton
7. Create health check API endpoint

**Documentation**: See `docs/phases/phase9a_database_schema.md`

### Upcoming (Next 2 Weeks)

**Week 1** - Foundation:
1. Phase 9A: Database setup (2-3 hours)
2. Phase 9B: Authentication (3-4 hours)
3. Phase 9C: Core API Routes (4-5 hours)

**Week 2** - Integration:
4. Phase 9D: OAuth (6-8 hours)
5. Phase 9E: File Storage (2-3 hours)
6. Phase 9F: Mock Data Migration (3-4 hours)
7. Phase 9G: Real-time Features (4-5 hours)

### Future Priorities (After Phase 9)

1. **Phase 10 - Testing & Polish**: Write comprehensive test suite, performance optimization
2. **Production Deployment**: Deploy to Vercel with real database
3. **Monitoring**: Set up error tracking, analytics
4. **Advanced Features**: Team collaboration, approval workflows

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
**Stack**: PostgreSQL + Prisma + NextAuth.js + Vercel Blob

### State Management
**Decision**: React Context API (AppContext.tsx)
**Why**: Clean separation from layout, sufficient for MVP, easy to debug
**Implementation**: ✅ Complete and working

### Routing
**Decision**: Next.js App Router with route groups
**Why**: Industry standard, bookmarkable URLs, automatic code splitting
**Implementation**: ✅ Complete with (content), (insights), (tools) groups

### AI Service
**Pattern**: Separate `geminiService.ts` with clean exports
**Why**: Easy to swap providers, testable, centralized API key management
**Future**: Move API key to backend proxy (security improvement)

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

### Current Limitations
- **Mock Data Persistence**: Changes lost on refresh (acceptable for prototype)
- **API Response Consistency**: Gemini occasionally returns malformed JSON
- **Timezone Handling**: Currently uses browser local time
- **File Uploads**: No storage available (using URLs/data URIs)

### Will Require Backend
- Data persistence and real-time sync
- User authentication and authorization
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
# Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local
npm run dev
# Opens at http://localhost:3000 (or 3001 if 3000 is in use)
```

**Code Review Priorities**:
- TypeScript errors resolved
- Console errors cleared
- Dark mode appearance tested
- Mobile responsiveness verified
- Error handling present
- Follows established patterns
