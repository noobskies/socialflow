# Active Context: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Phase

**Last Updated**: November 23, 2025

**What This Project Is**: Frontend MVP exported from Google AI Studio that needs professional refactoring

**What We're Doing**: Refactoring frontend code with SOLID/DRY principles and organizing file structure for future scalability

**What We're NOT Doing**: Backend development (that comes later)

**Freedom**: No backwards compatibility constraints - we can make breaking changes for better architecture

**Goal**: Professional, maintainable, well-organized codebase ready for eventual backend integration

---

## Current Work Focus

### Project Status: Frontend Refactoring & Reorganization Phase

We're refactoring an AI Studio-generated MVP to establish professional code architecture. The functional prototype exists, but the code organization needs significant improvement before we can scale or add backend integration.

## Recent Significant Changes

### 1. Phase 0a: Development Tools Setup (November 23, 2025) ✅

**What**: Professional development tooling infrastructure established

**Completed Work**:
- Installed and configured ESLint with React/TypeScript recommended rules
- Configured Prettier for consistent code formatting across entire codebase
- Set up Vitest testing framework infrastructure (no tests written yet)
- Added comprehensive npm scripts for development workflow
- Formatted 25 files throughout the codebase
- Documented 77 linting issues for gradual fixing

**Configuration Files Created**:
- `eslint.config.js` - React/TypeScript linting with hooks rules
- `.prettierrc` - Code formatting standards
- `.prettierignore` - Formatting exclusions
- `vitest.config.ts` - Testing framework configuration
- `src/test/setup.ts` - Test environment setup

**Linting Status**:
- 77 errors and 2 warnings identified
- Issues include: unused imports, explicit `any` types, React hooks patterns
- Strategy: Fix gradually during refactoring phases (not blocking)
- TypeScript compilation: ✅ No errors
- Dev server: ✅ Working correctly

**Quality Checks**:
- ✅ TypeScript type checking passes
- ✅ Dev server starts successfully on port 3000
- ✅ Zero app functionality changes (no regressions)
- ✅ All tools working correctly

**Git Commit**: `81058ce` - "Phase 0a: Dev tools setup - ESLint, Prettier, Vitest"

**Impact**: 
- Professional development foundation established
- Consistent code formatting across entire project
- Testing infrastructure ready for Phase 7
- Clear code quality standards enforced
- Ready to proceed with Phase 1 Foundation

**Why**: Essential tooling before refactoring begins - ensures code quality and consistency

### 2. Memory Bank Initialization (Completed)

**What**: Created comprehensive documentation structure following .clinerules specification

**Files Created**:

- `projectbrief.md` - Foundation document defining vision and scope
- `productContext.md` - Product strategy and user experience goals
- `systemPatterns.md` - Technical architecture and implementation patterns
- `techContext.md` - Technology stack and development environment
- `activeContext.md` - This file (current work focus)
- `progress.md` - Status tracking (next to create)

**Why**: Enables continuity between AI assistant sessions by preserving project context

**Impact**: Future development sessions can start with full project understanding

### 2. AI-Powered Trend Discovery

**Implementation**: Dashboard widget using Gemini API to discover trending topics

**Key Files**:

- `services/geminiService.ts` - AI service integration
- `components/Dashboard.tsx` - Trending topics widget

**User Flow**:

1. Dashboard loads trending topics on mount
2. AI analyzes niche (default: "Tech & Marketing")
3. Displays 3 trends with difficulty ratings and context
4. User can click "Draft Post" to pre-fill Composer

**Learnings**:

- Gemini responses need structured prompts for consistent formatting
- Error handling is critical (API can fail or rate limit)
- Loading states improve perceived performance

### 3. Dark Mode Implementation

**Approach**: System-aware theme switching with localStorage persistence

**Technical Details**:

- Three modes: light, dark, system
- CSS classes on `<html>` element trigger Tailwind variants
- Media query listener for system preference changes
- Preference persists across sessions

**Component Affected**: All components use `dark:` variants

**Challenges Solved**:

- Media query listener cleanup to prevent memory leaks
- Initial flash of wrong theme (resolved with localStorage check)
- System theme detection on page load

### 4. Phase 1 Foundation Documentation Alignment (November 23, 2025)

**What**: Updated all Phase 1 refactoring documentation to use `/src` as base directory

**Files Updated**:

- `docs/phases/phase1_foundation.md` - Complete rewrite with `/src` paths
- `docs/phases/implementation_plan.md` - Architecture diagram and deliverables updated

**Key Changes**:

- All directory creation commands now use `/src` prefix
- TypeScript path aliases point to `/src` subdirectories (`@/types` → `./src/types`)
- Vite config aliases updated to resolve to `/src`
- Added step to move `/services` to `/src/services`
- Updated all file paths in code examples and checklists

**Architectural Decision**: Use `/src` as base directory for all source code

**Rationale**:

- Professional project structure (industry standard)
- Clear separation: `/src` for code, `/docs` for documentation, `/components` (legacy) at root
- Easier IDE navigation and file search
- Prepared for monorepo structure if needed
- Consistent with existing `/src` subdirectories that were already present

**Impact**:

- Phase 1 documentation is now consistent and ready for implementation
- No confusion about where to create new files
- Path aliases provide clean, maintainable imports
- Developer can follow phase1_foundation.md with confidence

## Next Immediate Steps

### Priority 1: Complete Memory Bank

**Status**: In progress (creating progress.md next)

**Remaining Tasks**:

- [x] Create activeContext.md
- [ ] Create progress.md
- [ ] Verify all files link coherently
- [ ] Test by simulating new session (re-read all files)

### Priority 2: Core Feature Polish

**Calendar View Improvements**:

- Add drag-and-drop for rescheduling posts
- Implement bulk selection and actions
- Add month/week/day view toggles
- Fix date timezone handling

**Composer Enhancements**:

- Media preview before upload
- Platform-specific character counters
- AI variation generation (3 options)
- Save drafts automatically

**Analytics Dashboard**:

- Real chart data from mock posts
- Export functionality (CSV/PDF)
- Date range filtering
- Platform comparison view

### Priority 3: Mock to Real Data Migration Prep

**Tasks**:

- Design API schema for posts, accounts, users
- Define REST endpoints (GET/POST/PUT/DELETE)
- Plan authentication flow
- Structure database tables (even if not implementing yet)

**Why Now**: Better to design API contracts early than refactor later

## Active Design Decisions

### 1. State Management Strategy

**Decision**: Stick with React useState at root level for MVP

**Reasoning**:

- Simple to understand and debug
- No learning curve for new contributors
- Performance is fine with current data size
- Can migrate to Context API or Zustand later if needed

**Trade-offs**:

- Some prop drilling (acceptable depth for now)
- Manual state synchronization
- Re-renders not optimized (will add React.memo if issues arise)

**When to Revisit**: If component tree exceeds 5 levels or state updates cause lag

### 2. Routing Approach

**Decision**: ViewState enum instead of React Router

**Reasoning**:

- Instant transitions (no route loading)
- Simpler codebase for MVP
- Don't need URL sharing yet
- Easier to pass state between views

**Trade-offs**:

- Can't bookmark specific views
- No browser back/forward
- No URL-based navigation
- Have to migrate later

**When to Revisit**: When user requests "share this calendar view" or similar

### 3. AI Service Abstraction

**Decision**: Separate `geminiService.ts` file with clean function exports

**Reasoning**:

- Easy to swap AI providers (OpenAI, Claude, etc.)
- Testable in isolation
- API key management centralized
- Components don't need AI-specific knowledge

**Implementation Pattern**:

```typescript
// Component calls generic function
const trends = await getTrendingTopics(niche);

// Service handles provider details
export const getTrendingTopics = async (niche: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // ... Gemini-specific logic
};
```

**Success Criteria**: Should be able to replace Gemini with OpenAI in < 1 hour

## Important Patterns & Preferences

### 1. Component Structure

**Preferred Pattern**:

```typescript
// 1. Imports
import React, { useState } from "react";
import { SomeIcon } from "lucide-react";
import { SomeType } from "../types";

// 2. Interface (if props exist)
interface ComponentProps {
  data: SomeType;
  onAction: (value: string) => void;
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // 4. State
  const [localState, setLocalState] = useState("");

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Handlers
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return <div>{/* JSX */}</div>;
};

// 8. Export
export default Component;
```

### 2. Naming Conventions

**Files**: PascalCase for components (`Dashboard.tsx`), camelCase for utilities

**Components**: PascalCase (`Dashboard`, `Composer`)

**Functions**: camelCase (`handleClick`, `getTrendingTopics`)

**Props**: camelCase (`showToast`, `onPostCreated`)

**Types**: PascalCase (`Post`, `ViewState`, `ToastType`)

**Constants**: UPPER_SNAKE_CASE for globals (`INITIAL_POSTS`)

### 3. Error Handling Philosophy

**Graceful Degradation**: App should never crash

**Pattern**:

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  showToast("Something went wrong. Please try again.", "error");
  return fallbackValue;
}
```

**User Feedback**: Always inform user of errors (via toast or inline message)

**Logging**: Console.error for debugging, will add Sentry later

### 4. TypeScript Usage

**Strictness**: Full strict mode enabled

**Preferences**:

- Explicit types for function parameters
- Infer return types when obvious
- Use interfaces over types for objects
- Define types in `types.ts` if used in 2+ places

**Avoid**:

- `any` type (use `unknown` if truly dynamic)
- Type assertions (use type guards instead)
- Optional chaining abuse (be explicit about nullability)

## Current Technical Challenges

### 1. Mock Data Persistence

**Problem**: All changes lost on page refresh

**Temporary Solution**: User knows it's a prototype

**Planned Solution**: Backend API with PostgreSQL database

**Timeline**: Phase 2 (after MVP validation)

### 2. AI Response Consistency

**Problem**: Gemini sometimes returns malformed JSON or unexpected formats

**Current Approach**:

- Very specific prompts with examples
- Fallback to manual parsing if JSON.parse fails
- Error handling shows user-friendly message

**Future Improvement**:

- Use Gemini's structured output mode
- Implement retry logic with refined prompts
- Cache successful responses to reduce API calls

### 3. Time Zone Handling

**Problem**: Scheduled posts use browser's local timezone

**Current State**: Works but could confuse users in different timezones

**Considerations**:

- Store timestamps as UTC in database
- Display in user's selected timezone
- Allow timezone selection per post (rare case)

**Decision Needed**: Simple (always local) vs Complex (timezone picker)?

### 4. File Upload Flow

**Problem**: No backend means nowhere to store uploaded media

**Current Workaround**: Use image URLs or data URIs (memory only)

**Blocker for Production**: Need cloud storage (S3, Cloudinary, etc.)

**Planned Solution**:

- Backend uploads to S3
- Return CDN URL to frontend
- Store URL with post in database

## Key Learnings & Insights

### 1. Tailwind Dark Mode is Simple When Done Right

**Discovery**: Using `dark:` variants everywhere feels tedious but works perfectly

**Best Practice**: Establish color variables early (slate-900 for dark bg, white for light bg)

**Avoid**: Custom CSS for dark mode - let Tailwind handle it

### 2. Mock Data Accelerates Development

**Benefit**: Can build entire UI without waiting for backend

**Approach**: Make mock data realistic (varied statuses, dates, platforms)

**Pitfall**: Don't get too attached - mock data structure may differ from API

### 3. AI Prompts Require Iteration

**Learning**: First AI prompt rarely works perfectly

**Strategy**:

- Start with clear instructions and examples
- Test with different inputs
- Refine prompt based on failures
- Add error handling for edge cases

**Example**: Trending topics prompt evolved from simple "find trends" to detailed format spec

### 4. Component Communication Patterns Matter

**Discovery**: Props drilling is fine until ~3 levels deep

**Current Status**: Manageable depth in most cases

**Watch For**: Dashboard → Card → Button → Modal (too deep)

**Solution When Needed**: Context API for specific subtrees (not global state)

### 5. TypeScript Types as Documentation

**Insight**: Well-named interfaces eliminate need for comments

**Good Example**:

```typescript
interface PostCreationCallbacks {
  onPostCreated: (post: Post) => void;
  onDraftSaved: (draft: Draft) => void;
  showToast: (message: string, type: ToastType) => void;
}
```

**Bad Example**:

```typescript
// Handle post creation
const onCreate = (p: any) => { ... }
```

## Collaboration Notes

### For New Contributors

**Start Here**:

1. Read `projectbrief.md` for vision
2. Read `techContext.md` for setup
3. Read `systemPatterns.md` for architecture
4. Read this file for current focus

**Development Setup** (5 minutes):

```bash
git clone git@github.com:noobskies/socialflow.git
cd socialflow
npm install
# Add VITE_GEMINI_API_KEY to .env.local
npm run dev
```

**Making Changes**:

1. Create feature branch
2. Update relevant memory-bank docs if architecture changes
3. Test in both light and dark mode
4. Verify mobile responsive layout
5. Submit PR with clear description

### Code Review Priorities

**Must Check**:

- TypeScript errors resolved
- Console errors cleared
- Dark mode appearance
- Mobile responsiveness
- Error handling present

**Nice to Have**:

- Performance optimizations
- Accessibility improvements
- Code comments for complex logic

## Active Questions & Decisions Needed

### 1. Authentication Strategy

**Options**:

- Firebase Auth (quick setup, managed)
- Auth0 (more features, costs money)
- Custom JWT (full control, more work)

**Decision Criteria**: Speed to market vs long-term flexibility

**When to Decide**: Before Phase 2 backend work

### 2. Database Choice

**Options**:

- PostgreSQL (relational, mature, good for structured data)
- MongoDB (document, flexible schema)
- Supabase (PostgreSQL + Auth + Storage)

**Consideration**: Need relational structure for accounts, posts, schedules

**Leaning Toward**: PostgreSQL (or Supabase for integrated solution)

### 3. Real Social Platform Integration

**Question**: Which platform to integrate first?

**Options**:

1. Twitter/X (Most requested by users)
2. LinkedIn (Professional audience fit)
3. Instagram (Visual content, complex API)

**Decision**: Based on API availability and user research

## Upcoming Milestones

### This Week

- [x] Initialize Memory Bank
- [ ] Complete progress.md
- [ ] Polish Calendar drag-and-drop
- [ ] Add Composer media preview

### Next 2 Weeks

- [ ] Design API schema
- [ ] Set up backend boilerplate
- [ ] Implement authentication
- [ ] Connect to PostgreSQL

### Month 1

- [ ] Replace all mock data with API calls
- [ ] Deploy to Vercel (frontend)
- [ ] Deploy to Railway (backend)
- [ ] Beta test with 10 users

## Monitoring Current Session

**Session Goal**: Phase 1 Foundation Documentation Alignment Complete

**Progress**:

- ✅ Analyzed codebase structure (found existing `/src` with subdirectories)
- ✅ Identified organization conflict (phase docs created root-level dirs)
- ✅ Confirmed with user to use `/src` as base directory (Option A)
- ✅ Updated `docs/phases/phase1_foundation.md` with `/src` paths
- ✅ Updated `docs/phases/implementation_plan.md` architecture diagram
- ✅ All directory commands now use `/src` prefix
- ✅ All path aliases point to `/src` subdirectories
- ✅ All code examples and deliverables updated
- ✅ Updating memory bank documentation

**Blockers**: None

**Next Action**: Phase 1 implementation ready when user is prepared

**Current Documentation Structure**:

```
/socialflow
├── /src (all source code organized here - FOUNDATION READY)
│   ├── /features (to be created in Phase 1)
│   ├── /types (to be created in Phase 1)
│   ├── /utils (to be created in Phase 1)
│   ├── /hooks (exists, will be populated)
│   ├── /lib (exists, will be populated)
│   ├── /components (exists, will be organized)
│   └── /services (will be moved from root)
├── /components (legacy at root - to be migrated)
├── /docs/phases (all phase documentation)
└── /memory-bank (project context and status)
```

**Key Achievement**: All Phase 1 documentation now consistently uses `/src` as the base directory, providing clear guidance for implementation without confusion.
