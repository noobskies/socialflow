# System Patterns: SocialFlow AI

## 🚨 CRITICAL CONTEXT: Frontend Refactoring Focus

**Current State**: AI Studio-generated MVP with flat file structure needs professional refactoring

**Refactoring Goals**:

1. **SOLID Principles**: Single Responsibility, Open/Closed, Dependency Inversion
2. **DRY Implementation**: Extract repeated logic into hooks, utilities, and shared components
3. **File Organization**: Move from flat structure to feature-based organization
4. **Future-Ready**: Prepare codebase for backend integration

**No Backwards Compatibility**: Freedom to make breaking changes for better architecture

---

## Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                     App.tsx (Root)                      │
│  - Global state management                              │
│  - Theme handling (light/dark/system)                   │
│  - Toast notifications                                  │
│  - Modal management                                     │
│  - Keyboard shortcuts                                   │
└─────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼───────┐  ┌────────▼────────┐
│   Sidebar      │  │  Main Content  │  │  Mobile Nav     │
│  - Navigation  │  │  - View Router │  │  - Bottom Bar   │
│  - Branding    │  │  - Components  │  │  - FAB Button   │
└────────────────┘  └────────────────┘  └─────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐  ┌───────▼───────┐  ┌────▼─────┐
    │  Dashboard  │  │   Composer    │  │ Calendar │
    │  Analytics  │  │   Library     │  │ Settings │
    │  Inbox      │  │   LinkManager │  │ etc.     │
    └─────────────┘  └───────────────┘  └──────────┘
                             │
                    ┌────────▼────────┐
                    │   Services      │
                    │  - geminiService│
                    │  (AI API calls) │
                    └─────────────────┘
```

## Component Architecture

### 1. Single-Page Application Pattern

**Design Decision**: ViewState enum controls which component renders
**Why**: Simpler than React Router for MVP, instant transitions, less complexity

```typescript
enum ViewState {
  DASHBOARD = "DASHBOARD",
  COMPOSER = "COMPOSER",
  CALENDAR = "CALENDAR",
  ANALYTICS = "ANALYTICS",
  INBOX = "INBOX",
  LIBRARY = "LIBRARY",
  SETTINGS = "SETTINGS",
  LINKS = "LINKS",
  AUTOMATIONS = "AUTOMATIONS",
}
```

**Navigation Flow**:

- Sidebar buttons update `currentView` state
- App.tsx `renderView()` conditionally renders component
- Mobile bottom nav updates same state
- URL does not change (trade-off for simplicity)

### 2. State Management Pattern

**Current Approach**: React useState at root level (App.tsx)
**No global state library** (Redux, Zustand, etc.) - keeping it simple for MVP

**State Location Strategy**:

```typescript
// GLOBAL STATE (App.tsx) - Shared across views
- posts: Post[]                    // All scheduled/published posts
- accounts: SocialAccount[]        // Connected social accounts
- userPlan: PlanTier              // User's subscription level
- branding: BrandingConfig        // Agency white-label settings
- theme: 'light' | 'dark' | 'system'

// LOCAL STATE (Individual Components) - Scoped to component
- form inputs, UI toggles, temporary data
```

**Prop Drilling Pattern**:

- Props flow down from App.tsx to child components
- Callbacks flow up to modify parent state
- Example: `Dashboard` receives `posts` prop, calls `onPostCreated` callback

**Why Not Context API?**

- Added complexity for small team
- Performance not an issue with current data size
- Easier to debug with explicit props
- Plan to migrate to backend + API eventually

### 3. Data Flow Patterns

#### Creating a Post (Composer → Calendar)

```
User Action → Composer Component
    ↓
Form State (local)
    ↓
onPostCreated(newPost) callback
    ↓
App.tsx setPosts([...posts, newPost])
    ↓
Calendar Component (receives updated posts prop)
    ↓
Re-renders with new post
```

#### Updating User Settings

```
User Action → Settings Component
    ↓
onChange handler (local state)
    ↓
onSave → callback to App.tsx
    ↓
App.tsx updates state + localStorage
    ↓
Settings Component receives confirmation
    ↓
showToast('Settings saved')
```

## Key Technical Decisions

### 1. Mock Data Strategy

**Current Pattern**: Static data in component files
**Location**: `INITIAL_POSTS`, `INITIAL_ACCOUNTS` constants in App.tsx

**Why Mock Data?**

- Rapid prototyping without backend dependency
- Demonstrates full UI flow
- Easy to replace with API calls later

**Migration Path**:

```typescript
// Current (Mock)
const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

// Future (API)
const [posts, setPosts] = useState<Post[]>([]);
useEffect(() => {
  fetchPosts().then(setPosts);
}, []);
```

### 2. AI Service Integration

**Pattern**: Dedicated service file (`services/geminiService.ts`)

```typescript
// Centralized AI logic
export const getTrendingTopics = async (niche: string): Promise<Trend[]>
export const generatePostContent = async (prompt: string): Promise<string>
export const analyzeImage = async (imageUrl: string): Promise<Analysis>
```

**Why Separate Service**:

- Single source of truth for AI interactions
- Easy to swap AI providers later
- Testable in isolation
- Handles API key management

**Error Handling Pattern**:

```typescript
try {
  const result = await geminiService.generate(prompt);
  return result;
} catch (error) {
  console.error("AI generation failed:", error);
  return fallbackContent;
}
```

### 3. Type System Organization

**Central Types File**: `types.ts` contains all shared interfaces

**Type Categories**:

- **Domain Types**: `Post`, `Draft`, `SocialAccount`, `User`
- **UI Types**: `ViewState`, `ToastType`, `PlanTier`
- **Feature Types**: `Workflow`, `Integration`, `MediaAsset`
- **Config Types**: `BrandingConfig`, `PlatformOptions`

**Why Centralized Types**:

- Single source of truth
- Easy IDE autocomplete
- Prevents type duplication
- Clear contract between components

### 4. Modal Management Pattern ✅

**Pattern**: Controlled at root level using `useModal` custom hook

**Implementation**: Each modal uses an instance of `useModal()` hook that provides `isOpen`, `openModal`, `closeModal`, `toggleModal` methods. See `src/hooks/useModal.ts` for implementation details.

**Benefits**: Reusable pattern, prevents modal overlap, consistent behavior, DRY principle applied.

## Component Communication Patterns

### Parent-to-Child (Props)

```typescript
<Dashboard
  posts={posts} // Data down
  accounts={accounts}
  onPostCreated={handlePostCreated} // Events up
  showToast={showToast}
  onCompose={handleCompose}
/>
```

### Child-to-Parent (Callbacks)

```typescript
// Child calls parent's function
const handleSave = () => {
  const newPost = {
    /* ... */
  };
  props.onPostCreated(newPost); // Notify parent
};
```

### Sibling-to-Sibling (Through Parent)

```typescript
// Composer creates post → Calendar displays it
// Both share parent (App.tsx) as intermediary

// Composer
onPostCreated(newPost)  →  App.tsx setPosts()  →  Calendar receives new posts prop
```

## Critical Implementation Paths

### 1. Creating and Scheduling a Post

**Flow**: Composer → Form State → Validation → Parent State → Calendar

**Components Involved**:

- `Composer.tsx`: Form UI, AI assist, media upload
- `App.tsx`: State management
- `Calendar.tsx`: Display scheduled posts
- `geminiService.ts`: AI content generation

**Key Functions**:

```typescript
// Composer.tsx
const handlePublish = async () => {
  // 1. Validate form
  if (!content.trim()) return;

  // 2. Create post object
  const newPost: Post = {
    id: Date.now().toString(),
    content,
    platforms: selectedPlatforms,
    scheduledDate,
    status: "scheduled",
    time: selectedTime,
  };

  // 3. Notify parent
  onPostCreated(newPost);

  // 4. Reset form
  resetForm();

  // 5. Show feedback
  showToast("Post scheduled successfully");
};
```

### 2. AI Trend Discovery

**Flow**: Dashboard → AI Service → Parse Results → Display → User Action

**Components Involved**:

- `Dashboard.tsx`: Trending topics widget
- `geminiService.ts`: Gemini API call
- `Composer.tsx`: Draft from trend

**Key Functions**:

```typescript
// Dashboard.tsx
const loadTrends = async () => {
  setLoadingTrends(true);
  const trends = await getTrendingTopics(niche);
  setTrends(trends);
  setLoadingTrends(false);
};

// User clicks "Draft Post" on trend
const handleDraftFromTrend = (trend: Trend) => {
  onCompose({
    content: `Thinking about: ${trend.topic}\n\nContext: ${trend.context}`,
  });
};
```

### 3. Theme Switching ✅

**Pattern**: User Toggle → useTheme Hook → DOM Class → CSS Variables

**Implementation**: Uses `useTheme()` custom hook that handles localStorage persistence, system preference detection, and DOM class updates. See `src/hooks/useTheme.ts` for details.

**CSS Pattern**: Tailwind `dark:` variants respond to `.dark` class on `<html>` element.

### 4. Keyboard Shortcuts ✅

**Pattern**: Global event listener managed by `useKeyboard()` custom hook

**Implementation**: Hook accepts an object mapping key combinations to handler functions. Automatically handles input field detection, modifier keys, cleanup, etc. See `src/hooks/useKeyboard.ts` for details.

## Design Patterns Used

### 1. Presentational vs Container Pattern

**Presentational** (Dumb Components):

- Receive all data via props
- No business logic
- Pure rendering
- Example: Individual cards, buttons, form fields

**Container** (Smart Components):

- Manage state
- Handle API calls
- Contain business logic
- Pass data to presentational children
- Example: Dashboard, Composer, Calendar

### 2. Compound Components

**Example**: Toast notification system

```typescript
<Toast
  message={toast.message}
  type={toast.type}
  isVisible={toast.visible}
  onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
/>
```

Self-contained with internal animation/positioning logic.

### 3. Render Props (Callbacks)

```typescript
// Parent provides rendering logic via callback
<Calendar
  onCompose={(draft) => {
    setInitialDraft(draft);
    setCurrentView(ViewState.COMPOSER);
  }}
/>
```

### 4. Custom Hooks ✅

**Available Hooks** (`/src/hooks/`):
- `useToast` - Toast notification state management
- `useModal` - Modal state controller (reusable for any modal)
- `useTheme` - Theme switching with localStorage persistence
- `useKeyboard` - Global keyboard shortcuts handler
- `useLocalStorage` - Generic localStorage with debounce

**Feature Hooks** (`/src/features/*/`):
- `useDashboard` - Dashboard-specific state (trends loading)
- `useComposer` - Composer state orchestration (content, platforms, media, polls)
- `useAnalytics` - Analytics tab state and report management
- `useSettings` - Settings tab navigation and form state
- `useCalendar` - Calendar view mode, drag-drop, and post selection
- `useInbox` - Inbox tab state and message handling
- `useLibrary` - Library tab state, folder/asset management, and filters
- `useLinkManager` - LinkManager tab state (shortener, bio, leads)
- `useAutomations` - Automations tab state (workflows, integrations, modal management)

**Usage**: Import from `@/hooks/*` and use in components. All hooks follow React best practices with proper cleanup.

### 5. Orchestrator Pattern ✅ (Phase 3 & 4)

**Pattern**: Large feature components broken into orchestrator + specialized sub-components

**Example: Composer Architecture** (Phase 4)

```typescript
// useComposer.ts - State management hook
export function useComposer(initialDraft?: Draft) {
  const [content, setContent] = useLocalStorage("draft_content", "", 1000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  // ... all composer state
  
  return {
    content, setContent,
    selectedPlatforms, togglePlatform,
    mediaUrl, handleMediaUpload,
    // ... all state and actions
  };
}

// Composer.tsx - Orchestrator (217 lines)
export const Composer: React.FC<ComposerProps> = (props) => {
  const composer = useComposer(props.initialDraft);
  const schedulingModal = useModal();
  
  return (
    <div>
      <PlatformSelector 
        selectedPlatforms={composer.selectedPlatforms}
        onToggle={composer.togglePlatform}
      />
      <ContentEditor 
        content={composer.content}
        onChange={composer.setContent}
      />
      <PreviewPanel 
        content={composer.content}
        platforms={composer.selectedPlatforms}
      />
      {/* ... other specialized components */}
    </div>
  );
};
```

**Benefits**:
- Main component stays clean (~200 lines)
- Sub-components are focused and testable
- Custom hook manages complex state
- Easy to understand flow
- Scalable architecture

**Components Extracted in Composer**:
1. PlatformSelector - Platform button grid
2. PlatformOptions - Platform-specific settings
3. ContentEditor - Textarea with toolbar
4. PreviewPanel - Multi-platform preview
5. MediaPreview - Uploaded media display
6. PollCreator - Poll options interface
7. AIPanel - Tab container
8. AIWriter - Content generation
9. AIDesigner - Image generation
10. TeamCollaboration - Comments
11. SchedulingModal - Date/time picker
12. ProductPickerModal - Product selection
13. AnalysisModal - AI analysis results
14. useComposer hook - State orchestration

## Component Relationships

### High-Interaction Components

**Dashboard ↔ Composer**:

- Dashboard "Quick Draft" creates draft post
- Dashboard "Trending Topics" pre-fills Composer
- Composer saves draft back to Dashboard's post list

**Calendar ↔ Composer**:

- Calendar shows all scheduled posts
- Clicking post in Calendar opens Composer (edit mode)
- Composer creates/updates posts displayed in Calendar

**Settings ↔ App**:

- Settings modifies global state (theme, branding, accounts)
- App provides current state and update callbacks
- Changes persist to localStorage

### Shared Utilities

**showToast Function**:

- Passed as prop to all major components
- Standardized success/error messaging
- 3-second auto-dismiss

**onCompose Function**:

- Multiple components trigger Composer
- Can pre-fill content via `Draft` object
- Centralizes "create post" action

## Performance Considerations

### Current Optimizations

1. **Conditional Rendering**: Only active view component renders
2. **Local State**: Component-scoped state prevents unnecessary re-renders
3. **Static Imports**: All components imported upfront (small bundle size)
4. **Mock Data**: No API latency in development

### Planned Optimizations

1. **React.memo**: Memoize expensive components (Calendar grid)
2. **useMemo/useCallback**: Prevent function recreation on re-renders
3. **Lazy Loading**: Code-split large components
4. **Virtual Scrolling**: For long lists (1000+ posts in Calendar)
5. **Debouncing**: AI API calls during typing

## Known Limitations

### Current Technical Debt

1. **No URL Routing**: Can't bookmark specific views
2. **Props Drilling**: Deep nesting in some components
3. **No Error Boundaries**: App crashes on unhandled errors
4. **Mock Data Persistence**: Changes lost on refresh
5. **No Loading States**: Some actions feel instant but won't be with API
6. **Client-Side Only**: No SSR, no initial data hydration

### Migration Path

**Phase 1 → 2 Refactors**:

- Add React Router for proper routing
- Implement Context API or Zustand for state
- Add error boundaries around major components
- Replace mock data with API calls
- Add loading skeletons throughout

## Testing Strategy (Planned)

### Unit Tests

- Service functions (geminiService)
- Utility functions (date formatting, etc.)
- Type guards and validators

### Integration Tests

- Complete user flows (create post → schedule → view in calendar)
- Form validation and submission
- AI interaction patterns

### E2E Tests

- Onboarding flow
- Post creation and scheduling
- Settings updates
- Theme switching

**Testing Library Stack (Planned)**:

- Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

## Security Considerations

### Current Implementation

1. **API Key Storage**: Environment variables (`.env.local`)
2. **Client-Side Only**: No backend means no auth yet
3. **No Data Validation**: Trust client input (MVP only)

### Future Security

1. **Authentication**: Firebase Auth or Auth0
2. **API Gateway**: Backend validates all requests
3. **Rate Limiting**: Prevent AI API abuse
4. **Input Sanitization**: Prevent XSS in post content
5. **CORS**: Restrict allowed origins
6. **Secrets Management**: Move API keys to backend

## Deployment Architecture (Planned)

```
Frontend (Vite Build)
    ↓
Vercel / Netlify
    ↓
CDN (Static Assets)

Backend API (Future)
    ↓
Node.js / Express
    ↓
PostgreSQL + Redis
    ↓
AWS / Railway / Render
```

## File Organization

### Current Structure (Phase 5 Complete ✅)

```
/socialflow
├── App.tsx              # ⚠️ Still has logic, will simplify in Phase 6
├── index.tsx
├── types.ts             # 🔴 Legacy file (to be removed after verification)
│
├── /src                 # ✅ Professional structure implemented
│   ├── /features        # ✅ Phases 3, 4, 6a, 6b, 6c complete
│   │   ├── /dashboard   # ✅ COMPLETE (12 files)
│   │   │   ├── Dashboard.tsx (100-line orchestrator)
│   │   │   ├── useDashboard.ts
│   │   │   └── ... (10 widget components)
│   │   ├── /composer    # ✅ COMPLETE (15 files)
│   │   │   ├── Composer.tsx (217-line orchestrator)
│   │   │   ├── useComposer.ts
│   │   │   └── ... (13 sub-components + modals)
│   │   ├── /analytics   # ✅ COMPLETE (15 files)
│   │   │   ├── Analytics.tsx (60-line orchestrator)
│   │   │   ├── useAnalytics.ts
│   │   │   ├── /tabs (3 tab components)
│   │   │   ├── /charts (4 chart components)
│   │   │   └── /widgets (6 widgets)
│   │   ├── /settings    # ✅ COMPLETE (19 files)
│   │   │   ├── Settings.tsx (150-line orchestrator)
│   │   │   ├── useSettings.ts, SettingsSidebar.tsx
│   │   │   ├── /tabs (8 tab components)
│   │   │   └── /widgets (8 widgets)
│   │   ├── /calendar    # ✅ COMPLETE (16 files)
│   │   │   ├── Calendar.tsx (130-line orchestrator)
│   │   │   ├── useCalendar.ts, ViewModeToggle.tsx
│   │   │   ├── /views (CalendarView, KanbanView, GridView)
│   │   │   ├── /components (6 components)
│   │   │   └── /utils (5 utility modules)
│   │   ├── /inbox       # ✅ COMPLETE (12 files)
│   │   │   ├── Inbox.tsx (80-line orchestrator)
│   │   │   ├── useInbox.ts
│   │   │   ├── /tabs (MessagesTab, ListeningTab)
│   │   │   ├── /components (7 components)
│   │   │   └── /utils (sentimentUtils.tsx)
│   │   ├── /library     # ✅ COMPLETE (18 files)
│   │   │   ├── Library.tsx (165-line orchestrator)
│   │   │   ├── useLibrary.ts
│   │   │   ├── /tabs (5 tab components)
│   │   │   └── /components (10 components)
│   │   ├── /linkmanager # ✅ COMPLETE (14 files)
│   │   │   ├── LinkManager.tsx (80-line orchestrator)
│   │   │   ├── useLinkManager.ts
│   │   │   ├── /tabs (3 tab components)
│   │   │   └── /components (9 components)
│   │   └── /automations # ✅ COMPLETE (10 files)
│   │       ├── Automations.tsx (70-line orchestrator)
│   │       ├── useAutomations.ts
│   │       ├── /tabs (2 tab components)
│   │       └── /components (6 components)
│   │
│   ├── /components      # ✅ Dirs ready for Phase 5
│   │   ├── /ui
│   │   ├── /layout
│   │   └── /feedback
│   │
│   ├── /hooks           # ✅ Ready for Phase 2
│   ├── /lib             # ✅ Ready for future wrappers
│   │
│   ├── /utils           # ✅ Phase 1 complete
│   │   └── constants.ts # All mock data centralized
│   │
│   ├── /types           # ✅ Phase 1 complete  
│   │   ├── index.ts     # Re-export hub
│   │   ├── domain.ts    # Post, Draft, Account, User, Trend
│   │   ├── ui.ts        # ViewState, ToastType, Notification
│   │   └── features.ts  # Workflow, BrandingConfig, Product, etc.
│   │
│   ├── /services        # ✅ Moved in Phase 1
│   │   └── geminiService.ts
│   │
│   └── /test            # ✅ From Phase 0a
│       └── setup.ts
│
├── /components          # ⚠️ Legacy (to be migrated in Phase 4+)
│   ├── Dashboard.tsx    # 🔴 LEGACY - Replaced by /src/features/dashboard/
│   ├── Composer.tsx     # ⚠️ Phase 4 target - needs breakdown
│   └── ...              # 14 other components at root level
│
├── /docs                # ✅ Project documentation
└── /memory-bank         # ✅ AI context
```

**Completed Achievements**:

- ✅ Phase 0a: ESLint, Prettier, Vitest configured
- ✅ Phase 1: Professional `/src` directory structure
- ✅ Phase 1: Organized type system (3 modules)
- ✅ Phase 1: Centralized constants
- ✅ Phase 1: Path aliases configured and working
- ✅ Phase 2: 5 custom hooks extracted (useToast, useModal, useTheme, useKeyboard, useLocalStorage)
- ✅ Phase 2: 3 utility modules (dates, formatting, validation)
- ✅ Phase 3: Dashboard refactored (550 → 100 lines, 10 widgets created)
- ✅ Phase 4: Composer refactored (1,850 → 217 lines, 14 sub-components + 1 hook)
- ✅ Phase 5: UI library created (4 components: Button, Input, Modal, Card)
- ✅ Phase 5: Shared components organized (11 total in `/src/components/`)
- ✅ Phase 5: App.tsx simplified (280 → 235 lines, ShortcutsModal extracted)
- ✅ Phase 6a: Analytics refactored (677 → 60 lines, 15 components created)
- ✅ Phase 6b: Settings refactored (813 → 150 lines, 19 components created)
- ✅ Phase 6c: Calendar refactored (697 → 130 lines, 16 components created)
- ✅ Phase 6d: Inbox refactored (475 → 80 lines, 12 components created)
- ✅ Phase 6e: Library refactored (713 → 165 lines, 18 components created)
- ✅ Phase 6f: LinkManager refactored (454 → 80 lines, 14 components created)
- ✅ Phase 6g: Automations refactored (381 → 70 lines, 10 components created)
- ✅ FeatureGateOverlay moved to `/src/components/ui/` for app-wide reuse (successfully reused in Settings!)
- ✅ PostCard component created as reusable across all calendar views
- ✅ Platform icons utility shared between Calendar and Inbox features

**Remaining Work**:

- Phase 7: Add basic tests

**Current Status**: **Phase 6h complete. ENTIRE FRONTEND REFACTORING PROJECT COMPLETE!** 🎉🎉🎉

- ✅ Phase 6h: App.tsx simplified (287 → 228 lines, -21%)
- ✅ MobileHeader component created (40 lines)
- ✅ MobileNav component created (70 lines)
- ✅ All 10 files refactored (9 features + App.tsx)
- ✅ 135+ focused components created
- ✅ Professional architecture established
- ✅ Ready for Phase 7 (Testing)

### Target Structure (Phase 5+)

```
/socialflow
├── App.tsx              # ✅ Minimal, delegates to features
├── index.tsx
│
├── /src                 # ✅ ALL source code organized here
│   ├── /features        # ✅ Feature-based organization
│   │   ├── /dashboard
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── TrendingWidget.tsx
│   │   │   ├── QuickDraft.tsx
│   │   │   ├── useDashboard.ts      # Custom hook
│   │   │   └── types.ts              # Feature-specific types
│   │   │
│   │   ├── /composer
│   │   │   ├── Composer.tsx
│   │   │   ├── PlatformSelector.tsx
│   │   │   ├── MediaUpload.tsx
│   │   │   ├── AIAssist.tsx
│   │   │   ├── useComposer.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── /calendar
│   │   │   ├── Calendar.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── useCalendar.ts
│   │   │   └── types.ts
│   │   │
│   │   └── /settings
│   │       ├── Settings.tsx
│   │       ├── AccountSettings.tsx
│   │       ├── ThemeSettings.tsx
│   │       └── types.ts
│   │
│   ├── /components      # ✅ Shared/reusable only
│   │   ├── /ui          # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── /layout
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   └── /feedback
│   │       ├── Toast.tsx
│   │       ├── Notifications.tsx
│   │       └── HelpModal.tsx
│   │
│   ├── /hooks           # ✅ Custom hooks
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useTheme.ts
│   │   ├── useKeyboard.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── /lib             # ✅ Third-party wrappers
│   │   ├── gemini.ts    # Wrapper around @google/genai
│   │   └── analytics.ts # Analytics wrapper
│   │
│   ├── /utils           # ✅ Pure utility functions
│   │   ├── dates.ts
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   │
│   ├── /types           # ✅ Shared types only
│   │   ├── index.ts     # Re-exports
│   │   ├── domain.ts    # Post, Draft, Account
│   │   ├── ui.ts        # ViewState, ToastType
│   │   └── api.ts       # Future API types
│   │
│   └── /services        # ✅ API & backend communication
│       ├── geminiService.ts  # AI service (current)
│       └── api.ts       # Future API client
│
├── /components          # Legacy at root (to be migrated)
├── /docs                # Project documentation
└── /memory-bank         # AI context and status
```

**Path Aliases Configuration** (tsconfig.json & vite.config.ts):

```typescript
// All aliases point to /src subdirectories
"@/features/*": ["./src/features/*"]
"@/components/*": ["./src/components/*"]
"@/hooks/*": ["./src/hooks/*"]
"@/utils/*": ["./src/utils/*"]
"@/types": ["./src/types"]
"@/lib/*": ["./src/lib/*"]
"@/services/*": ["./src/services/*"]
```

**Benefits**:

- ✅ Professional industry-standard structure
- ✅ Clear separation: `/src` = code, `/docs` = documentation
- ✅ Clear feature boundaries within `/src`
- ✅ Co-located related code
- ✅ Easy to find files
- ✅ Scalable as features grow
- ✅ Easier testing (feature isolation)
- ✅ Prepared for backend integration
- ✅ Better IDE navigation and tooling support
- ✅ Ready for monorepo structure if needed

### Migration Strategy

**Phase 1**: Foundation Setup (using `/src` as base)

1. Create `/src/types` directory with 3 modules (domain, ui, features)
2. Create `/src/utils/constants.ts` with extracted constants
3. Move `/services` to `/src/services`
4. Configure TypeScript and Vite path aliases to point to `/src`
5. Update all imports to use new path aliases (`@/types`, etc.)

**Phase 2**: Extract hooks and utilities

1. Create `/src/hooks` directory
2. Extract `useToast`, `useModal`, `useTheme` from App.tsx
3. Create `/src/utils` with utility functions
4. Move shared logic to custom hooks

**Phase 3**: Reorganize components into features

1. Create `/src/features` directory
2. Move Dashboard → `/src/features/dashboard`
3. Move Composer → `/src/features/composer`
4. Continue for other features (calendar, settings, etc.)

**Phase 4**: Separate shared components

1. Identify truly reusable components
2. Move to `/src/components/ui` or `/src/components/layout`
3. Keep feature-specific components in their feature folders
4. Organize feedback components in `/src/components/feedback`

**Current Status**: Phase 5 complete. UI library established, shared components organized into proper structure.
