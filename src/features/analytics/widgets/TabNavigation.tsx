import React from "react";
import { Lock } from "lucide-react";
import { PlanTier } from "@/types";

interface TabNavigationProps {
  activeTab: "overview" | "competitors" | "reports";
  onTabChange: (tab: "overview" | "competitors" | "reports") => void;
  userPlan: PlanTier;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  userPlan,
}) => {
  return (
    <div className="flex bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
      <button
        onClick={() => onTabChange("overview")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          activeTab === "overview"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => onTabChange("competitors")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
          activeTab === "competitors"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        Competitors
        {userPlan === "free" && <Lock className="w-3 h-3 text-slate-400" />}
      </button>
      <button
        onClick={() => onTabChange("reports")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          activeTab === "reports"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        Reports
      </button>
    </div>
  );
};
