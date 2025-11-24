import React from "react";
import { Star } from "lucide-react";
import { PlanTier } from "@/types";
import { FeatureGateOverlay } from "@/components/ui/FeatureGateOverlay";
import { ComparisonRadar } from "../charts/ComparisonRadar";
import { HeadToHeadTable } from "../charts/HeadToHeadTable";

interface CompetitorsTabProps {
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
}

export const CompetitorsTab: React.FC<CompetitorsTabProps> = ({
  userPlan,
  onOpenUpgrade,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {/* Feature Gating Overlay */}
      {userPlan === "free" && (
        <FeatureGateOverlay
          icon={Star}
          title="Competitor Analysis Locked"
          description="Upgrade to Pro to track competitor performance, benchmark your growth, and spy on their best content."
          onUpgrade={onOpenUpgrade}
        />
      )}

      {/* Competitor Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 opacity-50 select-none pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
            You
          </div>
          <div className="text-slate-400 font-bold text-xl">VS</div>
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xl">
            Comp
          </div>
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Competitive Landscape
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            You are outperforming your main competitor in{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Engagement
            </span>{" "}
            but trailing in{" "}
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              Post Volume
            </span>
            .
          </p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
          Add Competitor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-50 select-none pointer-events-none">
        {/* Radar Chart */}
        <ComparisonRadar />

        {/* Comparison Table */}
        <HeadToHeadTable />
      </div>
    </div>
  );
};
