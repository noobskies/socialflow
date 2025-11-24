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
