# Phase 6a: Analytics Refactoring

## Current State Analysis

**File**: `components/Analytics.tsx`  
**Lines**: 677 lines  
**Complexity**: High - multiple charts, tabs, feature gating

### Problems

1. **Monolithic Structure**: Single file handles 3 different tab views
2. **Mixed Concerns**: Chart logic, tab switching, mock data, feature gating all in one place
3. **State Management**: Multiple useState hooks scattered throughout
4. **Repeated Patterns**: Feature gate overlays duplicated, chart configs inline
5. **Hard to Test**: Tightly coupled logic makes unit testing difficult
6. **Navigation**: Tab state managed locally instead of potentially through URL params

### Current Structure

```typescript
Analytics.tsx (677 lines)
├── Overview Tab
│   ├── 4 Stat Cards
│   ├── Engagement Bar Chart (Recharts)
│   ├── Growth Area Chart (Recharts)
│   └── Top Posts Table (with recycle action)
├── Competitors Tab
│   ├── Feature Gate Overlay (Pro/Agency)
│   ├── Comparison Radar Chart
│   └── Head-to-Head Stats Table
└── Reports Tab
    ├── Report Builder Card
    └── Report History Table
```

## Goals

1. **Break Down Monolith**: Extract 3 tab components + chart components
2. **Apply Orchestrator Pattern**: Main Analytics.tsx becomes ~120-line coordinator
3. **Extract Custom Hook**: Create `useAnalytics` for state management
4. **Reusable Components**: Feature gate overlay, stat cards
5. **Better Organization**: Move to `/src/features/analytics/`
6. **Move Mock Data**: Centralize in constants
7. **Maintain Functionality**: Zero regression, all features work

## Component Breakdown

### Files to Create (15 total)

#### Core (5 files)
1. **Analytics.tsx** - Main orchestrator (~120 lines)
2. **useAnalytics.ts** - Custom hook for state management
3. **OverviewTab.tsx** - Overview content container
4. **CompetitorsTab.tsx** - Competitor comparison view
5. **ReportsTab.tsx** - Report builder and history

#### Charts (4 files)
6. **EngagementChart.tsx** - Bar chart for engagement by platform
7. **GrowthChart.tsx** - Area chart for audience growth
8. **ComparisonRadar.tsx** - Radar chart for competitor comparison
9. **HeadToHeadTable.tsx** - Comparison stats table

#### Widgets (6 files)
10. **StatCards.tsx** - 4-grid stat card layout
11. **TopPostsTable.tsx** - Top performing posts with recycle
12. **ReportBuilder.tsx** - Report creation card
13. **ReportHistory.tsx** - Report list table
14. **FeatureGateOverlay.tsx** - Reusable upgrade prompt (can be used in Settings too!)
15. **TabNavigation.tsx** - Tab switcher component

## File Structure

```
/src/features/analytics/
├── Analytics.tsx          # Orchestrator (~120 lines)
├── useAnalytics.ts        # Custom hook
│
├── tabs/
│   ├── OverviewTab.tsx
│   ├── CompetitorsTab.tsx
│   └── ReportsTab.tsx
│
├── charts/
│   ├── EngagementChart.tsx
│   ├── GrowthChart.tsx
│   ├── ComparisonRadar.tsx
│   └── HeadToHeadTable.tsx
│
└── widgets/
    ├── StatCards.tsx
    ├── TopPostsTable.tsx
    ├── ReportBuilder.tsx
    ├── ReportHistory.tsx
    ├── FeatureGateOverlay.tsx
    └── TabNavigation.tsx
```

## Implementation Plan

### Sub-Phase 6a-A: Foundation (Core Structure)

**Goal**: Set up orchestrator and tab structure

**Steps**:
1. Create `/src/features/analytics/` directory
2. Create `useAnalytics.ts` custom hook
   - Extract tab state management
   - Extract reports state
   - Extract notification toggles (if any)
3. Create `Analytics.tsx` orchestrator
   - Import and use `useAnalytics`
   - Set up basic layout
   - Render tab content conditionally
4. Create `TabNavigation.tsx`
   - Extract tab button group
   - Include feature lock icons

**Files Created**: 3  
**Expected Result**: Clean orchestrator with tab switching working

---

### Sub-Phase 6a-B: Overview Tab Components

**Goal**: Extract all Overview tab components

**Steps**:
1. Create `tabs/OverviewTab.tsx` container
2. Create `widgets/StatCards.tsx`
   - 4-grid layout
   - Props: stats array
   - Trend indicators
3. Create `charts/EngagementChart.tsx`
   - Recharts BarChart
   - Props: data, colors
   - Responsive container
4. Create `charts/GrowthChart.tsx`
   - Recharts AreaChart
   - Props: data, gradient config
5. Create `widgets/TopPostsTable.tsx`
   - Table with platform badges
   - Recycle button action
   - Props: posts, onRecycle callback

**Files Created**: 5  
**Expected Result**: Overview tab fully functional with extracted components

---

### Sub-Phase 6a-C: Competitors & Reports Tabs

**Goal**: Extract remaining tab components

**Steps**:
1. Create `widgets/FeatureGateOverlay.tsx` (reusable!)
   - Props: title, description, onUpgrade
   - Backdrop blur overlay
   - Upgrade CTA button
2. Create `tabs/CompetitorsTab.tsx`
   - Use FeatureGateOverlay for free users
   - Render charts for pro/agency users
3. Create `charts/ComparisonRadar.tsx`
   - Recharts RadarChart
   - Props: data, labels
4. Create `charts/HeadToHeadTable.tsx`
   - Comparison metrics table
   - Trophy/Target icons
5. Create `tabs/ReportsTab.tsx`
   - Layout for builder + history
6. Create `widgets/ReportBuilder.tsx`
   - Card with CTA
   - Create report action
7. Create `widgets/ReportHistory.tsx`
   - Table with report list
   - Download actions

**Files Created**: 7  
**Expected Result**: All 3 tabs working, feature gating functional

---

### Sub-Phase 6a-D: Integration & Cleanup

**Goal**: Polish, verify, and update imports

**Steps**:
1. Update `components/Analytics.tsx` (legacy) imports in `App.tsx`
   - Change to `/src/features/analytics/Analytics`
2. Move mock data to `/src/utils/constants.ts`
   - MOCK_ENGAGEMENT_DATA
   - MOCK_REACH_DATA
   - MOCK_COMPETITOR_DATA
   - MOCK_TOP_POSTS
   - MOCK_REPORTS
3. Verify TypeScript compilation (0 errors)
4. Test all tab switching
5. Test feature gating (free vs pro/agency)
6. Test all chart interactions
7. Test recycle post action
8. Verify dark mode appearance

**Files Modified**: 2  
**Expected Result**: Analytics fully refactored, working perfectly

## Implementation Details

### useAnalytics Hook Pattern

```typescript
// /src/features/analytics/useAnalytics.ts
import { useState } from 'react';
import { Report } from '@/types';
import { MOCK_REPORTS } from '@/utils/constants';

export function useAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'reports'>('overview');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  const createReport = () => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: 'New Custom Report',
      dateRange: 'Last 30 Days',
      createdAt: 'Just now',
      status: 'generating',
      format: 'pdf',
    };
    setReports([newReport, ...reports]);

    setTimeout(() => {
      setReports(prev =>
        prev.map(r => (r.id === newReport.id ? { ...r, status: 'ready' } : r))
      );
    }, 3000);
  };

  return {
    activeTab,
    setActiveTab,
    reports,
    createReport,
  };
}
```

### Analytics Orchestrator Pattern

```typescript
// /src/features/analytics/Analytics.tsx
import React from 'react';
import { useAnalytics } from './useAnalytics';
import { TabNavigation } from './widgets/TabNavigation';
import { OverviewTab } from './tabs/OverviewTab';
import { CompetitorsTab } from './tabs/CompetitorsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { AnalyticsProps } from '@/types';

export const Analytics: React.FC<AnalyticsProps> = ({
  showToast,
  userPlan,
  onOpenUpgrade,
  onCompose,
}) => {
  const analytics = useAnalytics();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Performance metrics across all channels
          </p>
        </div>
        <TabNavigation
          activeTab={analytics.activeTab}
          onTabChange={analytics.setActiveTab}
          userPlan={userPlan}
        />
      </div>

      {analytics.activeTab === 'overview' && (
        <OverviewTab
          showToast={showToast}
          onCompose={onCompose}
        />
      )}

      {analytics.activeTab === 'competitors' && (
        <CompetitorsTab
          userPlan={userPlan}
          onOpenUpgrade={onOpenUpgrade}
        />
      )}

      {analytics.activeTab === 'reports' && (
        <ReportsTab
          reports={analytics.reports}
          onCreateReport={analytics.createReport}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default Analytics;
```

### FeatureGateOverlay Pattern (Reusable!)

```typescript
// /src/features/analytics/widgets/FeatureGateOverlay.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureGateOverlayProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  onUpgrade: () => void;
}

export const FeatureGateOverlay: React.FC<FeatureGateOverlayProps> = ({
  icon: Icon,
  title,
  description,
  ctaText = 'Upgrade to Pro',
  onUpgrade,
}) => {
  return (
    <div className="absolute inset-0 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-2xl">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>
      <button
        onClick={onUpgrade}
        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
      >
        {ctaText}
      </button>
    </div>
  );
};
```

## Verification Steps

After each sub-phase:

1. **TypeScript Compilation**: Run `npm run type-check` - must pass with 0 errors
2. **Dev Server**: Run `npm run dev` - must start without errors
3. **Visual Verification**: Navigate to Analytics page, test all features
4. **Tab Switching**: Verify all 3 tabs render correctly
5. **Feature Gating**: Test with different user plans (free/pro/agency)
6. **Chart Interactions**: Hover tooltips, responsive resizing
7. **Actions**: Test recycle post, create report, export functionality
8. **Dark Mode**: Toggle theme, verify all components adapt
9. **Responsive**: Test mobile, tablet, desktop layouts

## Success Metrics

### Before (Phase 6a Start)
- **Main File**: 677 lines
- **Total Files**: 1
- **Components**: All inline
- **Reusability**: Low (inline everything)
- **Testability**: Difficult

### After (Phase 6a Complete)
- **Main File**: ~120 lines (-82%)
- **Total Files**: 15 (+14)
- **Components**: 14 extracted, focused components
- **Reusability**: High (FeatureGateOverlay can be used in Settings!)
- **Testability**: Easy (each component isolated)
- **Organization**: Professional `/src/features/analytics/` structure

### Quality Gates
- ✅ TypeScript: 0 compilation errors
- ✅ ESLint: No new warnings
- ✅ Functionality: All features work
- ✅ Performance: No regressions
- ✅ Dark Mode: Fully supported
- ✅ Responsive: Mobile/tablet/desktop

## Dependencies

### Existing Packages
- `recharts` - Already installed
- `lucide-react` - Already installed
- All custom types from `@/types`

### No New Dependencies Required
- Uses existing UI patterns
- Leverages current design system
- Follows established conventions

## Migration Notes

### For Other Developers

1. **Import Change**: Update `App.tsx` import from `./components/Analytics` to `@/features/analytics/Analytics`
2. **Mock Data**: Centralized in `/src/utils/constants.ts`
3. **Reusable Component**: `FeatureGateOverlay` can be imported by Settings.tsx
4. **Props Interface**: No changes to Analytics component props

### Backwards Compatibility

- ✅ Component API unchanged
- ✅ All props remain the same
- ✅ Visual appearance identical
- ✅ User experience unchanged

## Next Steps

After Phase 6a completion:
1. Commit changes: "Phase 6a: Complete Analytics refactoring"
2. Update `progress.md` with metrics
3. Proceed to **Phase 6b: Settings Refactoring**
