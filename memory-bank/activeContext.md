# Active Context: SocialFlow AI

## Current Status

**Phase**: Phase 7 Complete → Phase 8 Preparation  
**Last Updated**: November 23, 2025

**What This Project Is**: A professional AI-first social media management platform with a fully refactored React/TypeScript frontend, ready for backend integration.

---

## Current Work Focus

### Project Status: Frontend Complete + Next.js Migration Planning Complete

The frontend refactoring project (Phases 0a-7d) is complete. All 135+ components have been professionally refactored using SOLID/DRY principles with feature-based organization. Phase 7 achieved 100% type safety, zero linting errors, and full AI integration.

**Latest Achievement**: Phase 8 Migration Planning Complete (November 23, 2025)
- ✅ Created comprehensive Vite to Next.js 16 migration plan
- ✅ Documented 10 detailed phases (8a-8j) with step-by-step instructions
- ✅ Implementation plan covers all technical aspects
- ✅ Zero breaking changes expected - all 135+ components preserved
- ✅ Each phase has testing, troubleshooting, and rollback strategies
- ✅ Migration ready to execute when needed

**Phase 8 Planning Deliverables**:
- `implementation_plan.md`: Complete technical overview and implementation order
- `docs/phases/phase8a-8j_*.md`: 10 detailed phase documentation files
- Estimated total time: 8-12 hours (excluding optional Phase 8h)
- Approach: Incremental, testable, with SPA mode initially

**Strategic Decision**: Testing (Phase 7c) deferred to Phase 10 (after backend integration) to avoid test rewrites. Migration planning (Phase 8) complete but not yet executed - ready to begin when needed.

## Next Steps

### Immediate Focus (Next Session)

**Options for Next Phase**:

**Option 1: Execute Migration (Phase 8 Implementation)**
- Follow implementation_plan.md step-by-step
- Execute phases 8a through 8j (8h optional)
- Migrate from Vite to Next.js 16
- Estimated time: 8-12 hours
- Result: Modern Next.js app ready for deployment

**Option 2: Backend Planning (Defer Migration)**
- Design database schema (Users, Posts, Accounts, etc.)
- Define API architecture (REST vs GraphQL)
- Choose authentication strategy
- Select backend tech stack
- Plan hosting infrastructure

**Recommendation**: Execute migration first (Option 1), then backend planning. Migration provides better foundation for backend integration with Next.js API routes.

**Rationale for Testing Deferral**:
- Backend integration will significantly change component data flows
- State management patterns likely to evolve (Context/Zustand)
- Better ROI to write tests after architecture stabilizes
- Current clean code + migration plan provides confidence

### Upcoming (Next 4 Weeks)

1. **Backend Planning**: Complete Phase 8 with comprehensive architecture blueprint
2. **Backend Development**: Begin Phase 9 implementation
3. **Code Review**: Periodic checks for consistency
4. **Documentation**: Keep Memory Bank and README updated

### Future Priorities (After Phase 8-9)

1. **Phase 10 - Integration & Testing**: Connect frontend to backend, write comprehensive tests
2. **Social Platform APIs**: Real OAuth integrations (Twitter, LinkedIn, Instagram, etc.)
3. **Real-time Features**: WebSocket support for notifications and collaboration
4. **Advanced Features**: Team collaboration, approval workflows, automation templates
5. **Performance Optimization**: React.memo, code splitting, lazy loading, CDN

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

### State Management
**Decision**: React useState at root level (App.tsx)  
**Why**: Simple, sufficient for MVP size, easy to debug  
**Future**: May migrate to Context API or Zustand if prop drilling becomes problematic

### Routing
**Decision**: ViewState enum instead of React Router  
**Why**: Instant transitions, simpler for MVP  
**Future**: Migrate to React Router when URL sharing/bookmarking is needed

### AI Service
**Pattern**: Separate `geminiService.ts` with clean exports  
**Why**: Easy to swap providers, testable, centralized API key management  
**Success Metric**: Should take < 1 hour to swap Gemini for OpenAI

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
# Add VITE_GEMINI_API_KEY to .env.local
npm run dev
```

**Code Review Priorities**:
- TypeScript errors resolved
- Console errors cleared
- Dark mode appearance tested
- Mobile responsiveness verified
- Error handling present
- Follows established patterns
