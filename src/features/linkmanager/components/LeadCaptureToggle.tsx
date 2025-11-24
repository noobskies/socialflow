import React from "react";
import { Mail } from "lucide-react";
import { BioPageConfig } from "@/types";

interface LeadCaptureToggleProps {
  config: BioPageConfig;
  onConfigChange: (updates: Partial<BioPageConfig>) => void;
}

export const LeadCaptureToggle: React.FC<LeadCaptureToggleProps> = ({
  config,
  onConfigChange,
}) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
            Lead Capture Form
          </h3>
        </div>
        <button
          onClick={() =>
            onConfigChange({ enableLeadCapture: !config.enableLeadCapture })
          }
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            config.enableLeadCapture
              ? "bg-indigo-600"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              config.enableLeadCapture ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {config.enableLeadCapture && (
        <div>
          <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">
            Call to Action Text
          </label>
          <input
            type="text"
            value={config.leadCaptureText}
            onChange={(e) =>
              onConfigChange({ leadCaptureText: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
};
