import React from "react";
import { NotificationToggle } from "../widgets/NotificationToggle";

interface NotificationSettings {
  emailDigest: boolean;
  postSuccess: boolean;
  postFailure: boolean;
  mentions: boolean;
  newFollowers: boolean;
  marketing: boolean;
}

interface NotificationsTabProps {
  notifications: NotificationSettings;
  onToggleNotification: (key: keyof NotificationSettings) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  onToggleNotification,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Notification Preferences
        </h2>

        <div className="space-y-6">
          <NotificationToggle
            title="Email Digest"
            description="Receive a weekly summary of your performance and upcoming posts."
            enabled={notifications.emailDigest}
            onToggle={() => onToggleNotification("emailDigest")}
          />

          <NotificationToggle
            title="Post Publishing"
            description="Get notified when a scheduled post goes live or fails."
            enabled={notifications.postSuccess}
            onToggle={() => onToggleNotification("postSuccess")}
          />

          <NotificationToggle
            title="Mentions & Comments"
            description="Alert me when someone mentions my brand or comments on a post."
            enabled={notifications.mentions}
            onToggle={() => onToggleNotification("mentions")}
          />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Marketing Updates
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Receive news about new features and promotions.
              </p>
            </div>
            <button
              onClick={() => onToggleNotification("marketing")}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notifications.marketing
                  ? "bg-indigo-600"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications.marketing ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
