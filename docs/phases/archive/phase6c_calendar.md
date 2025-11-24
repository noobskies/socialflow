# Phase 6c: Calendar Refactoring

## Current State Analysis

**File**: `components/Calendar.tsx`  
**Lines**: 697 lines  
**Complexity**: High - 3 view modes, drag-and-drop, modal system, export/import

### Problems

1. **Complex Monolith**: Single file handles 3 completely different view modes
2. **Mixed View Logic**: Calendar grid, Kanban board, Instagram grid all in one file
3. **Scattered State**: 4+ useState hooks managing different concerns
4. **Inline Utilities**: Drag-and-drop logic, export/import, date calculations inline
5. **Large Modal**: 150+ line PostDetailModal embedded in main file
6. **Platform Icons**: Duplicated switch statement for platform icons
7. **Hard to Test**: Tightly coupled view logic

### Current Structure

```typescript
Calendar.tsx (697 lines)
├── View Mode Toggle (3 buttons)
├── Export/Import Actions
│   ├── Export menu (PDF/CSV)
│   └── Bulk import from CSV
├── Calendar View (~250 lines)
│   ├── Month header with navigation
│   ├── Days header
│   ├── 35-cell grid
│   ├── Drag-and-drop handlers
│   └── Posts rendered in cells
├── Kanban View (~150 lines)
│   ├── 4 status columns (draft/review/scheduled/published)
│   ├── Column headers
│   └── Draggable post cards
├── Grid View (~180 lines)
│   ├── Instagram phone mockup
│   ├── Profile header
│   ├── 3-column grid
│   └── Empty slots with "Add" button
└── Post Detail Modal (~150 lines)
    ├── Platform badges
    ├── Content preview
    ├── Poll display (if exists)
    ├── Media preview (if exists)
    ├── Analytics (if published)
    └── Edit/Duplicate actions
```

## Goals

1. **Break Down Monolith**: Extract 3 view components + modal + utilities
2. **Apply Orchestrator Pattern**: Main Calendar.tsx becomes ~140-line coordinator
3. **Extract Custom Hook**: Create `useCalendar` for state management
4. **Extract Utilities**: Drag-and-drop, export/import, platform icons to separate files
5. **Better Organization**: Move to `/src/features/calendar/`
6. **Reusable Components**: ViewToggle, PostDetailModal
7. **Maintain Functionality**: Zero regression, all features work

## Component Breakdown

### Files to Create (16 total)

#### Core (3 files)
1. **Calendar.tsx** - Main orchestrator (~140 lines)
2. **useCalendar.ts** - Custom hook for state management
3. **ViewModeToggle.tsx** - 3-button view switcher

#### Views (3 files)
4. **CalendarView.tsx** - Month calendar with grid and drag-drop
5. **KanbanView.tsx** - Board view with status columns
6. **GridView.tsx** - Instagram-style grid preview

#### Components (5 files)
7. **PostDetailModal.tsx** - Full post detail modal
8. **CalendarHeader.tsx** - Month display with navigation arrows
9. **CalendarGrid.tsx** - 35-cell grid with drag-drop zones
10. **KanbanColumn.tsx** - Single status column for Kanban
11. **PostCard.tsx** - Reusable post card component

#### Utilities (5 files)
12. **calendarUtils.ts** - Date calculations, grid generation
13. **dragDropUtils.ts** - Drag-and-drop handlers
14. **exportUtils.ts** - Export to PDF/CSV logic
15. **importUtils.ts** - Bulk CSV import parser
16. **platformIcons.tsx** - Platform icon mapping utility

## File Structure

```
/src/features/calendar/
├── Calendar.tsx          # Orchestrator (~140 lines)
├── useCalendar.ts        # Custom hook
├── ViewModeToggle.tsx    # View switcher
│
├── views/
│   ├── CalendarView.tsx
│   ├── KanbanView.tsx
│   └── GridView.tsx
│
├── components/
│   ├── PostDetailModal.tsx
│   ├── CalendarHeader.tsx
│   ├── CalendarGrid.tsx
│   ├── KanbanColumn.tsx
│   └── PostCard.tsx
│
└── utils/
    ├── calendarUtils.ts
    ├── dragDropUtils.ts
    ├── exportUtils.ts
    ├── importUtils.ts
    └── platformIcons.tsx
```

## Implementation Plan

### Sub-Phase 6c-A: Foundation & Utilities

**Goal**: Set up orchestrator and extract utilities

**Steps**:
1. Create `/src/features/calendar/` directory
2. Create `utils/platformIcons.tsx`
   - Extract getPlatformIcon function
   - Export as utility
3. Create `utils/calendarUtils.ts`
   - Date formatting helpers
   - Grid generation logic
   - isToday checker
4. Create `useCalendar.ts` custom hook
   - Extract viewMode state
   - Extract selectedPost state
   - Extract draggedPost state
   - Extract isExportMenuOpen state
   - Extract fileInputRef
5. Create `Calendar.tsx` orchestrator
   - Import useCalendar
   - Basic layout structure
   - Conditional view rendering

**Files Created**: 5  
**Expected Result**: Clean structure, utilities available

---

### Sub-Phase 6c-B: View Components & Toggle

**Goal**: Extract 3 view modes into separate components

**Steps**:
1. Create `ViewModeToggle.tsx`
   - 3 buttons (Month/Board/Grid)
   - Active state styling
   - Props: viewMode, onViewChange
2. Create `views/CalendarView.tsx`
   - Import CalendarHeader, CalendarGrid
   - Month calendar layout
   - Props: posts, onDateClick, onPostClick, dragHandlers
3. Create `views/KanbanView.tsx`
   - 4 columns layout
   - KanbanColumn components
   - Props: posts, columns, onPostClick, userPlan
4. Create `views/GridView.tsx`
   - Instagram phone mockup
   - Profile header section
   - 3-column post grid
   - Props: posts, onPostClick, onCompose

**Files Created**: 4  
**Expected Result**: View switching working, clean separation

---

### Sub-Phase 6c-C: Calendar View Sub-Components

**Goal**: Extract calendar-specific components

**Steps**:
1. Create `components/CalendarHeader.tsx`
   - Month/year display
   - Left/right navigation arrows
   - Props: currentDate, onPrevMonth, onNextMonth
2. Create `components/CalendarGrid.tsx`
   - Days header row
   - 35-cell grid layout
   - Drag-and-drop zones
   - PostCard rendering in cells
   - Props: posts, onDateClick, onPostClick, dragHandlers, currentMonth
3. Create `components/PostCard.tsx` (reusable!)
   - Platform icons
   - Post time
   - Content preview
   - Status styling
   - Draggable attribute
   - Props: post, onClick, onDragStart, compact

**Files Created**: 3  
**Expected Result**: Calendar view fully functional with drag-drop

---

### Sub-Phase 6c-D: Kanban, Modal, Import/Export

**Goal**: Extract remaining complex pieces

**Steps**:
1. Create `components/KanbanColumn.tsx`
   - Column header with count
   - Scrollable card list
   - PostCard components
   - Props: column, posts, onPostClick
2. Create `components/PostDetailModal.tsx`
   - Full modal with backdrop
   - Header info (platforms, date/time, status)
   - Content preview
   - Poll display (if exists)
   - Media preview (if exists)
   - Analytics section (if published)
   - Edit/Duplicate/Close actions
   - Props: post, onClose, onEdit, showToast
3. Create `utils/dragDropUtils.ts`
   - handleDragStart
   - handleDragOver
   - handleDrop
   - Export drag handlers object
4. Create `utils/exportUtils.ts`
   - handleExportPDF
   - handleExportCSV
   - Export utility functions
5. Create `utils/importUtils.ts`
   - parseCSV function
   - handleBulkImport function
   - CSV format validation

**Files Created**: 5  
**Expected Result**: All features working (Kanban, modal, import/export)

---

### Sub-Phase 6c-E: Integration & Cleanup

**Goal**: Polish, verify, and update imports

**Steps**:
1. Update `components/Calendar.tsx` (legacy) imports in `App.tsx`
   - Change to `/src/features/calendar/Calendar`
2. Verify TypeScript compilation (0 errors)
3. Test all 3 view modes
4. Test drag-and-drop in calendar and kanban views
5. Test post detail modal (open, edit, duplicate)
6. Test export (PDF/CSV menu)
7. Test bulk import from CSV
8. Test date click to create post
9. Verify dark mode appearance
10. Test responsive layouts

**Files Modified**: 1  
**Expected Result**: Calendar fully refactored, all features working perfectly

## Implementation Details

### useCalendar Hook Pattern

```typescript
// /src/features/calendar/useCalendar.ts
import { useState, useRef } from 'react';
import { Post } from '@/types';

type ViewMode = 'calendar' | 'kanban' | 'grid';

export function useCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [draggedPost, setDraggedPost] = useState<Post | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (post: Post) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  return {
    viewMode,
    setViewMode,
    selectedPost,
    openModal,
    closeModal,
    draggedPost,
    setDraggedPost,
    isExportMenuOpen,
    setIsExportMenuOpen,
    fileInputRef,
  };
}
```

### Calendar Orchestrator Pattern

```typescript
// /src/features/calendar/Calendar.tsx
import React from 'react';
import { useCalendar } from './useCalendar';
import { ViewModeToggle } from './ViewModeToggle';
import { CalendarView } from './views/CalendarView';
import { KanbanView } from './views/KanbanView';
import { GridView } from './views/GridView';
import { PostDetailModal } from './components/PostDetailModal';
import { ExportMenu } from './components/ExportMenu';
import { handleExportPDF, handleExportCSV } from './utils/exportUtils';
import { handleBulkImport } from './utils/importUtils';
import { CalendarProps } from '@/types';

export const Calendar: React.FC<CalendarProps> = ({
  onCompose,
  posts = [],
  onUpdatePost,
  onPostCreated,
  userPlan = 'free',
}) => {
  const calendar = useCalendar();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleBulkImport(e, onPostCreated);
    if (calendar.fileInputRef.current) {
      calendar.fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <input
        type="file"
        ref={calendar.fileInputRef}
        onChange={handleImport}
        className="hidden"
        accept=".csv"
      />

      {/* Post Detail Modal */}
      {calendar.selectedPost && (
        <PostDetailModal
          post={calendar.selectedPost}
          onClose={calendar.closeModal}
          onEdit={(draft) => {
            calendar.closeModal();
            onCompose(draft);
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Content Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Plan, visualize, and manage your workflow
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ExportMenu
            isOpen={calendar.isExportMenuOpen}
            onToggle={() => calendar.setIsExportMenuOpen(!calendar.isExportMenuOpen)}
            onExportPDF={() => handleExportPDF()}
            onExportCSV={() => handleExportCSV()}
            onImport={() => calendar.fileInputRef.current?.click()}
          />
          
          <ViewModeToggle
            viewMode={calendar.viewMode}
            onViewChange={calendar.setViewMode}
          />
          
          <button onClick={() => onCompose()} className="...">
            New Post
          </button>
        </div>
      </div>

      {/* View Rendering */}
      {calendar.viewMode === 'calendar' && (
        <CalendarView
          posts={posts}
          onDateClick={(date) => onCompose({ scheduledDate: date })}
          onPostClick={calendar.openModal}
          draggedPost={calendar.draggedPost}
          onDragStart={calendar.setDraggedPost}
          onDragEnd={() => calendar.setDraggedPost(null)}
          onUpdatePost={onUpdatePost}
        />
      )}

      {calendar.viewMode === 'kanban' && (
        <KanbanView
          posts={posts}
          onPostClick={calendar.openModal}
          userPlan={userPlan}
        />
      )}

      {calendar.viewMode === 'grid' && (
        <GridView
          posts={posts}
          onPostClick={calendar.openModal}
          onCompose={onCompose}
        />
      )}
    </div>
  );
};

export default Calendar;
```

### Platform Icons Utility

```typescript
// /src/features/calendar/utils/platformIcons.tsx
import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram, Video, Youtube, Pin } from 'lucide-react';
import { Platform } from '@/types';

export const getPlatformIcon = (platform: Platform, className: string = 'w-3 h-3') => {
  switch (platform) {
    case 'twitter':
      return <Twitter className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'tiktok':
      return <Video className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'pinterest':
      return <Pin className={className} />;
  }
};

export const getPlatformColor = (platform: Platform): string => {
  switch (platform) {
    case 'twitter':
      return 'bg-sky-500';
    case 'linkedin':
      return 'bg-blue-700';
    case 'facebook':
      return 'bg-blue-600';
    case 'instagram':
      return 'bg-pink-600';
    case 'tiktok':
      return 'bg-black';
    case 'youtube':
      return 'bg-red-600';
    case 'pinterest':
      return 'bg-red-500';
  }
};
```

### Drag-Drop Utilities

```typescript
// /src/features/calendar/utils/dragDropUtils.ts
import { Post } from '@/types';

export const createDragHandlers = (
  draggedPost: Post | null,
  setDraggedPost: (post: Post | null) => void,
  onUpdatePost?: (post: Post) => void
) => {
  const handleDragStart = (e: React.DragEvent, post: Post) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPost(post);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number, month: number, year: number) => {
    e.preventDefault();
    if (draggedPost && onUpdatePost) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onUpdatePost({
        ...draggedPost,
        scheduledDate: formattedDate,
        status: 'scheduled',
      });
      setDraggedPost(null);
    }
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};
```

### Import Utility

```typescript
// /src/features/calendar/utils/importUtils.ts
import { Post, Platform } from '@/types';

export const handleBulkImport = (
  e: React.ChangeEvent<HTMLInputElement>,
  onPostCreated?: (post: Post) => void
) => {
  if (!e.target.files || !e.target.files[0] || !onPostCreated) return;

  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result as string;
    if (!text) return;

    // Simple CSV parser: date,time,content,platform
    const lines = text.split('\n').slice(1); // Skip header
    let count = 0;

    lines.forEach((line) => {
      if (!line.trim()) return;
      const [date, time, content, platform] = line
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''));

      if (date && content) {
        const newPost: Post = {
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content,
          scheduledDate: date,
          time: time || '12:00',
          platforms: [(platform as Platform) || 'twitter'],
          status: 'scheduled',
        };
        onPostCreated(newPost);
        count++;
      }
    });

    alert(`Successfully imported ${count} posts!`);
  };

  reader.readAsText(file);
};
```

## Verification Steps

After each sub-phase:

1. **TypeScript Compilation**: Run `npm run type-check` - must pass with 0 errors
2. **Dev Server**: Run `npm run dev` - must start without errors
3. **Visual Verification**: Navigate to Calendar page
4. **View Switching**: Test all 3 view modes (calendar/kanban/grid)
5. **Drag-and-Drop**: Drag posts between dates in calendar view
6. **Kanban Drag**: Visual feedback when dragging in Kanban (if implemented)
7. **Post Modal**: Click post, verify modal opens with full details
8. **Edit Action**: Click Edit in modal, verify composer opens with draft
9. **Export Menu**: Test PDF and CSV export actions
10. **Import CSV**: Test bulk import with sample CSV file
11. **Date Click**: Click empty date cell, verify composer opens with date
12. **Dark Mode**: Toggle theme, verify all views adapt
13. **Responsive**: Test mobile, tablet, desktop layouts

## Success Metrics

### Before (Phase 6c Start)
- **Main File**: 697 lines
- **Total Files**: 1
- **View Logic**: All 3 views in one file
- **Utilities**: Inline helpers and switch statements
- **Modal**: 150+ lines embedded
- **Testability**: Difficult
- **Reusability**: None

### After (Phase 6c Complete)
- **Main File**: ~140 lines (-80%)
- **Total Files**: 16 (+15)
- **View Logic**: 3 clean, focused view components
- **Utilities**: 5 separate utility modules
- **Modal**: Standalone, reusable component
- **Testability**: Easy (each piece isolated)
- **Reusability**: High (PostCard, utilities, modal)
- **Organization**: Professional `/src/features/calendar/` structure

### Quality Gates
- ✅ TypeScript: 0 compilation errors
- ✅ ESLint: No new warnings
- ✅ Functionality: All 3 views work perfectly
- ✅ Drag-Drop: Smooth in calendar view
- ✅ Modal: Opens/closes smoothly
- ✅ Import/Export: CSV functionality working
- ✅ Dark Mode: Fully supported
- ✅ Responsive: Mobile/tablet/desktop
- ✅ Performance: No lag with 100+ posts

## Dependencies

### Existing Packages
- `lucide-react` - Already installed
- All custom types from `@/types`

### No New Dependencies Required
- Pure drag-and-drop (no react-dnd needed for MVP)
- CSV parsing with native JavaScript
- Uses existing UI patterns

## Migration Notes

### For Other Developers

1. **Import Change**: Update `App.tsx` import from `./components/Calendar` to `@/features/calendar/Calendar`
2. **Utilities**: Platform icon utility can be imported by other components if needed
3. **Reusable PostCard**: Can be used in other calendar-like views
4. **Props Interface**: No changes to Calendar component props

### Backwards Compatibility

- ✅ Component API unchanged
- ✅ All props remain the same
- ✅ Visual appearance identical
- ✅ User experience unchanged
- ✅ Drag-and-drop behavior identical

## Known Considerations

### Drag-and-Drop Simplicity

Current implementation uses native HTML5 drag-and-drop API. For future enhancements:
- Consider react-dnd for more complex interactions
- Add visual drag preview/ghost
- Add drop zone highlighting
- Add mobile touch support

### Calendar Date Logic

Uses simple date offset for mock calendar. For production:
- Use date library (date-fns or dayjs) for accurate date math
- Handle month boundaries properly
- Calculate actual days in month
- Handle leap years

### Export Functionality

Current export is placeholder. For production:
- Implement actual PDF generation (jsPDF or similar)
- Format CSV properly with all post data
- Add download progress indicators
- Add error handling

## Next Steps

After Phase 6c completion:
1. Commit changes: "Phase 6c: Complete Calendar refactoring"
2. Update `progress.md` with metrics
3. Proceed to **Phase 6d: App.tsx Simplification**
4. Update `phase6_app_simplification.md` filename to `phase6d_app_simplification.md`
