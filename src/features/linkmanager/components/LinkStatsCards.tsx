import React from "react";
import { ArrowRight } from "lucide-react";

interface LinkStatsCardsProps {
  totalClicks: number;
  activeLinks: number;
  onCreateNew: () => void;
}

export const LinkStatsCards: React.FC<LinkStatsCardsProps> = ({
  totalClicks,
  activeLinks,
  onCreateNew,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
          Total Clicks
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {totalClicks.toLocaleString()}
        </h3>
        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
          <ArrowRight className="w-3 h-3 mr-1 rotate-[-45deg]" /> +12% this week
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
          Active Links
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {activeLinks}
        </h3>
        <div className="mt-2 text-xs text-slate-400">3 expiring soon</div>
      </div>

      <div
        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
        onClick={onCreateNew}
      >
        <div>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
            Create New Link
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shorten, brand, and track
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
          <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
        </div>
      </div>
    </div>
  );
};
