# Phase 3: Dashboard Refactoring

**Estimated Time:** 4-5 hours

## Overview

Break down the monolithic Dashboard component into smaller, focused widget components. Extract state management into a custom hook and create a clean orchestrator pattern.

## Prerequisites

✅ Phase 1 complete: Directory structure and types organized
✅ Phase 2 complete: Custom hooks and utilities created

## Goals

1. Extract 5 dashboard widgets into separate components
2. Create `useDashboard` hook for state management
3. Reduce Dashboard.tsx to ~100 line orchestrator
4. Improve component reusability and testability

## Current State

**Dashboard.tsx**: 300+ lines with mixed concerns:

- Stats cards
- Trending topics (AI integration)
- Quick draft widget
- Upcoming posts preview
- Account health monitor
- Multiple charts and widgets

## Components to Create

### 1. `/features/dashboard/DashboardStats.tsx`

Stats cards component:

```typescript
import React from "react";
import { Users, Eye, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const stats = [
  {
    label: "Total Followers",
    value: "84.3K",
    change: "+12%",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    label: "Impressions",
    value: "1.2M",
    change: "+8.1%",
    icon: Eye,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    label: "Engagement Rate",
    value: "5.4%",
    change: "+2.3%",
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    label: "AI Posts Generated",
    value: "128",
    change: "+43%",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
];

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span
                className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith("+")
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                }`}
              >
                {stat.change}
                {stat.change.startsWith("+") && (
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                )}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

### 2. `/features/dashboard/TrendingWidget.tsx`

AI-powered trending topics:

```typescript
import React from "react";
import { Flame, RefreshCw, PenSquare } from "lucide-react";
import { Trend, Draft } from "@/types";

interface TrendingWidgetProps {
  trends: Trend[];
  loading: boolean;
  onRefresh: () => void;
  onDraftFromTrend: (draft: Draft) => void;
}

export const TrendingWidget: React.FC<TrendingWidgetProps> = ({
  trends,
  loading,
  onRefresh,
  onDraftFromTrend,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Trending Now
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trends.length > 0 ? (
          trends.map((trend) => (
            <div
              key={trend.id}
              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    trend.difficulty === "Easy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : trend.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {trend.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {trend.volume} Vol
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {trend.topic}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                {trend.context}
              </p>
              <button
                onClick={() =>
                  onDraftFromTrend({
                    content: `Thinking about: ${trend.topic}\n\nContext: ${trend.context}`,
                  })
                }
                className="w-full py-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center justify-center"
              >
                <PenSquare className="w-3 h-3 mr-2" /> Draft Post
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-slate-400 dark:text-slate-500">
            {loading ? "AI is identifying trends..." : "No trends loaded."}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 3. `/features/dashboard/QuickDraft.tsx`

Quick draft widget:

```typescript
import React, { useState } from "react";
import { PenSquare, Save } from "lucide-react";
import { Post, ToastType } from "@/types";

interface QuickDraftProps {
  onSave: (post: Post) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const QuickDraft: React.FC<QuickDraftProps> = ({
  onSave,
  showToast,
}) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      content,
      platforms: [],
      scheduledDate: new Date().toISOString().split("T")[0],
      status: "draft",
      time: "12:00",
    };

    onSave(newPost);
    setContent("");
    showToast("Quick draft saved to content calendar", "success");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <PenSquare className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Quick Draft
        </h3>
      </div>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 mb-3 transition-all"
      />
      <div className="flex justify-end relative z-10">
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </button>
      </div>
    </div>
  );
};
```

### 4. `/features/dashboard/UpcomingPosts.tsx`

Upcoming scheduled posts:

```typescript
import React from "react";
import {
  CalendarClock,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import { Post, Draft } from "@/types";

interface UpcomingPostsProps {
  posts: Post[];
  onCompose: (draft: Draft) => void;
}

export const UpcomingPosts: React.FC<UpcomingPostsProps> = ({
  posts,
  onCompose,
}) => {
  const upcomingPosts = posts
    .filter((p) => p.status === "scheduled")
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.scheduledDate}T${b.time || "00:00"}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <CalendarClock className="w-5 h-5 mr-2 text-slate-400" />
          Up Next
        </h3>
        <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
          View Calendar
        </button>
      </div>
      <div className="space-y-4">
        {upcomingPosts.length > 0 ? (
          upcomingPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  post.platforms.includes("instagram")
                    ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                    : post.platforms.includes("twitter")
                    ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {post.platforms.includes("instagram") && (
                  <Instagram className="w-4 h-4" />
                )}
                {post.platforms.includes("twitter") && (
                  <Twitter className="w-4 h-4" />
                )}
                {post.platforms.includes("linkedin") && (
                  <Linkedin className="w-4 h-4" />
                )}
                {!post.platforms.includes("instagram") &&
                  !post.platforms.includes("twitter") &&
                  !post.platforms.includes("linkedin") && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-1">
                  {post.content}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {post.scheduledDate} • {post.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
            No upcoming posts scheduled.
          </div>
        )}
      </div>
      <button
        onClick={() => onCompose({})}
        className="w-full mt-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        Schedule New Post
      </button>
    </div>
  );
};
```

### 5. `/features/dashboard/AccountHealth.tsx`

Account health monitor:

```typescript
import React from "react";
import { AlertCircle } from "lucide-react";
import { SocialAccount } from "@/types";

interface AccountHealthProps {
  accounts: SocialAccount[];
}

export const AccountHealth: React.FC<AccountHealthProps> = ({ accounts }) => {
  const connectedCount = accounts.filter((a) => a.connected).length;
  const totalCount = accounts.length;
  const healthPercentage = Math.round((connectedCount / totalCount) * 100);
  const instagramConnected = accounts.find(
    (a) => a.platform === "instagram"
  )?.connected;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Account Health
      </h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              healthPercentage === 100 ? "bg-emerald-500" : "bg-amber-500"
            } animate-pulse`}
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {healthPercentage === 100
              ? "All Systems Operational"
              : "Some Accounts Disconnected"}
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            healthPercentage === 100
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
          }`}
        >
          {healthPercentage}%
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Connected Accounts
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {connectedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              healthPercentage === 100 ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        {instagramConnected ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <AlertCircle className="w-3 h-3" />
            <span>Instagram token expires in 5 days</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-rose-500 mt-2 font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>Instagram disconnected</span>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 6. `/features/dashboard/useDashboard.ts`

Dashboard state management hook:

```typescript
import { useState, useEffect } from "react";
import { Trend } from "@/types";
import { getTrendingTopics } from "@/services/geminiService";

export function useDashboard(niche: string = "Tech & Marketing") {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const loadTrends = async () => {
    setLoadingTrends(true);
    try {
      const newTrends = await getTrendingTopics(niche);
      setTrends(newTrends);
    } catch (error) {
      console.error("Failed to load trends:", error);
    } finally {
      setLoadingTrends(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return {
    trends,
    loadingTrends,
    refreshTrends: loadTrends,
  };
}
```

## Implementation Steps

1. **Create feature directory and files**

   ```bash
   mkdir -p features/dashboard
   touch features/dashboard/Dashboard.tsx
   touch features/dashboard/DashboardStats.tsx
   touch features/dashboard/TrendingWidget.tsx
   touch features/dashboard/QuickDraft.tsx
   touch features/dashboard/UpcomingPosts.tsx
   touch features/dashboard/AccountHealth.tsx
   touch features/dashboard/useDashboard.ts
   ```

2. **Implement widget components**

   - Copy each widget implementation from above
   - Ensure proper imports from `@/types`

3. **Implement useDashboard hook**

   - Copy hook implementation
   - Test trend loading independently

4. **Refactor Dashboard.tsx**

```typescript
import React from "react";
import { DashboardStats } from "./DashboardStats";
import { TrendingWidget } from "./TrendingWidget";
import { QuickDraft } from "./QuickDraft";
import { UpcomingPosts } from "./UpcomingPosts";
import { AccountHealth } from "./AccountHealth";
import { useDashboard } from "./useDashboard";
import { Post, SocialAccount, Draft, ToastType } from "@/types";

interface DashboardProps {
  posts: Post[];
  accounts: SocialAccount[];
  onPostCreated: (post: Post) => void;
  showToast: (message: string, type: ToastType) => void;
  onCompose: (draft: Draft) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  posts,
  accounts,
  onPostCreated,
  showToast,
  onCompose,
}) => {
  const { trends, loadingTrends, refreshTrends } = useDashboard();

  return (
    <div className="space-y-6 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Welcome back! You have{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              84
            </span>{" "}
            AI credits remaining this month.
          </p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TrendingWidget
            trends={trends}
            loading={loadingTrends}
            onRefresh={refreshTrends}
            onDraftFromTrend={(draft) => onCompose(draft)}
          />
        </div>

        <div className="space-y-6">
          <QuickDraft onSave={onPostCreated} showToast={showToast} />
          <UpcomingPosts posts={posts} onCompose={onCompose} />
          <AccountHealth accounts={accounts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

5. **Update imports in App.tsx**

```typescript
import Dashboard from "@/features/dashboard/Dashboard";
```

## Testing

### Verification Checklist

- [ ] All 6 files created in `/features/dashboard/`
- [ ] DashboardStats displays correctly
- [ ] TrendingWidget loads trends from AI
- [ ] QuickDraft saves to posts
- [ ] UpcomingPosts shows scheduled posts
- [ ] AccountHealth calculates percentage correctly
- [ ] useDashboard hook manages state
- [ ] Dashboard.tsx reduced to ~100 lines
- [ ] No TypeScript errors
- [ ] All widgets responsive on mobile

### Manual Testing

1. View Dashboard - all widgets load
2. Refresh trends - AI loads new topics
3. Click "Draft Post" on trend - navigates to Composer with pre-filled content
4. Write quick draft - saves to calendar
5. Check upcoming posts - shows next 3 scheduled
6. Verify account health - shows correct percentage

## Completion Criteria

✅ **Phase 3 is complete when:**

1. All 5 widget components created
2. useDashboard hook extracts state logic
3. Dashboard.tsx is ~100 line orchestrator
4. All widgets work independently
5. No prop drilling issues
6. Responsive design maintained
7. No TypeScript errors
8. Git commit: `git commit -m "Phase 3: Dashboard refactoring into widgets"`

## Code Reduction

**Before:** Dashboard.tsx ~300 lines
**After:** Dashboard.tsx ~100 lines + 5 widgets (~500 lines total)

**Benefits:** Reusable widgets, testable in isolation, clearer responsibilities

## Next Phase

After Phase 3 is complete and committed, proceed to **Phase 4: Composer Refactoring** (the most complex phase).
