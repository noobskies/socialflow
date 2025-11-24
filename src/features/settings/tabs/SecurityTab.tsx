import React from "react";
import { Shield, Fingerprint, Key, Activity, LogOut } from "lucide-react";
import { SecurityToggle } from "../widgets/SecurityToggle";
import { AuditLogTable } from "../widgets/AuditLogTable";

interface SecuritySettings {
  twoFactor: boolean;
  sso: boolean;
}

interface SecurityTabProps {
  security: SecuritySettings;
  onToggleSecurity: (key: keyof SecuritySettings) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  security,
  onToggleSecurity,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Authentication */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Authentication
        </h2>

        <div className="space-y-6">
          <SecurityToggle
            icon={Fingerprint}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account."
            enabled={security.twoFactor}
            onToggle={() => onToggleSecurity("twoFactor")}
          />

          <SecurityToggle
            icon={Key}
            title="Single Sign-On (SSO)"
            description="Login with your corporate identity provider."
            enabled={security.sso}
            locked={true}
            badge="ENTERPRISE"
          />
        </div>
      </div>

      {/* Active Sessions / Audit */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Audit Log
        </h2>
        <AuditLogTable />
      </div>

      <div className="flex justify-center">
        <button className="flex items-center text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium text-sm px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out of all devices
        </button>
      </div>
    </div>
  );
};
