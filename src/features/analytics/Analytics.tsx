import React from "react";
import { useAnalytics } from "./useAnalytics";
import { TabNavigation } from "./widgets/TabNavigation";
import { OverviewTab } from "./tabs/OverviewTab";
import { CompetitorsTab } from "./tabs/CompetitorsTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { ToastType, PlanTier, Draft } from "@/types";

interface AnalyticsProps {
  showToast: (message: string, type: ToastType) => void;
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  onCompose?: (draft: Draft) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  showToast,
  userPlan,
  onOpenUpgrade,
  onCompose,
}) => {
  const analytics = useAnalytics();

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Performance metrics across all channels
          </p>
        </div>
        <div className="flex gap-3">
          <TabNavigation
            activeTab={analytics.activeTab}
            onTabChange={analytics.setActiveTab}
            userPlan={userPlan}
          />
        </div>
      </div>

      {analytics.activeTab === "overview" && (
        <OverviewTab showToast={showToast} onCompose={onCompose} />
      )}

      {analytics.activeTab === "competitors" && (
        <CompetitorsTab userPlan={userPlan} onOpenUpgrade={onOpenUpgrade} />
      )}

      {analytics.activeTab === "reports" && (
        <ReportsTab
          reports={analytics.reports}
          onCreateReport={() => analytics.createReport(showToast)}
          showToast={showToast}
        />
      )}
    </div>
  );
};

export default Analytics;
