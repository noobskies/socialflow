import React from "react";
import { X, Archive, Clock, Repeat } from "lucide-react";
import { Bucket } from "@/types";

interface BucketModalProps {
  bucket: Bucket | null;
  onClose: () => void;
  onSave: () => void;
}

export const BucketModal: React.FC<BucketModalProps> = ({
  bucket,
  onClose,
  onSave,
}) => {
  if (!bucket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <Archive className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Configure Queue
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bucket Name
            </label>
            <input
              type="text"
              value={bucket.name}
              readOnly
              className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            />
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" /> Posting Schedule
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
                <span>Mondays</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  09:00 AM
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-indigo-100 dark:border-indigo-900/50">
                <span>Wednesdays</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  02:30 PM
                </span>
              </div>
            </div>
            <button className="mt-3 w-full py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              + Add Time Slot
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Repeat className="w-4 h-4" />
            <span>Recycle posts after publishing?</span>
            <input
              type="checkbox"
              defaultChecked
              className="ml-auto w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
