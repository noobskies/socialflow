import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface CrisisAlertProps {
  onDismiss: () => void;
}

export const CrisisAlert: React.FC<CrisisAlertProps> = ({ onDismiss }) => {
  return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-start justify-between animate-in slide-in-from-top-2 shadow-sm">
      <div className="flex gap-3">
        <div className="bg-rose-100 dark:bg-rose-900/50 p-2 rounded-lg shrink-0">
          <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="text-rose-800 dark:text-rose-200 font-bold">
            Negative Sentiment Spike Detected
          </h3>
          <p className="text-rose-600 dark:text-rose-300 text-sm mt-1">
            Unusually high negative mentions on Twitter regarding &quot;Server
            Downtime&quot;. Recommended action: Check Inbox.
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
