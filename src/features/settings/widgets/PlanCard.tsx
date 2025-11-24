import React from "react";
import { PlanTier } from "@/types";

interface PlanCardProps {
  userPlan: PlanTier;
  onOpenUpgrade: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  userPlan,
  onOpenUpgrade,
}) => {
  return (
    <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
            Current Plan
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-2 capitalize">{userPlan} Plan</h2>
        <p className="text-indigo-200 max-w-xl mb-6">
          Manage your subscription and billing details.
        </p>

        <button
          onClick={onOpenUpgrade}
          className="px-6 py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Change Plan
        </button>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
    </div>
  );
};
