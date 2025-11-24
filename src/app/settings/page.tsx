"use client";

import Settings from "@/features/settings/Settings";
import { useAppContext } from "../_components/AppContext";

export default function SettingsPage() {
  const {
    showToast,
    branding,
    setBranding,
    userPlan,
    onOpenUpgrade,
    accounts,
    onToggleAccount,
  } = useAppContext();

  return (
    <Settings
      showToast={showToast}
      branding={branding}
      setBranding={setBranding}
      userPlan={userPlan}
      onOpenUpgrade={onOpenUpgrade}
      accounts={accounts}
      onToggleConnection={onToggleAccount}
    />
  );
}
