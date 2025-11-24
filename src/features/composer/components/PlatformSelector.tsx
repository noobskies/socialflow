import React from "react";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Video,
  Pin,
  CheckCircle2,
} from "lucide-react";
import { Platform } from "@/types";

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onToggle: (platform: Platform) => void;
}

const platforms: { id: Platform; icon: React.ElementType; color: string }[] = [
  { id: "twitter", icon: Twitter, color: "bg-sky-500" },
  { id: "linkedin", icon: Linkedin, color: "bg-blue-700" },
  { id: "facebook", icon: Facebook, color: "bg-blue-600" },
  { id: "instagram", icon: Instagram, color: "bg-pink-600" },
  { id: "tiktok", icon: Video, color: "bg-black" },
  { id: "youtube", icon: Youtube, color: "bg-red-600" },
  { id: "pinterest", icon: Pin, color: "bg-red-500" },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onToggle,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-wrap gap-3">
        {platforms.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPlatforms.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? `${p.color} text-white border-transparent shadow-md scale-105`
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="capitalize font-medium text-sm">{p.id}</span>
              {isSelected && (
                <CheckCircle2 className="w-3 h-3 ml-1 text-white/90" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;
