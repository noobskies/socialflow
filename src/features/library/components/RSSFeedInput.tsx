import React from "react";
import { Plus } from "lucide-react";

interface RSSFeedInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export const RSSFeedInput: React.FC<RSSFeedInputProps> = ({
  value,
  onChange,
  onAdd,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Add Content Source
      </h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter RSS Feed URL (e.g. https://techcrunch.com/feed)"
          className="flex-1 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feed
        </button>
      </div>
    </div>
  );
};
