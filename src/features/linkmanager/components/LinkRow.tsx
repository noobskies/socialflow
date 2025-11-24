import React from "react";
import { Copy, MoreHorizontal } from "lucide-react";
import { ShortLink } from "@/types";

interface LinkRowProps {
  link: ShortLink;
  onCopy: (shortCode: string) => void;
}

export const LinkRow: React.FC<LinkRowProps> = ({ link, onCopy }) => {
  return (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-4 pl-6">
        <div>
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            {link.title}
          </p>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">
            {link.originalUrl}
          </p>
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
            sfl.ai/{link.shortCode}
          </span>
          <button
            onClick={() => onCopy(`sfl.ai/${link.shortCode}`)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </td>
      <td className="py-4">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {link.clicks.toLocaleString()}
        </span>
      </td>
      <td className="py-4">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {link.createdAt}
        </span>
      </td>
      <td className="py-4 pr-6 text-right">
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
