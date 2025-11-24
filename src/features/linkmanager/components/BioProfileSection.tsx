import React from "react";
import Image from "next/image";
import { Sparkles, Loader2 } from "lucide-react";
import { BioPageConfig } from "@/types";

interface BioProfileSectionProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
  onGenerateBio: () => void;
  bioNiche: string;
  onBioNicheChange: (value: string) => void;
  isGenerating: boolean;
}

export const BioProfileSection: React.FC<BioProfileSectionProps> = ({
  config,
  onConfigChange,
  onGenerateBio,
  bioNiche,
  onBioNicheChange,
  isGenerating,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={config.avatar}
          alt="Avatar"
          width={64}
          height={64}
          className="rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover"
          unoptimized
        />
        <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          Change Image
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={config.displayName}
          onChange={(e) => onConfigChange({ displayName: e.target.value })}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Bio
          </label>
          <button
            onClick={onGenerateBio}
            disabled={isGenerating}
            className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            AI Reword
          </button>
        </div>
        <textarea
          value={config.bio}
          onChange={(e) => onConfigChange({ bio: e.target.value })}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none h-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Describe your niche for AI (e.g., Tech Reviewer)"
            value={bioNiche}
            onChange={(e) => onBioNicheChange(e.target.value)}
            className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
