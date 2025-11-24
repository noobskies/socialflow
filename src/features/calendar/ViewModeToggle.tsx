import React from "react";
import { LayoutGrid, Kanban, Grid3X3 } from "lucide-react";

type ViewMode = "calendar" | "kanban" | "grid";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewChange,
}) => {
  return (
    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <button
        onClick={() => onViewChange("calendar")}
        className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-md transition-all ${
          viewMode === "calendar"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Month
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-md transition-all ${
          viewMode === "kanban"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Kanban className="w-4 h-4 mr-2" />
        Board
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={`px-3 py-1.5 flex items-center text-sm font-medium rounded-md transition-all ${
          viewMode === "grid"
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Grid
      </button>
    </div>
  );
};
