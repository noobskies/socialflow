import { useState } from "react";
import { TeamMember } from "@/types";

type SettingsTab =
  | "profile"
  | "accounts"
  | "team"
  | "billing"
  | "notifications"
  | "security"
  | "branding"
  | "developer";

interface NotificationSettings {
  emailDigest: boolean;
  postSuccess: boolean;
  postFailure: boolean;
  mentions: boolean;
  newFollowers: boolean;
  marketing: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  sso: boolean;
}

export function useSettings(initialTeam: TeamMember[]) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailDigest: true,
    postSuccess: true,
    postFailure: true,
    mentions: true,
    newFollowers: false,
    marketing: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    sso: false,
  });

  const handleToggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleSecurity = (key: keyof SecuritySettings) => {
    setSecurity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    activeTab,
    setActiveTab,
    team,
    setTeam,
    connectingId,
    setConnectingId,
    notifications,
    handleToggleNotification,
    security,
    handleToggleSecurity,
  };
}
