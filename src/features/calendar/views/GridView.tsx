import React from "react";
import Image from "next/image";
import { Post, Draft } from "@/types";
import { LayoutGrid, Video, Plus } from "lucide-react";

interface GridViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onCompose: (draft?: Draft) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  posts,
  onPostClick,
  onCompose,
}) => {
  const gridPosts = posts.filter(
    (p) => p.platforms.includes("instagram") || p.mediaUrl
  );

  return (
    <div className="flex-1 flex justify-center animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border-8 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Phone Status Bar */}
        <div className="bg-white dark:bg-slate-900 px-6 py-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            9:41
          </span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-slate-900 dark:bg-white rounded-sm"></div>
            <div className="w-0.5 h-2.5 bg-slate-900 dark:bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Instagram Profile Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
              <Image
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&fit=crop"
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full border-2 border-white dark:border-slate-900 object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 flex justify-around text-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  128
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Posts
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  42.5K
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Followers
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  1.2K
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Following
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Alex Creator
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Digital Creator • Tech & Design
            </div>
            <div className="text-xs text-slate-900 dark:text-white mt-1">
              Building the future of social media tools. 👇
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
              sfl.ai/alex
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold py-1.5 rounded-md">
              Edit Profile
            </button>
            <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold py-1.5 rounded-md">
              Share Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button className="flex-1 py-2.5 border-b-2 border-slate-900 dark:border-white">
            <LayoutGrid className="w-5 h-5 mx-auto text-slate-900 dark:text-white" />
          </button>
          <button className="flex-1 py-2.5 border-b-2 border-transparent">
            <Video className="w-5 h-5 mx-auto text-slate-400" />
          </button>
        </div>

        {/* The Grid */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
          <div className="grid grid-cols-3 gap-0.5">
            {gridPosts.map((post) => (
              <div
                key={post.id}
                className="aspect-square relative bg-slate-100 dark:bg-slate-800 cursor-pointer group"
                onClick={() => onPostClick(post)}
              >
                {post.mediaUrl ? (
                  <>
                    <Image
                      src={post.mediaUrl}
                      alt="Post"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {post.mediaType === "video" && (
                      <div className="absolute top-1 right-1">
                        <Video className="w-4 h-4 text-white drop-shadow-md" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <span className="text-[10px] text-indigo-900 dark:text-indigo-200 font-medium line-clamp-3">
                      {post.content}
                    </span>
                  </div>
                )}

                {post.status !== "published" && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm uppercase">
                      {post.status === "draft" ? "Draft" : "Scheduled"}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Empty Slots for Planning */}
            {[1, 2, 3].map((i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => onCompose()}
              >
                <Plus className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
