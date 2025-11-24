# Active Context: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Phase

**Last Updated**: November 23, 2025 (9:27 PM)

**What This Project Is**: Frontend MVP exported from Google AI Studio that needs professional refactoring

**What We're Doing**: Refactoring frontend code with SOLID/DRY principles and organizing file structure

**What We're NOT Doing**: Backend development (that comes later)

**Freedom**: No backwards compatibility constraints - we can make breaking changes

**Goal**: Professional, maintainable, well-organized codebase ready for eventual backend integration

---

## Current Work Focus

### Project Status: Frontend Refactoring Phase

Refactoring an AI Studio-generated MVP to establish professional code architecture. The functional prototype exists, but code organization needs improvement before scaling or adding backend integration.

## Recent Progress

### Phase 6d-6h: Documentation Planning ✅ (Nov 23, 2025)

**Duration**: ~1 hour  
**Result**: Created comprehensive refactoring documentation for remaining 4 components + App.tsx

**Created Documentation** (5 phase plans):

1. **phase6d_inbox.md** - Inbox refactoring plan
   - Current: 475 lines → Target: ~80 lines (-83%)
   - 10-12 files to create (2 tabs, 8 components, 2 utils)
   - Key features: Messages + listening tabs, AI replies, sentiment analysis
   - Reuses platform icons from Calendar

2. **phase6e_library.md** - Library refactoring plan (LARGEST!)
   - Current: 713 lines (LARGEST!) → Target: ~100 lines (-86%)
   - 15-18 files to create (5 tabs, 11 components, 1 util)
   - Key features: Media library, RSS feeds, content buckets, hashtag groups, stock photos
   - Most complex with folder management and multiple sub-features

3. **phase6f_linkmanager.md** - LinkManager refactoring plan  
   - Current: 454 lines → Target: ~80 lines (-82%)
   - 12-14 files to create (3 tabs, 9 components, 1 util)
   - Key features: Short links, bio page builder with phone preview, lead capture

4. **phase6g_automations.md** - Automations refactoring plan
   - Current: 381 lines → Target: ~70 lines (-82%)
   - 8-10 files to create (2 tabs, 6 components, 1 util)
   - Key features: Workflows, integrations, AI workflow architect

5. **phase6h_app_simplification.md** - App.tsx simplification plan (renamed from old phase6d)
   - Current: 235 lines → Target: ~120-150 lines (-40%)
   - 2-3 files to create (MobileHeader, MobileNav, optional ViewRouter)
   - Final cleanup after all component migrations

**Total Documentation Impact**:
- **4 Components**: 2,023 lines → ~330 lines (-84%) + ~50 new components
- **App.tsx**: 235 → ~140 lines (-40%) + 2 layout components
- **Combined with Phases 6a-6c**: 9,103 lines → ~1,580 lines (-83%) across 10 files

**Execution Order Documented**:
1. Phase 6d: Inbox (easiest - 2 tabs)
2. Phase 6e: Library (hardest - 5 complex tabs)
3. Phase 6f: LinkManager (medium - bio builder)
4. Phase 6g: Automations (easy - 2 tabs)
5. Phase 6h: App.tsx (final cleanup)

**Documentation Quality**:
- Follows proven pattern from Phases 6a-6c
- Detailed sub-phases with step-by-step code
- Complete component breakdowns
- Verification checklists
- Mock data migration notes
- Integration guidance

**Key Patterns**:
- Orchestrator pattern for all components
- Custom hooks for state management
- Tab-based organization
- Component reusability (platform icons, FeatureGateOverlay)
- Utility extraction where beneficial

**Next Action**: Ready to execute Phases 6d-6h (estimated 6-8 hours total)

**Completed Phases**:
- ✅ Phase 0a: Development Tools (ESLint, Prettier, Vitest configured)
- ✅ Phase 1: Foundation Setup (/src structure, types split into 3 modules, constants extracted)
- ✅ Phase 2: Custom Hooks (5 hooks + 3 utility modules extracted from App.tsx)
- ✅ Phase 3: Dashboard Refactoring (550-line monolith → 100-line orchestrator + 10 widgets)
- ✅ Phase 4: Composer Refactoring (1,850-line monolith → 217-line orchestrator + 14 sub-components)
- ✅ Phase 5: Shared Components Migration (11 components organized into /src/components/)
- ✅ Phase 6a: Analytics Refactoring (677-line monolith → 60-line orchestrator + 15 components)
- ✅ Phase 6b: Settings Refactoring (813-line monolith → 150-line orchestrator + 19 components)
- ✅ Phase 6c: Calendar Refactoring (697-line monolith → 130-line orchestrator + 16 components)
- ✅ Phase 6d: Inbox Refactoring (475-line monolith → 80-line orchestrator + 12 components)
- ✅ Phase 6e: Library Refactoring (713-line monolith → 165-line orchestrator + 18 components)
- ✅ Phase 6f: LinkManager Refactoring (454-line monolith → 80-line orchestrator + 14 components)
- ✅ Phase 6g: Automations Refactoring (381-line monolith → 70-line orchestrator + 10 components)

**Latest**: Phase 6g complete - Refactored Automations component (381 lines). Created 10 focused components organized in `/src/features/automations/` with tabs/, components/ subdirectories. Main Automations.tsx reduced from 381 to 70 lines (-82%). Successfully implemented 2 complete tabs (workflows, integrations) with workflow management, AI workflow architect, integration cards, and create workflow modal. Added mock data (MOCK_WORKFLOWS, MOCK_INTEGRATIONS) to constants.ts. TypeScript: 0 errors. App.tsx integration complete. **ALL 9 FEATURES NOW REFACTORED!** 🎉

**Details**: See `progress.md` for complete session history with metrics and verification.

## Next Steps

### Immediate Focus (This Week)

**Phase 6f Complete** ✅ - LinkManager refactored successfully!

**Remaining Components** (App.tsx only):
1. **Phase 6h: App.tsx** (235 → ~140 lines, 2-3 files) - Final cleanup

**Next Target**: Phase 6h (App.tsx) - Final simplification and cleanup

**Major Milestone**: All 9 feature components now refactored! 🎉

### Upcoming (Next 2 Weeks)

1. **Complete Phases 6e-6h**: Finish remaining component refactoring
2. **Phase 7**: Add basic tests (Vitest infrastructure already configured)
3. **Fix Linting**: Address ESLint issues gradually
4. **Code Review**: Ensure consistency across all refactored features

## Active Design Decisions

### State Management
**Decision**: React useState at root level (App.tsx)  
**Why**: Simple, sufficient for MVP size, easy to debug  
**Trade-offs**: Some prop drilling (acceptable), can migrate to Context API later if needed

### Routing
**Decision**: ViewState enum instead of React Router  
**Why**: Instant transitions, simpler for MVP  
**Trade-offs**: No URL bookmarking, will migrate when URL sharing is needed

### AI Service
**Pattern**: Separate `geminiService.ts` with clean exports  
**Why**: Easy to swap providers, testable, centralized API key management  
**Success Metric**: Should take < 1 hour to swap Gemini for OpenAI

## Important Patterns & Preferences

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
  // 4. State, Effects, Handlers, Render
  return <div>{/* JSX */}</div>;
};

// 5. Export
export default Component;
```

### Naming Conventions

- **Files**: PascalCase for components (`Dashboard.tsx`), camelCase for utilities
- **Components**: PascalCase (`Dashboard`, `Composer`)
- **Functions**: camelCase (`handleClick`, `getTrendingTopics`)
- **Props**: camelCase (`showToast`, `onPostCreated`)
- **Types**: PascalCase (`Post`, `ViewState`, `ToastType`)
- **Constants**: UPPER_SNAKE_CASE (`INITIAL_POSTS`)

### Error Handling Philosophy

**Graceful Degradation**: App should never crash

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

### TypeScript Usage

**Strictness**: Full strict mode enabled

**Preferences**:
- Explicit types for function parameters
- Infer return types when obvious
- Use interfaces over types for objects
- Define types in `@/types` if used in 2+ places

**Avoid**:
- `any` type (use `unknown` if truly dynamic)
- Type assertions (use type guards instead)
- Optional chaining abuse

## Known Technical Challenges

### Mock Data Persistence
Changes lost on refresh - acceptable for prototype, requires backend API + database for production.

### AI Response Consistency
Gemini occasionally returns malformed JSON - handled with specific prompts, fallback parsing, and user-friendly errors. Will add structured output mode and caching.

### Timezone Handling
Currently uses browser local time - need UTC storage + timezone selection when backend is added.

### File Uploads
No storage available - using URLs/data URIs temporarily. Requires S3/CDN integration with backend.

## Key Learnings

1. **Tailwind dark mode**: `dark:` variants work perfectly - establish color variables early
2. **Mock data**: Accelerates UI development significantly - make it realistic but don't get attached
3. **AI prompts**: Require iteration - start clear, test extensively, add error handling
4. **Prop drilling**: Fine until 3 levels deep, then consider Context API for subtrees
5. **TypeScript types**: Well-named interfaces are self-documenting - avoid comments

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
