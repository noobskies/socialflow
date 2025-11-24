import React from "react";
import { Archive, MoreHorizontal, Repeat, CalendarCheck } from "lucide-react";
import { Bucket } from "@/types";

interface BucketCardProps {
  bucket: Bucket;
  onAutoSchedule: (bucket: Bucket) => void;
  onConfigure: (bucket: Bucket) => void;
}

export const BucketCard: React.FC<BucketCardProps> = ({
  bucket,
  onAutoSchedule,
  onConfigure,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-12 h-12 rounded-xl ${bucket.color} flex items-center justify-center text-white shadow-lg`}
        >
          <Archive className="w-6 h-6" />
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {bucket.name}
      </h3>
      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Repeat className="w-4 h-4 mr-2" />
        {bucket.schedule}
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onAutoSchedule(bucket)}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-100 dark:border-indigo-800"
        >
          <CalendarCheck className="w-4 h-4 mr-2" />
          Auto-Fill Calendar
        </button>
        <button
          onClick={() => onConfigure(bucket)}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
        >
          Configure Rules
        </button>
      </div>
    </div>
  );
};
