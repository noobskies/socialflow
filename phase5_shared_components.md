# Phase 5: Shared Components & UI Library

**Estimated Time:** 2-3 hours

## Overview

Create a reusable UI component library and organize shared/feedback components. This phase establishes consistent UI patterns across the application.

## Prerequisites

✅ Phases 1-4 complete: Foundation, hooks, Dashboard, and Composer refactored

## Goals

1. Create reusable UI component library (Button, Input, Modal, Card)
2. Move feedback components to proper location
3. Standardize component usage across app
4. Reduce code duplication in UI elements

## Current State

**Issues:**

- Buttons, inputs, modals defined inline throughout components
- Inconsistent styling and behavior
- Toast, Notifications, HelpModal in wrong locations
- No reusable UI primitives

## UI Components to Create

### 1. `/components/ui/Button.tsx`

Reusable button component with variants:

```typescript
import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-slate-600 text-white hover:bg-slate-700 shadow-sm",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
    ghost:
      "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
```

### 2. `/components/ui/Input.tsx`

Reusable input component:

```typescript
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
          error
            ? "border-rose-500 focus:ring-2 focus:ring-rose-500"
            : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};
```

### 3. `/components/ui/Modal.tsx`

Reusable modal container:

```typescript
import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full ${sizes[size]} overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 4. `/components/ui/Card.tsx`

Reusable card container:

```typescript
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  hover = false,
}) => {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ${
        hover ? "hover:shadow-md transition-shadow" : ""
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
```

## Feedback Components to Organize

### Move Toast to `/components/feedback/Toast.tsx`

Keep existing implementation, just move file and update imports.

### Move Notifications to `/components/feedback/Notifications.tsx`

Keep existing implementation, update imports to use `@/types`.

### Move HelpModal to `/components/feedback/HelpModal.tsx`

Keep existing implementation, update imports.

### Extract ShortcutsModal from App.tsx to `/components/feedback/ShortcutsModal.tsx`

Currently defined inline in App.tsx - extract to separate file.

## Implementation Steps

1. **Create UI component library**

   ```bash
   mkdir -p components/ui
   touch components/ui/Button.tsx
   touch components/ui/Input.tsx
   touch components/ui/Modal.tsx
   touch components/ui/Card.tsx
   ```

2. **Implement UI components**

   - Copy Button implementation
   - Copy Input implementation
   - Copy Modal implementation
   - Copy Card implementation

3. **Create feedback directory**

   ```bash
   mkdir -p components/feedback
   ```

4. **Move and update feedback components**

   - Move `components/Toast.tsx` to `components/feedback/Toast.tsx`
   - Move `components/Notifications.tsx` to `components/feedback/`
   - Move `components/HelpModal.tsx` to `components/feedback/`
   - Extract ShortcutsModal from App.tsx to `components/feedback/ShortcutsModal.tsx`
   - Update all imports in moved files to use path aliases

5. **Update component imports**

   - In App.tsx: Update Toast, Notifications, HelpModal imports
   - In App.tsx: Import ShortcutsModal instead of defining inline

6. **Start using UI library** (gradual adoption)
   - Identify inline buttons in Dashboard widgets
   - Replace with `<Button>` component
   - Identify inline inputs in Settings/Composer
   - Replace with `<Input>` component
   - Test each replacement

## Testing

### Verification Checklist

- [ ] All 4 UI components created (`/components/ui/`)
- [ ] Button component works with all variants
- [ ] Input component shows errors and helper text
- [ ] Modal component renders correctly
- [ ] Card component with different padding options
- [ ] Toast moved to `/components/feedback/`
- [ ] Notifications moved to `/components/feedback/`
- [ ] HelpModal moved to `/components/feedback/`
- [ ] ShortcutsModal extracted from App.tsx
- [ ] All imports updated
- [ ] No TypeScript errors
- [ ] UI components render correctly

### Manual Testing

1. **Button Component:**

   - Test primary variant
   - Test outline variant
   - Test loading state
   - Test disabled state
   - Test with icons

2. **Input Component:**

   - Test with label
   - Test with error message
   - Test with helper text
   - Test dark mode styling

3. **Modal Component:**

   - Test different sizes
   - Test close button
   - Test backdrop click
   - Test with footer

4. **Feedback Components:**
   - Toast notifications work
   - Notifications panel opens
   - Help modal opens
   - Shortcuts modal opens (?)

## Completion Criteria

✅ **Phase 5 is complete when:**

1. All 4 UI components created and working
2. Feedback components organized in proper folder
3. ShortcutsModal extracted from App.tsx
4. Imports updated throughout application
5. UI library being used in at least 3 places
6. Consistent styling across components
7. No TypeScript errors
8. Git commit: `git commit -m "Phase 5: Create shared UI library and organize feedback components"`

## Code Reduction

**Before:** UI elements defined inline in components
**After:** Reusable UI library + organized feedback components

**Benefits:**

- Consistent UI across application
- Easy to update styling globally
- Reduced code duplication
- Better maintainability

## Next Phase

After Phase 5 is complete and committed, proceed to **Phase 6: App.tsx Simplification**.
