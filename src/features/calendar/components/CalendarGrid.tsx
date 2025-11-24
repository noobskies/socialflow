import React from "react";
import { Plus } from "lucide-react";
import { Post } from "@/types";
import { PostCard } from "./PostCard";
import {
  generateCalendarGrid,
  isCurrentMonth,
  isToday,
  formatDate,
} from "../utils/calendarUtils";
import { createDragHandlers } from "../utils/dragDropUtils";

interface CalendarGridProps {
  posts: Post[];
  currentMonth: number;
  currentYear: number;
  onDateClick: (date: string) => void;
  onPostClick: (post: Post) => void;
  draggedPost: Post | null;
  onDragStart: (post: Post) => void;
  onDragEnd: () => void;
  onUpdatePost?: (post: Post) => void;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  posts,
  currentMonth,
  currentYear,
  onDateClick,
  onPostClick,
  draggedPost,
  onDragStart,
  onDragEnd,
  onUpdatePost,
}) => {
  const calendarDays = generateCalendarGrid(currentMonth, currentYear);

  const dragHandlers = createDragHandlers(
    draggedPost,
    (post) => (post ? onDragStart(post) : onDragEnd()),
    onUpdatePost
  );

  return (
    <>
      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        {days.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-slate-100 dark:divide-slate-800 divide-y">
        {calendarDays.map((dayNum, i) => {
          const isInCurrentMonth = isCurrentMonth(dayNum);
          const isTodayCell = isToday(dayNum, currentMonth, currentYear);

          // Filter posts for this day
          const dayPosts = posts.filter(
            (p) => parseInt(p.scheduledDate.split("-")[2]) === dayNum
          );

          return (
            <div
              key={i}
              className={`min-h-[120px] p-2 transition-colors group relative flex flex-col ${
                !isInCurrentMonth
                  ? "bg-slate-50/50 dark:bg-slate-950/50"
                  : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30"
              } ${
                draggedPost && isInCurrentMonth
                  ? "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  : ""
              }`}
              onDragOver={
                isInCurrentMonth ? dragHandlers.handleDragOver : undefined
              }
              onDrop={
                isInCurrentMonth
                  ? (e) =>
                      dragHandlers.handleDrop(
                        e,
                        dayNum,
                        currentMonth,
                        currentYear
                      )
                  : undefined
              }
            >
              {isInCurrentMonth && (
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isTodayCell
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {dayNum}
                  </span>
                  <button
                    onClick={() =>
                      onDateClick(formatDate(dayNum, currentMonth, currentYear))
                    }
                    className="text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="space-y-1.5 flex-1 overflow-y-auto">
                {isInCurrentMonth &&
                  dayPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={onPostClick}
                      onDragStart={dragHandlers.handleDragStart}
                      compact
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
