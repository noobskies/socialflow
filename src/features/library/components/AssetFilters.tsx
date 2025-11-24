import React from "react";
import { Search, Upload, Plus } from "lucide-react";

interface AssetFiltersProps {
  activeFilter: "all" | "image" | "video" | "template";
  onFilterChange: (filter: "all" | "image" | "video" | "template") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onUploadClick,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {["all", "image", "video", "template"].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeFilter === type
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onUploadClick}
          className="flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </button>
        <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </button>
      </div>
    </div>
  );
};
