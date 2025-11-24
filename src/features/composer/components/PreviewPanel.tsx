import React from "react";
import Image from "next/image";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Video,
  Pin,
  Play,
  Image as ImageIcon,
  PenTool,
} from "lucide-react";
import { Platform, PlatformOptions } from "@/types";

interface PreviewPanelProps {
  content: string;
  platforms: Platform[];
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  poll?: {
    options: string[];
    duration: number;
  };
  platformOptions: PlatformOptions;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  content,
  platforms,
  mediaUrl,
  mediaType,
  poll,
  platformOptions,
}) => {
  // Helper to split tweet threads
  const getTweetParts = (text: string) => {
    const MAX_LENGTH = 280;
    if (text.length <= MAX_LENGTH) return [text];

    const parts = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= MAX_LENGTH) {
        parts.push(remaining);
        break;
      }

      let splitIndex = remaining.lastIndexOf(" ", MAX_LENGTH);
      if (splitIndex === -1) splitIndex = MAX_LENGTH;

      parts.push(remaining.substring(0, splitIndex));
      remaining = remaining.substring(splitIndex).trim();
    }
    return parts;
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "twitter":
        return Twitter;
      case "linkedin":
        return Linkedin;
      case "facebook":
        return Facebook;
      case "instagram":
        return Instagram;
      case "tiktok":
        return Video;
      case "youtube":
        return Youtube;
      case "pinterest":
        return Pin;
      default:
        return Twitter;
    }
  };

  const getPlatformColor = (platform: Platform) => {
    switch (platform) {
      case "twitter":
        return "bg-sky-500";
      case "linkedin":
        return "bg-blue-700";
      case "facebook":
        return "bg-blue-600";
      case "instagram":
        return "bg-pink-600";
      case "tiktok":
        return "bg-black";
      case "youtube":
        return "bg-red-600";
      case "pinterest":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="sticky top-0 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Live Preview
        </h3>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
        </div>
      </div>

      <div className="space-y-6">
        {platforms.map((platform) => {
          const isTwitter = platform === "twitter";
          const tweetParts = isTwitter ? getTweetParts(content) : [content];
          const Icon = getPlatformIcon(platform);
          const colorClass = getPlatformColor(platform);

          return tweetParts.map((part, index) => (
            <div
              key={`${platform}-${index}`}
              className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${platform === "tiktok" || platform === "instagram" ? "rounded-2xl" : "rounded-xl"} ${index > 0 ? "mt-[-20px] border-t-0 rounded-t-none pt-6" : ""} relative z-${10 - index}`}
            >
              {/* Platform Header */}
              <div className="flex items-center space-x-3 p-4 border-b border-slate-50 dark:border-slate-800/50">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${colorClass}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    SocialFlow{" "}
                    {index > 0 && (
                      <span className="text-xs font-normal text-slate-400">
                        (Thread {index + 1}/{tweetParts.length})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Just now • <span className="capitalize">{platform}</span>
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 text-[15px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-normal">
                {part || (
                  <span className="text-slate-300 dark:text-slate-600 italic">
                    Start writing to see how your post will look...
                  </span>
                )}
              </div>

              {/* Poll Preview */}
              {poll && index === 0 && (
                <div className="mx-4 mb-4 space-y-2">
                  {poll.options.map((opt, i) => (
                    <div
                      key={i}
                      className="w-full border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 text-center"
                    >
                      {opt || `Option ${i + 1}`}
                    </div>
                  ))}
                  <div className="text-xs text-slate-400 text-center pt-1">
                    {poll.duration} days remaining
                  </div>
                </div>
              )}

              {/* Media Preview */}
              {mediaUrl && index === 0 && (
                <div
                  className={`${platform === "tiktok" || platform === "instagram" ? "aspect-[9/16] mx-4 mb-4" : "aspect-video w-full"} bg-black rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 relative`}
                >
                  {mediaType === "video" ? (
                    <>
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt="Post attachment"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
              )}

              {/* Placeholder for no media/poll */}
              {!mediaUrl && !poll && index === 0 && platforms.length === 1 && (
                <div className="mx-4 mb-4 h-40 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                  <ImageIcon className="w-6 h-6 opacity-50" />
                  <span className="text-xs font-medium">No media attached</span>
                </div>
              )}

              {/* Instagram First Comment */}
              {platform === "instagram" &&
                platformOptions.instagram?.firstComment &&
                index === 0 && (
                  <div className="px-4 pb-4 pt-0 text-sm">
                    <span className="font-bold text-slate-900 dark:text-white mr-2">
                      socialflow
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {platformOptions.instagram.firstComment}
                    </span>
                  </div>
                )}

              {/* Platform Footer */}
              <div className="px-4 py-3 border-t border-slate-50 dark:border-slate-800 flex justify-between text-slate-400 dark:text-slate-600">
                {platform === "twitter" ? (
                  <div className="flex w-full justify-between px-2">
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    <div className="flex gap-4">
                      <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                      <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ));
        })}
        {platforms.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <PenTool className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a platform above to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
