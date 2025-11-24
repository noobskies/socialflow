import React from "react";
import { ToastType, Draft } from "@/types";
import { StatCards } from "../widgets/StatCards";
import { EngagementChart } from "../charts/EngagementChart";
import { GrowthChart } from "../charts/GrowthChart";
import { TopPostsTable } from "../widgets/TopPostsTable";

interface OverviewTabProps {
  showToast: (message: string, type: ToastType) => void;
  onCompose?: (draft: Draft) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  showToast,
  onCompose,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Key Metrics */}
      <StatCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EngagementChart />
        <GrowthChart />
      </div>

      {/* Top Performing Posts Table */}
      <TopPostsTable showToast={showToast} onCompose={onCompose} />
    </div>
  );
};
