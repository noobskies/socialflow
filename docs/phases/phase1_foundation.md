# Phase 1: Foundation Setup

**Estimated Time:** 2-3 hours

## Overview

Establish the foundation for the refactoring by creating the directory structure, setting up TypeScript path aliases, organizing types into modules, and extracting constants. This phase prepares the codebase architecture without breaking existing functionality.

## Prerequisites

- Clean git working directory (commit any pending changes)
- Dev server not running (we'll restart after configuration changes)
- Backup of current code (git commit or branch)

## Goals

1. Create feature-based folder structure
2. Configure TypeScript path aliases for clean imports
3. Split monolithic types.ts into organized modules
4. Extract constants and mock data into utilities

## Directory Structure to Create

```bash
mkdir -p src/features/dashboard src/features/composer src/features/calendar src/features/settings
mkdir -p src/components/ui src/components/layout src/components/feedback
mkdir -p src/hooks src/utils src/lib src/types
```

**Note:** The `/services` directory will also be moved to `/src/services` to consolidate all source code under `/src`.

## Types Organization

### Create `/src/types/index.ts`

```typescript
export * from "./domain";
export * from "./ui";
export * from "./features";
```

### Create `/src/types/domain.ts`

Core business entities:

```typescript
export type Platform =
  | "twitter"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "pinterest";

export type PlanTier = "free" | "pro" | "agency";

export interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  avatar: string;
  connected: boolean;
}

export interface Post {
  id: string;
  content: string;
  platforms: Platform[];
  scheduledDate: string;
  status:
    | "scheduled"
    | "published"
    | "draft"
    | "pending_review"
    | "approved"
    | "rejected";
  mediaUrl?: string;
  mediaType?: "image" | "video";
  time?: string;
  timezone?: string;
  comments?: PostComment[];
  platformOptions?: PlatformOptions;
  poll?: PollConfig;
}

export interface Draft {
  content?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  scheduledDate?: string;
  platforms?: Platform[];
  status?: "draft" | "pending_review" | "approved" | "rejected";
  comments?: PostComment[];
  platformOptions?: PlatformOptions;
  poll?: PollConfig;
}

export interface User {
  name: string;
  email: string;
  plan: PlanTier;
}

export interface MediaAsset {
  id: string;
  type: "image" | "video" | "template";
  url?: string;
  content?: string;
  name: string;
  createdAt: string;
  tags: string[];
  folderId?: string;
}

export interface Trend {
  id: string;
  topic: string;
  volume: string;
  difficulty: "Easy" | "Medium" | "Hard";
  context: string;
}
```

### Create `/src/types/ui.ts`

UI-specific types:

```typescript
export enum ViewState {
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

export type ToastType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "mention";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
```

### Create `/src/types/features.ts`

Feature-specific complex types:

```typescript
export interface PlatformOptions {
  instagram?: {
    firstComment?: string;
    location?: string;
    collabUser?: string;
  };
  twitter?: {
    isThread?: boolean;
    replySettings?: "everyone" | "mentioned" | "followers";
  };
  pinterest?: {
    destinationLink?: string;
    boardId?: string;
  };
  youtube?: {
    visibility?: "public" | "private" | "unlisted";
    tags?: string[];
  };
}

export interface PollConfig {
  question?: string;
  options: string[];
  duration: number;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface VideoEditorConfig {
  duration: number;
  trimStart: number;
  trimEnd: number;
  thumbnailTime: number;
  captions: boolean;
  captionsText?: string;
}

export interface BrandingConfig {
  companyName: string;
  primaryColor: string;
  logoUrl: string;
  removeWatermark: boolean;
  customDomain: string;
}

export interface AnalyticsData {
  date: string;
  impressions: number;
  engagement: number;
  clicks: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  active: boolean;
  stats: {
    runs: number;
    lastRun: string;
  };
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  inventory: number;
}

export interface HashtagGroup {
  id: string;
  name: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatar: string;
  status: "active" | "invited";
}

export interface ShortLink {
  id: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  tags: string[];
}

export interface BioPageConfig {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: "light" | "dark" | "colorful";
  links: { id: string; title: string; url: string; active: boolean }[];
  enableLeadCapture?: boolean;
  leadCaptureText?: string;
}

export interface SocialMessage {
  id: string;
  platform: Platform;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  type: "comment" | "dm" | "mention";
  unread: boolean;
  replied?: boolean;
}
```

## Configuration Updates

### Update `tsconfig.json`

Add path aliases to compilerOptions (all paths point to `/src` subdirectories):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types": ["./src/types"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/services/*": ["./src/services/*"]
    }
  }
}
```

### Update `vite.config.ts`

Add path resolution (all aliases point to `/src` subdirectories):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/services": path.resolve(__dirname, "./src/services"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

## Constants Extraction

### Create `/src/utils/constants.ts`

Extract from App.tsx and Composer.tsx:

```typescript
import { Post, SocialAccount, Product, HashtagGroup } from "@/types";

export const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    scheduledDate: "2023-10-03",
    platforms: ["twitter"],
    content: "Launching our new feature... 🚀",
    status: "published",
    time: "09:00",
  },
  {
    id: "2",
    scheduledDate: "2023-10-03",
    platforms: ["linkedin"],
    content: "Company growth update: We reached 10k users!",
    status: "published",
    time: "11:30",
  },
  // ... rest of posts from App.tsx lines 45-65
];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: "1",
    platform: "twitter",
    username: "@socialflow",
    avatar: "",
    connected: true,
  },
  {
    id: "2",
    platform: "linkedin",
    username: "SocialFlow Inc.",
    avatar: "",
    connected: true,
  },
  // ... rest of accounts from App.tsx
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Leather Bag",
    price: "$129.00",
    description:
      "Handcrafted Italian leather messenger bag. Perfect for the modern professional.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    inventory: 12,
  },
  // ... rest from Composer.tsx lines 30-50
];

export const AI_TEMPLATES = [
  { id: "pas", name: "Problem-Agitate-Solve", label: "PAS Framework" },
  {
    id: "aida",
    name: "Attention-Interest-Desire-Action",
    label: "AIDA Framework",
  },
  { id: "story", name: "Storytelling", label: "Hero's Journey" },
  { id: "viral", name: "Viral Hook", label: "Controversial/Viral" },
];

export const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
];

export const MOCK_HASHTAG_GROUPS: HashtagGroup[] = [
  {
    id: "1",
    name: "Tech Startups",
    tags: ["#startup", "#tech", "#innovation", "#saas", "#growth"],
  },
  {
    id: "2",
    name: "Summer Vibes",
    tags: ["#summer", "#summervibes", "#sunshine", "#fun"],
  },
  {
    id: "3",
    name: "Monday Motivation",
    tags: ["#mondaymotivation", "#grind", "#success", "#goals"],
  },
];
```

## Implementation Steps

1. **Create directory structure**

   ```bash
   mkdir -p src/features/dashboard src/features/composer src/features/calendar src/features/settings
   mkdir -p src/components/ui src/components/layout src/components/feedback
   mkdir -p src/hooks src/utils src/lib src/types
   ```

2. **Move services directory**

   ```bash
   mv services src/services
   ```

3. **Create type files**
   - Create `/src/types/domain.ts` with business types
   - Create `/src/types/ui.ts` with UI types
   - Create `/src/types/features.ts` with feature types
   - Create `/src/types/index.ts` as re-export hub

4. **Update TypeScript configuration**
   - Update `tsconfig.json` with baseUrl and paths
   - Save and verify no errors

5. **Update Vite configuration**
   - Update `vite.config.ts` with path aliases
   - Add path import at top
   - Save configuration

6. **Create constants file**
   - Create `/src/utils/constants.ts`
   - Copy `INITIAL_POSTS` from App.tsx (lines 45-65)
   - Copy `INITIAL_ACCOUNTS` from App.tsx
   - Copy `MOCK_PRODUCTS` from Composer.tsx (lines 30-50)
   - Copy `AI_TEMPLATES`, `TIMEZONES`, `MOCK_HASHTAG_GROUPS` from Composer.tsx

7. **Update imports in existing files**
   - In `App.tsx`: Replace `import { ... } from './types'` with `import { ... } from '@/types'`
   - In `App.tsx`: Add `import { INITIAL_POSTS, INITIAL_ACCOUNTS } from '@/utils/constants'`
   - In `App.tsx`: Remove inline `INITIAL_POSTS` and `INITIAL_ACCOUNTS` constants
   - In `Composer.tsx`: Replace `import { ... } from '../types'` with `import { ... } from '@/types'`
   - In `Composer.tsx`: Add `import { MOCK_PRODUCTS, AI_TEMPLATES, TIMEZONES, MOCK_HASHTAG_GROUPS } from '@/utils/constants'`
   - In `Composer.tsx`: Remove inline constants
   - In `Dashboard.tsx`: Replace `import { ... } from '../types'` with `import { ... } from '@/types'`
   - Update all other component imports to use `@/types`

8. **Test the changes**
   - Run `npm run dev`
   - Verify no TypeScript errors
   - Verify app loads correctly
   - Verify all imports resolve

## Testing

### Verification Checklist

- [ ] All directories created successfully
- [ ] `tsconfig.json` has path aliases configured
- [ ] `vite.config.ts` has path resolution configured
- [ ] All 3 type files created in `/src/types`
- [ ] `/src/types/index.ts` re-exports all types
- [ ] `/src/utils/constants.ts` contains all extracted constants
- [ ] `/services` moved to `/src/services`
- [ ] App.tsx imports from `@/types` and `@/utils/constants`
- [ ] Composer.tsx imports from `@/types` and `@/utils/constants`
- [ ] Dashboard.tsx imports from `@/types`
- [ ] No TypeScript errors in terminal
- [ ] Dev server starts successfully
- [ ] App renders correctly in browser
- [ ] No console errors in browser

### Manual Test

1. Start dev server: `npm run dev`
2. Open browser to http://localhost:5173
3. Verify Dashboard loads
4. Check browser console for errors
5. Navigate to Composer view
6. Verify Composer loads with no errors
7. Check that theme switching still works

## Completion Criteria

✅ **Phase 1 is complete when:**

1. All directories exist
2. TypeScript path aliases configured and working
3. Types split into 3 organized files
4. Constants extracted to utils
5. All imports updated to use new paths
6. No TypeScript compilation errors
7. Dev server runs without errors
8. App functions exactly as before (no regressions)
9. Git commit created: `git commit -m "Phase 1: Foundation setup - /src organization, types, constants"`

## Rollback Plan

If something breaks:

1. Check terminal for TypeScript errors
2. Verify tsconfig.json and vite.config.ts syntax
3. Check import paths are correct
4. Restart dev server (Vite may need restart after config changes)
5. If all else fails: `git reset --hard HEAD` to revert

## Next Phase

After Phase 1 is complete and committed, proceed to **Phase 2: Custom Hooks Extraction**.
