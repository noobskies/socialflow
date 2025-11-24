import React from "react";
import { Plus } from "lucide-react";

export const IntegrationPlaceholder: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
      <Plus className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4 group-hover:text-indigo-500 transition-colors" />
      <h3 className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
        Request Integration
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
        Don&apos;t see your tool?
      </p>
    </div>
  );
};
