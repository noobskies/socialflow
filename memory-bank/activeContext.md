# Active Context: SocialFlow AI

## Current Status

**Phase**: Phase 7 - Testing & Quality Assurance  
**Last Updated**: November 23, 2025

**What This Project Is**: A professional AI-first social media management platform with a fully refactored React/TypeScript frontend, ready for backend integration.

---

## Current Work Focus

### Project Status: Frontend Complete, Testing Next

The frontend refactoring project (Phases 0a-6h) is complete. All 10 major components have been professionally refactored using SOLID/DRY principles with feature-based organization. The codebase is now ready for testing and backend integration.

**Latest Achievement**: All frontend refactoring phases complete (6,897 → 1,300 lines, -81% reduction, 135+ focused components created)

## Next Steps

### Immediate Focus (This Week)

**Phase 7 Priority**: Testing Infrastructure
- Add unit tests for custom hooks (useToast, useModal, useTheme, useKeyboard, useLocalStorage)
- Add unit tests for utility functions (dates, formatting, validation)
- Add component tests for UI library (Button, Input, Modal, Card)
- Add integration tests for key features

### Upcoming (Next 2 Weeks)

1. **Linting Cleanup**: Address remaining 77 ESLint issues gradually
2. **Code Review**: Ensure consistency across all refactored features
3. **Documentation**: Update README with new architecture
4. **Performance**: Add React.memo where needed, implement lazy loading

### Future Priorities

1. **Backend Planning**: Design API schema and data models
2. **Authentication**: Firebase Auth or Auth0 integration
3. **Social Platform APIs**: Real integrations (Twitter, LinkedIn, Instagram)
4. **Real-time Features**: WebSocket support for notifications

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
- **77 Linting Issues**: Non-blocking, will fix gradually

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
