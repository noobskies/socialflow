import React from "react";
import { Plus } from "lucide-react";
import { SocialAccount, ToastType } from "@/types";
import { AccountCard } from "../widgets/AccountCard";

interface AccountsTabProps {
  accounts: SocialAccount[];
  onToggleConnection: (id: string, isConnected: boolean) => void;
  connectingId: string | null;
  showToast: (message: string, type: ToastType) => void;
}

export const AccountsTab: React.FC<AccountsTabProps> = ({
  accounts,
  onToggleConnection,
  connectingId,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Connected Accounts
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage your social media connections. Pro plan allows up to 10
              accounts.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </button>
        </div>

        <div className="space-y-4">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onToggle={onToggleConnection}
              isConnecting={connectingId === account.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
