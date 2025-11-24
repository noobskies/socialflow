import React, { useState } from "react";
import { Post, SocialAccount, Draft, ToastType } from "@/types";
import { useDashboard } from "./useDashboard";
import { DashboardStats } from "./DashboardStats";
import { CrisisAlert } from "./CrisisAlert";
import { OnboardingProgress } from "./OnboardingProgress";
import { TrendingWidget } from "./TrendingWidget";
import { EngagementChart } from "./EngagementChart";
import { QuickDraft } from "./QuickDraft";
import { UpcomingPosts } from "./UpcomingPosts";
import { AccountHealth } from "./AccountHealth";
import { TopLinks } from "./TopLinks";
import { RecentGenerations } from "./RecentGenerations";

interface DashboardProps {
  posts?: Post[];
  accounts?: SocialAccount[];
  onPostCreated?: (post: Post) => void;
  showToast?: (message: string, type: ToastType) => void;
  onCompose?: (draft: Draft) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  posts = [],
  accounts = [],
  onPostCreated,
  showToast,
  onCompose,
}) => {
  const { trends, loadingTrends, refreshTrends } = useDashboard();
  const [showCrisisAlert, setShowCrisisAlert] = useState(true);

  return (
    <div className="space-y-6 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      {/* Header */}
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
        <div className="flex space-x-2">
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Crisis Alert */}
      {showCrisisAlert && (
        <CrisisAlert onDismiss={() => setShowCrisisAlert(false)} />
      )}

      {/* Onboarding Progress */}
      <OnboardingProgress posts={posts} accounts={accounts} />

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts and Trends */}
        <div className="xl:col-span-2 space-y-6">
          <EngagementChart />
          <TrendingWidget
            trends={trends}
            loading={loadingTrends}
            onRefresh={refreshTrends}
            onDraftFromTrend={(draft) => onCompose && onCompose(draft)}
          />
        </div>

        {/* Right Column - Quick Actions and Widgets */}
        <div className="space-y-6">
          <QuickDraft
            onSave={(post) => onPostCreated && onPostCreated(post)}
            showToast={(msg, type) => showToast && showToast(msg, type)}
          />
          <UpcomingPosts
            posts={posts}
            onCompose={(draft) => onCompose && onCompose(draft)}
          />
          <AccountHealth accounts={accounts} />
        </div>
      </div>

      {/* Bottom Grid - Links and Generations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopLinks />
        <div className="lg:col-span-2">
          <RecentGenerations />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
