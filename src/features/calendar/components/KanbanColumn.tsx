import React from "react";
import {
  Plus,
  MoreHorizontal,
  Calendar as CalendarIcon,
  ArrowUpRight,
} from "lucide-react";
import { Post } from "@/types";
import { getPlatformIcon, getPlatformColor } from "../utils/platformIcons";

interface ColumnConfig {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

interface KanbanColumnProps {
  column: ColumnConfig;
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  posts,
  onPostClick,
}) => {
  const getColumnDotColor = () => {
    switch (column.id) {
      case "draft":
        return "bg-slate-400";
      case "pending_review":
        return "bg-amber-500";
      case "scheduled":
        return "bg-indigo-500";
      case "published":
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getColumnDotColor()}`} />
          <h3 className="font-bold text-slate-700 dark:text-slate-200">
            {column.label}
          </h3>
          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">
            {posts.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Card List */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onPostClick(post)}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex -space-x-1">
                {post.platforms.map((p) => (
                  <div
                    key={p}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 ${getPlatformColor(p)}`}
                  >
                    {getPlatformIcon(p, "w-3 h-3 text-white")}
                  </div>
                ))}
              </div>
              <button className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-3 mb-3 font-medium">
              {post.content}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {post.scheduledDate}
              </div>
              {post.status === "published" && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  4.2%
                </div>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
};
