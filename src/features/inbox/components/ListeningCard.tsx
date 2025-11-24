import React from "react";
import { ListeningResult } from "@/types";
import {
  getPlatformIcon,
  getPlatformColor,
} from "@/features/calendar/utils/platformIcons";
import { getSentimentIcon } from "../utils/sentimentUtils";

interface ListeningCardProps {
  item: ListeningResult;
}

export const ListeningCard: React.FC<ListeningCardProps> = ({ item }) => {
  const platformColor = getPlatformColor(item.platform);

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${platformColor}`}>
            {getPlatformIcon(item.platform, "w-3 h-3 text-white")}
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {item.author}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
          {getSentimentIcon(item.sentiment)}
          <span className="capitalize text-slate-600 dark:text-slate-400">
            {item.sentiment}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-3">
        {item.content.split(" ").map((word, i) =>
          word.toLowerCase().includes(item.keyword.toLowerCase()) ||
          word.includes(item.keyword) ? (
            <span
              key={i}
              className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-medium px-0.5 rounded"
            >
              {word}{" "}
            </span>
          ) : (
            word + " "
          )
        )}
      </p>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{item.timestamp}</span>
        <span className="font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Keyword: {item.keyword}
        </span>
      </div>
    </div>
  );
};
