import React from "react";
import {
  CalendarClock,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import { Post, Draft } from "@/types";

interface UpcomingPostsProps {
  posts: Post[];
  onCompose: (draft: Draft) => void;
}

export const UpcomingPosts: React.FC<UpcomingPostsProps> = ({
  posts,
  onCompose,
}) => {
  const upcomingPosts = posts
    .filter((p) => p.status === "scheduled")
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.time || "00:00"}`);
      const dateB = new Date(`${b.scheduledDate}T${b.time || "00:00"}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <CalendarClock className="w-5 h-5 mr-2 text-slate-400" />
          Up Next
        </h3>
        <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
          View Calendar
        </button>
      </div>
      <div className="space-y-4">
        {upcomingPosts.length > 0 ? (
          upcomingPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  post.platforms.includes("instagram")
                    ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                    : post.platforms.includes("twitter")
                      ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {post.platforms.includes("instagram") && (
                  <Instagram className="w-4 h-4" />
                )}
                {post.platforms.includes("twitter") && (
                  <Twitter className="w-4 h-4" />
                )}
                {post.platforms.includes("linkedin") && (
                  <Linkedin className="w-4 h-4" />
                )}
                {!post.platforms.includes("instagram") &&
                  !post.platforms.includes("twitter") &&
                  !post.platforms.includes("linkedin") && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-1">
                  {post.content}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {post.scheduledDate} • {post.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
            No upcoming posts scheduled.
          </div>
        )}
      </div>
      <button
        onClick={() => onCompose({})}
        className="w-full mt-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        Schedule New Post
      </button>
    </div>
  );
};
