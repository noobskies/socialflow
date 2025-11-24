import React from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Video,
  Pin,
  Check,
  Loader2,
} from "lucide-react";
import { SocialAccount } from "@/types";

interface AccountCardProps {
  account: SocialAccount;
  onToggle: (id: string, isConnected: boolean) => void;
  isConnecting: boolean;
}

const PLATFORM_CONFIG = {
  twitter: { color: "bg-sky-500", icon: Twitter },
  linkedin: { color: "bg-blue-700", icon: Linkedin },
  facebook: { color: "bg-blue-600", icon: Facebook },
  instagram: { color: "bg-pink-600", icon: Instagram },
  tiktok: { color: "bg-black", icon: Video },
  youtube: { color: "bg-red-600", icon: Youtube },
  pinterest: { color: "bg-red-500", icon: Pin },
};

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onToggle,
  isConnecting,
}) => {
  const config = PLATFORM_CONFIG[account.platform];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white capitalize">
            {account.platform}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {account.connected ? account.username : "Not connected"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {account.connected ? (
          <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-xs font-bold">
            <Check className="w-3 h-3 mr-1" /> Connected
          </span>
        ) : (
          <span className="flex items-center text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold">
            Disconnected
          </span>
        )}
        <button
          onClick={() => onToggle(account.id, account.connected)}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center min-w-[100px] justify-center ${
            account.connected
              ? "border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900"
              : "bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600"
          }`}
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : account.connected ? (
            "Disconnect"
          ) : (
            "Connect"
          )}
        </button>
      </div>
    </div>
  );
};
