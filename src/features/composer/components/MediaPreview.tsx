import React from "react";
import Image from "next/image";
import { X, PenTool, Type, Play } from "lucide-react";

interface MediaPreviewProps {
  url: string;
  type: "image" | "video";
  altText?: string;
  onRemove: () => void;
  onEdit?: () => void;
  onEditAltText?: () => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  url,
  type,
  altText,
  onRemove,
  onEdit,
  onEditAltText,
}) => {
  return (
    <div className="px-6 pb-4 relative z-10">
      <div className="relative inline-block group/media">
        {type === "video" ? (
          <div className="h-32 w-32 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden bg-black flex items-center justify-center relative">
            <video src={url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-8 h-8 text-white opacity-80" />
            </div>
          </div>
        ) : (
          <Image
            src={url}
            alt={altText || "Generated asset"}
            width={128}
            height={128}
            className="object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
            unoptimized
          />
        )}

        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/media:opacity-100 transition-opacity">
          {type === "image" && onEditAltText && (
            <button
              onClick={onEditAltText}
              className="bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-full p-1 shadow-md border border-slate-100 dark:border-slate-700"
              title="Alt Text"
            >
              <Type className="w-3 h-3" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-500 rounded-full p-1 shadow-md border border-slate-100 dark:border-slate-700"
              title="Edit Media"
            >
              <PenTool className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="bg-white dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-100 dark:border-slate-700"
            title="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      {altText && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <Type className="w-3 h-3 mr-1" />
          <span className="truncate max-w-xs">ALT: {altText}</span>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;
