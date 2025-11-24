# Active Context: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Phase

**Last Updated**: November 23, 2025 (6:36 PM)

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

**Completed Phases**:
- ✅ Phase 0a: Development Tools (ESLint, Prettier, Vitest configured)
- ✅ Phase 1: Foundation Setup (/src structure, types split into 3 modules, constants extracted)
- ✅ Phase 2: Custom Hooks (5 hooks + 3 utility modules extracted from App.tsx)
- ✅ Phase 3: Dashboard Refactoring (550-line monolith → 100-line orchestrator + 10 widgets)
- ✅ Phase 4: Composer Refactoring (1,850-line monolith → 217-line orchestrator + 14 sub-components)

**Latest**: Composer.tsx reduced from 1,850 to 217 lines (-88%). Created `/src/features/composer/` with 15 files: 14 specialized components, 1 custom hook (useComposer), 1 orchestrator. All components independently testable. Includes bug fix for PreviewPanel scrolling.

**Details**: See `progress.md` for complete session history with metrics and verification.

## Next Steps

### Immediate Focus (This Week)

**Phase 5: Shared Components Migration**
- Move truly reusable components to `/src/components/`
- Organize into ui/, layout/, feedback/ subdirectories
- Keep feature-specific components in their feature folders

**Documentation**: See `docs/phases/phase5_shared_components.md` for detailed plan.

### Upcoming (Next 2 Weeks)

1. **Phase 6**: Simplify App.tsx further (reduce from 280 lines)
2. **Phase 7**: Add basic tests (Vitest infrastructure already configured)
3. **Fix Linting**: Address 77 ESLint issues gradually during refactoring
4. **Commit & Document**: Commit Phase 4 completion

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
