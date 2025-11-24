import React from "react";
import { Crown } from "lucide-react";
import { PlanTier, BrandingConfig } from "@/types";
import { FeatureGateOverlay } from "@/components/ui/FeatureGateOverlay";

interface BrandingTabProps {
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  branding: BrandingConfig;
  setBranding: (branding: BrandingConfig) => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({
  userPlan,
  onOpenUpgrade,
  branding,
  setBranding,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {userPlan !== "agency" && (
        <FeatureGateOverlay
          icon={Crown}
          title="Agency Feature Locked"
          description="Upgrade to the Agency plan to remove SocialFlow branding and customize the platform with your own logo and colors."
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Branding & White-Labeling
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Customize the platform appearance for your clients.
            </p>
          </div>
          <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
            AGENCY ONLY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={branding.companyName}
                onChange={(e) =>
                  setBranding({ ...branding, companyName: e.target.value })
                }
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                value={branding.logoUrl}
                onChange={(e) =>
                  setBranding({ ...branding, logoUrl: e.target.value })
                }
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) =>
                  setBranding({ ...branding, primaryColor: e.target.value })
                }
                className="w-full h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Custom Domain
              </label>
              <input
                type="text"
                placeholder="app.yourcompany.com"
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
