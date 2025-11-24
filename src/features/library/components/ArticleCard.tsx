import React from "react";
import Image from "next/image";
import { Zap, ExternalLink, Loader2 } from "lucide-react";
import { RSSArticle } from "@/types";

interface ArticleCardProps {
  article: RSSArticle;
  onUse: (article: RSSArticle) => void;
  isGenerating: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onUse,
  isGenerating,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
      <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
            {article.source}
          </span>
          <span className="text-xs text-slate-400">{article.publishedAt}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
          {article.snippet}
        </p>
        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onUse(article)}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-75"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Create AI Post"}
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
