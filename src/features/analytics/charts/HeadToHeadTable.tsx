import React from "react";
import { Trophy, Target } from "lucide-react";

interface Metric {
  label: string;
  you: string;
  comp: string;
  win: boolean;
}

const METRICS: Metric[] = [
  {
    label: "Follower Growth",
    you: "+5.2%",
    comp: "+3.1%",
    win: true,
  },
  {
    label: "Avg. Engagement",
    you: "4.8%",
    comp: "2.1%",
    win: true,
  },
  {
    label: "Posting Frequency",
    you: "5/week",
    comp: "12/week",
    win: false,
  },
  {
    label: "Video Content",
    you: "15%",
    comp: "45%",
    win: false,
  },
  {
    label: "Response Time",
    you: "2h",
    comp: "5h",
    win: true,
  },
];

export const HeadToHeadTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        Head-to-Head Stats
      </h3>
      <div className="space-y-6">
        {METRICS.map((metric, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
          >
            <span className="font-medium text-slate-700 dark:text-slate-300 w-1/3">
              {metric.label}
            </span>
            <div className="flex-1 flex items-center justify-center gap-8">
              <div
                className={`font-bold ${
                  metric.win
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {metric.you}
              </div>
              <div
                className={`font-bold ${
                  !metric.win
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {metric.comp}
              </div>
            </div>
            <div className="w-8 flex justify-end">
              {metric.win ? (
                <Trophy className="w-4 h-4 text-amber-500" />
              ) : (
                <Target className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
