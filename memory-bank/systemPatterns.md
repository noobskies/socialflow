# System Patterns: SocialFlow AI

## Architecture Overview

This document describes the established patterns and architectural decisions in SocialFlow AI's frontend codebase. All patterns described here are implemented and battle-tested across 9 major features.

**Next.js Migration Complete** (November 24, 2025): Successfully migrated from Vite 6.2 to Next.js 16.0.3 with proper App Router implementation. All architectural patterns described in this document have been preserved with zero breaking changes to the 135+ components. The application now runs on Next.js with Turbopack, providing improved performance and developer experience. Phase 8h implemented proper Next.js App Router with route groups, Server/Client Component pattern, and React Context for state management.

## Guiding Principles

### SOLID Principles in Practice

Every architectural decision follows SOLID principles:

1. **Single Responsibility Principle (SRP)**
   - Each component has ONE clear job
   - Orchestrator components coordinate, sub-components handle specifics
   - Example: `Composer.tsx` coordinates layout, `ContentEditor.tsx` handles editing logic

2. **Open/Closed Principle (OCP)**
   - Components are open for extension (composition), closed for modification
   - Add features through new components, not by editing existing ones
   - Example: Added `FeatureGateOverlay` component, reused across multiple features

3. **Dependency Inversion Principle (DIP)**
   - Components depend on props (interfaces), not concrete implementations
   - Makes testing trivial and enables component reuse
   - Example: `PostCard` accepts any post object, works in Calendar/Kanban/Grid views

### DRY (Don't Repeat Yourself)

**Zero tolerance for duplication:**
- See duplicate code? Extract to hook, utility, or shared component
- Proven wins: FeatureGateOverlay (3 reuses), PostCard (3 views), platform icons (2 features)
- Custom hooks extracted: useToast, useModal, useTheme, useKeyboard, useLocalStorage

### No Backwards Compatibility

**Critical architectural freedom:**
- NO legacy API contracts
- NO deprecated features to maintain
- NO migration paths to support

**This enables:**
- Aggressive refactoring (6,897 → 1,300 lines achieved)
- Component API changes for clarity
- File/function renames without hesitation
- Immediate deletion of bad patterns

**Philosophy**: When better patterns emerge, implement them immediately. Don't accumulate technical debt.

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

## Established Patterns

### 1. Next.js App Router Pattern (Phase 8h) ✅

**Design Decision**: Proper Next.js 16 App Router with route groups and Server/Client Components
**Why**: Industry standard, URL routing, automatic code splitting, follows Next.js conventions

**Architecture**:

```typescript
// src/app/AppShell.tsx - Client Component
"use client";

export default function AppShell({ children }: { children: ReactNode }) {
  // All global state: theme, modals, toasts, keyboard shortcuts
  // Wraps children with AppContextProvider
  return (
    <div>
      <Sidebar />
      <MobileHeader />
      <main>
        <AppContextProvider>{children}</AppContextProvider>
      </main>
      <MobileNav />
    </div>
  );
}
```

**Route Structure** (Updated Phase 9B - Authentication):

```
src/app/
├── layout.tsx                    # Minimal root layout (html/body only)
├── (auth)/                       # Public route group
│   ├── layout.tsx               # Clean layout (no sidebar)
│   ├── page.tsx                 # Landing page at /
│   ├── login/page.tsx           # /login
│   └── register/page.tsx        # /register
└── (app)/                        # Protected route group
    ├── layout.tsx               # Auth check + AppShell
    ├── dashboard/page.tsx       # /dashboard
    ├── composer/page.tsx        # /composer
    ├── calendar/page.tsx        # /calendar
    ├── library/page.tsx         # /library
    ├── analytics/page.tsx       # /analytics
    ├── inbox/page.tsx           # /inbox
    ├── links/page.tsx           # /links
    ├── automations/page.tsx     # /automations
    └── settings/page.tsx        # /settings
```

**Navigation Flow**:

- Each page.tsx is a Client Component (`"use client"`)
- Uses `useAppContext()` hook to access global state
- Sidebar/MobileNav use Next.js `<Link>` components ✅
- URLs work properly: /, /login, /dashboard, /composer, etc.
- Browser navigation (back/forward) works correctly
- Route groups organize features without affecting URLs
- Authentication checked at layout level for entire route group

### 1a. Authentication Route Group Pattern (Phase 9B) ✅

**Design Decision**: Two-layout system with route groups for public/protected pages
**Why**: Clean separation of concerns, follows Next.js 16.0.4 best practices, authentication enforced at layout level
**Status**: Complete and production-ready

**Architecture Overview**:

This pattern implements a professional authentication system using Next.js route groups to separate public and protected areas of the application.

**Root Layout (Minimal)**:
```typescript
// src/app/layout.tsx - Minimal wrapper
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Public Routes** - (auth) Group:
```typescript
// src/app/(auth)/layout.tsx - Clean public layout
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {children}
    </div>
  );
}

// src/app/(auth)/page.tsx - Landing page
export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    redirect('/dashboard'); // Authenticated users go to dashboard
  }
  
  return <div>{/* Welcome content with login/register links */}</div>;
}

// src/app/(auth)/login/page.tsx - Login page
export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  
  // After successful login:
  router.push(redirectUrl); // Returns user to intended page
}
```

**Protected Routes** - (app) Group:
```typescript
// src/app/(app)/layout.tsx - Protected layout with auth check
"use client";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);
  
  if (isLoading) {
    return <LoadingSpinner />; // Show loading during auth check
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect
  }
  
  return <AppShell>{children}</AppShell>; // Render with sidebar
}
```

**URL Structure**:
- Public: `/`, `/login`, `/register`
- Protected: `/dashboard`, `/composer`, `/calendar`, etc.
- All URLs clean, no prefixes (route groups omitted from URL)

**Authentication Flow**:
1. User visits `/composer` without auth
2. `(app)/layout.tsx` detects no authentication
3. Redirects to `/login?redirect=%2Fcomposer`
4. User logs in
5. Redirected back to `/composer`
6. Success! User sees composer with sidebar

**Key Benefits**:
- ✅ Authentication enforced at layout level (can't bypass)
- ✅ Clean URLs without `/app` or `/auth` prefixes
- ✅ Redirect parameters preserve intended destination
- ✅ Loading states for smooth UX
- ✅ Sidebar only shown on protected routes
- ✅ Follows Next.js 16.0.4 documented best practices
- ✅ Single root layout (correct for shared html/body)
- ✅ Zero code duplication

**Testing Verified**:
- ✅ Landing page redirects authenticated users to /dashboard
- ✅ Login/register pages have clean design (no sidebar)
- ✅ Protected routes redirect unauthenticated users to /login
- ✅ Redirect parameter works correctly
- ✅ All navigation flows function properly

### 2. State Management Pattern

**Current Approach**: React Context API via AppContext.tsx
**No global state library** (Redux, Zustand, etc.) - keeping it simple for MVP

**State Location Strategy**:

```typescript
// GLOBAL STATE (AppContext.tsx) - Shared across views via React Context
- posts: Post[]                    // All scheduled/published posts
- accounts: SocialAccount[]        // Connected social accounts
- userPlan: PlanTier              // User's subscription level
- branding: BrandingConfig        // Agency white-label settings

// CONTEXT HANDLERS (AppContext.tsx) - Actions available to all components
- showToast: (message, type) => void
- onPostCreated: (post) => void
- onUpdatePost: (post) => void
- onDeletePost: (postId) => void
- onCompose: (draft?) => void
- onToggleAccount: (id) => void
- onOpenUpgrade: () => void
- refetchPosts: () => Promise<void>
- refetchAccounts: () => Promise<void>

// LOCAL STATE (Individual Components) - Scoped to component
- form inputs, UI toggles, temporary data
```

**Context Pattern** (Established):

```typescript
// AppContext.tsx - Provider wraps page content
export function AppContextProvider({ children, showToast, onOpenUpgrade }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  
  // Fetch from API on mount
  useEffect(() => {
    api.get('/api/posts').then(data => setPosts(data.posts));
  }, []);
  
  const value = { posts, postsLoading, setPosts, showToast, onPostCreated, ... };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Page components consume context
export default function DashboardPage() {
  const { posts, postsLoading, showToast, onPostCreated } = useAppContext();
  
  if (postsLoading) return <LoadingSpinner />;
  return <Dashboard posts={posts} ... />;
}
```

**Benefits**:
- Clean separation: AppShell (layout) vs AppContext (state)
- Simple and performant for MVP size
- Easy to debug with explicit context values
- Prepared for API integration (loading states built-in)

### 3. Data Flow Patterns

#### Creating a Post (Composer → Backend → Calendar)

```
User Action → Composer Component
    ↓
Form State (local)
    ↓
onPostCreated(newPost) callback → API call
    ↓
POST /api/posts → Database
    ↓
AppContext.setPosts([...posts, newPost])
    ↓
Calendar Component (receives updated posts prop)
    ↓
Re-renders with new post
    ↓
Real-time notification via WebSocket (Phase 9G)
```

#### Backend API Pattern

```
Client Request → API Route
    ↓
requireAuth() middleware → Verify JWT
    ↓
Validate input with Zod
    ↓
Prisma database query
    ↓
Return JSON response
    ↓
Client updates local state
    ↓
Optional: Emit WebSocket event
```

## Key Technical Decisions

### 1. API Integration Pattern

**Current Status**: Ready for backend integration (Phase 9F)

**API Client Pattern** (`src/lib/api-client.ts`):

```typescript
// Unified API client with error handling
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) => apiRequest<T>(endpoint, { method: 'POST', body }),
  patch: <T>(endpoint: string, body?: any) => apiRequest<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
```

**Usage Pattern**:

```typescript
// In AppContext or hooks
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get<{ posts: Post[] }>('/api/posts')
    .then(data => setPosts(data.posts))
    .finally(() => setLoading(false));
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

## Deployment Architecture

```
Next.js Application (Frontend + Backend)
    ↓
Vercel (Serverless Functions)
    ↓
    ├─→ Next.js API Routes (/api/*)
    │   ├─→ Authentication (NextAuth.js)
    │   ├─→ CRUD Operations (Prisma)
    │   └─→ OAuth Callbacks
    │
    ├─→ PostgreSQL Database
    │   └─→ Vercel Postgres (managed)
    │
    ├─→ Vercel Blob Storage
    │   └─→ Media files (images/videos)
    │
    └─→ WebSocket Server
        └─→ Socket.io or Pusher (real-time)

CDN (Static Assets)
    └─→ Next.js built assets
```

**Benefits**:
- Single deployment (frontend + backend)
- Zero-config serverless functions
- Automatic HTTPS and CDN
- Built-in environment variables
- Preview deployments for PRs

## Backend API Patterns (Phase 9)

### Backend API Route Pattern (Established in Phase 9C)

**Standard CRUD API Structure**:

```typescript
// src/app/api/[resource]/route.ts - List & Create
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET - List resources
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');

  const items = await prisma.resource.findMany({
    where: { userId: user!.id }, // Always filter by userId
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ items, count: items.length });
}

// POST - Create resource
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  
  // Validate with Zod
  const schema = z.object({
    name: z.string().min(1),
    // ... other fields
  });
  
  const validated = schema.parse(body);

  const item = await prisma.resource.create({
    data: {
      ...validated,
      userId: user!.id,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
```

**Key Principles**:
1. **Authentication First**: Always call `requireAuth()` before any logic
2. **User Isolation**: Always filter by `userId` in WHERE clauses
3. **Validation**: Use Zod schemas for input validation
4. **Error Handling**: Try/catch with user-friendly messages
5. **Consistent Responses**: Return `{ data, message }` format

### OAuth Service Pattern (Established in Phase 9D)

**BaseOAuthService Abstract Class**:

```typescript
// All 7 platforms extend this base class
abstract class BaseOAuthService {
  protected abstract platform: Platform;
  protected abstract authUrl: string;
  protected abstract tokenUrl: string;
  protected abstract scopes: string[];

  // Common methods all platforms inherit
  async generateAuthUrl(userId: string): Promise<string>
  async handleCallback(code: string, state: string): Promise<SocialAccount>
  async refreshToken(accountId: string): Promise<void>
  async disconnect(accountId: string): Promise<void>
}

// Platform implementation
class TwitterOAuthService extends BaseOAuthService {
  protected platform = Platform.TWITTER;
  protected authUrl = 'https://twitter.com/i/oauth2/authorize';
  protected tokenUrl = 'https://api.twitter.com/2/oauth2/token';
  protected scopes = ['tweet.read', 'tweet.write', 'users.read'];

  // Can override base methods or add platform-specific ones
}
```

**OAuth API Routes Pattern**:

```typescript
// Four consistent routes for each platform:
// 1. /api/oauth/[platform]/authorize - Start OAuth flow
// 2. /api/oauth/[platform]/callback - Handle OAuth callback
// 3. /api/oauth/[platform]/refresh - Refresh access token
// 4. /api/oauth/[platform]/disconnect - Disconnect account

// Security patterns:
// - PKCE for platforms that support it
// - State parameter with 10-minute expiration
// - Token encryption (AES-256-GCM) before database storage
```

### File Upload Pattern (Documented in Phase 9E)

**Server-Side Processing with Sharp**:

```typescript
// 1. Receive file
const file = formData.get('file') as File;

// 2. Validate
if (file.size > MAX_SIZE) return error;
if (!ALLOWED_TYPES.includes(file.type)) return error;

// 3. Process images (videos pass through)
if (isImage) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const { optimized, thumbnail } = await processImage(buffer);
  
  // 4. Upload both to Vercel Blob
  const mainBlob = await put('optimized.jpg', optimized);
  const thumbBlob = await put('thumb.jpg', thumbnail);
  
  // 5. Store both URLs
  await prisma.mediaAsset.create({
    data: {
      url: mainBlob.url,
      thumbnailUrl: thumbBlob.url,
      userId: user!.id,
    },
  });
}
```

**Key Features**:
- Server-side processing (not client-side)
- Parallel image optimization + thumbnail generation
- Dual file storage for images
- Progress tracking via XMLHttpRequest

---

## File Organization

### Current File Structure

```
/socialflow
├── App.tsx              # 228-line root orchestrator
├── index.tsx
│
├── /src                 # All source code organized here
│   ├── /features        # Feature-based organization (9 features complete)
│   │   ├── /dashboard (12 files)
│   │   │   ├── Dashboard.tsx (100-line orchestrator)
│   │   │   ├── useDashboard.ts
│   │   │   └── /widgets (10 widget components)
│   │   │       ├── AccountHealth.tsx
│   │   │       ├── CrisisAlert.tsx
│   │   │       ├── DashboardStats.tsx
│   │   │       ├── EngagementChart.tsx
│   │   │       ├── OnboardingProgress.tsx
│   │   │       ├── QuickDraft.tsx
│   │   │       ├── RecentGenerations.tsx
│   │   │       ├── TopLinks.tsx
│   │   │       ├── TrendingWidget.tsx
│   │   │       └── UpcomingPosts.tsx
│   │   ├── /composer (15 files)
│   │   │   ├── Composer.tsx (217-line orchestrator)
│   │   │   ├── useComposer.ts
│   │   │   ├── /components (6 core UI components)
│   │   │   │   ├── ContentEditor.tsx
│   │   │   │   ├── MediaPreview.tsx
│   │   │   │   ├── PlatformOptions.tsx
│   │   │   │   ├── PlatformSelector.tsx
│   │   │   │   ├── PollCreator.tsx
│   │   │   │   └── PreviewPanel.tsx
│   │   │   ├── /ai (3 AI components)
│   │   │   │   ├── AIDesigner.tsx
│   │   │   │   ├── AIPanel.tsx
│   │   │   │   └── AIWriter.tsx
│   │   │   ├── /modals (3 modal components)
│   │   │   │   ├── AnalysisModal.tsx
│   │   │   │   ├── ProductPickerModal.tsx
│   │   │   │   └── SchedulingModal.tsx
│   │   │   └── /collaboration (1 team component)
│   │   │       └── TeamCollaboration.tsx
│   │   ├── /analytics (15 files)
│   │   │   ├── Analytics.tsx (60-line orchestrator)
│   │   │   ├── useAnalytics.ts
│   │   │   ├── /tabs (3 tab components)
│   │   │   ├── /charts (4 chart components)
│   │   │   └── /widgets (6 widgets)
│   │   ├── /settings (19 files)
│   │   │   ├── Settings.tsx (150-line orchestrator)
│   │   │   ├── useSettings.ts, SettingsSidebar.tsx
│   │   │   ├── /tabs (8 tab components)
│   │   │   └── /widgets (8 widgets)
│   │   ├── /calendar (16 files)
│   │   │   ├── Calendar.tsx (130-line orchestrator)
│   │   │   ├── useCalendar.ts, ViewModeToggle.tsx
│   │   │   ├── /views (3 view components)
│   │   │   ├── /components (6 components)
│   │   │   └── /utils (5 utility modules)
│   │   ├── /inbox (12 files)
│   │   │   ├── Inbox.tsx (80-line orchestrator)
│   │   │   ├── useInbox.ts
│   │   │   ├── /tabs (2 tab components)
│   │   │   ├── /components (7 components)
│   │   │   └── /utils (sentimentUtils.tsx)
│   │   ├── /library (18 files)
│   │   │   ├── Library.tsx (165-line orchestrator)
│   │   │   ├── useLibrary.ts
│   │   │   ├── /tabs (5 tab components)
│   │   │   └── /components (10 components)
│   │   ├── /linkmanager (14 files)
│   │   │   ├── LinkManager.tsx (80-line orchestrator)
│   │   │   ├── useLinkManager.ts
│   │   │   ├── /tabs (3 tab components)
│   │   │   └── /components (9 components)
│   │   └── /automations (10 files)
│   │       ├── Automations.tsx (70-line orchestrator)
│   │       ├── useAutomations.ts
│   │       ├── /tabs (2 tab components)
│   │       └── /components (6 components)
│   │
│   ├── /components      # Shared/reusable components only
│   │   ├── /ui          # Base UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── FeatureGateOverlay.tsx
│   │   ├── /layout      # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileHeader.tsx
│   │   │   └── MobileNav.tsx
│   │   └── /feedback    # User feedback components
│   │       ├── Toast.tsx
│   │       ├── Notifications.tsx
│   │       ├── HelpModal.tsx
│   │       ├── UpgradeModal.tsx
│   │       ├── ShortcutsModal.tsx
│   │       └── CommandPalette.tsx
│   │
│   ├── /hooks           # Custom hooks (14 total)
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   ├── useTheme.ts
│   │   ├── useKeyboard.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── /lib             # Third-party wrappers (future)
│   │
│   ├── /utils           # Pure utility functions
│   │   ├── constants.ts # All mock data
│   │   ├── dates.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   │
│   ├── /types           # Shared TypeScript types
│   │   ├── index.ts     # Re-exports
│   │   ├── domain.ts    # Post, Draft, Account, User
│   │   ├── ui.ts        # ViewState, ToastType
│   │   └── features.ts  # Feature-specific types
│   │
│   ├── /services        # API & external services
│   │   └── geminiService.ts
│   │
│   └── /test            # Test configuration
│       └── setup.ts
│
├── /docs                # Project documentation
│   ├── /phases          # Phase documentation
│   │   ├── /archive     # Completed phase docs
│   │   └── phase7_testing.md
│   └── README.md
│
└── /memory-bank         # AI context files

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

**Architecture Benefits**:
- Professional industry-standard structure
- Clear separation: `/src` = code, `/docs` = documentation
- Feature-based organization for scalability
- Co-located related code
- Easy file discovery
- Isolated features for testing
- Prepared for backend integration
- Excellent IDE navigation support
