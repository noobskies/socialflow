import React from "react";
import { SocialAccount, ToastType, Platform } from "@/types";
import { Check, ExternalLink } from "lucide-react";

interface AccountsTabProps {
  accounts: SocialAccount[];
  onToggleConnection: (id: string, isConnected: boolean) => void;
  connectingId: string | null;
  showToast: (message: string, type: ToastType) => void;
}

interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: "𝕏",
    color: "bg-black dark:bg-white",
    description: "Share updates and engage with your audience",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "in",
    color: "bg-blue-700",
    description: "Professional networking and B2B content",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "bg-gradient-to-br from-purple-600 to-pink-600",
    description: "Visual storytelling and brand awareness",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "f",
    color: "bg-blue-600",
    description: "Reach a broad audience with diverse content",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "♫",
    color: "bg-black",
    description: "Short-form video content for younger demographics",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶",
    color: "bg-red-600",
    description: "Long-form video content and tutorials",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: "P",
    color: "bg-red-500",
    description: "Visual discovery and inspiration",
  },
];

export const AccountsTab: React.FC<AccountsTabProps> = ({
  accounts,
  onToggleConnection,
  connectingId,
  showToast,
}) => {
  const handleConnect = (platform: Platform) => {
    // Redirect to OAuth authorization
    window.location.href = `/api/oauth/${platform}/authorize`;
  };

  const handleDisconnect = async (accountId: string) => {
    if (
      !confirm(
        "Are you sure you want to disconnect this account? You'll need to reconnect to post to this platform."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/oauth/disconnect/${accountId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      onToggleConnection(accountId, false);
      showToast("Account disconnected successfully", "success");
    } catch (error) {
      console.error("Error disconnecting account:", error);
      showToast("Failed to disconnect account", "error");
    }
  };

  const getAccountForPlatform = (
    platform: Platform
  ): SocialAccount | undefined => {
    return accounts.find((acc) => acc.platform === platform);
  };

  const formatLastSync = (date?: Date | string) => {
    if (!date) return "Never";
    const lastSync = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Connected Accounts
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Connect your social media accounts to start posting. Pro plan allows
            up to 10 accounts.
          </p>
        </div>

        <div className="space-y-3">
          {PLATFORMS.map((platform) => {
            const account = getAccountForPlatform(platform.id);
            const isConnected = account?.connected;
            const isConnecting = connectingId === account?.id;

            return (
              <div
                key={platform.id}
                className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Platform Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white text-xl font-bold shadow-sm flex-shrink-0`}
                >
                  {platform.icon}
                </div>

                {/* Platform Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {platform.name}
                    </h3>
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                        <Check className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>

                  {isConnected && account ? (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        @{account.username || account.displayName}
                      </p>
                      <span className="text-slate-300 dark:text-slate-700">
                        •
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Last synced {formatLastSync(account.lastChecked)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {platform.description}
                    </p>
                  )}
                </div>

                {/* Connect/Disconnect Button */}
                <div className="flex-shrink-0">
                  {isConnected && account ? (
                    <button
                      onClick={() => handleDisconnect(account.id)}
                      disabled={isConnecting}
                      className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? "Disconnecting..." : "Disconnect"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Connected Accounts
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {accounts.filter((a) => a.connected).length} / 7 platforms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
