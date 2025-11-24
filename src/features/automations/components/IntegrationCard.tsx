import React from "react";
import { ShoppingBag, Slack, Globe, Mail, CheckCircle2 } from "lucide-react";
import { Integration } from "@/types";

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (id: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onToggle,
}) => {
  const getIcon = () => {
    switch (integration.icon) {
      case "shopping-bag":
        return <ShoppingBag className="w-8 h-8" />;
      case "slack":
        return <Slack className="w-8 h-8" />;
      case "globe":
        return <Globe className="w-8 h-8" />;
      case "mail":
        return <Mail className="w-8 h-8" />;
      default:
        return <Globe className="w-8 h-8" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-all">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
          integration.connected
            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
        }`}
      >
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {integration.name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mb-6">
        {integration.category}
      </p>

      <button
        onClick={() => onToggle(integration.id)}
        className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
          integration.connected
            ? "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {integration.connected ? "Manage Connection" : "Connect App"}
      </button>

      {integration.connected && (
        <div className="absolute top-4 right-4 text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
