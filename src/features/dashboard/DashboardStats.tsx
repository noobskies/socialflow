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
