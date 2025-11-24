import React from "react";
import Image from "next/image";
import {
  X,
  Calendar as CalendarIcon,
  Eye,
  MousePointer2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Post, Draft } from "@/types";
import { getPlatformIcon, getPlatformColor } from "../utils/platformIcons";

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onEdit: (draft: Draft) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onEdit,
}) => {
  const handleEdit = () => {
    onClose();
    onEdit({
      content: post.content,
      platforms: post.platforms,
      scheduledDate: post.scheduledDate,
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType,
      status: post.status === "published" ? "draft" : post.status,
      poll: post.poll,
    });
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
            Post Details
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {post.platforms.map((p) => (
                <div
                  key={p}
                  className={`p-2 rounded-lg ${getPlatformColor(p)} text-white shadow-sm`}
                >
                  {getPlatformIcon(p, "w-4 h-4")}
                </div>
              ))}
              <div className="flex flex-col ml-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  {post.platforms.join(", ")}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {post.scheduledDate} • {post.time}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                post.status === "published"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : post.status === "scheduled"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                    : post.status === "pending_review"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {post.status.replace("_", " ")}
            </span>
          </div>

          {/* Content Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap mb-6 shadow-inner">
            {post.content}
            {post.poll && (
              <div className="mt-4 space-y-2">
                {post.poll.options.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-xs bg-white dark:bg-slate-900"
                  >
                    <span>{opt}</span>
                    <span className="text-slate-400">0%</span>
                  </div>
                ))}
                <div className="text-xs text-slate-400 text-center mt-2">
                  {post.poll.duration} days remaining
                </div>
              </div>
            )}
          </div>

          {post.mediaUrl && (
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-64 bg-slate-100 dark:bg-slate-800 relative">
              <Image
                src={post.mediaUrl}
                alt="Post Media"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          {/* Post-Level Analytics (Only for Published) */}
          {post.status === "published" && (
            <div className="mb-2 animate-in fade-in slide-in-from-bottom-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Performance Insights
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center text-slate-400 mb-1">
                    <Eye className="w-3 h-3 mr-1" />
                    <span className="text-[10px] font-semibold uppercase">
                      Impressions
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    1,240
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center text-slate-400 mb-1">
                    <MousePointer2 className="w-3 h-3 mr-1" />
                    <span className="text-[10px] font-semibold uppercase">
                      Clicks
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    85
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center text-slate-400 mb-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span className="text-[10px] font-semibold uppercase">
                      CTR
                    </span>
                  </div>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    6.8%
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2">
                <ArrowUpRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-800 dark:text-indigo-200">
                  This post is performing <strong>24% better</strong> than your
                  average {post.platforms[0]} post.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3">
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            {post.status === "published" ? "Duplicate" : "Edit Post"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
