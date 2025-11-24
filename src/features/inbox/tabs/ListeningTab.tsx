import React from "react";
import { Activity } from "lucide-react";
import { ListeningResult } from "@/types";
import { ListeningCard } from "../components/ListeningCard";

interface ListeningTabProps {
  items: ListeningResult[];
}

export const ListeningTab: React.FC<ListeningTabProps> = ({ items }) => {
  return (
    <div className="p-2 space-y-2">
      <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Monitored Keywords
      </div>
      {items.map((item) => (
        <ListeningCard key={item.id} item={item} />
      ))}
      <button className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center justify-center">
        <Activity className="w-4 h-4 mr-2" />
        Monitor New Keyword
      </button>
    </div>
  );
};
