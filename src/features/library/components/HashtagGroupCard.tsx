import React from "react";
import { Hash, Trash2 } from "lucide-react";
import { HashtagGroup } from "@/types";

interface HashtagGroupCardProps {
  group: HashtagGroup;
  onUse: (group: HashtagGroup) => void;
  onDelete: (id: string) => void;
}

export const HashtagGroupCard: React.FC<HashtagGroupCardProps> = ({
  group,
  onUse,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            {group.name}
          </h3>
        </div>
        <button
          onClick={() => onDelete(group.id)}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {group.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onUse(group)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded transition-colors"
        >
          Use in Composer
        </button>
      </div>
    </div>
  );
};
