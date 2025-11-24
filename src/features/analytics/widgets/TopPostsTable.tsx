import React from "react";
import { Eye, ThumbsUp, TrendingUp, RefreshCw } from "lucide-react";
import { Draft, ToastType, Platform } from "@/types";

interface TopPost {
  id: number;
  content: string;
  platform: string;
  impressions: string;
  engagement: string;
  ctr: string;
  date: string;
}

const MOCK_TOP_POSTS: TopPost[] = [
  {
    id: 1,
    content: "Excited to announce our Series B funding! 🚀 #startup #growth",
    platform: "linkedin",
    impressions: "45.2K",
    engagement: "3.8K",
    ctr: "12.5%",
    date: "Oct 12",
  },
  {
    id: 2,
    content: "5 ways to improve your workflow today 🧵",
    platform: "twitter",
    impressions: "12.1K",
    engagement: "850",
    ctr: "5.2%",
    date: "Oct 15",
  },
  {
    id: 3,
    content: "Summer vibes at the office ☀️🍕",
    platform: "instagram",
    impressions: "28.4K",
    engagement: "2.1K",
    ctr: "8.1%",
    date: "Oct 10",
  },
  {
    id: 4,
    content: "New Tutorial: Getting Started with AI",
    platform: "youtube",
    impressions: "15.6K",
    engagement: "1.2K",
    ctr: "15.3%",
    date: "Oct 18",
  },
];

interface TopPostsTableProps {
  showToast: (message: string, type: ToastType) => void;
  onCompose?: (draft: Draft) => void;
}

export const TopPostsTable: React.FC<TopPostsTableProps> = ({
  showToast,
  onCompose,
}) => {
  const handleRecycle = (post: TopPost) => {
    if (onCompose) {
      onCompose({
        content: post.content,
        platforms: [post.platform as Platform],
        status: "draft",
      });
      showToast("Post content recycled to composer!", "success");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Top Performing Content
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-4 pl-6">Post Content</th>
              <th className="py-4">Platform</th>
              <th className="py-4">Impressions</th>
              <th className="py-4">Engagement</th>
              <th className="py-4">CTR / ROI</th>
              <th className="py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {MOCK_TOP_POSTS.map((post) => (
              <tr
                key={post.id}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-4 pl-6 max-w-xs">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {post.content}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {post.date}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      post.platform === "linkedin"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        : post.platform === "twitter"
                          ? "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300"
                          : post.platform === "instagram"
                            ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {post.platform}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <Eye className="w-4 h-4 mr-2 text-slate-400" />
                    {post.impressions}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 font-medium">
                    <ThumbsUp className="w-4 h-4 mr-2 text-slate-400" />
                    {post.engagement}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {post.ctr}
                  </div>
                </td>
                <td className="py-4 pr-6 text-right">
                  <button
                    onClick={() => handleRecycle(post)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs flex items-center justify-end ml-auto"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Recycle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 text-center">
        <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          View Full Analytics
        </button>
      </div>
    </div>
  );
};
