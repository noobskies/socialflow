import React from "react";
import { Post } from "@/types";
import { CalendarHeader } from "../components/CalendarHeader";
import { CalendarGrid } from "../components/CalendarGrid";

interface CalendarViewProps {
  posts: Post[];
  onDateClick: (date: string) => void;
  onPostClick: (post: Post) => void;
  draggedPost: Post | null;
  onDragStart: (post: Post) => void;
  onDragEnd: () => void;
  onUpdatePost?: (post: Post) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onDateClick,
  onPostClick,
  draggedPost,
  onDragStart,
  onDragEnd,
  onUpdatePost,
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={() => {
          /* TODO: Implement month navigation */
        }}
        onNextMonth={() => {
          /* TODO: Implement month navigation */
        }}
      />

      <CalendarGrid
        posts={posts}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onDateClick={onDateClick}
        onPostClick={onPostClick}
        draggedPost={draggedPost}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onUpdatePost={onUpdatePost}
      />
    </div>
  );
};
