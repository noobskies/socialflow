import React from "react";
import { Instagram, Pin } from "lucide-react";
import { Platform, PlatformOptions as PlatformOptionsType } from "@/types";

interface PlatformOptionsProps {
  selectedPlatforms: Platform[];
  options: PlatformOptionsType;
  onChange: (options: PlatformOptionsType) => void;
}

export const PlatformOptions: React.FC<PlatformOptionsProps> = ({
  selectedPlatforms,
  options,
  onChange,
}) => {
  const showInstagram = selectedPlatforms.includes("instagram");
  const showPinterest = selectedPlatforms.includes("pinterest");

  if (!showInstagram && !showPinterest) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Platform Options
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showInstagram && (
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-pink-600 dark:text-pink-400">
              <Instagram className="w-3 h-3 mr-1.5" /> Instagram First Comment
            </label>
            <textarea
              placeholder="Add hashtags here to keep your caption clean..."
              value={options.instagram?.firstComment || ""}
              onChange={(e) =>
                onChange({
                  ...options,
                  instagram: {
                    ...options.instagram,
                    firstComment: e.target.value,
                  },
                })
              }
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-20 resize-none"
            />
          </div>
        )}
        {showPinterest && (
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-red-600 dark:text-red-400">
              <Pin className="w-3 h-3 mr-1.5" /> Destination Link
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={options.pinterest?.destinationLink || ""}
              onChange={(e) =>
                onChange({
                  ...options,
                  pinterest: {
                    ...options.pinterest,
                    destinationLink: e.target.value,
                  },
                })
              }
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformOptions;
