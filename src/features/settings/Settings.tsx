import React from "react";
import { useSettings } from "./useSettings";
import { SettingsSidebar } from "./SettingsSidebar";
import { ProfileTab } from "./tabs/ProfileTab";
import { AccountsTab } from "./tabs/AccountsTab";
import { TeamTab } from "./tabs/TeamTab";
import { BillingTab } from "./tabs/BillingTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { BrandingTab } from "./tabs/BrandingTab";
import { DeveloperTab } from "./tabs/DeveloperTab";
import { SocialAccount, BrandingConfig, ToastType, PlanTier } from "@/types";
import { MOCK_TEAM } from "@/utils/constants";

interface SettingsProps {
  showToast: (message: string, type: ToastType) => void;
  branding: BrandingConfig;
  setBranding: (branding: BrandingConfig) => void;
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
  accounts: SocialAccount[];
  onToggleConnection: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  showToast,
  branding,
  setBranding,
  userPlan,
  onOpenUpgrade,
  accounts,
  onToggleConnection,
}) => {
  const settings = useSettings(MOCK_TEAM);

  const handleSave = (section: string) => {
    showToast(`${section} saved successfully!`, "success");
  };

  const handleConnectionToggle = (id: string, isConnected: boolean) => {
    if (isConnected) {
      onToggleConnection(id);
      showToast("Account disconnected", "info");
    } else {
      settings.setConnectingId(id);
      setTimeout(() => {
        onToggleConnection(id);
        settings.setConnectingId(null);
        showToast("Account connected successfully!", "success");
      }, 1500);
    }
  };

  const renderContent = () => {
    switch (settings.activeTab) {
      case "profile":
        return <ProfileTab onSave={handleSave} showToast={showToast} />;

      case "accounts":
        return (
          <AccountsTab
            accounts={accounts}
            onToggleConnection={handleConnectionToggle}
            connectingId={settings.connectingId}
            showToast={showToast}
          />
        );

      case "team":
        return (
          <TeamTab
            userPlan={userPlan}
            onOpenUpgrade={onOpenUpgrade}
            team={settings.team}
            setTeam={settings.setTeam}
          />
        );

      case "billing":
        return <BillingTab userPlan={userPlan} onOpenUpgrade={onOpenUpgrade} />;

      case "notifications":
        return (
          <NotificationsTab
            notifications={settings.notifications}
            onToggleNotification={settings.handleToggleNotification}
          />
        );

      case "security":
        return (
          <SecurityTab
            security={settings.security}
            onToggleSecurity={settings.handleToggleSecurity}
          />
        );

      case "branding":
        return (
          <BrandingTab
            userPlan={userPlan}
            onOpenUpgrade={onOpenUpgrade}
            branding={branding}
            setBranding={setBranding}
          />
        );

      case "developer":
        return (
          <DeveloperTab userPlan={userPlan} onOpenUpgrade={onOpenUpgrade} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="flex flex-col md:flex-row gap-8 h-full">
        <SettingsSidebar
          activeTab={settings.activeTab}
          onTabChange={settings.setActiveTab}
          userPlan={userPlan}
        />

        <div className="flex-1 min-w-0 overflow-y-auto pb-20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
