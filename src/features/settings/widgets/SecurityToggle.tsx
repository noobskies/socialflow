import React from "react";
import { LucideIcon } from "lucide-react";

interface SecurityToggleProps {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle?: () => void;
  locked?: boolean;
  badge?: string;
}

export const SecurityToggle: React.FC<SecurityToggleProps> = ({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  locked = false,
  badge,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 mr-4">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      {locked ? (
        <div className="flex items-center">
          {badge && (
            <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded mr-3">
              {badge}
            </span>
          )}
          <button className="text-xs font-medium text-slate-400 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-700 cursor-not-allowed">
            Configure
          </button>
        </div>
      ) : (
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      )}
    </div>
  );
};
