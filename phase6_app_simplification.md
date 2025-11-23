# Phase 6: App.tsx Simplification

**Estimated Time:** 2-3 hours

## Overview

Simplify App.tsx to its final clean state using all the hooks and components created in previous phases. This transforms the 430-line god object into a lean ~150-line orchestrator.

## Prerequisites

✅ Phase 1: Foundation setup complete
✅ Phase 2: All custom hooks created
✅ Phase 3: Dashboard refactored
✅ Phase 4: Composer refactored
✅ Phase 5: UI library created

## Goals

1. Remove all inline logic from App.tsx
2. Use custom hooks exclusively (useToast, useModal, useTheme, useKeyboard)
3. Remove inline ShortcutsModal component
4. Simplify renderView to just return feature components
5. Reduce App.tsx from 430 to ~150 lines
6. Update all imports to use path aliases

## Current App.tsx Issues

**Problems:**

- 430+ lines with mixed concerns
- Inline ShortcutsModal component definition
- Inline toast state management
- Inline modal state (6 modals)
- Inline theme logic (40+ lines)
- Inline keyboard handling (25+ lines)
- Direct imports from ./components

## Target App.tsx Structure

```typescript
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/features/dashboard/Dashboard";
import Composer from "@/features/composer/Composer";
import Calendar from "@/components/Calendar";
import Analytics from "@/components/Analytics";
import Settings from "@/components/Settings";
import Inbox from "@/components/Inbox";
import Library from "@/components/Library";
import LinkManager from "@/components/LinkManager";
import Automations from "@/components/Automations";
import CommandPalette from "@/components/CommandPalette";
import Toast from "@/components/feedback/Toast";
import Notifications from "@/components/feedback/Notifications";
import HelpModal from "@/components/feedback/HelpModal";
import ShortcutsModal from "@/components/feedback/ShortcutsModal";
import UpgradeModal from "@/components/UpgradeModal";
import {
  ViewState,
  Draft,
  PlanTier,
  Post,
  SocialAccount,
  BrandingConfig,
} from "@/types";
import { INITIAL_POSTS, INITIAL_ACCOUNTS } from "@/utils/constants";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboard } from "@/hooks/useKeyboard";
import {
  Menu,
  LayoutDashboard,
  PenSquare,
  MessageSquare,
  Calendar as CalendarIcon,
  MoreHorizontal,
} from "lucide-react";

const App: React.FC = () => {
  // View State
  const [currentView, setCurrentView] = useState<ViewState>(
    ViewState.DASHBOARD
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialDraft, setInitialDraft] = useState<Draft | undefined>(
    undefined
  );

  // Global State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [userPlan, setUserPlan] = useState<PlanTier>("free");
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "SocialFlow Agency",
    primaryColor: "#4f46e5",
    logoUrl: "",
    removeWatermark: false,
    customDomain: "social.myagency.com",
  });

  // Custom Hooks
  const { toast, showToast, hideToast } = useToast();
  const { theme, setTheme } = useTheme();
  const cmdPalette = useModal();
  const notifications = useModal();
  const help = useModal();
  const shortcuts = useModal();
  const upgradeModal = useModal();

  // Keyboard Shortcuts
  useKeyboard({
    "cmd+k": cmdPalette.openModal,
    "ctrl+k": cmdPalette.openModal,
    "?": shortcuts.toggleModal,
    c: () => setCurrentView(ViewState.COMPOSER),
  });

  // Handlers
  const handleCompose = (draft?: Draft) => {
    setInitialDraft(draft);
    setCurrentView(ViewState.COMPOSER);
    setMobileMenuOpen(false);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [...prev, newPost]);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleToggleAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      )
    );
  };

  const handleUpgrade = (plan: PlanTier) => {
    setUserPlan(plan);
    upgradeModal.closeModal();
    showToast(
      `Successfully upgraded to ${
        plan.charAt(0).toUpperCase() + plan.slice(1)
      } Plan!`,
      "success"
    );
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard
            posts={posts}
            accounts={accounts}
            onPostCreated={handlePostCreated}
            showToast={showToast}
            onCompose={handleCompose}
          />
        );
      case ViewState.COMPOSER:
        return (
          <Composer
            initialDraft={initialDraft}
            showToast={showToast}
            onPostCreated={handlePostCreated}
            userPlan={userPlan}
          />
        );
      case ViewState.CALENDAR:
        return (
          <Calendar
            onCompose={handleCompose}
            posts={posts}
            onUpdatePost={handleUpdatePost}
            onPostCreated={handlePostCreated}
            userPlan={userPlan}
          />
        );
      case ViewState.SETTINGS:
        return (
          <Settings
            showToast={showToast}
            branding={branding}
            setBranding={setBranding}
            userPlan={userPlan}
            onOpenUpgrade={upgradeModal.openModal}
            accounts={accounts}
            onToggleConnection={handleToggleAccount}
          />
        );
      // ... other cases
      default:
        return (
          <Dashboard
            posts={posts}
            accounts={accounts}
            onPostCreated={handlePostCreated}
            showToast={showToast}
            onCompose={handleCompose}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
      {/* Modals & Overlays */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={hideToast}
      />
      <Notifications
        isOpen={notifications.isOpen}
        onClose={notifications.closeModal}
      />
      <HelpModal isOpen={help.isOpen} onClose={help.closeModal} />
      <ShortcutsModal
        isOpen={shortcuts.isOpen}
        onClose={shortcuts.closeModal}
      />
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={upgradeModal.closeModal}
        currentPlan={userPlan}
        onUpgrade={handleUpgrade}
      />
      <CommandPalette
        isOpen={cmdPalette.isOpen}
        onClose={cmdPalette.closeModal}
        setView={(view) => {
          setCurrentView(view);
          cmdPalette.closeModal();
        }}
      />

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          currentView={currentView}
          setView={(view) => {
            setCurrentView(view);
            setMobileMenuOpen(false);
          }}
          currentTheme={theme}
          setTheme={setTheme}
          branding={branding}
          userPlan={userPlan}
          onOpenNotifications={notifications.openModal}
          onOpenHelp={help.openModal}
          onOpenUpgrade={upgradeModal.openModal}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between shrink-0 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-slate-800 dark:text-white truncate max-w-[200px]">
              {branding.logoUrl ? branding.companyName : "SocialFlow AI"}
            </span>
          </div>
          <button onClick={notifications.openModal} className="relative p-1">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border border-white dark:border-slate-900" />
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop"
              alt="User"
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
            />
          </button>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-0">
          {renderView()}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-40 safe-area-pb transition-colors duration-200">
          <button
            onClick={() => setCurrentView(ViewState.DASHBOARD)}
            className={`flex flex-col items-center gap-1 ${
              currentView === ViewState.DASHBOARD
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView(ViewState.CALENDAR)}
            className={`flex flex-col items-center gap-1 ${
              currentView === ViewState.CALENDAR
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <CalendarIcon className="w-6 h-6" />
          </button>
          <div className="relative -top-6">
            <button
              onClick={() => handleCompose()}
              className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/40 hover:bg-indigo-700 transition-transform active:scale-95 dark:shadow-indigo-900/40"
            >
              <PenSquare className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setCurrentView(ViewState.INBOX)}
            className={`flex flex-col items-center gap-1 ${
              currentView === ViewState.INBOX
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
          >
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
```

**Final Line Count:** ~150 lines (down from 430)

## Implementation Steps

1. **Extract ShortcutsModal component**
   - Create `/components/feedback/ShortcutsModal.tsx`
   - Copy inline ShortcutsModal from App.tsx (lines 18-43)
   - Export as default component

2. **Update all imports**
   - Replace `./components/` with `@/components/`
   - Replace `./types` with `@/types`
   - Add hook imports from `@/hooks`
   - Add constants import from `@/utils/constants`
   - Add Dashboard import from `@/features/dashboard`
   - Add Composer import from `@/features/composer`

3. **Replace inline state with hooks**
   - Remove toast state, use `useToast()`
   - Remove modal states, use `useModal()` x5
   - Remove theme logic, use `useTheme()`
   - Remove keyboard handler, use `useKeyboard()`

4. **Update modal prop syntax**
   - Change `isOpen={isCmdPaletteOpen}` to `isOpen={cmdPalette.isOpen}`
   - Change `onClose={() => setIsCmdPaletteOpen(false)}` to `onClose={cmdPalette.closeModal}`
   - Repeat for all modals

5. **Clean up deleted code**
   - Remove inline ShortcutsModal component
   - Remove INITIAL_POSTS constant
   - Remove INITIAL_ACCOUNTS constant
   - Remove all inline useEffect hooks
   - Remove showToast function definition

6. **Verify imports throughout app**
   - Search for any remaining `../` imports
   - Replace with `@/` path aliases
   - Update all components to use new import paths

7. **Final testing**
   - Start dev server
   - Test all views
   - Test all modals
   - Test keyboard shortcuts
   - Test theme switching
   - Test toast notifications

## Code Comparison

### Before (Inline Logic)

```typescript
// ~40 lines of theme logic
const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

useEffect(() => {
  const savedTheme = localStorage.getItem('theme')...
  // ... 40+ lines
}, [theme]);

// ~6 lines of modal state
const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
// ... 4 more modals

// ~25 lines of keyboard handling
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // ... 25 lines
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### After (Using Hooks)

```typescript
// Theme - 1 line
const { theme, setTheme } = useTheme();

// Modals - 5 lines
const cmdPalette = useModal();
const notifications = useModal();
const help = useModal();
const shortcuts = useModal();
const upgradeModal = useModal();

// Keyboard - 5 lines
useKeyboard({
  'cmd+k': cmdPalette.openModal,
  'ctrl+k': cmdPalette.openModal,
  '?': shortcuts.toggleModal,
  c: () => setCurrentView(ViewState.COMPOSER),
});

// Toast - 1 line
const { toast, showToast, hideToast } = useToast();
```

**Reduction:** 70+ lines → 12 lines

## Testing

### Verification Checklist

- [ ] ShortcutsModal extracted to separate file
- [ ] All imports use path aliases (@/)
- [ ] App.tsx uses useToast hook
- [ ] App.tsx uses useModal for all modals
- [ ] App.tsx uses useTheme hook
- [ ] App.tsx uses useKeyboard hook
- [ ] No inline logic remaining
- [ ] App.tsx is ~150 lines
- [ ] No TypeScript errors
- [ ] All functionality preserved

### Manual Testing

1. **Application Loads:**
   - Start dev server
   - Dashboard renders
   - No console errors

2. **Navigation:**
   - Click all sidebar links
   - All views load correctly
   - Mobile menu works
   - Bottom nav works

3. **Modals:**
   - Cmd+K opens command palette
   - ? opens shortcuts modal
   - Notifications panel opens
   - Help modal opens
   - Upgrade modal opens
   - All modals close correctly

4. **Theme:**
   - Switch to light mode
   - Switch to dark mode
   - Switch to system mode
   - Verify persistence after refresh

5. **Toast:**
   - Schedule post → success toast
   - Test error toast
   - Toast auto-dismisses

6. **Keyboard Shortcuts:**
   - Cmd+K works
   - ? works
   - c navigates to composer
   - Shortcuts don't fire in inputs

## Completion Criteria

✅ **Phase 6 is complete when:**

1. App.tsx reduced to ~150 lines
2. All inline logic removed
3. All custom hooks integrated
4. ShortcutsModal extracted
5. All imports use path aliases
6. No TypeScript errors
7. Zero functionality regressions
8. Clean, readable code
9. Git commit: `git commit -m "Phase 6: Simplify App.tsx using hooks"`

## Code Metrics

**Before Phase 6:**

- App.tsx: 430 lines
- Inline components: ShortcutsModal (25 lines)
- Inline logic: ~120 lines

**After Phase 6:**

- App.tsx: ~150 lines
- Extracted: ShortcutsModal to feedback/
- Hooks used: 5 custom hooks

**Total Reduction:** 280 lines removed from App.tsx

## Benefits Achieved

1. ✅ **Maintainability** - App.tsx is now easy to read and modify
2. ✅ **Testability** - Logic is in tested hooks, not inline
3. ✅ **Reusability** - Hooks can be used anywhere
4. ✅ **Single Responsibility** - App.tsx only orchestrates, doesn't implement
5. ✅ **Clean Imports** - Path aliases make imports readable

## Next Phase

After Phase 6 is complete and committed, proceed to **Phase 7: Final Testing & Documentation** (final verification and cleanup).
