import React from "react";
import { Post } from "@/types";
import { getPlatformIcon } from "../utils/platformIcons";

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  onDragStart?: (e: React.DragEvent, post: Post) => void;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  onDragStart,
  compact = false,
}) => {
  const getStatusColor = () => {
    switch (post.status) {
      case "published":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400";
      case "scheduled":
        return "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400";
      case "pending_review":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400";
      default:
        return "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart ? (e) => onDragStart(e, post) : undefined}
      onClick={() => onClick(post)}
      className={`p-2 rounded-md border text-xs flex flex-col gap-1 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm ${getStatusColor()}`}
    >
      <div className="flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1">
          {post.platforms.slice(0, compact ? 2 : 3).map((p) => (
            <span key={p} className="flex">
              {getPlatformIcon(p)}
            </span>
          ))}
          {post.platforms.length > (compact ? 2 : 3) && (
            <span className="text-[8px]">+</span>
          )}
        </div>
        <span className="font-semibold ml-1 opacity-75">{post.time}</span>
      </div>
      <span className="truncate opacity-90 pointer-events-none">
        {post.content}
      </span>
    </div>
  );
};
