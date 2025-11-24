import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Post, SocialAccount } from "@/types";

interface OnboardingProgressProps {
  posts: Post[];
  accounts: SocialAccount[];
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  posts,
  accounts,
}) => {
  const connectedAccountsCount = accounts.filter((a) => a.connected).length;

  const onboardingSteps = [
    {
      id: 1,
      label: "Connect a social account",
      completed: connectedAccountsCount > 0,
    },
    { id: 2, label: "Create your first post", completed: posts.length > 0 },
    { id: 3, label: "Setup your Link in Bio", completed: false },
    { id: 4, label: "Invite a team member", completed: false },
  ];

  const completedSteps = onboardingSteps.filter((s) => s.completed).length;
  const progress = (completedSteps / onboardingSteps.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Getting Started
            </h3>
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 max-w-md">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {onboardingSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    step.completed
                      ? "text-slate-700 dark:text-slate-300"
                      : "text-slate-500 dark:text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button className="shrink-0 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200 dark:shadow-none">
          Continue Setup
        </button>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 dark:from-indigo-900/20 to-transparent opacity-50 rounded-bl-full pointer-events-none" />
    </div>
  );
};
