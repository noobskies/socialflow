# Phase 4: Composer Refactoring

**Estimated Time:** 8-10 hours (most complex phase)

## Overview

Break down the massive 1000+ line Composer component into 15+ smaller, focused sub-components. This is the largest refactoring phase and should be done methodically.

## Prerequisites

✅ Phase 1-3 complete: Foundation, hooks, and Dashboard refactored

## Goals

1. Extract 14 Composer sub-components
2. Create `useComposer` hook for state orchestration
3. Reduce Composer.tsx from 1000+ to ~200 lines
4. Maintain all functionality while improving organization

## Current State

**Composer.tsx**: 1000+ lines handling:

- Platform selection
- Content editing with toolbar
- AI panel (write, design, repurpose, team tabs)
- Media upload/edit (images and videos)
- Poll creation
- Scheduling modal
- Product picker
- Platform-specific options
- Preview panel

## Components to Extract

### Priority 1: Core UI Components

1. **`PlatformSelector.tsx`** - Platform selection buttons
2. **`PlatformOptions.tsx`** - Instagram/Pinterest specific options
3. **`ContentEditor.tsx`** - Main textarea with toolbar
4. **`PreviewPanel.tsx`** - Platform previews

### Priority 2: Media & Polls

5. **`MediaUploader.tsx`** - Drag & drop file handling
6. **`MediaPreview.tsx`** - Image/video preview with edit controls
7. **`PollCreator.tsx`** - Poll creation UI

### Priority 3: AI Panel

8. **`AIPanel.tsx`** - AI panel container with tabs
9. **`AIWriter.tsx`** - AI write tab
10. **`AIDesigner.tsx`** - AI design tab
11. **`AIRepurpose.tsx`** - AI repurpose tab
12. **`TeamCollaboration.tsx`** - Team tab (agency feature)

### Priority 4: Modals

13. **`SchedulingModal.tsx`** - Scheduling interface
14. **`ProductPickerModal.tsx`** - Product selection

### Hook

15. **`useComposer.ts`** - State management hook

## Implementation Strategy

Due to the size, implement in 4 sub-phases:

**Sub-Phase 4A:** Core UI (Steps 1-4)
**Sub-Phase 4B:** Media & Polls (Steps 5-7)
**Sub-Phase 4C:** AI Panel (Steps 8-12)
**Sub-Phase 4D:** Final Assembly (Steps 13-15)

## Key Component: useComposer Hook

```typescript
// /features/composer/useComposer.ts
import { useState, useEffect } from 'react';
import { Platform, Draft, Post, PlatformOptions } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useComposer(initialDraft?: Draft) {
  const [content, setContent] = useLocalStorage('draft_content', initialDraft?.content || '', 1000);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(
    initialDraft?.platforms || ['twitter']
  );
  const [mediaUrl, setMediaUrl] = useState<string | null>(initialDraft?.mediaUrl || null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(
    initialDraft?.mediaType || null
  );
  const [platformOptions, setPlatformOptions] = useState<PlatformOptions>(
    initialDraft?.platformOptions || {}
  );

  const [isPollActive, setIsPollActive] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(1);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleMediaUpload = (url: string, type: 'image' | 'video') => {
    setMediaUrl(url);
    setMediaType(type);
    setIsPollActive(false); // Disable poll if media attached
  };

  const togglePoll = () => {
    if (isPollActive) {
      setIsPollActive(false);
    } else {
      setIsPollActive(true);
      setMediaUrl(null); // Remove media if poll active
      setMediaType(null);
    }
  };

  const clearDraft = () => {
    setContent('');
    setMediaUrl(null);
    setMediaType(null);
    setIsPollActive(false);
    setPollOptions(['', '']);
    localStorage.removeItem('draft_content');
  };

  return {
    // Content
    content,
    setContent,

    // Platforms
    selectedPlatforms,
    togglePlatform,

    // Media
    mediaUrl,
    mediaType,
    handleMediaUpload,
    removeMedia: () => {
      setMediaUrl(null);
      setMediaType(null);
    },

    // Poll
    isPollActive,
    pollOptions,
    setPollOptions,
    pollDuration,
    setPollDuration,
    togglePoll,

    // Platform Options
    platformOptions,
    setPlatformOptions,

    // Actions
    clearDraft,
  };
}
```

## Refactored Composer.tsx (Orchestrator Pattern)

```typescript
// /features/composer/Composer.tsx
import React, { useState } from "react";
import { PlatformSelector } from "./PlatformSelector";
import { PlatformOptions } from "./PlatformOptions";
import { ContentEditor } from "./ContentEditor";
import { MediaUploader } from "./MediaUploader";
import { MediaPreview } from "./MediaPreview";
import { PollCreator } from "./PollCreator";
import { AIPanel } from "./AIPanel";
import { SchedulingModal } from "./SchedulingModal";
import { ProductPickerModal } from "./ProductPickerModal";
import { PreviewPanel } from "./PreviewPanel";
import { useComposer } from "./useComposer";
import { useModal } from "@/hooks/useModal";
import { Draft, Post, ToastType, PlanTier } from "@/types";

interface ComposerProps {
  initialDraft?: Draft;
  showToast: (message: string, type: ToastType) => void;
  onPostCreated?: (post: Post) => void;
  userPlan?: PlanTier;
}

export const Composer: React.FC<ComposerProps> = ({
  initialDraft,
  showToast,
  onPostCreated,
  userPlan = "free",
}) => {
  const composer = useComposer(initialDraft);
  const schedulingModal = useModal();
  const productModal = useModal();

  const handleSchedule = (date: string, time: string, timezone: string) => {
    if (!composer.content.trim()) {
      showToast("Please add content before scheduling", "error");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      content: composer.content,
      platforms: composer.selectedPlatforms,
      scheduledDate: date,
      status: "scheduled",
      time,
      timezone,
      mediaUrl: composer.mediaUrl || undefined,
      mediaType: composer.mediaType || undefined,
      platformOptions: composer.platformOptions,
      poll: composer.isPollActive
        ? {
            options: composer.pollOptions.filter((o) => o.trim() !== ""),
            duration: composer.pollDuration,
          }
        : undefined,
    };

    onPostCreated?.(newPost);
    composer.clearDraft();
    schedulingModal.closeModal();
    showToast("Post scheduled successfully", "success");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-full flex flex-col overflow-hidden relative pb-24 md:pb-6 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            New Post
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Craft perfect content for all your channels
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={productModal.openModal}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Promote Product
          </button>
          <button
            onClick={schedulingModal.openModal}
            disabled={!composer.content.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-lg disabled:opacity-50"
          >
            Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto">
          <PlatformSelector
            selectedPlatforms={composer.selectedPlatforms}
            onToggle={composer.togglePlatform}
          />

          {(composer.selectedPlatforms.includes("instagram") ||
            composer.selectedPlatforms.includes("pinterest")) && (
            <PlatformOptions
              selectedPlatforms={composer.selectedPlatforms}
              options={composer.platformOptions}
              onChange={composer.setPlatformOptions}
            />
          )}

          <AIPanel
            content={composer.content}
            onContentChange={composer.setContent}
            selectedPlatforms={composer.selectedPlatforms}
            showToast={showToast}
            userPlan={userPlan}
          />

          <ContentEditor
            content={composer.content}
            onChange={composer.setContent}
            onMediaUpload={composer.handleMediaUpload}
            isPollActive={composer.isPollActive}
            onTogglePoll={composer.togglePoll}
            showToast={showToast}
          />

          {composer.mediaUrl && (
            <MediaPreview
              url={composer.mediaUrl}
              type={composer.mediaType!}
              onRemove={composer.removeMedia}
            />
          )}

          {composer.isPollActive && (
            <PollCreator
              options={composer.pollOptions}
              setOptions={composer.setPollOptions}
              duration={composer.pollDuration}
              setDuration={composer.setPollDuration}
              onClose={() => composer.togglePoll()}
            />
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-5 hidden lg:block">
          <PreviewPanel
            content={composer.content}
            platforms={composer.selectedPlatforms}
            mediaUrl={composer.mediaUrl}
            mediaType={composer.mediaType}
            poll={
              composer.isPollActive
                ? {
                    options: composer.pollOptions,
                    duration: composer.pollDuration,
                  }
                : undefined
            }
            platformOptions={composer.platformOptions}
          />
        </div>
      </div>

      {/* Modals */}
      <SchedulingModal
        isOpen={schedulingModal.isOpen}
        onClose={schedulingModal.closeModal}
        onSchedule={handleSchedule}
      />

      <ProductPickerModal
        isOpen={productModal.isOpen}
        onClose={productModal.closeModal}
        onSelect={(product) => {
          // Handle product selection
          composer.setContent(`Check out our ${product.name}!`);
          composer.handleMediaUpload(product.image, "image");
          productModal.closeModal();
        }}
      />
    </div>
  );
};

export default Composer;
```

## Implementation Steps

### Sub-Phase 4A: Core UI (2-3 hours)

1. Create `/features/composer` directory
2. Implement `PlatformSelector.tsx`
3. Implement `PlatformOptions.tsx`
4. Implement `ContentEditor.tsx` (with toolbar)
5. Test core editing functionality

### Sub-Phase 4B: Media & Polls (2-3 hours)

6. Implement `useDragDrop` hook (if not done in Phase 2)
7. Implement `MediaUploader.tsx` with drag & drop
8. Implement `MediaPreview.tsx` with edit controls
9. Implement `PollCreator.tsx`
10. Test media upload and poll creation

### Sub-Phase 4C: AI Panel (2-3 hours)

11. Implement `AIPanel.tsx` (tab container)
12. Implement `AIWriter.tsx` (text generation)
13. Implement `AIDesigner.tsx` (image generation)
14. Implement `AIRepurpose.tsx` (content repurposing)
15. Implement `TeamCollaboration.tsx` (comments, approval)
16. Test all AI features

### Sub-Phase 4D: Final Assembly (1-2 hours)

17. Implement `SchedulingModal.tsx`
18. Implement `ProductPickerModal.tsx`
19. Implement `PreviewPanel.tsx`
20. Implement `useComposer.ts` hook
21. Create orchestrator `Composer.tsx`
22. Update `App.tsx` to import from `/features/composer`
23. Final testing of all features

## Testing

### Verification Checklist

- [ ] All 14 components created
- [ ] useComposer hook manages state
- [ ] Platform selection works
- [ ] Content editor with toolbar functions
- [ ] AI panel all tabs work
- [ ] Media upload works (drag & drop)
- [ ] Poll creation works
- [ ] Scheduling modal functions
- [ ] Preview panel shows all platforms
- [ ] No TypeScript errors
- [ ] Mobile responsive maintained

### Critical Test Scenarios

1. **Basic Flow:**
   - Select platforms
   - Write content
   - Schedule post
   - Verify creation

2. **AI Integration:**
   - Generate content
   - Generate variations
   - Repurpose content
   - Generate image

3. **Media Handling:**
   - Drag & drop image
   - Edit image filters
   - Upload video
   - Generate captions

4. **Advanced Features:**
   - Create poll (4 options)
   - Add platform-specific options
   - Preview on all platforms
   - Team collaboration (if agency)

## Completion Criteria

✅ **Phase 4 is complete when:**

1. All 14 sub-components created and working
2. useComposer hook successfully manages state
3. Composer.tsx reduced to ~200 lines
4. All original functionality preserved
5. No prop drilling issues
6. Media upload/edit works
7. AI features functional
8. Scheduling works
9. Preview accurate
10. No TypeScript errors
11. Git commit: `git commit -m "Phase 4: Composer refactoring into sub-components"`

## Code Reduction

**Before:** Composer.tsx ~1000 lines
**After:** Composer.tsx ~200 lines + 14 components (~1500 lines total)

**Benefits:**

- Testable components in isolation
- Clear separation of concerns
- Reusable AI panel components
- Easier to maintain and extend

## Common Issues

**Issue:** Losing draft on navigation

- **Solution:** useLocalStorage hook auto-saves content

**Issue:** Media preview not showing

- **Solution:** Check file type validation and URL generation

**Issue:** AI features not working

- **Solution:** Verify geminiService imports and API key

**Issue:** Platform previews incorrect

- **Solution:** Check platform-specific logic in PreviewPanel

## Next Phase

After Phase 4 is complete and committed, proceed to **Phase 5: Shared Components** (UI library and feedback components).
