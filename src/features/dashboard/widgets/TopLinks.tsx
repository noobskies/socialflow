import React from "react";
import { Link as LinkIcon } from "lucide-react";

const links = [
  { name: "Summer Sale", clicks: 1240, url: "sfl.ai/smr24" },
  { name: "Bio Link", clicks: 856, url: "sfl.ai/alex" },
  { name: "New Blog", clicks: 432, url: "sfl.ai/blog2" },
];

export const TopLinks: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
        <LinkIcon className="w-5 h-5 mr-2 text-slate-400" />
        Top Active Links
      </h3>
      <div className="space-y-5">
        {links.map((link, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {link.name}
              </p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400">
                {link.url}
              </p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-slate-900 dark:text-white">
                {link.clicks}
              </span>
              <span className="text-[10px] text-slate-400 uppercase">
                Clicks
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
        View All Links
      </button>
    </div>
  );
};
