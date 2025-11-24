import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureGateOverlayProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  upgradeButtonText?: string;
  onUpgrade: () => void;
}

export const FeatureGateOverlay: React.FC<FeatureGateOverlayProps> = ({
  icon: Icon,
  title,
  description,
  ctaText,
  upgradeButtonText,
  onUpgrade,
}) => {
  const buttonText = upgradeButtonText || ctaText || "Upgrade to Pro";
  return (
    <div className="absolute inset-0 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 rounded-2xl">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>
      <button
        onClick={onUpgrade}
        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
      >
        {buttonText}
      </button>
    </div>
  );
};
