import React from "react";
import { ShortLink } from "@/types";
import { LinkRow } from "./LinkRow";

interface LinksTableProps {
  links: ShortLink[];
  onCopy: (shortCode: string) => void;
}

export const LinksTable: React.FC<LinksTableProps> = ({ links, onCopy }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50">
              <th className="py-4 pl-6">Link Details</th>
              <th className="py-4">Short URL</th>
              <th className="py-4">Clicks</th>
              <th className="py-4">Date</th>
              <th className="py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {links.map((link) => (
              <LinkRow key={link.id} link={link} onCopy={onCopy} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
