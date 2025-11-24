import React from "react";
import { AlertCircle } from "lucide-react";
import { SocialAccount } from "@/types";

interface AccountHealthProps {
  accounts: SocialAccount[];
}

export const AccountHealth: React.FC<AccountHealthProps> = ({ accounts }) => {
  const connectedCount = accounts.filter((a) => a.connected).length;
  const totalCount = accounts.length;
  const healthPercentage = Math.round((connectedCount / totalCount) * 100);
  const instagramConnected = accounts.find(
    (a) => a.platform === "instagram"
  )?.connected;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Account Health
      </h3>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              healthPercentage === 100 ? "bg-emerald-500" : "bg-amber-500"
            } animate-pulse`}
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {healthPercentage === 100
              ? "All Systems Operational"
              : "Some Accounts Disconnected"}
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            healthPercentage === 100
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
          }`}
        >
          {healthPercentage}%
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Connected Accounts
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {connectedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              healthPercentage === 100 ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        {instagramConnected ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
            <AlertCircle className="w-3 h-3" />
            <span>Instagram token expires in 5 days</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-rose-500 mt-2 font-medium">
            <AlertCircle className="w-3 h-3" />
            <span>Instagram disconnected</span>
          </div>
        )}
      </div>
    </div>
  );
};
