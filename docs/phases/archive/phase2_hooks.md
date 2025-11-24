# Phase 2: Custom Hooks Extraction

**Estimated Time:** 3-4 hours

## Overview

Extract reusable logic from App.tsx into custom hooks and utility functions. This phase removes inline logic and establishes patterns for state management, theme handling, toast notifications, modal control, and keyboard shortcuts.

## Prerequisites

✅ Phase 1 must be complete:

- Directory structure created
- TypeScript path aliases configured
- Types organized in `/types` folder
- Constants extracted to `/utils/constants.ts`

## Goals

1. Extract toast notification logic into `useToast` hook
2. Extract modal management into `useModal` hook
3. Extract theme logic into `useTheme` hook
4. Extract keyboard shortcuts into `useKeyboard` hook
5. Create utility functions for dates, formatting, and validation
6. Update App.tsx to use new hooks (simplified state management)

## Custom Hooks to Create

### 1. Create `/hooks/useToast.ts`

Toast notification management hook:

```typescript
import { useState } from "react";
import { ToastType } from "@/types";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return { toast, showToast, hideToast };
}
```

**Extracted from:** App.tsx lines 86-92

### 2. Create `/hooks/useModal.ts`

Modal state management hook:

```typescript
import { useState } from "react";

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return { isOpen, openModal, closeModal, toggleModal };
}
```

**Extracted from:** App.tsx manages 6 modal states (lines 66-71)

### 3. Create `/hooks/useTheme.ts`

Theme management with localStorage persistence:

```typescript
import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document and handle system preference
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

    // Listen for system theme changes if theme is 'system'
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
      // Legacy browsers
      else {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  return { theme, setTheme };
}
```

**Extracted from:** App.tsx lines 94-127

### 4. Create `/hooks/useKeyboard.ts`

Global keyboard shortcuts handler:

```typescript
import { useEffect } from "react";

type KeyboardHandlers = Record<string, () => void>;

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      // Build key string (e.g., "cmd+k" or "?")
      const key =
        e.metaKey || e.ctrlKey
          ? `${e.metaKey ? "cmd" : "ctrl"}+${e.key}`
          : e.key;

      const handler = handlers[key];

      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
```

**Extracted from:** App.tsx lines 129-154

**Usage Example:**

```typescript
useKeyboard({
  "cmd+k": () => setIsCmdPaletteOpen(true),
  "ctrl+k": () => setIsCmdPaletteOpen(true),
  "?": () => setIsShortcutsOpen(true),
  c: () => setCurrentView(ViewState.COMPOSER),
});
```

### 5. Create `/hooks/useLocalStorage.ts`

LocalStorage persistence with debounce:

```typescript
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs = 1000
) {
  // Initialize from localStorage
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Debounced save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [key, value, debounceMs]);

  return [value, setValue] as const;
}
```

**Usage:** For auto-saving drafts in Composer (Phase 4)

## Utility Functions to Create

### 1. Create `/utils/dates.ts`

Date formatting utilities:

```typescript
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(date: string, time?: string): string {
  const dateStr = formatDate(date);
  return time ? `${dateStr} at ${formatTime(time)}` : dateStr;
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
}

export function isFuture(date: string, time?: string): boolean {
  const checkDate = new Date(`${date}T${time || "00:00"}`);
  return checkDate > new Date();
}
```

### 2. Create `/utils/formatting.ts`

Text formatting utilities:

```typescript
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function splitTweetThread(text: string, maxLength = 280): string[] {
  if (text.length <= maxLength) return [text];

  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      parts.push(remaining);
      break;
    }

    // Try to split at a word boundary
    let splitIndex = remaining.lastIndexOf(" ", maxLength);
    if (splitIndex === -1) {
      // No space found, force split
      splitIndex = maxLength;
    }

    parts.push(remaining.substring(0, splitIndex));
    remaining = remaining.substring(splitIndex).trim();
  }

  return parts;
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPlatformName(platform: string): string {
  const names: Record<string, string> = {
    twitter: "Twitter",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    pinterest: "Pinterest",
  };
  return names[platform] || capitalizeFirst(platform);
}
```

**Extracted from:** Composer.tsx tweet splitting logic (lines 500-520)

### 3. Create `/utils/validation.ts`

Validation helper functions:

```typescript
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateHashtag(tag: string): boolean {
  // Hashtag should start with # and contain only alphanumeric and underscore
  return /^#[a-zA-Z0-9_]+$/.test(tag);
}

export function validateContentLength(
  content: string,
  platform: string
): { valid: boolean; message?: string } {
  const limits: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
  };

  const limit = limits[platform];
  if (!limit) return { valid: true };

  if (content.length > limit) {
    return {
      valid: false,
      message: `Content exceeds ${platform} limit of ${limit} characters`,
    };
  }

  return { valid: true };
}
```

## Implementation Steps

### Step 1: Create All Hook Files

```bash
# Hooks
touch hooks/useToast.ts
touch hooks/useModal.ts
touch hooks/useTheme.ts
touch hooks/useKeyboard.ts
touch hooks/useLocalStorage.ts

# Utilities
touch utils/dates.ts
touch utils/formatting.ts
touch utils/validation.ts
```

### Step 2: Implement Hooks

1. Copy `useToast` implementation into `/hooks/useToast.ts`
2. Copy `useModal` implementation into `/hooks/useModal.ts`
3. Copy `useTheme` implementation into `/hooks/useTheme.ts`
4. Copy `useKeyboard` implementation into `/hooks/useKeyboard.ts`
5. Copy `useLocalStorage` implementation into `/hooks/useLocalStorage.ts`

### Step 3: Implement Utilities

1. Copy date functions into `/utils/dates.ts`
2. Copy formatting functions into `/utils/formatting.ts`
3. Copy validation functions into `/utils/validation.ts`

### Step 4: Update App.tsx to Use Hooks

Replace inline state and logic with hook calls:

```typescript
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboard } from "@/hooks/useKeyboard";

function App() {
  // Replace inline toast state
  const { toast, showToast, hideToast } = useToast();

  // Replace inline modal states
  const cmdPalette = useModal();
  const notifications = useModal();
  const help = useModal();
  const shortcuts = useModal();
  const upgradeModal = useModal();

  // Replace inline theme logic
  const { theme, setTheme } = useTheme();

  // Replace inline keyboard handling
  useKeyboard({
    "cmd+k": cmdPalette.openModal,
    "ctrl+k": cmdPalette.openModal,
    "?": shortcuts.toggleModal,
    c: () => setCurrentView(ViewState.COMPOSER),
  });

  // ... rest of App component
}
```

### Step 5: Update Modal Components

Change modal props from individual state to hook object:

**Before:**

```typescript
<CommandPalette
  isOpen={isCmdPaletteOpen}
  onClose={() => setIsCmdPaletteOpen(false)}
/>
```

**After:**

```typescript
<CommandPalette isOpen={cmdPalette.isOpen} onClose={cmdPalette.closeModal} />
```

### Step 6: Remove Old Code from App.tsx

Delete these lines:

- Inline toast state (lines 86-92)
- Inline modal states (lines 66-71)
- Inline theme logic (lines 94-127)
- Inline keyboard handler (lines 129-154)

### Step 7: Test Each Hook

Test hooks individually before moving on:

1. Test `useToast`: Trigger toast from different actions
2. Test `useModal`: Open/close each modal
3. Test `useTheme`: Switch between light/dark/system
4. Test `useKeyboard`: Try all shortcuts (Cmd+K, ?, c, etc.)

## Testing

### Verification Checklist

- [ ] `/hooks/useToast.ts` created and exports `useToast`
- [ ] `/hooks/useModal.ts` created and exports `useModal`
- [ ] `/hooks/useTheme.ts` created and exports `useTheme`
- [ ] `/hooks/useKeyboard.ts` created and exports `useKeyboard`
- [ ] `/hooks/useLocalStorage.ts` created and exports `useLocalStorage`
- [ ] `/utils/dates.ts` created with formatting functions
- [ ] `/utils/formatting.ts` created with text utilities
- [ ] `/utils/validation.ts` created with validation functions
- [ ] App.tsx imports all new hooks
- [ ] App.tsx uses `useToast()` instead of inline state
- [ ] App.tsx uses `useModal()` for all 5+ modals
- [ ] App.tsx uses `useTheme()` instead of inline logic
- [ ] App.tsx uses `useKeyboard()` with handlers object
- [ ] Old inline code removed from App.tsx
- [ ] No TypeScript errors
- [ ] Dev server runs successfully
- [ ] All functionality works as before

### Manual Testing

1. **Toast Notifications:**

   - Trigger success toast (schedule a post)
   - Trigger error toast (try invalid action)
   - Verify toast auto-dismisses after 3 seconds

2. **Modal Management:**

   - Open Command Palette (Cmd+K)
   - Open Notifications panel
   - Open Help modal
   - Open Shortcuts modal (?)
   - Verify all modals open/close correctly
   - Verify ESC key closes modals

3. **Theme Switching:**

   - Switch to Light mode
   - Switch to Dark mode
   - Switch to System mode
   - Refresh page, verify theme persists
   - Change system preference, verify System mode updates

4. **Keyboard Shortcuts:**

   - Press Cmd+K (Command Palette should open)
   - Press ? (Shortcuts modal should open)
   - Press c (Should navigate to Composer)
   - Verify shortcuts don't trigger in input fields

5. **Utilities:**
   - Check formatted dates in Dashboard
   - Verify time formatting
   - Test validation functions (if UI uses them)

## Completion Criteria

✅ **Phase 2 is complete when:**

1. All 5 custom hooks created and tested
2. All 3 utility files created
3. App.tsx successfully uses all new hooks
4. App.tsx code reduced by ~100 lines
5. No inline state management remaining in App.tsx
6. All modals work correctly with `useModal`
7. Theme switching works with `useTheme`
8. Keyboard shortcuts work with `useKeyboard`
9. Toast notifications work with `useToast`
10. No TypeScript errors
11. No functionality regressions
12. Git commit created: `git commit -m "Phase 2: Extract custom hooks and utilities"`

## Code Reduction

**Before Phase 2:**

- App.tsx: ~430 lines

**After Phase 2:**

- App.tsx: ~320 lines (110 lines removed)
- Hooks: ~250 lines (new, reusable)
- Utils: ~120 lines (new, reusable)
- **Net:** More total lines, but better organization and reusability

## Benefits Achieved

1. ✅ **Reusability** - Hooks can be used in any component
2. ✅ **Testability** - Hooks can be tested in isolation
3. ✅ **Maintainability** - Logic is centralized and organized
4. ✅ **Readability** - App.tsx is cleaner and easier to understand
5. ✅ **DRY Principle** - No repeated logic for modals, toasts, etc.

## Common Issues & Solutions

**Issue:** TypeScript errors with hook imports

- **Solution:** Verify path aliases in tsconfig.json, restart TypeScript server

**Issue:** Theme doesn't persist after refresh

- **Solution:** Check localStorage is working, verify useEffect dependencies

**Issue:** Keyboard shortcuts trigger in input fields

- **Solution:** Verify tagName check in useKeyboard

**Issue:** Modals don't close with ESC

- **Solution:** Add ESC handler to useKeyboard handlers

## Next Phase

After Phase 2 is complete and committed, proceed to **Phase 3: Dashboard Refactoring**.
