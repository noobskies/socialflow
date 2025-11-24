import React from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  PenSquare,
  Download,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { MediaAsset } from "@/types";

interface AssetCardProps {
  asset: MediaAsset;
  onUse: (asset: MediaAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onUse }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Preview Area */}
      <div className="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
        {asset.type === "image" || asset.type === "video" ? (
          <>
            <Image
              src={asset.url || "/placeholder-image.png"}
              alt={asset.name}
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-300"
              unoptimized
            />
            {asset.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Video className="w-5 h-5 text-slate-900 ml-1" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col">
            <FileText className="w-8 h-8 text-indigo-400 mb-3" />
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium">
              {asset.content}
            </p>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onUse(asset)}
            className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
            title="Use in Composer"
          >
            <PenSquare className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-white rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {asset.type === "image" && (
                <ImageIcon className="w-4 h-4 text-slate-400" />
              )}
              {asset.type === "video" && (
                <Video className="w-4 h-4 text-slate-400" />
              )}
              {asset.type === "template" && (
                <FileText className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                {asset.type}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <h3
            className="font-semibold text-slate-900 dark:text-white truncate mb-1 text-sm"
            title={asset.name}
          >
            {asset.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
          Added {asset.createdAt}
        </p>
      </div>
    </div>
  );
};
