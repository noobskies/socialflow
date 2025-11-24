import React from "react";
import {
  User,
  Share2,
  Users,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Code,
  Lock,
} from "lucide-react";
import { PlanTier } from "@/types";

type SettingsTab =
  | "profile"
  | "accounts"
  | "team"
  | "billing"
  | "notifications"
  | "security"
  | "branding"
  | "developer";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  userPlan: PlanTier;
}

const NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "accounts", label: "Social Accounts", icon: Share2 },
  { id: "team", label: "Team Members", icon: Users, requiresAgency: true },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Login", icon: Shield },
  { id: "branding", label: "Branding", icon: Palette, requiresAgency: true },
  {
    id: "developer",
    label: "Developer API",
    icon: Code,
    requiresAgency: true,
  },
] as const;

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange,
  userPlan,
}) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isLocked =
            "requiresAgency" in item &&
            item.requiresAgency &&
            userPlan !== "agency";

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as SettingsTab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 ${
                    activeTab === item.id
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
