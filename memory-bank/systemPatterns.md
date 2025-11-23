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

### 4. Modal Management Pattern

**Controlled at Root Level**:

```typescript
// App.tsx manages all modal visibility
const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
const [isHelpOpen, setIsHelpOpen] = useState(false);
const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
```

**Benefits**:

- Prevents multiple modals overlapping
- Centralized z-index management
- Easy keyboard shortcuts (ESC to close)
- Consistent backdrop behavior

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

### 3. Theme Switching

**Flow**: User Toggle → State Update → DOM Class → CSS Variables

**Implementation**:

```typescript
// App.tsx useEffect
useEffect(() => {
  const root = window.document.documentElement;
  const applyTheme = () => {
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };
  applyTheme();
  localStorage.setItem("theme", theme);
}, [theme]);
```

**CSS Pattern**:

```css
/* Tailwind classes respond to .dark on <html> */
.bg-white dark:bg-slate-900
.text-slate-900 dark:text-white
```

### 4. Keyboard Shortcuts

**Pattern**: Global event listener in App.tsx

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Skip if typing in input
    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(
        (e.target as HTMLElement).tagName
      )
    ) {
      return;
    }

    // Cmd/Ctrl + K → Command Palette
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsCmdPaletteOpen(true);
    }

    // ? → Help Modal
    if (e.key === "?") {
      e.preventDefault();
      setIsShortcutsOpen((prev) => !prev);
    }

    // c → Composer
    if (e.key === "c") {
      e.preventDefault();
      setCurrentView(ViewState.COMPOSER);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

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

### 4. Custom Hooks (Future Pattern)

**Not yet implemented, but planned**:

```typescript
// Future refactor
const { posts, addPost, updatePost, deletePost } = usePosts();
const { theme, setTheme } = useTheme();
const { showToast } = useToast();
```

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

### Current Structure (Needs Refactoring)

```
/socialflow
├── App.tsx              # ❌ Too much logic, state management
├── index.tsx
├── types.ts             # ❌ All types in one file
├── /components          # ❌ Flat, no organization
│   ├── Dashboard.tsx    # ❌ Large, multiple responsibilities
│   ├── Composer.tsx     # ❌ Large, multiple responsibilities
│   ├── Calendar.tsx
│   ├── Analytics.tsx
│   ├── Settings.tsx
│   ├── Sidebar.tsx
│   ├── Toast.tsx
│   └── ...
├── /services
│   └── geminiService.ts
└── /memory-bank
```

**Problems**:

- All components in flat `/components` folder
- No clear feature boundaries
- No hooks extracted (logic mixed with UI)
- No utility functions separated
- Types scattered across files
- Hard to navigate as project grows

### Target Structure (Refactoring Goal)

```
/socialflow
├── App.tsx              # ✅ Minimal, delegates to features
├── index.tsx
│
├── /features            # ✅ Feature-based organization
│   ├── /dashboard
│   │   ├── Dashboard.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── TrendingWidget.tsx
│   │   ├── QuickDraft.tsx
│   │   ├── useDashboard.ts      # Custom hook
│   │   └── types.ts              # Feature-specific types
│   │
│   ├── /composer
│   │   ├── Composer.tsx
│   │   ├── PlatformSelector.tsx
│   │   ├── MediaUpload.tsx
│   │   ├── AIAssist.tsx
│   │   ├── useComposer.ts
│   │   └── types.ts
│   │
│   ├── /calendar
│   │   ├── Calendar.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── PostCard.tsx
│   │   ├── useCalendar.ts
│   │   └── types.ts
│   │
│   └── /settings
│       ├── Settings.tsx
│       ├── AccountSettings.tsx
│       ├── ThemeSettings.tsx
│       └── types.ts
│
├── /components          # ✅ Shared/reusable only
│   ├── /ui              # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── /layout
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileNav.tsx
│   └── /feedback
│       ├── Toast.tsx
│       ├── Notifications.tsx
│       └── HelpModal.tsx
│
├── /hooks               # ✅ Custom hooks
│   ├── useToast.ts
│   ├── useModal.ts
│   ├── useTheme.ts
│   ├── useKeyboard.ts
│   └── useLocalStorage.ts
│
├── /lib                 # ✅ Third-party wrappers
│   ├── gemini.ts        # Wrapper around @google/genai
│   └── analytics.ts     # Analytics wrapper
│
├── /utils               # ✅ Pure utility functions
│   ├── dates.ts
│   ├── formatting.ts
│   ├── validation.ts
│   └── constants.ts
│
├── /types               # ✅ Shared types only
│   ├── index.ts         # Re-exports
│   ├── domain.ts        # Post, Draft, Account
│   ├── ui.ts            # ViewState, ToastType
│   └── api.ts           # Future API types
│
├── /services            # ✅ Backend communication (future)
│   └── api.ts           # Future API client
│
└── /memory-bank         # Project documentation
```

**Benefits**:

- ✅ Clear feature boundaries
- ✅ Co-located related code
- ✅ Easy to find files
- ✅ Scalable as features grow
- ✅ Easier testing (feature isolation)
- ✅ Prepared for backend integration

### Migration Strategy

**Phase 1**: Extract hooks and utilities

1. Create `/hooks` directory
2. Extract `useToast`, `useModal`, `useTheme` from App.tsx
3. Move to shared hooks

**Phase 2**: Reorganize components

1. Create `/features` directory
2. Move Dashboard → `/features/dashboard`
3. Move Composer → `/features/composer`
4. Continue for other features

**Phase 3**: Separate shared components

1. Identify truly reusable components
2. Move to `/components/ui` or `/components/layout`
3. Keep feature-specific components in features

**Phase 4**: Organize types

1. Create `/types` directory
2. Separate domain, UI, and API types
3. Keep feature-specific types in feature folders
