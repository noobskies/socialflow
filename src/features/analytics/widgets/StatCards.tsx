import React from "react";
import {
  Users,
  MousePointer2,
  Share2,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
} from "lucide-react";

interface StatData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
  bg: string;
}

const STATS: StatData[] = [
  {
    label: "Total Reach",
    value: "128.4K",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    label: "Engagement",
    value: "14.2K",
    change: "+8.2%",
    trend: "up",
    icon: MousePointer2,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    label: "Shares",
    value: "3.4K",
    change: "-2.1%",
    trend: "down",
    icon: Share2,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    label: "Comments",
    value: "1.8K",
    change: "+5.4%",
    trend: "up",
    icon: MessageCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
];

export const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span
                className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
                }`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 ml-1" />
                )}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
