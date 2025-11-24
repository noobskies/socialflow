import React from "react";

interface NotificationToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  enabled,
  onToggle,
}) => {
  return (
    <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          {description}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
