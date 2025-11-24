import React from "react";
import { Code, Copy, RefreshCw } from "lucide-react";
import { PlanTier } from "@/types";
import { FeatureGateOverlay } from "@/components/ui/FeatureGateOverlay";

interface DeveloperTabProps {
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
}

export const DeveloperTab: React.FC<DeveloperTabProps> = ({
  userPlan,
  onOpenUpgrade,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {userPlan !== "agency" && (
        <FeatureGateOverlay
          icon={Code}
          title="Developer API Locked"
          description="Access our REST API and Webhooks to build custom integrations and workflows with the Agency plan."
          onUpgrade={onOpenUpgrade}
          upgradeButtonText="Upgrade to Agency"
        />
      )}
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 ${
          userPlan !== "agency"
            ? "opacity-50 pointer-events-none select-none"
            : ""
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Developer Settings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage API keys and webhook endpoints for custom integrations.
            </p>
          </div>
          <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
            AGENCY ONLY
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Production Key
              </h3>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </button>
                <button className="text-xs px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </button>
              </div>
            </div>
            <code className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 block">
              pk_live_1234567890abcdef1234567890abcdef
            </code>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Test Key
              </h3>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </button>
                <button className="text-xs px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </button>
              </div>
            </div>
            <code className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 block">
              pk_test_0987654321fedcba0987654321fedcba
            </code>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
            Webhook Endpoints
          </h3>
          <div className="space-y-2">
            <input
              type="url"
              placeholder="https://your-server.com/webhooks/socialflow"
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              Save Webhook URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
