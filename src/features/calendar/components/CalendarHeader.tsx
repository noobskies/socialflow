import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={onPrevMonth}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
